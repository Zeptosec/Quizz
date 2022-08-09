const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: [{
        type: String,
        required: true
    }],
    points: {
        type: Number,
        required: true
    },
    difficulty: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('task', taskSchema);