const formidable = require('formidable');
const authUtils = require('./authUtils');
const { getAuthLink } = require('../config');

const loadHomePage = function (req, res) {
  const { user } = req.session;
  const { users, dataStore } = req.app.locals;
  users.hasUser(user).then((userDetails) => {
    const { username, profilePic } = userDetails;
    req.session.username = username;
    req.session.profilePic = profilePic;
    dataStore.getQuestions().then((questions) => {
      res.render('index', {
        authLink: getAuthLink(),
        user: username,
        questions,
        profilePic,
      });
      res.end();
    });
  });
};

const confirmDetails = (req, res) => {
  const { users } = req.app.locals;
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, userInfo) {
    if (err) {
      res.end();
    }
    users.add(userInfo);
    req.session.user = userInfo.username;
    res.end();
  });
};

const confirmUser = (req, res) => {
  const { code } = req.query;
  const { users } = req.app.locals;
  if (!code) {
    res.sendStatus(404);
    return;
  }
  authUtils.getGithubUserDetails(code, users).then(({ user, userDetails }) => {
    if (!user || !user.username) {
      userDetails.authSource = 'github';
      res.render('confirm', { userDetails, authHref: getAuthLink() });
      res.end();
    } else {
      req.session.user = user.username;
      res.redirect(302, '/');
    }
  });
};

const hasUser = function (req, res) {
  const { username } = req.params;
  const { users } = req.app.locals;
  users.hasUser(username).then((user) => {
    res.json({ available: !user.username });
  });
};

const servePostQuestionPage = (req, res) => {
  const { username, profilePic } = req.session;
  //need a middleware
  if (!username) {
    res.redirect('/');
    return;
  }
  const cancelUrl = req.session.redirectURL || '/';
  res.render('postQuestion', { cancelUrl, user: username, profilePic });
  res.end();
};

const serveQuestionPage = (req, res) => {
  const { questionId } = req.params;
  const { dataStore } = req.app.locals;
  const { username, profilePic } = req.session;
  dataStore.getQuestion(questionId).then(async (question) => {
    const answerList = await dataStore.getAnswers(questionId);
    res.render('question', {
      question,
      user: username,
      profilePic,
      authLink: getAuthLink(),
      answers: answerList,
    });
    res.end();
  });
};

const postQuestion = (req, res) => {
  const { title, description } = req.body;
  const { username } = req.session;
  const { dataStore } = req.app.locals;
  dataStore.addQuestion({ username, title, description }).then((questionId) => {
    res.json(questionId);
    res.end();
  });
};

const postAnswer = (req, res) => {
  const { questionId, answer } = req.body;
  const { username } = req.session;
  const { dataStore } = req.app.locals;
  dataStore
    .addAnswer(username, questionId, answer)
    .then(() => res.redirect(`/question/${questionId}`));
};

module.exports = {
  loadHomePage,
  servePostQuestionPage,
  serveQuestionPage,
  postQuestion,
  confirmUser,
  confirmDetails,
  hasUser,
  postAnswer,
};
