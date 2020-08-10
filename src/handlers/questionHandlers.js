const { getAuthLink } = require('../../config');
const { serveErrorPage } = require('./handlers');

const serveQuestionPage = (req, res) => {
  const { questionId } = req.params;
  const { dataStore } = req.app.locals;

  dataStore.getQuestion(questionId).then(async (question) => {
    if (!question) {
      serveErrorPage(res, 404, 'Question not found.');
      return;
    }
    const answerList = await dataStore.getAnswers(questionId);
    res.render('question', {
      user: req.session.user,
      question,
      answers: answerList,
      authLink: getAuthLink(),
    });
  });
};

const servePostQuestionPage = (req, res) => {
  const cancelUrl = req.session.redirectURL || '/';
  res.render('postQuestion', {
    cancelUrl,
    user: req.session.user,
    authHref: getAuthLink(),
  });
  res.end();
};

const getTagSuggestion = (req, res) => {
  const { tagName } = req.params;
  const { dataStore } = req.app.locals;
  dataStore.getTagSuggestion(tagName).then((matchingTags) => {
    res.json(matchingTags);
  });
};

const postQuestion = (req, res) => {
  const { title, description, tags } = req.body;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore
    .addQuestion({ username, title, description, tags })
    .then((questionId) => {
      res.json(questionId);
    });
};

const serveEditQuestion = (req, res) => {
  const { questionId } = req.params;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore.getQuestion(questionId).then((question) => {
    if (question.username === username) {
      res.render('editQuestion', {
        question,
        user: req.session.user,
      });
    } else {
      serveErrorPage(res, 403, 'Access Denied');
    }
  });
};

const updateQuestion = (req, res) => {
  const { questionId, title, description, tags } = req.body;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore.getQuestion(questionId).then((question) => {
    if (question.username === username) {
      dataStore
        .updateQuestion({ questionId, title, description, tags })
        .then((questionId) => {
          res.json(questionId);
        });
    } else {
      serveErrorPage(res, 403, 'Access Denied');
    }
  });
};

const addQuestionComment = (req, res) => {
  const { questionId, comment } = req.body;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore
    .addQuestionComment(username, questionId, comment)
    .then((commentId) => {
      res.json(commentId);
    });
};

const getCommentsOfQuestion = (req, res) => {
  const { questionId } = req.params;
  const { dataStore } = req.app.locals;
  dataStore.getCommentsOfQuestion(questionId).then((comments) => {
    res.json(comments);
  });
};

const deleteQuestionComment = (req, res) => {
  const comment = req.body;
  const { dataStore } = req.app.locals;
  const { username } = req.session.user;
  if (comment.username !== username) {
    serveErrorPage(res, 403, 'Access Denied');
    return;
  }
  dataStore.deleteQuestionComment(comment.commentId).then((isDeleted) => {
    res.json({ isDeleted });
  });
};

const deleteQuestion = (req, res) => {
  const question = req.body;
  const { dataStore } = req.app.locals;
  const { username } = req.session.user;
  if (question.username !== username) {
    serveErrorPage(res, 403, 'Access Denied');
    return;
  }
  dataStore.deleteQuestion(question.questionId).then((isDeleted) => {
    res.json({ isDeleted });
  });
};

module.exports = {
  serveQuestionPage,
  servePostQuestionPage,
  getTagSuggestion,
  postQuestion,
  serveEditQuestion,
  updateQuestion,
  addQuestionComment,
  getCommentsOfQuestion,
  deleteQuestionComment,
  deleteQuestion,
};
