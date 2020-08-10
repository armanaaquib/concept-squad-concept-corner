const express = require('express');
const answerRouter = express.Router();
const {
  postAnswer,
  markAccepted,
  addAnswerComment,
  updateVote,
  getVote,
  getCommentsOfAnswer,
  deleteAnswer,
  deleteAnswerComment,
} = require('../handlers/answerHandlers');

const { ensureLogin } = require('../handlers/handlers');

answerRouter.post('/post', ensureLogin, postAnswer);
answerRouter.post('/markAccepted', ensureLogin, markAccepted);
answerRouter.post('/updateVote', ensureLogin, updateVote);
answerRouter.post('/addComment', ensureLogin, addAnswerComment);
answerRouter.post('/deleteComment', ensureLogin, deleteAnswerComment);
answerRouter.post('/delete', ensureLogin, deleteAnswer);

answerRouter.get('/userVote/:answerId', ensureLogin, getVote);
answerRouter.get('/comments/:answerId', getCommentsOfAnswer);

module.exports = answerRouter;
