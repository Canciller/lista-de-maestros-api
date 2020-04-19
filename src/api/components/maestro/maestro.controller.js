const Maestro = require('./maestro.model');
const MaestroCounter = require('./maestroCounter.model');
const httpStatus = require('http-status');
const APIError = require('../../../utils/APIError');

module.exports = {
    load: function (req, res, next, url) {
        let arrUrl = url.split('-');
        let count = parseInt(arrUrl.pop());

        const changed = !Number.isNaN(count);
        count = changed ? count : 1;

        if (changed) url = arrUrl.join('-');

        Maestro.findOne({
            url,
            count,
        })
            .then((maestro) => {
                req.maestro = maestro;
                if (maestro) next();
                else
                    next(
                        new APIError(
                            httpStatus['404_MESSAGE'],
                            httpStatus.NOT_FOUND,
                            true
                        )
                    );
            })
            .catch(next);
    },
    get: function (req, res) {
        return res.send(req.maestro);
    },
    create: function (req, res, next) {
        const maestro = new Maestro({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            degree: req.body.degree,
        });

        maestro.url = `${maestro.nombre.trim()} ${maestro.apellido.trim()}`
            .split(/[\s ,\.'-]+/)
            .filter(Boolean)
            .join('-');

        MaestroCounter.findOneAndUpdate(
            { url: maestro.url },
            { $inc: { count: 1 } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )
            .then((counter) => {
                maestro.count = counter.count;
                return maestro.save();
            })
            .then((savedMaestro) => res.json(savedMaestro))
            .catch(next);

        /*
        maestro
            .save()
            .then((savedMaestro) => res.json(savedMaestro))
            .catch(next);
            */
    },
};
