const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const User = require('../user/user.model');
const APIError = require('../../../util/APIError');
const ValidationError = require('../../../util/ValidationError');

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
                        }).json({
                            username: payload.username,
                            role: payload.role,
                        });
                    }
                );
            })
            .catch(next);
    },
    register: function (req, res, next) {
        if (req.body.password != req.body.repeatPassword)
            return next(
                new ValidationError('repeatPassword', strings.repeatPassword)
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
    logout: (req, res) => res.clearCookie('token').sendStatus(200),
    checkToken: (req, res) => res.sendStatus(200),
};
