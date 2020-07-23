const express = require('express');
const handlers = require('./handlers');

const app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', handlers.loadHomePage);
app.get('/postQuestion', handlers.servePostQuestionPage);

module.exports = app;
