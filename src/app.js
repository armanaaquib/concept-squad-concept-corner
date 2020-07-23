const express = require('express');
const request = require('request');

const handlers = require('./handlers');
const env = require('../env.json');
const app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', handlers.loadHomePage);
app.get('/postQuestion', handlers.servePostQuestionPage);
const getAccessToken = function (code) {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: 'https://github.com/login/oauth/access_token',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: env.clientId,
          client_secret: env.clientSecret,
          code,
        }),
      },
      (error, response, body) => {
        const { access_token } = JSON.parse(body);
        resolve(access_token);
      }
    );
  });
};

const getUserDetail = function (access_token) {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: 'https://api.github.com/user',
        headers: {
          Authorization: `token ${access_token}`,
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
  getAccessToken(code).then((access_token) =>
    getUserDetail(access_token).then((userDetail) => {
      dataStore.isRegisteredUser(userDetail.id).then((result) => {
        console.log(result);
        !result && res.render('confirm', {});
        res.render('home', {});
      });
    })
  );
});

module.exports = app;
