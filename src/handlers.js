const env = require('../env.json');

const loadHomePage = function (req, res, next) {
  res.render('home', { authHref: `${env.authLink}${env.clientId}` });
  res.end();
};
const servePostQuestionPage = (req, res) => {
  res.render('postQuestion');
  res.end();
};

module.exports = { loadHomePage, servePostQuestionPage };
