let quill;

const getElement = id => document.getElementById(id);

const createEditor = () => {
  quill = new Quill('#editor-container', {
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
};

const validateForm = () => {
  const title = getElement('title').value;
  return title !== '';
};

const getSelectedTags = function() {
  const selectedTagsHTML = document.querySelectorAll('.selected-tag');
  const selectedTags = Array.from(selectedTagsHTML);
  return selectedTags.map(selectedTag => selectedTag.innerText);
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
    body: JSON.stringify({ title, description, tags: getSelectedTags() }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then(questionId => {
      window.location = `/question/${questionId}`;
    });
};

const getCancelButton = function() {
  return `<svg class="svg-icon iconClearSm pe-none" width="14" 
            height="14" viewBox="0 0 14 14">
  <path d="M12 3.41L10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 
  3.41 12 7 8.41 10.59 12 12 10.59 8.41 7z">
  </path></svg>`;
};

const removetag = function(tagToRemove) {
  tagToRemove.parentElement.remove();
};

const setTagsFieldWidth = function() {
  const selectedTagsWidth = document.querySelector('.selected-tags')
    .offsetWidth;
  const tagsBoxWidth = document.querySelector('.tagsBox').offsetWidth;
  const tagsField = getElement('tags');
  tagsField.style.width = tagsBoxWidth - selectedTagsWidth - 40;
};

const removeLastTag = function(tagField) {
  const selectedTagsHTML = document.querySelectorAll('.selected-tag');
  if (selectedTagsHTML.length == 0) {
    return;
  }
  const selectedTags = Array.from(selectedTagsHTML);
  const tagToRemove = selectedTags[selectedTags.length - 1];
  tagField.value = tagToRemove.innerText;
  tagToRemove.remove();
};

const addTag = function(tagField) {
  const tag = tagField.value;
  if (tag.trim() === '') {
    tagField.value = '';
    return;
  }
  const selectedTags = document.querySelector('.selected-tags');
  const tagHtml = `<span class="selected-tag">${tag}<a class="removetag"
   onclick="removetag(this)">${getCancelButton()}</a></span>`;
  selectedTags.innerHTML += tagHtml;
  tagField.value = '';
};

const createTag = function(tagField) {
  if (window.event.keyCode == 8 && tagField.value == '') {
    removeLastTag(tagField);
  }
  if (window.event.keyCode == 32) {
    addTag(tagField);
  }
  setTagsFieldWidth();
};
