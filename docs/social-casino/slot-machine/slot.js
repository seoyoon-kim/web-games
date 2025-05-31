document.addEventListener('DOMContentLoaded', function() {
  // 인증 관련
  const authSection = document.getElementById('auth-section');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const loginMsg = document.getElementById('login-msg');
  const registerMsg = document.getElementById('register-msg');
  const logoutBtn = document.getElementById('logout-btn');
  const gameSection = document.getElementById('game-section');

  function showLoginForm() {
    loginForm.style.display = '';
    registerForm.style.display = 'none';
    loginMsg.textContent = '';
    registerMsg.textContent = '';
  }
  function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = '';
    loginMsg.textContent = '';
    registerMsg.textContent = '';
  }
  showLogin && showLogin.addEventListener('click', e => { e.preventDefault(); showLoginForm(); });
  showRegister && showRegister.addEventListener('click', e => { e.preventDefault(); showRegisterForm(); });

  // 회원가입
  registerBtn && registerBtn.addEventListener('click', function() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    if (!username || !password) {
      registerMsg.textContent = 'Enter username & password';
      return;
    }
    if (localStorage.getItem('scuser_' + username)) {
      registerMsg.textContent = 'Username already exists';
      return;
    }
    localStorage.setItem('scuser_' + username, password);
    registerMsg.textContent = 'Registered! Login now.';
  });

  // 로그인
  loginBtn && loginBtn.addEventListener('click', function() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    if (!username || !password) {
      loginMsg.textContent = 'Enter username & password';
      return;
    }
    const stored = localStorage.getItem('scuser_' + username);
    if (stored && stored === password) {
      localStorage.setItem('scuser_current', username);
      loginMsg.textContent = '';
      showGame();
    } else {
      loginMsg.textContent = 'Invalid credentials';
    }
  });

  // 로그아웃
  logoutBtn && logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('scuser_current');
    showAuth();
  });

  function showGame() {
    authSection.style.display = 'none';
    gameSection.style.display = '';
  }
  function showAuth() {
    authSection.style.display = '';
    gameSection.style.display = 'none';
  }

  // 자동 로그인 체크
  if (localStorage.getItem('scuser_current')) {
    showGame();
  } else {
    showAuth();
  }

  // 슬롯머신 게임 기존 코드
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
  let readyForPoint = true;

  function spin() {
    if (!readyForPoint) return;
    if (coins < spinCost) {
      resultEl.textContent = 'Not enough coins!';
      return;
    }
    readyForPoint = false;
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

  spinBtn && spinBtn.addEventListener('click', function() {
    if (readyForPoint) {
      points += 1;
      pointsEl.textContent = points;
      spin();
    }
  });
});
