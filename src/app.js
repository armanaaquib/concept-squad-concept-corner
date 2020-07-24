const express = require('express');
const sqlite = require('sqlite3').verbose();
const config = require('../config');
const DataStore = require('../database/dataStore');
const handlers = require('./handlers');
const Questions = require('../models/questions');
const app = express();

const db = new sqlite.Database(config.getDBFilePath());
const dataStore = new DataStore(db);

app.locals.questions = new Questions(dataStore);
app.locals.user = { username: 'michel' };

app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.json());
app.get('/', handlers.loadHomePage);
app.get('/postQuestion', handlers.servePostQuestionPage);
app.get('/question/:questionId', handlers.serveQuestionPage);
app.get('/authorize', handlers.authorize);
app.post('/postQuestion', handlers.postQuestion);

module.exports = app;
