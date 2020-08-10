const express = require('express');
const answerRouter = express.Router();
const {
  ensureLogin,
  postAnswer,
  markAccepted,
  addAnswerComment,
} = require('./handlers');

answerRouter.post('/post', ensureLogin, postAnswer);
answerRouter.post('/markAccepted', ensureLogin, markAccepted);
answerRouter.post('/addComment', ensureLogin, addAnswerComment);

module.exports = answerRouter;
