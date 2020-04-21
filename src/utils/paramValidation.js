const Joi = require('@hapi/joi');

module.exports = {
    createMaestro: {
        body: Joi.object({
            nombre: Joi.string().required(),
            apellido: Joi.string().required(),
            degree: Joi.string().required(),
        }),
    },
    createUser: {
        body: Joi.object({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    },
    login: {
        body: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        }),
    },
    register: {
        body: Joi.object({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            repeatPassword: Joi.string().required(),
        }),
    },
};
