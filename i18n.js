const I18N = { lang: "es" };

const I18N_LANGS = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "it", label: "Italiano" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "ru", label: "Русский" },
  { code: "uk", label: "Українська" },
];

function t(key, params = {}) {
  const loc = I18N_LOCALES[I18N.lang] || I18N_LOCALES.es;
  let str =
    loc[key] ??
    (I18N.lang !== "en" && I18N.lang !== "es" ? I18N_LOCALES.en[key] : undefined) ??
    I18N_LOCALES.es[key] ??
    key;
  return str.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? params[k] : `{${k}}`));
}

function applyDom() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const val = t(el.dataset.i18n);
    if (el.dataset.i18nHtml === "true") el.innerHTML = val;
    else el.textContent = val;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });

  document.querySelectorAll("[data-i18n-prefix]").forEach((el) => {
    const prefix = el.dataset.i18nPrefix;
    const nameEl = el.querySelector(".mode-name, .intensity-name");
    const descEl = el.querySelector(".mode-desc, .intensity-desc");
    if (nameEl) nameEl.textContent = t(`${prefix}.name`);
    if (descEl) descEl.textContent = t(`${prefix}.desc`);
  });

  document.querySelectorAll(".choice-btn[data-choice]").forEach((btn) => {
    const choice = btn.dataset.choice;
    const nameEl = btn.querySelector(".choice-name");
    if (nameEl) nameEl.textContent = t(`choice.${choice}`);
    btn.setAttribute("aria-label", t(`choice.${choice}`));
  });

  document.querySelectorAll(".roulette-segment[data-choice]").forEach((seg) => {
    const choice = seg.dataset.choice;
    const small = seg.querySelector("small");
    if (small) small.textContent = t(`choice.${choice}`);
  });

  const title = document.querySelector("title");
  if (title) title.textContent = t("meta.title");
}

function syncLangSelects() {
  document.querySelectorAll(".lang-select").forEach((sel) => {
    sel.value = I18N.lang;
  });
}

function setLanguage(lang) {
  if (!I18N_LOCALES[lang]) lang = "es";
  I18N.lang = lang;
  localStorage.setItem("ppt-lang", lang);
  document.documentElement.lang = lang;
  syncLangSelects();
  applyDom();
  if (typeof onLanguageChanged === "function") onLanguageChanged();
}

function initI18n() {
  const saved = localStorage.getItem("ppt-lang");
  const browser = (navigator.language || "es").slice(0, 2);
  const supported = I18N_LANGS.map((l) => l.code);
  const lang = saved || (supported.includes(browser) ? browser : "es");
  setLanguage(lang);

  document.querySelectorAll(".lang-select").forEach((sel) => {
    sel.addEventListener("change", (e) => setLanguage(e.target.value));
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initI18n);
} else {
  initI18n();
}
