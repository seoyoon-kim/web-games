const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const grid = 20;
let count = 0;
let snake = [{ x: 200, y: 200 }]; // 중앙에서 시작
let direction = 'right';
let food = getRandomPosition();
let gameOver = false;

function getRandomPosition() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
      y: Math.floor(Math.random() * (canvas.height / grid)) * grid
    };
  } while (snake.some(part => part.x === position.x && part.y === position.y));
  return position;
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  else if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  else if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
  else if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
});

function loop() {
  if (gameOver) return;
  requestAnimationFrame(loop);
  if (++count < 8) return; // 속도 약간 느리게 조정
  count = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move snake
  let head = { ...snake[0] };
  if (direction === 'left') head.x -= grid;
  if (direction === 'up') head.y -= grid;
  if (direction === 'right') head.x += grid;
  if (direction === 'down') head.y += grid;

  // Wall collision
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height
  ) {
    gameOver = true;
    alert('Game Over!');
    return;
  }

  // Self collision
  for (let part of snake) {
    if (head.x === part.x && head.y === part.y) {
      gameOver = true;
      alert('Game Over!');
      return;
    }
  }

  snake.unshift(head);

  // Food collision
  if (head.x === food.x && head.y === food.y) {
    food = getRandomPosition();
  } else {
    snake.pop();
  }

  // Draw food
  ctx.fillStyle = '#FF5252';
  ctx.fillRect(food.x, food.y, grid-2, grid-2);

  // Draw snake
  ctx.fillStyle = '#4CAF50';
  for (let part of snake) {
    ctx.fillRect(part.x, part.y, grid-2, grid-2);
  }
}

loop();
