const express = require('express');
const sessions = require('./sessions');
const cookieParser = require('cookie-parser');
const sqlite = require('sqlite3').verbose();
const config = require('../config');

const handlers = require('./handlers');
const DataStore = require('../database/dataStore');

const app = express();

const db = new sqlite.Database(config.getDBFilePath());
app.locals.dataStore = new DataStore(db);

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json({ limit: '12mb' }));

app.use((req, res, next) => {
  const { sId } = req.cookies;
  let session = sessions.getSession(sId);
  if (!session) {
    const newSid = sessions.createSession();
    session = sessions.getSession(newSid);
    res.cookie('sId', newSid);
  }
  req['session'] = session;
  next();
});

app.get('/', handlers.loadHomePage);
app.get('/question/:questionId', handlers.serveQuestionPage);

app.post('/confirmAndSignUp', handlers.confirmDetails);
app.get('/confirmUser', handlers.confirmUser);

app.get('/postQuestion', handlers.servePostQuestionPage);
app.get('/hasUser/:username', handlers.hasUser);
app.post('/postQuestion', handlers.postQuestion);
app.post('/postAnswer', handlers.postAnswer);

module.exports = app;
