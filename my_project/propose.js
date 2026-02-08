// Propose page logic: evasive No button and growing Yes button
(function(){
  const area = document.getElementById('proposeArea');
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const overlay = document.getElementById('celebrateOverlay');
  const video = document.getElementById('loveVideo');
  const toMemBtn = document.getElementById('toMemBtn');

  // place buttons centrally
  function initPos(){ noBtn.style.position='absolute'; yesBtn.style.position='absolute';
    yesBtn.style.left = '40%'; yesBtn.style.top='40%';
    noBtn.style.left = '56%'; noBtn.style.top='40%'; }
  initPos();

  // evasive No: when cursor within radius, move randomly
  area.addEventListener('mousemove', e=>{
    const rect = area.getBoundingClientRect();
    const nb = noBtn.getBoundingClientRect();
    const dx = e.clientX - (nb.left + nb.width/2); const dy = e.clientY - (nb.top + nb.height/2);
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < 120){
      const bw = noBtn.offsetWidth, bh = noBtn.offsetHeight;
      const x = Math.random()*(rect.width-bw);
      const y = Math.random()*(rect.height-bh);
      noBtn.style.left = x+'px'; noBtn.style.top = y+'px';
    }
  });

  // Yes grows over 3.5 minutes (210s) to cover screen
  const growDuration = 210000; // ms
  let growStart = null; let growInterval = null;
  function startGrowing(){ growStart = Date.now(); yesBtn.style.transition = 'transform 0.5s linear';
    // increase scale stepwise
    growInterval = setInterval(()=>{
      const elapsed = Date.now() - growStart; const t = Math.min(1, elapsed / growDuration);
      const scale = 1 + t*30; // scale up large enough to cover
      yesBtn.style.transform = 'scale('+scale+')';
      if(t >= 1) clearInterval(growInterval);
    }, 200);
  }

  yesBtn.addEventListener('mouseenter', ()=>{ if(!growStart) startGrowing(); });
  yesBtn.addEventListener('click', ()=>{
    overlay.classList.remove('hidden');
    video.play();
  });

  toMemBtn.addEventListener('click', ()=>{ window.location.href = 'memories.html'; });

})();
