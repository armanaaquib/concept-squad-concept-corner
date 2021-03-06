const formidable = require('formidable');
const authUtils = require('./authUtils');
const { getAuthLink } = require('../config');

const serveHomePage = function(req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getQuestions().then((questions) => {
    res.render('index', {
      user: req.session.user,
      questions,
      authLink: getAuthLink()
    });
    res.end();
  });
};

const hasUser = function(req, res) {
  const { username } = req.params;
  const { dataStore } = req.app.locals;
  dataStore.getUser(username).then((user) => {
    res.json({ available: user ? false : true });
  });
};

const servePostQuestionPage = (req, res) => {
  const cancelUrl = req.session.redirectURL || '/';
  res.render('postQuestion', {
    cancelUrl,
    user: req.session.user,
    authHref: getAuthLink()
  });
  res.end();
};

const postQuestion = (req, res) => {
  const { title, description, tags } = req.body;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore
    .addQuestion({ username, title, description, tags })
    .then((questionId) => {
      res.json(questionId);
    });
};

const serveQuestionPage = (req, res) => {
  const { questionId } = req.params;
  const { dataStore } = req.app.locals;

  dataStore.getQuestion(questionId).then(async (question) => {
    if (!question) {
      serveErrorPage(res, 404, 'Question not found.');
      return;
    }
    const answerList = await dataStore.getAnswers(questionId);
    res.render('question', {
      user: req.session.user,
      question,
      answers: answerList,
      authLink: getAuthLink()
    });
  });
};

const postAnswer = (req, res) => {
  const { questionId, answer } = req.body;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore
    .addAnswer(username, questionId, answer)
    .then((answerId) => res.json({ answerId }));
};

const signUp = (req, res) => {
  const { dataStore } = req.app.locals;
  const form = new formidable.IncomingForm();
  form.parse(req, function(err, userInfo) {
    if (err) {
      res.status(400);
      res.end();
      return;
    }
    dataStore.addUser(userInfo).then(() => {
      req.session.user = {
        username: userInfo.username,
        profilePic: userInfo.profilePic
      };
      res.end();
    });
  });
};

const confirmUser = (req, res) => {
  const { code } = req.query;
  const { dataStore } = req.app.locals;
  if (!code) {
    serveErrorPage(res, 403, 'Access Denied');
    return;
  }
  authUtils
    .getAccessToken(code)
    .then(authUtils.getUserDetail)
    .then(async (userDetail) => {
      const { login } = userDetail;
      const user = await dataStore.getRegisteredUser(login, 'github');
      if (user) {
        req.session.user = {
          username: user.username,
          profilePic: user.profilePic
        };
        res.redirect('/');
      } else {
        res.render('confirm', { userDetail });
      }
    });
};

const ensureLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/');
    return;
  }
  next();
};

const serveErrorPage = (res, status, message) => {
  res.status(status);
  res.render('notFound', { message });
  res.end();
};

const markAccepted = (req, res) => {
  const { questionId, answerId } = req.body;
  const { dataStore } = req.app.locals;
  dataStore.acceptAnswer(questionId, answerId).then(() => res.end());
};

const getVote = (req, res) => {
  const { answerId } = req.params;
  const { dataStore } = req.app.locals;
  const { username } = req.session.user;
  dataStore.getVote(username, answerId).then((vote) => {
    res.json({ vote });
    res.end();
  });
};

const updateVote = (req, res) => {
  const { answerId, vote } = req.body;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore.getVote(username, answerId).then(async (prevVote) => {
    let votes;
    if (!prevVote) {
      votes = await dataStore.addVote(username, answerId, vote);
    } else if (vote === prevVote) {
      votes = await dataStore.deleteVote(username, answerId);
    } else {
      votes = await dataStore.updateVote(username, answerId, vote);
    }
    res.json(votes);
    res.end();
  });
};

const getTagSuggestion = (req, res) => {
  const { tagName } = req.params;
  const { dataStore } = req.app.locals;
  dataStore.getTagSuggestion(tagName).then((matchingTags) => {
    res.json(matchingTags);
  });
};

const addQuestionComment = (req, res) => {
  const { questionId, comment } = req.body;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore
    .addQuestionComment(username, questionId, comment)
    .then((commentId) => {
      res.json(commentId);
    });
};

const logout = (req, res) => {
  const { sId } = req.cookies;
  const { sessions } = req.app.locals;
  sessions.removeSession(sId);
  res.clearCookie('sId');
  res.redirect('/');
};

const serveProfilePage = (req, res) => {
  const { dataStore } = req.app.locals;
  const { username } = req.params;
  dataStore.getUser(username).then((user) => {
    res.render('profile', { user, authHref: getAuthLink() });
  });
};

const getCommentsOfQuestion = (req, res) => {
  const { questionId } = req.params;
  const { dataStore } = req.app.locals;
  dataStore.getCommentsOfQuestion(questionId).then((comments) => {
    res.json(comments);
  });
};

const getCommentsOfAnswer = (req, res) => {
  const { answerId } = req.params;
  const { dataStore } = req.app.locals;
  dataStore.getCommentsOfAnswer(answerId).then((comments) => {
    res.json(comments);
  });
};

const addAnswerComment = (req, res) => {
  const { answerId, comment } = req.body;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore.addAnswerComment(username, answerId, comment).then((commentId) => {
    res.json(commentId);
  });
};

const getComment = (req, res) => {
  const { commentId } = req.params;
  const { dataStore } = req.app.locals;
  dataStore.getComment(commentId).then((comment) => {
    res.json(comment);
  });
};

const serveEditQuestion = (req, res) => {
  const { questionId } = req.params;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore.getQuestion(questionId).then((question) => {
    if (question.username === username) {
      res.render('editQuestion', {
        question,
        user: req.session.user
      });
    } else {
      serveErrorPage(res, 403, 'Access Denied');
    }
  });
};

const updateQuestion = (req, res) => {
  const { questionId, title, description, tags } = req.body;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore.getQuestion(questionId).then((question) => {
    if (question.username === username) {
      dataStore
        .updateQuestion({ questionId, title, description, tags })
        .then((questionId) => {
          res.json(questionId);
        });
    } else {
      serveErrorPage(res, 403, 'Access Denied');
    }
  });
};

const deleteQuestionComment = (req, res) => {
  const comment = req.body;
  const { dataStore } = req.app.locals;
  const { username } = req.session.user;
  if (comment.username !== username) {
    serveErrorPage(res, 403, 'Access Denied');
    return;
  }
  dataStore.deleteQuestionComment(comment.commentId).then((isDeleted) => {
    res.json({ isDeleted });
  });
};

const deleteAnswerComment = (req, res) => {
  const comment = req.body;
  const { dataStore } = req.app.locals;
  const { username } = req.session.user;
  if (comment.username !== username) {
    serveErrorPage(res, 403, 'Access Denied');
    return;
  }
  dataStore.deleteAnswerComment(comment.commentId).then((isDeleted) => {
    res.json({ isDeleted });
  });
};

const deleteAnswer = (req, res) => {
  const answer = req.body;
  const { dataStore } = req.app.locals;
  const { username } = req.session.user;
  if (answer.username !== username) {
    serveErrorPage(res, 403, 'Access Denied');
    return;
  }
  dataStore.deleteAnswer(answer.answerId).then((isDeleted) => {
    res.json({ isDeleted });
  });
};

const deleteQuestion = (req, res) => {
  const question = req.body;
  const { dataStore } = req.app.locals;
  const { username } = req.session.user;
  if (question.username !== username) {
    serveErrorPage(res, 403, 'Access Denied');
    return;
  }
  dataStore.deleteQuestion(question.questionId).then((isDeleted) => {
    res.json({ isDeleted });
  });
};

module.exports = {
  serveHomePage,
  servePostQuestionPage,
  serveQuestionPage,
  postQuestion,
  confirmUser,
  signUp,
  hasUser,
  postAnswer,
  ensureLogin,
  markAccepted,
  getTagSuggestion,
  getVote,
  addQuestionComment,
  updateVote,
  logout,
  serveProfilePage,
  getCommentsOfQuestion,
  getCommentsOfAnswer,
  addAnswerComment,
  getComment,
  serveEditQuestion,
  updateQuestion,
  deleteQuestionComment,
  deleteAnswer,
  deleteQuestion,
  deleteAnswerComment
};
