const router = require('express').Router();
const UserController = require('./user.controller');

router.route('/').get(UserController.list).post(UserController.create);

router
    .route('/:username')
    .get(UserController.get)
    .put(UserController.update)
    .delete(UserController.remove);

router.param('username', UserController.load);

module.exports = router;
