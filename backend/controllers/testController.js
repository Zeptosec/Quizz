const Task = require("../models/taskModel");
const mongoose = require("mongoose");
const Test = require('../models/testModel');
const { getAnswerPoints } = require('./taskController');

const newTest = async (uid) => {
    console.log("new test")
    let count = await Task.estimatedDocumentCount({});
    if (count == 0) {
        throw Error("There are currently no questions");
    }
    if (count > 10) {
        count = 10;
    }
    const tasks = await Task.aggregate([{ $sample: { size: count } }]);
    if (tasks.length === 0) {
        throw Error("There are no questions at the time");
    }
    const testQuestions = tasks.map(a => {
        return { id: a._id, answered: false, points: 0 };
    });
    let uuid = uid;
    if (!uuid) {
        uuid = new mongoose.Types.ObjectId();
    }
    const test = await Test.create({
        userid: uuid,
        tasks: testQuestions,
        finished: false,
        published: false,
        nickname: "N/A",
        score: 0
    });
    return { uuid, test };
}

const getQuestionFromTestTask = async (task) => {
    const q = await Task.findById(task.id);
    if (!q) {
        throw Error("Test question is missing");
    }
    return {
        qid: q._id,
        question: q.question,
        type: q.type,
        choices: q.choices
    };
}

const getTestTask = async (req, res) => {
    const { uid } = req.body;
    console.log(uid);
    if (!mongoose.Types.ObjectId.isValid(uid)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }
    if (!uid) { // if this user does not have an id
        try {
            // create new test for this user and assign a new user id
            const { test, uuid } = await newTest(null);
            const question = await getQuestionFromTestTask(test.tasks[0]);
            return res.status(200).json({ uid: uuid, task: question, finished: false, tid: test._id });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ error: err.message });
        }
    } else { // if user exists
        //trying to locate previous test
        const pt = await Test.find({ userid: uid }).where('finished').equals(false);
        const previousTest = pt[0];
        // if there is no such test
        if (!previousTest) {
            // create new test
            try {
                const { test } = await newTest(uid);
                const question = await getQuestionFromTestTask(test.tasks[0]);
                return res.status(200).json({ task: question, finished: false, tid: test._id });
            } catch (err) {
                console.log(err);
                res.status(400).json({ error: err.message });
            }
        } else { // if there was an unfinished test
            // find first unanswered question
            const task = previousTest.tasks.find(w => w.answered === false);
            if (!task) { // if all questions were answered
                // mark test as finished. Something like this shouldn't happen
                await Test.findByIdAndUpdate(previousTest._id, { finished: true });
                return res.status(200).json({ finished: true, tid: previousTest._id });
            } else {
                // return the first unanswered question on test
                try {
                    const question = await getQuestionFromTestTask(task);
                    return res.status(200).json({ task: question, finished: false, tid: previousTest._id });
                } catch (err) {
                    console.log(err);
                    return res.status(400).json({ error: err.message });
                }
            }
        }
    }
}

const postTestAnswer = async (req, res) => {
    const { answer, qid, tid } = req.body;

    if (!tid) {
        return res.status(400).json({ error: "Test id is required" });
    }
    if (!qid) {
        return res.status(400).json({ error: "Question id is required" });
    }
    if (!answer) {
        return res.status(400).json({ error: "Answer is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(tid)) {
        return res.status(400).json({ error: "Test id is not valid" });
    }
    if (!mongoose.Types.ObjectId.isValid(qid)) {
        return res.status(400).json({ error: "Question id is not valid" });
    }

    try {
        const test = await Test.findById(tid);
        if (!test) {
            throw Error("There are no open tests");
        }
        if (test.finished) {
            throw Error("Test was finished");
        }
        const q = test.tasks.find(w => w.id === qid);
        if (!q) {
            throw Error("No such question on this test");
        }

        const task = await Task.findOne({ _id: q.id });
        if (!task) {
            throw Error("That question no longer exists");
        }

        const points = getAnswerPoints(task, answer);

        const query = { _id: test._id, "tasks._id": q._id }
        const updateDoc = {
            $set: {
                "tasks.$.answer": answer,
                "tasks.$.answered": true,
                "tasks.$.points": points
            }
        }

        const result = await Test.updateOne(query, updateDoc);
        //console.log(result);
        //console.log(`updated test: ${test._id} and task: ${q._id}`)
        const currQIndex = test.tasks.map(w => w.id).indexOf(qid);
        if (currQIndex === test.tasks.length - 1) {
            const testPoints = test.tasks.reduce((acc, obj) => acc + obj.points, 0) + points;
            const finishedAt = Date.now();
            const diff = finishedAt - test.createdAt;
            let score = 0;
            if(testPoints > 0){
                score = testPoints / diff * 314159;
            }
            console.log(score, diff);
            await Test.findByIdAndUpdate(test._id, { finished: true, finishedAt, points: testPoints, score });
            return res.status(200).json({ finished: true, tid: test._id });
        }

        const question = await getQuestionFromTestTask(test.tasks[currQIndex + 1]);
        if (!question) {
            throw Error("Could not find the question");
        }
        res.status(200).json({ task: question, finished: false, tid: test._id });

    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

const getTestResults = async (req, res) => {
    const { tid } = req.body;

    if (!tid) {
        return res.status(400).json({ error: "No id was specified" });
    }
    if (!mongoose.Types.ObjectId.isValid(tid)) {
        return res.status(400).json({ error: "Id is not valid" });
    }

    try {
        const test = await Test.findById(tid);
        if (!test.finished) {
            throw Error("Test is unfinished");
        }
        let data = [];
        for (let i = 0; i < test.tasks.length; i++) {
            const task = await Task.findById(test.tasks[i].id);
            if (!task) {
                console.log(test, i);
                throw Error("Question was not found");
            }
            data.push([task.question, test.tasks[i].answer, test.tasks[i].points])
        }
        let results = {
            headers: ["Question", "Your answer", "Points"],
            data
        }

        res.status(200).json({ results });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const submitTest = async (req, res) => {
    const { tid, uid, nickname } = req.body;

    if (!uid) {
        return res.status(400).json({ error: "User id must be specified" });
    }
    if (!tid) {
        return res.status(400).json({ error: "Test id must be specified" })
    }
    if (!nickname) {
        return res.status(400).json({ error: "nickname must be specified" })
    }
    if (!mongoose.Types.ObjectId.isValid(tid)) {
        return res.status(400).json({ error: "Test id is invalid" })
    }
    if (!mongoose.Types.ObjectId.isValid(uid)) {
        return res.status(400).json({ error: "User id is invalid" })
    }
    if (nickname.length > 16 || nickname.length < 3 || !/^[a-zA-Z]+$/.test(nickname)) {
        return res.status(400).json({ error: "Nickname is invalid" });
    }

    try {
        const test = await Test.findById(tid);
        if (!test) {
            throw Error("Test was not found");
        }
        if (test.userid !== uid) {
            throw Error("Test is not owned by specified user");
        }
        if (!test.finished) {
            throw Error("Can not publish unfinished test");
        }
        const result = await Test.findByIdAndUpdate(tid, {
            nickname,
            published: true
        });
        res.status(200).json({ message: "Submitted!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

module.exports = {
    getTestTask,
    postTestAnswer,
    getTestResults,
    submitTest
};