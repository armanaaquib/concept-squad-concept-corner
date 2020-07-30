const express = require('express');
const sessions = require('./sessions');
const cookieParser = require('cookie-parser');
const sqlite = require('sqlite3').verbose();
const config = require('../config');

const handlers = require('./handlers');
const DataStore = require('../database/dataStore');
const { ensureLogin } = require('./handlers');

const app = express();

const db = new sqlite.Database(config.getDBFilePath());
app.locals.dataStore = new DataStore(db);
app.locals.sessions = sessions;

app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json({ limit: '12mb' }));

app.use((req, res, next) => {
  const { sId } = req.cookies;
  const { sessions } = app.locals;
  let session = sessions.getSession(sId);
  if (!session) {
    const newSid = sessions.createSession();
    session = sessions.getSession(newSid);
    res.cookie('sId', newSid);
  }
  req.session = session;
  next();
});

app.get('/', handlers.serveHomePage);
app.get('/question/:questionId', handlers.serveQuestionPage);

app.post('/signUp', handlers.signUp);
app.get('/confirmUser', handlers.confirmUser);
app.get('/hasUser/:username', handlers.hasUser);

app.get('/postQuestion', handlers.ensureLogin, handlers.servePostQuestionPage);
app.get(
  '/getTagSuggestion/:tagName',
  handlers.ensureLogin,
  handlers.getTagSuggestion
);
app.post('/postQuestion', handlers.ensureLogin, handlers.postQuestion);
app.post('/postAnswer', handlers.ensureLogin, handlers.postAnswer);
app.post('/markAccepted', handlers.ensureLogin, handlers.markAccepted);
app.get('/getVote/:answerId', ensureLogin, handlers.getVote);

module.exports = app;
