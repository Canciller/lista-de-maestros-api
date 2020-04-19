const Joi = require('@hapi/joi');

module.exports = {
    createMaestro: {
        body: Joi.object({
            nombre: Joi.string().required(),
            apellido: Joi.string().required(),
            degree: Joi.string().required(),
        }),
    },
};
