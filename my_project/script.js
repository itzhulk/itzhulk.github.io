// Simple heart-dodge game + slideshow + evasive No button
(()=>{
  /* --- Game --- */
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  let running = true;
  const player = {x:80,y:H-60,w:36,h:48,vy:0,onGround:true};
  const gravity = 0.9;
  const jumpStrength = -14;
  const hearts = [];
  let spawnTimer = 0;

  function spawnHeart(){
    const size = 28 + Math.random()*18;
    const y = H-60 - Math.random()*80;
    hearts.push({x:W+40,y,size,speed:2+Math.random()*3});
  }

  function resetGame(){hearts.length=0;player.y=H-60;player.vy=0;running=true}

  function showLose(){running=false;document.getElementById('loseModal').classList.remove('hidden')}

  function update(){
    if(!running) return;
    // player physics
    player.vy += gravity;player.y += player.vy;
    if(player.y >= H-60){player.y = H-60; player.vy=0; player.onGround=true}

    // spawn hearts
    spawnTimer += 1;
    if(spawnTimer > 70){spawnTimer = 0; spawnHeart();}

    // move hearts
    for(let i=hearts.length-1;i>=0;i--){
      const h = hearts[i]; h.x -= h.speed;
      // simple collision
      if(h.x < player.x + player.w && h.x + h.size > player.x && h.y < player.y + player.h && h.y + h.size > player.y){
        showLose();
      }
      if(h.x + h.size < 0) hearts.splice(i,1);
    }
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    // ground
    ctx.fillStyle = '#ffe6f0'; ctx.fillRect(0,H-40,W,40);
    // male shooter on right (simple)
    ctx.fillStyle = '#333'; ctx.fillRect(W-80,H-100,46,80);
    ctx.fillStyle = '#ff4d94'; ctx.fillRect(W-60,H-110,8,32); // gun barrel

    // player (female)
    ctx.fillStyle = '#4d2b4d'; ctx.fillRect(player.x, player.y, player.w, player.h);

    // hearts
    hearts.forEach(h=>{
      drawHeart(h.x,h.y,h.size,'#ff4d94')
    })
  }

  function drawHeart(x,y,s,color){
    ctx.save(); ctx.translate(x,y);
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = s * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, topCurveHeight - (s/2), -s/2, topCurveHeight - (s/2), -s/2, topCurveHeight);
    ctx.bezierCurveTo(-s/2, topCurveHeight + (s/2), 0, topCurveHeight + (s), 0, topCurveHeight + (s));
    ctx.bezierCurveTo(0, topCurveHeight + (s), s/2, topCurveHeight + (s/2), s/2, topCurveHeight);
    ctx.bezierCurveTo(s/2, topCurveHeight - (s/2), 0, topCurveHeight - (s/2), 0, topCurveHeight);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function loop(){ update(); draw(); requestAnimationFrame(loop) }
  loop();

  // input
  window.addEventListener('keydown', e=>{ if(e.code==='Space'){ if(player.onGround){player.vy=jumpStrength; player.onGround=false}}});
  canvas.addEventListener('click', ()=>{ if(player.onGround){player.vy=jumpStrength; player.onGround=false}});

  // modal actions
  document.getElementById('restartBtn').addEventListener('click', ()=>{document.getElementById('loseModal').classList.add('hidden');resetGame();});

  /* --- Slideshow --- */
  const slides = Array.from(document.querySelectorAll('#slideshow img'));
  let cur = 0; setInterval(()=>{
    slides[cur].classList.remove('active'); cur = (cur+1)%slides.length; slides[cur].classList.add('active');
  },3500);

  /* --- Evasive "No" button --- */
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const area = document.querySelector('.propose-area');

  function randPos(){
    const rect = area.getBoundingClientRect();
    const bw = noBtn.offsetWidth, bh=noBtn.offsetHeight;
    const x = Math.random()*(rect.width-bw);
    const y = Math.random()*(rect.height-bh);
    noBtn.style.left = x+'px'; noBtn.style.top = y+'px';
  }

  area.addEventListener('mousemove', e=>{
    const nb = noBtn.getBoundingClientRect();
    const dx = e.clientX - (nb.left + nb.width/2);
    const dy = e.clientY - (nb.top + nb.height/2);
    const dist = Math.sqrt(dx*dx+dy*dy);
    if(dist < 120){ randPos(); }
  });

  // yes button shows a loving message
  yesBtn.addEventListener('click', ()=>{ alert('She said YES! ❤️'); });

  // make sure the No button starts in center
  window.addEventListener('load', ()=>{ noBtn.style.position='absolute'; noBtn.style.left='56%'; noBtn.style.top='40%'; });

})();
