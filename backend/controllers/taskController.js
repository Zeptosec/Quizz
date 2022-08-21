const Task = require("../models/taskModel");
const mongoose = require("mongoose");
const Test = require('../models/testModel');
const crypto = require('crypto');

const getAnswerPoints = (task, answer) => {
    switch (task.type) {
        case "free":
            for (let i = 0; i < task.answers.length; i++) {
                if (answer == task.answers[i]) {
                    return 1;
                }
            }
            break;
        case "choice":
            let tmpAnswers = [];
            for (let i = 0; i < answer.length; i++) {
                tmpAnswers.push(answer[i].toString());
            }
            let usedChoices = [];
            const val = 1 / task.answers.length;
            let score = 0;
            let cnt = 0;
            for (let i = 0; i < tmpAnswers.length; i++) {
                if (cnt++ > task.choices.length) {
                    score = 0;
                    break; // if somehow user sent more answers then there are choices
                }
                if (task.answers.includes(tmpAnswers[i]) && !usedChoices.includes(tmpAnswers[i])) {
                    score += val; // reward with correct answer
                    usedChoices.push(tmpAnswers[i]);
                } else {
                    score -= val; // punish for wrong answer
                }
            }
            return score;
        default:
            console.log(task);
            throw Error("Unknown question type.");
    }
}

// Checks if question answer was correct or not
const answerChecker = async (req, res) => {
    const { answer, id } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw Error("Wrong ID");
        }
        const task = await Task.findOne({ _id: id });

        const points = getAnswerPoints(task, answer);
        if (points >= 0.5) {
            res.status(200).json({ isCorrect: true });
        }
        res.status(200).json({ isCorrect: false });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// Gets random question from database
const getNextTask = async (req, res) => {

    const count = await Task.estimatedDocumentCount({});
    if (count == 0) {
        return res.status(404).json({ error: "There are no tasks to choose from" });
    }
    const rnd = Math.floor(Math.random() * count);
    const rndTask = await Task.findOne().skip(rnd);
    res.status(200).json({
        question: rndTask.question,
        _id: rndTask._id,
        points: rndTask.points,
        difficulty: rndTask.difficulty,
        choices: rndTask.choices,
        type: rndTask.type,
    });
}

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
        finished: false
    });
    return { uuid, test };
}

const getQuestionFromTestTask = async (task) => {
    const q = await Task.findById(task.id);
    return { qid: q._id, question: q.question, type: q.type, choices: q.choices };
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
            return res.status(200).json({ uid: uuid, task: question, finished: false });
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
                return res.status(200).json({ task: question, finished: false });
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
                return res.status(200).json({ finished: true });
            } else {
                // return the first unanswered question on test
                try {
                    const question = await getQuestionFromTestTask(task);
                    return res.status(200).json({ task: question, finished: false });
                } catch (err) {
                    console.log(err);
                    return res.status(400).json({ error: err.message });
                }
            }
        }
    }
}

const postTestAnswer = async (req, res) => {

    // const query = { _id: "6302920675c9f6e222c785f3", "tasks.id": "6300c3eae7e8e87c125aa135" }
    // const updateDoc = {
    //     $set: {
    //         "tasks.$.answer": "answer",
    //         "tasks.$.answered": true,
    //         "tasks.$.points": 1
    //     }
    // }

    // const result = await Test.updateOne(query, updateDoc);
    // console.log(result);
    // res.status(400).json({ error: "Test function" });
    // return;
    const { answer, uid, qid } = req.body;

    if (!uid) {
        return res.status(400).json({ error: "User id is required" });
    }
    if (!qid) {
        return res.status(400).json({ error: "Question id is required" });
    }
    if (!answer) {
        return res.status(400).json({ error: "Answer is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(uid)) {
        return res.status(400).json({ error: "User id is not valid" });
    }
    if (!mongoose.Types.ObjectId.isValid(qid)) {
        return res.status(400).json({ error: "Question id is not valid" });
    }

    try {
        const tests = await Test.find({ userid: uid }).where('finished').equals(false);
        const test = tests[0];
        if (!test) {
            throw Error("There are no open tests");
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
        console.log(result);
        console.log(`updated test: ${test._id} and task: ${q._id}`)
        const currQIndex = test.tasks.map(w => w.id).indexOf(qid);
        if (currQIndex === test.tasks.length - 1) {
            await Test.findByIdAndUpdate(test._id, { finished: true });
            return res.status(200).json({ finished: true });
        }

        const question = await getQuestionFromTestTask(test.tasks[currQIndex + 1]);
        if (!question) {
            throw Error("Could not find the question");
        }
        res.status(200).json({ task: question, finished: false });

    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    getNextTask,
    answerChecker,
    getTestTask,
    postTestAnswer
};
