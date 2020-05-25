const mongoose = require('mongoose');
const shortId = require('shortid');
const strings = require('./maestro.strings');

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
            values: ['Licenciatura', 'Ingeniería', 'Maestría', 'Doctorado'],
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
    totalReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            type: String,
            ref: 'Review',
        },
    ],
    scores: {
        dominio_de_la_asignatura: {
            type: Number,
            default: 0,
        },
        planificacion_del_curso: {
            type: Number,
            default: 0,
        },
        ambientes_de_aprendizaje: {
            type: Number,
            default: 0,
        },
        estrategias_metodos_y_tecnicas: {
            type: Number,
            default: 0,
        },
        motivacion: {
            type: Number,
            default: 0,
        },
        evaluacion: {
            type: Number,
            default: 0,
        },
        comunicacion: {
            type: Number,
            default: 0,
        },
        gestion_del_curso: {
            type: Number,
            default: 0,
        },
        tecnologias_de_la_informacion_y_comunicacion: {
            type: Number,
            default: 0,
        },
        satisfaccion_general: {
            type: Number,
            default: 0,
        },
    },
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
