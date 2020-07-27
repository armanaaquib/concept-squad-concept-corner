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
  const image = $('.uploaded-image')[0].src;
  const detailsToAdd = new FormData($('.confirm-page-form')[0]);
  detailsToAdd.append('authLogin', userDetails.login);
  detailsToAdd.append('authSource', userDetails.authSource);
  detailsToAdd.append('profilePic', image);
  const response = await fetch('/confirmAndSignUp', {
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
