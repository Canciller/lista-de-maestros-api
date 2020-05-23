const router = require('express').Router();
const CategoryController = require('./category.controller');

router
    .route('/')
    .get(CategoryController.list)
    .post(CategoryController.create);

router.route('/:id').get(CategoryController.get);

router.param('id', CategoryController.load);

module.exports = router;
