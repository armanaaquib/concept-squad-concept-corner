const express = require('express');
const userRouter = express.Router();
const { signUp } = require('./handlers');

userRouter.post('/signUp', signUp);

module.exports = userRouter;
