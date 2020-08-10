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
  ensureLogin,
  serveErrorPage,
  getComment,
};
