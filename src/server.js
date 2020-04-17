require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 8080;

/*
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'access-control-allow-origin,content-type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
*/
var connectWithRetry = () => {
    return mongoose.connect(
        process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        },
        (err) => {
            if (err) {
                console.error(
                    'Failed to connect to mongodb on startup - retrying in 5 sec',
                    err
                );
                setTimeout(connectWithRetry, 5000);
            }
        }
    );
};

connectWithRetry();

const db = mongoose.connection;

db.on('connected', () => {
    app.listen(port, () => {
        console.log(`Connected to ${process.env.MONGO_URI}`);
        console.log(`Server running on http://localhost:${port}`);
    });
});
