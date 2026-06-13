/**
 * Genera retos extra para Casa y Webcam (mínimo TARGET por categoría).
 * Ejecutar: node generate-core-challenges.mjs
 */
import fs from "fs";
import vm from "vm";
import { expandChallengeBank } from "./expand-challenge-bank.mjs";
import { getHomeExtraBatch, getRemoteExtraBatch } from "./core-challenge-banks-v2.mjs";

const TARGET = 80;
const ROOT = import.meta.dirname;

function loadCounts() {
  let code = fs.readFileSync(`${ROOT}/challenges.js`, "utf8").replace(/^const /gm, "var ");
  code = code.split("function isRemotePlayMode")[0];
  const ctx = {};
  vm.runInNewContext(code, ctx);
  return ctx;
}

function countLeaves(obj, prefix = "") {
  const rows = [];
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (Array.isArray(v)) rows.push({ path: prefix + k, count: v.length });
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

function getHomeExtras(intensity, orient, role) {
  const isHetero = orient === "hetero";
  const isChica = role === "chica" || orient === "chica_chica";
  const g = "{ganador}";

  const places = ["en la cama", "en el sofá", "contra la pared", "en la ducha", "en la cocina", "en el suelo"];
  const p = (i) => places[i % places.length];

  if (isHetero && isChica) {
    const banks = {
      suave: [
        `Siéntate ${p(0)} frente a ${g} y quítate una prenda despacio sin decir cuál sigue.`,
        `Masaje en el cuello de ${g} 2 minutos mientras susurras qué harías después.`,
        `Guía su mano bajo tu ropa ${p(1)} y muéstrale tu ritmo favorito 45 segundos.`,
        `Besad con lengua 45 segundos ${p(2)}. Mano en su entrepierna por encima del pantalón.`,
        `Confiesa tres posiciones donde quieres que ${g} te folle esta noche.`,
        `Ponte de espaldas y empuja tu culo contra su erección ${p(3)} — ropa puesta — 30 segundos.`,
        `Quítale la camiseta a ${g} con los dientes y lame su pecho 20 segundos.`,
        `Acaricia tu pecho frente a ${g} y pregúntale si quiere chuparte los pezones.`,
        `Juego: ${g} cierra los ojos 30 segundos mientras tú le rozas el cuerpo sin avisar dónde.`,
        `Susurrale al oído lo mojada que estás y pide que te toque por encima de la ropa.`,
        `Sentada en su regazo ${p(4)}, frota tu entrepierna contra la suya 45 segundos.`,
        `Describe en voz alta cómo quieres que te bese ${g} — labios, cuello, pechos, abajo.`,
        `Pide a ${g} que te ate las manos con una corbata o camiseta — suave — y obedece 1 minuto.`,
        `Quítate las bragas bajo la falda sin que ${g} vea y dáselas en la mano.`,
        `Coqueteo lento: acaricia su polla por encima del pantalón mientras miráis a los ojos.`,
      ],
      picante: [
        `Arrodíllate ${p(0)} y obedece 2 minutos lo que ${g} te ordene: chupar, lamer o tocar.`,
        `Quítate el sujetador y deja que ${g} te pellizque los pezones al ritmo que marque.`,
        `Mastúrbate frente a ${g} 90 segundos — solo clítoris — sin correrte.`,
        `Monta su regazo ${p(1)} y frota tu coño contra su polla — braga apartada — 1 minuto.`,
        `Mete la mano de ${g} dentro de tu braga y guía dos dedos 2 minutos.`,
        `Simula chupar su polla ${p(2)} — ropa puesta o fuera — 90 segundos mirándole.`,
        `Ponte a cuatro ${p(3)} y pide 6 nalgadas. Después elige: dedos o lengua.`,
        `Descríbele cómo te masturbas mientras lo demuestras 45 segundos.`,
        `Quítate las bragas y arrójaselas a ${g}. Él decide: oler, guardar o metértelas en la boca.`,
        `Siéntate en su cara — si ambos queréis — 45 segundos. Tú controlas la presión.`,
        `Pide que ${g} te grabe solo audio mientras gimes — sin vídeo si preferís.`,
        `Frota tu coño mojado contra su muslo ${p(4)} hasta que pida más.`,
        `Chupa sus dedos como si fuera su polla 30 segundos. Pregunta: «¿Quieres la real?»`,
        `Roleplay: eres su secretaria. ${g} te ordena quitarte una prenda por cada respuesta incorrecta.`,
        `Túmbate ${p(5)}: ${g} te lame el cuello mientras te mete un dedo — 2 minutos.`,
      ],
      extremo: [
        `Desnúdate del todo. Quédate desnuda el resto de la partida.`,
        `Chupa la polla de ${g} hasta que acabe o 4 minutos — lo que antes.`,
        `Monta a ${g} y folla su polla 3 minutos al ritmo que él marque.`,
        `A cuatro patas: ${g} te folla o mete dedos hasta que te corras o 4 minutos.`,
        `Mastúrbate hasta correrte delante de ${g} cuando lo ordene.`,
        `Prohibido correrte hasta la siguiente ronda. Si pierdes otra vez, acabas dos veces.`,
        `${g} te ata las muñecas y te come el coño 3 minutos sin parar.`,
        `Pide ser azotada 10 veces. Después ${g} elige: polla en coño, boca o culo.`,
        `Correrte en la boca de ${g} o en su pecho — él elige.`,
        `Roleplay: eres su esclava sexual 3 minutos. Obedece sin negociar. Palabra de seguridad.`,
        `Facesitting 2 minutos si ambos queréis. ${g} te agarra del pelo si lo acordáis.`,
        `Follad en ${p(0)} 3 minutos. Cambiad de posición cuando ${g} diga.`,
        `Usa un juguete — o dedos — mientras ${g} mira y comenta en voz alta.`,
        `Desnúdate y quédate en la puerta como si llegaras de fuera. ${g} te «recibe».`,
        `Si pierdes otra ronda, ${g} elige dónde y cómo acabas.`,
      ],
    };
    return banks[intensity];
  }

  if (isHetero && role === "chico") {
    const banks = {
      suave: [
        `Quítate la camiseta ${p(0)} y pon la mano de ${g} sobre tu pecho acelerado.`,
        `Arrodíllate frente a ${g} y frota su muslo interno bajo la falda 30 segundos.`,
        `Empuja tu erección contra su coño ${p(1)} — ropa puesta — 45 segundos.`,
        `Susurrale cómo la follarías: posición, profundidad, dónde acabarías.`,
        `Guía su mano sobre tu polla por encima del pantalón 1 minuto.`,
        `Recorre su cuello con la boca hasta el borde del sujetador ${p(2)}.`,
        `Quítale el sujetador y chupa un pezón 30 segundos.`,
        `Siéntate en su regazo y frota tu polla contra ella ${p(3)}.`,
        `Confiesa tu fantasía más morbosa con ${g} sin censura.`,
        `Masaje en su espalda y culo 2 minutos — bragas abajo lo justo.`,
        `Beso con lengua 60 segundos mientras aprietas su culo.`,
        `Ponla contra la pared ${p(4)} y frota tu erección entre sus piernas.`,
        `Pide permiso para bajar su braga un centímetro cada 10 segundos — 30 segundos.`,
        `Acaricia tu polla frente a ${g} sin bajar el pantalón. Pregunta si quiere ver más.`,
        `Juego: ${g} te vendan los ojos 30 segundos y te toca donde quiera — ropa puesta.`,
      ],
      picante: [
        `Arrodíllate y lame el coño de ${g} 2 minutos. Ella dirige con la voz.`,
        `Saca la polla ${p(0)} y deja que ${g} te mire 45 segundos antes de tocarte.`,
        `Mete dos dedos en ${g} mientras le chupas un pezón — 2 minutos.`,
        `Frota tu polla contra su coño — braga apartada — 90 segundos ${p(1)}.`,
        `Ponte detrás de ${g} y frota entre sus nalgas mientras le mordisqueas el cuello.`,
        `Masturbación mutua 3 minutos: tú en su clítoris, ella en tu polla.`,
        `Simula follártela ${p(2)} agarrando tu polla y gimiendo 90 segundos.`,
        `Confiesa dónde quieres correrte: coño, boca, tetas o culo.`,
        `Ella te azota el culo 6 veces. Empuja hacia atrás pidiendo más.`,
        `Quítate el pantalón y quédate en ropa interior. ${g} te ordena cómo tocarte 2 minutos.`,
        `Lame su coño por encima y debajo de la braga hasta empaparla ${p(3)}.`,
        `Pide que te masturbe — guía su mano 2 minutos — sin correrte aún.`,
        `Roleplay: ${g} es tu jefa. Pide permiso para cada movimiento 2 minutos.`,
        `Chupa sus dedos y guíalos hacia tu polla ${p(4)}.`,
        `Descríbele en voz alta cómo te masturbas mientras lo demuestras 45 segundos.`,
      ],
      extremo: [
        `Desnúdate completo el resto de la partida. Polla dura cuando ${g} lo pida.`,
        `Folla a ${g} ${p(0)} 3 minutos. Cambiad si ella lo pide.`,
        `Cómele el coño hasta que se corra o 4 minutos.`,
        `Mastúrbate hasta correrte cuando ${g} lo ordene — en voz alta.`,
        `A perrito: follad ${p(1)} 3 minutos. Palabra de seguridad.`,
        `Prohibido correrte hasta la siguiente ronda. Si pierdes otra vez, acabas dos veces.`,
        `Correrte donde ${g} elija: boca, coño, tetas o culo.`,
        `Ella te hace una garganta profunda simulada con los dedos mientras te masturbas — o real si queréis.`,
        `Atadura suave: ${g} te ata y te masturba 3 minutos.`,
        `Roleplay: eres su juguete 3 minutos. Obedece sin negociar.`,
        `Follad en la ducha ${p(2)} 3 minutos si tenéis.`,
        `Penetración anal solo si lo acordáis — ${g} marca ritmo 2 minutos.`,
        `Grabación de audio mientras ${g} te masturba.`,
        `Si pierdes otra ronda, ${g} elige posición y lugar del orgasmo.`,
        `Maratón: ${g} te hace acabar y sigues duro — segunda ronda cuando ella diga.`,
      ],
    };
    return banks[intensity];
  }

  if (orient === "chico_chico") {
    const banks = {
      suave: [
        `Besad con lengua ${p(0)} 60 segundos. Manos en el culo del otro.`,
        `Frota pollas — ropa puesta — ${p(1)} 45 segundos.`,
        `Masaje en muslos y huevos de ${g} 2 minutos.`,
        `Susurrad tres fantasías gays con ${g} — detalle incluido.`,
        `Quítale el cinturón con los dientes ${p(2)}.`,
        `Guía su mano dentro de tu ropa interior 1 minuto. Intercambiad.`,
        `Ponte de espaldas y frota tu culo contra su erección ${p(3)}.`,
        `Confiesa cómo te masturbas pensando en ${g}.`,
        `Abrazad empujando erecciones ${p(4)} 45 segundos.`,
        `Lame su ombligo bajando hacia la polla — sin chupar aún — 30 segundos.`,
        `Masturbación mutua por encima del pantalón ${p(5)} 45 segundos.`,
        `Mordisquea su oreja mientras le aprietas la polla.`,
        `Juego: mirada fija 30 segundos sin reír mientras os tocáis.`,
        `Describe cómo quieres que ${g} te folle el culo.`,
        `Quítate una prenda que ${g} elija sin usar las manos.`,
      ],
      picante: [
        `Chupa la polla de ${g} ${p(0)} 2 minutos.`,
        `Masturbación mutua ${p(1)} 3 minutos al unísono.`,
        `Frota tu polla contra su culo — ropa apartada — 90 segundos.`,
        `69 ${p(2)} 2 minutos si cabéis.`,
        `Guía su dedo lubricado hacia tu culo mientras le susurras.`,
        `Azotes: 6 en las nalgas. Di «gracias» o «más».`,
        `Simula follarte a ${g} agarrando tu polla ${p(3)} 90 segundos.`,
        `Confiesa fantasía de correrte en su boca.`,
        `Quítate el pantalón. ${g} te ordena cómo masturbarte 2 minutos.`,
        `Lame sus huevos mientras le masturbas ${p(4)}.`,
        `Roleplay: sumiso y amo 2 minutos. ${g} manda.`,
        `Polla con polla ${p(5)} 1 minuto.`,
        `Pide que te folle con los dedos mientras le chupas.`,
        `Descríbele en voz alta cómo te masturbas — demuéstralo 45 segundos.`,
        `Frotad mutuamente hasta el borde — no correros.`,
      ],
      extremo: [
        `Desnúdate el resto de la partida.`,
        `Chupa hasta que ${g} acabe o 4 minutos.`,
        `Follad ${p(0)} 3 minutos. Palabra de seguridad.`,
        `Mastúrbate hasta correrte cuando ${g} lo ordene.`,
        `Prohibido correrte hasta la siguiente ronda.`,
        `Anal con lubricante si lo acordáis — ${p(1)} 3 minutos.`,
        `Correrte en boca o culo de ${g}.`,
        `69 hasta que uno se corra ${p(2)}.`,
        `Roleplay extremo: sumiso 3 minutos sin negociar.`,
        `Masturbación doble: una mano tuya y una suya en tu polla.`,
        `Si pierdes otra ronda, ${g} elige cómo acabas.`,
        `Grabación de audio de gemidos mientras os folláis.`,
        `Maratón: dos orgasmos seguidos cuando ${g} mande.`,
        `Atadura suave y masturbación de ${g} 3 minutos.`,
        `Follad en ${p(3)} hasta que ambos estéis al borde.`,
      ],
    };
    return banks[intensity];
  }

  // chica_chica
  const banks = {
    suave: [
      `Besad con lengua ${p(0)} 60 segundos. Mano bajo la falda.`,
      `Frota coños — ropa puesta — ${p(1)} 45 segundos.`,
      `Masaje en muslos internos de ${g} 2 minutos.`,
      `Confiesa tres fantasías lésbicas con ${g}.`,
      `Quítale el sujetador ${p(2)} y acaricia sus pechos.`,
      `Guía sus dedos en tu clítoris 1 minuto. Intercambiad.`,
      `Tribbing suave ${p(3)} 45 segundos.`,
      `Susurrale lo mojada que estás.`,
      `Mordisquea sus pezones alternando ${p(4)}.`,
      `Abrazad pegando caderas 45 segundos.`,
      `Huele su cuello y dime en voz alta qué te pone.`,
      `Juego: ${g} te vendan los ojos y te toca 30 segundos.`,
      `Describe cómo quieres que te coma el coño.`,
      `Quítate las bragas y dáselas a ${g}.`,
      `Acaricia tu pecho mirándola a los ojos ${p(5)}.`,
    ],
    picante: [
      `Lame el coño de ${g} ${p(0)} 2 minutos.`,
      `Masturbación mutua ${p(1)} 3 minutos — dedos en clítoris.`,
      `Tribbing piel con piel ${p(2)} 90 segundos.`,
      `69 ${p(3)} 2 minutos.`,
      `Mete dos dedos en ${g} mientras le chupas el clítoris.`,
      `Azotes: 6 nalgadas. Pide más si quieres.`,
      `Quítate el sujetador. ${g} te ordena cómo tocarte 2 minutos.`,
      `Simula lamer su coño en el aire ${p(4)} 45 segundos con sonidos.`,
      `Confiesa fantasía de correrte en su boca.`,
      `Frotad clítoris mutuamente ${p(5)} 2 minutos.`,
      `Roleplay: amante secreta 2 minutos.`,
      `Usa su muslo para frotar tu coño 90 segundos.`,
      `Pide que te ate las muñecas — suave — y te toque.`,
      `Descríbele cómo te masturbas — demuéstralo 45 segundos.`,
      `Besad y meted mano bajo ropa ${p(0)} 90 segundos.`,
    ],
    extremo: [
      `Desnúdate el resto de la partida.`,
      `Lame hasta que ${g} se corra o 4 minutos.`,
      `Tribbing hasta orgasmo ${p(1)} 3 minutos.`,
      `Mastúrbate hasta correrte cuando ${g} lo ordene.`,
      `Prohibido correrte hasta la siguiente ronda.`,
      `Dedos profundos y pulgar en clítoris ${p(2)} 3 minutos.`,
      `Correrte en su boca o muslo.`,
      `69 hasta orgasmo ${p(3)}.`,
      `Roleplay: su juguete 3 minutos.`,
      `Strap o dedos — lo que tengáis — ${p(4)} 3 minutos.`,
      `Si pierdes otra ronda, ${g} elige cómo acabas.`,
      `Facesitting 2 minutos si ambas queréis.`,
      `Maratón: dos orgasmos cuando ${g} mande.`,
      `Atadura suave y dedos de ${g} 3 minutos.`,
      `Frotad hasta correros una tras otra ${p(5)}.`,
    ],
  };
  return banks[intensity];
}

function getRemoteExtras(intensity, orient, role) {
  const isHetero = orient === "hetero";
  const isChica = role === "chica" || orient === "chica_chica";
  const g = "{ganador}";

  if (isHetero && isChica) {
    const banks = {
      suave: [
        `Acércate a la webcam y describe tu ropa interior. ${g} elige qué prenda quitas.`,
        `Susurra tres fantasías con ${g} mirando a la cámara.`,
        `Frota pezones por encima de la ropa 45 segundos. Dile lo dura que se te ponen.`,
        `Date la vuelta frente a la cámara y describe cómo te tocaría ${g}.`,
        `Imita besar a ${g} por videollamada 45 segundos.`,
        `Abre piernas un poco y acaricia muslo interno 1 minuto mirando a la cámara.`,
        `Quítate una prenda sin salir del encuadre — orden de ${g}.`,
        `Confiesa qué parte de ${g} echas de menos a distancia.`,
      ],
      picante: [
        `Quítate la ropa de arriba. ${g} te ordena cómo tocarte los pechos 2 minutos.`,
        `Mastúrbate frente a la cámara 2 minutos — ${g} guía por voz. No te corras.`,
        `Simula chupar a ${g} 90 segundos frente a la webcam.`,
        `Baja bragas lo justo para que vea tu coño 15 segundos.`,
        `Mete un dedo en la boca y pásalo por tu braga mientras gimes.`,
        `Segunda cámara en móvil: enseña tu coño desde abajo.`,
        `Roleplay: puta a distancia. Cuéntale qué harías por dinero.`,
        `Descríbele cómo quieres que te folle mientras te tocas 2 minutos.`,
        `Arrodíllate frente a la webcam y abre la boca. ${g} te dice qué imaginar.`,
        `Enseña tetas y pregunta si quiere que bajes más.`,
      ],
      extremo: [
        `Desnúdate completa frente a la webcam el resto de la partida.`,
        `Mastúrbate hasta el borde 3 minutos. No te corras sin permiso de ${g}.`,
        `Mete dos dedos en tu coño en cámara al ritmo que marque ${g}.`,
        `Correrte cuando ${g} lo ordene — mirándole, diciendo su nombre.`,
        `Prohibido correrte hasta la siguiente ronda.`,
        `Usa juguete o dedos — ${g} dirige 3 minutos.`,
        `Enseña culo a la webcam a cuatro 30 segundos.`,
        `Roleplay: esclava por videollamada 3 minutos.`,
        `Simula garganta profunda 2 minutos.`,
        `Si pierdes otra ronda, te corres dos veces en cámara cuando ${g} diga.`,
      ],
    };
    return banks[intensity];
  }

  if (isHetero && role === "chico") {
    const banks = {
      suave: [
        `Muestra el bulto en pantalón y frota 45 segundos mirando a ${g}.`,
        `Susurra qué harías con tu boca en el coño de ${g} si estuvierais juntos.`,
        `Quítate la camiseta frente a la cámara. ${g} elige dónde morderte.`,
        `Confiesa fantasía morbosa a distancia con ${g}.`,
        `Imita follar a ${g} en cámara 45 segundos.`,
        `Chupa tus dedos como si fuera su polla 45 segundos.`,
        `De rodillas frente a la webcam pide tres órdenes a ${g}.`,
        `Empuja cadera hacia la cámara frota polla por encima del pantalón.`,
      ],
      picante: [
        `Saca la polla. Mastúrbate 2 minutos al ritmo de ${g}. No te corras.`,
        `Quítate pantalón y ropa interior. Polla dura 45 segundos para ${g}.`,
        `Simula follar a ${g} en cámara 90 segundos gimiendo su nombre.`,
        `Lame dedos y frota cabeza de polla 1 minuto.`,
        `Segunda cámara: enseña polla y huevos.`,
        `Roleplay: jefe y empleado. Pide permiso para masturbarte 2 minutos.`,
        `De rodillas obedece órdenes de ${g} 2 minutos en cámara.`,
        `Descríbele cómo te correras en ella mientras te tocas 2 minutos.`,
        `Enseña el culo a la webcam 30 segundos.`,
        `Ponte de espaldas y masturbate mirando a ${g} 90 segundos.`,
      ],
      extremo: [
        `Desnúdate completo frente a la webcam el resto de la partida.`,
        `Mastúrbate 3 minutos hasta el borde. ${g} decide si acabas.`,
        `Folla tu mano mirando a ${g} 2 minutos.`,
        `Correrte en cámara cuando ${g} lo ordene — di dónde querrías en ella.`,
        `Prohibido correrte hasta la siguiente ronda.`,
        `Enseña culo a cuatro en webcam 45 segundos.`,
        `Roleplay: puto a distancia 3 minutos.`,
        `Simula follarte a ${g} 2 minutos.`,
        `Segunda cámara masturbándote desde abajo.`,
        `Si pierdes otra ronda, acabas dos veces en cámara.`,
      ],
    };
    return banks[intensity];
  }

  if (orient === "chico_chico") {
    const banks = {
      suave: [
        `Quítate camiseta y frota pecho mirando a ${g}.`,
        `Bulto en cámara — frota 45 segundos.`,
        `Imita chupar a ${g} 45 segundos.`,
        `Confiesa fantasía gay a distancia.`,
        `Masturbación guiada por voz de ${g} 1 minuto.`,
        `Date la vuelta y empuja culo hacia webcam.`,
        `Quítate prenda que ${g} elija.`,
        `Frota polla por encima del pantalón al ritmo de ${g}.`,
      ],
      picante: [
        `Saca polla y masturbate 2 minutos — ${g} guía.`,
        `Enseña culo a webcam 30 segundos.`,
        `Simula chupar a ${g} 90 segundos.`,
        `Masturbación mutua en videollamada 2 minutos al unísono.`,
        `Roleplay sumiso 2 minutos.`,
        `Frota polla contra almohada mirando a ${g}.`,
        `Quítate ropa entera. ${g} elige qué enseñar.`,
        `Lubricante en punta frente a cámara 1 minuto.`,
        `De rodillas empuja culo hacia webcam.`,
        `Descríbele cómo quieres que te folle mientras te tocas.`,
      ],
      extremo: [
        `Desnúdate completo el resto de la partida.`,
        `Masturbate 3 minutos hasta el borde.`,
        `Correrte en cámara cuando ${g} ordene.`,
        `Simula follar y ser follado 2 minutos alternando.`,
        `Prohibido correrte hasta la siguiente ronda.`,
        `Juguete anal en cámara si tienes — ${g} guía.`,
        `Segunda cámara polla y culo alternando.`,
        `Roleplay sumiso extremo 3 minutos.`,
        `Folla tu mano 2 minutos gimiendo su nombre.`,
        `Si pierdes otra ronda, acabas dos veces en cámara.`,
      ],
    };
    return banks[intensity];
  }

  const banks = {
    suave: [
      `Describe ropa interior en webcam. ${g} elige prenda.`,
      `Frota pezones 45 segundos mirando a ${g}.`,
      `Imita lamer a ${g} 45 segundos.`,
      `Confiesa fantasía lésbica a distancia.`,
      `Abre piernas y acaricia muslo 1 minuto.`,
      `Quítate sujetador bajo orden de ${g}.`,
      `Frota clítoris por encima de ropa 45 segundos.`,
      `Date la vuelta y empuja culo hacia cámara.`,
    ],
    picante: [
      `Quítate sujetador y bragas. ${g} ordena cómo tocarte 2 minutos.`,
      `Masturbate clítoris 2 minutos — ${g} guía.`,
      `Simula lamer a ${g} 90 segundos.`,
      `Segunda cámara entre piernas.`,
      `Roleplay amante virtual 2 minutos.`,
      `Tribbing contra almohada mirando a ${g}.`,
      `Quítate bragas y arrójalas a la cámara.`,
      `Mete dedo en boca y pasa por braga.`,
      `Enseña coño 15 segundos si te atreves.`,
      `Descríbele orgasmo que quieres darle cuando os veáis.`,
    ],
    extremo: [
      `Desnúdate completa el resto de la partida.`,
      `Masturbate 3 minutos hasta el borde.`,
      `Correrte en cámara cuando ${g} ordene.`,
      `Dos dedos en coño — ${g} guía.`,
      `Prohibido correrte hasta la siguiente ronda.`,
      `Simula 69 virtual 2 minutos.`,
      `Vibrador o ducha en cámara — ${g} dirige.`,
      `Enseña coño y culo alternando 1 minuto.`,
      `Roleplay juguete 3 minutos.`,
      `Si pierdes otra ronda, acabas dos veces en cámara.`,
    ],
  };
  return banks[intensity];
}

function buildExtras(source, mode) {
  const extra = { suave: {}, picante: {}, extremo: {} };
  const roles = [
    ["hetero", "chica"],
    ["hetero", "chico"],
    ["chico_chico", null],
    ["chica_chica", null],
  ];

  for (const intensity of ["suave", "picante", "extremo"]) {
    for (const [orient, role] of roles) {
      let current = 0;
      if (role) current = source[intensity]?.[orient]?.[role]?.length || 0;
      else current = source[intensity]?.[orient]?.length || 0;
      if (current >= TARGET) continue;

      const needed = TARGET - current;
      const base =
        mode === "home"
          ? getHomeExtras(intensity, orient, role) || []
          : getRemoteExtras(intensity, orient, role) || [];
      const batch =
        mode === "home"
          ? getHomeExtraBatch(intensity, orient, role)
          : getRemoteExtraBatch(intensity, orient, role);
      const bank = [...base, ...batch];
      const items = expandChallengeBank(bank, needed);
      const key = role ? `${orient}.${role}` : orient;
      appendToPath(extra[intensity], key.split("."), items.slice(0, needed));
    }
  }
  return extra;
}

function emit() {
  const ctx = loadCounts();
  const homeExtra = buildExtras(ctx.CHALLENGES, "home");
  const remoteExtra = buildExtras(ctx.REMOTE_CHALLENGES, "remote");

  const file = `// Expansión retos Casa y Webcam (mínimo ${TARGET} por categoría)
// Generado por generate-core-challenges.mjs

const CHALLENGES_HOME_EXTRA = ${JSON.stringify(homeExtra, null, 2)};

const CHALLENGES_REMOTE_EXTRA = ${JSON.stringify(remoteExtra, null, 2)};

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

(function applyCoreChallengesExpansion() {
  if (typeof CHALLENGES !== "undefined") mergeChallengeTrees(CHALLENGES, CHALLENGES_HOME_EXTRA);
  if (typeof REMOTE_CHALLENGES !== "undefined") mergeChallengeTrees(REMOTE_CHALLENGES, CHALLENGES_REMOTE_EXTRA);
})();
`;

  fs.writeFileSync(`${ROOT}/challenges-expansion.js`, file, "utf8");
  console.log("Written challenges-expansion.js (TARGET=" + TARGET + " per category)");
}

emit();
