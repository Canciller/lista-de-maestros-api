const SharedRoute = require('../shared/shared.route');
const MateriaController = require('./materia.controller');

module.exports = SharedRoute(MateriaController, 'createMateria');
