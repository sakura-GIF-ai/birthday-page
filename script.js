const page = document.querySelector(".page");
const openButton = document.querySelector("#openButton");
const opening = document.querySelector("#opening");
const surprise = document.querySelector("#surprise");
const music = document.querySelector("#birthdayMusic");
const musicToggle = document.querySelector("#musicToggle");
const blessingVideo = document.querySelector(".blessing-video");
const fortuneStage = document.querySelector("#fortuneStage");
const drawButton = document.querySelector("#drawButton");
const fortuneCard = document.querySelector("#fortuneCard");
const fortuneLabel = document.querySelector("#fortuneLabel");
const fortuneText = document.querySelector("#fortuneText");
const fortuneBlessing = document.querySelector("#fortuneBlessing");
const replayFireworks = document.querySelector("#replayFireworks");
const canvas = document.querySelector("#sparkCanvas");
const ctx = canvas.getContext("2d");

const fortunes = [
  {
    label: "好运签",
    text: "好运正在赶来的路上",
    blessing: "愿你新的一岁，所有期待都有回响，所有努力都被温柔托住。"
  },
  {
    label: "暴富签",
    text: "财运偏爱漂亮女孩",
    blessing: "愿你钱包鼓鼓，快乐满满，想买的都不纠结，想去的地方都能出发。"
  },
  {
    label: "被爱签",
    text: "你值得被坚定选择",
    blessing: "愿你身边总有真诚的人，懂你的可爱，也珍惜你的脆弱。"
  },
  {
    label: "发光签",
    text: "你的光，不需要被谁允许",
    blessing: "愿你永远漂亮、自由、清醒，也永远有底气做自己。"
  },
  {
    label: "快乐签",
    text: "今天的快乐会续杯",
    blessing: "愿你不止生日快乐，而是每天都有一点小确幸偷偷降落。"
  },
  {
    label: "心愿签",
    text: "许下的愿望都会慢慢实现",
    blessing: "愿你心里想的、手里做的、未来等的，都一步一步变成真的。"
  }
];

let hasOpened = false;
let particles = [];
let burstTimer = 0;
let lastFortuneIndex = -1;
let isDrawing = false;

function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * pixelRatio);
  canvas.height = Math.floor(window.innerHeight * pixelRatio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function lockMusicButton() {
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  musicToggle.style.top = `${Math.round(viewportHeight / 2)}px`;
}

function pickSparkColor() {
  const colors = [
    "255, 239, 180",
    "245, 213, 148",
    "255, 247, 237",
    "241, 202, 208",
    "216, 161, 174"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function createParticle(x, y, options = {}) {
  const burst = options.burst || false;
  const angle = options.angle ?? Math.random() * Math.PI * 2;
  const speed = options.speed ?? (burst ? 1.8 + Math.random() * 3.2 : 0.12 + Math.random() * 0.3);

  return {
    x,
    y,
    prevX: x,
    prevY: y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - (burst ? 0.2 : 0),
    size: options.size ?? (burst ? 1 + Math.random() * 2 : 0.7 + Math.random() * 1.3),
    life: options.life ?? (burst ? 76 + Math.random() * 44 : 150 + Math.random() * 80),
    maxLife: options.maxLife ?? (burst ? 120 : 230),
    gravity: options.gravity ?? (burst ? 0.025 : 0.006),
    friction: options.friction ?? (burst ? 0.982 : 1),
    trail: options.trail ?? burst,
    color: options.color ?? pickSparkColor()
  };
}

function seedParticles() {
  particles = Array.from({ length: 44 }, () =>
    createParticle(Math.random() * window.innerWidth, Math.random() * window.innerHeight)
  );
}

function addGoldBurst(
  x = window.innerWidth * (0.22 + Math.random() * 0.56),
  y = window.innerHeight * (0.16 + Math.random() * 0.28),
  size = 62
) {
  for (let index = 0; index < size; index += 1) {
    const angle = (Math.PI * 2 * index) / size + (Math.random() - 0.5) * 0.2;
    const ring = index % 3;
    particles.push(
      createParticle(x, y, {
        burst: true,
        angle,
        speed: 1.45 + ring * 0.72 + Math.random() * 1.25,
        size: 0.9 + ring * 0.36 + Math.random() * 1.15,
        life: 92 + Math.random() * 42,
        maxLife: 138,
        gravity: 0.018 + ring * 0.004,
        friction: 0.982,
        color: pickSparkColor()
      })
    );
  }

  for (let index = 0; index < 18; index += 1) {
    particles.push(
      createParticle(x, y, {
        burst: true,
        speed: 0.45 + Math.random() * 1.2,
        size: 2.2 + Math.random() * 1.8,
        life: 42 + Math.random() * 24,
        maxLife: 66,
        gravity: 0.01,
        friction: 0.96,
        trail: false,
        color: "255, 247, 237"
      })
    );
  }
}

function showFireworks() {
  const points = [
    [window.innerWidth * 0.22, window.innerHeight * 0.18],
    [window.innerWidth * 0.72, window.innerHeight * 0.2],
    [window.innerWidth * 0.5, window.innerHeight * 0.29]
  ];

  points.forEach(([x, y], index) => {
    window.setTimeout(() => addGoldBurst(x, y, index === 2 ? 82 : 64), index * 260);
  });

  window.setTimeout(() => {
    const baseY = Math.min(window.innerHeight * 0.72, window.innerHeight - 90);
    for (let index = 0; index < 34; index += 1) {
      particles.push(
        createParticle(window.innerWidth * (0.24 + Math.random() * 0.52), baseY, {
          burst: true,
          angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.65,
          speed: 1.6 + Math.random() * 2.2,
          size: 0.9 + Math.random() * 1.3,
          life: 70 + Math.random() * 32,
          maxLife: 110,
          gravity: 0.026,
          color: pickSparkColor()
        })
      );
    }
  }, 360);
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((particle) => particle.life > 0);

  for (const particle of particles) {
    particle.life -= 1;
    particle.prevX = particle.x;
    particle.prevY = particle.y;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= particle.friction;
    particle.vy = particle.vy * particle.friction + particle.gravity;

    const alpha = Math.max(particle.life / particle.maxLife, 0);
    ctx.shadowColor = `rgba(${particle.color}, ${alpha})`;
    ctx.shadowBlur = particle.trail ? 16 : 10;

    if (particle.trail) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${particle.color}, ${alpha * 0.42})`;
      ctx.lineWidth = Math.max(particle.size * 0.72, 0.8);
      ctx.moveTo(particle.prevX, particle.prevY);
      ctx.lineTo(particle.x, particle.y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(${particle.color}, ${alpha * 0.9})`;
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;

  if (hasOpened) {
    burstTimer += 1;
    if (burstTimer % 210 === 1) {
      addGoldBurst();
    }
  }

  while (particles.length < 48) {
    particles.push(createParticle(Math.random() * window.innerWidth, window.innerHeight + 10));
  }

  requestAnimationFrame(drawParticles);
}

async function playMusic() {
  try {
    await music.play();
    musicToggle.classList.remove("is-paused");
    musicToggle.setAttribute("aria-label", "暂停音乐");
  } catch {
    musicToggle.classList.add("is-paused");
    musicToggle.setAttribute("aria-label", "播放音乐");
  }
}

function pauseMusic() {
  music.pause();
  musicToggle.classList.add("is-paused");
  musicToggle.setAttribute("aria-label", "播放音乐");
}

function pickFortune() {
  let nextIndex = Math.floor(Math.random() * fortunes.length);

  if (fortunes.length > 1) {
    while (nextIndex === lastFortuneIndex) {
      nextIndex = Math.floor(Math.random() * fortunes.length);
    }
  }

  lastFortuneIndex = nextIndex;
  return fortunes[nextIndex];
}

function drawFortune() {
  if (isDrawing) {
    return;
  }

  isDrawing = true;
  drawButton.disabled = true;
  drawButton.textContent = "正在为你抽取愿望签";
  fortuneStage.classList.remove("has-fortune");
  fortuneStage.classList.add("is-drawing");
  fortuneCard.setAttribute("aria-hidden", "true");

  const fortune = pickFortune();

  window.setTimeout(() => {
    fortuneLabel.textContent = fortune.label;
    fortuneText.textContent = fortune.text;
    fortuneBlessing.textContent = fortune.blessing;
    fortuneCard.setAttribute("aria-hidden", "false");
    fortuneStage.classList.add("has-fortune");
    showFireworks();
  }, 760);

  window.setTimeout(() => {
    fortuneStage.classList.remove("is-drawing");
    drawButton.disabled = false;
    drawButton.textContent = "再抽一支生日愿望签";
    isDrawing = false;
  }, 1450);
}

openButton.addEventListener("click", async () => {
  if (hasOpened) {
    return;
  }

  hasOpened = true;
  openButton.disabled = true;
  document.body.classList.add("is-surprise-open");
  page.classList.add("is-open");
  opening.setAttribute("aria-hidden", "true");
  surprise.setAttribute("aria-hidden", "false");
  showFireworks();
  await playMusic();
});

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    await playMusic();
    return;
  }

  pauseMusic();
});

blessingVideo.addEventListener("play", pauseMusic);
drawButton.addEventListener("click", drawFortune);
replayFireworks.addEventListener("click", showFireworks);

window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
  lockMusicButton();
});
window.visualViewport?.addEventListener("resize", lockMusicButton);
window.addEventListener("scroll", lockMusicButton, { passive: true });
surprise.addEventListener("scroll", lockMusicButton, { passive: true });

resizeCanvas();
lockMusicButton();
seedParticles();
drawParticles();
