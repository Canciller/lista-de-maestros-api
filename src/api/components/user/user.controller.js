const User = require('./user.model');
const NotFoundError = require('../../../utils/NotFoundError');

module.exports = {
    load: function (req, res, next, username) {
        User.findOne({ username })
            .then((user) => {
                req.user = user;
                if (user) next();
                else next(new NotFoundError());
            })
            .catch(next);
    },
    list: function (req, res, next) {
        const { limit = 50, skip = 0 } = req.query;
        User.list({ limit, skip })
            .then((users) => res.json(users))
            .catch(next);
    },
    get: function (req, res) {
        return res.json(req.user);
    },
    create: function (req, res, next) {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        user.save()
            .then((savedUser) => res.json(savedUser))
            .catch(next);
    },
    update: function (req, res, next) {
        const user = req.user;
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;

        user.save()
            .then((savedUser) => res.json(savedUser))
            .catch(next);
    },
    remove: function (req, res, next) {
        const user = req.user;
        user.remove()
            .then((deletedUser) => res.json(deletedUser))
            .catch(next);
    },
};
