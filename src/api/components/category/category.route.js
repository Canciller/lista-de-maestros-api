const router = require('express').Router();
const { validate } = require('express-validation');
const paramValidation = require('../../../utils/paramValidation');
const CategoryController = require('./category.controller');

router
    .route('/')
    .get(CategoryController.list)
    .post(validate(paramValidation.createCategory), CategoryController.create);

router.route('/:id').get(CategoryController.get);

router.param('id', CategoryController.load);

module.exports = router;
