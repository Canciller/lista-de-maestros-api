const SharedController = require('../shared/shared.controller');
const FacultadModel = require('./facultad.model');

module.exports = SharedController(FacultadModel, 'facultad');