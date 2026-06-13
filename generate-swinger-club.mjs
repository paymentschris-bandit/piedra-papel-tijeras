import fs from "fs";

const ZONES = [
  "la zona de parejas",
  "el jacuzzi",
  "la sala privada",
  "el bar del club",
  "el pasillo de cabinas",
  "la piscina interior",
  "la zona de sofás",
  "la sala de juegos",
];

function pickZone(i) {
  return ZONES[i % ZONES.length];
}

function loadExisting() {
  const path = new URL("./swinger-club-challenges.js", import.meta.url);
  if (!fs.existsSync(path)) return null;
  const raw = fs.readFileSync(path, "utf8");
  const m = raw.match(/const SWINGER_CLUB_CHALLENGES = (\{[\s\S]*?\n\});/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

function mergeUnique(existing, additions) {
  const out = [...(existing || [])];
  for (const text of additions) {
    if (!out.includes(text)) out.push(text);
  }
  return out;
}

function setPath(root, path, arr) {
  const parts = path.split(".");
  let cur = root;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = arr;
}

function getPath(tree, path) {
  const parts = path.split(".");
  let cur = tree;
  for (const p of parts) {
    if (!cur) return [];
    cur = cur[p];
  }
  return Array.isArray(cur) ? cur : [];
}

function buildFromBanks(banks, startIndex = 0) {
  const out = [];
  let i = 0;
  const maxRounds = 80;
  while (i < maxRounds) {
    for (const bank of banks) {
      const text = bank[i % bank.length].replace(/\{z\}/g, pickZone(startIndex + out.length));
      if (!out.includes(text)) out.push(text);
    }
    i++;
    if (out.length >= banks.reduce((a, b) => a + b.length, 0)) break;
  }
  return out;
}

function getHeteroBanks(intensity, role) {
  const c = " Solo con consentimiento explícito de todos y palabra de seguridad.";
  const isChica = role === "chica";

  const pareja = {
    suave: [
      `En {z}, elegid otra pareja del club. Presentaos y contad qué límites tenéis — los cuatro.`,
      `En {z}, sentaos en sofá cruzado con otra pareja: vosotros aquí, ellos enfrente. Coqueteo visual 2 minutos.`,
      `Brindad con otra pareja en el bar: cada uno dice una fantasía de intercambio suave sin ejecutarla aún.`,
      `En {z}, bailad lento pegados mientras otra pareja os mira desde el sofá — voyeur acordado.`,
      `Susurrale a {ganador} qué pareja os gustaría invitar a {z} — intercambio de parejas o trío con chica sola.`,
      `En {z}, dejad que otra pareja os vea besaros 30 segundos. Ellos deciden si se acercan.`,
      `Juego de parejas en {z}: cada pareja elige un reto suave para la otra — {ganador} veta si hace falta.`,
      `En {z}, caminad de la mano con otra pareja: chicos delante, chicas detrás, coqueteo cruzado.`,
      `En el jacuzzi con otra pareja: piernas rozándose bajo el agua 1 minuto — solo muslos sin más sin permiso.`,
      `En {z}, contad a otra pareja vuestro primer intercambio real o imaginado.`,
      `En {z}, {ganador} te presenta a la otra chica y tú presentas al otro chico — estilo swinger clásico.`,
      `Mirad juntos en {z} a otra pareja tocándose levemente. Comentad qué os excita.`,
      `En {z}, las dos chicas hablan solas 2 minutos mientras los chicos escuchan — sin celos, solo juego.`,
      `En {z}, los dos chicos brindan y hablan de límites mientras las chicas os observáis.`,
      `En {z}, elegid pareja para soft swap futuro: solo besos cruzados acordados esta ronda.`,
    ],
    picante: [
      `Soft swap en {z}: tú besas al otro chico 20 segundos, {ganador} besa a la otra chica — a la vez.${c}`,
      `En {z}, intercambio de manos: {ganador} toca a la otra chica, tú al otro chico — pecho y muslo — 90 segundos.${c}`,
      `En {z}, la otra pareja os mira mientras os desnudáis parcialmente — 30 segundos cada pareja.${c}`,
      `En cabina de {z}: parejas cruzadas en el mismo sofá — besos y manos bajo ropa 2 minutos.${c}`,
      `En {z}, tú y la otra chica os tocáis mutuamente mientras {ganador} y el otro chico miran — 2 minutos.${c}`,
      `En {z}, {ganador} recibe un beso de la otra chica mientras tú abrazas al otro chico — ropa puesta — 45 segundos.${c}`,
      `En el jacuzzi, intercambio bajo el agua: manos en muslos cruzados entre parejas 2 minutos.${c}`,
      `En {z}, intercambiad parejas para paja o dedos — cada uno con la pareja ajena — 2 minutos.${c}`,
      `En {z}, oral cruzado suave: tú entre las piernas de la otra chica, {ganador} con la otra — 90 segundos sobre bragas.${c}`,
      `En {z}, trío MFF suave: otra chica se une — besos y manos — 2 minutos.${c}`,
      `En {z}, trío MMF suave: otro chico se une — toques cruzados — 2 minutos.${c}`,
      `En {z}, las chicas hacen tribbing o se besan mientras los chicos se masturban mirando — 2 minutos.${c}`,
      `En {z}, {ganador} masturba al otro chico mientras tú besas a la otra chica — bisex suave — 90 segundos.${c}`,
      `En {z}, tú follas a la otra chica mientras {ganador} la besa — o al revés — 2 minutos.${c}`,
      `En {z}, otro chico te hace una paja mientras tú besas a {ganador} — trío mixto — 2 minutos.${c}`,
    ],
    extremo: [
      `Full swap en {z}: {ganador} folla o es follada por la pareja ajena, tú con el otro miembro — 4 minutos.${c}`,
      `En {z}, las dos chicas juntas mientras los dos chicos miran y se masturban — luego cambio 3 minutos.${c}`,
      `En sala privada de {z}, sexo en parejas cruzadas en la misma cama — 5 minutos.${c}`,
      `En {z}, trío MFF: tú, {ganador} y otra chica — actos acordados — 4 minutos.${c}`,
      `En {z}, trío MMF: otro chico se une a vosotros — roles que acordéis — 4 minutos.${c}`,
      `En {z}, {ganador} te mira mientras el otro chico te folla — o al revés si pierde él — 3 minutos.${c}`,
      `En {z}, orgasmo en parejas cruzadas: acabad casi a la vez los cuatro — 5 minutos.${c}`,
      `En {z}, doble pareja: una habitación, dos camas, intercambio libre acordado 5 minutos.${c}`,
      `En {z}, {ganador} elige si esta ronda es soft o full swap — cumple lo acordado 4 minutos.${c}`,
      `En {z}, grabación consensuada de parejas cruzadas — solo cuerpos — 2 minutos.${c}`,
      `Si pierdes otra ronda, {ganador} elige pareja del club para full swap en {z}.${c}`,
      `En {z}, noche swinger: segundo acto con la pareja que elijáis — sexo completo 4 minutos.${c}`,
    ],
  };

  const chicaSola = {
    suave: [
      `En el bar, señala con {ganador} a un chico solo. Coqueteo los tres — él sabe que sois pareja.`,
      `En {z}, baila con un chico solo mientras {ganador} sostiene tu copa y mira.`,
      `Invitad en {z} a una chica sola: trío de conversación morbosa — ¿MFF esta noche?`,
      `En {z}, un chico solo os mira besaros. Dejadle acercarse solo a hablar si queréis.`,
    ],
    picante: [
      `En {z}, chupa la polla de un chico solo invitado mientras {ganador} te agarra del pelo — 2 minutos.${c}`,
      `Trío en {z}: otro chico te folla mientras besas a {ganador} — o al revés — 3 minutos.${c}`,
      `En {z}, tú y otra chica sola os tozáis mientras vuestros chicos miran — 2 minutos.${c}`,
      `En {z}, un chico solo te hace una paja mientras {ganador} mira y comenta.${c}`,
    ],
    extremo: [
      `En {z}, el otro chico te folla mientras {ganador} mira — full hotwife roleplay — 4 minutos.${c}`,
      `En {z}, dos chicos — {ganador} y un invitado — te comparten por turnos 4 minutos.${c}`,
      `En {z}, MFF con chica sola: oral y dedos entre las tres — 4 minutos.${c}`,
      `En {z}, acaba el chico solo en tu cuerpo mientras {ganador} observa — si todos quieren.${c}`,
    ],
  };

  const chicoSola = {
    suave: [
      `En el bar, señala con {ganador} a una chica sola. Coqueteo los tres — ella sabe que sois pareja.`,
      `En {z}, baila con una chica sola mientras {ganador} mira desde la barra.`,
      `Invitad en {z} a un chico solo para trío MMF — solo conversación y miradas al principio.`,
      `En {z}, una chica sola os mira abrazados. Coqueteo a tres bandas.`,
    ],
    picante: [
      `En {z}, folla a una chica sola mientras {ganador} la besa o mira — 3 minutos.${c}`,
      `En {z}, otra chica te hace una paja mientras {ganador} te besa — trío mixto — 2 minutos.${c}`,
      `En {z}, tú y otro chico tocais a la misma chica invitada — manos alternadas — 2 minutos.${c}`,
      `En {z}, bisex suave: otro chico te roza la polla mientras tú besas a su pareja o a {ganador} — 90 segundos.${c}`,
    ],
    extremo: [
      `En {z}, folla a la chica sola mientras {ganador} recibe atención del otro chico — swap cruzado — 4 minutos.${c}`,
      `En {z}, MMF: tú y otro chico con {ganador} o con chica invitada — roles acordados — 4 minutos.${c}`,
      `En {z}, {ganador} te mira mientras follas a otra chica — luego ella te chupa — 4 minutos.${c}`,
      `En {z}, bisex en pareja: otro chico te masturba mientras tú follas — solo si {ganador} está de acuerdo — 3 minutos.${c}`,
    ],
  };

  const multiHetero = {
    suave: [
      `En {z}, quedaos con otras dos parejas hetero: cada una cuenta su fantasía de intercambio.`,
      `En {z}, ruleta de parejas: {ganador} elige pareja con la que coquetear 1 minuto — sin tocar aún.`,
      `En {z}, mirad cómo otra pareja se besa — vosotros imitáis su intensidad.`,
      `En {z}, presentación grupal: tres parejas, cada chica elige con qué chico hablar primero.`,
    ],
    picante: [
      `En {z}, tres parejas: intercambio de pareja una ronda — besos y manos — 2 minutos.${c}`,
      `En {z}, las chicas en el centro — vosotras os tocáis, los chicos en círculo mirando — 2 minutos.${c}`,
      `En {z}, los chicos reciben paja de la pareja ajena mientras las chicas se besan — 2 minutos.${c}`,
      `En {z}, chica sola se une al intercambio de parejas — cinco personas, reglas claras — 3 minutos.${c}`,
    ],
    extremo: [
      `En {z}, tres parejas — intercambio total en sala privada 5 minutos.${c}`,
      `En {z}, orgía mixta hetero: solo parejas y solos que consentís — chico con chica siempre — 5 minutos.${c}`,
      `En {z}, gangbang hetero para ti: varios chicos, {ganador} organiza turnos — 4 minutos.${c}`,
      `En {z}, las chicas en tribbing mientras los chicos se masturban mirando — luego swap — 4 minutos.${c}`,
    ],
  };

  const solo = isChica ? chicaSola[intensity] : chicoSola[intensity];
  return [...pareja[intensity], ...multiHetero[intensity], ...solo];
}

function buildSwingerChallenges() {
  const existing = loadExisting();
  const tree = { suave: {}, picante: {}, extremo: {} };

  const roles = [
    ["hetero", "chica"],
    ["hetero", "chico"],
    ["chico_chico", null],
    ["chica_chica", null],
  ];

  for (const intensity of ["suave", "picante", "extremo"]) {
    for (const [orient, role] of roles) {
      const key = role ? `${orient}.${role}` : orient;
      const prev = existing ? getPath(existing[intensity], key) : [];

      let merged;
      if (orient === "hetero") {
        const heteroNew = buildFromBanks([getHeteroBanks(intensity, role)]);
        merged = mergeUnique(prev, heteroNew);
      } else {
        const extra = buildFromBanks([getSameSexExtra(intensity, orient)]);
        merged = mergeUnique(prev, extra);
      }

      setPath(tree[intensity], key, merged);
    }
  }
  return tree;
}

function getSameSexExtra(intensity, orient) {
  const c = " Solo con consentimiento explícito de todos y palabra de seguridad.";
  if (orient === "chico_chico") {
    return {
      suave: [
        `En {z}, presentaos como pareja gay ante otra pareja o un chico solo del club.`,
        `En {z}, coqueteo con otro chico solo mientras {ganador} mira.`,
      ],
      picante: [
        `En {z}, trío gay: otro chico solo se une — oral y manos — 2 minutos.${c}`,
        `En {z}, pareja gay + chico solo: paja cruzada 2 minutos.${c}`,
      ],
      extremo: [
        `En {z}, orgía gay acordada con chicos solos del club — 4 minutos.${c}`,
        `En {z}, {ganador} te comparte con chico solo — sexo completo 3 minutos.${c}`,
      ],
    }[intensity];
  }
  return {
    suave: [
      `En {z}, presentaos como pareja lésbica ante otra pareja o chica sola.`,
      `En {z}, coqueteo con otra chica sola mientras {ganador} mira.`,
    ],
    picante: [
      `En {z}, trío lésbico: otra chica se une — besos y dedos — 2 minutos.${c}`,
      `En {z}, pareja + chica sola: tribbing alternado 2 minutos.${c}`,
    ],
    extremo: [
      `En {z}, orgía lésbica acordada con chicas solas — 4 minutos.${c}`,
      `En {z}, {ganador} te comparte con chica sola — sexo completo 3 minutos.${c}`,
    ],
  }[intensity];
}

const tree = buildSwingerChallenges();

const output = `// Retos Swinger Club — parejas hetero, intercambio, tríos mixtos
// Generado por generate-swinger-club.mjs (conserva retos anteriores + nuevos)

const SWINGER_CLUB_CHALLENGES = ${JSON.stringify(tree, null, 2)};

(function applySwingerClubChallenges() {
  if (typeof OUTDOOR_LOCATION_CHALLENGES === "undefined") return;
  OUTDOOR_LOCATION_CHALLENGES.swinger = SWINGER_CLUB_CHALLENGES;
  if (typeof OUTDOOR_LOCATION_META !== "undefined" && OUTDOOR_LOCATION_META.swinger) {
    OUTDOOR_LOCATION_META.swinger.desc = "Parejas, intercambio, tríos mixtos";
  }
})();
`;

fs.writeFileSync(new URL("./swinger-club-challenges.js", import.meta.url), output, "utf8");

for (const intensity of ["suave", "picante", "extremo"]) {
  for (const key of ["hetero.chica", "hetero.chico", "chico_chico", "chica_chica"]) {
    const n = getPath(tree[intensity], key).length;
    console.log(`${intensity}.${key}: ${n}`);
  }
}
