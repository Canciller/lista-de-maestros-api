module.exports = {
    username: {
        required: 'El nombre de usuario es requerido.',
        match: 'El nombre de usuario no es valido.',
        minlength: (minlength) =>
            `El nombre de usuario es más corto que la longitud mínima permitida (${minlength}).`,
        maxlength: (maxlength) =>
            `El nombre de usuario es más largo que la longitud máxima permitida (${maxlength}).`,
    },
    email: {
        required: 'El email es requerido.',
        validate: 'El email no es valido.',
    },
    password: {
        required: 'La contraseña es requerida.',
        minlength: (minlength) =>
            `La contraseña es más corta que la longitud mínima permitida (${minlength}).`,
    },
    notFound: 'El usuario no existe.',
};
