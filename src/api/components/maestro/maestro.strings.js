module.exports = {
    firstname: {
        required: 'El nombre del maestro es requerido.',
        match: 'El nombre del maestro no es valido.',
    },
    lastname: {
        required: 'El apellido del maestro es requerido.',
        match: 'El apellido del maestro es requerido.',
    },
    degree: {
        required: 'El título del maestro es requerido.',
        enum: 'El título no es valido.',
    },
    gender: {
        enum: 'El género no es valido.',
        required: 'El género del maestro es requerido.',
    },
    facultad: {
        unique: 'El maestro ya fue añadido en esta facultad.',
        required: 'La facultad donde enseña el maestro es requerida.',
        missing: 'No existen facultades con ese nombre.',
    },
};
