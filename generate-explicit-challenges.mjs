/**
 * Genera retos explícitos v4 (500 por bucket) y fusiona en runtime.
 * node generate-explicit-challenges.mjs [--skip-audit]
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { execSync } from "child_process";
import { buildAllExplicitTrees, getExplicitStemCounts, validateExplicitChallenge } from "./explicit-challenge-banks.mjs";
import { walkChallengeStrings } from "./challenge-i18n-utils.mjs";

const ROOT = import.meta.dirname;
const MIN_PER_BUCKET = 500;
const MIN_PICANTE = 250;
const MIN_EXTREMO = 250;

const REPORT = {
  reviewedBefore: 0,
  newCreated: { home: 0, remote: 0, outdoor: 0, byBucket: {} },
  problems: [],
  confidence: "alta",
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

function loadExistingNormSet() {
  const ctx = {};
  let base = fs
    .readFileSync(path.join(ROOT, "challenges.js"), "utf8")
    .replace(/^const /gm, "var ");
  vm.runInNewContext(base.split("\nfunction determineWinner")[0], ctx);
  let extra = fs.readFileSync(path.join(ROOT, "challenges-expansion.js"), "utf8");
  extra += fs.readFileSync(path.join(ROOT, "outdoor-locations.js"), "utf8").replace(/^const /gm, "var ");
  extra += fs.readFileSync(path.join(ROOT, "outdoor-expansion.js"), "utf8");
  extra += fs.readFileSync(path.join(ROOT, "swinger-club-challenges.js"), "utf8");
  extra += fs.readFileSync(path.join(ROOT, "challenges-mega-v3.js"), "utf8");
  vm.runInNewContext(extra, ctx);
  const raw = new Set();
  walkChallengeStrings(ctx.CHALLENGES, raw);
  walkChallengeStrings(ctx.REMOTE_CHALLENGES, raw);
  walkChallengeStrings(ctx.OUTDOOR_CHALLENGES, raw);
  walkChallengeStrings(ctx.OUTDOOR_LOCATION_CHALLENGES, raw);
  return new Set([...raw].map(norm));
}

function pickNew(candidates, existingNorm, bucket, minCount) {
  const out = [];
  const seen = new Set();
  for (const text of candidates) {
    const n = norm(text);
    if (existingNorm.has(n) || seen.has(n)) continue;
    const v = validateExplicitChallenge(text, bucket);
    if (!v.valid) continue;
    seen.add(n);
    out.push(text);
    if (out.length >= minCount) break;
  }
  if (out.length < minCount) {
    REPORT.problems.push({ bucket, reason: `Solo ${out.length} retos nuevos (mínimo ${minCount})` });
    REPORT.confidence = "media";
  }
  return out;
}

function filterExplicitTree(tree, existingNorm) {
  const out = { picante: {}, extremo: {} };
  const stats = { hetero_chica: 0, hetero_chico: 0, chico_chico: 0, chica_chica: 0 };

  for (const intensity of ["picante", "extremo"]) {
    out[intensity] = {
      hetero: { chica: [], chico: [] },
      chico_chico: [],
      chica_chica: [],
    };
    const node = tree[intensity];
    const minCount = intensity === "picante" ? MIN_PICANTE : MIN_EXTREMO;

    for (const role of ["chica", "chico"]) {
      const bucket = `hetero.${role}`;
      const picked = pickNew(node.hetero[role], existingNorm, bucket, minCount);
      out[intensity].hetero[role] = picked;
      stats[`hetero_${role}`] += picked.length;
      for (const t of picked) existingNorm.add(norm(t));
    }

    for (const bucket of ["chico_chico", "chica_chica"]) {
      const picked = pickNew(node[bucket], existingNorm, bucket, minCount);
      out[intensity][bucket] = picked;
      stats[bucket] += picked.length;
      for (const t of picked) existingNorm.add(norm(t));
    }
  }

  return { tree: out, stats };
}

function writeExplicitFile() {
  const existingNorm = loadExistingNormSet();
  REPORT.reviewedBefore = existingNorm.size;

  const home = filterExplicitTree(buildAllExplicitTrees("home"), existingNorm);
  const remoteNorm = new Set(existingNorm);
  const remote = filterExplicitTree(buildAllExplicitTrees("remote"), remoteNorm);
  const outdoorNorm = new Set(remoteNorm);
  const outdoor = filterExplicitTree(buildAllExplicitTrees("outdoor"), outdoorNorm);

  REPORT.newCreated.home = Object.values(home.stats).reduce((a, b) => a + b, 0);
  REPORT.newCreated.remote = Object.values(remote.stats).reduce((a, b) => a + b, 0);
  REPORT.newCreated.outdoor = Object.values(outdoor.stats).reduce((a, b) => a + b, 0);
  REPORT.newCreated.byBucket = {
    home: home.stats,
    remote: remote.stats,
    outdoor: outdoor.stats,
  };

  const body = `// Retos explícitos v4 — generado por generate-explicit-challenges.mjs
// ${MIN_PER_BUCKET} nuevos por bucket (picante + extremo)

const CHALLENGES_EXPLICIT_V4 = ${JSON.stringify(home.tree, null, 2)};

const REMOTE_EXPLICIT_V4 = ${JSON.stringify(remote.tree, null, 2)};

const OUTDOOR_EXPLICIT_V4 = ${JSON.stringify(outdoor.tree, null, 2)};

function mergeChallengeTreesExplicit(target, extra) {
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
      mergeChallengeTreesExplicit(target[key], val);
    }
  }
}

(function applyExplicitChallengesV4() {
  if (typeof CHALLENGES !== "undefined") mergeChallengeTreesExplicit(CHALLENGES, CHALLENGES_EXPLICIT_V4);
  if (typeof REMOTE_CHALLENGES !== "undefined") mergeChallengeTreesExplicit(REMOTE_CHALLENGES, REMOTE_EXPLICIT_V4);
  if (typeof OUTDOOR_CHALLENGES !== "undefined") mergeChallengeTreesExplicit(OUTDOOR_CHALLENGES, OUTDOOR_EXPLICIT_V4);
})();
`;

  fs.writeFileSync(path.join(ROOT, "challenges-explicit-v4.js"), body, "utf8");
  console.log("Escrito challenges-explicit-v4.js");
  return { home, remote, outdoor };
}

function patchIndexHtml() {
  const htmlPath = path.join(ROOT, "index.html");
  let html = fs.readFileSync(htmlPath, "utf8");
  if (html.includes("challenges-explicit-v4.js")) return;
  html = html.replace(
    '<script src="challenges-mega-v3.js"></script>',
    '<script src="challenges-mega-v3.js"></script>\n  <script src="challenges-explicit-v4.js"></script>'
  );
  fs.writeFileSync(htmlPath, html, "utf8");
  console.log("index.html: añadido challenges-explicit-v4.js");
}

function writeReport(stemCounts) {
  const lines = [
    "# Informe — Retos explícitos v4",
    "",
    `Fecha: ${new Date().toISOString()}`,
    "",
    "## Resumen",
    "",
    "| Métrica | Cantidad |",
    "|---------|----------|",
    `| Retos existentes (antes) | **${REPORT.reviewedBefore}** |`,
    `| Nuevos — casa | **${REPORT.newCreated.home}** |`,
    `| Nuevos — webcam | **${REPORT.newCreated.remote}** |`,
    `| Nuevos — outdoor | **${REPORT.newCreated.outdoor}** |`,
    `| Confianza | **${REPORT.confidence}** |`,
    "",
    "## Por bucket (casa)",
    "",
    "| Bucket | Total |",
    "|--------|-------|",
    `| hetero.chica | ${REPORT.newCreated.byBucket.home?.hetero_chica ?? 0} |`,
    `| hetero.chico | ${REPORT.newCreated.byBucket.home?.hetero_chico ?? 0} |`,
    `| chico_chico | ${REPORT.newCreated.byBucket.home?.chico_chico ?? 0} |`,
    `| chica_chica | ${REPORT.newCreated.byBucket.home?.chica_chica ?? 0} |`,
    "",
    "## Stems en banco",
    "",
    "```json",
    JSON.stringify(stemCounts, null, 2),
    "```",
    "",
  ];

  if (REPORT.problems.length) {
    lines.push("## Problemas", "");
    for (const p of REPORT.problems.slice(0, 20)) {
      lines.push(`- ${p.bucket || ""}: ${p.reason}`);
    }
  }

  fs.writeFileSync(path.join(ROOT, "CHALLENGES-EXPLICIT-V4-REPORT.md"), lines.join("\n"), "utf8");
}

console.log("═══════════════════════════════════════════════════");
console.log("  GENERACIÓN RETOS EXPLÍCITOS V4");
console.log("═══════════════════════════════════════════════════\n");

const stemCounts = getExplicitStemCounts();
writeExplicitFile();
patchIndexHtml();

if (!process.argv.includes("--skip-audit")) {
  console.log("\nAuditoría de orientación…");
  try {
    execSync("node audit-orientation-challenges.mjs --apply", { cwd: ROOT, stdio: "inherit" });
  } catch {
    REPORT.confidence = "media";
  }
}

writeReport(stemCounts);

console.log("\n═══════════════════════════════════════════════════");
console.log(`Nuevos (casa):    ${REPORT.newCreated.home}`);
console.log(`Confianza:        ${REPORT.confidence}`);
console.log("\nInforme: CHALLENGES-EXPLICIT-V4-REPORT.md");

try {
  execSync("node count-all-challenges.mjs", { cwd: ROOT, stdio: "inherit" });
} catch {
  /* optional */
}
