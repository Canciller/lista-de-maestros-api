const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const shortId = require('shortid');
const uniqueValidator = require('mongoose-unique-validator');
const strings = require('./user.strings');

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
        maxlength: [32, strings.username.maxlength(32)],
        required: [true, strings.username.required],
        match: [/^[0-9a-zA-Z_-]+$/, strings.username.match],
    },
    email: {
        type: String,
        index: true,
        required: [true, strings.username.required],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: strings.email.validate,
        },
    },
    password: {
        type: String,
        required: [true, strings.password.required],
        minlength: [6, strings.password.minlength(6)],
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

UserSchema.plugin(uniqueValidator, {
    message: ({ path }) => {
        return strings[path].unique;
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
