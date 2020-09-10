const express        = require('express');
const app            = express();
const Dotenv         = require('dotenv');
const winston        = require('winston');

Dotenv.config();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();


const port = process.env.port || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));

