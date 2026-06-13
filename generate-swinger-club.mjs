import fs from "fs";

const COUNT = 40;
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

function buildSwingerChallenges() {
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
      const list = generateList(intensity, orient, role);
      setPath(tree[intensity], key, list.slice(0, COUNT));
    }
  }
  return tree;
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

function generateList(intensity, orient, role) {
  const banks = getBanks(intensity, orient, role);
  const out = [];
  let i = 0;
  while (out.length < COUNT) {
    for (const bank of banks) {
      if (out.length >= COUNT) break;
      const text = bank[i % bank.length].replace(/\{z\}/g, pickZone(out.length));
      if (!out.includes(text)) out.push(text);
    }
    i++;
  }
  return out;
}

function getBanks(intensity, orient, role) {
  const isChica = role === "chica" || orient === "chica_chica";
  const isChico = role === "chico" || orient === "chico_chico";
  const isHetero = orient === "hetero";

  const consent = " Solo con consentimiento explícito de todos y palabra de seguridad.";
  const ganadorOk = " {ganador} debe estar de acuerdo antes de empezar.";

  // --- PAREJAS ---
  const parejaSuave = [
    `En {z}, elegid una pareja del club y presentaos. Besad a {ganador} 20 segundos delante de ellos mientras os miran.`,
    `Susurrale a {ganador} qué pareja te pone más cachonda del local y señálala discretamente.`,
    `Invitad con una mirada a otra pareja a sentarse cerca en {z}. Coqueteáis los cuatro con conversación morbosa 2 minutos.`,
    `En {z}, deja que otra pareja os mire abrazados mientras {ganador} te roza la cintura 45 segundos.`,
    `Propón a {ganador} un brindis con otra pareja en el bar: contad cada uno una fantasía liberal sin filtros.`,
    `En {z}, caminad de la mano con otra pareja acordada y deja que el otro chico o chica te pellizque el hombro al pasar — solo si los cuatro queréis.`,
    `Elegid pareja objetivo en {z}: mirad fijamente 10 segundos mientras os besáis. {ganador} vigila si hay rechazo.`,
    `Confiesa a {ganador} y a una pareja invitada qué harías en un intercambio suave esta noche.`,
    `En {z}, sentaos en sofá compartido con otra pareja: piernas rozándose sin disimular 1 minuto si todos consentís.`,
    `Dejad que otra pareja os observe bailar lento pegados en {z} 1 minuto.`,
  ];

  const parejaPicante = [
    `Intercambio suave en {z}: besad a la pareja invitada — un beso cada uno — mientras {ganador} mira.${consent}`,
    `En {z}, deja que la otra chica te toque el muslo por encima de la ropa 60 segundos. {ganador} da permiso con la mirada.${consent}`,
    `En {z}, la otra pareja os mira mientras os masturbáis mutuamente por encima de la ropa 2 minutos.${consent}`,
    `Intercambio de caricias: en {z}, {ganador} toca a la otra chica y tú al otro chico — solo pecho o muslo — 90 segundos.${consent}`,
    `En cabina compartida acordada, besad y tocaos los cuatro en parejas cruzadas 2 minutos.${consent}`,
    `En {z}, arrodíllate y simula chupar al otro chico — ropa puesta, roleplay — 30 segundos si los cuatro están de acuerdo.${ganadorOk}`,
    `En {z}, deja que la pareja invitada os grabe solo el audio de vuestros gemidos 45 segundos — sin caras si no queréis.${consent}`,
    `En el jacuzzi con otra pareja: mano bajo el agua en muslo interno cruzado 2 minutos.${consent}`,
    `En {z}, intercambiad ropa interior con la otra pareja como trofeo hasta final de partida.${consent}`,
    `Soft swap en {z}: 69 o paja entre parejas cruzadas mirando al otro 2 minutos.${consent}`,
  ];

  const parejaExtremo = [
    `Full swap acordado en {z}: folla o deja que te folle el otro chico 3 minutos mientras {ganador} está con la otra chica.${consent}`,
    `En {z}, cómele el coño a la otra chica o chúpale la polla al otro chico — lo que elijáis los cuatro — hasta 4 minutos.${consent}`,
    `En sala privada, orgía suave: intercambio oral entre los cuatro 5 minutos.${consent}`,
    `En {z}, {ganador} te folla mientras la otra pareja mira y se masturba. Luego invertid roles 3 minutos cada uno.${consent}`,
    `Riesgo acordado en {z}: sexo completo con la pareja invitada en la misma habitación, parejas cruzadas.${consent}`,
    `En {z}, correrte en boca del otro chico o de la otra chica — solo si los cuatro lo quieren.${consent}`,
    `Doble penetración o triple juego acordado en {z} con pareja invitada y {ganador}. Palabra de seguridad siempre.${consent}`,
    `En {z}, grabación consensuada del acto con otra pareja — solo manos y cuerpos si preferís.${consent}`,
    `Noche swinger: {ganador} elige pareja del club y cumples tres actos con ellos en {z}.${consent}`,
    `En {z}, intercambio completo hasta orgasmo — los cuatro — sin parar hasta que {ganador} diga basta.${consent}`,
  ];

  // --- CHICO SOLO ---
  const soloChicoSuave = isChica || isChica
    ? [
        `En el bar, señala con {ganador} a un chico solo que os guste. Invítalo con la mirada a acercarse y presentaos.`,
        `En {z}, baila 1 minuto con un chico solo del club mientras {ganador} mira desde el sofá.`,
        `Susurrale al oído a un chico solo invitado — con permiso de {ganador} — qué te excitaría que hiciera esta noche.`,
        `En {z}, deja que un chico solo os observe besaros 30 segundos. Él no toca sin permiso.`,
        `Confiesa a {ganador} y a un chico solo qué fantasía tienes con un extra en el club.`,
        `En {z}, brinda con un chico solo y deja que te roce la mano al pasar la copa — solo si quieres.`,
        `Pide a {ganador} permiso para sentarte entre él y un chico solo en {z} — muslos rozándose 45 segundos.`,
        `En {z}, mira fijamente a un chico solo mientras {ganador} te pellizca el culo. Coqueteo a distancia.`,
        `Invita a un chico solo a contar su fantasía en voz baja mientras vosotros escucháis en {z}.`,
        `En {z}, deja que un chico solo te abra la puerta de la cabina y os mire entrar — voyeur acordado.`,
      ]
    : [
        `En el bar, elegid con {ganador} a un chico solo atractivo. Presentaos y hablad de reglas del club 2 minutos.`,
        `En {z}, abrazad a un chico solo invitado entre vosotros — tres cuerpos pegados 45 segundos si él quiere.`,
        `Susurrad al oído de un chico solo qué haríais con él esta noche — con permiso de {ganador}.`,
        `En {z}, dejad que un chico solo os mire mientras os besáis o frotais pollas — ropa puesta.`,
        `Confesad al chico solo invitado vuestra fantasía de trío en {z}.`,
        `En {z}, paja mutua vuestra mientras un chico solo mira sin tocarse — voyeur acordado.`,
        `Invitad a un chico solo a sentarse en {z} y contar qué busca en el club mientras os tocáis el muslo.`,
        `En {z}, frota tu polla contra la de un chico solo — ropa puesta — 30 segundos si los tres consentís.`,
        `Dejad que un chico solo os guíe a {z} como anfitrión del local — mano en cintura al caminar.`,
        `En {z}, besad a {ganador} delante de un chico solo invitado mientras él elige si mirar o unirse después.`,
      ];

  const soloChicoPicante = isChica || orient === "chica_chica"
    ? [
        `En {z}, masturbad al chico solo invitado 2 minutos mientras {ganador} mira — solo si él quiere.${consent}`,
        `Chupa la polla del chico solo invitado 90 segundos en cabina. {ganador} vigila la puerta.${consent}`,
        `En {z}, el chico solo te toca el coño por encima de la ropa mientras besas a {ganador}.${consent}`,
        `Trío oral en {z}: tú chupas al invitado, {ganador} te lame — o al revés — 2 minutos.${consent}`,
        `En el jacuzzi, sentada entre {ganador} y el chico solo: manos bajo el agua en tus muslos 2 minutos.${consent}`,
        `En {z}, deja que el chico solo te haga una paja mientras {ganador} te besa el cuello.${consent}`,
        `Glory hole con chico solo al otro lado — chupa o frota 90 segundos si el club lo tiene.${consent}`,
        `En {z}, monta al chico solo invitado — ropa apartada — 2 minutos mientras {ganador} mira.${consent}`,
        `Intercambio: {ganador} te comparte con el chico solo en {z} — tocar y gemir 2 minutos.${consent}`,
        `En {z}, correrte en la mano del chico solo mientras {ganador} susurra órdenes.${consent}`,
      ]
    : [
        `En {z}, chúpale la polla al chico solo invitado 2 minutos mientras {ganador} mira.${consent}`,
        `Trío en {z}: {ganador} y el chico solo te masturban o te follan por turnos 3 minutos.${consent}`,
        `En {z}, frota tu polla contra la del chico solo mientras {ganador} os guía.${consent}`,
        `El chico solo te hace una paja en {z} mientras besas a {ganador} — 2 minutos.${consent}`,
        `En cabina, 69 con chico solo invitado 2 minutos. {ganador} espera fuera o mira.${consent}`,
        `En {z}, deja que el chico solo te folle por detrás mientras chupas a {ganador}.${consent}`,
        `Glory hole: chupa o mete la polla 90 segundos con chico solo al otro lado.${consent}`,
        `En {z}, masturbad mutuamente tú y el chico solo mientras {ganador} graba solo audio.${consent}`,
        `En el jacuzzi, paja mutua con chico solo bajo el agua 2 minutos.${consent}`,
        `En {z}, acaba en boca del chico solo o de {ganador} — ellos eligen.${consent}`,
      ];

  const soloChicoExtremo = isChica || orient === "chica_chica"
    ? [
        `En {z}, follad tú y el chico solo mientras {ganador} mira — o se une — 4 minutos.${consent}`,
        `Doble: {ganador} y chico solo te follan por turnos en {z} hasta que digas basta.${consent}`,
        `En {z}, trío completo con chico solo invitado — oral, penetración, lo acordéis — 5 minutos.${consent}`,
        `Correrte con la polla del chico solo dentro mientras {ganador} te agarra del pelo.${consent}`,
        `En {z}, gangbang suave: dos chicos solos invitados — solo oral alternado — 4 minutos.${consent}`,
        `En sala privada, {ganador} te presta al chico solo 3 minutos de sexo completo.${consent}`,
        `En {z}, creampie o acabar en el chico solo — fantasy roleplay — lo acordáis antes.${consent}`,
        `Riesgo máximo en {z}: sexo con chico solo en zona semi-pública del club.${consent}`,
        `Si pierdes otra ronda, {ganador} elige chico solo del bar para tu próximo reto.${consent}`,
        `En {z}, noche entera con chico solo invitado — primer acto ahora, 4 minutos.${consent}`,
      ]
    : [
        `En {z}, folla al chico solo invitado 4 minutos mientras {ganador} mira o participa.${consent}`,
        `Trío anal o vaginal acordado en {z} con chico solo — roles que elijáis.${consent}`,
        `En {z}, {ganador} te comparte: chico solo te chupa hasta correrte.${consent}`,
        `Doble penetración con {ganador} y chico solo en {z} — solo si los tres quieren.${consent}`,
        `En {z}, dos chicos solos — paja cruzada y oral alternado — 4 minutos.${consent}`,
        `Correrte en el culo o boca del chico solo en {z} con {ganador} presente.${consent}`,
        `En sala privada, orgía con chicos solos invitados — mínimo dos — 5 minutos.${consent}`,
        `En {z}, {ganador} te ordena servir al chico solo hasta que acabe.${consent}`,
        `Prohibido correrte hasta la siguiente ronda. Si pierdes, acabas con chico solo que elija {ganador}.${consent}`,
        `En {z}, sexo crudo con chico solo en espejo para voyeur del club.${consent}`,
      ];

  // --- CHICA SOLA ---
  const soloChicaSuave = isChico || orient === "chico_chico"
    ? [
        `En el bar, señala con {ganador} a una chica sola. Invítala a {z} y presentaos con respeto.`,
        `En {z}, baila 1 minuto con una chica sola mientras {ganador} observa.`,
        `Susurrale a una chica sola invitada qué te excitaría hacer con ella — permiso de {ganador}.`,
        `En {z}, deja que una chica sola os mire besaros o abrazaros 30 segundos.`,
        `Confiesa a {ganador} y a la chica sola tu fantasía de trío con otra mujer.`,
        `En {z}, brinda con chica sola y deja que te toque el brazo o la cintura al pasar.`,
        `Pide permiso a {ganador} para sentarte entre dos chicas — ella y tú — muslos rozándose.`,
        `En {z}, coqueteo a tres bandas: miradas con chica sola mientras abrazas a {ganador}.`,
        `Invita a chica sola a contar en {z} qué busca en el club mientras escucháis.`,
        `En {z}, deja que chica sola os abra la cabina y os mire entrar — voyeur acordado.`,
      ]
    : [
        `En el bar, elegid con {ganador} a una chica sola. Coqueteo las tres en conversación 2 minutos.`,
        `En {z}, abrazad a la chica sola invitada entre vosotras — tres cuerpos 45 segundos.`,
        `Susurrad a la chica sola qué haríais con ella en {z} — permiso de {ganador}.`,
        `En {z}, dejad que chica sola os mire besándoos o en tribbing — ropa puesta.`,
        `Confesad vuestra fantasía lésbica con chica sola invitada.`,
        `En {z}, tocad mutuamente mientras chica sola mira sin tocarse.`,
        `Invitad a chica sola a {z}: mano en muslo cruzado 1 minuto si ella quiere.`,
        `En {z}, frota tu coño contra el muslo de la chica sola — ropa puesta — 30 segundos.`,
        `Besad a {ganador} delante de chica sola invitada — ella decide si acercarse.`,
        `En {z}, las tres contáis fantasía sin censura sentadas en sofá.`,
      ];

  const soloChicaPicante = isChico || orient === "chico_chico"
    ? [
        `En {z}, lame el coño de la chica sola invitada 90 segundos mientras {ganador} mira.${consent}`,
        `Trío: tú con la chica sola, {ganador} observa o se une — tocar 2 minutos.${consent}`,
        `En {z}, la chica sola te masturba mientras besas a {ganador}.${consent}`,
        `En cabina, chica sola chupa tu polla 2 minutos. {ganador} vigila.${consent}`,
        `En jacuzzi, manos bajo el agua: tú, {ganador} y chica sola — 2 minutos.${consent}`,
        `En {z}, folla a la chica sola invitada mientras {ganador} la besa.${consent}`,
        `Intercambio: {ganador} con chica sola, tú mirando — luego cambiáis 2 minutos.${consent}`,
        `En {z}, paja de la chica sola a {ganador} mientras tú la tocas.${consent}`,
        `Glory hole con chica sola — dedos o lengua 90 segundos si hay.${consent}`,
        `En {z}, acaba en mano de chica sola o {ganador} — ellas eligen.${consent}`,
      ]
    : [
        `En {z}, lame el coño de la chica sola 2 minutos mientras {ganador} mira.${consent}`,
        `Trío lésbico suave en {z}: tú, {ganador} y chica sola — dedos y besos 3 minutos.${consent}`,
        `En {z}, tribbing con chica sola mientras {ganador} os guía.${consent}`,
        `Chica sola te mete dedos en {z} mientras besas a {ganador}.${consent}`,
        `En cabina, 69 con chica sola 2 minutos. {ganador} espera o participa.${consent}`,
        `En {z}, las tres os tozáis mutuamente 2 minutos.${consent}`,
        `Intercambio: {ganador} con chica sola oral, tú mirando — luego cambio.${consent}`,
        `En jacuzzi, dedos cruzados entre las tres 2 minutos.${consent}`,
        `En {z}, correrte en boca de chica sola o {ganador}.${consent}`,
        `Soft swap: besad y tocad a la chica sola por turnos 2 minutos.${consent}`,
      ];

  const soloChicaExtremo = isChico || orient === "chico_chico"
    ? [
        `En {z}, folla a la chica sola 4 minutos mientras {ganador} participa o mira.${consent}`,
        `Trío completo con chica sola en {z} — roles acordados — 5 minutos.${consent}`,
        `En {z}, {ganador} y chica sola te comparten — oral alternado hasta correrte.${consent}`,
        `Doble con {ganador} y chica sola — penetración y oral — 4 minutos.${consent}`,
        `En {z}, dos chicas solas invitadas — servicio oral alternado — 4 minutos.${consent}`,
        `Correrte dentro o sobre la chica sola con {ganador} presente.${consent}`,
        `En sala privada, orgía con chicas solas — mínimo dos — 5 minutos.${consent}`,
        `En {z}, {ganador} te presta a chica sola 3 minutos sexo completo.${consent}`,
        `Si pierdes otra ronda, chica sola que elija {ganador} para tu castigo.${consent}`,
        `En {z}, gangbang suave con chicas solas — solo oral — 4 minutos.${consent}`,
      ]
    : [
        `En {z}, follad tú y chica sola con strap o dedos — {ganador} mira 4 minutos.${consent}`,
        `Trío lésbico completo: tú, {ganador}, chica sola — orgasmo 5 minutos.${consent}`,
        `En {z}, {ganador} te comparte con chica sola — sexo completo 3 minutos.${consent}`,
        `En {z}, dos chicas solas — tribbing y dedos alternados — 4 minutos.${consent}`,
        `Correrte con chica sola mientras {ganador} te ordena.${consent}`,
        `En sala privada, orgía de chicas con {ganador} de voyeur — 5 minutos.${consent}`,
        `En {z}, strap o dedos profundos con chica sola hasta orgasmo.${consent}`,
        `Riesgo en {z}: sexo con chica sola en zona visible del club.${consent}`,
        `Prohibido correrte. Si pierdes, chica sola que elija {ganador} te hace acabar.${consent}`,
        `En {z}, noche con chica sola invitada — primer acto 4 minutos ahora.${consent}`,
      ];

  // --- GRUPO / VOYEUR ---
  const grupoSuave = [
    `En {z}, quedaos en círculo con otras dos parejas: presentaciones y una fantasía cada uno.`,
    `En {z}, dejad que un pequeño grupo os mire bailar pegados 1 minuto.`,
    `Participad en juego del club — verdad o reto suave — con desconocidos en {z}.`,
    `En {z}, contad en voz alta qué tipo de tercero os excita: chico solo, chica sola o pareja.`,
    `En barra, hablad con grupo mixto sobre reglas y límites del local 3 minutos.`,
    `En {z}, brindad con tres desconocidos y coqueteo con la mirada.`,
    `Dejad que grupo en {z} os vote la pareja más sexy — vosotros incluidos.`,
    `En {z}, voyeur: mirad a otra pareja follar o tocarse 1 minuto sin tocaros.`,
    `En {z}, exhibicionista: besad intensamente sabiendo que hay grupo mirando.`,
    `Organizad con {ganador} mini-círculo en {z}: cada uno dice un límite y un deseo.`,
  ];

  const grupoPicante = [
    `En {z}, grupo de cuatro parejas: intercambio de pareja una vez — besos y manos 2 minutos.${consent}`,
    `En {z}, dejad que grupo os mire masturbaros mutuamente 2 minutos.${consent}`,
    `Participad en zona de juegos del club con desconocidos — reglas del local.${consent}`,
    `En {z}, roulette: {ganador} elige desconocido al azar para un beso o caricia.${consent}`,
    `En {z}, orgía suave: tocar a quien consentís en círculo 3 minutos.${consent}`,
    `En {z}, chico y chica solos invitados os observan mientras os folláis — voyeur.${consent}`,
    `En jacuzzi grupal: manos bajo el agua cruzadas 2 minutos.${consent}`,
    `En {z}, intercambio de pareja con grupo seleccionado — oral 2 minutos.${consent}`,
    `En {z}, desconocido elige reto suave para ti — {ganador} puede vetar.${consent}`,
    `Grabación grupal consensuada — solo cuerpos en {z} 45 segundos.${consent}`,
  ];

  const grupoExtremo = [
    `En {z}, orgía acordada con grupo del club — mínimo 4 personas — 5 minutos.${consent}`,
    `En {z}, gangbang consensuado: tú centro, {ganador} organiza turnos 4 minutos.${consent}`,
    `En {z}, intercambio total de parejas en sala privada 5 minutos.${consent}`,
    `En {z}, todos los presentes acordados pueden tocarte — límite de tiempo 3 minutos.${consent}`,
    `En {z}, sexo en público liberal del club ante grupo voyeur 2 minutos.${consent}`,
    `En {z}, {ganador} te presta al grupo seleccionado 4 minutos.${consent}`,
    `En {z}, bukkake o corrida grupal consensuada — reglas claras antes.${consent}`,
    `En {z}, orgía mixta: chicos solos, chicas solas y parejas — 5 minutos.${consent}`,
    `Si pierdes otra ronda, {ganador} elige grupo o solitario para tu castigo final.${consent}`,
    `En {z}, noche de club: tres actos con terceros distintos — empieza ahora 4 min.${consent}`,
  ];

  // Role tweaks for hetero chico (loser is male)
  function tweakForRole(arr) {
    if (role === "chico" && isHetero) {
      return arr.map((t) =>
        t
          .replace(/monta al chico solo/gi, "deja que el chico solo te monte")
          .replace(/Chupa la polla/gi, "Deja que te chupen la polla")
          .replace(/cómele el coño a la chica sola/gi, "cómele el coño a la chica sola")
          .replace(/masturbad al chico solo/gi, "deja que el chico solo te masturbe")
      );
    }
    if (orient === "chico_chico") {
      return arr.map((t) =>
        t
          .replace(/chica sola/gi, "chico solo")
          .replace(/coño/gi, "polla")
          .replace(/tetas/gi, "torso")
      );
    }
    if (orient === "chica_chica") {
      return arr.map((t) =>
        t
          .replace(/chico solo/gi, "chica sola")
          .replace(/polla/gi, "coño")
          .replace(/paja/gi, "dedos")
      );
    }
    return arr;
  }

  const map = {
    suave: [parejaSuave, soloChicoSuave, soloChicaSuave, grupoSuave],
    picante: [parejaPicante, soloChicoPicante, soloChicaPicante, grupoPicante],
    extremo: [parejaExtremo, soloChicoExtremo, soloChicaExtremo, grupoExtremo],
  };

  return map[intensity].map(tweakForRole);
}

const tree = buildSwingerChallenges();

const output = `// Retos Swinger Club — interacción con parejas, chicos solas y chicas solas
// Generado por generate-swinger-club.mjs (${COUNT} retos por categoría)

const SWINGER_CLUB_CHALLENGES = ${JSON.stringify(tree, null, 2)};

(function applySwingerClubChallenges() {
  if (typeof OUTDOOR_LOCATION_CHALLENGES === "undefined") return;
  OUTDOOR_LOCATION_CHALLENGES.swinger = SWINGER_CLUB_CHALLENGES;
  if (typeof OUTDOOR_LOCATION_META !== "undefined" && OUTDOOR_LOCATION_META.swinger) {
    OUTDOOR_LOCATION_META.swinger.desc = "Parejas, solos, intercambio y voyeur";
  }
})();
`;

fs.writeFileSync(new URL("./swinger-club-challenges.js", import.meta.url), output, "utf8");
console.log("Written swinger-club-challenges.js with", COUNT, "challenges per category");
