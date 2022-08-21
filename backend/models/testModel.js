const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const testSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    tasks: [{
        id: String,
        answer: Schema.Types.Mixed,
        answered: Boolean,
        points: Number
    }],
    finished: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);