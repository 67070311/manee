/* Fit the original Animal Hunter phone frame to the available iframe/window. */
(()=>{
 const phone=document.querySelector(".phone-frame");
 if(!phone)return;
 const fit=()=>{
  if(window.innerWidth<600){phone.style.removeProperty("--phone-scale");return}
  const sx=Math.max(320,window.innerWidth-50)/446;
  const sy=Math.max(300,window.innerHeight-34)/948;
  phone.style.setProperty("--phone-scale",Math.min(1,sx,sy).toFixed(4));
 };
 window.addEventListener("resize",fit,{passive:true});
 fit();
})();
