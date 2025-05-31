const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.28;
const FLAP = -5.5;
const PIPE_WIDTH = 50;
const PIPE_GAP = 200;
const PIPE_SPEED = 0.7;

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

function drawDogFace(x, y, w, h) {
  // 얼굴
  ctx.fillStyle = '#fffbe7';
  ctx.beginPath();
  ctx.ellipse(x, y, w/2, h/2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#a67c52';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 귀(왼쪽)
  ctx.save();
  ctx.translate(x - w/2 + 4, y - h/3);
  ctx.rotate(-0.3);
  ctx.fillStyle = '#a67c52';
  ctx.beginPath();
  ctx.ellipse(0, 0, w/5, h/3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // 귀(오른쪽)
  ctx.save();
  ctx.translate(x + w/2 - 4, y - h/3);
  ctx.rotate(0.3);
  ctx.fillStyle = '#a67c52';
  ctx.beginPath();
  ctx.ellipse(0, 0, w/5, h/3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 눈
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x - w/6, y - h/10, w/14, 0, Math.PI * 2);
  ctx.arc(x + w/6, y - h/10, w/14, 0, Math.PI * 2);
  ctx.fill();

  // 코
  ctx.fillStyle = '#a67c52';
  ctx.beginPath();
  ctx.ellipse(x, y + h/10, w/13, h/16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.stroke();

  // 입
  ctx.beginPath();
  ctx.moveTo(x, y + h/8);
  ctx.quadraticCurveTo(x, y + h/6, x - w/12, y + h/6);
  ctx.moveTo(x, y + h/8);
  ctx.quadraticCurveTo(x, y + h/6, x + w/12, y + h/6);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawBird() {
  drawDogFace(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = '#228B22';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
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

  if (bird.y + bird.height/2 > canvas.height || bird.y - bird.height/2 < 0) {
    gameOver = true;
    if (score > highScore) highScore = score;
    setTimeout(() => { alert('Game Over! Score: ' + score); reset(); }, 100);
    return;
  }

  pipes.forEach(pipe => {
    pipe.x -= PIPE_SPEED;
  });

  if (pipes.length && pipes[0].x + PIPE_WIDTH < 0) {
    pipes.shift();
    score++;
  }

  if (pipes.length < 3 || pipes[pipes.length-1].x < canvas.width - 160) {
    spawnPipe();
  }

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
