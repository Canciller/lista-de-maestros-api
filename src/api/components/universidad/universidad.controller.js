const SharedController = require('../shared/shared.controller');
const UniversidadModel = require('./universidad.model');

module.exports = SharedController(UniversidadModel, 'universidad');