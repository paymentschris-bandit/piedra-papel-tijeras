const ROULETTE_CHOICES = ["piedra", "papel", "tijeras"];

const Roulette = {
  rotation: 0,
  spinning: false,
  locked: false,
  animId: null,
  speed: 0,
  onLock: null,
  lastLockedChoice: null,
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
  Roulette.lastLockedChoice = null;
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
  Roulette.speed = 0;
  if (Roulette.animId) {
    cancelAnimationFrame(Roulette.animId);
    Roulette.animId = null;
  }
  if (!keepPosition) {
    zeroRouletteMotion();
  }
}

function zeroRouletteMotion() {
  Roulette.rotation = 0;
  Roulette.speed = 0;
  Roulette.spinning = false;
  if (Roulette.animId) {
    cancelAnimationFrame(Roulette.animId);
    Roulette.animId = null;
  }
  const wheel = document.getElementById("roulette-wheel");
  if (wheel) wheel.style.transform = "rotate(0deg)";
}

/** Muestra elección registrada y resetea solo animación (state.choices ya guardado). */
function applyRouletteLockedUI(choice) {
  if (!choice) return;
  Roulette.locked = true;
  Roulette.lastLockedChoice = choice;

  const emoji = CHOICE_EMOJI[choice];
  const name = getChoiceName(choice);
  const center = document.querySelector(".roulette-center");
  if (center) center.textContent = emoji;

  document.getElementById("roulette-lock-btn")?.setAttribute("disabled", "true");
  document.getElementById("roulette-lock-btn")?.classList.add("hidden");
  document.getElementById("roulette-hint")?.classList.add("hidden");

  const lockedEl = document.getElementById("roulette-locked");
  if (lockedEl) {
    lockedEl.textContent =
      typeof t === "function" ? t("roulette.locked", { name }) : `✓ ${name} — elección registrada`;
    lockedEl.classList.remove("hidden");
  }

  zeroRouletteMotion();
}

function getRouletteChoiceAtRotation(rotation) {
  const normalized = ((rotation % 360) + 360) % 360;
  const index = Math.floor(((360 - normalized + 30) % 360) / 120) % 3;
  return ROULETTE_CHOICES[index];
}

function lockRoulette() {
  if (Roulette.locked || !Roulette.spinning) return;

  stopRouletteSpin(true);

  const choice = getRouletteChoiceAtRotation(Roulette.rotation);

  if (Roulette.onLock) Roulette.onLock(choice);

  applyRouletteLockedUI(choice);

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
}

function refreshRouletteI18n() {
  const hint = document.getElementById("roulette-hint");
  const lockBtn = document.getElementById("roulette-lock-btn");
  if (hint && typeof t === "function") {
    hint.innerHTML = t("roulette.hint");
  }
  if (lockBtn && typeof t === "function") {
    lockBtn.textContent = t("roulette.lock");
  }
  if (Roulette.locked && Roulette.lastLockedChoice) {
    const lockedEl = document.getElementById("roulette-locked");
    if (lockedEl) {
      lockedEl.textContent = t("roulette.locked", { name: getChoiceName(Roulette.lastLockedChoice) });
    }
  }
}

function resetRouletteUI() {
  Roulette.locked = false;
  Roulette.lastLockedChoice = null;
  zeroRouletteMotion();
  document.getElementById("roulette-locked")?.classList.add("hidden");
  document.getElementById("roulette-lock-btn")?.classList.remove("hidden");
  document.getElementById("roulette-lock-btn")?.removeAttribute("disabled");
  document.getElementById("roulette-hint")?.classList.remove("hidden");
  const center = document.querySelector(".roulette-center");
  if (center) center.textContent = "?";
}
