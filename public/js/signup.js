const validateFields = function() {
  let isValid = true;
  const name = querySelector('#name');
  const username = querySelector('#username');
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

const confirmAndSignUp = async function(event, userDetails) {
  event.preventDefault();
  if (!validateFields()) {
    return;
  }
  const detailsToAdd = new FormData(querySelector('.confirm-page-form'));
  detailsToAdd.append('authLogin', userDetails.login);
  detailsToAdd.append('authSource', userDetails.authSource);
  detailsToAdd.append('profilePic', querySelector('.uploaded-image').src);
  const response = await fetch('/signUp', {
    method: 'POST',
    body: detailsToAdd
  });
  if (response.status === 200) {
    window.location = '/';
  }
};

const checkUserName = function(userNameField) {
  const username = userNameField.value;
  const userNameMessage = querySelector('#userNameMessage');
  const confirmBtn = querySelector('#confirmBtn');
  if (username.length < 2) {
    userNameMessage.innerText = '';
    return;
  }
  fetch(`/hasUser/${username}`)
    .then(res => res.json())
    .then(status => {
      if (status.available) {
        confirmBtn.removeAttribute('disabled');
        userNameMessage.innerText = 'Username is available';
        userNameMessage.classList.remove('failure');
        userNameMessage.classList.add('success');
      } else {
        confirmBtn.setAttribute('disabled', true);
        userNameMessage.innerText = 'Username is not available';
        userNameMessage.classList.remove('success');
        userNameMessage.classList.add('failure');
      }
    });
};

const readImage = () => {
  querySelector('.upload-image').onchange();
};
