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
    getNextTask,
    answerChecker,
};
