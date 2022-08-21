const express = require('express');
const router = express.Router();
const { 
    getNextTask,
    answerChecker,
    getTestTask,
    postTestAnswer
} = require('../controllers/taskController');

router.post('/gettesttask', getTestTask);

router.post('/posttestanswer', postTestAnswer);

//get next task
router.get('/next', getNextTask);

//check answer
router.post('/check', answerChecker);

module.exports = router;