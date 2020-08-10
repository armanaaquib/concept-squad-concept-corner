const express = require('express');
const answerRouter = express.Router();
const { ensureLogin, postAnswer, markAccepted } = require('./handlers');

answerRouter.post('/post', ensureLogin, postAnswer);
answerRouter.post('/markAccepted', ensureLogin, markAccepted);

module.exports = answerRouter;
