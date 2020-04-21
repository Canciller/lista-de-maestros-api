const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const APIError = require('../../../utils/APIError');

const saltRounds = process.env.SALT_ROUNDS || 10;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        maxlength: 32,
        required: true,
        match: /^[0-9a-zA-Z_-]+$/,
    },
    email: {
        type: String,
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
     * Get user
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((user) => {
                if (user) {
                    return user;
                }
                const err = new APIError(
                    httpStatus['404_MESSAGE'],
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

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
