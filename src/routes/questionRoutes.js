const express = require('express');
const questionRouter = express.Router();
const {
  serveQuestionPage,
  servePostQuestionPage,
  postQuestion,
  addQuestionComment,
  updateQuestion,
  getCommentsOfQuestion,
  serveEditQuestion,
  deleteQuestionComment,
  deleteQuestion,
  getTagSuggestion,
} = require('../handlers/questionHandlers');

const { ensureLogin } = require('../handlers/handlers');

questionRouter.get('/post', ensureLogin, servePostQuestionPage);
questionRouter.get('/edit/:questionId', ensureLogin, serveEditQuestion);
questionRouter.get('/tags/:tagName', ensureLogin, getTagSuggestion);
questionRouter.get('/comments/:questionId', getCommentsOfQuestion);
questionRouter.get('/:questionId', serveQuestionPage);

questionRouter.post('/post', ensureLogin, postQuestion);
questionRouter.post('/update', ensureLogin, updateQuestion);
questionRouter.post('/addComment', ensureLogin, addQuestionComment);
questionRouter.post('/deleteComment', ensureLogin, deleteQuestionComment);
questionRouter.post('/delete', ensureLogin, deleteQuestion);

module.exports = questionRouter;
