
const addContentActive = function(inputField) {
  const box = inputField.parentElement;
  box.classList.add('content_active');
};

const checkContent = function(inputField) {
  const box = inputField.parentElement;
  const input = inputField.value;
  if (!input || input === '') {
    box.classList.remove('content_active');
  } else {
    box.classList.add('content_active');
  }
};
const showPopUp = function(details){
  createPopUp(details);
};
const destroyPopup = function(){
  querySelector('.modal').remove();
};

const createPopUp = function(details){
  const modal = createElement('div', ['modal']);
  const {elementName, id, functionToCall} = details;
  const text = `Do you really want to delete this ${elementName}`;
  const popupBox = createElement('div', ['col-4', 'popup-box']);
  const heading = createElementWithText('h2', ['col-12', 'popup-heading'], text);
  const buttons = createElement('div', ['btn']);
  const deleteButton = createElementWithText('button', ['danger-btn'], 'Delete');
  deleteButton.addEventListener('click', functionToCall);
  const cancelButton = createElementWithText('button', ['cancel-btn'], 'Cancel');
  cancelButton.addEventListener('click', destroyPopup);
  appendChildren(buttons, [deleteButton, cancelButton]);
  appendChildren(popupBox, [heading, buttons]);
  modal.append(popupBox);
  querySelector('body').append(modal);
};

const addContentActiveToAll = function() {
  querySelectorAll('.inputBox input').forEach((inputField) =>
    inputField.focus()
  );
  querySelectorAll('.inputBox textarea').forEach((inputField) =>
    inputField.focus()
  );
};

const getDataURI = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(progressEvent) {
      resolve(progressEvent.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const readImage = function(fileUpload) {
  getDataURI(fileUpload.files[0]).then((URI) => {
    querySelector('.uploaded-image').setAttribute('src', URI);
  });
};

const selectImage = function() {
  querySelector('.upload-image').click();
};

const getDate = function(dateString) {
  const date = new Date(dateString).toUTCString();
  const [, newDate] = date.split(',');
  const [day, month, year, time] = newDate.trim(' ').split(' ');
  const [hour, minute] = time.split(':');
  return `${month} ${day} '${year} at ${hour}:${minute}`;
};
