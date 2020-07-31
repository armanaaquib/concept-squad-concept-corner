const showDescription = (description, id) => {
  const quill = new Quill(`#${id}`, {
    modules: {
      syntax: true,
      toolbar: false,
    },
    readOnly: true,
    theme: 'snow',
  });

  quill.setContents(JSON.parse(description));
};
const postAnswer = function (editor) {
  const questionId = document.getElementById('h_qId').value;
  fetch('/postAnswer', {
    method: 'POST',
    body: JSON.stringify({
      questionId,
      answer: JSON.stringify(JSON.stringify(editor.getContents())),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(() => {
    window.location = `/question/${questionId}`;
  });
};

const showPostAnswerEditor = function () {
  const postAnswerEditor = new Quill('#editor-postAnswer', {
    modules: {
      syntax: true,
      toolbar: [
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        ['code-block'],
      ],
    },
    placeholder: 'description...',
    theme: 'snow',
  });
  hljs.configure({
    languages: ['javascript', 'ruby', 'python'],
  });
  const postAnswerBtn = document.getElementById('postAnswer-btn');
  postAnswerBtn.onclick = postAnswer.bind(null, postAnswerEditor);
};

const markAccepted = (answer) => {
  fetch('/markAccepted', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      questionId: answer.questionId,
      answerId: answer.answerId,
    }),
  }).then((res) => {
    if (res.status === 200) {
      $('.reactions .unchecked-answer').remove();
      const checkedAnswer = document.createElement('div');
      checkedAnswer.classList.add('col-3');
      checkedAnswer.classList.add('checked-answer');
      checkedAnswer.innerHTML = '<i class="material-icons">check_circle</i>';
      $(`.reactions #a-${answer.answerId}`).append(checkedAnswer);
    }
  });
};

const updateVote = (answerId, vote) => {
  fetch('/updateVote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answerId, vote }),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((votes) => {
      updateVotes(answerId);
      $(`#a-${answerId} .up`).siblings('.count').text(votes.up);
      $(`#a-${answerId} .down`).siblings('.count').text(votes.down);
    });
};

const addListener = (answerId) => {
  const thumbsUp = $(`.reactions #a-${answerId} .up`);
  const thumbsDown = $(`.reactions #a-${answerId} .down`);
  thumbsUp.addClass('animated-icon');
  thumbsDown.addClass('animated-icon');
  thumbsUp.on('click', updateVote.bind({}, answerId, 'up'));
  thumbsDown.on('click', updateVote.bind({}, answerId, 'down'));
};

const updateVotes = (answerId) => {
  fetch(`/getVote/${answerId}`)
    .then((res) => res.json())
    .then((result) => {
      $(`#a-${answerId} .up`).css('color', 'rgb(150,150,150)');
      $(`#a-${answerId} .down`).css('color', 'rgb(150,150,150)');
      if (result.vote) {
        $(`#a-${answerId} .${result.vote}`).css('color', '#3d8af7');
      }
      fetch(`/getVote/${answerId}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.vote) {
            $(`#a-${answerId} .${result.vote}`).css('color', '#3d8af7');
          }
        });
    });
};

const showQuestionCommentContainer = () => {
  document.querySelector('.post-question-comment-container').style.display =
    'flex';
  document.querySelector('.btn-add-question-comment').style.display = 'none';
};

const addQuestionComment = (questionId) => {
  const comment = $('#comment-text').val().trim();
  fetch('/addQuestionComment', {
    method: 'POST',
    body: JSON.stringify({
      questionId,
      comment,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (commentId) => {
    const comment = await fetch(`/comment/:${commentId}`);
  });
};
