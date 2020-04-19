const router = require('express').Router();
const { validate } = require('express-validation');
const paramValidation = require('../../../utils/paramValidation');
const MaestroController = require('./maestro.controller');

router
    .route('/')
    .post(validate(paramValidation.createMaestro), MaestroController.create);

router.route('/:url').get(MaestroController.get);

router.param('url', MaestroController.load);

module.exports = router;
