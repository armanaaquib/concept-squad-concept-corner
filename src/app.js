const express = require('express');
const request = require('request');
const sqlite = require('sqlite3').verbose();
const config = require('../config');
const env = require('../env.json');
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
const getAccessToken = function (code) {
  return new Promise((resolve) => {
    request.post(
      {
        url: 'https://github.com/login/oauth/access_token',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          clientId: env.clientId,
          clientSecret: env.clientSecret,
          code,
        }),
      },
      (error, response, body) => {
        const { accessToken } = JSON.parse(body);
        resolve(accessToken);
      }
    );
  });
};

const getUserDetail = function (accessToken) {
  return new Promise((resolve) => {
    request.get(
      {
        url: 'https://api.github.com/user',
        headers: {
          Authorization: `token ${accessToken}`,
          'User-Agent': 'node.js',
        },
      },
      (error, response, body) => {
        resolve(JSON.parse(body));
      }
    );
  });
};

app.get('/authorize', (req, res) => {
  const { code } = req.query;
  const { dataStore } = req.app.locals;
  if (!code) {
    res.send('No code found');
  }
  getAccessToken(code).then((accessToken) =>
    getUserDetail(accessToken).then((userDetail) => {
      dataStore.isRegisteredUser(userDetail.id).then((result) => {
        !result && res.render('confirm', {});
        res.render('home', {});
      });
    })
  );
});
app.post('/postQuestion', handlers.postQuestion);

module.exports = app;
