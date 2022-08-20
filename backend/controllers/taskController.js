const Task = require("../models/taskModel");
const mongoose = require("mongoose");

// Checks if question answer was correct or not
const answerChecker = async (req, res) => {
    const { answer, id } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw Error("Wrong ID");
        }
        const task = await Task.find({ _id: id });

        switch (task[0].type) {
            case "free":
                for (let i = 0; i < task[0].answers.length; i++) {
                    if (answer == task[0].answers[i]) {
                        return res.status(200).json({ isCorrect: true });
                    }
                }
                break;
            case "choice":
                let tmpAnswers = [];
                for(let i = 0; i < answer.length; i++){
                    tmpAnswers.push(answer[i].toString());
                }
                let usedChoices = [];
                const val = 1 / task[0].answers.length;
                let score = 0;
                let cnt = 0;
                for(let i = 0; i < tmpAnswers.length; i++){
                    if(cnt++ > task[0].choices.length){
                        score = 0;
                        break; // if somehow user sent more answers then there are choices
                    }
                    if(task[0].answers.includes(tmpAnswers[i]) && !usedChoices.includes(tmpAnswers[i])){
                        score += val; // reward with correct answer
                        usedChoices.push(tmpAnswers[i]);
                    } else {
                        score -= val; // punish for wrong answer
                    }
                }
                if(score >= 0.5){
                    return res.status(200).json({ isCorrect: true });
                }
                break;
            default:
                console.log(task);
                throw Error("Unknown question type.");
        }
        res.status(200).json({ isCorrect: false });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// Create new tasks in database
const createTask = async (req, res) => {
    const { question, answers, points, difficulty, type, choices } = req.body;
    try {
        if (!answers || answers.length == 0) {
            throw Error("Add an answer");
        }
        let task;
        switch (type) {
            case "free":
                task = await Task.create({ question, answers, points, difficulty, type });
                break;
            case "choice":
                task = await Task.create({ question, answers, points, difficulty, type, choices });
                break;
            default:
                throw Error("Incorrect question type");
        }
        res.status(200).json({ task });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw Error("Wrong ID");
        }
        const task = await Task.findOneAndDelete({ _id: id });
        if (!task) {
            res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Get all tasks from database
const getTasks = async (req, res) => {
    const tasks = await Task.find({}).sort({ createdAt: -1 });

    res.status(200).json({ tasks });
};

// Get a single task from database
const getTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Id was invalid" });
    }

    const task = await Task.findById(id);
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ task });
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

module.exports = {
    createTask,
    getTasks,
    getTask,
    getNextTask,
    answerChecker,
    deleteTask
};
