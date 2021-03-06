const validateForm = () => {
  const title = querySelector('#title').value;
  return title !== '';
};

const postQuestion = (editor) => {
  if (!validateForm()) {
    const errorTitle = querySelector('#errorTitle');
    errorTitle.innerText = 'Please type question title';
    return;
  }
  const title = querySelector('#title').value;
  const description = JSON.stringify(JSON.stringify(editor.getContents()));

  postJSONReq('/question/post', {
    title,
    description,
    tags: getSelectedTags(),
  })
    .then(jsonParser)
    .then((questionId) => {
      window.location.href = `/question/${questionId}`;
    });
};

const updateQuestion = (questionId, editor) => {
  if (!validateForm()) {
    const errorTitle = querySelector('#errorTitle');
    errorTitle.innerText = 'Please type question title';
    return;
  }
  const title = querySelector('#title').value;
  const description = JSON.stringify(JSON.stringify(editor.getContents()));

  postJSONReq('/question/update', {
    questionId,
    title,
    description,
    tags: getSelectedTags(),
  })
    .then(jsonParser)
    .then((questionId) => {
      window.location.href = `/question/${questionId}`;
    });
};

const createEditor = (description, questionId) => {
  const editor = new Quill('#editor-container', {
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
  if (description) {
    editor.setContents(JSON.parse(description));
    setTagsFieldWidth();
    const updateQuestionBtn = querySelector('#update-question-btn');
    updateQuestionBtn.onclick = updateQuestion.bind(null, questionId, editor);
  } else {
    const postQuestionBtn = querySelector('#post-question-btn');
    postQuestionBtn.onclick = postQuestion.bind(null, editor);
  }
};

const getSelectedTags = function () {
  const selectedTagsHTML = querySelectorAll('.tag-text');
  const selectedTags = Array.from(selectedTagsHTML);
  return selectedTags.map((selectedTag) => selectedTag.innerText);
};

//user cancel icon
const getCancelButton = function () {
  return '<i class="material-icons close-btn">close</i>';
};

const getRemainingTags = function () {
  const selectedTags = querySelector('.selected-tags');
  return 5 - selectedTags.childElementCount;
};

const updateRemainingTags = function () {
  const remainingTags = querySelector('.remaining_tags');
  const remainingTagsCount = getRemainingTags();
  remainingTags.style.color = 'black';
  if (remainingTagsCount < 1) {
    remainingTags.style.color = 'red';
  }
  remainingTags.innerText = remainingTagsCount;
};

const removeTag = function (tagToRemove) {
  tagToRemove.parentElement.remove();
  updateRemainingTags();
};

const setTagsFieldWidth = function () {
  const selectedTagsWidth = querySelector('.selected-tags').offsetWidth;
  const tagsBoxWidth = querySelector('.tagsBox').offsetWidth;
  const tagsField = querySelector('#tags');
  tagsField.style.width = tagsBoxWidth - selectedTagsWidth - 50;
};

const removeLastTag = function (tagField) {
  const selectedTagsHTML = querySelectorAll('.selected-tag');
  if (selectedTagsHTML.length == 0) {
    return;
  }
  const selectedTags = Array.from(selectedTagsHTML);
  const tagToRemove = selectedTags[selectedTags.length - 1];
  tagField.value = tagToRemove.firstElementChild.innerText;
  tagToRemove.remove();
  updateRemainingTags();
};

const addTag = function (tag) {
  const tagField = querySelector('#tags');
  if (tag.trim() === '' || getRemainingTags() < 1) {
    tagField.value = '';
    return;
  }
  const selectedTags = querySelector('.selected-tags');
  const tagHtml = `<span class="selected-tag"><span class="tag-text">
    ${tag}</span><a class="removetag"
   onclick="removeTag(this)">${getCancelButton()}</a></span>`;
  selectedTags.innerHTML += tagHtml;
  updateRemainingTags();
  tagField.value = '';
};

const getSelectedSuggestion = function (selectedField) {
  const selectedTag = selectedField.firstElementChild.value;
  addTag(selectedTag);
  setTagsFieldWidth();
};

const showTagSuggestions = function (tags) {
  document.addEventListener('click', function () {
    removeTagSuggestion();
  });
  const showSuggestionBox = querySelector('.suggestionTags');
  const tagsToShow = tags.slice(0, 5).map(
    (tag) =>
      `<div class='s-tag' onclick="getSelectedSuggestion(this)">${tag}
      <input type="hidden" value="${tag}"></div>`
  );
  showSuggestionBox.innerHTML = tagsToShow.join('');
};

const removeTagSuggestion = function () {
  const showSuggestionBox = querySelector('.suggestionTags');
  showSuggestionBox.innerHTML = '';
};

const getTagSuggestion = function (tagField) {
  if (tagField.value.length < 1) {
    removeTagSuggestion();
    return;
  }
  getReq(`/question/tags/${tagField.value}`)
    .then(jsonParser)
    .then(showTagSuggestions);
};

const createTag = function (tagField) {
  if (window.event.keyCode == 8 && tagField.value == '') {
    removeLastTag(tagField);
  }
  if (window.event.keyCode == 32) {
    addTag(tagField.value);
  }
  getTagSuggestion(tagField);
  setTagsFieldWidth();
};
