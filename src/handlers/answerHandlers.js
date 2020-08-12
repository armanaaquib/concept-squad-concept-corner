const { serveErrorPage } = require('./handlers');

const postAnswer = (req, res) => {
  const { questionId, answer } = req.body;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore
    .addAnswer(username, questionId, answer)
    .then((answerId) => res.json({ answerId }));
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

const addAnswerComment = (req, res) => {
  const { answerId, comment } = req.body;
  const { username } = req.session.user;
  const { dataStore } = req.app.locals;
  dataStore.addAnswerComment(username, answerId, comment).then((commentId) => {
    res.json(commentId);
  });
};

const getCommentsOfAnswer = (req, res) => {
  const { answerId } = req.params;
  const { dataStore } = req.app.locals;
  dataStore.getCommentsOfAnswer(answerId).then((comments) => {
    res.json(comments);
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

module.exports = {
  postAnswer,
  markAccepted,
  updateVote,
  getVote,
  addAnswerComment,
  getCommentsOfAnswer,
  deleteAnswerComment,
  deleteAnswer
};
