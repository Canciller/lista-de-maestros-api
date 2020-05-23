const APIError = require('./APIError');
const httpStatus = require('http-status');

class NotFoundError extends APIError {
    constructor(message) {
        super(message || httpStatus['404_MESSAGE'], httpStatus.NOT_FOUND, true);
    }
}

module.exports = NotFoundError;
