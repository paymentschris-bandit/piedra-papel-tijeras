/**
 * Recuento de retos/órdenes por categoría en toda la app.
 * Ejecutar: node count-all-challenges.mjs
 */
import fs from "fs";
import vm from "vm";

const ROOT = import.meta.dirname;

function loadAppChallengeState() {
  let code = fs.readFileSync(`${ROOT}/challenges.js`, "utf8");
  code = code.replace(/^const /gm, "var ");
  code = code.split("var OUTDOOR_FINAL_REWARDS")[0] + code.match(/var OUTDOOR_FINAL_REWARDS[\s\S]*/)?.[0]?.split("function isRemotePlayMode")[0] || "";
  // simpler: load full challenges.js with var
  code = fs.readFileSync(`${ROOT}/challenges.js`, "utf8").replace(/^const /gm, "var ");
  code += fs.readFileSync(`${ROOT}/challenges-expansion.js`, "utf8");
  code += fs.readFileSync(`${ROOT}/challenges-mega-v3.js`, "utf8");
  try {
    code += fs.readFileSync(`${ROOT}/challenges-explicit-v4.js`, "utf8");
  } catch {
    /* opcional hasta primera generación */
  }
  code += fs.readFileSync(`${ROOT}/outdoor-locations.js`, "utf8").replace(/^const /gm, "var ");
  code += fs.readFileSync(`${ROOT}/outdoor-expansion.js`, "utf8");
  code += fs.readFileSync(`${ROOT}/swinger-club-challenges.js`, "utf8");
  const ctx = {};
  vm.runInNewContext(code, ctx);
  return ctx;
}

function walkArrays(obj, prefix = "", rows = []) {
  if (!obj || typeof obj !== "object") return rows;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (Array.isArray(val)) {
      rows.push({ path: prefix + key, count: val.length, type: "retos" });
    } else if (typeof val === "string" && prefix.includes(".")) {
      rows.push({ path: prefix + key, count: 1, type: "premio_final" });
    } else if (val && typeof val === "object") {
      walkArrays(val, prefix + key + ".", rows);
    }
  }
  return rows;
}

function sum(rows) {
  return rows.filter((r) => r.type === "retos").reduce((a, r) => a + r.count, 0);
}

function groupByIntensity(rows) {
  const g = { suave: 0, picante: 0, extremo: 0 };
  for (const r of rows) {
    if (r.type !== "retos") continue;
    const i = r.path.split(".")[0];
    if (g[i] !== undefined) g[i] += r.count;
  }
  return g;
}

function groupBySubcat(rows) {
  const g = {};
  for (const r of rows) {
    if (r.type !== "retos") continue;
    const parts = r.path.split(".");
    const sub = parts.slice(1).join(".") || parts[0];
    g[sub] = (g[sub] || 0) + r.count;
  }
  return g;
}

function printSection(title, tree, opts = {}) {
  const rows = walkArrays(tree);
  const retos = rows.filter((r) => r.type === "retos");
  const premios = rows.filter((r) => r.type === "premio_final");
  console.log(`\n## ${title}`);
  console.log(`Total retos: **${sum(rows)}**`);
  if (premios.length) console.log(`Premios finales: ${premios.length}`);
  const byInt = groupByIntensity(rows);
  console.log(`  Suave: ${byInt.suave} | Picante: ${byInt.picante} | Extremo: ${byInt.extremo}`);
  if (opts.detail) {
    console.log("\n  Por subcategoría (intensidad.orientación.rol):");
    for (const r of retos.sort((a, b) => a.path.localeCompare(b.path))) {
      console.log(`    ${r.path}: ${r.count}`);
    }
  }
  if (opts.swingerDetail && tree) {
    console.log("\n  Swinger — pareja (2 jugadores) vs grupo (4+ en club):");
    for (const intensity of ["suave", "picante", "extremo"]) {
      const level = tree[intensity];
      if (!level) continue;
      for (const orient of ["hetero", "chico_chico", "chica_chica"]) {
        if (orient === "hetero") {
          for (const role of ["chica", "chico"]) {
            const node = level.hetero?.[role];
            if (node?.pareja) {
              console.log(
                `    ${intensity}.hetero.${role}: pareja=${node.pareja.length} | grupo=${node.grupo?.length ?? 0}`
              );
            }
          }
        } else {
          const node = level[orient];
          if (node?.pareja) {
            console.log(
              `    ${intensity}.${orient}: pareja=${node.pareja.length} | grupo=${node.grupo?.length ?? 0}`
            );
          }
        }
      }
    }
    const parejaTotal = walkArrays(tree)
      .filter((r) => r.type === "retos" && r.path.includes(".pareja"))
      .reduce((a, r) => a + r.count, 0);
    const grupoTotal = walkArrays(tree)
      .filter((r) => r.type === "retos" && r.path.includes(".grupo"))
      .reduce((a, r) => a + r.count, 0);
    console.log(`  ── En partida (solo pareja): ${parejaTotal} retos | Grupo (opcional): ${grupoTotal} retos`);
  }
  return { rows, total: sum(rows), byInt, bySub: groupBySubcat(rows) };
}

const ctx = loadAppChallengeState();

console.log("═══════════════════════════════════════════════════");
console.log("  RECUENTO DE RETOS / ÓRDENES — Piedra Papel Tijeras");
console.log("═══════════════════════════════════════════════════");

const sections = [];

sections.push(printSection("🏠 Modo casa (CHALLENGES)", ctx.CHALLENGES, { detail: true }));
sections.push(printSection("📹 Modo webcam / online (REMOTE_CHALLENGES)", ctx.REMOTE_CHALLENGES, { detail: true }));
sections.push(printSection("🌍 Aire libre — General (OUTDOOR_CHALLENGES)", ctx.OUTDOOR_CHALLENGES, { detail: true }));

console.log("\n## 🌲 Aire libre — Por ubicación");
let outdoorLocTotal = 0;
const locNames = ctx.OUTDOOR_LOCATION_META || {};
for (const loc of Object.keys(ctx.OUTDOOR_LOCATION_CHALLENGES || {}).sort()) {
  const meta = locNames[loc];
  const label = meta ? `${meta.icon} ${meta.name}` : loc;
  const s = printSection(
    `  ${label} (${loc})`,
    ctx.OUTDOOR_LOCATION_CHALLENGES[loc],
    loc === "swinger" ? { swingerDetail: true } : {}
  );
  outdoorLocTotal += s.total;
}

// Grand totals
const casa = sections[0].total;
const webcam = sections[1].total;
const outdoorGeneral = sections[2].total;
const grandUniqueModes = casa + webcam + outdoorGeneral + outdoorLocTotal;

console.log("\n═══════════════════════════════════════════════════");
console.log("  RESUMEN GLOBAL");
console.log("═══════════════════════════════════════════════════");
console.log(`Modo casa:              ${casa} retos`);
console.log(`Modo webcam/online:     ${webcam} retos`);
console.log(`Aire libre General:     ${outdoorGeneral} retos`);
console.log(`Aire libre ubicaciones: ${outdoorLocTotal} retos (${Object.keys(ctx.OUTDOOR_LOCATION_CHALLENGES || {}).length} sitios)`);
console.log(`─────────────────────────────────────────────────`);
console.log(`TOTAL en app (suma modos): ${grandUniqueModes} retos`);
console.log(`(Cada modo/ubicación es un pool distinto; no se mezclan en partida.)`);

console.log("\n## Por orientación / rol (todos los pools de retos sumados)");
const allRetoRows = [];
for (const s of sections) allRetoRows.push(...s.rows.filter((r) => r.type === "retos"));
for (const loc of Object.keys(ctx.OUTDOOR_LOCATION_CHALLENGES || {})) {
  allRetoRows.push(...walkArrays(ctx.OUTDOOR_LOCATION_CHALLENGES[loc]).filter((r) => r.type === "retos"));
}
const globalSub = groupBySubcat(allRetoRows);
for (const k of Object.keys(globalSub).sort()) {
  console.log(`  ${k}: ${globalSub[k]}`);
}

console.log("\n## Intensidad (todos los pools sumados)");
const globalInt = { suave: 0, picante: 0, extremo: 0 };
for (const r of allRetoRows) {
  const i = r.path.split(".")[0];
  if (globalInt[i] !== undefined) globalInt[i] += r.count;
}
console.log(`  Suave: ${globalInt.suave} | Picante: ${globalInt.picante} | Extremo: ${globalInt.extremo}`);

// Min/max per subcategory across all pools
const byPath = {};
for (const r of allRetoRows) {
  byPath[r.path] = (byPath[r.path] || 0) + r.count;
}
const paths = Object.keys(byPath);
const counts = paths.map((p) => byPath[p]);
console.log(`\n## Estadísticas por subcategoría (suave/picante/extremo × orientación)`);
console.log(`  Subcategorías distintas: ${paths.length}`);
console.log(`  Mínimo en una celda (un pool): ${Math.min(...counts)}`);
console.log(`  Máximo en una celda (un pool): ${Math.max(...counts)}`);
console.log(`  Media por celda (pool individual): ${(counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(1)}`);

// Premios finales
function countPremios(obj) {
  let n = 0;
  walkArrays(obj).forEach((r) => {
    if (r.type === "premio_final") n++;
  });
  return n;
}
console.log("\n## Premios finales de partida");
console.log(`  Casa: ${countPremios(ctx.FINAL_REWARDS)}`);
console.log(`  Webcam: ${countPremios(ctx.REMOTE_FINAL_REWARDS)}`);
console.log(`  Aire libre: ${countPremios(ctx.OUTDOOR_FINAL_REWARDS)}`);
