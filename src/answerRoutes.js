const express = require('express');
const answerRouter = express.Router();
const { ensureLogin, postAnswer } = require('./handlers');

answerRouter.post('/post', ensureLogin, postAnswer);

module.exports = answerRouter;
