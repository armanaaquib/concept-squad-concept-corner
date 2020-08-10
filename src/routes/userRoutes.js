const express = require('express');
const userRouter = express.Router();
const {
  ensureLogin,
  signUp,
  hasUser,
  serveProfilePage,
  logout,
  confirmUser,
} = require('../handlers/handlers');

userRouter.get('/has/:username', hasUser);
userRouter.get('/profile/:username', serveProfilePage);
userRouter.get('/logout', ensureLogin, logout);
userRouter.get('/confirm', confirmUser);

userRouter.post('/signUp', signUp);

module.exports = userRouter;
