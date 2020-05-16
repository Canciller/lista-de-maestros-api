const mongoose = require('mongoose');
const shortId = require('shortid');

const MateriaSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortId.generate,
    },
    name: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Materia', MateriaSchema);
