const validateFields = function () {
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

const signUp = function (event, userDetails) {
  event.preventDefault();
  if (!validateFields()) {
    return;
  }
  const detailsToAdd = new FormData(querySelector('.confirm-page-form'));
  detailsToAdd.append('authLogin', userDetails.login);
  detailsToAdd.append('authSource', userDetails.authSource);
  detailsToAdd.append('profilePic', querySelector('.uploaded-image').src);

  fetch('/user/signUp', {
    method: 'POST',
    body: detailsToAdd,
  }).then((res) => {
    if (res.status === 200) {
      window.location.href = '/';
    }
  });
};

const checkUserName = function (userNameField) {
  const username = userNameField.value;
  const userNameMessage = querySelector('#userNameMessage');
  const confirmBtn = querySelector('#confirmBtn');
  if (username.length < 2) {
    userNameMessage.innerText = '';
    return;
  }

  getReq(`/user/has/${username}`)
    .then(jsonParser)
    .then((status) => {
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

const convertToDataURI = () => {
  const url = querySelector('.uploaded-image').getAttribute('src');
  getReq(url)
    .then((res) => res.blob())
    .then((data) => {
      const file = new File([data], 'test.jpg', { type: 'image/jpeg' });
      getDataURI(file).then((URI) => {
        querySelector('.uploaded-image').src = URI;
      });
    });
};
