const router = require('express').Router();
const QuestionController = require('./question.controller');

router
    .route('/')
    .get(QuestionController.list)
    .post(QuestionController.create);

router.route('/:id').get(QuestionController.get);

router.param('id', QuestionController.load);

module.exports = router;
