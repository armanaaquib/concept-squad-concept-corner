const express = require('express');
const session = require('express-session');
const sqlite = require('sqlite3').verbose();
const config = require('../config');
const DataStore = require('../database/dataStore');
const handlers = require('./handlers');
const Questions = require('../models/questions');
const Users = require('../models/users');
const app = express();

const db = new sqlite.Database(config.getDBFilePath());
const dataStore = new DataStore(db);
app.locals.questions = new Questions(dataStore);
app.locals.users = new Users(dataStore);
app.locals.user = { username: 'michel' };

app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.json());
app.use(
  session({
    secret: config.getSessionSecretKey(),
    resave: true,
    saveUninitialized: true,
  })
);
app.get('/', handlers.loadHomePage);
app.get('/postQuestion', handlers.servePostQuestionPage);
app.get('/question/:questionId', handlers.serveQuestionPage);
app.get('/hasUser/:username', handlers.hasUser);
//-- [TODO] need to change name
app.post('/ConfirmAndSignUp', handlers.confirmDetails);
app.get('/confirmUser', handlers.confirmUser);
app.post('/postQuestion', handlers.postQuestion);

module.exports = app;
