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

const confirmAndSignUp = async function(event, userDetails) {
  event.preventDefault();
  if (!validateFields()) {
    return;
  }
  const detailsToAdd = new FormData($('.confirm-page-form')[0]);
  detailsToAdd.append('authLogin', userDetails.login);
  detailsToAdd.append('authSource', userDetails.authSource);
  detailsToAdd.append('profilePic', $('.uploaded-image')[0].src);
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
  const userNameMessage = document.querySelector('#userNameMessage');
  const confirmBtn = $('#confirmBtn');
  if (username.length < 2) {
    userNameMessage.innerText = '';
    return;
  }
  fetch(`/hasUser/${username}`)
    .then(res => res.json())
    .then(status => {
      if (status.available) {
        confirmBtn.removeAttr('disabled');
        userNameMessage.innerText = 'Username is available';
        userNameMessage.classList.remove('failure');
        userNameMessage.classList.add('success');
      } else {
        confirmBtn.attr('disabled', true);
        userNameMessage.innerText = 'Username is not available';
        userNameMessage.classList.remove('success');
        userNameMessage.classList.add('failure');
      }
    });
};

const readImage = () => {
  $('.upload-image').trigger('onchange');
};
