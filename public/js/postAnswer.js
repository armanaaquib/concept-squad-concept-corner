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
  const postAnswerBtn = document.getElementById('postAnswer-btn');
  postAnswerBtn.onclick = postAnswer.bind(null, postAnswerEditor);
};
