const Joi = require('@hapi/joi');

module.exports = {
    createMaestro: {
        body: Joi.object({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            degree: Joi.string().required(),
            gender: Joi.string().required(),
        }),
    },
    createUser: {
        body: Joi.object({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    },
    createQuestion: {
        body: Joi.object({
            order: Joi.number().required(),
            category: Joi.string().required(),
            text: Joi.string().required(),
            lang: Joi.string().required(),
            type: Joi.string(),
        }),
    },
    createCategory: {
        body: Joi.object({
            text: Joi.string().required(),
            name: Joi.string().required(),
            lang: Joi.string().required(),
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
