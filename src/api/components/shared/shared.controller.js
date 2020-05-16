const NotFoundError = require('../../../utils/NotFoundError');

module.exports = function (Model, name) {
    return {
        load: function (req, res, next, id) {
            Model.findById(id)
                .then((found) => {
                    req[name] = found;
                    if (found) next();
                    else next(new NotFoundError());
                })
                .catch(next);
        },
        list: function (req, res, next) {
            Model.find()
                .then((found) => res.json(found))
                .catch(next);
        },
        get: function (req, res) {
            return res.json(req[name]);
        },
        create: function (req, res, next) {
            const created = new Model(req.body);

            created
                .save()
                .then((saved) => res.json(saved))
                .catch(next);
        },
    };
};
