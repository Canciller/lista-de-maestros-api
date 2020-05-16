const router = require('express').Router();
const { validate } = require('express-validation');
const paramValidation = require('../../../utils/paramValidation');

module.exports = function(Controller, validation) {
    router.route('/')
        .get(Controller.list)
        .post(validate(paramValidation[validation]), Controller.create);
    
    router.route('/:id', Controller.get);

    router.param('id', Controller.load);

    return router;
}