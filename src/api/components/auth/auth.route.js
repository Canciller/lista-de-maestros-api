const router = require('express').Router();
const expressJwt = require('express-jwt');
const AuthController = require('./auth.controller');
const getToken = require('../../../util/getToken');

router.route('/login').post(AuthController.login);

router.route('/register').post(AuthController.register);

router
    .route('/logout')
    .post(
        expressJwt({ secret: process.env.SECRET, getToken }),
        AuthController.logout
    );

router
    .route('/checkToken')
    .get(
        expressJwt({ secret: process.env.SECRET, getToken }),
        AuthController.checkToken
    );

module.exports = router;
