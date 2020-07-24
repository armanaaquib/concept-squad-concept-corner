const request = require('request');
const { getAuthLink, getClientId, getClientSecret } = require('../config');

const loadHomePage = function(req, res) {
  const {user} = req.cookies;
  res.render('home', { authLink: getAuthLink(), user});
  res.end();
};

const servePostQuestionPage = (req, res) => {
  const cancelUrl = req.session.redirectURL || '/';
  res.render('postQuestion', { cancelUrl });
  res.end();
};

const serveQuestionPage = (req, res) => {
  res.render('question');
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

const confirmDetails = (req, res) => {
  const {userDetails} = req.body;
  const {users} = req.app.locals;
  users.add(userDetails);
  res.cookie('isLoggedIn', 'yes');
  res.cookie('user', userDetails.username);
  res.end();
};

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
          'client_id': getClientId(),
          'client_secret': getClientSecret(),
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
  return { user, userDetails };
};

const confirmUser = (req, res) => {
  const { code } = req.query;
  const { users } = req.app.locals;
  if (!code) {
    res.send('No code found');
  }
  getGithubUserDetails(code, users).then(({user, userDetails}) => {
    if(!user){
      res.cookie('isLoggedIn', 'No');
      userDetails.authSource = 'github';
      res.render('confirm', {userDetails, authHref: getAuthLink()});
      res.end();
    } else {
      res.cookie('isLoggedIn', 'yes');
      res.cookie('user', userDetails.username);
      res.redirect(302, '/');
    }
  });
};

module.exports = {
  loadHomePage,
  servePostQuestionPage,
  serveQuestionPage,
  postQuestion,
  confirmUser,
  confirmDetails
};
