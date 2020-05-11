const Category = require('./category.model');
const NotFoundError = require('../../../utils/NotFoundError');

module.exports = {
    load: function (req, res, next, id) {
        Category.findById(id)
            .then((category) => {
                req.category = category;
                if (category) next();
                else next(new NotFoundError());
            })
            .catch(next);
    },
    list: function (req, res, next) {
        Category.find()
            .populate('questions')
            .then((categories) => res.json(categories))
            .catch(next);
    },
    get: function (req, res) {
        return res.json(req.category);
    },
    create: function (req, res, next) {
        const category = new Category({
            text: req.body.text,
            name: req.body.name,
            lang: req.body.lang,
        });

        category
            .save()
            .then((savedCategory) => res.json(savedCategory))
            .catch(next);
    },
};
