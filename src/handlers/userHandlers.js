const formidable = require('formidable');
const authUtils = require('../authUtils');
const { serveErrorPage } = require('./handlers');
const { getAuthLink } = require('../../config');

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

const hasUser = function (req, res) {
  const { username } = req.params;
  const { dataStore } = req.app.locals;
  dataStore.getUser(username).then((user) => {
    res.json({ available: user ? false : true });
  });
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

module.exports = {
  signUp,
  confirmUser,
  hasUser,
  logout,
  serveProfilePage,
};
