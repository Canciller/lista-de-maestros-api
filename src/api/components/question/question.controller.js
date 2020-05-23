const Question = require('./question.model');
const NotFoundError = require('../../../util/NotFoundError');

module.exports = {
    load: function (req, res, next, id) {
        Question.findById(id)
            .populate('category')
            .then((question) => {
                req.question = question;
                if (question) next();
                else next(new NotFoundError());
            })
            .catch(next);
    },
    list: function (req, res, next) {
        Question.find()
            .populate('category')
            .then((questions) => res.json(questions))
            .catch(next);
    },
    get: function (req, res) {
        return res.json(req.question);
    },
    create: function (req, res, next) {
        const question = new Question({
            order: req.body.order,
            category: req.body.category,
            text: req.body.text,
            lang: req.body.lang,
            type: req.body.type,
        });

        question
            .save()
            .then((savedQuestion) => res.json(savedQuestion))
            .catch(next);
    },
};
