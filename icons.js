const SEX_ICONS = {
  lips: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13c0-5 5-9 13-9s13 4 13 9c0 7-7 13-13 13S3 20 3 13z" fill="#c44569"/><path d="M7 12c2-3 6-4 9-4s7 1 9 4" stroke="#8b2040" stroke-width="1.3"/><path d="M8 14c2 4 5 6 8 6s6-2 8-6" stroke="#ffb3c7" stroke-width="1" opacity=".85"/><path d="M16 16c0 6 1 10 2 13 1 2 2 2 2 0 1-3 2-7 2-13" fill="#e0567a"/><path d="M14 28c0 2 1 3 2 3s2-1 2-3" stroke="#ffb3c7" stroke-width="1.2" opacity=".8"/></svg>`,

  tongue: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 10c0-3 4-6 10-6s10 3 10 6c0 2-2 4-5 5" fill="#c44569"/><path d="M8 12c0 10 3 16 8 18 2 1 4 1 6 0 5-2 8-8 8-18" fill="#e0567a"/><path d="M14 20c0 4 1 7 2 9" stroke="#ffb3c7" stroke-width="1.3" opacity=".9"/><ellipse cx="16" cy="29" rx="3" ry="2" fill="#e0567a"/></svg>`,

  cock: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="11" cy="27" rx="5.5" ry="4.5" fill="#c44569"/><ellipse cx="21" cy="27" rx="5.5" ry="4.5" fill="#c44569"/><path d="M16 27V11" stroke="#e0567a" stroke-width="5.5" stroke-linecap="round"/><path d="M16 3c5 0 8 4 8 9s-3 9-8 9-8-4-8-9 3-9 8-9z" fill="#e0567a"/><path d="M16 5c3.5 0 6 2.5 6 6.5s-2.5 6.5-6 6.5" stroke="#ffb3c7" stroke-width="1" opacity=".55"/><circle cx="16" cy="9" r="1.5" fill="#ffb3c7" opacity=".7"/><path d="M14 2l2-1 2 1" stroke="#d4a574" stroke-width="1" stroke-linecap="round"/></svg>`,

  rod: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="11" cy="27" rx="5.5" ry="4.5" fill="#c44569"/><ellipse cx="21" cy="27" rx="5.5" ry="4.5" fill="#c44569"/><path d="M16 27V11" stroke="#e0567a" stroke-width="5.5" stroke-linecap="round"/><path d="M16 3c5 0 8 4 8 9s-3 9-8 9-8-4-8-9 3-9 8-9z" fill="#e0567a"/><path d="M16 5c3.5 0 6 2.5 6 6.5s-2.5 6.5-6 6.5" stroke="#ffb3c7" stroke-width="1" opacity=".55"/><circle cx="16" cy="9" r="1.5" fill="#ffb3c7" opacity=".7"/></svg>`,

  pussy: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 29C7 29 4 21 4 14c0-6 4-10 12-10s12 4 12 10c0 7-3 15-12 15z" fill="#c44569"/><path d="M16 25C10 25 8 19 8 14c0-4 2.5-7 8-7s8 3 8 7c0 5-2 11-8 11z" fill="#e0567a"/><ellipse cx="16" cy="16" rx="2.2" ry="5" fill="#8b2040"/><circle cx="16" cy="9.5" r="2.2" fill="#ffb3c7"/><path d="M12 12c1 2 2.5 3 4 3M20 12c-1 2-2.5 3-4 3" stroke="#ffb3c7" stroke-width=".9" opacity=".65"/></svg>`,

  venus: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 29C7 29 4 21 4 14c0-6 4-10 12-10s12 4 12 10c0 7-3 15-12 15z" fill="#c44569"/><path d="M16 25C10 25 8 19 8 14c0-4 2.5-7 8-7s8 3 8 7c0 5-2 11-8 11z" fill="#e0567a"/><ellipse cx="16" cy="16" rx="2.2" ry="5" fill="#8b2040"/><circle cx="16" cy="9.5" r="2.2" fill="#ffb3c7"/></svg>`,

  ass: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10.5" cy="17" rx="9" ry="12" fill="#e0567a"/><ellipse cx="21.5" cy="17" rx="9" ry="12" fill="#e0567a"/><path d="M16 6v22" stroke="#8b2040" stroke-width="2.2"/><path d="M16 10c-2 6-2.5 11-1 16M16 10c2 6 2.5 11 1 16" stroke="#c44569" stroke-width="1.4"/><ellipse cx="16" cy="24" rx="2.5" ry="3.5" fill="#8b2040" opacity=".55"/></svg>`,

  peach: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10.5" cy="17" rx="9" ry="12" fill="#e0567a"/><ellipse cx="21.5" cy="17" rx="9" ry="12" fill="#e0567a"/><path d="M16 6v22" stroke="#8b2040" stroke-width="2.2"/><path d="M16 10c-2 6-2.5 11-1 16M16 10c2 6 2.5 11 1 16" stroke="#c44569" stroke-width="1.4"/><ellipse cx="16" cy="24" rx="2.5" ry="3.5" fill="#8b2040" opacity=".55"/></svg>`,

  tits: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="16" r="8" fill="#e0567a"/><circle cx="22" cy="16" r="8" fill="#e0567a"/><circle cx="10" cy="15" r="2.5" fill="#c44569"/><circle cx="22" cy="15" r="2.5" fill="#c44569"/><circle cx="10" cy="14.5" r="1" fill="#ffb3c7" opacity=".8"/><circle cx="22" cy="14.5" r="1" fill="#ffb3c7" opacity=".8"/><path d="M16 10v4" stroke="#c44569" stroke-width="1.2" opacity=".5"/></svg>`,

  rose: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="16" r="8" fill="#e0567a"/><circle cx="22" cy="16" r="8" fill="#e0567a"/><circle cx="10" cy="15" r="2.5" fill="#c44569"/><circle cx="22" cy="15" r="2.5" fill="#c44569"/><circle cx="10" cy="14.5" r="1" fill="#ffb3c7" opacity=".8"/><circle cx="22" cy="14.5" r="1" fill="#ffb3c7" opacity=".8"/></svg>`,

  cum: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 2c0 0-6 8-6 14a6 6 0 0012 0c0-6-6-14-6-14z" fill="#f5f0e8" opacity=".95"/><path d="M10 20c0 4 2.5 7 6 7s6-3 6-7" fill="#f5f0e8" opacity=".85"/><ellipse cx="16" cy="28" rx="5" ry="2.5" fill="#f5f0e8" opacity=".5"/><path d="M8 8c0 3-1.5 5-3 6M24 8c0 3 1.5 5 3 6" stroke="#f5f0e8" stroke-width="2" stroke-linecap="round" opacity=".7"/></svg>`,

  drip: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 2c0 0-6 8-6 14a6 6 0 0012 0c0-6-6-14-6-14z" fill="#f5f0e8" opacity=".95"/><path d="M10 20c0 4 2.5 7 6 7s6-3 6-7" fill="#f5f0e8" opacity=".85"/><ellipse cx="16" cy="28" rx="5" ry="2.5" fill="#f5f0e8" opacity=".5"/></svg>`,

  plug: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4c-4 0-7 3-7 7v4c0 3 2 5 4 6l-2 11h10l-2-11c2-1 4-3 4-6v-4c0-4-3-7-7-7z" fill="#e0567a"/><ellipse cx="16" cy="11" rx="7" ry="4" fill="#c44569"/><rect x="11" y="28" width="10" height="3" rx="1" fill="#d4a574"/><circle cx="16" cy="29.5" r="2" fill="#f0c896"/></svg>`,

  fuck: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="22" cy="12" rx="6" ry="7" fill="#e0567a" opacity=".9"/><path d="M16 12h8" stroke="#e0567a" stroke-width="4" stroke-linecap="round"/><ellipse cx="8" cy="18" rx="5" ry="8" fill="#c44569" opacity=".85"/><path d="M13 18c3 0 5 2 5 5v7" stroke="#c44569" stroke-width="3" stroke-linecap="round"/><path d="M20 14l4 2" stroke="#ffb3c7" stroke-width="1.5" opacity=".6"/></svg>`,

  chain: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="9" cy="16" rx="5" ry="7" stroke="#d4a574" stroke-width="2.8" fill="none"/><ellipse cx="23" cy="16" rx="5" ry="7" stroke="#d4a574" stroke-width="2.8" fill="none"/><path d="M14 16h4" stroke="#d4a574" stroke-width="2.5"/><circle cx="9" cy="16" r="1.5" fill="#c44569"/><circle cx="23" cy="16" r="1.5" fill="#c44569"/></svg>`,

  gag: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="7" fill="#e0567a"/><path d="M4 16h5M23 16h5" stroke="#d4a574" stroke-width="2" stroke-linecap="round"/><path d="M6 12l3 2M26 12l-3 2M6 20l3-2M26 20l-3-2" stroke="#d4a574" stroke-width="1.5" stroke-linecap="round"/><circle cx="16" cy="16" r="4" fill="#c44569"/><path d="M14 14h4v4h-4z" fill="#8b2040" opacity=".4"/></svg>`,

  whip: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 29c10-3 17-10 21-19 2-5 3-9 3-14" stroke="#d4a574" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M27 3c2.5 0 4 1.5 4 4s-1.5 4-4 4" stroke="#c44569" stroke-width="2.5" fill="none"/><path d="M8 26l2-3" stroke="#e0567a" stroke-width="1.5" stroke-linecap="round"/></svg>`,

  horns: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 27c0-11 2-19 7-24M25 27c0-11-2-19-7-24" stroke="#c44569" stroke-width="2.8" stroke-linecap="round"/><path d="M7 9c2-5 4-7 7-9M25 9c-2-5-4-7-7-9" stroke="#e0567a" stroke-width="1.8" stroke-linecap="round" opacity=".75"/></svg>`,

  flame: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 2c0 9-7 11-7 17a7 7 0 0014 0c0-6-7-8-7-17z" fill="#e0567a"/><path d="M16 11c0 5-3 6-3 10a3 3 0 006 0c0-4-3-5-3-10z" fill="#ffb3c7"/><circle cx="16" cy="20" r="2" fill="#fff" opacity=".45"/></svg>`,

  heart: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 14c0-4 3-7 7-4 4-3 7 0 7 4 0 6-7 12-7 12S8 20 8 14z" fill="#c44569"/><circle cx="11" cy="12" r="3" fill="#8b2040" opacity=".35"/><circle cx="21" cy="12" r="3" fill="#8b2040" opacity=".35"/></svg>`,

  skull: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="14" rx="10" ry="11" fill="#9a8a94"/><circle cx="11" cy="13" r="2.8" fill="#0a070d"/><circle cx="21" cy="13" r="2.8" fill="#0a070d"/><path d="M11 20c1.5 2 3.5 3 5 3s3.5-1 5-3" stroke="#0a070d" stroke-width="1.5"/><path d="M13 24v5M16 24v5M19 24v5" stroke="#9a8a94" stroke-width="2"/></svg>`,

  mars: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="19" r="7" stroke="#e0567a" stroke-width="2" fill="none"/><path d="M18 14l8-8M23 4h5v5" stroke="#e0567a" stroke-width="2.2" stroke-linecap="round"/><path d="M13 22v-4" stroke="#c44569" stroke-width="2" stroke-linecap="round" opacity=".6"/></svg>`,

  mask: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 14c0-4 4-9 13-9s13 5 13 9v5c0 6-5 11-13 11S3 25 3 19v-5z" fill="#1a1020" stroke="#c44569" stroke-width="1.5"/><ellipse cx="10" cy="15" rx="3" ry="4" fill="#0a070d" opacity=".6"/><ellipse cx="22" cy="15" rx="3" ry="4" fill="#0a070d" opacity=".6"/><path d="M13 22c1 1 2 1.5 3 1.5s2-.5 3-1.5" stroke="#e0567a" stroke-width="1.3"/></svg>`,

  silhouette: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="22" cy="12" rx="6" ry="7" fill="#e0567a" opacity=".9"/><path d="M16 12h8" stroke="#e0567a" stroke-width="4" stroke-linecap="round"/><ellipse cx="8" cy="18" rx="5" ry="8" fill="#c44569" opacity=".85"/><path d="M13 18c3 0 5 2 5 5v7" stroke="#c44569" stroke-width="3" stroke-linecap="round"/></svg>`,

  sparkle: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 2v5M16 25v5M2 16h5M25 16h5" stroke="#f0c896" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="16" r="4" fill="#ffb3c7" opacity=".8"/><circle cx="16" cy="16" r="2" fill="#f0c896"/></svg>`,

  crown: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 24h24v4H4z" fill="#d4a574"/><path d="M6 24l3-14 7 8 4-10 4 10 7-8 3 14" fill="#f0c896" stroke="#c44569" stroke-width="1"/><circle cx="9" cy="10" r="2" fill="#e0567a"/><circle cx="16" cy="6" r="2" fill="#e0567a"/><circle cx="23" cy="10" r="2" fill="#e0567a"/></svg>`,

  curves: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 26V14c0-4 3-8 8-8" stroke="#e0567a" stroke-width="2.2" stroke-linecap="round"/><path d="M12 26V10c0-4 3-6 8-6" stroke="#c44569" stroke-width="2.2" stroke-linecap="round"/><path d="M18 26V16c0-3 2-5 6-5" stroke="#ffb3c7" stroke-width="2.2" stroke-linecap="round"/><path d="M6 26h20" stroke="#d4a574" stroke-width="1.5" stroke-linecap="round" opacity=".6"/></svg>`,

  oral: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 14c0-4 4-8 12-8s12 4 12 8c0 5-5 10-10 10" fill="#c44569"/><path d="M16 16v12" stroke="#e0567a" stroke-width="4" stroke-linecap="round"/><path d="M16 4c4 0 7 3 7 7s-3 7-7 7" fill="#e0567a"/><ellipse cx="11" cy="27" rx="4" ry="3.5" fill="#c44569"/><ellipse cx="21" cy="27" rx="4" ry="3.5" fill="#c44569"/></svg>`,
};

const MOOD_ICON_SETS = {
  suave: ["lips", "tits", "pussy", "tongue", "heart"],
  picante: ["cock", "pussy", "ass", "cum", "tongue", "oral", "fuck"],
  extremo: ["cock", "pussy", "ass", "chain", "whip", "plug", "cum", "gag", "fuck"],
};

const INTENSITY_ICON_MAP = {
  suave: "tits",
  picante: "cock",
  extremo: "plug",
  progresivo: "curves",
};

function iconHtml(name, className = "sex-icon") {
  const svg = SEX_ICONS[name];
  if (!svg) return "";
  return `<span class="${className}" data-icon="${name}" aria-hidden="true">${svg}</span>`;
}

function iconsHtml(names, className = "sex-icon") {
  return names.map((n) => iconHtml(n, className)).join("");
}

function getIntensityIconHtml(intensity) {
  const key = INTENSITY_ICON_MAP[intensity] || "cock";
  return iconHtml(key, "sex-icon sex-icon-sm");
}

function mountIcon(el, name) {
  if (!el) return;
  el.innerHTML = iconHtml(name, el.className.includes("sex-icon") ? el.className.split(" ")[0] : "sex-icon");
}

function mountIcons(container, names) {
  if (!container) return;
  container.innerHTML = iconsHtml(names, "sex-icon sex-icon-strip");
}

function initStaticIcons() {
  const logo = document.querySelector(".logo-pulse");
  if (logo) {
    logo.innerHTML = SEX_ICONS.pussy;
    logo.classList.add("sex-icon", "sex-icon-logo");
  }

  const header = document.querySelector(".header-icons");
  if (header) {
    header.innerHTML = iconsHtml(["cock", "pussy", "ass"], "sex-icon sex-icon-header");
  }

  document.querySelectorAll(".intensity-btn").forEach((btn) => {
    const level = btn.dataset.level;
    const iconEl = btn.querySelector(".intensity-icon");
    if (iconEl && level) {
      iconEl.innerHTML = SEX_ICONS[INTENSITY_ICON_MAP[level] || "cock"];
      iconEl.classList.add("sex-icon", "sex-icon-intensity");
    }
  });

  const cornerTL = document.querySelector(".challenge-corner.tl");
  const cornerBR = document.querySelector(".challenge-corner.br");
  if (cornerTL) cornerTL.innerHTML = SEX_ICONS.pussy;
  if (cornerBR) cornerBR.innerHTML = SEX_ICONS.cock;

  const trophy = document.querySelector(".trophy");
  if (trophy) {
    trophy.innerHTML = SEX_ICONS.crown;
    trophy.classList.add("sex-icon", "sex-icon-trophy");
  }
}

document.addEventListener("DOMContentLoaded", initStaticIcons);
