'use strict';

const express = require('express');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const logger = require('morgan');
const czmlController = require('./controllers/CzmlController');
const speechController = require('./controllers/speech-controller');
const app = express();
const router = express.Router();

// Templates
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// Application Settings
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routing
app.use('/scripts', express.static('./builds'));
app.use('/', express.static('./server/public'));
app.use('/', router);

router.get('/', (req, res) => {
    res.render('index', {});
});

router.get('/api/czml/:command/:option?', (req, res) => {
    czmlController.handler(req, res);
});
router.get('/api/speech/:id/:timestamp', (req, res) => {
    speechController.handler(req, res);
});

if (process.env === 'development') {
    app.use(errorhandler());
}

module.exports = app;
