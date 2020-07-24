const confirmAndSignUp = function(userDetails){
  const details = document.getElementById('details');
  const inputs = details.querySelectorAll('.inputBox input');
  const {login, authSource} = userDetails;
  const detailsToAdd = {authSource, authLogin: login};
  for (const input of inputs) {
    detailsToAdd[input.name] = input.value;
  }
  const aboutMe = details.querySelector('textArea');
  detailsToAdd.aboutMe = aboutMe.value;
  fetch('/ConfirmAndSignUp', {
    method: 'POST',
    body: JSON.stringify({userDetails: detailsToAdd}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    window.location.href = '/';
  });
};
