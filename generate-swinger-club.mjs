import fs from "fs";
import {
  getHeteroChicaBanks,
  getHeteroChicoBanks,
  getChicoChicoBanks,
  getChicaChicaBanks,
  SWINGER_PAREJA_EXTRA,
  SWINGER_GLORY_HOLE_CHALLENGES,
} from "./swinger-club-banks.mjs";
import { splitParejaGrupo, fixChicaGender } from "./swinger-challenge-utils.mjs";

const ZONES = [
  "la zona de parejas",
  "el jacuzzi",
  "la sala privada",
  "el bar del club",
  "el pasillo de cabinas",
  "la piscina interior",
  "la zona de sofás",
  "la sala de juegos",
  "la cabina glory hole",
];

function pickZone(i) {
  return ZONES[i % ZONES.length];
}

function assignZones(templates, start = 0) {
  return templates.map((text, i) => text.replace(/\{z\}/g, pickZone(start + i)));
}

function mergeUnique(arr, additions) {
  const out = [...arr];
  for (const text of additions) {
    if (!out.includes(text)) out.push(text);
  }
  return out;
}

function setPath(root, path, value) {
  const parts = path.split(".");
  let cur = root;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function getPath(tree, path) {
  const parts = path.split(".");
  let cur = tree;
  for (const p of parts) {
    if (!cur) return null;
    cur = cur[p];
  }
  return cur;
}

function buildRolePools(intensity, key, getter, loserGender) {
  const base = assignZones(getter(intensity));
  const extraKey = key.includes(".") ? key : key;
  const extras = assignZones(
    SWINGER_PAREJA_EXTRA[extraKey]?.[intensity] || [],
    base.length
  );
  const gloryHole = SWINGER_GLORY_HOLE_CHALLENGES[extraKey]?.[intensity] || [];
  const merged = mergeUnique(mergeUnique(base, extras), gloryHole);
  const split = splitParejaGrupo(merged, loserGender);
  return split;
}

function buildSwingerChallenges() {
  const tree = { suave: {}, picante: {}, extremo: {} };
  const roles = [
    ["hetero", "chica", getHeteroChicaBanks],
    ["hetero", "chico", getHeteroChicoBanks],
    ["chico_chico", null, getChicoChicoBanks],
    ["chica_chica", null, getChicaChicaBanks],
  ];

  for (const intensity of ["suave", "picante", "extremo"]) {
    for (const [orient, role, getter] of roles) {
      const key = role ? `${orient}.${role}` : orient;
      const loserGender = role || orient.replace("_", "").slice(0, 5);
      const pools = buildRolePools(intensity, key, getter, role === "chica" ? "chica" : role === "chico" ? "chico" : null);
      if (role === "chica") {
        pools.pareja = pools.pareja.map((t) => fixChicaGender(t));
      }
      setPath(tree[intensity], key, pools);
    }
  }
  return tree;
}

const tree = buildSwingerChallenges();

const output = `// Retos Swinger Club — pareja (2 jugadores) vs grupo (4+ en el club)
// Generado por generate-swinger-club.mjs

const SWINGER_CLUB_CHALLENGES = ${JSON.stringify(tree, null, 2)};

(function applySwingerClubChallenges() {
  if (typeof OUTDOOR_LOCATION_CHALLENGES === "undefined") return;
  OUTDOOR_LOCATION_CHALLENGES.swinger = SWINGER_CLUB_CHALLENGES;
  if (typeof OUTDOOR_LOCATION_META !== "undefined" && OUTDOOR_LOCATION_META.swinger) {
    OUTDOOR_LOCATION_META.swinger.desc = "Pareja en el club; retos adaptados a vuestros géneros";
  }
})();
`;

fs.writeFileSync(new URL("./swinger-club-challenges.js", import.meta.url), output, "utf8");

console.log("Swinger Club — pareja vs grupo\n");
for (const intensity of ["suave", "picante", "extremo"]) {
  for (const key of ["hetero.chica", "hetero.chico", "chico_chico", "chica_chica"]) {
    const node = getPath(tree, `${intensity}.${key}`);
    const p = node?.pareja?.length ?? 0;
    const g = node?.grupo?.length ?? 0;
    console.log(`${intensity}.${key}: pareja=${p} grupo=${g}`);
  }
}
