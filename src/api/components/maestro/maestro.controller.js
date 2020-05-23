const Maestro = require('./maestro.model');
const NotFoundError = require('../../../util/NotFoundError');

module.exports = {
    load: function (req, res, next, id) {
        Maestro.findById(id)
            .then((maestro) => {
                req.maestro = maestro;
                if (maestro) next();
                else next(new NotFoundError());
            })
            .catch(next);
    },
    list: function (req, res, next) {
        const { limit = 50, skip = 0 } = req.query;
        Maestro.list({ limit, skip })
            .then((maestros) => res.json(maestros))
            .catch(next);
    },
    get: function (req, res) {
        return res.send(req.maestro);
    },
    create: function (req, res, next) {
        const maestro = new Maestro({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            degree: req.body.degree,
            gender: req.body.gender,
        });

        maestro
            .save()
            .then((savedMaestro) => res.json(savedMaestro))
            .catch(next);
    },
    update: function (req, res, next) {
        const maestro = req.maestro;
        maestro.firstname = req.body.firstname;
        maestro.lastname = req.body.lastname;
        maestro.degree = req.body.degree;
        maestro.gender = req.body.gender;

        maestro
            .save()
            .then((savedMaestro) => res.json(savedMaestro))
            .catch(next);
    },
    remove: function (req, res, next) {
        const maestro = req.maestro;
        maestro
            .remove()
            .then((deletedMaestro) => res.json(deletedMaestro))
            .catch(next);
    },
};
