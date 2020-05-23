const router = require('express').Router();
const jwt = require('express-jwt');
const UserController = require('./user.controller');
const getToken = require('../../../util/getToken');

router.route('/').get(UserController.list).post(UserController.create);

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
