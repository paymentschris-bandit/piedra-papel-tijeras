/**
 * Genera traducciones de retos (es → 9 idiomas).
 * node generate-challenge-i18n.mjs [--lang en] [--resume]
 */
import fs from "fs";
import path from "path";
import {
  CHALLENGE_LANGS,
  CHALLENGE_SUFFIXES,
  challengeKey,
  collectAllSpanishStrings,
  collectBaseStrings,
  loadAllChallengeSources,
  splitChallengeSuffix,
  translateBatchGoogle,
  translateGoogle,
  sleep,
} from "./challenge-i18n-utils.mjs";

const ROOT = import.meta.dirname;
const OUT_DIR = path.join(ROOT, "i18n-challenges");
const BATCH = 20;
const DELAY_MS = 250;

const onlyLang = process.argv.includes("--lang")
  ? process.argv[process.argv.indexOf("--lang") + 1]
  : null;
const resume = process.argv.includes("--resume");

const SUFFIX_ES = {
  slow: " Hazlo más despacio.",
  silent: " Esta vez sin hablar.",
  eyes: " Repite con los ojos cerrados.",
  rhythm: " {ganador} elige el ritmo.",
  place: " Cambiad de sitio antes de empezar.",
  calm: " Sin prisa — disfrutad cada segundo.",
  double: " Repetid el reto el doble de tiempo si os apetece.",
  eyes2: " Mirad a los ojos todo el rato.",
  whisper: " Susurrad lo que sentís mientras lo hacéis.",
  restart: " Parad a mitad y volved a empezar.",
  standing: " Hacedlo de pie en lugar de sentados.",
};

function buildFullMap(allStrings, baseTranslations, suffixTranslations) {
  const map = {};
  for (const text of allStrings) {
    const key = challengeKey(text);
    const { base, suffixKey } = splitChallengeSuffix(text);
    const baseKey = challengeKey(base);
    const translatedBase = baseTranslations[baseKey] || base;
    const suffix = suffixKey ? suffixTranslations[suffixKey] || SUFFIX_ES[suffixKey] || "" : "";
    map[key] = translatedBase + suffix;
  }
  return map;
}

async function translateSuffixes(targetLang) {
  const out = {};
  for (const { key } of CHALLENGE_SUFFIXES) {
    const es = SUFFIX_ES[key];
    if (!es) continue;
    out[key] = await translateGoogle(es.trim(), targetLang);
    if (!out[key].startsWith(" ")) out[key] = " " + out[key];
    await sleep(DELAY_MS);
  }
  return out;
}

async function translateBases(bases, targetLang, partial = {}) {
  const entries = [...bases.entries()].filter(([k]) => !partial[k]);
  console.log(`  Bases pendientes: ${entries.length}/${bases.size}`);
  for (let i = 0; i < entries.length; i += BATCH) {
    const chunk = entries.slice(i, i + BATCH);
    const texts = chunk.map(([, v]) => v);
    const translated = await translateBatchGoogle(texts, targetLang);
    for (let j = 0; j < chunk.length; j++) {
      partial[chunk[j][0]] = translated[j];
    }
    if ((i / BATCH) % 5 === 0 || i + BATCH >= entries.length) {
      fs.writeFileSync(
        path.join(OUT_DIR, `.partial-${targetLang}.json`),
        JSON.stringify(partial),
        "utf8"
      );
      console.log(`  ${targetLang}: ${Math.min(i + BATCH, entries.length)}/${entries.length}`);
    }
    await sleep(DELAY_MS);
  }
  return partial;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const ctx = loadAllChallengeSources();
  const allStrings = collectAllSpanishStrings(ctx);
  const bases = collectBaseStrings(allStrings);
  console.log(`Retos únicos: ${allStrings.length} | Bases: ${bases.size}`);

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(
      {
        version: 1,
        total: allStrings.length,
        bases: bases.size,
        langs: CHALLENGE_LANGS,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf8"
  );

  const langs = onlyLang ? [onlyLang] : CHALLENGE_LANGS;

  for (const lang of langs) {
    const outFile = path.join(OUT_DIR, `${lang}.json`);
    const partialFile = path.join(OUT_DIR, `.partial-${lang}.json`);

    if (!resume && fs.existsSync(outFile) && onlyLang) {
      console.log(`Skip ${lang} (exists)`);
      continue;
    }

    console.log(`\n=== ${lang.toUpperCase()} ===`);
    let baseTranslations = {};
    if (resume && fs.existsSync(partialFile)) {
      baseTranslations = JSON.parse(fs.readFileSync(partialFile, "utf8"));
    }

    const suffixTranslations = await translateSuffixes(lang);
    baseTranslations = await translateBases(bases, lang, baseTranslations);
    const map = buildFullMap(allStrings, baseTranslations, suffixTranslations);

    fs.writeFileSync(outFile, JSON.stringify(map), "utf8");
    if (fs.existsSync(partialFile)) fs.unlinkSync(partialFile);
    console.log(`  ✓ ${outFile} (${Object.keys(map).length} entradas)`);
  }

  console.log("\nHecho.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
