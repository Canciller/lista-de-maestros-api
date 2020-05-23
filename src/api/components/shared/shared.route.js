const Router = require('express').Router;

module.exports = function (Controller) {
    let router = Router();

    router
        .route('/')
        .get(Controller.list)
        .post(Controller.create);

    router.route('/:id', Controller.get);

    router.param('id', Controller.load);

    return router;
};
