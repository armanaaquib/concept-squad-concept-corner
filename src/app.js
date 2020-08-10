const express = require('express');
const sqlite = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');
const knex = require('knex');
const knexFile = require('../knexfile').development;
const sessions = require('./sessions');
const config = require('../config');

const answerRouter = require('./routes/answerRoutes');
const questionRouter = require('./routes/questionRoutes');
const userRouter = require('./routes/userRoutes');

const handlers = require('./handlers/handlers');
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

app.use(handlers.addSession);

app.use('/answer', answerRouter);
app.use('/question', questionRouter);
app.use('/user', userRouter);

app.get('/', handlers.serveHomePage);
app.get('/comment/:commentId', handlers.getComment);

module.exports = app;
