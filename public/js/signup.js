const validateFields = function() {
  let isValid = true;
  const name = document.getElementById('name');
  const username = document.getElementById('username');
  if (name.value.length < 1) {
    name.classList.add('requiredFieldError');
    isValid = false;
  }
  if (username.value.length < 1) {
    username.classList.add('requiredFieldError');
    isValid = false;
  }
  return isValid;
};

const fetchPostRequest = function(userDetails) {
  return {
    method: 'POST',
    body: JSON.stringify({ userDetails }),
    headers: {
      'Content-Type': 'application/json'
    }
  };
};

const confirmAndSignUp = function(userDetails, authHref) {
  const details = document.getElementById('details');
  const inputs = details.querySelectorAll('.inputBox input');
  const { login, authSource } = userDetails;
  const detailsToAdd = { authSource, authLogin: login };
  for (const input of inputs) {
    detailsToAdd[input.name] = input.value;
  }
  detailsToAdd.aboutMe = details.querySelector('textArea').value;
  fetch('/ConfirmAndSignUp', fetchPostRequest(detailsToAdd)).then(() => {
    window.location = '/';
  });
};

const checkUserName = function(userNameField) {
  const username = userNameField.value;
  const userNameMessage = document.querySelector('#userNameMessage');
  if (username.length < 2) {
    userNameMessage.innerText = '';
    return;
  }
  fetch(`/hasUser/${username}`)
    .then(res => res.json())
    .then(status => {
      if (status.available) {
        userNameMessage.innerText = 'Username is Available';
        userNameMessage.classList.remove('failure');
        userNameMessage.classList.add('success');
      } else {
        userNameMessage.innerText = 'Username is not Available';
        userNameMessage.classList.remove('success');
        userNameMessage.classList.add('failure');
      }
    });
};
