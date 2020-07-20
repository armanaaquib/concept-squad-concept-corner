const express = require('express');
const request = require('request');

const client_id = 'client_id';
const client_secret = 'client_secret';

const app = express();

app.use(express.static('public'));

const getAccessToken = function(code) {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: 'https://github.com/login/oauth/access_token',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          client_id,
          client_secret,
          code
        })
      },
      (error, response, body) => {
        const { access_token } = JSON.parse(body);
        resolve(access_token);
      }
    );
  });
};

const getUserDetail = function(access_token) {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: 'https://api.github.com/user',
        headers: {
          Authorization: `token ${access_token}`,
          'User-Agent': 'node.js'
        }
      },
      (error, response, body) => {
        resolve(JSON.parse(body));
      }
    );
  });
};

app.get('/callback', (req, res) => {
  const { query } = req;
  const { code } = query;
  if (!code) {
    res.send('No code found');
  }
  getAccessToken(code).then(access_token =>
    getUserDetail(access_token).then(userDetail => {
      res.send(JSON.stringify(userDetail, null, 2));
    })
  );
});

app.get('/token', (req, res) => {
  console.log(req.query.access_token);
});

app.listen(3000, () => {
  console.log('listening to PORT :', 3000);
});
