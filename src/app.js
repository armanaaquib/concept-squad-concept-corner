const express = require('express');
const session = require('express-session');
const sqlite = require('sqlite3').verbose();
const config = require('../config');

const handlers = require('./handlers');
const DataStore = require('../database/dataStore');

const Users = require('../models/users');

const app = express();

const db = new sqlite.Database(config.getDBFilePath());
app.locals.dataStore = new DataStore(db);
const dataStore = new DataStore(db);

app.locals.users = new Users(dataStore);

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.json({ limit: '12mb' }));
app.use(
  session({
    secret: config.getSessionSecretKey(),
    resave: true,
    saveUninitialized: true,
  })
);

app.get('/', handlers.loadHomePage);
app.get('/question/:questionId', handlers.serveQuestionPage);

app.post('/confirmAndSignUp', handlers.confirmDetails);
app.get('/confirmUser', handlers.confirmUser);

app.get('/postQuestion', handlers.servePostQuestionPage);
app.get('/hasUser/:username', handlers.hasUser);
app.post('/postQuestion', handlers.postQuestion);
app.post('/postAnswer', handlers.postAnswer);

module.exports = app;
