const mongoose = require('mongoose');
const shortId = require('shortid');
const strings = require('./review.strings');

const ReviewSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortId.generate,
    },
    maestro: {
        type: String,
        required: true,
        ref: 'Maestros',
    },
    materia: {
        type: String,
        required: true,
        ref: 'Materia',
    },
    username: {
        type: String,
        required: true,
        ref: 'User.username',
    },
    comment: {
        type: String,
        required: true,
    },
    mean: {
        type: Number,
        default: 0,
    },
    dominio_de_la_asignatura: {
        type: Number,
        required: true,
    },
    planificación_del_curso: {
        type: Number,
        default: 0,
        required: true,
    },
    ambientes_de_aprendizaje: {
        type: Number,
        default: 0,
        required: true,
    },
    estrategias_metodos_y_tecnicas: {
        type: Number,
        required: true,
    },
    motivacion: {
        type: Number,
        required: true,
    },
    evaluacion: {
        type: Number,
        required: true,
    },
    comunicacion: {
        type: Number,
        required: true,
    },
    gestion_del_curso: {
        type: Number,
        required: true,
    },
    tecnologias_de_la_informacion_y_comunicacion: {
        type: Number,
        required: true,
    },
    satisfaccion_general: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

ReviewSchema.statics = {
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    },
};

module.exports = mongoose.model('Review', ReviewSchema);
