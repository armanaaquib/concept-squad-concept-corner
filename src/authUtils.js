const request = require('request');
const { getClientId, getClientSecret } = require('../config');

const getAccessToken = function(code) {
  return new Promise(resolve => {
    request.post(
      {
        url: 'https://github.com/login/oauth/access_token',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          client_id: getClientId(),
          client_secret: getClientSecret(),
          code
        })
      },
      (error, response, body) => {
        const parsedBody = JSON.parse(body);
        const accessToken = parsedBody['access_token'];
        resolve(accessToken);
      }
    );
  });
};

const getUserDetail = function(accessToken) {
  return new Promise(resolve => {
    request.get(
      {
        url: 'https://api.github.com/user',
        headers: {
          Authorization: `token ${accessToken}`,
          'User-Agent': 'node.js'
        }
      },
      (error, response, body) => {
        resolve(JSON.parse(body));
      }
    );
  });
};

const getGithubUserDetails = async function(code, users) {
  const accessToken = await getAccessToken(code);
  const userDetails = await getUserDetail(accessToken);
  const user = await users.getUserDetail(userDetails.login, 'github');
  console.log(user);
  return { user, userDetails };
};

module.exports = {
  getGithubUserDetails
};
