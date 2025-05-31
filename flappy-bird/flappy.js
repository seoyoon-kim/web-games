const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.5;
const FLAP = -8;
const PIPE_WIDTH = 50;
const PIPE_GAP = 160; // 기존 120에서 160으로 넓힘

let bird = { x: 60, y: 200, width: 32, height: 32, velocity: 0 };
let pipes = [];
let score = 0;
let highScore = 0;
let gameOver = false;

function reset() {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  // 첫 관문은 무조건 충분히 넓게 생성
  pipes.push({
    x: canvas.width,
    top: 100,
    bottom: 100 + PIPE_GAP
  });
}

function spawnPipe() {
  const top = Math.random() * 200 + 50;
  pipes.push({
    x: canvas.width,
    top: top,
    bottom: top + PIPE_GAP
  });
}

function drawBird() {
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(bird.x, bird.y, bird.width/2, bird.height/2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.stroke();
}

function drawPipes() {
  ctx.fillStyle = '#228B22';
  pipes.forEach(pipe => {
    // Top pipe
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom);
  });
}

function drawScore() {
  ctx.fillStyle = '#333';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
  ctx.font = '16px Arial';
  ctx.fillText('High Score: ' + highScore, 10, 50);
}

function update() {
  if (gameOver) return;
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  // Bird collision with ground or ceiling
  if (bird.y + bird.height/2 > canvas.height || bird.y - bird.height/2 < 0) {
    gameOver = true;
    if (score > highScore) highScore = score;
    setTimeout(() => { alert('Game Over! Score: ' + score); reset(); }, 100);
    return;
  }

  // Move pipes
  pipes.forEach(pipe => {
    pipe.x -= 2;
  });

  // Remove off-screen pipes
  if (pipes.length && pipes[0].x + PIPE_WIDTH < 0) {
    pipes.shift();
    score++;
  }

  // Add new pipes
  if (pipes.length < 3 || pipes[pipes.length-1].x < canvas.width - 160) {
    spawnPipe();
  }

  // Bird collision with pipes
  pipes.forEach(pipe => {
    if (
      bird.x + bird.width/2 > pipe.x &&
      bird.x - bird.width/2 < pipe.x + PIPE_WIDTH &&
      (bird.y - bird.height/2 < pipe.top || bird.y + bird.height/2 > pipe.bottom)
    ) {
      gameOver = true;
      if (score > highScore) highScore = score;
      setTimeout(() => { alert('Game Over! Score: ' + score); reset(); }, 100);
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPipes();
  drawBird();
  drawScore();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !gameOver) {
    bird.velocity = FLAP;
  }
});
canvas.addEventListener('mousedown', () => {
  if (!gameOver) bird.velocity = FLAP;
});

reset();
gameLoop();
