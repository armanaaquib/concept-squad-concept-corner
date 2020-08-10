const { getAuthLink } = require('../../config');

const serveHomePage = (req, res) => {
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

const addSession = (req, res, next) => {
  const { sId } = req.cookies;
  const { sessions } = req.app.locals;
  let session = sessions.getSession(sId);
  if (!session) {
    const newSid = sessions.createSession();
    session = sessions.getSession(newSid);
    res.cookie('sId', newSid);
  }
  req.session = session;
  next();
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

const getComment = (req, res) => {
  const { commentId } = req.params;
  const { dataStore } = req.app.locals;
  dataStore.getComment(commentId).then((comment) => {
    res.json(comment);
  });
};

module.exports = {
  serveHomePage,
  addSession,
  ensureLogin,
  serveErrorPage,
  getComment,
};
