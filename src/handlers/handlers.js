const formidable = require('formidable');
const authUtils = require('../authUtils');
const { getAuthLink } = require('../../config');

const serveHomePage = function (req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getQuestions().then((questions) => {
    res.render('index', {
      user: req.session.user,
      questions,
      authLink: getAuthLink(),
    });
    res.end();
  });
};

const hasUser = function (req, res) {
  const { username } = req.params;
  const { dataStore } = req.app.locals;
  dataStore.getUser(username).then((user) => {
    res.json({ available: user ? false : true });
  });
};

const signUp = (req, res) => {
  const { dataStore } = req.app.locals;
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, userInfo) {
    if (err) {
      res.status(400);
      res.end();
      return;
    }
    dataStore.addUser(userInfo).then(() => {
      req.session.user = {
        username: userInfo.username,
        profilePic: userInfo.profilePic,
      };
      res.end();
    });
  });
};

const confirmUser = (req, res) => {
  const { code } = req.query;
  const { dataStore } = req.app.locals;
  if (!code) {
    serveErrorPage(res, 403, 'Access Denied');
    return;
  }
  authUtils
    .getAccessToken(code)
    .then(authUtils.getUserDetail)
    .then(async (userDetail) => {
      const { login } = userDetail;
      const user = await dataStore.getRegisteredUser(login, 'github');
      if (user) {
        req.session.user = {
          username: user.username,
          profilePic: user.profilePic,
        };
        res.redirect('/');
      } else {
        res.render('confirm', { userDetail });
      }
    });
};

const ensureLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/');
    return;
  }
  next();
};

const serveErrorPage = (res, status, message) => {
  res.status(status);
  res.render('notFound', { message });
  res.end();
};

const logout = (req, res) => {
  const { sId } = req.cookies;
  const { sessions } = req.app.locals;
  sessions.removeSession(sId);
  res.clearCookie('sId');
  res.redirect('/');
};

const serveProfilePage = (req, res) => {
  const { dataStore } = req.app.locals;
  const { username } = req.params;
  dataStore.getUser(username).then((user) => {
    res.render('profile', { user, authHref: getAuthLink() });
  });
};

const getComment = (req, res) => {
  const { commentId } = req.params;
  const { dataStore } = req.app.locals;
  dataStore.getComment(commentId).then((comment) => {
    res.json(comment);
  });
};

module.exports = {
  serveHomePage,
  confirmUser,
  signUp,
  hasUser,
  ensureLogin,
  serveErrorPage,
  logout,
  serveProfilePage,
  getComment,
};
