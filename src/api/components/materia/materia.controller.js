const SharedController = require('../shared/shared.controller');
const MateriaModel = require('./materia.model');

module.exports = SharedController(MateriaModel, 'materia');
