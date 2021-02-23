const debounce = (func,delay=1000) => {
  let timeoutId; 
  return (...args) =>{
    if(timeoutId){
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() =>{
      func.apply(null,args);
    },delay);

   }
 }


 const button = document.querySelector('.button');
 button.addEventListener('click', () =>{
  document.querySelector('.tutorial').classList.add('is-hidden');

 })