let quill;

const getElement = id => document.getElementById(id);

const createEditor = () => {
  quill = new Quill('#editor-container', {
    modules: {
      syntax: true,
      toolbar: [
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        []
      ]
    },
    placeholder: 'Post Your Question...',
    theme: 'snow'
  });
};

const validateForm = () => {
  const title = getElement('title').value;
  return title !== '';
};

const postQuestion = () => {
  if (!validateForm()) {
    const errorTitle = getElement('errorTitle');
    errorTitle.innerText = 'Please type question title';
    return;
  }
  const title = getElement('title').value;
  const description = JSON.stringify(JSON.stringify(quill.getContents()));
  fetch('/postQuestion', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log('inserted');
  });
};

window.onload = createEditor;
