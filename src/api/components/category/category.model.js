const mongoose = require('mongoose');
const shortId = require('shortid');

const CategorySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortId.generate,
    },
    name: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    lang: {
        type: String,
        required: true,
    },
    questions: [
        {
            type: String,
            ref: 'Question',
        },
    ],
});

module.exports = mongoose.model('Category', CategorySchema);
