const addContentActive = function(event){
  const box = event.target.closest('.inputBox');
  box.classList.add('content_active');
};
const checkContent = function(){
  const box = event.target.closest('.inputBox');
  const input = event.target.value;
  if(!input || input === ''){
    box.classList.remove('content_active');
  }else{
    box.classList.add('content_active');
  }
};

const readUrl = function (event) {
  const reader = new FileReader();
  reader.onload = function(e){
    $('.uploaded-image').attr('src', e.target.result);
  };
  reader.readAsDataURL(event.target.files[0]);
};

const callEvent = function () {
  $('.upload-image').trigger('click');
};
