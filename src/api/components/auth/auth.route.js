const router = require('express').Router();
const expressJwt = require('express-jwt');
const { validate } = require('express-validation');
const paramValidation = require('../../../utils/paramValidation');
const AuthController = require('./auth.controller');

router
    .route('/login')
    .post(validate(paramValidation.login), AuthController.login);

router
    .route('/register')
    .post(validate(paramValidation.register), AuthController.register);

router
    .route('/checkToken')
    .get(expressJwt({ secret: process.env.SECRET }), AuthController.checkToken);

module.exports = router;
