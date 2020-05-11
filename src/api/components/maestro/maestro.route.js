const router = require('express').Router();
const { validate } = require('express-validation');
const paramValidation = require('../../../utils/paramValidation');
const MaestroController = require('./maestro.controller');

router
    .route('/')
    .get(MaestroController.list)
    .post(validate(paramValidation.createMaestro), MaestroController.create);

router
    .route('/:id')
    .get(MaestroController.get)
    .put(MaestroController.update)
    .delete(MaestroController.remove);

router.param('id', MaestroController.load);

module.exports = router;
