const mongoose = require('mongoose');
const shortId = require('shortid');
const strings = require('./maestro.strings');
const ValidationError = require('../../../util/ValidationError');

const MaestroSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortId.generate,
    },
    firstname: {
        type: String,
        required: [true, strings.firstname.required],
    },
    lastname: {
        type: String,
        required: [true, strings.lastname.required],
    },
    degree: {
        type: String,
        enum: {
            values: [
                'Licenciatura',
                'Ingeniería',
                'Maestría',
                'Doctorado'
            ],
            message: strings.degree.enum,
        },
        required: [true, strings.degree.required],
    },
    gender: {
        type: String,
        enum: {
            values: ['Masculino', 'Femenino', 'Otro'],
            message: strings.gender.enum,
        },
        required: [true, strings.gender.required],
    },
    facultades: {
        type: Map,
        of: [
            {
                type: String,
                ref: 'Materia',
            },
        ],
    },
    active: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

MaestroSchema.pre('save', function (next) {
    next();
});

MaestroSchema.statics = {
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    },
};

module.exports = mongoose.model('Maestro', MaestroSchema);
