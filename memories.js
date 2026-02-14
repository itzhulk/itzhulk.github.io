// Continuous horizontal slideshow - seamless scrolling
(function(){
  const tvScreen = document.getElementById('tvScreen');
  const imgs = Array.from(tvScreen.querySelectorAll('img'));
  const imgCount = imgs.length;
  const totalDuration = 45000; // 45 seconds for all photos
  const scrollDistance = imgCount * 100; // move through all images
  
  // Fade each image in/out
  imgs.forEach(img => { img.style.opacity = '0'; img.style.transition = 'opacity 0.8s ease-in-out'; });
  if(imgs[0]) imgs[0].style.opacity = '1';
  
  let currentIdx = 0;
  const interval = totalDuration / imgCount; // time per image
  
  setInterval(() => {
    imgs[currentIdx].style.opacity = '0';
    currentIdx = (currentIdx + 1) % imgCount;
    imgs[currentIdx].style.opacity = '1';
  }, interval);
})();


