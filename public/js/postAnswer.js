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
      username: answer.username,
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
