const router = require('express').Router();
const httpStatus = require('http-status');
const APIError = require('../../../util/APIError');

router
    .route('*')
    .all((req, res, next) =>
        next(
            new APIError(httpStatus['404_MESSAGE'], httpStatus.NOT_FOUND, true)
        )
    );

module.exports = router;
