const APIError = require('./APIError');
const httpStatus = require('http-status');

class ValidationError extends APIError {
    constructor(path, message) {
        super(message, httpStatus.INTERNAL_SERVER_ERROR, true);
        this.path = path;
    }
}

module.exports = ValidationError;
