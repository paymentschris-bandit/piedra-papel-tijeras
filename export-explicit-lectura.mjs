/**
 * Exporta retos explícitos v4 a markdown legible, sin duplicados por lugar.
 * node export-explicit-lectura.mjs
 */
import fs from "fs";

const code = fs.readFileSync("challenges-explicit-v4.js", "utf8");

function extractJson(name) {
  const start = code.indexOf(`const ${name} = `);
  if (start < 0) throw new Error(`No ${name}`);
  let i = code.indexOf("{", start);
  let depth = 0;
  for (; i < code.length; i++) {
    if (code[i] === "{") depth++;
    else if (code[i] === "}") {
      depth--;
      if (depth === 0) return JSON.parse(code.slice(code.indexOf("{", start), i + 1));
    }
  }
}

const PLACE_RE =
  /\ben la cama\b|\ben el sof[aá]\b|\bcontra la pared\b|\ben la ducha\b|\ben la cocina\b|\ben el suelo\b|\bfrente a la webcam\b|\ben primer plano para la c[aá]mara\b|\bde perfil en c[aá]mara\b|\barrodillado frente al m[oó]vil\b|\bsentado en la silla frente al PC\b|\bde pie frente al tr[ií]pode\b|\ben el coche\b|\ben el parque\b|\ben la playa\b|\ben el parking\b|\ben el cine\b|\bal aire libre\b/gi;

function toStem(text) {
  return text
    .replace(PLACE_RE, "{lugar}")
    .replace(/\{ganador\}/g, "G")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueByPlace(arr) {
  const map = new Map();
  for (const t of arr) {
    const key = toStem(t);
    if (!map.has(key)) map.set(key, t.replace(PLACE_RE, "{lugar}"));
  }
  return [...map.values()];
}

const tree = extractJson("CHALLENGES_EXPLICIT_V4");

const sections = [
  ["CHICO VS CHICA — Ella pierde", tree.picante.hetero.chica, tree.extremo.hetero.chica],
  ["CHICO VS CHICA — Él pierde", tree.picante.hetero.chico, tree.extremo.hetero.chico],
  ["CHICO VS CHICO", tree.picante.chico_chico, tree.extremo.chico_chico],
  ["CHICA VS CHICA", tree.picante.chica_chica, tree.extremo.chica_chica],
];

let md = `# Retos explícitos v4 — Lectura

Fecha: ${new Date().toISOString().slice(0, 10)}

**500 retos por categoría** en juego (250 picante + 250 extremo).  
Lista sin duplicados por lugar — \`{lugar}\` = cama, sofá, ducha, cocina, suelo, pared (casa) u otro según modo.

\`{ganador}\` = quien ganó la ronda.

---

`;

for (const [title, picante, extremo] of sections) {
  const p = uniqueByPlace(picante);
  const e = uniqueByPlace(extremo);
  md += `## ${title}\n\n`;
  md += `En juego: **${picante.length}** picante + **${extremo.length}** extremo | **${p.length + e.length}** textos únicos\n\n`;
  md += `### Picante (${p.length})\n\n`;
  p.forEach((t, i) => {
    md += `${i + 1}. ${t}\n\n`;
  });
  md += `### Extremo (${e.length})\n\n`;
  e.forEach((t, i) => {
    md += `${i + 1}. ${t}\n\n`;
  });
  md += "---\n\n";
}

fs.writeFileSync("RETOS-EXPLICITOS-V4-LECTURA.md", md, "utf8");
console.log(`Escrito RETOS-EXPLICITOS-V4-LECTURA.md (${md.split("\n").length} líneas)`);
