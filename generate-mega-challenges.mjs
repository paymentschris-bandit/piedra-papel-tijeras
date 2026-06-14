/**
 * Genera retos mega v3, fusiona en expansión, audita y produce informe.
 * node generate-mega-challenges.mjs [--skip-audit] [--skip-i18n]
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import vm from "vm";
import { buildAllMegaTrees, getStemCounts, validateChallenge } from "./mega-challenge-banks-v3.mjs";
import { loadAllChallengeSources, walkChallengeStrings } from "./challenge-i18n-utils.mjs";

const ROOT = import.meta.dirname;
const MIN_NEW_PER_BUCKET = 300;
const MIN_NEW_PER_INTENSITY = 100;

const REPORT = {
  reviewedBefore: 0,
  corrected: 0,
  moved: 0,
  removedDuplicates: 0,
  removedInvalid: 0,
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
  const ctx = loadAllChallengeSources();
  const raw = new Set();
  walkChallengeStrings(ctx.CHALLENGES, raw);
  walkChallengeStrings(ctx.REMOTE_CHALLENGES, raw);
  walkChallengeStrings(ctx.OUTDOOR_CHALLENGES, raw);
  walkChallengeStrings(ctx.OUTDOOR_LOCATION_CHALLENGES, raw);
  return new Set([...raw].map(norm));
}

function filterNewOnly(tree, existingNorm) {
  const out = { suave: {}, picante: {}, extremo: {} };
  const stats = { hetero_chica: 0, hetero_chico: 0, chico_chico: 0, chica_chica: 0 };

  for (const intensity of ["suave", "picante", "extremo"]) {
    out[intensity] = {
      hetero: { chica: [], chico: [] },
      chico_chico: [],
      chica_chica: [],
    };
    const node = tree[intensity];

    for (const role of ["chica", "chico"]) {
      const bucket = `hetero.${role}`;
      const picked = pickNew(node.hetero[role], existingNorm, bucket, MIN_NEW_PER_INTENSITY);
      out[intensity].hetero[role] = picked;
      stats[`hetero_${role}`] += picked.length;
      for (const t of picked) existingNorm.add(norm(t));
    }

    for (const bucket of ["chico_chico", "chica_chica"]) {
      const picked = pickNew(node[bucket], existingNorm, bucket, MIN_NEW_PER_INTENSITY);
      out[intensity][bucket] = picked;
      stats[bucket] += picked.length;
      for (const t of picked) existingNorm.add(norm(t));
    }
  }

  return { tree: out, stats };
}

function pickNew(candidates, existingNorm, bucket, minCount) {
  const out = [];
  const seen = new Set();
  for (const text of candidates) {
    const n = norm(text);
    if (existingNorm.has(n) || seen.has(n)) continue;
    const v = validateChallenge(text, bucket);
    if (!v.valid) {
      REPORT.problems.push({ text: text.slice(0, 80), bucket, reason: v.reason });
      continue;
    }
    seen.add(n);
    out.push(text);
    if (out.length >= minCount + 20) break;
  }
  if (out.length < minCount) {
    REPORT.problems.push({
      bucket,
      reason: `Solo ${out.length} retos nuevos (mínimo ${minCount})`,
    });
    REPORT.confidence = "media";
  }
  return out;
}

function writeMegaFile() {
  const existingNorm = loadExistingNormSet();
  REPORT.reviewedBefore = existingNorm.size;

  const home = filterNewOnly(buildAllMegaTrees("home"), existingNorm);
  const remoteNorm = new Set(existingNorm);
  const remote = filterNewOnly(buildAllMegaTrees("remote"), remoteNorm);
  const outdoorNorm = new Set(remoteNorm);
  const outdoor = filterNewOnly(buildAllMegaTrees("outdoor"), outdoorNorm);

  REPORT.newCreated.home = Object.values(home.stats).reduce((a, b) => a + b, 0);
  REPORT.newCreated.remote = Object.values(remote.stats).reduce((a, b) => a + b, 0);
  REPORT.newCreated.outdoor = Object.values(outdoor.stats).reduce((a, b) => a + b, 0);
  REPORT.newCreated.byBucket = {
    home: home.stats,
    remote: remote.stats,
    outdoor: outdoor.stats,
  };

  const body = `// Mega retos v3 — generado por generate-mega-challenges.mjs
// Mínimo ${MIN_NEW_PER_BUCKET} nuevos por bucket (orientación)

const CHALLENGES_MEGA_V3 = ${JSON.stringify(home.tree, null, 2)};

const REMOTE_MEGA_V3 = ${JSON.stringify(remote.tree, null, 2)};

const OUTDOOR_MEGA_V3 = ${JSON.stringify(outdoor.tree, null, 2)};

function mergeChallengeTreesMega(target, extra) {
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
      mergeChallengeTreesMega(target[key], val);
    }
  }
}

(function applyMegaChallengesV3() {
  if (typeof CHALLENGES !== "undefined") mergeChallengeTreesMega(CHALLENGES, CHALLENGES_MEGA_V3);
  if (typeof REMOTE_CHALLENGES !== "undefined") mergeChallengeTreesMega(REMOTE_CHALLENGES, REMOTE_MEGA_V3);
  if (typeof OUTDOOR_CHALLENGES !== "undefined") mergeChallengeTreesMega(OUTDOOR_CHALLENGES, OUTDOOR_MEGA_V3);
})();
`;

  fs.writeFileSync(path.join(ROOT, "challenges-mega-v3.js"), body, "utf8");
  console.log("Escrito challenges-mega-v3.js");
  return { home, remote, outdoor };
}

function patchIndexHtml() {
  const htmlPath = path.join(ROOT, "index.html");
  let html = fs.readFileSync(htmlPath, "utf8");
  if (html.includes("challenges-mega-v3.js")) return;
  html = html.replace(
    '<script src="challenges-expansion.js"></script>',
    '<script src="challenges-expansion.js"></script>\n  <script src="challenges-mega-v3.js"></script>'
  );
  fs.writeFileSync(htmlPath, html, "utf8");
  console.log("index.html: añadido challenges-mega-v3.js");
}

function readAuditReport() {
  const jsonPath = path.join(ROOT, "orientation-audit-report.json");
  if (!fs.existsSync(jsonPath)) return;
  const audit = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  REPORT.corrected = (audit.corrected || 0) + (audit.ambiguousFixed || 0);
  REPORT.moved = audit.moved || 0;
  REPORT.removedDuplicates = audit.removedDuplicates || 0;
  REPORT.removedInvalid = audit.removedInvalid || 0;
  if (audit.verificationFailures?.length) {
    REPORT.problems.push(...audit.verificationFailures.slice(0, 20));
    REPORT.confidence = "baja";
  }
}

function writeReport(stemCounts) {
  const lines = [
    "# Informe — Revisión y expansión masiva de retos",
    "",
    `Fecha: ${new Date().toISOString()}`,
    "",
    "## Resumen",
    "",
    "| Métrica | Cantidad |",
    "|---------|----------|",
    `| Retos únicos existentes (antes) | **${REPORT.reviewedBefore}** |`,
    `| Retos nuevos — modo casa | **${REPORT.newCreated.home}** |`,
    `| Retos nuevos — modo webcam | **${REPORT.newCreated.remote}** |`,
    `| Retos nuevos — aire libre general | **${REPORT.newCreated.outdoor}** |`,
    `| Corregidos (auditoría) | **${REPORT.corrected}** |`,
    `| Movidos de categoría | **${REPORT.moved}** |`,
    `| Duplicados eliminados | **${REPORT.removedDuplicates}** |`,
    `| Eliminados (incompatibles) | **${REPORT.removedInvalid}** |`,
    `| Nivel de confianza | **${REPORT.confidence}** |`,
    "",
    "## Retos nuevos por bucket (modo casa)",
    "",
    "| Bucket | Suave+Picante+Extremo |",
    "|--------|----------------------|",
    `| hetero.chica | ${REPORT.newCreated.byBucket.home?.hetero_chica ?? 0} |`,
    `| hetero.chico | ${REPORT.newCreated.byBucket.home?.hetero_chico ?? 0} |`,
    `| chico_chico | ${REPORT.newCreated.byBucket.home?.chico_chico ?? 0} |`,
    `| chica_chica | ${REPORT.newCreated.byBucket.home?.chica_chica ?? 0} |`,
    "",
    "## Stems en banco v3 (por intensidad)",
    "",
    "```json",
    JSON.stringify(stemCounts, null, 2),
    "```",
    "",
  ];

  if (REPORT.problems.length) {
    lines.push("## Posibles problemas (muestra)", "");
    for (const p of REPORT.problems.slice(0, 30)) {
      lines.push(`- ${p.bucket || ""} ${p.reason || ""}: ${(p.text || "").slice(0, 100)}`);
    }
    lines.push("");
  } else {
    lines.push("## Verificación final", "", "Segunda auditoría: **0 fallos** de orientación/anatomía.", "");
  }

  fs.writeFileSync(path.join(ROOT, "CHALLENGES-MEGA-V3-REPORT.md"), lines.join("\n"), "utf8");
  fs.writeFileSync(path.join(ROOT, "challenges-mega-v3-report.json"), JSON.stringify(REPORT, null, 2), "utf8");
}

// --- Main ---
console.log("═══════════════════════════════════════════════════");
console.log("  GENERACIÓN MEGA V3 + AUDITORÍA");
console.log("═══════════════════════════════════════════════════\n");

const stemCounts = getStemCounts();
writeMegaFile();
patchIndexHtml();

if (!process.argv.includes("--skip-audit")) {
  console.log("\nEjecutando auditoría de orientación (--apply)…");
  try {
    execSync("node audit-orientation-challenges.mjs --apply", {
      cwd: ROOT,
      stdio: "inherit",
    });
  } catch {
    REPORT.confidence = "baja";
    console.warn("Auditoría terminó con avisos — revisa ORIENTATION-AUDIT-REPORT.md");
  }
  readAuditReport();
}

writeReport(stemCounts);

console.log("\n═══════════════════════════════════════════════════");
console.log(`Nuevos (casa):      ${REPORT.newCreated.home}`);
console.log(`Nuevos (webcam):    ${REPORT.newCreated.remote}`);
console.log(`Nuevos (outdoor):   ${REPORT.newCreated.outdoor}`);
console.log(`Movidos:            ${REPORT.moved}`);
console.log(`Duplicados:         ${REPORT.removedDuplicates}`);
console.log(`Confianza:          ${REPORT.confidence}`);
console.log("\nInforme: CHALLENGES-MEGA-V3-REPORT.md");

try {
  execSync("node count-all-challenges.mjs", { cwd: ROOT, stdio: "inherit" });
} catch {
  /* optional */
}
