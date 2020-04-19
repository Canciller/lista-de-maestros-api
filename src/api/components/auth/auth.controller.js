const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const User = require('../user/user.model');
const APIError = require('../../../utils/APIError');

const strings = require('./auth.strings');

module.exports = {
    login: function (req, res, next) {
        User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username },
            ],
        })
            .then((user) => {
                if (!user)
                    return next(
                        new APIError(
                            strings.incorrect,
                            httpStatus.UNAUTHORIZED,
                            true
                        )
                    );
                user.isPasswordCorrect(
                    req.body.password,
                    (err, isPasswordCorrect) => {
                        if (err) return next(err);
                        if (!isPasswordCorrect)
                            return next(
                                new APIError(
                                    strings.incorrect,
                                    httpStatus.UNAUTHORIZED,
                                    true
                                )
                            );
                        const payload = {
                            username: user.username,
                            role: user.role,
                        };
                        const token = jwt.sign(payload, process.env.SECRET, {
                            expiresIn: '1h',
                        });
                        res.cookie('token', token, {
                            httpOnly: true,
                        }).json(payload);
                    }
                );
            })
            .catch(next);
    },
    register: function (req, res, next) {
        if (req.body.password != req.body.repeatPassword)
            return next(
                new APIError(strings.repeatPassword, httpStatus.FORBIDDEN, true)
            );

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        user.save()
            .then((savedUser) =>
                res.json({
                    username: savedUser.username,
                    email: savedUser.email,
                    role: savedUser.role,
                })
            )
            .catch(next);
    },
    checkToken: (req, res) => res.sendStatus(200),
};
