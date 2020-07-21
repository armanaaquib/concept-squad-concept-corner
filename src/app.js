const express = require('express');
const sqlite = require('sqlite3');

const { getDB } = require('../config');
const Users = require('./models/users');

const { addUser, getUser } = require('./handlers');

const app = express();

const dbFile = `./database/${getDB()}`;
const db = new sqlite.Database(dbFile);
app.locals.users = new Users(db);

app.use(express.json());

app.post('/addUser', addUser);
app.get('/getUser', getUser);

module.exports = app;
