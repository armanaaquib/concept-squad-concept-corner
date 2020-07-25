const { getAuthLink } = require('../config');
const authUtils = require('./authUtils');

const loadHomePage = function (req, res) {
  const { user } = req.session;
  const { users, questions } = req.app.locals;

  users.hasUser(user).then((userName) => {
    questions.all().then((questions) => {
      res.render('index', {
        authLink: getAuthLink(),
        user: userName,
        questions,
      });
      res.end();
    });
  });
};

const hasUser = function (req, res) {
  const { username } = req.params;
  const { users } = req.app.locals;
  users.hasUser(username).then((userName) => {
    res.json({ available: !userName });
  });
};

const servePostQuestionPage = (req, res) => {
  const cancelUrl = req.session.redirectURL || '/';
  res.render('postQuestion', { cancelUrl });
  res.end();
};

const serveQuestionPage = (req, res) => {
  const { questionId } = req.params;
  const { questions } = req.app.locals;
  questions.get(questionId).then((question) => {
    res.render('question', { question });
    res.end();
  });
};

const postQuestion = (req, res) => {
  const { title, description } = req.body;
  const { user, questions } = req.app.locals;
  questions
    .add({ username: user.username, title, description })
    .then((questionId) => {
      res.json(JSON.stringify(questionId));
      res.end();
    });
};

const confirmDetails = (req, res) => {
  const { userDetails } = req.body;
  const { users } = req.app.locals;
  users.add(userDetails);
  req.session.user = userDetails.username;
  res.end();
};

const confirmUser = (req, res) => {
  const { code } = req.query;
  const { users } = req.app.locals;
  if (!code) {
    res.sendStatus(404);
    return;
  }
  authUtils.getGithubUserDetails(code, users).then(({ user, userDetails }) => {
    if (!user) {
      userDetails.authSource = 'github';
      res.render('confirm', { userDetails, authHref: getAuthLink() });
      res.end();
    } else {
      req.session.user = user.username;
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
  confirmDetails,
  hasUser,
};
