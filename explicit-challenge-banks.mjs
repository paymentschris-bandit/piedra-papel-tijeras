/**
 * Banco de retos explícitos v4 — 200 por bucket (100 picante + 100 extremo).
 * Stems curados + variantes por lugar.
 */
import { classifyChallenge, incompatibleReason } from "./challenge-classify.mjs";
import {
  ULTRA_HETERO_CHICA_PICANTE,
  ULTRA_HETERO_CHICA_EXTREMO,
  ULTRA_HETERO_CHICO_PICANTE,
  ULTRA_HETERO_CHICO_EXTREMO,
  ULTRA_CHICO_CHICO_PICANTE,
  ULTRA_CHICO_CHICO_EXTREMO,
  ULTRA_CHICA_CHICA_PICANTE,
  ULTRA_CHICA_CHICA_EXTREMO,
} from "./explicit-challenge-banks-ultra.mjs";

const PLACES_BY_MODE = {
  home: ["en la cama", "en el sofá", "contra la pared", "en la ducha", "en la cocina", "en el suelo"],
  remote: [
    "frente a la webcam",
    "en primer plano para la cámara",
    "de perfil en cámara",
    "arrodillado frente al móvil",
    "sentado en la silla frente al PC",
    "de pie frente al trípode",
  ],
  outdoor: ["en el coche", "en el parque", "en la playa", "en el parking", "en el cine", "al aire libre"],
};

const G = "{ganador}";

function normChallenge(text) {
  return text.toLowerCase().replace(/\{ganador\}/g, "G").replace(/\s+/g, " ").trim();
}

function insertPlace(stem, place) {
  if (stem.includes("{lugar}")) return stem.replace(/\{lugar\}/g, place);
  const idx = stem.indexOf(G);
  if (idx >= 0) return stem.replace(G, `${G} ${place}`);
  return `${place.charAt(0).toUpperCase() + place.slice(1)}: ${stem}`;
}

function expandStems(stems, mode) {
  const places = PLACES_BY_MODE[mode] || PLACES_BY_MODE.home;
  const seen = new Set();
  const out = [];
  for (const stem of stems) {
    for (const place of places) {
      const text = insertPlace(stem, place);
      const key = normChallenge(text);
      if (!seen.has(key)) {
        seen.add(key);
        out.push(text);
      }
    }
  }
  return out;
}

function validateExplicitChallenge(text, bucket) {
  const reason = incompatibleReason(text, bucket);
  if (reason) return { valid: false, reason };
  const classified = classifyChallenge(text, bucket, false);
  if (classified === bucket) return { valid: true };
  return { valid: false, reason: `clasificado como ${classified}` };
}

export { validateExplicitChallenge };

// ─── HETERO · CHICA (ella pierde, él gana) ───────────────────────────────────

const HETERO_CHICA_PICANTE = [
    "Arrodíllate {lugar} y abre la boca: {ganador} te folla la garganta con su polla hasta dejarla empapada de saliva — 2 minutos.",
    "A cuatro patas {lugar}: {ganador} te mete la polla entera de una vez y te agarra del pelo — follad 2 minutos sin piedad.",
    "Túmbate {lugar} con las piernas bien abiertas: {ganador} te clava dos dedos en el coño mientras te masturba el clítoris con el pulgar — 2 minutos.",
    "Monta a {ganador} {lugar} y baja hasta tragarte su polla entera — sube y baja gimiendo sin parar 90 segundos.",
    "Ponte boca abajo {lugar}: {ganador} te separa las nalgas y te lame el culo y el coño alternando — 2 minutos.",
    "Chupa la polla de {ganador} {lugar} hasta que te duela la mandíbula — él te agarra de la nuca y marca el ritmo.",
    "Quítate braga y sujetador {lugar}. {ganador} te ordena frotarte el clítoris mientras le cuentas en voz alta lo mojada que estás — 2 minutos.",
    "Pide a {ganador} que te azote el culo {lugar} seis veces fuerte antes de meterte la polla — cuenta en voz alta cada golpe.",
    "Siéntate en el borde {lugar}: {ganador} te abre las piernas y te mete la lengua en el coño hasta que tiembles — 2 minutos.",
    "Ponte de rodillas {lugar} y lame los huevos de {ganador} mientras te masturbas — no pares hasta que él lo ordene.",
    "Frota tu coño mojado contra la polla de {ganador} {lugar} — braga apartada — 90 segundos sin penetrar.",
    "Pide a {ganador} que te grabe solo audio gimiendo mientras te mete dedos profundos {lugar} — 90 segundos.",
    "Túmbate {lugar}: {ganador} te pone un dedo en el culo y otro en el coño — mueve la cadera al ritmo que él marque 2 minutos.",
    "Arrodíllate {lugar} y pide permiso para chupar: {ganador} te dice cuándo parar — obedece sin negociar 2 minutos.",
    "Ponte a cuatro {lugar}: {ganador} te folla el coño por detrás mientras te tira del pelo — 2 minutos.",
    "Confiesa en voz alta {lugar} en qué agujero quieres que acabe {ganador} y demuéstralo abriéndote las piernas.",
    "Chupa la polla de {ganador} {lugar} hasta sacarle la primera gota de precum — párala y repite tres veces.",
    "Monta su cara {lugar} si ambos queréis: frota tu coño mojado contra su boca 90 segundos — tú controlas.",
    "Pide a {ganador} que te ate las muñecas {lugar} y te meta dedos hasta el fondo del coño — 2 minutos sin correrte.",
    "Descríbele paso a paso {lugar} cómo te masturbas mientras lo haces frente a él — 90 segundos sin censura.",
    "Ponte de espaldas {lugar} con las rodillas pegadas al pecho: {ganador} te folla profundo y te mira a los ojos — 2 minutos.",
    "Lame la polla de {ganador} {lugar} desde la base hasta la punta — lento — y termina chupando solo la cabeza 60 segundos.",
    "Pide seis nalgadas {lugar}. Después {ganador} elige: polla en coño, boca o entre tus pechos.",
    "Siéntate en su regazo {lugar} y guía su polla dentro de tu coño — sube y baja sin prisa 90 segundos.",
    "Pide a {ganador} que te susurre al oído {lugar} lo zorra que estás mientras te mete dos dedos en el coño.",
    "Túmbate boca arriba {lugar}: {ganador} te masturba el clítoris con la punta de su polla — 90 segundos.",
    "Arrodíllate {lugar} y abre la boca: {ganador} te folla la garganta hasta que lacrimen tus ojos — 90 segundos.",
    "Ponte a cuatro {lugar}: {ganador} te mete la polla en el coño y te azota el culo al mismo tiempo — 2 minutos.",
    "Pide a {ganador} {lugar} que te diga en voz alta lo sucia que eres mientras te lame el clítoris.",
    "Quítate la ropa de abajo {lugar} y mastúrbate frente a {ganador} — él no puede tocarte, solo mirar — 90 segundos.",
    "Ponte de rodillas {lugar} y chupa la polla de {ganador} mientras te metes un dedo en el coño — 2 minutos.",
    "Pide a {ganador} {lugar} que te corra la braga hacia un lado y te meta la polla de golpe — aguanta 60 segundos.",
    "Túmbate {lugar}: {ganador} frota su polla contra tu clítoris hasta que supliques que te la meta — 90 segundos.",
    "Confiesa {lugar} tu fantasía más guarra con {ganador} y obedece la primera orden que te dé.",
];

const HETERO_CHICA_EXTREMO = [
    "Desnúdate entera {lugar}. {ganador} te folla el coño sin piedad hasta correrte o 4 minutos — lo que antes.",
    "Chupa la polla de {ganador} {lugar} hasta que acabe en tu boca — traga todo sin escupir.",
    "A cuatro patas {lugar}: {ganador} te folla el culo con lubricante si lo acordáis — 3 minutos al ritmo que él elija.",
    "Monta a {ganador} {lugar} y follad hasta que os corráis — él no puede parar hasta que tú te corras primero.",
    "Mastúrbate {lugar} hasta correrte gritando el nombre de {ganador} — él te graba solo audio si queréis.",
    "Prohibido correrte {lugar} hasta la siguiente ronda. {ganador} te mete dedos y para cuando estés al borde — x3.",
    "{ganador} te ata muñecas y tobillos {lugar} — suave — y te folla la boca 3 minutos sin piedad.",
    "Pide diez azotes fuertes {lugar}. Después {ganador} elige: correrte en su boca, pecho o dentro del coño.",
    "Correrte donde {ganador} decida {lugar}: boca, tetas, coño o culo — él elige al instante.",
    "Roleplay: eres la puta de {ganador} 3 minutos {lugar}. Obedece sin negociar. Palabra de seguridad activa.",
    "Facesitting 2 minutos {lugar}: frota tu coño mojado en su cara hasta que supliques correrte.",
    "Follad {lugar} 4 minutos. {ganador} cambia de agujero cuando quiera — coño, boca o culo si lo acordáis.",
    "Edging x3 {lugar}: {ganador} te masturba hasta el borde y para. A la tercera, solo acabas si suplicas como zorra.",
    "Pide a {ganador} {lugar} que te folle por detrás mientras te estruja un pecho — 3 minutos sin parar.",
    "Chupa hasta sacarle la primera corrida {lugar} — para, lame, repite tres veces antes de que acabe del todo.",
    "Pide maratón {lugar}: dos orgasmos seguidos cuando {ganador} mande — sin descanso entre medias.",
    "Desnúdate {lugar} y quédate desnuda el resto de la partida. {ganador} te toca cuando quiera.",
    "Pide doble penetración {lugar} con juguete en el culo y polla de {ganador} en el coño — 3 minutos si lo acordáis.",
    "Aguanta 5 minutos {lugar} de oral sin correrte — {ganador} decide cuándo puedes acabar.",
    "Pide a {ganador} {lugar} que te folle mirándote fijamente a los ojos — 3 minutos sin apartar la vista.",
    "Correrte en la boca de {ganador} {lugar} y abre la boca para que vea — traga delante de él.",
    "Pide ser usada {lugar} como quiera {ganador} 3 minutos — palabra de seguridad siempre activa.",
    "Follad {lugar} en la posición más expuesta que {ganador} elija — mínimo 3 minutos.",
    "Pide a {ganador} {lugar} que te azote mientras te folla el coño — diez golpes, ritmo suyo.",
    "Mastúrbate {lugar} con la polla de {ganador} como guía — frota tu clítoris contra ella 2 minutos.",
    "Pide correrte {lugar} en su pecho mientras {ganador} te mete tres dedos en el coño.",
    "Prohibido hablar {lugar}: solo gemidos mientras {ganador} te folla el coño 3 minutos.",
    "Pide a {ganador} {lugar} que te grabe gimiendo mientras te folla — solo audio si preferís.",
    "Aguanta 4 minutos {lugar} a cuatro mientras {ganador} te folla el culo — palabra de seguridad.",
    "Pide maratón oral {lugar}: chupa hasta que {ganador} acabe dos veces — 6 minutos máximo.",
    "Correrte gritando {lugar} lo profundo que te folla {ganador} — él mete hasta el fondo.",
    "Pide atadura completa {lugar} y obedece oral 3 minutos — {ganador} agarra tu cabeza.",
    "Follad {lugar} hasta que ambos estéis al borde — no corráis hasta que {ganador} cuente hasta tres.",
    "Pide a {ganador} {lugar} que elija entre anal, oral o vaginal — obedece sin quejarte.",
    "Desnúdate {lugar} y ponte en posición de espera hasta que {ganador} te ordene abrir las piernas.",
];

const HETERO_CHICO_PICANTE = [
    "Arrodíllate {lugar} y lame el coño de {ganador} — ella te agarra del pelo y marca el ritmo 2 minutos.",
    "Saca la polla {lugar} y deja que {ganador} te masturbe con la mano — ella elige velocidad 90 segundos.",
    "Mete dos dedos en el coño de {ganador} {lugar} mientras le chupas un pezón — 2 minutos.",
    "Frota tu polla contra su coño {lugar} — braga apartada — 90 segundos sin penetrar.",
    "Ponte de pie {lugar}: {ganador} se arrodilla y chupa tu polla hasta la base — 90 segundos.",
    "Túmbate {lugar}: {ganador} monta tu cara y frota su coño mojado contra tu boca — 90 segundos si ambos queréis.",
    "Guía la mano de {ganador} {lugar} sobre tu polla y muéstrale tu ritmo favorito — 90 segundos.",
    "Lame el clítoris de {ganador} {lugar} hasta que gima tu nombre — 2 minutos sin parar.",
    "Pide a {ganador} {lugar} que te azote el culo seis veces antes de chuparte la polla.",
    "Ponte a cuatro {lugar}: {ganador} te mete dedos en el culo mientras te masturba — 2 minutos si lo acordáis.",
    "Chupa los pezones de {ganador} {lugar} alternando mientras te masturbas — 90 segundos.",
    "Confiesa {lugar} dónde quieres correrte con {ganador} — boca, coño o tetas — y demuéstralo con gestos.",
    "Pide a {ganador} {lugar} que te susurre lo duro que te la va a chupar mientras te toca la polla.",
    "Monta su regazo {lugar} y frota tu erección contra su braga mojada — 90 segundos.",
    "Ponte de rodillas {lugar} y pide permiso para cada lamida en el coño de {ganador} — 2 minutos.",
    "Saca la polla {lugar} y mastúrbate frente a {ganador} — ella solo mira y comenta en voz alta — 90 segundos.",
    "Mete la lengua en el coño de {ganador} {lugar} y mete un dedo al mismo tiempo — 2 minutos.",
    "Pide a {ganador} {lugar} que te grabe solo audio gimiendo mientras te masturba ella.",
    "Frota tu polla contra el clítoris de {ganador} {lugar} — piel con piel — 90 segundos.",
    "Quítale la braga a {ganador} {lugar} con los dientes y lame su coño 60 segundos sin usar las manos.",
    "Ponte de espaldas {lugar}: {ganador} se sienta en tu polla — ropa apartada — y sube y baja 90 segundos.",
    "Pide seis nalgadas {lugar}. Después {ganador} elige: chuparte la polla o sentarse encima.",
    "Confiesa {lugar} tu fantasía más morbosa con {ganador} y obedece su primera orden.",
    "Lame el coño de {ganador} {lugar} desde atrás mientras le separas las nalgas — 2 minutos.",
    "Pide a {ganador} {lugar} que te masturbe con los pechos — si lo acordáis — 90 segundos.",
    "Chupa un dedo de {ganador} {lugar} y guíalo hacia tu polla — 60 segundos.",
    "Ponte de pie {lugar} y deja que {ganador} trace tu polla con la lengua por encima del pantalón — 45 segundos.",
    "Mastúrbate {lugar} mientras {ganador} se toca por encima de la braga — mirad a los ojos 90 segundos.",
    "Pide a {ganador} {lugar} que te diga lo zorro que estás mientras te lame los huevos.",
    "Túmbate {lugar}: {ganador} monta tu polla y frota su coño mojado — sin penetrar — 90 segundos.",
    "Pide a {ganador} {lugar} que te corra la braga y te meta dos dedos en el culo — 60 segundos si lo acordáis.",
    "Arrodíllate {lugar} y chupa el coño de {ganador} hasta que suplique — 2 minutos.",
    "Pide a {ganador} {lugar} que te azote mientras te masturba — seis golpes, ritmo suyo.",
    "Confiesa {lugar} en qué agujero de {ganador} quieres acabar y demuéstralo acariciándola.",
    "Ponte a cuatro {lugar}: {ganador} te lame el culo mientras te masturbas — 2 minutos si lo acordáis.",
];

const HETERO_CHICO_EXTREMO = [
    "Desnúdate {lugar}. {ganador} te chupa la polla hasta que acabes en su boca o 4 minutos.",
    "Mete tu polla en el coño de {ganador} {lugar} y follad 4 minutos — ella elige el ritmo la mitad del tiempo.",
    "Mastúrbate {lugar} hasta correrte cuando {ganador} lo ordene — di su nombre al acabar.",
    "Prohibido correrte {lugar} hasta la siguiente ronda. {ganador} te masturba y para al borde — x3.",
    "Pide a {ganador} {lugar} que te ate las muñecas y te monte hasta correrte — 3 minutos.",
    "Correrte donde {ganador} decida {lugar}: su boca, coño o pecho — ella elige al instante.",
    "Follad {lugar} 4 minutos. {ganador} cambia de posición cuando quiera.",
    "Chupa el coño de {ganador} {lugar} hasta que se corra en tu boca — traga si ambos queréis.",
    "Pide diez azotes {lugar}. Después {ganador} te monta hasta que acabes dentro de ella.",
    "Edging x3 {lugar}: {ganador} te masturba y para. A la tercera, solo acabas si suplicas.",
    "Pide maratón {lugar}: dos orgasmos seguidos cuando {ganador} mande.",
    "Desnúdate {lugar} y quédate desnudo el resto de la partida. {ganador} te toca cuando quiera.",
    "Pide a {ganador} {lugar} que te folle con la boca hasta sacarte la primera corrida — para y repite x3.",
    "Aguanta 5 minutos {lugar} de oral de {ganador} sin correrte — ella decide cuándo puedes.",
    "Pide doble estimulación {lugar}: dedos de {ganador} en el culo y boca en tu polla — 3 minutos si lo acordáis.",
    "Follad {lugar} en la posición más expuesta que {ganador} elija — mínimo 3 minutos.",
    "Pide a {ganador} {lugar} que te azote mientras te chupa la polla — diez golpes.",
    "Correrte {lugar} en la boca de {ganador} y abre la boca para que vea — traga delante de ella.",
    "Prohibido hablar {lugar}: solo gemidos mientras {ganador} te monta — 3 minutos.",
    "Pide a {ganador} {lugar} que te grabe gimiendo mientras te masturba — solo audio.",
    "Mete tu polla {lugar} en el coño de {ganador} y follad hasta que ambos estéis al borde — no corráis hasta que ella cuente hasta tres.",
    "Pide maratón oral {lugar}: {ganador} te chupa hasta que acabes dos veces — 6 minutos máximo.",
    "Pide atadura completa {lugar} y obedece lo que {ganador} te ordene con la boca — 3 minutos.",
    "Pide a {ganador} {lugar} que elija entre anal en ti, oral o vaginal — obedece sin quejarte.",
    "Aguanta 4 minutos {lugar} mientras {ganador} te monta por detrás — palabra de seguridad.",
    "Pide ser usado {lugar} como quiera {ganador} 3 minutos — palabra de seguridad activa.",
    "Mastúrbate {lugar} mientras {ganador} te mete dedos en el culo — 2 minutos si lo acordáis.",
    "Pide correrte {lugar} en sus pechos mientras {ganador} te masturba con la mano.",
    "Follad {lugar} bajo el agua 3 minutos si tenéis espacio — {ganador} elige ritmo.",
    "Pide a {ganador} {lugar} que te folle la boca hasta que lacrimen tus ojos — 90 segundos.",
    "Correrte gritando {lugar} el nombre de {ganador} mientras te monta — 3 minutos mínimo.",
    "Pide a {ganador} {lugar} que te estruja los huevos mientras te chupa la polla — 2 minutos.",
    "Desnúdate {lugar} y ponte en posición de espera hasta que {ganador} te ordene moverte.",
    "Pide penetración anal {lugar} en {ganador} con lubricante si lo acordáis — 3 minutos.",
    "Follad {lugar} sin piedad 4 minutos — {ganador} no para hasta que acabes dentro de ella.",
];

const CHICO_CHICO_PICANTE = [
    "Arrodíllate {lugar} y chupa la polla de {ganador} hasta la base — él te agarra del pelo 2 minutos.",
    "Sacad las pollas {lugar} y frotadlas una contra otra — 90 segundos sin correros.",
    "A cuatro patas {lugar}: {ganador} te mete dedos en el culo mientras te masturba — 2 minutos si lo acordáis.",
    "Ponte de rodillas {lugar} y lame los huevos de {ganador} mientras te masturbas — 90 segundos.",
    "Frotad pollas {lugar} piel con piel — 90 segundos mirándoos a los ojos.",
    "Pide a {ganador} {lugar} que te azote el culo seis veces antes de chuparte la polla.",
    "69 {lugar} con pollas al aire — chupad mutuamente 2 minutos.",
    "Ponte de pie {lugar}: {ganador} se arrodilla y te traga la polla entera — 90 segundos.",
    "Mastúrbate {lugar} frente a {ganador} — él comenta en voz alta lo dura que la tienes — 90 segundos.",
    "Pide a {ganador} {lugar} que te masturbe con su muslo entre tus piernas — 90 segundos.",
    "Chupa la polla de {ganador} {lugar} hasta sacarle la primera gota — para y repite x3.",
    "Ponte a cuatro {lugar}: {ganador} te folla el culo con lubricante si lo acordáis — 2 minutos.",
    "Pide a {ganador} {lugar} que te susurre lo puto que estás mientras te masturba.",
    "Frotad vuestras pollas {lugar} hasta que ambos estéis al borde — no corráis 90 segundos.",
    "Pide a {ganador} {lugar} que te grabe solo audio gimiendo mientras te masturba.",
    "Arrodíllate {lugar} y abre la boca: {ganador} te folla la garganta — 90 segundos.",
    "Ponte de espaldas {lugar}: {ganador} monta tu polla y frota su culo contra ella — 90 segundos.",
    "Pide seis nalgadas {lugar}. Después {ganador} elige: oral, anal o paja mutua.",
    "Confiesa {lugar} tu fantasía gay más morbosa con {ganador} y obedece su primera orden.",
    "Chupad mutuamente {lugar} — una polla cada uno — 2 minutos sin parar.",
    "Pide a {ganador} {lugar} que te ate las muñecas y te masturbe — 2 minutos.",
    "Saca la polla {lugar} y deja que {ganador} te la lama desde la base hasta la punta — 60 segundos.",
    "Ponte de pie {lugar} y frota tu polla contra la de {ganador} — 90 segundos.",
    "Pide a {ganador} {lugar} que te azote mientras te chupa la polla — seis golpes.",
    "Masturbación mutua {lugar} — cada uno en la polla del otro — 2 minutos.",
    "Pide a {ganador} {lugar} que te meta un dedo en el culo mientras te masturba — 90 segundos si lo acordáis.",
    "Ponte a cuatro {lugar}: {ganador} te folla el culo mientras te tira del pelo — 2 minutos si lo acordáis.",
    "Confiesa {lugar} dónde quieres que acabe {ganador} — boca, pecho o culo — y demuéstralo.",
    "Pide a {ganador} {lugar} que te corra el lubricante en el culo y te meta un dedo — 60 segundos.",
    "Chupa la polla de {ganador} {lugar} mientras te metes un dedo en el culo — 2 minutos.",
    "Pide a {ganador} {lugar} que te diga lo duro que te la va a meter mientras te masturba.",
    "Frotad pollas {lugar} hasta que supliques — 90 segundos sin correros.",
    "Pide a {ganador} {lugar} que te masturbe con la boca y la mano a la vez — 90 segundos.",
    "Ponte de rodillas {lugar} y pide permiso para cada lamida en la polla de {ganador} — 2 minutos.",
    "Pide a {ganador} {lugar} que te agarre del pelo mientras te folla la boca — 90 segundos.",
];

const CHICO_CHICO_EXTREMO = [
    "Desnúdate {lugar}. Chupa hasta que {ganador} acabe en tu boca o 4 minutos — traga todo.",
    "Follad {lugar} 4 minutos — {ganador} te folla el culo con lubricante si lo acordáis.",
    "Mastúrbate {lugar} hasta correrte cuando {ganador} lo ordene — di su nombre al acabar.",
    "Prohibido correrte {lugar} hasta la siguiente ronda. {ganador} te masturba y para al borde — x3.",
    "Pide a {ganador} {lugar} que te ate muñecas y tobillos y te folle la boca — 3 minutos.",
    "Correrte donde {ganador} decida {lugar}: su boca, pecho o culo — él elige.",
    "69 {lugar} hasta que uno se corra — luego el otro continúa.",
    "Pide diez azotes {lugar}. Después {ganador} elige: oral, anal o correrte en su pecho.",
    "Edging x3 {lugar}: {ganador} te masturba y para. A la tercera, solo acabas si suplicas.",
    "Pide maratón {lugar}: dos orgasmos seguidos cuando {ganador} mande.",
    "Desnúdate {lugar} y quédate desnudo el resto de la partida.",
    "Follad {lugar} 4 minutos — {ganador} cambia de posición cuando quiera.",
    "Chupad mutuamente {lugar} hasta correros — 4 minutos máximo.",
    "Aguanta 5 minutos {lugar} de oral de {ganador} sin correrte.",
    "Pide doble estimulación {lugar}: dedos de {ganador} en el culo y boca en tu polla — 3 minutos.",
    "Follad {lugar} en la posición más expuesta que {ganador} elija — mínimo 3 minutos.",
    "Pide a {ganador} {lugar} que te azote mientras te folla el culo — diez golpes.",
    "Correrte {lugar} en la boca de {ganador} — traga delante de él.",
    "Prohibido hablar {lugar}: solo gemidos mientras {ganador} te folla — 3 minutos.",
    "Pide a {ganador} {lugar} que te grabe gimiendo mientras os folláis — solo audio.",
    "Polla contra polla {lugar} hasta correros — 2 minutos sin parar.",
    "Pide maratón oral {lugar}: chupa hasta que {ganador} acabe dos veces — 6 minutos máximo.",
    "Pide atadura completa {lugar} y obedece oral 3 minutos — {ganador} agarra tu cabeza.",
    "Pide a {ganador} {lugar} que elija entre anal u oral — obedece sin quejarte.",
    "Aguanta 4 minutos {lugar} a cuatro mientras {ganador} te folla el culo.",
    "Pide ser usado {lugar} como quiera {ganador} 3 minutos — palabra de seguridad.",
    "Mastúrbate {lugar} con la polla de {ganador} como guía — 2 minutos.",
    "Pide correrte {lugar} en su pecho mientras os masturbáis mutuamente.",
    "Follad {lugar} bajo el agua 3 minutos si tenéis espacio.",
    "Pide a {ganador} {lugar} que te folle la boca hasta que lacrimen tus ojos.",
    "Correrte gritando {lugar} el nombre de {ganador} mientras te folla.",
    "Pide a {ganador} {lugar} que te estruja los huevos mientras te chupa la polla.",
    "Desnúdate {lugar} y ponte en posición de espera hasta que {ganador} ordene.",
    "Uno folla al otro {lugar} — {ganador} elige quién primero — 4 minutos.",
    "Pide penetración profunda {lugar} hasta orgasmo o 4 minutos — palabra de seguridad.",
];

const CHICA_CHICA_PICANTE = [
    "Arrodíllate {lugar} y lame el coño de {ganador} — ella te agarra del pelo 2 minutos.",
    "Quítate braga y sujetador {lugar}. {ganador} te ordena dónde tocarte — clítoris, pechos o culo — 2 minutos.",
    "Tribbing {lugar}: frotad coños piel con piel — 90 segundos sin parar.",
    "Mete dos dedos en el coño de {ganador} {lugar} mientras le chupas un pezón — 2 minutos.",
    "Ponte de rodillas {lugar} y pide permiso para cada lamida en el coño de {ganador} — 2 minutos.",
    "Frotad coños {lugar} — bragas apartadas — 90 segundos mirándoos a los ojos.",
    "Pide a {ganador} {lugar} que te azote el culo seis veces antes de meterte dedos.",
    "Monta la pierna de {ganador} {lugar} y frota tu coño mojado contra su muslo — 90 segundos.",
    "Lame el clítoris de {ganador} {lugar} hasta que gima tu nombre — 2 minutos.",
    "Pide a {ganador} {lugar} que te susurre lo zorra que estás mientras te mete dedos.",
    "Túmbate {lugar}: {ganador} monta tu cara y frota su coño contra tu boca — 90 segundos si ambas queréis.",
    "Mastúrbate {lugar} frente a {ganador} — ella solo mira y comenta — 90 segundos.",
    "Pide a {ganador} {lugar} que te grabe solo audio gimiendo mientras te toca.",
    "Ponte a cuatro {lugar}: {ganador} te lame el coño y el culo alternando — 2 minutos.",
    "Chupad pezones mutuamente {lugar} mientras os acariciáis el coño — 90 segundos.",
    "Pide seis nalgadas {lugar}. Después {ganador} elige: oral, dedos o tribbing.",
    "Confiesa {lugar} tu fantasía lésbica más morbosa con {ganador} y obedece su primera orden.",
    "Mete la lengua en el coño de {ganador} {lugar} y mete un dedo al mismo tiempo — 2 minutos.",
    "Pide a {ganador} {lugar} que te ate las muñecas y te masturbe — 2 minutos.",
    "Frotad clítoris {lugar} piel con piel — 90 segundos sin correros.",
    "Pide a {ganador} {lugar} que te diga lo mojada que estás mientras te lame el coño.",
    "Quítale la braga a {ganador} {lugar} con los dientes y lame su coño 60 segundos.",
    "Ponte de espaldas {lugar}: {ganador} se sienta en tu cara — 90 segundos si ambas queréis.",
    "Pide a {ganador} {lugar} que te azote mientras te mete dedos — seis golpes.",
    "Coño con coño {lugar}: frotad mutuamente 90 segundos sin parar.",
    "Pide a {ganador} {lugar} que te meta un dedo en el culo mientras te masturba el clítoris — 90 segundos si lo acordáis.",
    "Descríbele {lugar} paso a paso cómo te masturbas mientras lo haces frente a ella — 90 segundos.",
    "Pide a {ganador} {lugar} que te corra la braga y te meta dos dedos de golpe — 60 segundos.",
    "Tribbing {lugar} hasta que supliques — 90 segundos sin correros.",
    "Pide a {ganador} {lugar} que te masturbe con los pechos — si lo acordáis — 90 segundos.",
    "Chupa los pezones de {ganador} {lugar} alternando mientras te metes un dedo en el coño — 90 segundos.",
    "Pide a {ganador} {lugar} que te agarre del pelo mientras te lame el coño — 2 minutos.",
    "Confiesa {lugar} dónde quieres correrte con {ganador} y demuéstralo abriéndote las piernas.",
    "Ponte de rodillas {lugar} y lame el coño de {ganador} hasta que suplique — 2 minutos.",
    "Pide a {ganador} {lugar} que te susurre tres órdenes sucias mientras te toca el clítoris.",
    "Siéntate en el regazo de {ganador} {lugar} y frotad coños — bragas apartadas — 90 segundos.",
    "Pide a {ganador} {lugar} que te muerda el labio mientras te mete un dedo en el coño.",
    "Túmbate {lugar} con las piernas abiertas: {ganador} te lame el clítoris sin usar las manos — 2 minutos.",
    "Pide a {ganador} {lugar} que te ordene frotarte el coño mientras la miras a los ojos — 90 segundos.",
    "Besad con lengua {lugar} 60 segundos — mano de {ganador} bajo tu falda, dedos en tu braga.",
    "Pide a {ganador} {lugar} que te describa cómo te comería el coño — tú solo obedeces la primera instrucción.",
    "Frotad muslos {lugar} hasta que ambas respiréis agitadas — 90 segundos sin correros.",
    "Pide a {ganador} {lugar} que te pellizque los pezones mientras te masturba el clítoris — 90 segundos.",
    "Arrodíllate {lugar} y abre las piernas: {ganador} te mete dos dedos y te mira fijamente — 90 segundos.",
    "Pide a {ganador} {lugar} que te susurre lo húmeda que tienes el coño mientras te toca.",
    "Monta a {ganador} {lugar} en posición de tijera y frotad coños — 90 segundos.",
    "Pide a {ganador} {lugar} que te bese el cuello mientras te mete un dedo en el coño — 60 segundos.",
    "Quítate el sujetador {lugar} y guía la boca de {ganador} hacia tus pezones — 60 segundos.",
    "Pide a {ganador} {lugar} que te ordene gemir su nombre mientras te masturbas — 90 segundos.",
    "Ponte boca arriba {lugar}: {ganador} se arrodilla entre tus piernas y te lame el coño — 2 minutos.",
    "Pide a {ganador} {lugar} que te azote el muslo interno seis veces antes de meterte dedos.",
    "Confiesa {lugar} qué parte del cuerpo de {ganador} te hace mojar más — y demuéstralo rozándola.",
    "Pide a {ganador} {lugar} que te mire fijamente mientras te metes un dedo en el coño — 90 segundos.",
    "Tribbing lento {lugar}: frotad coños al compás de vuestra respiración — 2 minutos.",
];

const CHICA_CHICA_EXTREMO = [
    "Desnúdate {lugar}. {ganador} te lame el coño hasta que te corras o 4 minutos.",
    "Tribbing {lugar} hasta orgasmo — 3 minutos sin parar.",
    "Mastúrbate {lugar} hasta correrte cuando {ganador} lo ordene — di su nombre al acabar.",
    "Prohibido correrte {lugar} hasta la siguiente ronda. {ganador} te masturba y para al borde — x3.",
    "Pide a {ganador} {lugar} que te ate muñecas y tobillos y te meta dedos — 3 minutos.",
    "Correrte donde {ganador} decida {lugar}: su boca, pecho o muslo — ella elige.",
    "69 {lugar} hasta que una se corra — luego la otra continúa.",
    "Pide diez azotes {lugar}. Después {ganador} elige: oral, dedos o tribbing.",
    "Edging x3 {lugar}: {ganador} te masturba y para. A la tercera, solo acabas si suplicas.",
    "Pide maratón {lugar}: dos orgasmos seguidos cuando {ganador} mande.",
    "Desnúdate {lugar} y quédate desnuda el resto de la partida.",
    "Facesitting 2 minutos {lugar}: frota tu coño en su cara hasta que supliques.",
    "Lame hasta que {ganador} se corra {lugar} en tu boca — traga si ambas queréis.",
    "Aguanta 5 minutos {lugar} de oral de {ganador} sin correrte.",
    "Pide doble estimulación {lugar}: juguete en el culo y dedos de {ganador} en el coño — 3 minutos si lo acordáis.",
    "Tribbing {lugar} en la posición más expuesta que {ganador} elija — mínimo 3 minutos.",
    "Pide a {ganador} {lugar} que te azote mientras te mete dedos — diez golpes.",
    "Correrte {lugar} en la boca de {ganador} — abre la boca para que vea.",
    "Prohibido hablar {lugar}: solo gemidos mientras {ganador} te mete dedos — 3 minutos.",
    "Pide a {ganador} {lugar} que te grabe gimiendo mientras te lame — solo audio.",
    "Frotad coños {lugar} hasta correros — 2 minutos sin parar.",
    "Pide maratón oral {lugar}: lame hasta que {ganador} se corra dos veces — 6 minutos máximo.",
    "Pide atadura completa {lugar} y obedece oral 3 minutos — {ganador} agarra tu cabeza.",
    "Pide a {ganador} {lugar} que elija entre oral, dedos o tribbing — obedece sin quejarte.",
    "Aguanta 4 minutos {lugar} a cuatro mientras {ganador} te mete dedos profundos.",
    "Pide ser usada {lugar} como quiera {ganador} 3 minutos — palabra de seguridad.",
    "Mastúrbate {lugar} con los dedos de {ganador} como guía — 2 minutos.",
    "Pide correrte {lugar} en sus pechos mientras os masturbáis mutuamente.",
    "Usad strap o dedos {lugar} — lo que tengáis — 3 minutos si lo acordáis.",
    "Pide a {ganador} {lugar} que te siente en su cara 2 minutos — tú controlas presión.",
    "Correrte gritando {lugar} el nombre de {ganador} mientras te mete dedos.",
    "Pide a {ganador} {lugar} que te estruja un pecho mientras te lame el clítoris.",
    "Desnúdate {lugar} y ponte en posición de espera hasta que {ganador} ordene.",
    "Coño con coño {lugar} hasta orgasmo — 4 minutos máximo.",
    "Pide dedos profundos {lugar} hasta correrte o 4 minutos — palabra de seguridad.",
];

function genStems(templates, bucket) {
  return templates.filter((s) => validateExplicitChallenge(s.replace(/\{lugar\}/g, "en la cama"), bucket).valid);
}

const EXTRA_HETERO_CHICA_P = genStems(
  [
    "Vuelca tu braga hacia un lado {lugar} y deja que {ganador} te meta la polla de un empujón — aguanta 60 segundos.",
    "Ponte en cuclillas {lugar} sobre la polla de {ganador} y baja hasta sentirla entera dentro — sube y baja 90 segundos.",
    "Pide a {ganador} {lugar} que te escupa en el coño antes de meterte la polla — obedece sin quejarte.",
    "Túmbate {lugar} boca abajo: {ganador} abre tus nalgas y te lame el culo 90 segundos antes de follarte.",
    "Chupa la polla de {ganador} {lugar} hasta que te goteen las babas por la barbilla — 2 minutos.",
    "Pide a {ganador} {lugar} que te apriete el cuello — suave — mientras te mete dedos en el coño.",
    "Siéntate en la mesa {lugar} con las piernas abiertas: {ganador} te folla con dos dedos mientras te mira.",
    "Arrodíllate {lugar} y pide a {ganador} que te corra semen en la cara cuando acabe — si ambos queréis.",
    "Ponte de pie {lugar} y inclínate: {ganador} te mete la polla por detrás y te agarra de las caderas — 2 minutos.",
    "Pide a {ganador} {lugar} que te hable como a una puta mientras te masturba el clítoris — 90 segundos.",
    "Quítate el sujetador {lugar} y frota tus pezones contra la polla de {ganador} — 60 segundos.",
    "Pide a {ganador} {lugar} que te meta la polla en la boca hasta que tosa — 90 segundos.",
    "Túmbate {lugar} con las piernas en sus hombros: {ganador} te folla profundo — 2 minutos.",
    "Pide a {ganador} {lugar} que te deje lamer su polla después de correrte en sus dedos.",
    "Monta a {ganador} {lugar} de espaldas y rebolate en su polla — 90 segundos sin parar.",
    "Pide a {ganador} {lugar} que te pellizque los pezones mientras te folla el coño con los dedos.",
    "Arrodíllate {lugar} y abre la boca: {ganador} te folla la garganta hasta que lacrimen tus ojos.",
    "Pide a {ganador} {lugar} que te ordene gemir como zorra mientras te mete la polla.",
    "Ponte a cuatro {lugar}: {ganador} te mete la polla en el culo con lubricante — 2 minutos si lo acordáis.",
    "Pide a {ganador} {lugar} que te corra dentro y no te dejes limpiar hasta la siguiente ronda.",
  ],
  "hetero.chica"
);

const EXTRA_HETERO_CHICA_E = genStems(
  [
    "Pide a {ganador} {lugar} que te folle el coño sin piedad hasta correrte dos veces seguidas.",
    "Chupa la polla de {ganador} {lugar} hasta que acabe en tu garganta — traga sin escupir.",
    "Pide a {ganador} {lugar} que te ate en la cama y te use como quiera — 4 minutos.",
    "A cuatro patas {lugar}: {ganador} alterna entre coño y culo — 3 minutos si lo acordáis.",
    "Pide maratón {lugar}: {ganador} te folla hasta que supliques parar — mínimo 4 minutos.",
    "Correrte {lugar} gritando obscenidades mientras {ganador} te mete la polla entera.",
    "Pide a {ganador} {lugar} que te grabe gimiendo mientras te folla por detrás.",
    "Desnúdate {lugar} y pide a {ganador} que te folle en la posición más humillante que conozca.",
    "Pide a {ganador} {lugar} que te corra en la boca y enseñes la lengua antes de tragar.",
    "Follad {lugar} 5 minutos — {ganador} no para aunque supliques hasta que acabes.",
    "Pide a {ganador} {lugar} que te azote el culo hasta dejarlo rojo antes de follarte.",
    "Aguanta {lugar} 5 minutos con su polla entera en tu garganta — palabra de seguridad.",
    "Pide a {ganador} {lugar} que te meta la polla y dedos a la vez — doble penetración.",
    "Correrte {lugar} mientras {ganador} te susurra lo sucia que eres al oído.",
    "Pide a {ganador} {lugar} que te folle el culo hasta correrte — lubricante obligatorio.",
    "Prohibido cerrar las piernas {lugar} mientras {ganador} te come el coño — 3 minutos.",
    "Pide a {ganador} {lugar} que te haga acabar chupándote el clítoris y metiéndote dedos.",
    "Follad {lugar} hasta que {ganador} acabe dentro — no te limpies hasta que él diga.",
    "Pide a {ganador} {lugar} edging x5 antes de dejarte correrte gritando.",
    "Pide ser usada {lugar} como muñeca sexual de {ganador} — 4 minutos sin negociar.",
  ],
  "hetero.chica"
);

const EXTRA_HETERO_CHICO_P = genStems(
  [
    "Saca la polla {lugar} y deja que {ganador} te la masturbe con los pechos — 90 segundos si lo acordáis.",
    "Arrodíllate {lugar} y lame el coño de {ganador} hasta que empape tu barbilla — 2 minutos.",
    "Pide a {ganador} {lugar} que te escupa en la polla antes de chuparte.",
    "Ponte de pie {lugar}: {ganador} se arrodilla y te traga la polla hasta la base — 90 segundos.",
    "Mete dos dedos en el coño de {ganador} {lugar} mientras le mordisqueas el cuello.",
    "Pide a {ganador} {lugar} que te hable sucio mientras te masturba la polla — 90 segundos.",
    "Túmbate {lugar}: {ganador} monta tu polla y te clava las uñas en el pecho — 90 segundos.",
    "Chupa el clítoris de {ganador} {lugar} hasta que arqueé la espalda — 2 minutos.",
    "Pide a {ganador} {lugar} que te azote el culo mientras te chupa la polla.",
    "Frota tu polla {lugar} contra el coño mojado de {ganador} — braga apartada — 90 segundos.",
    "Pide a {ganador} {lugar} que te meta un dedo en el culo mientras te masturba — 90 segundos.",
    "Saca la polla {lugar} y mastúrbate mientras {ganador} se toca el coño mirándote — 90 segundos.",
    "Pide a {ganador} {lugar} que te ordene correrte en su mano cuando lo decida.",
    "Lame el coño de {ganador} {lugar} desde atrás con sus nalgas bien separadas — 2 minutos.",
    "Pide a {ganador} {lugar} que te pellizque los huevos mientras te chupa la polla.",
    "Ponte a cuatro {lugar}: {ganador} te lame el culo mientras te masturbas — 2 minutos.",
    "Pide a {ganador} {lugar} que te susurre lo duro que te la va a chupar.",
    "Mete la polla {lugar} entre los pechos de {ganador} si lo acordáis — 90 segundos.",
    "Pide a {ganador} {lugar} que te agarre del pelo mientras te traga la polla.",
    "Confiesa {lugar} dónde quieres correrte con {ganador} y fóllala en esa posición 60 segundos.",
  ],
  "hetero.chico"
);

const EXTRA_HETERO_CHICO_E = genStems(
  [
    "Pide a {ganador} {lugar} que te chupe la polla hasta que acabes en su boca — traga si ella quiere.",
    "Mete tu polla {lugar} en el coño de {ganador} y follad sin piedad — 4 minutos.",
    "Pide a {ganador} {lugar} que te monte hasta correrte dos veces seguidas.",
    "Follad {lugar} en anal con {ganador} — lubricante — 3 minutos si lo acordáis.",
    "Pide a {ganador} {lugar} que te ate y te use la boca — 4 minutos.",
    "Correrte {lugar} gritando su nombre mientras {ganador} te masturba con la mano.",
    "Pide a {ganador} {lugar} que te folle la boca hasta que lacrimen tus ojos.",
    "Desnúdate {lugar} y pide a {ganador} que te monte en la posición que prefiera — 4 minutos.",
    "Pide a {ganador} {lugar} edging x5 antes de dejarte acabar dentro de ella.",
    "Follad {lugar} hasta que ambos estéis exhaustos — mínimo 4 minutos.",
    "Pide a {ganador} {lugar} que te azote mientras te folla con la boca.",
    "Correrte {lugar} en sus pechos mientras {ganador} te masturba sin piedad.",
    "Pide a {ganador} {lugar} que te grabe gimiendo mientras os folláis.",
    "Aguanta {lugar} 5 minutos de oral de {ganador} sin correrte.",
    "Pide a {ganador} {lugar} doble estimulación: boca y mano a la vez — 3 minutos.",
    "Follad {lugar} hasta que {ganador} acabe dentro — no te salgas hasta que ella diga.",
    "Pide a {ganador} {lugar} maratón: dos orgasmos tuyos seguidos.",
    "Pide ser dominado {lugar} por {ganador} 4 minutos — obedece sin negociar.",
    "Mete dedos {lugar} en el coño de {ganador} mientras te folla la boca — 3 minutos.",
    "Pide a {ganador} {lugar} que te haga acabar chupándote la polla y metiéndote un dedo.",
  ],
  "hetero.chico"
);

const EXTRA_CHICO_CHICO_P = genStems(
  [
    "Chupa la polla de {ganador} {lugar} hasta empaparla de saliva — 2 minutos sin parar.",
    "Sacad las pollas {lugar} y frotadlas hasta que ambos gemáis — 90 segundos.",
    "Pide a {ganador} {lugar} que te escupa en la polla antes de chuparte.",
    "Arrodíllate {lugar} y pide a {ganador} que te folle la boca — 90 segundos.",
    "Ponte de pie {lugar} y frota tu polla contra la de {ganador} — 90 segundos.",
    "Pide a {ganador} {lugar} que te masturbe mientras te muerde el cuello.",
    "A cuatro patas {lugar}: {ganador} te mete dedos en el culo — 90 segundos si lo acordáis.",
    "69 {lugar} con pollas al aire — chupad sin parar 2 minutos.",
    "Pide a {ganador} {lugar} que te azote el culo antes de chuparte la polla.",
    "Masturbación mutua {lugar} — cada uno en la polla del otro — 2 minutos.",
    "Pide a {ganador} {lugar} que te susurre lo puto que estás mientras te masturba.",
    "Ponte de espaldas {lugar}: {ganador} monta tu polla y frota su culo — 90 segundos.",
    "Pide a {ganador} {lugar} que te agarre del pelo mientras te traga la polla.",
    "Chupa los huevos de {ganador} {lugar} mientras te masturbas — 90 segundos.",
    "Pide a {ganador} {lugar} que te meta un dedo en el culo mientras te chupa.",
    "Frotad pollas {lugar} piel con piel hasta el borde — 90 segundos.",
    "Pide a {ganador} {lugar} que te ordene correrte en su mano.",
    "Arrodíllate {lugar} y lame la polla de {ganador} desde abajo — 60 segundos.",
    "Pide a {ganador} {lugar} que te hable sucio mientras os masturbáis mutuamente.",
    "Ponte a cuatro {lugar}: {ganador} te folla el culo con lubricante — 2 minutos si lo acordáis.",
  ],
  "chico_chico"
);

const EXTRA_CHICO_CHICO_E = genStems(
  [
    "Follad {lugar} 4 minutos — {ganador} te folla el culo con lubricante si lo acordáis.",
    "Chupa hasta que {ganador} acabe {lugar} en tu boca — traga todo.",
    "Pide a {ganador} {lugar} maratón: dos orgasmos seguidos cuando mande.",
    "Polla contra polla {lugar} hasta correros — 2 minutos sin parar.",
    "Pide a {ganador} {lugar} que te ate y te folle la boca — 4 minutos.",
    "Correrte {lugar} gritando su nombre mientras {ganador} te masturba.",
    "Pide a {ganador} {lugar} edging x5 antes de dejarte acabar.",
    "Follad {lugar} sin piedad — mínimo 4 minutos — palabra de seguridad.",
    "Pide a {ganador} {lugar} que te azote mientras te folla por detrás.",
    "Desnúdate {lugar} y quédate desnudo el resto de la partida.",
    "Pide a {ganador} {lugar} doble penetración con juguete y polla si lo acordáis.",
    "Aguanta {lugar} 5 minutos de oral de {ganador} sin correrte.",
    "Pide a {ganador} {lugar} que te grabe gimiendo mientras os folláis.",
    "Correrte {lugar} en su pecho mientras os masturbáis mutuamente.",
    "Pide a {ganador} {lugar} anal profundo hasta orgasmo o 4 minutos.",
    "Uno folla al otro {lugar} — {ganador} elige quién primero — 4 minutos.",
    "Pide a {ganador} {lugar} que te use como quiera — 4 minutos sin negociar.",
    "Chupad mutuamente {lugar} hasta correros — 4 minutos máximo.",
    "Pide a {ganador} {lugar} atadura completa y obedece oral 3 minutos.",
    "Follad {lugar} hasta que ambos estéis al borde — {ganador} cuenta hasta tres.",
  ],
  "chico_chico"
);

const EXTRA_CHICA_CHICA_P = genStems(
  [
    "Lame el coño de {ganador} {lugar} hasta empapar tu barbilla — 2 minutos.",
    "Tribbing {lugar} piel con piel — frotad coños sin parar 90 segundos.",
    "Pide a {ganador} {lugar} que te escupa en el clítoris antes de lamerte.",
    "Mete dos dedos {lugar} en el coño de {ganador} mientras le chupas un pezón.",
    "Pide a {ganador} {lugar} que te hable sucio mientras te masturba el clítoris.",
    "Quítate la braga {lugar} y frota tu coño contra el muslo de {ganador} — 90 segundos.",
    "Pide a {ganador} {lugar} que te azote el culo antes de meterte dedos.",
    "Arrodíllate {lugar} y pide permiso para cada lamida en su coño — 2 minutos.",
    "Pide a {ganador} {lugar} que te agarre del pelo mientras te lame el clítoris.",
    "Frotad clítoris {lugar} piel con piel — 90 segundos mirándoos.",
    "Pide a {ganador} {lugar} que te ordene gemir su nombre mientras te toca.",
    "Monta a {ganador} {lugar} en tijera y frotad coños — 90 segundos.",
    "Pide a {ganador} {lugar} que te pellizque los pezones mientras te mete dedos.",
    "Chupad pezones mutuamente {lugar} mientras os acariciáis el coño — 90 segundos.",
    "Pide a {ganador} {lugar} que te susurre lo mojada que tienes el coño.",
    "Túmbate {lugar} con piernas abiertas: {ganador} te mete tres dedos — 90 segundos.",
    "Pide a {ganador} {lugar} que te meta un dedo en el culo mientras te lame el clítoris.",
    "Coño con coño {lugar}: frotad sin parar 90 segundos.",
    "Pide a {ganador} {lugar} que te masturbe con los pechos si lo acordáis.",
    "Confiesa {lugar} tu fantasía lésbica más guarra con {ganador} y obedece su orden.",
  ],
  "chica_chica"
);

const EXTRA_CHICA_CHICA_E = genStems(
  [
    "Tribbing {lugar} hasta orgasmo — 3 minutos sin parar.",
    "Lame hasta que {ganador} se corra {lugar} en tu boca — traga si ambas queréis.",
    "Pide a {ganador} {lugar} maratón: dos orgasmos seguidos cuando mande.",
    "Pide a {ganador} {lugar} que te ate y te meta dedos — 4 minutos.",
    "Correrte {lugar} gritando su nombre mientras {ganador} te masturba.",
    "Pide a {ganador} {lugar} edging x5 antes de dejarte acabar.",
    "Facesitting 2 minutos {lugar}: frota tu coño en su cara hasta correrte.",
    "Pide a {ganador} {lugar} que te azote mientras te mete dedos profundos.",
    "Desnúdate {lugar} y quédate desnuda el resto de la partida.",
    "Pide a {ganador} {lugar} doble estimulación con juguete y dedos — 3 minutos.",
    "Aguanta {lugar} 5 minutos de oral de {ganador} sin correrte.",
    "Pide a {ganador} {lugar} que te grabe gimiendo mientras te lame.",
    "69 {lugar} hasta que una se corra — luego la otra continúa.",
    "Pide a {ganador} {lugar} dedos profundos hasta orgasmo o 4 minutos.",
    "Correrte {lugar} en su boca mientras {ganador} te mete dos dedos.",
    "Pide a {ganador} {lugar} que te use como quiera — 4 minutos sin negociar.",
    "Tribbing {lugar} en la posición más expuesta que {ganador} elija — 3 minutos.",
    "Pide a {ganador} {lugar} maratón oral: hasta que se corra dos veces.",
    "Frotad coños {lugar} hasta correros — 2 minutos sin parar.",
    "Pide a {ganador} {lugar} atadura completa y obedece oral 3 minutos.",
  ],
  "chica_chica"
);

const EXPLICIT_BANKS = {
  "hetero.chica": {
    picante: [...HETERO_CHICA_PICANTE, ...EXTRA_HETERO_CHICA_P, ...ULTRA_HETERO_CHICA_PICANTE],
    extremo: [...HETERO_CHICA_EXTREMO, ...EXTRA_HETERO_CHICA_E, ...ULTRA_HETERO_CHICA_EXTREMO],
  },
  "hetero.chico": {
    picante: [...HETERO_CHICO_PICANTE, ...EXTRA_HETERO_CHICO_P, ...ULTRA_HETERO_CHICO_PICANTE],
    extremo: [...HETERO_CHICO_EXTREMO, ...EXTRA_HETERO_CHICO_E, ...ULTRA_HETERO_CHICO_EXTREMO],
  },
  chico_chico: {
    picante: [...CHICO_CHICO_PICANTE, ...EXTRA_CHICO_CHICO_P, ...ULTRA_CHICO_CHICO_PICANTE],
    extremo: [...CHICO_CHICO_EXTREMO, ...EXTRA_CHICO_CHICO_E, ...ULTRA_CHICO_CHICO_EXTREMO],
  },
  chica_chica: {
    picante: [...CHICA_CHICA_PICANTE, ...EXTRA_CHICA_CHICA_P, ...ULTRA_CHICA_CHICA_PICANTE],
    extremo: [...CHICA_CHICA_EXTREMO, ...EXTRA_CHICA_CHICA_E, ...ULTRA_CHICA_CHICA_EXTREMO],
  },
};

export function buildAllExplicitTrees(mode) {
  const tree = { picante: {}, extremo: {} };
  for (const intensity of ["picante", "extremo"]) {
    tree[intensity] = {
      hetero: {
        chica: expandStems(EXPLICIT_BANKS["hetero.chica"][intensity], mode),
        chico: expandStems(EXPLICIT_BANKS["hetero.chico"][intensity], mode),
      },
      chico_chico: expandStems(EXPLICIT_BANKS.chico_chico[intensity], mode),
      chica_chica: expandStems(EXPLICIT_BANKS.chica_chica[intensity], mode),
    };
  }
  return tree;
}

export function getExplicitStemCounts() {
  const counts = {};
  for (const [bucket, byInt] of Object.entries(EXPLICIT_BANKS)) {
    counts[bucket] = {
      picante: byInt.picante.length,
      extremo: byInt.extremo.length,
    };
  }
  return counts;
}
