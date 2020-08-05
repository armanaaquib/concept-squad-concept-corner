const showDescription = (description, id) => {
  const quill = new Quill(`#${id}`, {
    modules: {
      syntax: true,
      toolbar: false
    },
    readOnly: true,
    theme: 'snow'
  });

  quill.setContents(JSON.parse(description));
};

const postAnswer = function(editor) {
  const questionId = querySelector('#h_qId').value;
  postJSONReq('/postAnswer', {
    questionId,
    answer: JSON.stringify(JSON.stringify(editor.getContents()))
  })
    .then(jsonParser)
    .then(({ answerId }) => {
      window.location.href = `/question/${questionId}`;
    });
};

const showPostAnswerEditor = function() {
  const postAnswerEditor = new Quill('#editor-postAnswer', {
    modules: {
      syntax: true,
      toolbar: [
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        ['code-block']
      ]
    },
    placeholder: 'description...',
    theme: 'snow'
  });
  const postAnswerBtn = querySelector('#postAnswer-btn');
  postAnswerBtn.onclick = postAnswer.bind(null, postAnswerEditor);
};

const markAccepted = (answer) => {
  postJSONReq('/markAccepted', {
    questionId: answer.questionId,
    answerId: answer.answerId
  }).then((res) => {
    if (res.status === 200) {
      querySelectorAll('.reactions .unchecked-answer').forEach((element) =>
        element.remove()
      );
      const checkedAnswer = document.createElement('div');
      checkedAnswer.classList.add('col-3');
      checkedAnswer.classList.add('checked-answer');
      checkedAnswer.innerHTML = '<i class="material-icons">check_circle</i>';
      querySelector(`.reactions #a-${answer.answerId}`).appendChild(
        checkedAnswer
      );
    }
  });
};

const updateVote = (answerId, vote) => {
  postJSONReq('/updateVote', { answerId, vote })
    .then(jsonParser)
    .then((votes) => {
      updateVoteIcons(answerId);
      querySelector(`#a-${answerId} .up`).nextSibling.innerText = votes.up;
      querySelector(`#a-${answerId} .down`).nextSibling.innerText = votes.down;
    });
};

const attachListenerVoteIcons = (answerId) => {
  const thumbsUp = querySelector(`.reactions #a-${answerId} .up`);
  const thumbsDown = querySelector(`.reactions #a-${answerId} .down`);
  thumbsUp.classList.add('animated-icon');
  thumbsDown.classList.add('animated-icon');
  thumbsUp.onclick = updateVote.bind(null, answerId, 'up');
  thumbsDown.onclick = updateVote.bind(null, answerId, 'down');
};

const updateVoteIcons = (answerId) => {
  getReq(`/getVote/${answerId}`)
    .then(jsonParser)
    .then((result) => {
      querySelector(`#a-${answerId} .up`).style.color = '#969696';
      querySelector(`#a-${answerId} .down`).style.color = '#969696';
      if (result.vote) {
        querySelector(`#a-${answerId} .${result.vote}`).style.color = '#3d8af7';
      }
    });
};

const showQuestionCommentContainer = () => {
  querySelector('.post-question-comment-container').style.display = 'flex';
  querySelector('.btn-add-question-comment').style.display = 'none';
};

const showAnswerCommentContainer = (answerId) => {
  querySelector(`#answer-${answerId} .post-comment-container`).style.display =
    'flex';
  querySelector(`#answer-${answerId} .post-comment-btn`).style.display = 'none';
};

const hideQuestionCommentContainer = () => {
  querySelector('.post-question-comment-container').style.display = 'none';
  querySelector('#comment-text').value = '';
  querySelector('.btn-add-question-comment').style.display = 'block';
};

const hideAnswerCommentContainer = (answerId) => {
  querySelector(`#answer-${answerId} .post-comment-container`).style.display =
    'none';
  querySelector(`#answer-${answerId} #comment-text`).value = '';
  querySelector(`#answer-${answerId} .post-comment-btn`).style.display =
    'block';
};

const createComment = function(comment, username, commentBoxId) {
  const commentSection = querySelector(commentBoxId || '#comments');
  const newComment = createElement('div', ['col-9', 'comment']);
  newComment.id = `comment-${comment.commentId}`;
  const user = createElementWithText('span', ['user'], comment.username);
  const time = createElementWithText(
    'span',
    ['date'],
    moment(comment.time / 1000).fromNow()
  );

  const commentContent = createElementWithText('span', [], comment.comment);
  const separator = createElementWithText('span', [], '-');
  appendChildren(newComment, [commentContent, separator, user, time]);
  if (username === comment.username) {
    const deleteIcon = createElementWithText(
      'span',
      ['material-icons'],
      'delete'
    );
    const details = {
      elementName: 'question comment',
      functionToCall: deleteComment.bind(null, {
        commentId: comment.commentId,
        username
      })
    };
    deleteIcon.addEventListener('click', showPopUp.bind(null, details));
    appendChildren(newComment, [deleteIcon]);
  }
  commentSection.appendChild(newComment);
};

const addQuestionComment = ({ questionId, user }) => {
  const { username } = user || {};
  const comment = querySelector('#comment-text').value.trim();
  postJSONReq('/addQuestionComment', {
    questionId,
    comment
  })
    .then(jsonParser)
    .then((commentId) => {
      hideQuestionCommentContainer();
      getReq(`/comment/${commentId}`)
        .then(jsonParser)
        .then((comment) => {
          createComment(comment, username);
        });
    });
};

const addAnswerComment = (answerId) => {
  const comment = querySelector(
    `#answer-${answerId} #comment-text`
  ).value.trim();

  postJSONReq('/addAnswerComment', {
    answerId,
    comment
  })
    .then(jsonParser)
    .then((commentId) => {
      hideAnswerCommentContainer(answerId);
      querySelector(`#comment-${answerId}`).innerHTML = '';
      showAnswerComments(answerId);
    });
};

const getAllQuestionComment = (questionId, user) => {
  const { username } = user || {};
  getReq(`/getCommentsOfQuestion/${questionId}`)
    .then(jsonParser)
    .then((comments) => {
      comments.forEach((comment) => {
        createComment(comment, username);
      });
    });
};

const showAnswerComments = (answerId) => {
  getReq(`/getCommentsOfAnswer/${answerId}`)
    .then(jsonParser)
    .then((comments) => {
      comments.forEach((comment) => {
        createComment(comment, undefined, `#comment-${answerId}`);
      });
    });
};

const deleteComment = function(comment, event) {
  postJSONReq('/deleteQuestionComment', comment)
    .then(jsonParser)
    .then((status) => {
      if (status && status.isDeleted) {
        querySelector(`#comment-${comment.commentId}`).remove();
        destroyPopup();
      }
    });
};

const deleteAnswer = function(answer) {
  postJSONReq('/deleteAnswer', answer)
    .then(jsonParser)
    .then((status) => {
      if (status && status.isDeleted) {
        querySelector(`#answer-${answer.answerId}`).remove();
        const noOfAnswerField = querySelector('#no-of-answers');
        const noOfAnswer = parseInt(noOfAnswerField.innerText.split(' ')[0]);
        noOfAnswerField.innerText = `${noOfAnswer - 1} Answer(s)`;
        destroyPopup();
      }
    });
};

const confirmDeleteAnswer = function(answer) {
  const details = {
    elementName: 'answer',
    functionToCall: deleteAnswer.bind(null, answer)
  };
  showPopUp(details);
};
