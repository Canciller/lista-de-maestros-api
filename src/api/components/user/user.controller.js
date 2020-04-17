const User = require('./user.model');

module.exports = {
    load: function (req, res, next, id) {
        User.findById(id)
            .then((user) => {
                req.user = user;
                return next();
            })
            .catch((err) => next(err));
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
            .catch((err) => next(err));
    },
    update: function (req, res, next) {
        const user = req.user;
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;

        user.save()
            .then((savedUser) => res.json(savedUser))
            .catch((err) => next(err));
    },
    list: function (req, res, next) {
        const { limit = 50, skip = 0 } = req.query;
        User.list({ limit, skip })
            .then((users) => res.json(users))
            .catch((err) => next(err));
    },
    remove: function (req, res, next) {
        const user = req.user;
        user.remove()
            .then((deleteUser) => res.json(deletedUser))
            .catch((err) => next(err));
    },
};
