const { Task, Answer } = require("../models/taskModel");
const mongoose = require("mongoose");

// Create new tasks in database
const createTask = async (req, res) => {
  const { question, answer, points, difficulty } = req.body;

    try {
        if (answer.length == 0) {
            throw Error("Add an answer");
        }
        const task = await Task.create({ question, points, difficulty });
        const answers = await Answer.create({ question_id: task._id, answer });
        res.status(200).json({ task, answers });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all tasks from database
const getTasks = async (req, res) => {
  const tasks = await Task.find({}).sort({ createdAt: -1 });
  const answers = await Answer.find({}).sort({ createdAt: -1 });

  res.status(200).json({ tasks, answers });
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
    const answers = await Answer.find({ question_id: task._id });
    res.status(200).json({ task, answers });
};

module.exports = {
  createTask,
  getTasks,
  getTask,
};
