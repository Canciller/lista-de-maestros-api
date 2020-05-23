const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const httpStatus = require('http-status');

const APIError = require('./util/APIError');
const ValidationError = require('./util/ValidationError');

const APIRouter = require('express').Router();

const notFoundRoute = require('./api/components/not-found/not-found.route');

const authRoutes = require('./api/components/auth/auth.route');

const userRoutes = require('./api/components/user/user.route');
const maestroRoutes = require('./api/components/maestro/maestro.route');

const questionRoutes = require('./api/components/question/question.route');
const categoryRoutes = require('./api/components/category/category.route');

const universidadRoutes = require('./api/components/universidad/universidad.route');
const facultadRoutes = require('./api/components/facultad/facultad.route');
const materiaRoutes = require('./api/components/materia/materia.route');

const app = express();

// Allow Cross-Origin requests
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'https://lista-de-maestros.herokuapp.com',
        ],
        credentials: true,
    })
);

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API
/*
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour',
});

app.use('/api', limiter);
*/

// Body parser, reading data from body into req.body
app.use(
    express.json({
        limit: '15kb',
    })
);

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());

app.use(cookieParser());

// Routes
APIRouter.use('/auth', authRoutes)
    .use('/maestros', maestroRoutes)
    .use('/users', userRoutes)
    .use('/questions', questionRoutes)
    .use('/categories', categoryRoutes)
    .use('/materias', materiaRoutes)
    .use('/universidades', universidadRoutes)
    .use('/facultades', facultadRoutes);

app.use('/api/v1', APIRouter);

app.use('*', notFoundRoute);

app.use(function (error, req, res, next) {
    if (res.headersSent) return next(error);

    console.error(error);

    let status = httpStatus.INTERNAL_SERVER_ERROR;
    if (error.status) status = error.status;
    else if (error.statusCode) status = error.statusCode;

    res.status(status);

    if (error.name === 'MongoError') {
        //console.log('MongoError');

        res.json({
            error: {
                message: httpStatus[500],
                status,
            },
        });
    } else if (error instanceof ValidationError) {
        console.log('ValidationError');

        res.json({
            error: {
                name: error.name,
                message: {
                    [error.path]: error.message
                },
                status,
            },
        });
    } else if (error instanceof mongoose.Error.ValidationError) {
        //console.log('MongooseValidationError');

        let messages = {};

        for (let key in error.errors) {
            messages[key] = error.errors[key].message;
        }

        res.json({
            error: {
                name: error.name,
                message: messages,
                status,
            },
        });
    } else if (error instanceof APIError && error.isPublic) {
        //console.log('APIError');

        res.json({
            error: {
                name: error.name,
                message: error.message,
                status,
            },
        });
    } else {
        res.json({ error });
    }
});

module.exports = app;
