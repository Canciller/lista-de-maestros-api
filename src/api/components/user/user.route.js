const router = require('express').Router();
const { validate } = require('express-validation');
const jwt = require('express-jwt');
const paramValidation = require('../../../utils/paramValidation');
const UserController = require('./user.controller');
const getToken = require('../../../utils/getToken');

router
    .route('/')
    .get(UserController.list)
    .post(validate(paramValidation.createUser), UserController.create);

router.route('/me').get(
    jwt({
        secret: process.env.SECRET,
        getToken,
    }),
    UserController.get
);

router
    .route('/:username')
    .get(UserController.get)
    .put(UserController.update)
    .delete(UserController.remove);

router.param('username', UserController.load);

module.exports = router;
