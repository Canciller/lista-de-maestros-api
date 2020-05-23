const mongoose = require('mongoose');
const shortId = require('shortid');
const ValidationError = require('../../../util/ValidationError');
const uniqueValidator = require('mongoose-unique-validator');

const FacultadSchema = new mongoose.Schema(
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
        universidad: {
            type: String,
            required: true,
            ref: 'Universidad',
        },
    },
    {
        collection: 'facultades',
    }
);

FacultadSchema.plugin(uniqueValidator, {
    message: ({ path, value }) => {
        switch (path) {
            case 'name':
                return `La facultad '${value}' ya existe.`;
        }
    },
});

FacultadSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('universidad')) {
        const Universidad = mongoose.model('Universidad');
        const document = this;

        Universidad.findOne({ name: this.universidad })
            .then((universidad) => {
                if (universidad) {
                    document.universidad = universidad._id;
                    next();
                } else {
                    next(
                        new ValidationError(
                            `La universidad '${document.universidad}' no existe.`
                        )
                    );
                }
            })
            .catch(next);
    }
});

module.exports = mongoose.model('Facultad', FacultadSchema);
