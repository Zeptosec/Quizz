const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    difficulty: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const answerSchema = new Schema({
    question_id: mongoose.Schema.Types.ObjectId,
    answer: [{
        type: String,
        required: true
    }]
});

module.exports = { 
    Task: mongoose.model('task', taskSchema), 
    Answer: mongoose.model('answer', answerSchema)
};