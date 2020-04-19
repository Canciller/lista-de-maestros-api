const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

//autoIncrement.initialize(mongoose.connection);

const MaestroSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        match: /^[a-z ,\.'-]+$/i,
    },
    apellido: {
        type: String,
        required: true,
        match: /^[a-z ,\.'-]+$/i,
    },
    degree: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        lowercase: true,
    },
    count: {
        type: Number,
        default: 0,
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

//MaestroSchema.plugin(autoIncrement.plugin, 'Maestro');
module.exports = mongoose.model('Maestro', MaestroSchema);
