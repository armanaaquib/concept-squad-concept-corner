const express = require('express');
const answerRouter = express.Router();
const {
  ensureLogin,
  postAnswer,
  markAccepted,
  addAnswerComment,
  updateVote,
  getVote,
  getCommentsOfAnswer,
  deleteAnswer,
  deleteAnswerComment,
} = require('./handlers');

answerRouter.post('/post', ensureLogin, postAnswer);
answerRouter.post('/markAccepted', ensureLogin, markAccepted);
answerRouter.post('/addComment', ensureLogin, addAnswerComment);
answerRouter.post('/updateVote', ensureLogin, updateVote);
answerRouter.post('/delete', ensureLogin, deleteAnswer);
answerRouter.post('/deleteComment', ensureLogin, deleteAnswerComment);

answerRouter.get('/userVote/:answerId', ensureLogin, getVote);
answerRouter.get('/comments/:answerId', getCommentsOfAnswer);

module.exports = answerRouter;
