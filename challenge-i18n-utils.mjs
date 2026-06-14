import fs from "fs";
import vm from "vm";
import path from "path";

export const CHALLENGE_SUFFIXES = [
  { key: "slow", re: / Hazlo más despacio\.?\s*$/i },
  { key: "silent", re: / Esta vez sin hablar\.?\s*$/i },
  { key: "eyes", re: / Repite con los ojos cerrados\.?\s*$/i },
  { key: "rhythm", re: / \{ganador\} elige el ritmo\.?\s*$/i },
  { key: "place", re: / Cambiad de sitio antes de empezar\.?\s*$/i },
  { key: "calm", re: / Sin prisa — disfrutad cada segundo\.?\s*$/i },
  { key: "double", re: / Repetid el reto el doble de tiempo si os apetece\.?\s*$/i },
  { key: "eyes2", re: / Mirad a los ojos todo el rato\.?\s*$/i },
  { key: "whisper", re: / Susurrad lo que sentís mientras lo hacéis\.?\s*$/i },
  { key: "restart", re: / Parad a mitad y volved a empezar\.?\s*$/i },
  { key: "standing", re: / Hacedlo de pie en lugar de sentados\.?\s*$/i },
];

export const CHALLENGE_LANGS = ["en", "fr", "de", "pt", "it", "nl", "pl", "ru", "uk"];

export function normalizeChallengeTemplate(text) {
  return text
    .replace(/\{ganador\}/gi, "{G}")
    .replace(/\{perdedor\}/gi, "{P}")
    .trim();
}

export function challengeKey(text) {
  const n = normalizeChallengeTemplate(text);
  let h = 5381;
  for (let i = 0; i < n.length; i++) {
    h = (Math.imul(33, h) + n.charCodeAt(i)) >>> 0;
  }
  return h.toString(16);
}

export function splitChallengeSuffix(text) {
  for (const { key, re } of CHALLENGE_SUFFIXES) {
    if (re.test(text)) {
      return { base: text.replace(re, "").trim(), suffixKey: key };
    }
  }
  return { base: text.trim(), suffixKey: null };
}

export function protectPlaceholders(text) {
  return text
    .replace(/\{ganador\}/gi, "⟦WIN⟧")
    .replace(/\{perdedor\}/gi, "⟦LOSE⟧");
}

export function restorePlaceholders(text) {
  return text
    .replace(/⟦WIN⟧/gi, "{ganador}")
    .replace(/⟦LOSE⟧/gi, "{perdedor}")
    .replace(/\{winner\}/gi, "{ganador}")
    .replace(/\{loser\}/gi, "{perdedor}");
}

export function loadAllChallengeSources(root = import.meta.dirname) {
  const ctx = {};
  const base = fs
    .readFileSync(path.join(root, "challenges.js"), "utf8")
    .replace(/^const /gm, "var ");
  vm.runInNewContext(base.split("\nfunction determineWinner")[0], ctx);
  let extra = fs.readFileSync(path.join(root, "challenges-expansion.js"), "utf8");
  extra += fs.readFileSync(path.join(root, "outdoor-locations.js"), "utf8").replace(/^const /gm, "var ");
  extra += fs.readFileSync(path.join(root, "outdoor-expansion.js"), "utf8");
  extra += fs.readFileSync(path.join(root, "swinger-club-challenges.js"), "utf8");
  vm.runInNewContext(extra, ctx);
  return ctx;
}

export function walkChallengeStrings(obj, out = new Set()) {
  if (!obj) return out;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === "string") out.add(item);
    }
    return out;
  }
  if (typeof obj === "string") {
    out.add(obj);
    return out;
  }
  if (typeof obj === "object") {
    for (const key of Object.keys(obj)) walkChallengeStrings(obj[key], out);
  }
  return out;
}

export function collectAllSpanishStrings(ctx) {
  const all = new Set();
  walkChallengeStrings(ctx.CHALLENGES, all);
  walkChallengeStrings(ctx.REMOTE_CHALLENGES, all);
  walkChallengeStrings(ctx.OUTDOOR_CHALLENGES, all);
  walkChallengeStrings(ctx.OUTDOOR_LOCATION_CHALLENGES, all);
  walkChallengeStrings(ctx.TEASE_MESSAGES, all);
  for (const key of ["FINAL_REWARDS", "REMOTE_FINAL_REWARDS", "OUTDOOR_FINAL_REWARDS"]) {
    walkChallengeStrings(ctx[key], all);
  }
  return [...all];
}

export function collectBaseStrings(allStrings) {
  const bases = new Map();
  for (const text of allStrings) {
    const { base } = splitChallengeSuffix(text);
    if (!bases.has(challengeKey(base))) bases.set(challengeKey(base), base);
  }
  return bases;
}

export async function translateGoogle(text, targetLang, retries = 3) {
  const q = protectPlaceholders(text);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(q)}`;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.text();
      const data = JSON.parse(raw);
      const translated = data[0].map((part) => part[0]).join("");
      return restorePlaceholders(translated);
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(800 * (i + 1));
    }
  }
}

export async function translateBatchGoogle(texts, targetLang) {
  if (texts.length === 0) return [];
  if (texts.length === 1) return [await translateGoogle(texts[0], targetLang)];
  const SEP = "\n⟦SEP⟧\n";
  const joined = texts.map(protectPlaceholders).join(SEP);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(joined)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = JSON.parse(await res.text());
  const translated = data[0].map((part) => part[0]).join("");
  const parts = restorePlaceholders(translated).split(/\n⟦SEP⟧\n|\n?\s*⟦SEP⟧\s*\n?/);
  if (parts.length === texts.length) return parts;
  const out = [];
  for (const text of texts) {
    out.push(await translateGoogle(text, targetLang));
    await sleep(120);
  }
  return out;
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
