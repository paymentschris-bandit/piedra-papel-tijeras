/** Traducción de retos en partida — carga i18n-challenges/{lang}.json bajo demanda */
const CHALLENGE_I18N = { es: null };
let challengeI18nLoading = null;

function normalizeChallengeTemplate(text) {
  return text
    .replace(/\{ganador\}/gi, "{G}")
    .replace(/\{perdedor\}/gi, "{P}")
    .trim();
}

function challengeKey(text) {
  const n = normalizeChallengeTemplate(text);
  let h = 5381;
  for (let i = 0; i < n.length; i++) {
    h = (Math.imul(33, h) + n.charCodeAt(i)) >>> 0;
  }
  return h.toString(16);
}

function ensureChallengeLocale(lang) {
  if (lang === "es") return Promise.resolve({});
  if (CHALLENGE_I18N[lang]) return Promise.resolve(CHALLENGE_I18N[lang]);
  if (challengeI18nLoading && challengeI18nLoading.lang === lang) {
    return challengeI18nLoading.promise;
  }
  const promise = fetch(`i18n-challenges/${lang}.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`challenge i18n ${lang}: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      CHALLENGE_I18N[lang] = data;
      return data;
    })
    .catch((err) => {
      console.warn("[i18n-challenges]", err.message);
      CHALLENGE_I18N[lang] = {};
      return {};
    });
  challengeI18nLoading = { lang, promise };
  return promise;
}

function localizeChallengeTemplate(text) {
  if (!text || typeof text !== "string") return text;
  if (typeof I18N === "undefined" || I18N.lang === "es") return text;
  const map = CHALLENGE_I18N[I18N.lang];
  if (!map) return text;
  return map[challengeKey(text)] || text;
}

function preloadChallengeLocale(lang) {
  if (!lang || lang === "es") return Promise.resolve();
  return ensureChallengeLocale(lang);
}

function refreshVisibleChallengeText() {
  if (typeof state === "undefined" || !state.lastResult?.winner) return;
  if (state.challengeSourceTemplate && state.lastResult) {
    const loserNum = state.lastResult.winner === 1 ? 2 : 1;
    const winnerNum = state.lastResult.winner;
    const loserName = getPlayerName(loserNum);
    const winnerName = getPlayerName(winnerNum);
    const text = applyNames(
      localizeChallengeTemplate(state.challengeSourceTemplate),
      loserName,
      winnerName
    );
    const el = document.getElementById("challenge-text");
    if (el) el.textContent = text;
    if (state.challengeTeaseSource?.length) {
      const mood = getEffectiveIntensity(state.intensity, state.currentRound, state.maxRounds);
      const tease = state.challengeTeaseSource.map((tpl) =>
        applyNames(localizeChallengeTemplate(tpl), loserName, winnerName)
      );
      state.challengeTease = tease;
      showChallengeTease(tease, mood);
    }
  }
  const finalEl = document.getElementById("final-challenge-text");
  if (finalEl && state.finalChallengeSource && state.endWinnerNum) {
    const winnerNum = state.endWinnerNum;
    const loserNum = winnerNum === 1 ? 2 : 1;
    finalEl.textContent = applyNames(
      localizeChallengeTemplate(state.finalChallengeSource),
      getPlayerName(loserNum),
      getPlayerName(winnerNum)
    );
  }
}

function onLanguageChanged() {
  preloadChallengeLocale(I18N.lang).then(() => {
    refreshVisibleChallengeText();
    applyDom();
  });
}
