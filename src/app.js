const express = require('express');
const sqlite = require('sqlite3');

const { getDBFileName } = require('../config');
const DataStore = require('./dataStore');
const Users = require('./models/users');

const { addUser, getUser } = require('./handlers');

const app = express();

const dbFileName = `./database/${getDBFileName()}`;
const db = new sqlite.Database(dbFileName);

const dataStore = new DataStore(db);

app.locals.users = new Users(dataStore);

app.use(express.json());

app.post('/addUser', addUser);
app.get('/getUser', getUser);

module.exports = app;
