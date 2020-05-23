module.exports = {
    username: {
        unique: 'El nombre de usuario ya existe.',
        required: 'El nombre de usuario es requerido.',
        match:
            'El nombre de usuario debe de ser una combinacion de numeros (0-9), letras (a-z, A-Z), o guiones (-, _) en cualquier orden.',
        maxlength: (maxlength) =>
            `El nombre de usuario es más largo que la longitud máxima permitida (${maxlength}).`,
    },
    email: {
        unique: 'El email ya existe.',
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
