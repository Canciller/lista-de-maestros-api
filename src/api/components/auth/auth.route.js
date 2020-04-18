const router = require('express').Router();
const expressJwt = require('express-jwt');
const AuthController = require('./auth.controller');

router.route('/login').post(AuthController.login);

router.route('/register').post(AuthController.register);

router
    .route('/checkToken')
    .get(expressJwt({ secret: process.env.SECRET }), AuthController.checkToken);

module.exports = router;
