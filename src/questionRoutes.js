const express = require('express');
const questionRouter = express.Router();
const {
  ensureLogin,
  serveQuestionPage,
  servePostQuestionPage,
  postQuestion,
  addQuestionComment,
  updateQuestion,
  getCommentsOfQuestion,
  serveEditQuestion,
} = require('./handlers');

questionRouter.get('/post', ensureLogin, servePostQuestionPage);
questionRouter.get('/comments/:questionId', getCommentsOfQuestion);
questionRouter.get('/:questionId', serveQuestionPage);
questionRouter.get('/edit/:questionId', ensureLogin, serveEditQuestion);

questionRouter.post('/post', ensureLogin, postQuestion);
questionRouter.post('/update', ensureLogin, updateQuestion);
questionRouter.post('/addComment', ensureLogin, addQuestionComment);

module.exports = questionRouter;
