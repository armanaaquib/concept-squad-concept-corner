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
