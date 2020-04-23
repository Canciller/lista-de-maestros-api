const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { ValidationError } = require('express-validation');
const APIError = require('./utils/APIError');

const authRoutes = require('./api/components/auth/auth.route');
const userRoutes = require('./api/components/user/user.route');
const maestroRoutes = require('./api/components/maestro/maestro.route');
const notFoundRoute = require('./api/components/notFound/notFound.route');

const app = express();

// Allow Cross-Origin requests
app.use(
    cors({
        origin: 'http://localhost:3000',
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
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/maestros', maestroRoutes);
app.use('/api/v1/users', userRoutes);

app.use('*', notFoundRoute);

app.use(function (error, req, res, next) {
    if (res.headersSent) return next(error);

    console.error(error);

    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    if (error.status) res.status(error.status);
    else if (error.statusCode) res.status(error.statusCode);

    if (error instanceof mongoose.Error) {
        res.json({ error });
    } else if (error instanceof APIError && error.isPublic) {
        res.json({
            error: {
                name: error.name,
                message: error.message,
                status: error.status,
            },
        });
    } else if (error instanceof ValidationError) {
        res.json({ error });
    } else {
        res.json({ error });
    }
});

module.exports = app;
