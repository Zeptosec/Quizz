const Task = require("../models/taskModel");
const mongoose = require("mongoose");

// Create new tasks in database
const createTask = async (req, res) => {
    const { question, answer, points, difficulty } = req.body;

    try {
        if (answer.length == 0) {
            throw Error("Ad an answer");
        } else {
            const task = await Task.create({ question, answer, points, difficulty });
            res.status(200).json(task);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all tasks from database
const getTasks = async (req, res) => {
    const tasks = await Task.find({}).sort({ createdAt: -1 });

    res.status(200).json(tasks);
};

// Get a single task from database
const getTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Id was invalid" });
    }

    const task = await Task.findById(id);
    if(!task){
        return res.status(404).json({error: "Task not found"});
    }
    res.status(200).json(task);
};

module.exports = {
    createTask,
    getTasks,
    getTask,
};
