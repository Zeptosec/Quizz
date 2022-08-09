const express = require('express');
const router = express.Router();
const { 
    createTask,
    getTask,
    getTasks
} = require('../controllers/taskController');

//get all tasks
router.get('/', getTasks);

//get single tasks
router.get('/:id', getTask);

//create new task
router.post('/', createTask);

module.exports = router;