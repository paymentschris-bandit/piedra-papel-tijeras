import fs from "fs";
import vm from "vm";

const MIN = 40;
const ROOT = import.meta.dirname;

function loadOutdoorData() {
  let code = fs.readFileSync(`${ROOT}/challenges.js`, "utf8");
  code = code.replace(/^const OUTDOOR_CHALLENGES/m, "var OUTDOOR_CHALLENGES");
  code = code.split("const OUTDOOR_FINAL_REWARDS")[0];
  code += fs.readFileSync(`${ROOT}/outdoor-locations.js`, "utf8").replace(/^const /gm, "var ");
  const ctx = { OUTDOOR_CHALLENGES: null, OUTDOOR_LOCATION_CHALLENGES: null, OUTDOOR_LOCATION_META: null };
  vm.runInNewContext(code, ctx);
  return ctx;
}

function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

function countLeaves(obj, prefix = "") {
  const rows = [];
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (Array.isArray(v)) rows.push({ path: prefix + k, arr: v });
    else if (v && typeof v === "object") rows.push(...countLeaves(v, prefix + k + "."));
  }
  return rows;
}

function appendToPath(root, parts, items) {
  let cur = root;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  const last = parts[parts.length - 1];
  if (!cur[last]) cur[last] = [];
  cur[last].push(...items);
}

const LOC_LABELS = {
  coche: "el coche",
  parque: "el parque",
  cine: "el cine",
  playa: "la playa",
  restaurante: "el restaurante",
  parking: "el parking",
  discoteca: "la discoteca",
  swinger: "el swinger club",
};

const EXHIB = [
  "Exhibicionismo acordado: deja que {ganador} te mire mientras te tocas por encima de la ropa 45 segundos donde podría haber gente lejos.",
  "Flash rápido: {ganador} elige el momento — enseña lo justo 5 segundos y tapa al instante si alguien se acerca.",
  "Caminad pegados como pareja que no disimula: deja que {ganador} te pase la mano por el culo cuando crucéis con alguien.",
  "Confiesa la fantasía de que un desconocido os pillara mirando y quedad abrazados íntimos 30 segundos en un sitio visible.",
  "En un rincón semi-público, quédate quieto mientras {ganador} te toca por encima de la ropa 60 segundos. Él/ella vigila.",
  "Deja que {ganador} te diga cuándo abrir piernas o chaqueta 10 segundos mirando hacia donde puede haber gente.",
  "Riesgo acordado: ropa interior en el bolsillo de {ganador} — vuelves sin ella bajo la ropa hasta la siguiente ronda.",
  "Susurrale a {ganador} qué enseñarías si os atrevierais y cumple una orden exhibicionista suave en 15 segundos.",
];

function extraFor(path, loc, n) {
  if (loc === "discoteca" || loc === "swinger") {
    return getVenueChallenges(loc, path, n);
  }
  const [, intensity, orient, role] = path.match(/^(suave|picante|extremo)\.(.+)$/) || [];
  const place = loc === "general" ? "al aire libre" : LOC_LABELS[loc] || loc;
  const isExhib = intensity !== "suave";
  const out = [];
  const who = role === "chica" ? "ella" : role === "chico" ? "él" : "vosotros";

  const pools = {
    suave: {
      hetero_chica: [
        `En ${place}, guía la mano de {ganador} bajo tu ropa 25 segundos mientras finges mirar el móvil.`,
        `Susurrale tres fantasías en ${place} donde casi os vean.`,
        `Besad con lengua 25 segundos en un rincón de ${place}. Separad si alguien se acerca.`,
        `Caminad de la mano y deja que {ganador} te pellizque el culo al pasar gente.`,
        `En ${place}, abraza a {ganador} frotando tu entrepierna — ropa puesta — 40 segundos.`,
        `Confiesa dónde te excitaría que {ganador} te tocara en ${place}.`,
        `Quítate una prenda interior en el baño y entrégasela a {ganador}. Vuelve sin ella.`,
        `En ${place}, abre las piernas un poco más de lo normal mientras {ganador} vigila si alguien mira.`,
      ],
      hetero_chico: [
        `En ${place}, pon la mano de {ganador} sobre tu polla — ropa puesta — 20 segundos.`,
        `Susurrale qué harías en ${place} si no hubiera nadie.`,
        `Frota tu erección contra su culo — ropa puesta — 35 segundos en ${place}.`,
        `Besad 25 segundos en un rincón de ${place}. Parar si hay gente cerca.`,
        `Confiesa tres sitios de ${place} donde te morirías de follártela.`,
        `Guía su mano sobre tu pecho o muslo en ${place} 30 segundos.`,
        `En ${place}, deja visible el bulto de tu polla 15 segundos mientras {ganador} vigila.`,
        `Camina delante de {ganador} en ${place} rozándole la mano cuando pase alguien.`,
      ],
      chico_chico: [
        `En ${place}, besad 25 segundos y frota pollas — ropa puesta — 30 segundos.`,
        `Mano de {ganador} sobre tu polla en ${place} 20 segundos bajo la chaqueta.`,
        `Confesad fantasías en ${place} mientras os tocáis el muslo.`,
        `Abrazad empujando erecciones en un rincón de ${place} 40 segundos.`,
        `En ${place}, abre las piernas dejando ver el bulto. {ganador} avisa si alguien mira.`,
        `Besad donde podáis ser vistos de lejos en ${place} 20 segundos.`,
        `Frota tu polla contra la suya en ${place} 35 segundos.`,
        `Quita la ropa interior en un baño y dásela a {ganador}.`,
      ],
      chica_chica: [
        `En ${place}, guía su mano bajo tu ropa hacia el muslo 30 segundos.`,
        `Besad en un rincón de ${place} 25 segundos. Separación rápida si alguien viene.`,
        `Frota tu coño contra su muslo — ropa puesta — 40 segundos en ${place}.`,
        `Confesad dónde os excitaría que os pillaran en ${place}.`,
        `Mordisquea su cuello en ${place} mientras os abrazáis pegadas.`,
        `En ${place}, abre las piernas lo justo para que {ganador} vea tu braga.`,
        `Susurrale tres fantasías lésbicas en ${place}.`,
        `Quítate el sujetador en el baño y dáselo a {ganador}.`,
      ],
    },
    picante: {
      hetero_chica: [
        `En ${place}, sube la falda lo justo y deja que {ganador} te toque el coño 90 segundos mirando si viene alguien.`,
        `Simula chupar la polla de {ganador} — ropa puesta — 45 segundos en ${place}.`,
        `Mastúrbate discretamente mientras {ganador} vigila en ${place}. 90 segundos sin correrte.`,
        `Flash: enseña las tetas 5 segundos bajo la chaqueta en ${place}. {ganador} elige cuándo.`,
        `En ${place}, saca la polla de {ganador} y mastúrbalo 2 minutos. Para si hay gente.`,
        `Quítate las bragas en el baño de ${place} y vuelve. Dedos discretos 2 minutos.`,
        `Arrodíllate en un rincón de ${place} y obedece 90 segundos lo que {ganador} susurre.`,
        `En ${place}, deja que te metan mano bajo la falda mientras alguien pasa lejos — parar si se acercan.`,
      ],
      hetero_chico: [
        `En ${place}, baja el pantalón lo justo y deja que {ganador} masturbe tu polla 2 minutos.`,
        `Mete dos dedos en el coño de {ganador} en ${place} 90 segundos mientras vigiláis.`,
        `En ${place}, arrodíllate y saca la polla 15 segundos. Sube rápido si hay gente.`,
        `Flash: enseña tu polla dura 5 segundos en ${place}. {ganador} vigila.`,
        `Frota tu polla contra su coño — braga apartada — 1 minuto en ${place}.`,
        `En ${place}, ella te hace paja bajo la chaqueta 2 minutos.`,
        `Lame su coño en un rincón de ${place} 90 segundos en silencio.`,
        `En ${place}, confiesa en voz baja la fantasía más morbosa mientras te toca.`,
      ],
      chico_chico: [
        `En ${place}, sacad las pollas y masturbad mutuamente 2 minutos mirando si viene alguien.`,
        `En el baño de ${place}, chúpale la polla 90 segundos en silencio.`,
        `Frota tu polla contra el culo de {ganador} en ${place} 1 minuto.`,
        `Flash mutuo en ${place}: enseñad las pollas 5 segundos cada uno.`,
        `Paja mutua en ${place} 2 minutos bajo chaquetas.`,
        `En ${place}, bajad pantalones 10 segundos de espaldas al tráfico. {ganador} vigila.`,
        `Confesad fantasía de follaros en ${place} sin que os vean.`,
        `69 o paja mutua 90 segundos cuando pase alguien lejos en ${place}.`,
      ],
      chica_chica: [
        `En ${place}, bajaos bragas y tocaos mutuamente 2 minutos mirando si viene alguien.`,
        `Lame el coño de {ganador} en un rincón de ${place} 90 segundos.`,
        `Besad y meted mano bajo la ropa 90 segundos en ${place}.`,
        `Tribbing en ${place} 2 minutos con ropa apartada lo justo.`,
        `Flash: enseñad tetas o coño 5 segundos bajo la chaqueta en ${place}.`,
        `En ${place}, quitad bragas y guardadla la una la otra.`,
        `Dedos bajo falda en ${place} 2 minutos mientras alguien pasa lejos.`,
        `Confesad dónde os correrte en ${place} si os atrevierais.`,
      ],
    },
    extremo: {
      hetero_chica: [
        `En ${place}: monta a {ganador} o guía su polla dentro 2 minutos. Para si hay gente cerca.`,
        `Sexo oral en un rincón de ${place} — chúpale hasta 3 minutos o hasta que diga basta.`,
        `Mastúrbate hasta correrte en ${place} mientras {ganador} mira y vigila.`,
        `Riesgo acordado en ${place}: folla o frota 90 segundos donde podáis ser vistos de lejos.`,
        `{ganador} te folla en ${place} 3 minutos. Palabra de seguridad siempre.`,
        `Desnúdate completa 30 segundos en ${place}. Vuelve a vestir si hay voces.`,
        `Prohibido correrte hasta la siguiente ronda. Si pierdes otra ronda, te corres en ${place}.`,
        `Arrodíllate en ${place} y chúpale hasta que acabe o 4 minutos.`,
      ],
      hetero_chico: [
        `Folla a {ganador} en ${place} 3 minutos. Para si hay gente.`,
        `Cómele el coño en ${place} hasta que se corra o 4 minutos.`,
        `Mastúrbate hasta correrte en ${place} mientras {ganador} mira.`,
        `Riesgo acordado: polla dentro o casi en ${place} 90 segundos. Parar si alguien se acerca.`,
        `Desnúdate 1 minuto en ${place} mientras {ganador} te toca. Ropa a mano.`,
        `Si pierdes otra ronda, {ganador} elige dónde acabas en ${place}.`,
        `En ${place}, ella te masturba hasta correrte en su mano o boca.`,
        `Exhibicionismo acordado en ${place}: desnudo de cintura para abajo 45 segundos. {ganador} vigila.`,
      ],
      chico_chico: [
        `Follad en ${place} 3 minutos. Ventanas o cobertura si hace falta.`,
        `Oral en ${place} hasta que acabe o 4 minutos.`,
        `69 en ${place} 3 minutos hasta que uno se corra.`,
        `Masturbad mutuamente hasta correros en ${place}.`,
        `Riesgo acordado: pollas fuera 10 segundos en ${place}. Parar si hay gente.`,
        `Desnúdate en ${place} y deja que {ganador} te folle o chupe 3 minutos.`,
        `Prohibido correrte hasta la siguiente ronda. Si pierdes otra ronda, acabas en ${place}.`,
        `Exhibicionismo acordado en ${place}: pollas erectas 20 segundos mirando hacia posibles mirones.`,
      ],
      chica_chica: [
        `Dedos, lengua o tribbing hasta orgasmo — 3 minutos en ${place}.`,
        `{ganador} te lame el coño hasta correrte o 4 minutos en ${place}.`,
        `69 o dedos profundos 3 minutos en ${place}.`,
        `Una masturba a la otra hasta correrte mirando si viene alguien en ${place}.`,
        `Riesgo acordado: flash de coño o tetas 10 segundos en ${place}.`,
        `Desnudas 1 minuto en ${place}. Volved a vestir si hay gente.`,
        `Si pierdes otra ronda, te corres donde {ganador} decida en ${place}.`,
        `Exhibicionismo acordado en ${place}: desnúdate de cintura para arriba 30 segundos.`,
      ],
    },
  };

  let key = orient;
  if (orient === "hetero") key = `hetero_${role}`;
  const pool = pools[intensity]?.[key] || pools[intensity]?.chico_chico || [];
  let i = 0;
  while (out.length < n) {
    out.push(pool[i % pool.length]);
    i++;
  }
  if (isExhib && loc !== "general") {
    for (let j = 0; j < Math.min(3, n) && out.length < n; j++) {
      out.push(EXHIB[j % EXHIB.length].replace("un rincón semi-público", `un rincón de ${place}`));
    }
  }
  while (out.length < n) {
    out.push(`${place}: reto extra ${out.length + 1} con {ganador} — intensidad ${intensity}. Palabra de seguridad.`);
  }
  return out.slice(0, n);
}

function adaptRole(text, role) {
  if (role === "chico") {
    return text
      .replace(/monta a \{ganador\}/gi, "folla a {ganador}")
      .replace(/saca la polla de \{ganador\}/gi, "saca tu polla y guía la mano de {ganador}")
      .replace(/Simula chupar la polla de \{ganador\}/gi, "Simula que {ganador} te chupa la polla")
      .replace(/Arrodíllate en el baño y chúpale/gi, "Arrodíllate en el baño y deja que te chupe o chúpele el coño")
      .replace(/ella te hace paja/gi, "{ganador} te hace paja")
      .replace(/lamé o deja que te laman/gi, "lamé a {ganador} o deja que te lame");
  }
  if (role === "chico_chico") {
    return text.replace(/chupla la polla de \{ganador\}/gi, "chúpale la polla a {ganador}");
  }
  if (role === "chica_chica") {
    return text
      .replace(/chupla la polla/gi, "lamé el coño")
      .replace(/polla/gi, "coño")
      .replace(/paja/gi, "dedos");
  }
  return text;
}

function getVenueChallenges(venue, path, n) {
  const roleMatch = path.match(/hetero\.(chica|chico)|chico_chico|chica_chica/);
  const role = roleMatch ? roleMatch[1] || roleMatch[0] : "chica";
  const [, intensity] = path.match(/^(suave|picante|extremo)/) || [];
  const isDisco = venue === "discoteca";
  const place = isDisco ? "la discoteca" : "el swinger club";
  const zone = isDisco
    ? ["la pista", "la barra", "el baño VIP", "la terraza del local", "junto al DJ", "la zona de sofás"]
    : ["la zona de parejas", "el jacuzzi", "la sala privada", "el bar del club", "el pasillo de cabinas", "la piscina interior"];
  const pick = (arr) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push(adaptRole(arr[i % arr.length].replace(/\{z\}/g, zone[i % zone.length]), role));
    }
    return out;
  };

  if (isDisco) {
    if (intensity === "suave") {
      return pick([
        "En {z}, baila pegada a {ganador} frotando tu culo contra su erección 1 minuto. Mirad a la pista, no a la gente.",
        "En {z}, susurrale al oído qué harías en el baño de la discoteca si os atrevierais.",
        "Besad con lengua 20 segundos en {z} cuando baje la luz. Separad si alguien os mira fijo.",
        "Guía la mano de {ganador} por tu cintura bajo la camiseta 30 segundos en {z}.",
        "Confiesa tres fantasías de discoteca: baño, pista, reservado… Detalle incluido.",
        "En {z}, cruza las piernas rozando su mano mientras finges bailar.",
        "Caminad hacia {z} de la mano y deja que {ganador} te pellizque el culo al pasar un desconocido.",
        "En {z}, abraza a {ganador} empujando entrepiernas — ropa puesta — 45 segundos.",
        "Quítate las bragas en el baño de la discoteca y dáselas a {ganador}. Vuelve a {z} sin ellas.",
        "En {z}, mira a un desconocido 5 segundos mientras {ganador} te roza el muslo interno.",
        "Susurrale a {ganador} que esta noche queréis que alguien os pille mirando en la pista.",
        "En {z}, besa su cuello 15 segundos con la mano en su entrepierna por encima del pantalón.",
        "Bailad en {z} con vuestras frentes pegadas y manos en la cadera del otro 1 minuto.",
        "Confiesa dónde te excitaría que {ganador} te tocara en plena discoteca.",
        "En {z}, deja que {ganador} te suba un poco el vestido cuando pase alguien cerca — 10 segundos.",
        "En la barra, pide dos chupitos y comparte el mismo vaso rozando labios 20 segundos.",
        "En {z}, guía su mano bajo tu falda al muslo 25 segundos mientras la música tapa vuestros susurros.",
        "Bailad lento en {z} con su mano en tu culo por encima del pantalón 45 segundos.",
        "En {z}, confiesa la fantasía de que un desconocido os viera besaros.",
        "De camino a {z}, frota tu entrepierna contra su mano 20 segundos sin disimular del todo.",
      ]);
    }
    if (intensity === "picante") {
      return pick([
        "En {z}, mete la mano de {ganador} bajo tu falda 90 segundos mientras bailáis. Él vigila si alguien se acerca.",
        "En el baño de la discoteca, dale un beso y guía su mano dentro de tu braga 30 segundos.",
        "Simula chupar la polla de {ganador} inclinada hacia él en {z} — ropa puesta — 45 segundos.",
        "En {z}, mastúrbate discretamente mientras {ganador} tapa con su cuerpo. 90 segundos.",
        "Flash en {z}: enseña las tetas 3 segundos bajo la chaqueta cuando {ganador} diga.",
        "En el baño VIP, quítate las bragas y vuelve a {z}. Cruza las piernas rozándole 2 minutos.",
        "En {z}, saca la polla de {ganador} bajo la chaqueta y mastúrbalo 90 segundos.",
        "Exhibicionismo en {z}: abre la chaqueta sin sujetador 8 segundos mirando hacia la pista.",
        "En el baño de la discoteca, mano bajo su falda 1 minuto. Salid con intervalo.",
        "En {z}, frota tu coño contra su muslo — braga apartada lo justo — 1 minuto.",
        "Bailad en {z} con su dedo en tu braga 60 segundos. Para si alguien os mira fijo.",
        "En {z}, ella te hace paja bajo la chaqueta 2 minutos en penumbra.",
        "En el reservado o {z}, chúpale la polla 90 segundos con la puerta entornada si hay.",
        "Flash: enseña tu polla 3 segundos en el baño de la discoteca si está vacío.",
        "En {z}, confiesa en voz alta la fantasía más morbosa de la noche mientras te toca.",
        "En la pista, bailad pegados con dedos dentro de braga 90 segundos — parar si os señalan.",
        "En {z}, quitad bragas en el baño y guardadla {ganador}. Seguid sin ella bajo el vestido.",
        "En {z}, lamé o deja que te laman el cuello mientras alguien pasa a un metro — 45 segundos.",
        "Exhibicionismo acordado: en {z}, falda arriba 10 segundos mirando hacia la barra.",
        "En el baño de la discoteca, sexo oral rápido 90 segundos en silencio si está vacío.",
      ]);
    }
    return pick([
      "En {z}, monta a {ganador} o guía su polla dentro 2 minutos en penumbra. Para si os señalan.",
      "Sexo oral completo en el baño de la discoteca 3 minutos en silencio.",
      "Mastúrbate hasta correrte en {z} mientras {ganador} tapa con su cuerpo.",
      "Riesgo acordado en {z}: folla o frota 90 segundos donde podáis ser vistos desde la pista.",
      "{ganador} te folla en el baño VIP 2 minutos. Palabra de seguridad.",
      "Desnúdate de cintura para arriba 20 segundos en el baño y vuelve a {z}. {ganador} vigila.",
      "Prohibido correrte hasta la siguiente ronda. Si pierdes otra ronda, te corres en la discoteca.",
      "Arrodíllate en el baño y chúpale hasta que acabe o 4 minutos.",
      "Exhibicionismo acordado: en {z}, desnuda parcial 30 segundos sabiendo que hay gente cerca.",
      "En {z}, dedos o polla dentro 90 segundos mientras bailan a vuestro lado — parar si os miran fijo.",
      "Correrte en la mano o boca de {ganador} en el baño de la discoteca.",
      "En {z}, sexo contra la pared 2 minutos en la zona más oscura. Palabra de seguridad.",
      "Follad en el reservado o baño grande 3 minutos si está vacío.",
      "En {z}, flash de coño o tetas 10 segundos antes de volver a la pista.",
      "Riesgo máximo: en {z}, casi desnudos 45 segundos. Ropa lista para taparos.",
      "En la pista, tribbing o frota hasta el borde del orgasmo 2 minutos — no correrte aún.",
      "Si pierdes otra ronda, {ganador} elige dónde acabas en la discoteca.",
      "En {z}, que un desconocido os vea abrazados muy íntimos — reto exhibicionista 1 minuto.",
      "Desnúdate completa 30 segundos en el baño VIP mientras {ganador} hace de lookout.",
      "En {z}, orgasmo con dedos o polla 2 minutos. Silencio y palabra de seguridad.",
    ]);
  }

  // Swinger club
  if (intensity === "suave") {
    return pick([
      "En {z}, presentaos como pareja y abrazad pegando entrepiernas 45 segundos ante otras parejas.",
      "En {z}, susurrale a {ganador} qué pareja del local os pone más cachondos.",
      "Besad con lengua 25 segundos en {z}. Normal en un club liberal.",
      "En {z}, guía la mano de {ganador} sobre tu pecho por encima de la ropa 30 segundos.",
      "Confiesa tres fantasías de swinger: intercambio, voyeur, glory hole acordado…",
      "En {z}, caminad cogidos de la cintura rozando caderas delante de otras parejas.",
      "En el bar del club, brindad rozando labios en el mismo vaso 20 segundos.",
      "En {z}, deja que {ganador} te pellizque el culo cuando pase otra pareja.",
      "Susurrale qué harías en {z} si una pareja os invitara a mirar.",
      "En {z}, abre un poco las piernas en el sofá mientras {ganador} vigila quién mira.",
      "Confiesa si te excitaría que alguien os viera besaros en {z}.",
      "En {z}, frota tu entrepierna contra {ganador} — ropa puesta — 1 minuto sin disimular.",
      "Quítate una prenda interior en el baño del club y dásela a {ganador}.",
      "En {z}, mira fijamente a otra pareja 10 segundos mientras {ganador} te roza el muslo.",
      "En {z}, susurrad qué acto liberal probaríais esta noche si ganáis otra ronda.",
      "Besad en {z} con mano en la cadera del otro — visible para el local.",
      "En {z}, confiesa dónde del club te excitaría que te toquen con gente mirando.",
      "Caminad por {z} con la mano de {ganador} en tu culo por encima del pantalón.",
      "En {z}, abrazad empujando erecciones mientras pasan otras parejas semidesnudas.",
      "En el bar, pedid una copa y contad en voz baja vuestra fantasía swinger favorita.",
    ]);
  }
  if (intensity === "picante") {
    return pick([
      "En {z}, mete la mano de {ganador} bajo tu ropa 90 segundos mientras otras parejas miran de lejos.",
      "En la cabina acordada, besad y tocaos 2 minutos con la cortina entreabierta si os atrevís.",
      "En {z}, masturbad mutuamente 2 minutos bajo toallas o chaquetas.",
      "Flash en {z}: enseña tetas o polla 5 segundos para {ganador} o pareja acordada.",
      "En el jacuzzi, frota tu entrepierna contra {ganador} 2 minutos. Reglas del club siempre.",
      "En {z}, simula chupar a {ganador} — ropa puesta — 45 segundos ante voyeur acordado.",
      "En la sala privada, mano bajo falda o braga 2 minutos. Palabra de seguridad.",
      "Exhibicionismo en {z}: quedad en ropa interior 30 segundos si el club lo permite.",
      "En {z}, deja que otra pareja os mire besaros mientras os tocáis por encima de la ropa 1 minuto — solo si todos consentís.",
      "En el baño del club, sexo oral 90 segundos en silencio.",
      "En {z}, paja o dedos mutuos 2 minutos sabiendo que alguien puede entrar.",
      "En {z}, quitad bragas o bajad pantalones lo justo — 15 segundos — para {ganador}.",
      "En la zona de glory hole acordada, guía a {ganador} o participa 90 segundos según reglas del club.",
      "En {z}, confiesa en voz alta la fantasía swinger más morbosa mientras te toca.",
      "En {z}, tribbing o frota pollas 2 minutos en sofá compartido si el club lo permite.",
      "En el jacuzzi, besad y meted mano bajo el agua 90 segundos.",
      "Exhibicionismo: en {z}, desnudo parcial 20 segundos ante parejas que miren con consentimiento.",
      "En {z}, lamé el cuello o pecho de {ganador} mientras otra pareja observa — solo si todos quieren.",
      "En la sala de parejas, dedos en coño o paja 2 minutos con luz tenue.",
      "En {z}, intercambiad bragas o ropa interior como trofeo hasta final de partida.",
    ]);
  }
  return pick([
    "En {z}, follad o haced oral 3 minutos en sala privada. Reglas y consentimiento del club.",
    "En el jacuzzi, sexo o masturbación mutua hasta correrte 3 minutos. Palabra de seguridad.",
    "Riesgo acordado en {z}: acto completo 90 segundos donde otras parejas puedan ver si todos consentís.",
    "En la cabina, {ganador} te folla o te lame hasta orgasmo 4 minutos.",
    "Mastúrbate hasta correrte en {z} mientras {ganador} y/o pareja acordada miran.",
    "Exhibicionismo en {z}: desnudos 1 minuto si el club lo permite. Volved a cubrir si alguien entra sin consentir.",
    "Prohibido correrte hasta la siguiente ronda. Si pierdes otra ronda, acabas en el swinger club.",
    "En {z}, intercambio suave acordado: besad o tocad a la pareja invitada 2 minutos — solo con consentimiento de los cuatro.",
    "Glory hole o cabina: sexo oral hasta correrte o 4 minutos según reglas del local.",
    "En {z}, orgasmo con dedos, lengua o polla 3 minutos ante voyeur acordado.",
    "Si pierdes otra ronda, {ganador} elige la zona del club donde acabas.",
    "En la piscina o jacuzzi, follad 2 minutos bajo el agua o en el borde. Palabra de seguridad.",
    "En {z}, correrte en boca o mano de {ganador} con otra pareja mirando — solo si todos quieren.",
    "Riesgo máximo en {z}: acto completo visible para parejas seleccionadas 2 minutos.",
    "En sala privada, BDSM suave o azotes acordados 3 minutos.",
    "En {z}, desnudas completas 1 minuto antes de acto principal. Reglas del club.",
    "En {z}, 69 o tribbing hasta orgasmo 3 minutos.",
    "Participad en {z} en juego de parejas acordado con el local — 5 minutos máximo.",
    "En {z}, follad sin ocultaros ante espejo o voyeur consentido 2 minutos.",
    "Noche swinger: {ganador} manda tres actos en {z} antes de volver a casa. Palabra de seguridad siempre.",
  ]);
}

function buildExpansion() {
  const data = loadOutdoorData();
  const generalExtra = {};
  const locationExtra = {};
  const newLocations = {};

  const generalLeaves = countLeaves(data.OUTDOOR_CHALLENGES);
  for (const { path, arr } of generalLeaves) {
    if (arr.length >= MIN) continue;
    const parts = path.split(".");
    appendToPath(generalExtra, parts, extraFor(path, "general", MIN - arr.length));
  }

  for (const loc of Object.keys(data.OUTDOOR_LOCATION_CHALLENGES)) {
    const leaves = countLeaves(data.OUTDOOR_LOCATION_CHALLENGES[loc]);
    const bucket = {};
    for (const { path, arr } of leaves) {
      if (arr.length >= MIN) continue;
      const parts = path.split(".");
      appendToPath(bucket, parts, extraFor(path, loc, MIN - arr.length));
    }
    if (Object.keys(bucket).length) locationExtra[loc] = bucket;
  }

  for (const loc of ["discoteca"]) {
    newLocations[loc] = {};
    for (const intensity of ["suave", "picante", "extremo"]) {
      newLocations[loc][intensity] = {
        hetero: {
          chica: extraFor(`${intensity}.hetero.chica`, loc, MIN),
          chico: extraFor(`${intensity}.hetero.chico`, loc, MIN),
        },
        chico_chico: extraFor(`${intensity}.chico_chico`, loc, MIN),
        chica_chica: extraFor(`${intensity}.chica_chica`, loc, MIN),
      };
    }
  }

  return { generalExtra, locationExtra, newLocations };
}

function emit() {
  const { generalExtra, locationExtra, newLocations } = buildExpansion();
  const metaExtra = {
    discoteca: { id: "discoteca", name: "Discoteca", icon: "🪩", desc: "Pista, barra, baño, VIP" },
    swinger: { id: "swinger", name: "Swinger Club", icon: "🔥", desc: "Local liberal, parejas, zonas" },
  };

  const file = `// Expansión automática de retos al aire libre (mínimo ${MIN} por categoría)
// Generado por generate-outdoor-expansion.mjs — no editar a mano

const OUTDOOR_GENERAL_EXTRA = ${JSON.stringify(generalExtra, null, 2)};

const OUTDOOR_LOCATION_EXTRA = ${JSON.stringify(locationExtra, null, 2)};

const OUTDOOR_NEW_LOCATIONS = ${JSON.stringify(newLocations, null, 2)};

const OUTDOOR_LOCATION_META_EXTRA = ${JSON.stringify(metaExtra, null, 2)};

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

(function applyOutdoorExpansion() {
  if (typeof OUTDOOR_CHALLENGES !== "undefined") {
    mergeOutdoorChallengeTrees(OUTDOOR_CHALLENGES, OUTDOOR_GENERAL_EXTRA);
  }
  if (typeof OUTDOOR_LOCATION_CHALLENGES !== "undefined") {
    mergeOutdoorChallengeTrees(OUTDOOR_LOCATION_CHALLENGES, OUTDOOR_LOCATION_EXTRA);
    for (const loc of Object.keys(OUTDOOR_NEW_LOCATIONS)) {
      OUTDOOR_LOCATION_CHALLENGES[loc] = OUTDOOR_NEW_LOCATIONS[loc];
    }
  }
  if (typeof OUTDOOR_LOCATION_META !== "undefined") {
    Object.assign(OUTDOOR_LOCATION_META, OUTDOOR_LOCATION_META_EXTRA);
  }
})();
`;

  fs.writeFileSync(`${ROOT}/outdoor-expansion.js`, file, "utf8");
  console.log("Written outdoor-expansion.js");
}

emit();
