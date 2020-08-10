const express = require('express');
const questionRouter = express.Router();
const { serveQuestionPage } = require('./handlers');

questionRouter.get('/:questionId', serveQuestionPage);

module.exports = questionRouter;
