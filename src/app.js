const express = require('express');
const sessions = require('./sessions');
const cookieParser = require('cookie-parser');
const knex = require('knex');
const knexFile = require('../knexfile').development;
const sqlite = require('sqlite3').verbose();
const config = require('../config');
const answerRouter = require('./answerRoutes');
const questionRouter = require('./questionRoutes');

const handlers = require('./handlers');
const DataStore = require('../database/dataStore');

const app = express();

const db = new sqlite.Database(config.getDBFilePath());
const newdb = knex(knexFile);
app.locals.dataStore = new DataStore(db, newdb);
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

app.use('/answer', answerRouter);
app.use('/question', questionRouter);

app.get('/', handlers.serveHomePage);

app.post('/signUp', handlers.signUp);
app.get('/confirmUser', handlers.confirmUser);
app.get('/hasUser/:username', handlers.hasUser);
app.get('/profile/:username', handlers.serveProfilePage);
app.get(
  '/getTagSuggestion/:tagName',
  handlers.ensureLogin,
  handlers.getTagSuggestion
);

app.get('/logout', handlers.ensureLogin, handlers.logout);
app.get('/comment/:commentId', handlers.getComment);

module.exports = app;
