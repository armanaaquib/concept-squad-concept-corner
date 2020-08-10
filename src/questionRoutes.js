const express = require('express');
const questionRouter = express.Router();
const {
  ensureLogin,
  serveQuestionPage,
  servePostQuestionPage,
  postQuestion,
} = require('./handlers');

questionRouter.get('/post', ensureLogin, servePostQuestionPage);
questionRouter.get('/:questionId', serveQuestionPage);

questionRouter.post('/post', ensureLogin, postQuestion);

module.exports = questionRouter;
