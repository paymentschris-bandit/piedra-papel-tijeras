/**
 * Audita y corrige retos según orientación / tipo de pareja.
 * node audit-orientation-challenges.mjs [--apply] [--report-only]
 */
import fs from "fs";
import vm from "vm";
import path from "path";
import { isSwingerGroupChallenge, fixChicaGender } from "./swinger-challenge-utils.mjs";

const ROOT = import.meta.dirname;
const APPLY = process.argv.includes("--apply");

const SOURCE_FILES = [
  {
    file: "challenges.js",
    vars: ["CHALLENGES", "REMOTE_CHALLENGES", "OUTDOOR_CHALLENGES"],
    skipMerge: true,
  },
  {
    file: "challenges-expansion.js",
    vars: ["CHALLENGES_HOME_EXTRA", "CHALLENGES_REMOTE_EXTRA"],
    skipMerge: true,
  },
  {
    file: "outdoor-locations.js",
    vars: ["OUTDOOR_LOCATION_CHALLENGES"],
    skipMerge: true,
  },
  {
    file: "outdoor-expansion.js",
    vars: ["OUTDOOR_GENERAL_EXTRA", "OUTDOOR_LOCATION_EXTRA", "OUTDOOR_NEW_LOCATIONS"],
    skipMerge: true,
  },
  {
    file: "swinger-club-challenges.js",
    vars: ["SWINGER_CLUB_CHALLENGES"],
    skipMerge: true,
  },
  {
    file: "challenges-mega-v3.js",
    vars: ["CHALLENGES_MEGA_V3", "REMOTE_MEGA_V3", "OUTDOOR_MEGA_V3"],
    skipMerge: true,
  },
];

const INTENSITIES = ["suave", "picante", "extremo"];
const BUCKETS = ["hetero.chica", "hetero.chico", "chico_chico", "chica_chica"];

const REPORT = {
  totalReviewed: 0,
  corrected: 0,
  moved: 0,
  removedDuplicates: 0,
  removedInvalid: 0,
  ambiguousFixed: 0,
  moves: [],
  duplicates: [],
  removed: [],
  ambiguous: [],
  errors: [],
  verificationFailures: [],
};

function norm(text) {
  return text
    .toLowerCase()
    .replace(/\s+hazlo más despacio\.*/gi, "")
    .replace(/\s+esta vez sin hablar\.*/gi, "")
    .replace(/\s+sin prisa.*/gi, "")
    .replace(/\{ganador\}/g, "G")
    .replace(/\{perdedor\}/g, "P")
    .replace(/\s+/g, " ")
    .trim();
}

function loadFileVars(relPath, varNames) {
  let code = fs.readFileSync(path.join(ROOT, relPath), "utf8").replace(/^const /gm, "var ");
  const footerStart = code.search(/\nfunction [a-zA-Z_$]/);
  const footer = footerStart >= 0 ? code.slice(footerStart) : "";
  const ctx = {};
  vm.runInNewContext(code, ctx);
  const data = {};
  for (const v of varNames) {
    if (ctx[v] !== undefined) data[v] = structuredClone(ctx[v]);
  }
  return { data, footer, raw: code };
}

function pathToBucket(parts) {
  const s = parts.join(".");
  if (s.includes("chico_chico")) return "chico_chico";
  if (s.includes("chica_chica")) return "chica_chica";
  if (s.includes("hetero.chico")) return "hetero.chico";
  if (s.includes("hetero.chica")) return "hetero.chica";
  return null;
}

function bucketToPathParts(bucket, isSwinger, sub = null) {
  const [a, b] = bucket.split(".");
  if (isSwinger) {
    if (a === "hetero") return [a, b, sub || "pareja"];
    return [bucket, sub || "pareja"];
  }
  if (a === "hetero") return [a, b];
  return [bucket];
}

function analyzeText(text) {
  const t = text;
  const l = t.toLowerCase();

  const maleAnat =
    /\b(polla|pollas|pene|erecci[oó]n|bragueta|huevos|calzoncillos|semen)\b/i.test(t);
  const femaleAnat =
    /\b(co[nñ]o|co[nñ]os|cl[ií]toris|braga|bragas|sujetador|labios vagin|punto g)\b/i.test(t);

  const gayExclusive =
    /\b(polla con polla|polla contra polla|polla con la suya|vuestras pollas|frota pollas|sacad las pollas|sacad.*pollas|masturbad mutuamente|contra la suya|pollas —|pollas,|paja mutua|masturbaci[oó]n mutua.*polla del otro|cada uno en la polla del otro|chup[aá] su polla.*(?:mientras|y la tuya)|69.*polla|polla — polla|follad —|follad o|uno folla al otro)\b/i.test(
      t
    ) || /\b(chico_chico|fantas[ií]as gay)\b/i.test(t);

  const lesbianExclusive =
    /\b(tribbing|co[nñ]o.*co[nñ]o|vuestros co[nñ]os|co[nñ]os —|l[eé]sbic|cl[ií]toris.*cl[ií]toris|dedos en el co[nñ]o de la otra|chica_chica|fantas[ií]as l[eé]sbicas|69.*co[nñ]o)\b/i.test(
      t
    );

  const femaleLoserPOV =
    /\b(tu co[nñ]o|tu braga|tu sujetador|qu[ií]tate.*bragas|qu[ií]tate el sujetador|mojada|empapada|tus pezones|si[eé]ntate.*frota tu co[nñ]o)\b/i.test(
      t
    ) && !/\btu polla\b/i.test(t);

  const maleLoserPOV =
    /\b(tu polla|tu erecci[oó]n|tus huevos|qu[ií]tate pantal|qu[ií]tate el pantal|ponte de pie con la polla|mast[uú]rbate.*polla)\b/i.test(
      t
    );

  const maleActsFemaleWinner =
    /\b(folla a \{ganador\}|c[oó]mele el co[nñ]o|co[nñ]o de \{ganador\}|su braga|su co[nñ]o|su cl[ií]toris|chupa.*cl[ií]toris|mete.*dedos en.*\{ganador\}|le chupas un pez[oó]n|ella te azota)\b/i.test(
      t
    );

  const femaleActsMaleWinner =
    /\b(chupa la polla|ch[uú]pale.*polla|saca su polla|su erecci[oó]n|su bragueta|frota.*(?:su )?polla|mete su polla|entre tus labios.*polla|la polla de \{ganador\})\b/i.test(
      t
    );

  const twoMenFocus =
    gayExclusive ||
    (maleAnat &&
      !femaleAnat &&
      /\b(culo|nalgas|follad|chup[aá] su polla|ch[uú]pala|masturbaci[oó]n mutua|frota pollas|contra la suya|sacad las pollas)\b/i.test(t) &&
      !femaleActsMaleWinner &&
      !/\b(ella|falda|braga|co[nñ]o|chica)\b/i.test(t));

  const twoWomenFocus =
    lesbianExclusive ||
    (femaleAnat &&
      !maleAnat &&
      /\b(tribbing|co[nñ]o.*co[nñ]o|dedos.*co[nñ]o|labios.*labios|69)\b/i.test(t) &&
      !maleActsFemaleWinner &&
      !/\b(polla|erecci[oó]n|bragueta|huevos)\b/i.test(t));

  return {
    maleAnat,
    femaleAnat,
    gayExclusive,
    lesbianExclusive,
    femaleLoserPOV,
    maleLoserPOV,
    maleActsFemaleWinner,
    femaleActsMaleWinner,
    twoMenFocus,
    twoWomenFocus,
  };
}

function classifyChallenge(text, currentBucket, isGrupo) {
  const a = analyzeText(text);

  if (a.twoMenFocus && !a.femaleAnat) return "chico_chico";
  if (a.twoWomenFocus && !a.maleAnat) return "chica_chica";
  if (a.gayExclusive && !a.femaleAnat) return "chico_chico";
  if (a.lesbianExclusive && !a.maleAnat) return "chica_chica";

  if (isGrupo) {
    if (a.femaleLoserPOV || a.femaleActsMaleWinner) return "hetero.chica";
    if (a.maleLoserPOV || a.maleActsFemaleWinner) return "hetero.chico";
    return currentBucket;
  }

  if (a.maleAnat && a.femaleAnat) {
    if (a.femaleLoserPOV || a.femaleActsMaleWinner) return "hetero.chica";
    if (a.maleLoserPOV || a.maleActsFemaleWinner) return "hetero.chico";
    return currentBucket || "hetero.chica";
  }

  if (a.femaleAnat && !a.maleAnat) {
    if (a.maleActsFemaleWinner || a.maleLoserPOV) return "hetero.chico";
    if (a.femaleLoserPOV || a.femaleActsMaleWinner) return "hetero.chica";
    if (a.lesbianExclusive) return "chica_chica";
    return "hetero.chica";
  }

  if (a.maleAnat && !a.femaleAnat) {
    if (a.femaleActsMaleWinner || a.femaleLoserPOV) return "hetero.chica";
    if (a.maleLoserPOV || a.maleActsFemaleWinner) return "hetero.chico";
    if (a.gayExclusive) return "chico_chico";
    return "hetero.chico";
  }

  return currentBucket;
}

function isCompatible(text, bucket, isGrupo) {
  const target = classifyChallenge(text, bucket, isGrupo);
  if (target === bucket) return true;
  if (isGrupo && (target === "hetero.chica" || target === "hetero.chico")) {
    return bucket === target;
  }
  return false;
}

function incompatibleReason(text, bucket) {
  const a = analyzeText(text);
  if (bucket === "chica_chica" && a.maleAnat && !a.femaleAnat && !isSwingerGroupChallenge(text)) {
    return "anatomía masculina en chica_chica";
  }
  if (bucket === "chico_chico" && a.femaleAnat && !a.maleAnat && !isSwingerGroupChallenge(text)) {
    return "anatomía femenina en chico_chico";
  }
  if (bucket.startsWith("hetero") && a.gayExclusive && !a.femaleAnat) {
    return "contenido gay exclusivo en hetero";
  }
  if (bucket.startsWith("hetero") && a.lesbianExclusive && !a.maleAnat) {
    return "contenido lésbico exclusivo en hetero";
  }
  if (bucket === "hetero.chica" && a.maleLoserPOV && !a.femaleLoserPOV && !a.femaleActsMaleWinner) {
    return "perspectiva masculina en hetero.chica";
  }
  if (bucket === "hetero.chico" && a.femaleLoserPOV && !a.maleLoserPOV && !a.maleActsFemaleWinner) {
    return "perspectiva femenina en hetero.chico";
  }
  return null;
}

function fixAmbiguous(text, bucket) {
  let fixed = text;
  let changed = false;

  if (bucket === "hetero.chico" && /\bch[uú]pale la polla\b/i.test(fixed)) {
    fixed = fixed.replace(/\bch[uú]pale la polla\b/gi, "cómele el coño");
    changed = true;
  }
  if (bucket === "hetero.chica" && /\bfolla a \{ganador\}\b/i.test(fixed) && !/\bco[nñ]o\b/i.test(fixed)) {
    fixed = fixed.replace(/\bfolla a \{ganador\}\b/gi, "monta a {ganador}");
    changed = true;
  }
  if (bucket === "chica_chica" && /\bpolla\b/i.test(fixed) && !/\bchico solo\b/i.test(fixed)) {
    return null;
  }
  if (bucket === "chico_chico" && /\bco[nñ]o\b/i.test(fixed) && !/\bchica sola\b/i.test(fixed)) {
    return null;
  }

  return changed ? fixed : text;
}

function walkArrays(obj, prefix, out) {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    out.push({ path: prefix.replace(/\.$/, ""), arr: obj });
    return;
  }
  for (const key of Object.keys(obj)) {
    walkArrays(obj[key], `${prefix}${key}.`, out);
  }
}

function getArrayRef(root, parts) {
  let cur = root;
  for (const p of parts) {
    if (cur == null) return null;
    cur = cur[p];
  }
  return Array.isArray(cur) ? cur : null;
}

function ensurePath(root, parts) {
  let cur = root;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === parts.length - 1) {
      if (!Array.isArray(cur[p])) cur[p] = [];
      return cur[p];
    }
    if (!cur[p] || typeof cur[p] !== "object") cur[p] = {};
    cur = cur[p];
  }
  return null;
}

function parseChallengePath(parts) {
  if (INTENSITIES.includes(parts[0])) {
    return { prefix: [], intensity: parts[0], rest: parts.slice(1) };
  }
  if (parts.length > 1 && INTENSITIES.includes(parts[1])) {
    return { prefix: [parts[0]], intensity: parts[1], rest: parts.slice(2) };
  }
  return null;
}

function buildDestParts(prefix, intensity, target, isSwinger, isGrupo, isPareja) {
  const destParts = [...prefix, intensity];
  if (target.startsWith("hetero")) {
    destParts.push("hetero", target.split(".")[1]);
  } else {
    destParts.push(target);
  }
  if (isSwinger) {
    if (isGrupo) destParts.push("grupo");
    else if (isPareja) destParts.push("pareja");
  }
  return destParts;
}

function processTree(treeName, tree, file, opts = {}) {
  const { movesOnly = false } = opts;
  const arrays = [];
  walkArrays(tree, `${treeName}.`, arrays);
  let passMoved = 0;

  for (const { path: arrPath, arr } of arrays) {
    const parts = arrPath.replace(`${treeName}.`, "").split(".");
    const parsed = parseChallengePath(parts);
    if (!parsed) continue;

    const { prefix, intensity, rest } = parsed;
    const isSwinger = treeName.includes("SWINGER") || arrPath.includes("swinger");
    const isGrupo = rest.includes("grupo");
    const isPareja = rest.includes("pareja");
    const currentBucket = pathToBucket([...prefix, intensity, ...rest]);
    if (!currentBucket) continue;

    const seen = movesOnly ? null : new Set();
    const toRemove = [];

    for (let i = 0; i < arr.length; i++) {
      let text = arr[i];
      if (typeof text !== "string") continue;
      if (!movesOnly) REPORT.totalReviewed++;

      if (!movesOnly) {
        const n = norm(text);
        if (seen.has(n)) {
          toRemove.push(i);
          REPORT.removedDuplicates++;
          REPORT.duplicates.push({ file, path: arrPath, text: text.slice(0, 80) });
          continue;
        }
        seen.add(n);

        if (rest.includes("chica") && !rest.includes("chico_chico")) {
          const fixed = fixChicaGender(text);
          if (fixed !== text) {
            text = fixed;
            arr[i] = fixed;
            REPORT.corrected++;
          }
        }

        const ambiguous = fixAmbiguous(text, currentBucket);
        if (ambiguous === null) {
          toRemove.push(i);
          REPORT.removedInvalid++;
          REPORT.removed.push({ file, path: arrPath, reason: "incompatible_no_fix", text: text.slice(0, 100) });
          continue;
        }
        if (ambiguous !== text) {
          text = ambiguous;
          arr[i] = ambiguous;
          REPORT.ambiguousFixed++;
          REPORT.ambiguous.push({ file, path: arrPath, after: ambiguous.slice(0, 100) });
        }
      }

      const target = classifyChallenge(text, currentBucket, isGrupo);
      if (target !== currentBucket) {
        const destParts = buildDestParts(prefix, intensity, target, isSwinger, isGrupo, isPareja);
        const destArr = ensurePath(tree, destParts);
        destArr.push(text);
        toRemove.push(i);
        REPORT.moved++;
        passMoved++;
        REPORT.moves.push({
          file,
          from: arrPath,
          to: `${treeName}.${destParts.join(".")}`,
          text: text.slice(0, 100),
        });
      }
    }

    for (let i = toRemove.length - 1; i >= 0; i--) {
      arr.splice(toRemove[i], 1);
    }
  }
  return passMoved;
}

function verifyTree(tree, treeLabel, fileLabel = "") {
  const arrays = [];
  walkArrays(tree, `${treeLabel}.`, arrays);
  for (const { path: arrPath, arr } of arrays) {
    const parts = arrPath.replace(`${treeLabel}.`, "").split(".");
    const parsed = parseChallengePath(parts);
    if (!parsed) continue;
    const { prefix, intensity, rest } = parsed;
    const bucket = pathToBucket([...prefix, intensity, ...rest]);
    if (!bucket) continue;
    const isGrupo = rest.includes("grupo");
    for (const text of arr) {
      if (typeof text !== "string") continue;
      const reason = incompatibleReason(text, bucket);
      const classified = classifyChallenge(text, bucket, isGrupo);
      if (reason || classified !== bucket) {
        REPORT.verificationFailures.push({
          file: fileLabel,
          path: arrPath,
          bucket,
          classified,
          reason: reason || "clasificación distinta",
          text: text.slice(0, 120),
        });
      }
    }
  }
}

function verifyAll(ctx) {
  for (const src of SOURCE_FILES) {
    for (const varName of src.vars) {
      const tree = ctx[varName];
      if (!tree) continue;
      verifyTree(tree, varName, src.file);
    }
  }
}

function mergeChallengeTrees(target, extra) {
  if (!extra || typeof extra !== "object") return;
  for (const key of Object.keys(extra)) {
    const val = extra[key];
    if (Array.isArray(val)) {
      if (!target[key]) target[key] = [];
      for (const item of val) {
        if (!target[key].includes(item)) target[key].push(item);
      }
    } else {
      if (!target[key]) target[key] = {};
      mergeChallengeTrees(target[key], val);
    }
  }
}

function mergeOutdoorChallengeTrees(target, extra) {
  if (!extra || typeof extra !== "object") return;
  for (const key of Object.keys(extra)) {
    const val = extra[key];
    if (Array.isArray(val)) {
      if (!target[key]) target[key] = [];
      target[key].push(...val);
    } else {
      if (!target[key]) target[key] = {};
      mergeOutdoorChallengeTrees(target[key], val);
    }
  }
}

function buildMergedFromCtx(processed) {
  const merged = {};
  if (processed.CHALLENGES) {
    merged.CHALLENGES = structuredClone(processed.CHALLENGES);
    mergeChallengeTrees(merged.CHALLENGES, processed.CHALLENGES_HOME_EXTRA);
  }
  if (processed.REMOTE_CHALLENGES) {
    merged.REMOTE_CHALLENGES = structuredClone(processed.REMOTE_CHALLENGES);
    mergeChallengeTrees(merged.REMOTE_CHALLENGES, processed.CHALLENGES_REMOTE_EXTRA);
  }
  if (processed.OUTDOOR_CHALLENGES) {
    merged.OUTDOOR_CHALLENGES = structuredClone(processed.OUTDOOR_CHALLENGES);
    mergeOutdoorChallengeTrees(merged.OUTDOOR_CHALLENGES, processed.OUTDOOR_GENERAL_EXTRA);
  }
  if (processed.OUTDOOR_LOCATION_CHALLENGES) {
    merged.OUTDOOR_LOCATION_CHALLENGES = structuredClone(processed.OUTDOOR_LOCATION_CHALLENGES);
    mergeOutdoorChallengeTrees(merged.OUTDOOR_LOCATION_CHALLENGES, processed.OUTDOOR_LOCATION_EXTRA);
    if (processed.OUTDOOR_NEW_LOCATIONS) {
      for (const loc of Object.keys(processed.OUTDOOR_NEW_LOCATIONS)) {
        merged.OUTDOOR_LOCATION_CHALLENGES[loc] = structuredClone(processed.OUTDOOR_NEW_LOCATIONS[loc]);
      }
    }
  }
  if (processed.SWINGER_CLUB_CHALLENGES) {
    if (!merged.OUTDOOR_LOCATION_CHALLENGES) merged.OUTDOOR_LOCATION_CHALLENGES = {};
    merged.OUTDOOR_LOCATION_CHALLENGES.swinger = structuredClone(processed.SWINGER_CLUB_CHALLENGES);
  }
  if (processed.CHALLENGES_MEGA_V3) {
    mergeChallengeTrees(merged.CHALLENGES, processed.CHALLENGES_MEGA_V3);
  }
  if (processed.REMOTE_MEGA_V3) {
    mergeChallengeTrees(merged.REMOTE_CHALLENGES, processed.REMOTE_MEGA_V3);
  }
  if (processed.OUTDOOR_MEGA_V3) {
    mergeChallengeTrees(merged.OUTDOOR_CHALLENGES, processed.OUTDOOR_MEGA_V3);
  }
  return merged;
}

function verifyMergedPoolsFromCtx(processed) {
  const merged = buildMergedFromCtx(processed);
  const pools = [
    { tree: merged.CHALLENGES, label: "CHALLENGES" },
    { tree: merged.REMOTE_CHALLENGES, label: "REMOTE_CHALLENGES" },
    { tree: merged.OUTDOOR_CHALLENGES, label: "OUTDOOR_CHALLENGES" },
  ];
  if (merged.OUTDOOR_LOCATION_CHALLENGES) {
    for (const [loc, tree] of Object.entries(merged.OUTDOOR_LOCATION_CHALLENGES)) {
      pools.push({ tree, label: `OUTDOOR_LOCATION.${loc}` });
    }
  }
  for (const { tree, label } of pools) {
    if (tree) verifyTree(tree, label, `${label} (fusionado)`);
  }
}

function writeTreeFile(relPath, varName, tree, header, footer) {
  const body = `const ${varName} = ${JSON.stringify(tree, null, 2)};\n`;
  fs.writeFileSync(path.join(ROOT, relPath), header + body + footer, "utf8");
}

function extractHeaderFooter(raw, varName) {
  const re = new RegExp(`const ${varName}\\s*=\\s*`);
  const start = raw.search(re);
  if (start < 0) return { header: raw, footer: "" };
  let depth = 0;
  let i = raw.indexOf("{", start);
  if (i < 0) return { header: raw.slice(0, start), footer: "" };
  depth = 1;
  i++;
  while (i < raw.length && depth > 0) {
    if (raw[i] === "{") depth++;
    else if (raw[i] === "}") depth--;
    i++;
  }
  const end = i;
  let footer = raw.slice(end);
  const nextConst = footer.search(/\nconst [A-Z_]+ =/);
  if (nextConst >= 0) {
    // multi-const file — header is everything before this const
  }
  return { header: raw.slice(0, start), footer: raw.slice(end) };
}

function applyFile(relPath, varName, tree) {
  const raw = fs.readFileSync(path.join(ROOT, relPath), "utf8");
  const { header, footer } = extractHeaderFooter(raw, varName);
  writeTreeFile(relPath, varName, tree, header, footer);
}

function generateReport() {
  const lines = [
    "# Informe de auditoría de orientación — Retos",
    "",
    `Fecha: ${new Date().toISOString()}`,
    "",
    "## Resumen",
    "",
    `| Métrica | Cantidad |`,
    `|---------|----------|`,
    `| Total retos revisados | **${REPORT.totalReviewed}** |`,
    `| Retos corregidos (texto) | **${REPORT.corrected + REPORT.ambiguousFixed}** |`,
    `| Retos movidos de categoría | **${REPORT.moved}** |`,
    `| Duplicados eliminados | **${REPORT.removedDuplicates}** |`,
    `| Retos eliminados (incompatibles) | **${REPORT.removedInvalid}** |`,
    `| Fallos verificación final | **${REPORT.verificationFailures.length}** |`,
    "",
  ];

  if (REPORT.moves.length) {
    lines.push("## Movimientos (muestra — primeros 50)", "");
    for (const m of REPORT.moves.slice(0, 50)) {
      lines.push(`- **${m.from}** → **${m.to}** (${m.file})`);
      lines.push(`  - ${m.text}…`);
    }
    if (REPORT.moves.length > 50) lines.push(`\n… y ${REPORT.moves.length - 50} más.`);
    lines.push("");
  }

  if (REPORT.removed.length) {
    lines.push("## Eliminados (muestra — primeros 30)", "");
    for (const r of REPORT.removed.slice(0, 30)) {
      lines.push(`- [${r.reason}] ${r.path}: ${r.text}…`);
    }
    lines.push("");
  }

  if (REPORT.verificationFailures.length) {
    lines.push("## ⚠ Errores en verificación final", "");
    for (const f of REPORT.verificationFailures.slice(0, 40)) {
      lines.push(`- **${f.bucket}** → ${f.classified}: ${f.reason}`);
      lines.push(`  - ${f.text}…`);
    }
  } else {
    lines.push("## ✓ Verificación final", "", "Ningún reto incompatible detectado en segunda pasada.", "");
  }

  fs.writeFileSync(path.join(ROOT, "ORIENTATION-AUDIT-REPORT.md"), lines.join("\n"), "utf8");
  fs.writeFileSync(path.join(ROOT, "orientation-audit-report.json"), JSON.stringify(REPORT, null, 2), "utf8");
}

// --- Main ---
const ctx = {};

for (const src of SOURCE_FILES) {
  const loaded = loadFileVars(src.file, src.vars);
  for (const v of src.vars) {
    if (loaded.data[v]) ctx[v] = loaded.data[v];
  }
}

for (let pass = 0; pass < 8; pass++) {
  let passMoved = 0;
  for (const src of SOURCE_FILES) {
    for (const v of src.vars) {
      if (ctx[v]) passMoved += processTree(v, ctx[v], src.file, { movesOnly: pass > 0 });
    }
  }
  if (passMoved === 0) break;
}

verifyAll(ctx);
console.log("Verificando pools fusionados (como en partida)…");
verifyMergedPoolsFromCtx(ctx);
generateReport();

console.log("═══════════════════════════════════════════════════");
console.log("  AUDITORÍA ORIENTACIÓN — Retos");
console.log("═══════════════════════════════════════════════════");
console.log(`Total revisados:     ${REPORT.totalReviewed}`);
console.log(`Movidos:             ${REPORT.moved}`);
console.log(`Duplicados:          ${REPORT.removedDuplicates}`);
console.log(`Eliminados:          ${REPORT.removedInvalid}`);
console.log(`Corregidos (texto):  ${REPORT.corrected + REPORT.ambiguousFixed}`);
console.log(`Fallos verificación: ${REPORT.verificationFailures.length}`);
console.log(`\nInforme: ORIENTATION-AUDIT-REPORT.md`);

if (APPLY) {
  for (const src of SOURCE_FILES) {
    const loaded = loadFileVars(src.file, src.vars);
    for (const v of src.vars) {
      if (ctx[v]) {
        applyFile(src.file, v, ctx[v]);
        console.log(`Actualizado: ${src.file} → ${v}`);
      }
    }
  }
  // Re-run verification on disk
  console.log("\nRe-verificando archivos guardados…");
  const ctx2 = {};
  for (const src of SOURCE_FILES) {
    const loaded = loadFileVars(src.file, src.vars);
    Object.assign(ctx2, loaded.data);
  }
  REPORT.verificationFailures = [];
  verifyAll(ctx2);
  verifyMergedPoolsFromCtx(ctx2);
  console.log(`Fallos tras guardar: ${REPORT.verificationFailures.length}`);
  generateReport();
} else {
  console.log("\nModo análisis. Usa --apply para escribir cambios.");
}
