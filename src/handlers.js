const loadHomePage = function (req, res) {
  res.render('home', {});
  res.end();
};

const servePostQuestionPage = (req, res) => {
  res.render('postQuestion');
  res.end();
};

module.exports = { loadHomePage, servePostQuestionPage };
