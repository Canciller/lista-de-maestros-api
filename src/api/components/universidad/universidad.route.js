const SharedRoute = require('../shared/shared.route');
const UniversidadController = require('./universidad.controller');

module.exports = SharedRoute(UniversidadController, 'createUniversidad');

