const router = require('express').Router();
const ReviewController = require('./review.controller');

router.route('/').get(ReviewController.list).post(ReviewController.create);

router
    .route('/:id')
    .get(ReviewController.get)
    //.put(MaestroController.update)
    .delete(ReviewController.remove);

router.param('id', ReviewController.load);

module.exports = router;
