const showDescription = () => {
  const description = document.getElementById('desc-hide').value;
  const quill = new Quill('#q-desc', {
    modules: {
      syntax: true,
      toolbar: false,
    },
    readOnly: true,
    theme: 'snow',
  });
  quill.setContents(JSON.parse(JSON.parse(description)));
};

window.onload = showDescription();
