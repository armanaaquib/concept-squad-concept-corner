const env = require('../env.json');

const loadHomePage = function (req, res) {
  res.render('home', { authHref: `${env.authLink}${env.clientId}` });
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
    .then(console.log);
};

module.exports = { loadHomePage, servePostQuestionPage, postQuestion };
