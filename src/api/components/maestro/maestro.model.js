const mongoose = require('mongoose');
const shortId = require('shortid');

const MaestroSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortId.generate,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Masculino', 'Femenino', 'Otro'],
        required: true,
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
