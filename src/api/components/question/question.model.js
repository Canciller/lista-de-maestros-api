const mongoose = require('mongoose');
const shortId = require('shortid');

const QuestionSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortId.generate,
    },
    order: {
        type: Number,
        required: true,
        index: true,
    },
    category: {
        type: String,
        required: true,
        ref: 'Category.name',
    },
    lang: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['text', 'scale'],
        default: 'scale',
    },
});

QuestionSchema.pre('save', function (next) {
    const Category = mongoose.model('Category');
    Category.findOneAndUpdate(
        { name: this.category, lang: this.lang },
        { $push: { questions: this._id } },
        { new: true }
    )
        .then((category) => next())
        .catch(next);
});

module.exports = mongoose.model('Question', QuestionSchema);
