const Task = require("../models/taskModel");
const mongoose = require("mongoose");

// Create new tasks in database
const createTask = async (req, res) => {
  const { question, answer, points, difficulty } = req.body;

  try {
    if (answer.length == 0) {
      throw Error("Add an answer");
    } else {
      const task = await Task.create({ question, answer, points, difficulty });
      res.status(200).json(task);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all tasks from database
const getTasks = async (req, res) => {};

// Get a single task from database
const getTask = async (req, res) => {};

module.exports = {
  createTask,
  getTasks,
  getTask,
};
