document.addEventListener('DOMContentLoaded', function() {
  const icons = ['🍒', '🍋', '🍊', '🍉', '⭐', '❤️'];
  let coins = 100;
  let points = 0;
  const spinCost = 10;
  const winReward = 50;

  const reelEls = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
  ];
  const coinsEl = document.getElementById('coins');
  const pointsEl = document.getElementById('points');
  const resultEl = document.getElementById('result');
  const spinBtn = document.getElementById('spin');

  let readyForPoint = true; // 결과가 나온 후에만 포인트 증가

  function spin() {
    if (!readyForPoint) return; // 릴이 도는 중에는 클릭 무시
    if (coins < spinCost) {
      resultEl.textContent = 'Not enough coins!';
      return;
    }
    readyForPoint = false; // 릴 도는 중에는 포인트 증가 금지
    coins -= spinCost;
    coinsEl.textContent = coins;
    resultEl.textContent = '';
    spinBtn.disabled = true;

    let spins = [
      Math.floor(Math.random() * icons.length),
      Math.floor(Math.random() * icons.length),
      Math.floor(Math.random() * icons.length)
    ];

    let i = 0;
    let interval = setInterval(() => {
      for (let j = 0; j < 3; j++) {
        reelEls[j].textContent = icons[Math.floor(Math.random() * icons.length)];
      }
      i++;
      if (i > 15) {
        clearInterval(interval);
        for (let j = 0; j < 3; j++) {
          reelEls[j].textContent = icons[spins[j]];
        }
        if (spins[0] === spins[1] && spins[1] === spins[2]) {
          coins += winReward;
          coinsEl.textContent = coins;
          resultEl.textContent = '🎉 Jackpot! +' + winReward + ' coins!';
        } else if (spins[0] === spins[1] || spins[1] === spins[2] || spins[0] === spins[2]) {
          coins += 20;
          coinsEl.textContent = coins;
          resultEl.textContent = '😊 Nice! +20 coins!';
        } else {
          resultEl.textContent = 'Try again!';
        }
        spinBtn.disabled = false;
        readyForPoint = true;
      }
    }, 80);
  }

  spinBtn.addEventListener('click', function() {
    if (readyForPoint) {
      points += 1;
      pointsEl.textContent = points;
      spin();
    }
  });
});
