const mongoose = require('mongoose');
const shortId = require('shortid');
const uniqueValidator = require('mongoose-unique-validator');

const MateriaSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortId.generate,
    },
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
});

MateriaSchema.plugin(uniqueValidator, {
    message: ({ path, value }) => {
        switch (path) {
            case 'name':
                return `La materia '${value}' ya existe.`;
        }
    },
});

module.exports = mongoose.model('Materia', MateriaSchema);
