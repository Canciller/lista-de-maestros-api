const mongoose = require('mongoose');
const shortId = require('shortid');
const uniqueValidator = require('mongoose-unique-validator');

const UniversidadSchema = new mongoose.Schema(
    {
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
    },
    {
        collection: 'universidades',
    }
);

UniversidadSchema.plugin(uniqueValidator, {
    message: ({ path, value }) => {
        switch (path) {
            case 'name':
                return `La universidad '${value}' ya existe.`;
        }
    },
});

module.exports = mongoose.model('Universidad', UniversidadSchema);
