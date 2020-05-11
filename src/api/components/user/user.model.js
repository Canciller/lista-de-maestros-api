const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const shortId = require('shortid');

const saltRounds = process.env.SALT_ROUNDS || 10;

const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortId.generate,
    },
    username: {
        type: String,
        index: true,
        unique: true,
        lowercase: true,
        maxlength: 32,
        required: true,
        match: /^[0-9a-zA-Z_-]+$/,
    },
    email: {
        type: String,
        index: true,
        required: true,
        unique: true,
        validate: validator.isEmail,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['Administrador', 'Estudiante', 'Maestro'],
        default: 'Estudiante',
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

UserSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('password')) {
        const document = this;
        bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
            if (err) {
                next(err);
            } else {
                document.password = hashedPassword;
                next();
            }
        });
    } else {
        next();
    }
});

UserSchema.methods.isPasswordCorrect = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, same) {
        if (err) callback(err);
        else callback(err, same);
    });
};

UserSchema.statics = {
    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    },
};

module.exports = mongoose.model('User', UserSchema);
