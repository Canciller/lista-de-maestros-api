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
const APIError = require('./utils/APIError');

const userRoutes = require('./api/components/user/user.route');
const authRoutes = require('./api/components/auth/auth.route');
const notFoundRoute = require('./api/components/notFound/notFound.route');

const app = express();

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour',
});

app.use('/api', limiter);

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
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

app.use('*', notFoundRoute);

app.use(function (err, req, res, next) {
    if (res.headersSent) return next(err);

    console.error(err);

    res.status(httpStatus.INTERNAL_SERVER_ERROR);

    if (err instanceof mongoose.Error) {
        res.json({
            ...err,
        });
    } else if (err instanceof APIError && err.isPublic) {
        res.status(err.status);

        res.json({
            error: {
                name: err.name,
                message: err.message,
                status: err.status,
            },
        });
    } else {
        res.json({
            error: err,
        });
    }
});

module.exports = app;
