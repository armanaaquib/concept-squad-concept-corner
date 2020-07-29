const addContentActive = function (event) {
  const box = event.target.closest('.inputBox');
  box.classList.add('content_active');
};
const checkContent = function () {
  const box = event.target.closest('.inputBox');
  const input = event.target.value;
  if (!input || input === '') {
    box.classList.remove('content_active');
  } else {
    box.classList.add('content_active');
  }
};

const addContentActiveToAll = function () {
  $('.inputBox input').trigger('focus');
  $('.inputBox textarea').trigger('focus');
};

const readUrl = function (event) {
  const reader = new FileReader();
  reader.onload = function (img) {
    $('.uploaded-image').attr('src', img.target.result);
  };
  reader.readAsDataURL(event.target.files[0]);
};

const callEvent = function () {
  $('.upload-image').trigger('click');
};

const getDate = function (dateString) {
  const date = new Date(dateString).toUTCString();
  const [, newDate] = date.split(',');
  const [day, month, year, time] = newDate.trim(' ').split(' ');
  const [hour, minute] = time.split(':');
  return `${month} ${day} '${year} at ${hour}:${minute}`;
};
