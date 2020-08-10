const express = require('express');
const userRouter = express.Router();
const {
  signUp,
  hasUser,
  serveProfilePage,
  logout,
  confirmUser,
} = require('../handlers/userHandlers');

const { ensureLogin } = require('../handlers/handlers');

userRouter.get('/confirm', confirmUser);
userRouter.get('/has/:username', hasUser);
userRouter.get('/profile/:username', serveProfilePage);
userRouter.get('/logout', ensureLogin, logout);

userRouter.post('/signUp', signUp);

module.exports = userRouter;
