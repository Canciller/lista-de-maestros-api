const User = require('./user.model');
const httpStatus = require('http-status');
const APIError = require('../../../utils/APIError');

module.exports = {
    load: function (req, res, next, username) {
        User.findOne({
            username: username,
        })
            .then((user) => {
                req.user = user;
                if (user) next();
                else
                    next(
                        new APIError(
                            httpStatus['404_MESSAGE'],
                            httpStatus.NOT_FOUND,
                            true
                        )
                    );
            })
            .catch(next);
    },
    current: function(req, res) {
        res.json(req.user);
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
    list: function (req, res, next) {
        const { limit = 50, skip = 0 } = req.query;
        User.list({ limit, skip })
            .then((users) => res.json(users))
            .catch(next);
    },
    remove: function (req, res, next) {
        const user = req.user;
        user.remove()
            .then((deletedUser) => res.json(deletedUser))
            .catch(next);
    },
};
