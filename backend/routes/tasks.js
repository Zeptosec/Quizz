const express = require('express');
const router = express.Router();
const { 
    createTask,
    getTask,
    getTasks,
    getNextTask,
    answerChecker,
    deleteTask
} = require('../controllers/taskController');

//get all tasks
router.get('/', getTasks);

//get next task
router.get('/next', getNextTask);

//check answer
router.post('/check', answerChecker);

//get single task
router.get('/:id', getTask);

//delete single task
router.delete('/:id', deleteTask);

//create new task
router.post('/', createTask);

module.exports = router;