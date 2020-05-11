const router = require('express').Router();
const { validate } = require('express-validation');
const paramValidation = require('../../../utils/paramValidation');
const QuestionController = require('./question.controller');

router
    .route('/')
    .get(QuestionController.list)
    .post(validate(paramValidation.createQuestion), QuestionController.create);

router.route('/:id').get(QuestionController.get);

router.param('id', QuestionController.load);

module.exports = router;
