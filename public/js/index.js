const querySelectorAll = query => document.querySelectorAll(query);

const querySelector = query => document.querySelector(query);

const createElement = (elementName, classList) => {
  const element = document.createElement(elementName);
  classList.forEach(className => element.classList.add(className));
  return element;
};

const createElementWithText = (elementName, classList, text) => {
  const element = createElement(elementName, classList);
  element.innerText = text;
  return element;
};

const appendChildren = (parent, children) => {
  children.forEach(child => parent.appendChild(child));
};

const addContentActive = function(event) {
  const box = event.target.closest('.inputBox');
  box.classList.add('content_active');
};

const checkContent = function() {
  const box = event.target.closest('.inputBox');
  const input = event.target.value;
  if (!input || input === '') {
    box.classList.remove('content_active');
  } else {
    box.classList.add('content_active');
  }
};

const addContentActiveToAll = function() {
  querySelectorAll('.inputBox input').forEach(inputField => inputField.focus());
  querySelectorAll('.inputBox textarea').forEach(inputField =>
    inputField.focus()
  );
};

const readUrl = function(event) {
  const reader = new FileReader();
  reader.onload = function(img) {
    querySelector('.uploaded-image').setAttribute('src', img.target.result);
  };
  event && reader.readAsDataURL(event.target.files[0]);
};

const callEvent = function() {
  querySelector('.upload-image').click();
};

const getDate = function(dateString) {
  const date = new Date(dateString).toUTCString();
  const [, newDate] = date.split(',');
  const [day, month, year, time] = newDate.trim(' ').split(' ');
  const [hour, minute] = time.split(':');
  return `${month} ${day} '${year} at ${hour}:${minute}`;
};
