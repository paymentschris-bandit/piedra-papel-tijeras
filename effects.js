const FX = {
  canvas: null,
  ctx: null,
  particles: [],
  animId: null,
  w: 0,
  h: 0,
};

function initEffects() {
  FX.canvas = document.getElementById("particles-canvas");
  if (!FX.canvas) return;

  FX.ctx = FX.canvas.getContext("2d");
  resizeParticles();
  window.addEventListener("resize", resizeParticles);

  for (let i = 0; i < 40; i++) {
    FX.particles.push(createAmbientParticle());
  }

  animateParticles();
}

function resizeParticles() {
  if (!FX.canvas) return;
  FX.w = window.innerWidth;
  FX.h = window.innerHeight;
  FX.canvas.width = FX.w;
  FX.canvas.height = FX.h;
}

function createAmbientParticle() {
  return {
    x: Math.random() * FX.w,
    y: Math.random() * FX.h,
    size: Math.random() * 2.5 + 0.5,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: -Math.random() * 0.4 - 0.1,
    opacity: Math.random() * 0.4 + 0.1,
    hue: Math.random() > 0.5 ? 340 : 30,
  };
}

function animateParticles() {
  if (!FX.ctx) return;

  FX.ctx.clearRect(0, 0, FX.w, FX.h);

  FX.particles.forEach((p) => {
    if (p.life !== undefined) {
      p.life--;
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += 0.06;
      p.opacity = Math.max(0, p.life / p.maxLife);
    } else {
      p.x += p.speedX;
      p.y += p.speedY;
      p.opacity += Math.sin(Date.now() * 0.001 + p.x) * 0.002;

      if (p.y < -10) {
        p.y = FX.h + 10;
        p.x = Math.random() * FX.w;
      }
      if (p.x < -10) p.x = FX.w + 10;
      if (p.x > FX.w + 10) p.x = -10;
    }

    if (p.life !== undefined && p.life <= 0) return;

    FX.ctx.beginPath();
    FX.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    FX.ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${Math.max(0.05, p.opacity)})`;
    FX.ctx.fill();
  });

  FX.particles = FX.particles.filter(
    (p) => p.life === undefined || p.life > 0
  );

  FX.animId = requestAnimationFrame(animateParticles);
}

function burstParticles(x, y, count = 24, color = "340") {
  if (!FX.ctx) return;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = Math.random() * 4 + 2;
    FX.particles.push({
      x,
      y,
      size: Math.random() * 3 + 1,
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      opacity: 0.9,
      hue: color === "gold" ? 35 : 340,
      life: 55,
      maxLife: 55,
    });
  }
}

function flashScreen(type = "choice") {
  const el = document.getElementById("flash-overlay");
  if (!el) return;

  el.className = `flash-overlay flash-${type} active`;
  setTimeout(() => el.classList.remove("active"), type === "win" ? 600 : 350);
}

function showScreenAnimated(name) {
  const screenMap = {
    age: document.getElementById("age-gate"),
    setup: document.getElementById("setup-screen"),
    lobby: document.getElementById("lobby-screen"),
    game: document.getElementById("game-screen"),
    result: document.getElementById("result-screen"),
    end: document.getElementById("end-screen"),
  };

  const next = screenMap[name];
  if (!next) return;

  const current = document.querySelector(".screen.active");
  if (current && current !== next) {
    current.classList.add("screen-out");
    setTimeout(() => {
      current.classList.remove("active", "screen-out");
      next.classList.add("active", "screen-in");
      setTimeout(() => next.classList.remove("screen-in"), 450);
      if (typeof updateWebcamScreenMode === "function") updateWebcamScreenMode(name);
    }, 200);
  } else {
    Object.values(screenMap).forEach((s) => s?.classList.remove("active", "screen-in", "screen-out"));
    next.classList.add("active", "screen-in");
    setTimeout(() => next.classList.remove("screen-in"), 450);
  }

  if (typeof updateWebcamScreenMode === "function") {
    updateWebcamScreenMode(name);
  }
}

function animateChoice(selectedBtn) {
  document.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.classList.remove("selected", "dimmed");
  });

  selectedBtn.classList.add("selected");
  document.querySelectorAll(".choice-btn:not(.selected)").forEach((btn) => {
    btn.classList.add("dimmed");
  });

  flashScreen("choice");

  const rect = selectedBtn.getBoundingClientRect();
  const mood = typeof getEffectiveMood === "function"
    ? getEffectiveMood()
    : "picante";
  if (typeof burstSpicyParticles === "function") {
    burstSpicyParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, mood);
  } else {
    burstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
  }
}

function animateScoreBump(playerNum) {
  const el = document.getElementById(playerNum === 1 ? "score-p1" : "score-p2");
  const scoreEl = el?.querySelector(".score");
  if (!scoreEl) return;

  scoreEl.classList.remove("score-bump");
  void scoreEl.offsetWidth;
  scoreEl.classList.add("score-bump");

  const rect = scoreEl.getBoundingClientRect();
  burstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 20, "gold");
}

function setActivePlayer(playerNum) {
  document.getElementById("score-p1")?.classList.toggle("is-active", playerNum === 1);
  document.getElementById("score-p2")?.classList.toggle("is-active", playerNum === 2);
}

function animateResultReveal(winner) {
  flashScreen(winner ? "win" : "draw");

  const choices = document.querySelectorAll(".result-choice");
  choices.forEach((el, i) => {
    el.style.animationDelay = `${i * 0.15}s`;
    el.classList.remove("clash-in");
    void el.offsetWidth;
    el.classList.add("clash-in");
  });

  if (winner) {
    setTimeout(() => {
      document.querySelectorAll(".result-choice.winner").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (typeof burstSpicyParticles === "function") {
          burstSpicyParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, currentMood || "picante");
        } else {
          burstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 30, "gold");
        }
      });
    }, 400);
  }
}

function animateChallengeReveal() {
  const box = document.getElementById("challenge-box");
  if (!box) return;
  box.classList.remove("challenge-reveal");
  void box.offsetWidth;
  box.classList.add("challenge-reveal");
}

let teaseTimers = [];

function clearChallengeTease() {
  teaseTimers.forEach(clearTimeout);
  teaseTimers = [];
  const wrap = document.getElementById("challenge-tease-wrap");
  const el = document.getElementById("challenge-tease");
  if (!wrap || !el) return;
  wrap.classList.add("hidden");
  wrap.classList.remove("tease-pulse");
  el.classList.remove("visible");
  el.textContent = "";
}

function showChallengeTease(messages, intensity) {
  clearChallengeTease();
  if (!messages?.length) return;

  const wrap = document.getElementById("challenge-tease-wrap");
  const el = document.getElementById("challenge-tease");
  if (!wrap || !el) return;

  wrap.classList.remove("hidden");
  wrap.classList.toggle("tease-pulse", intensity === "extremo" || messages.length > 1);

  let delay = 1400;
  messages.forEach((msg, index) => {
    const timer = setTimeout(() => {
      el.classList.remove("visible");
      void el.offsetWidth;
      el.textContent = msg;
      el.classList.add("visible");
    }, delay);
    teaseTimers.push(timer);
    delay += index === 0 ? 2800 : 0;
  });
}

function updateEscaladaBar(currentRound, maxRounds) {
  const bar = document.getElementById("escalada-bar");
  const fill = document.getElementById("escalada-fill");
  if (!bar || !fill) return;

  bar.classList.remove("hidden");

  let pct;
  if (maxRounds >= 999) {
    pct = Math.min(100, (currentRound / 15) * 100);
  } else {
    pct = (currentRound / maxRounds) * 100;
  }

  fill.style.width = `${pct}%`;

  const level = getProgressiveIntensity(currentRound, maxRounds);
  fill.dataset.level = level;
}

function hideEscaladaBar() {
  document.getElementById("escalada-bar")?.classList.add("hidden");
}

function staggerChoices() {
  document.querySelectorAll(".choice-btn").forEach((btn, i) => {
    btn.classList.remove("selected", "dimmed", "choice-enter");
    btn.style.animationDelay = `${i * 0.1}s`;
    btn.classList.add("choice-enter");
  });
}

document.addEventListener("DOMContentLoaded", initEffects);
