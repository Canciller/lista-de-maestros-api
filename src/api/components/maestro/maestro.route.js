const router = require('express').Router();
const MaestroController = require('./maestro.controller');

router.route('/').get(MaestroController.list).post(MaestroController.create);

router
    .route('/:id')
    .get(MaestroController.get)
    .put(MaestroController.update)
    .delete(MaestroController.remove);

router.param('id', MaestroController.load);

module.exports = router;
