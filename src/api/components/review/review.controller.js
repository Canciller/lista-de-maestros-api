const Review = require('./review.model');
const Maestro = require('../maestro/maestro.model');
const Materia = require('../materia/materia.model');
const User = require('../user/user.model');
const NotFoundError = require('../../../util/NotFoundError');
const ValidationError = require('../../../util/ValidationError');
const strings = require('./review.strings');

const maxScore = 5,
    minScore = 1;

module.exports = {
    load: function (req, res, next, id) {
        Review.findById(id)
            .then((review) => {
                req.review = review;
                if (review) next();
                else next(new NotFoundError());
            })
            .catch(next);
    },
    list: function (req, res, next) {
        const { limit = 50, skip = 0 } = req.query;
        Review.list({ limit, skip })
            .then((reviews) => res.json(reviews))
            .catch(next);
    },
    get: function (req, res) {
        return res.send(req.review);
    },
    create: function (req, res, next) {
        const maestro = req.body.maestro;
        const materia = req.body.materia;
        const username = req.body.username;
        const comment = req.body.comment;
        const contents = req.body.review;

        const calcScores = async function () {
            let scores = undefined;

            if (contents && contents instanceof Object) {
                scores = {};

                for (let key in contents) {
                    const category = contents[key];

                    if (category instanceof Object) {
                        const keys = Object.keys(category);

                        const total = keys.length;
                        let score = 0;

                        for (let key in category) {
                            const question = category[key];
                            score += parseInt(question);
                        }

                        score = total > 0 ? score / total : 0;
                        scores[key] = {
                            value: score,
                            total,
                        };
                    }
                }
            }

            return scores;
        };

        const review = new Review({
            maestro,
            materia,
            username,
            comment,
        });

        let maestroFound;
        let scoresSaved;
        let reviewSaved;

        User.findOne({ username })
            .then((user) => {
                if (user) return Maestro.findById(maestro);
                else throw new NotFoundError('El usuario no existe..');
            })
            .then((maestro) => {
                if (maestro) {
                    maestroFound = maestro;
                    return Materia.findById(materia);
                } else throw new NotFoundError('El maestro no existe.');
            })
            .then((materia) => {
                if (materia) return calcScores();
                else throw new NotFoundError('El maestro no existe.');
            })
            .then((scores) => {
                if (scores) {
                    let mean = 0;
                    for (const key in scores) {
                        const score = scores[key];
                        review[key] = score.value;
                        mean += score.value;
                    }

                    mean /= Object.keys(scores).length;
                    console.log(scores);

                    scoresSaved = scores;

                    review.mean = mean;
                    return review.save();
                } else
                    throw new NotFoundError(
                        '¡He listillo que crees que estas haciendo!'
                    );
            })
            .then((review) => {
                reviewSaved = review;

                // Maestro scores update
                let maestroScores = maestroFound.scores;
                let maestroTotalReviews = maestroFound.totalReviews;

                for (let key in scoresSaved) {
                    if (!(key in maestroScores)) continue;

                    const reviewScore = scoresSaved[key];
                    const maestroScore = maestroScores[key];

                    const maestroSumScore = maestroScore * maestroTotalReviews;
                    let newScore = maestroSumScore + reviewScore.value;

                    newScore /= maestroTotalReviews + 1;
                    maestroScores[key] = newScore;
                }

                maestroTotalReviews++;

                return Maestro.update(
                    {
                        _id: maestroFound._id,
                    },
                    {
                        totalReviews: maestroTotalReviews,
                        scores: maestroScores,
                        $push: { reviews: reviewSaved['_id'] },
                    },
                    {
                        new: true
                    }
                );
            })
            .then((maestroUpdated) => {
                return res.json(reviewSaved);
            })
            .catch(next);
    },
    remove: function (req, res, next) {
        const review = req.review;
        review
            .remove()
            .then((deletedReview) => res.json(deletedReview))
            .catch(next);
    },
};
