const ROULETTE_CHOICES = ["piedra", "papel", "tijeras"];

const Roulette = {
  rotation: 0,
  spinning: false,
  locked: false,
  animId: null,
  speed: 0,
  onLock: null,
};

function initRoulette(onLockCallback) {
  Roulette.onLock = onLockCallback;
  const btn = document.getElementById("roulette-lock-btn");
  if (btn) {
    btn.replaceWith(btn.cloneNode(true));
    document.getElementById("roulette-lock-btn").addEventListener("click", lockRoulette);
  }
}

function showChoiceUI(mode) {
  const buttons = document.getElementById("choices-buttons");
  const roulette = document.getElementById("choices-roulette");
  if (!buttons || !roulette) return;

  const isRoulette = mode === "roulette";
  const hideForReto = document.body.classList.contains("webcam-reto-mode");
  buttons.classList.toggle("hidden", isRoulette || hideForReto);
  roulette.classList.toggle("hidden", !isRoulette || hideForReto);
}

function startRouletteSpin() {
  const wheel = document.getElementById("roulette-wheel");
  if (!wheel) return;

  stopRouletteSpin(false);
  Roulette.locked = false;
  Roulette.rotation = Roulette.rotation || 0;
  Roulette.speed = 6 + Math.random() * 4;
  Roulette.spinning = true;

  document.getElementById("roulette-lock-btn")?.classList.remove("hidden");
  document.getElementById("roulette-lock-btn")?.removeAttribute("disabled");
  document.getElementById("roulette-locked")?.classList.add("hidden");
  document.getElementById("roulette-hint")?.classList.remove("hidden");

  const center = document.querySelector(".roulette-center");
  if (center) center.textContent = "?";

  function tick() {
    if (!Roulette.spinning) return;
    Roulette.rotation += Roulette.speed;
    wheel.style.transform = `rotate(${Roulette.rotation}deg)`;
    Roulette.animId = requestAnimationFrame(tick);
  }

  Roulette.animId = requestAnimationFrame(tick);
}

function stopRouletteSpin(keepPosition = true) {
  Roulette.spinning = false;
  if (Roulette.animId) {
    cancelAnimationFrame(Roulette.animId);
    Roulette.animId = null;
  }
}

function getRouletteChoiceAtRotation(rotation) {
  const normalized = ((rotation % 360) + 360) % 360;
  const index = Math.floor(((360 - normalized + 30) % 360) / 120) % 3;
  return ROULETTE_CHOICES[index];
}

function lockRoulette() {
  if (Roulette.locked || !Roulette.spinning) return;

  Roulette.locked = true;
  stopRouletteSpin(true);

  const choice = getRouletteChoiceAtRotation(Roulette.rotation);
  const emoji = CHOICE_EMOJI[choice];
  const name = CHOICE_NAMES[choice];

  const center = document.querySelector(".roulette-center");
  if (center) center.textContent = emoji;

  document.getElementById("roulette-lock-btn")?.setAttribute("disabled", "true");
  document.getElementById("roulette-lock-btn")?.classList.add("hidden");
  document.getElementById("roulette-hint")?.classList.add("hidden");

  const lockedEl = document.getElementById("roulette-locked");
  if (lockedEl) {
    lockedEl.textContent = `✓ ${name} — elección registrada`;
    lockedEl.classList.remove("hidden");
  }

  flashScreen("choice");

  const wheel = document.getElementById("roulette-wheel");
  if (wheel) {
    const rect = wheel.getBoundingClientRect();
    const mood = typeof getEffectiveMood === "function" ? getEffectiveMood() : "picante";
    if (typeof burstSpicyParticles === "function") {
      burstSpicyParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, mood);
    } else {
      burstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
    }
  }

  if (Roulette.onLock) Roulette.onLock(choice);
}

function resetRouletteUI() {
  Roulette.locked = false;
  stopRouletteSpin(false);
  document.getElementById("roulette-locked")?.classList.add("hidden");
  document.getElementById("roulette-lock-btn")?.classList.remove("hidden");
  document.getElementById("roulette-lock-btn")?.removeAttribute("disabled");
  document.getElementById("roulette-hint")?.classList.remove("hidden");
  const center = document.querySelector(".roulette-center");
  if (center) center.textContent = "?";
}
