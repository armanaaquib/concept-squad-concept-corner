const querySelectorAll = (query) => document.querySelectorAll(query);

const querySelector = (query) => document.querySelector(query);

const createElement = (elementName, classList) => {
  const element = document.createElement(elementName);
  classList.forEach((className) => element.classList.add(className));
  return element;
};

const createElementWithText = (elementName, classList, text) => {
  const element = createElement(elementName, classList);
  element.innerText = text;
  return element;
};

const appendChildren = (parent, children) => {
  children.forEach((child) => parent.appendChild(child));
};
