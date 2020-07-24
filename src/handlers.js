const request = require('request');
const { getAuthLink, getClientId, getClientSecret } = require('../config');
const { use } = require('chai');

const loadHomePage = function(req, res) {
  res.render('home', { authHref: getAuthLink()});
  res.end();
};
const servePostQuestionPage = (req, res) => {
  res.render('postQuestion');
  res.end();
};

const postQuestion = (req, res) => {
  const { title, description } = req.body;
  const { user, questions } = req.app.locals;
  questions
    .add({ username: user.username, title, description })
    .then(questionId => {
      res.json(JSON.stringify(questionId));
      res.end();
    });
};
const getAccessToken = function (code) {
  return new Promise((resolve) => {
    console.log(getClientId(), 'secret', getClientSecret());
    request.post(
      {
        url: 'https://github.com/login/oauth/access_token',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          'client_id': getClientId(),
          'client_secret': getClientSecret(),
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
const getGithubUserDetails = async function(code, dataStore){
  const accessToken = await getAccessToken(code);
  const userDetails = await getUserDetail(accessToken);
  const user = await dataStore.getRegisteredUser(userDetails.id);
  return {user, userDetails};
};
const authorize = (req, res) => {
  const { code } = req.query;
  const { dataStore } = req.app.locals;
  if (!code) {
    res.send('No code found');
  }
  getGithubUserDetails(code, dataStore).then(({user, userDetails}) => {
    if(!user){
      res.render('confirm', {userDetails});
      res.end();
    }else{
      res.render('home', {user});
      res.end();
    }
  });
};

module.exports = { 
  loadHomePage, 
  servePostQuestionPage, 
  postQuestion, 
  authorize };
