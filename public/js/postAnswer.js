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
  const questionId = document.getElementById('h_qId').value;
  fetch('/postAnswer', {
    method: 'POST',
    body: JSON.stringify({
      questionId,
      answer: JSON.stringify(JSON.stringify(editor.getContents()))
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    window.location = `/question/${questionId}`;
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
  hljs.configure({
    languages: ['javascript', 'ruby', 'python']
  });
  const postAnswerBtn = document.getElementById('postAnswer-btn');
  postAnswerBtn.onclick = postAnswer.bind(null, postAnswerEditor);
};

const markAccepted = answer => {
  fetch('/markAccepted', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      questionId: answer.questionId,
      answerId: answer.answerId
    })
  }).then(res => {
    if (res.status === 200) {
      querySelectorAll('.reactions .unchecked-answer').forEach(element =>
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
  fetch('/updateVote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answerId, vote })
  })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then(votes => {
      updateVotes(answerId);
      querySelector(`#a-${answerId} .up`).nextSibling.innerText = votes.up;
      querySelector(`#a-${answerId} .down`).nextSibling.innerText = votes.down;
    });
};

const addListener = answerId => {
  const thumbsUp = querySelector(`.reactions #a-${answerId} .up`);
  const thumbsDown = querySelector(`.reactions #a-${answerId} .down`);
  thumbsUp.classList.add('animated-icon');
  thumbsDown.classList.add('animated-icon');
  thumbsUp.onclick = updateVote.bind({}, answerId, 'up');
  thumbsDown.onclick = updateVote.bind({}, answerId, 'down');
};

const updateVotes = answerId => {
  fetch(`/getVote/${answerId}`)
    .then(res => res.json())
    .then(result => {
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

const hideQuestionCommentContainer = () => {
  querySelector('.post-question-comment-container').style.display = 'none';
  querySelector('#comment-text').value = '';
  querySelector('.btn-add-question-comment').style.display = 'block';
};

const addQuestionComment = questionId => {
  const comment = querySelector('#comment-text').value.trim();

  fetch('/addQuestionComment', {
    method: 'POST',
    body: JSON.stringify({
      questionId,
      comment
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then(commentId => {
      hideQuestionCommentContainer();
      fetch(`/comment/${commentId}`)
        .then(res => {
          if (res.status === 200) {
            return res.json();
          }
        })
        .then(newComment => {
          createComment(newComment);
        });
    });
};

const createComment = function(comment) {
  const commentSection = querySelector('#comments');
  const newComment = createElement('div', ['col-9', 'comment']);
  const user = createElementWithText('span', ['user'], comment.username);
  const time = createElementWithText(
    'span',
    ['date'],
    moment(comment.time / 1000).fromNow()
  );
  const commentContent = createElementWithText('span', [], comment.comment);
  const seperator = createElementWithText('span', [], '-');
  appendChildren(newComment, [commentContent, seperator, user, time]);
  commentSection.appendChild(newComment);
};

const getAllQuestionComment = questionId => {
  fetch(`/getCommentsOfQuestion/${questionId}`)
    .then(res => res.json())
    .then(comments => {
      comments.forEach(comment => {
        createComment(comment);
      });
    });
};
