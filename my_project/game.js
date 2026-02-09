// T-Rex-like runner game with heart obstacles
(function(){
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width, H = canvas.height;

  // images (place your PNGs in assets/)
  const playerImg = new Image(); playerImg.src = 'assets/player.png';
  const shooterImg = new Image(); shooterImg.src = 'assets/shooter.png';
  const heartImg = new Image(); heartImg.src = 'assets/heart.png';
  let imagesLoaded = 0;
  [playerImg, shooterImg, heartImg].forEach(img => { img.onload = () => imagesLoaded++; img.onerror = () => imagesLoaded++; });

  // Player
  const player = {x:60,y:0,w:44,h:44,vy:0,jumpV:-14,ground:0,isOnGround:true};
  const gravity = 0.8;

  // Game state
  let speed = 6;
  let obstacles = [];
  let spawnTimer = 0;
  let running = false;
  let gameStarted = false;
  let countdownTime = -1;

  function resize(){ W = canvas.width = Math.min(1000, window.innerWidth-80); H = canvas.height = 300; player.ground = H - 44 - 20; player.y = player.ground; }
  window.addEventListener('resize', resize); resize();

  function spawn(){
    const heartSize = 32; // uniform size
    obstacles.push({x:W + 40, y: player.ground + (player.h - heartSize), w:heartSize, h:heartSize});
  }

  function startCountdown(){
    // wait for images to load (with graceful fallback)
    function doCountdown(){
      countdownTime = 3;
      const interval = setInterval(()=>{
        countdownTime--;
        if(countdownTime < 0){
          clearInterval(interval);
          running = true;
          gameStarted = true;
        }
      }, 1000);
    }

    if(imagesLoaded < 3){
      // poll until loaded or timeout
      const startWait = Date.now();
      const waiter = setInterval(()=>{
        if(imagesLoaded >= 3 || Date.now() - startWait > 3000){
          clearInterval(waiter); doCountdown();
        }
      }, 150);
    } else {
      doCountdown();
    }
  }

  function update(){
    if(!running) return;

    // increase difficulty over time
    speed = 6 + Math.min(14, gameStarted ? speed * 0.0008 : 0);

    // player physics
    player.vy += gravity; player.y += player.vy;
    if(player.y >= player.ground){ player.y = player.ground; player.vy = 0; player.isOnGround = true; }

    // spawn logic
    spawnTimer -= speed/6;
    if(spawnTimer <= 0){ spawnTimer = 70 + Math.random()*90; spawn(); }

    // move obstacles (right to left)
    for(let i=obstacles.length-1;i>=0;i--){
      const o = obstacles[i]; o.x -= speed;
      // collision AABB
      if(o.x < player.x + player.w && o.x + o.w > player.x && o.y < player.y + player.h && o.y + o.h > player.y){
        gameOver();
      }
      if(o.x + o.w < -50) obstacles.splice(i,1);
    }
  }

  function drawHeart(x,y,s,color){
    ctx.save(); ctx.translate(x,y);
    ctx.fillStyle = color;
    ctx.beginPath();
    const top = 0;
    ctx.moveTo(0, top + s*0.3);
    ctx.bezierCurveTo(0, top - s*0.2, -s*0.5, top - s*0.2, -s*0.5, top + s*0.3);
    ctx.bezierCurveTo(-s*0.5, top + s*0.75, 0, top + s, 0, top + s);
    ctx.bezierCurveTo(0, top + s, s*0.5, top + s*0.75, s*0.5, top + s*0.3);
    ctx.bezierCurveTo(s*0.5, top - s*0.2, 0, top - s*0.2, 0, top + s*0.3);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function drawShooter(){
    // character on right shooting hearts
    const sx = W - 80, sy = player.ground - 20;
    // draw shooter image if available
    if (shooterImg.complete && shooterImg.naturalWidth) {
      ctx.drawImage(shooterImg, sx, sy, 60, 60);
    } else {
      // simple placeholder: rectangle with gun
      ctx.fillStyle = '#8b4d6d';
      ctx.fillRect(sx, sy, 60, 60); // body
      ctx.fillStyle = '#ff4d94';
      ctx.fillRect(sx + 55, sy + 20, 20, 8); // gun barrel
    }
  }

  function draw(){
    // background
    ctx.fillStyle = '#fff5f8'; ctx.fillRect(0,0,W,H);

    // ground pattern (moving right to left)
    ctx.fillStyle = '#ffe6f0'; ctx.fillRect(0, player.ground + player.h, W, H - (player.ground + player.h));
    ctx.strokeStyle = '#ffd0e3'; ctx.lineWidth = 4; ctx.beginPath();
    const dashX = -(Date.now()/10)%40; // moves right to left
    for(let x = -40 + dashX; x < W; x += 40){ ctx.moveTo(x, player.ground + player.h + 8); ctx.lineTo(x+20, player.ground + player.h + 8);} ctx.stroke();

    // player (image fallback to rectangle)
    if (playerImg.complete && playerImg.naturalWidth) {
      ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
    } else {
      ctx.fillStyle = '#4d2b4d'; ctx.fillRect(player.x, player.y, player.w, player.h);
    }

    // shooter character on right
    drawShooter();

    // obstacles (heart image fallback to vector heart)
    obstacles.forEach(o=>{
      if (heartImg.complete && heartImg.naturalWidth) {
        ctx.drawImage(heartImg, o.x, o.y, o.w, o.h);
      } else {
        drawHeart(o.x, o.y, o.w, '#ff4d94');
      }
    });

    // character labels
    ctx.fillStyle = '#8b536b'; ctx.font = 'bold 16px Inter';
    ctx.fillText('you', player.x + 8, player.y - 8);
    const shooterX = W - 80;
    ctx.fillText('me', shooterX + 12, player.ground - 35);

    // countdown or instructions
    ctx.fillStyle = '#8b536b'; ctx.font = 'bold 20px Inter';
    if(countdownTime >= 0){
      ctx.fillText(String(countdownTime), W/2 - 10, 40);
    } else if(!gameStarted){
      ctx.fillText('Tap to start', W/2 - 50, 40);
    }
  }

  function loop(){ update(); draw(); requestAnimationFrame(loop); }
  loop();

  // input
  function tryJump(){ if(player.isOnGround){ player.vy = player.jumpV; player.isOnGround=false; }}
  window.addEventListener('keydown', e=>{ if(e.code === 'Space'){ if(!gameStarted) startCountdown(); else tryJump(); } });
  canvas.addEventListener('click', ()=>{ if(!gameStarted) startCountdown(); else tryJump(); });

  // modal buttons
  function gameOver(){ running = false; document.getElementById('loseModal').classList.remove('hidden'); }
  document.getElementById('restartBtn').addEventListener('click', ()=>{
    obstacles.length = 0; speed = 6; running = false; gameStarted = false; countdownTime = -1; document.getElementById('loseModal').classList.add('hidden');
  });
  document.getElementById('proceedBtn').addEventListener('click', ()=>{ window.location.href = 'propose.html'; });

})();
