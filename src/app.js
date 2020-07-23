const express = require('express');
const handlers = require('./handlers');
const app = express();

app.set('view engine', 'pug');
app.get('/', handlers.loadHomePage);
module.exports = app;
