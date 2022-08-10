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
        for (let i = 0; i < task[0].answers.length; i++) {
            if (answer == task[0].answers[i]) {
                return res.status(200).json({ right: true });
            }
        }

        res.status(200).json({ right: false });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// Create new tasks in database
const createTask = async (req, res) => {
    const { question, answers, points, difficulty } = req.body;

    try {
        if (!answers || answers.length == 0) {
            throw Error("Add an answer");
        }
        const task = await Task.create({ question, answers, points, difficulty });
        res.status(200).json({ task });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

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
        return res.status(404).json({ message: "There are no tasks to choose from" });
    }
    const rnd = Math.floor(Math.random() * count);
    const rndTask = await Task.findOne().skip(rnd);
    res.status(200).json({
        question: rndTask.question,
        _id: rndTask._id,
        points: rndTask.points,
        difficulty: rndTask.difficulty
    });
}

module.exports = {
    createTask,
    getTasks,
    getTask,
    getNextTask,
    answerChecker
};
