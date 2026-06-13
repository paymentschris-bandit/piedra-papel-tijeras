const MOOD_ICONS = MOOD_ICON_SETS;

const RAIN_ICONS = {
  suave: ["lips", "tits", "pussy", "tongue", "heart"],
  picante: ["cock", "pussy", "ass", "cum", "oral", "fuck"],
  extremo: ["cock", "pussy", "ass", "chain", "whip", "plug", "cum", "gag"],
};

let floatInterval = null;
let currentMood = "picante";

function initDecorations() {
  setGlobalMood("picante");
  startFloatingDecor();
}

function setGlobalMood(mood) {
  currentMood = mood || "picante";
  document.body.dataset.mood = currentMood;
  updateMoodStrip(currentMood);
}

function getEffectiveMood(intensity) {
  if (state.intensity === "progresivo") {
    return intensity || getProgressiveIntensity(state.currentRound, state.maxRounds);
  }
  return state.intensity || "picante";
}

function updateMoodStrip(mood) {
  const strip = document.getElementById("result-mood-strip");
  if (!strip) return;
  const icons = MOOD_ICON_SETS[mood] || MOOD_ICON_SETS.picante;
  mountIcons(strip, icons);
}

function setChallengeMood(intensity) {
  const mood = getEffectiveMood(intensity);
  setGlobalMood(mood);

  const box = document.getElementById("challenge-box");
  const finalBox = document.getElementById("final-challenge-box");
  [box, finalBox].forEach((el) => {
    if (!el) return;
    el.classList.remove("mood-suave", "mood-picante", "mood-extremo", "challenge-glow");
    el.classList.add(`mood-${mood}`);
    if (mood !== "suave") el.classList.add("challenge-glow");
  });

  const iconRow = document.getElementById("challenge-icons");
  if (iconRow) {
    const icons = (MOOD_ICON_SETS[mood] || MOOD_ICON_SETS.picante).slice(0, 5);
    mountIcons(iconRow, icons);
  }
}

function startFloatingDecor() {
  const container = document.getElementById("floating-decor");
  if (!container) return;

  if (floatInterval) clearInterval(floatInterval);

  spawnFloatIcon();
  floatInterval = setInterval(spawnFloatIcon, 2200);
}

function spawnFloatIcon() {
  const container = document.getElementById("floating-decor");
  if (!container) return;

  const icons = MOOD_ICON_SETS[currentMood] || MOOD_ICON_SETS.picante;
  const name = icons[Math.floor(Math.random() * icons.length)];
  const el = document.createElement("span");
  el.className = "float-icon";
  el.innerHTML = iconHtml(name, "sex-icon sex-icon-float");
  el.style.left = `${Math.random() * 90 + 5}%`;
  el.style.setProperty("--fi-opacity", currentMood === "extremo" ? "0.55" : "0.4");
  el.style.animationDuration = `${8 + Math.random() * 8}s`;
  const size = 24 + Math.random() * 20;
  el.style.setProperty("--icon-size", `${size}px`);
  container.appendChild(el);
  setTimeout(() => el.remove(), 18000);
}

function iconRain(mood, count = 18) {
  const container = document.getElementById("emoji-rain");
  if (!container) return;

  const icons = RAIN_ICONS[mood] || RAIN_ICONS.picante;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const name = icons[Math.floor(Math.random() * icons.length)];
      const el = document.createElement("span");
      el.className = "rain-emoji";
      el.innerHTML = iconHtml(name, "sex-icon sex-icon-rain");
      el.style.left = `${Math.random() * 100}%`;
      el.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      const size = 20 + Math.random() * 16;
      el.style.setProperty("--icon-size", `${size}px`);
      container.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, i * 80);
  }
}

function emojiRain(mood, count) {
  iconRain(mood, count);
}

function pulseVignette(duration = 2500) {
  const el = document.getElementById("vignette-pulse");
  if (!el) return;
  el.classList.add("active");
  setTimeout(() => el.classList.remove("active"), duration);
}

function animateChallengeRevealDecor(intensity) {
  const mood = getEffectiveMood(intensity);
  setChallengeMood(mood);
  iconRain(mood, mood === "extremo" ? 28 : mood === "picante" ? 20 : 12);
  if (mood !== "suave") pulseVignette(mood === "extremo" ? 3500 : 2000);
}

function animateWinDecor() {
  const card = document.querySelector(".result-card");
  card?.classList.add("win-shake");
  setTimeout(() => card?.classList.remove("win-shake"), 1200);

  const subtitle = document.querySelector(".result-subtitle");
  subtitle?.classList.add("pulse-text");

  iconRain(currentMood, 15);
  pulseVignette(2000);
}

function burstSpicyParticles(x, y, mood) {
  const icons = RAIN_ICONS[mood] || RAIN_ICONS.picante;
  const container = document.getElementById("emoji-rain");
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const name = icons[i % icons.length];
      const el = document.createElement("span");
      el.className = "rain-emoji";
      el.innerHTML = iconHtml(name, "sex-icon sex-icon-rain");
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.animationDuration = "1.2s";
      el.style.setProperty("--icon-size", "28px");
      container?.appendChild(el);
      setTimeout(() => el.remove(), 1300);
    }, i * 40);
  }
  burstParticles(x, y, mood === "extremo" ? 35 : 22, mood === "suave" ? "340" : "gold");
}

document.addEventListener("DOMContentLoaded", initDecorations);
