// Retos de aire libre por ubicación (General = OUTDOOR_CHALLENGES en challenges.js)

const OUTDOOR_LOCATION_META = {
  general: { id: "general", name: "General", icon: "🌍", desc: "Todos los retos actuales" },
  coche: { id: "coche", name: "Coche", icon: "🚗", desc: "Aparcado o en marcha" },
  parque: { id: "parque", name: "Parque", icon: "🌳", desc: "Bancos, setos, senderos" },
  cine: { id: "cine", name: "Cine", icon: "🎬", desc: "Sala oscura, butacas" },
  playa: { id: "playa", name: "Playa", icon: "🏖️", desc: "Dunas, rocas, agua" },
  restaurante: { id: "restaurante", name: "Restaurante", icon: "🍽️", desc: "Mesa, terraza, baño" },
  parking: { id: "parking", name: "Parking", icon: "🅿️", desc: "Garaje, plazas, ascensor" },
};


const OUTDOOR_LOCATION_CHALLENGES = {
  "coche": {
    "suave": {
      "hetero": {
        "chica": [
          "En el copiloto, guía la mano de {ganador} por tu muslo interno 30 segundos con el coche aparcado y ventanillas arriba.",
          "Besad con lengua en el asiento trasero 30 segundos. Separad si pasan faros cerca.",
          "Susurrale qué harías en el asiento trasero si el parking estuviera vacío.",
          "Frota tu entrepierna contra la mano de {ganador} — ropa puesta — mientras ajustas el cinturón. 20 segundos.",
          "Confiesa tres fantasías en un coche: aparcado, noche, que os vean desde fuera…",
          "Pasa tus labios por su cuello y baja la mano hasta su entrepierna por encima del pantalón 15 segundos.",
          "Frota tu coño contra su pierna — ropa puesta — 30 segundos en silencio."
        ],
        "chico": [
          "En el coche aparcado, pon la mano de {ganador} sobre tu polla por encima del pantalón 25 segundos.",
          "Susurrale al oído qué harías con tu boca en el asiento trasero si no hubiera nadie.",
          "Besad con lengua 30 segundos. {ganador} vigila el retrovisor por si alguien se acerca.",
          "Confiesa dónde te morirías de follártela en un coche: aparcado, autopista de noche…",
          "Guía su mano bajo tu camiseta y sobre tu pecho mientras el motor está parado.",
          "Mete la mano de {ganador} sobre tu polla 20 segundos mirando el retrovisor."
        ]
      },
      "chico_chico": [
        "En el asiento trasero aparcado, frota vuestras pollas — ropa puesta — 30 segundos.",
        "Besad con lengua 30 segundos. Parar si alguien se acerca al coche.",
        "Susurrad fantasías en un coche mientras os tocáis el muslo mutuamente.",
        "Confesad dónde os excitaría que os vieran dentro del coche.",
        "Abrazad en el asiento trasero empujando erecciones la una contra la otra 45 segundos.",
        "Frota tu erección contra su culo — ropa puesta — en el asiento del copiloto 30 segundos."
      ],
      "chica_chica": [
        "En el copiloto, guía su mano bajo tu falda hacia el muslo 30 segundos — coche aparcado.",
        "Besad con lengua en el asiento trasero 30 segundos. Separación rápida si hay faros.",
        "Susurrale fantasías en un coche mientras frotais muslos.",
        "Confesad dónde os excitaría que os pillaran en el coche.",
        "Abrazad en el asiento trasero con manos en la cintura y caderas pegadas 45 segundos."
      ]
    },
    "picante": {
      "hetero": {
        "chica": [
          "Siéntate a horcajadas en el regazo de {ganador} en el asiento trasero y frota tu coño contra su polla — ropa puesta — 2 minutos.",
          "Baja las bragas en el coche y dáselas a {ganador}. Él mete la mano bajo tu falda 1 minuto mirando si pasa alguien.",
          "Mastúrbate discretamente en el copiloto mientras {ganador} mira el retrovisor. 90 segundos sin correrte.",
          "En el asiento trasero, sube la falda y deja que te toque el coño 90 segundos con ventanillas entornadas.",
          "Flash: enseña las tetas 5 segundos bajo la chaqueta en un parking con poca luz.",
          "Frota tu polla contra su coño — braga apartada — 1 minuto contra el volante inclinado.",
          "En el coche aparcado, chúpale la polla a {ganador} 90 segundos tapados con una chaqueta.",
          "Frota tu polla contra su culo — pantalones abajo — 1 minuto en el asiento trasero.",
          "Lame el coño de {ganador} en el asiento reclinado 90 segundos. Ventanillas arriba si hace falta.",
          "Quitad bragas y guardadla la una la otra hasta el final de la partida.",
          "Flash: enseñad tetas o coño 5 segundos bajo la chaqueta en parking con poca luz."
        ],
        "chico": [
          "En el coche aparcado, baja el pantalón lo justo y deja que {ganador} masturbe tu polla 2 minutos.",
          "Arrodíllate y saca la polla 15 segundos para que la vea. Sube rápido si hay luces.",
          "En el asiento trasero, ella te masturba bajo la chaqueta 2 minutos.",
          "Confiesa en voz alta la fantasía más morbosa en un coche mientras te toca.",
          "Flash: enseña tu polla dura 5 segundos con ventanilla entreabierta — solo si el parking está vacío.",
          "Arrodíllate en el suelo del coche entre sus piernas y simula chupar su polla — ropa puesta — 45 segundos.",
          "Saca la polla de {ganador} y mastúrbalo 2 minutos. Para si ves gente acercándose.",
          "Flash mutuo: enseñad las pollas 5 segundos cada uno en un parking vacío."
        ]
      },
      "chico_chico": [
        "Sacad las pollas en el asiento trasero y masturbad mutuamente 2 minutos mirando el retrovisor.",
        "69 en el asiento trasero 2 minutos si cabéis. Parar si alguien se acerca.",
        "Masturbación mutua con ventanillas bajadas cuando pase alguien lejos — 90 segundos.",
        "Confesad dónde os habéis tocado en un coche o dónde queréis correros."
      ],
      "chica_chica": [
        "Bajaos las bragas en el coche y frota vuestros coños — dedos o muslos — 2 minutos en el asiento trasero.",
        "Besad y meted mano bajo la ropa del otro 90 segundos mirando el retrovisor.",
        "Tribbing en el asiento trasero 2 minutos con ropa apartada lo justo.",
        "Confesad dónde os excitaría correrte en el coche con {ganador} mirando.",
        "Mete dos dedos en el coño de {ganador} en el asiento trasero mientras vigiláis el parking. 2 minutos."
      ]
    },
    "extremo": {
      "hetero": {
        "chica": [
          "En el coche aparcado: sexo oral completo — chúpale hasta 3 minutos o hasta que diga basta.",
          "Mastúrbate hasta correrte en el coche mientras {ganador} mira y vigila el parking.",
          "{ganador} te folla por detrás en el asiento trasero 3 minutos. Ventanas empañadas.",
          "Riesgo acordado: ventanillas sin tintar, frota o guía su polla dentro 90 segundos si pasa alguien lejos.",
          "Prohibido correrte hasta la siguiente ronda. Si pierdes otra vez, te corres en el coche donde elija {ganador}.",
          "Chúpale la polla hasta que acabe o 4 minutos en el coche aparcado.",
          "{ganador} te lame el coño hasta correrte o 4 minutos en el coche.",
          "Riesgo acordado: flash de coño o tetas 10 segundos con ventanilla entreabierta."
        ],
        "chico": [
          "Folla a {ganador} en el asiento trasero 3 minutos. Para si hay luces.",
          "Cómele el coño en el asiento reclinado hasta que se corra o 4 minutos.",
          "Mastúrbate hasta correrte en el coche mientras ella mira desde el copiloto.",
          "Ella te masturba hasta que acabes en su mano o boca — dentro del coche.",
          "Riesgo acordado: polla dentro o casi — 90 segundos con ventanillas bajadas. Parar si hay gente.",
          "Desnúdate de cintura para abajo 1 minuto en el asiento trasero. Ropa a mano.",
          "Si pierdes otra ronda, {ganador} elige dónde acabas en el coche.",
          "Monta a {ganador} en el asiento trasero y folla su polla 2 minutos. Para si hay luces cerca.",
          "A cuatro en el asiento trasero: dedos o polla — 3 minutos. Uno mira por la luneta.",
          "Riesgo acordado: pollas fuera 10 segundos con ventanilla bajada — parar si alguien se acerca."
        ]
      },
      "chico_chico": [
        "Follad en el asiento trasero 3 minutos. Ventanas arriba si hace falta.",
        "69 hasta que uno se corra o 3 minutos en el asiento trasero.",
        "Masturbad mutuamente hasta correros uno tras otro en el parking.",
        "Desnúdate en el coche y deja que {ganador} te folle o te chupe 3 minutos.",
        "Prohibido correrte hasta la siguiente ronda. Si pierdes otra vez, acabas en el coche."
      ],
      "chica_chica": [
        "Dedos, lengua o tribbing hasta orgasmo — 3 minutos en el asiento trasero.",
        "69 o dedos profundos 3 minutos hasta que una se corra.",
        "Una masturba a la otra hasta correrte mirando el retrovisor.",
        "Desnudas completas 1 minuto en el asiento trasero. Volved a vestir si hay luces.",
        "Si pierdes otra ronda, te corres donde {ganador} decida en el coche."
      ]
    }
  },
  "parque": {
    "suave": {
      "hetero": {
        "chica": [
          "En un banco del parque, mete la mano de {ganador} bajo tu chaqueta sobre el pecho 20 segundos.",
          "Detrás de un árbol, besad con lengua 30 segundos. Separad si alguien viene por el sendero.",
          "Susurrale qué harías en este césped si no hubiera nadie.",
          "Caminad de la mano y deja que te pellizque el culo al pasar junto a un desconocido.",
          "En un seto, abraza a {ganador} frotando entrepiernas — ropa puesta — 45 segundos.",
          "Confiesa tres rincones del parque donde te excitaría que te tocara.",
          "Caminad y frota tu polla contra su culo al pasar por una zona con poca luz.",
          "Besad en un seto 30 segundos. Frota coños — ropa puesta — 45 segundos."
        ],
        "chico": [
          "En un banco, pon tu mano en el muslo interno de {ganador} bajo su falda 30 segundos.",
          "Detrás de un árbol, empuja tu erección contra su coño — ropa puesta — 45 segundos.",
          "Susurrale qué parte de su cuerpo lamarías aquí en el parque.",
          "En un banco apartado, bésala en el cuello 20 segundos sin mirar a los lados.",
          "Confiesa dónde te morirías de follártela en un parque de noche.",
          "En un banco, mano de {ganador} sobre tu polla 20 segundos."
        ]
      },
      "chico_chico": [
        "Detrás de un árbol, besad 30 segundos y frota pollas — ropa puesta — 30 segundos.",
        "Confesad fantasías en un parque mientras camináis cogidos.",
        "Abrazad en un seto empujando erecciones 45 segundos.",
        "En un sendero apartado, masturbad mutuamente por encima del pantalón 90 segundos.",
        "Besad donde podáis ser vistos de lejos 20 segundos."
      ],
      "chica_chica": [
        "Guía su mano bajo tu ropa en un banco 30 segundos.",
        "Confesad dónde os excitaría que os pillaran en el parque.",
        "Mordisquea su cuello en un sendero apartado.",
        "En un banco de noche, mano bajo la ropa del otro 90 segundos.",
        "Abrazad pegando caderas en un rincón con poca luz."
      ]
    },
    "picante": {
      "hetero": {
        "chica": [
          "En un seto al anochecer, {ganador} te baja las bragas a las rodillas y te lame 1 minuto. Vigilad el camino.",
          "En un banco apartado, mastúrbate bajo la falda mientras {ganador} mira si pasa alguien. 90 segundos.",
          "Sube la falda en un rincón del parque y deja que te toque el coño 90 segundos.",
          "Flash: enseña las tetas 5 segundos bajo la chaqueta entre árboles.",
          "En el césped oculto por un seto, mastúrbalo 2 minutos.",
          "Confiesa el sitio más morboso del parque donde os habéis tocado o queréis hacerlo.",
          "Contra un árbol, levanta su falda y frota tu polla entre sus nalgas 1 minuto.",
          "En un seto, chúpale la polla 90 segundos en silencio.",
          "Frota tu polla contra su culo contra un árbol 1 minuto.",
          "Bajaos bragas en un banco y tocaos 2 minutos.",
          "Flash de tetas o coño 5 segundos entre árboles.",
          "Frotad coños en un seto 1 minuto con bragas apartadas."
        ],
        "chico": [
          "En el parque con poca luz, arrodíllate y saca la polla 15 segundos. Sube rápido si hay pasos.",
          "Mete dos dedos en su coño en un banco apartado mientras ella vigila. 2 minutos.",
          "Lame su coño detrás de un seto 90 segundos en silencio.",
          "Ella te masturba en un banco de noche bajo la chaqueta 2 minutos.",
          "Flash: enseña tu polla 5 segundos en un callejón del parque.",
          "Confiesa en voz alta una fantasía en el parque mientras te toca.",
          "Arrodíllate entre setos y simula chupar su polla — ropa puesta — 45 segundos.",
          "Lame su coño detrás de un seto 90 segundos."
        ]
      },
      "chico_chico": [
        "Masturbad mutuamente en un banco apartado 2 minutos.",
        "Flash mutuo entre árboles 5 segundos.",
        "En el césped oculto, Masturbación mutua 2 minutos.",
        "Confesad fantasía de follaros en el parque sin que os vean.",
        "Arrodíllate y mastúrbalo 90 segundos mirando el sendero."
      ],
      "chica_chica": [
        "Besad y mano bajo ropa 90 segundos en un banco apartado.",
        "Tribbing en el césped oculto 2 minutos.",
        "Confesad dónde os tocaríais en el parque de noche."
      ]
    },
    "extremo": {
      "hetero": {
        "chica": [
          "A cuatro tras un seto: {ganador} te folle o meta dedos 3 minutos. Uno vigila el sendero.",
          "Desnúdate completa 30 segundos tras un árbol. Vuelve a vestir si oís voces.",
          "Riesgo acordado: folla con {ganador} 90 segundos en un sitio visible de lejos. Parar si alguien se acerca.",
          "Mastúrbate hasta correrte en el césped mientras {ganador} mira.",
          "Prohibido correrte hasta la siguiente ronda. Si pierdes otra vez, te corres en el parque.",
          "{ganador} te folla contra un árbol 2 minutos. Palabra de seguridad."
        ],
        "chico": [
          "Cómele el coño detrás de un seto hasta que se corra o 4 minutos.",
          "Folla a {ganador} contra un árbol a perrito 2 minutos. Vigilad pasos.",
          "Desnúdate 1 minuto en el parque mientras {ganador} te toca. Ropa lista.",
          "Riesgo acordado: polla dentro 90 segundos en un claro del parque. Parar si hay gente.",
          "Mastúrbate hasta correrte junto a un banco de noche.",
          "Si pierdes otra ronda, {ganador} elige dónde acabas en el parque.",
          "Fóllala en el césped oculto 3 minutos. Palabra de seguridad.",
          "Riesgo acordado: pollas fuera 10 segundos en un claro."
        ]
      },
      "chico_chico": [
        "En un seto, chúpale hasta que acabe o 4 minutos.",
        "Follad contra un árbol 2 minutos. Vigilad el sendero.",
        "69 en el césped oculto 3 minutos.",
        "Masturbad hasta correros tras un seto.",
        "Desnúdate y deja que te folle 3 minutos en el parque.",
        "Prohibido correrte hasta la siguiente ronda.",
        "Arrodíllate y chupa su polla hasta que acabe o 4 minutos en un rincón del parque."
      ],
      "chica_chica": [
        "Lame hasta orgasmo detrás de un seto 4 minutos.",
        "Dedos o tribbing hasta correrte en el césped 3 minutos.",
        "Sexo oral en un seto 2 minutos.",
        "Desnudas 1 minuto tras un árbol, tocad mutuamente.",
        "Riesgo acordado: flash 10 segundos en un claro del parque.",
        "Correrte donde {ganador} decida en el parque si pierdes otra ronda.",
        "69 en el césped hasta orgasmo 3 minutos."
      ]
    }
  },
  "cine": {
    "suave": {
      "hetero": {
        "chica": [
          "En la fila de atrás, guía la mano de {ganador} por tu muslo interno 30 segundos mientras la película empieza.",
          "Susurrale al oído qué harías si la sala estuviera casi vacía.",
          "Comparte palomitas y deja que sus dedos rocen tu pecho por encima de la ropa 20 segundos.",
          "Besad en la penumbra 20 segundos. Separad si entra alguien a vuestra fila.",
          "Confiesa tres fantasías en un cine: fila de atrás, baño, mano bajo la ropa…",
          "Cruza las piernas rozando su mano mientras finges mirar la pantalla.",
          "Frota tu coño contra su pierna — ropa puesta — 30 segundos."
        ],
        "chico": [
          "En el cine, pon la mano de {ganador} sobre tu polla por encima del pantalón 20 segundos en la oscuridad.",
          "Susurrale qué parte de su cuerpo lamerías en la butaca.",
          "Frota tu erección contra su muslo — ropa puesta — 30 segundos en silencio.",
          "Besad discretamente 20 segundos cuando baje la luz de la sala.",
          "Confiesa dónde te excitaría que te tocase en un cine.",
          "Pasa tu brazo por su hombro y baja la mano hasta su cintura bajo la chaqueta.",
          "Mano de {ganador} sobre tu polla 20 segundos bajo la chaqueta."
        ]
      },
      "chico_chico": [
        "En la fila de atrás, frota vuestras pollas — ropa puesta — 30 segundos en la oscuridad.",
        "Besad 20 segundos cuando baje la luz. Parar si alguien se sienta cerca.",
        "Susurrad fantasías en el cine mientras os tocáis el muslo.",
        "Confesad dónde os excitaría que os pillaran en la sala.",
        "Abrazad en la butaca con erecciones rozando 45 segundos."
      ],
      "chica_chica": [
        "En la fila de atrás, guía su mano bajo tu falda al muslo 30 segundos.",
        "Besad en la penumbra 20 segundos. Separación si entra gente.",
        "Susurrale fantasías en el cine mientras frotais muslos.",
        "Confesad dónde os excitaría que os vieran besándoos.",
        "Abrazad en la butaca con caderas pegadas 45 segundos."
      ]
    },
    "picante": {
      "hetero": {
        "chica": [
          "Mete la mano de {ganador} bajo tu falda en la fila de atrás 1 minuto mientras la pantalla ilumina poco.",
          "Mastúrbate discretamente en la butaca 90 segundos. {ganador} vigila la fila.",
          "Quítate las bragas en el baño del cine y vuelve. Cruza las piernas rozándole la mano 2 minutos.",
          "En el baño del cine: dale un beso y métale la mano bajo su falda 30 segundos.",
          "Flash: enseña las tetas 3 segundos en la oscuridad cuando {ganador} diga.",
          "Frota tu polla contra su mano en el descanso — ropa apartada lo justo — 1 minuto.",
          "En el baño del cine, chúpale la polla 90 segundos en silencio.",
          "Quitad bragas en el baño y volved — dedos discretos 2 minutos."
        ],
        "chico": [
          "Mete dos dedos en su braga en la fila de atrás 90 segundos en silencio.",
          "Ella te masturba bajo la chaqueta 2 minutos en la penumbra.",
          "En el baño del cine, lame su coño 90 segundos. Salid con intervalo.",
          "Arrodíllate un segundo en el baño y pide que te guíe — obedece 2 minutos lo que diga.",
          "Confiesa en voz baja en la butaca la fantasía más morbosa del cine.",
          "Flash: enseña tu polla 3 segundos bajo la chaqueta en la fila vacía.",
          "Simula chupar su polla — ropa puesta — inclinada hacia su regazo 45 segundos.",
          "Saca la polla de {ganador} bajo la chaqueta y mastúrbalo 90 segundos.",
          "En el baño del cine, lame su coño 90 segundos."
        ]
      },
      "chico_chico": [
        "Masturbad mutuamente en la fila de atrás 2 minutos bajo chaquetas.",
        "Frota tu polla contra la suya en la butaca 1 minuto.",
        "69 en el baño del cine 2 minutos si cabéis.",
        "Confesad fantasía de follaros en la sala vacía.",
        "Sacad las pollas bajo la chaqueta 90 segundos en la penumbra.",
        "Flash mutuo 3 segundos en el baño del cine."
      ],
      "chica_chica": [
        "Meted mano bajo la ropa del otro en la fila de atrás 90 segundos.",
        "Tribbing en la butaca reclinada 2 minutos con ropa apartada lo justo.",
        "Besad con lengua cuando baje la luz 45 segundos.",
        "Confesad dónde os correrte en un cine si os atrevierais.",
        "Flash de tetas 3 segundos en la oscuridad."
      ]
    },
    "extremo": {
      "hetero": {
        "chica": [
          "Sexo oral en el baño del cine 3 minutos en silencio.",
          "Mastúrbate hasta correrte en la butaca mientras {ganador} tapa con su chaqueta.",
          "Arrodíllate en el baño y chúpale hasta que acabe o 4 minutos.",
          "Prohibido correrte hasta la siguiente ronda. Si pierdes otra vez, en el cine.",
          "{ganador} te folla en el baño del cine 2 minutos. Palabra de seguridad."
        ],
        "chico": [
          "Folla a {ganador} en el baño del cine 2 minutos en silencio.",
          "Cómele el coño en el baño hasta que se corra o 4 minutos.",
          "Ella te hace correrte en su mano en la fila de atrás bajo la chaqueta.",
          "Riesgo acordado: sexo rápido en el baño 90 segundos.",
          "Mastúrbate hasta correrte en la butaca mientras ella mira la puerta.",
          "Si pierdes otra ronda, acabas donde {ganador} elija en el cine.",
          "Desnúdate de cintura para abajo en el baño 30 segundos mientras ella toca.",
          "Monta su regazo en la fila de atrás y folla su polla — o frota hasta dentro — 2 minutos en penumbra.",
          "Riesgo acordado: mano o polla dentro en la fila vacía 90 segundos. Parar si entra gente.",
          "Riesgo acordado: pollas fuera en la penumbra 10 segundos."
        ]
      },
      "chico_chico": [
        "Follad en el baño del cine 3 minutos.",
        "Chúpale hasta que acabe en el baño 4 minutos.",
        "69 en la fila de atrás 3 minutos si la sala está vacía.",
        "Correros mutuamente en el baño uno tras otro.",
        "Prohibido correrte hasta la siguiente ronda.",
        "Desnúdate en el baño y deja que te folle 3 minutos."
      ],
      "chica_chica": [
        "Orgasmo con lengua en el baño del cine 4 minutos.",
        "Dedos o tribbing en la fila de atrás hasta correrte 3 minutos.",
        "Sexo oral en el baño 2 minutos.",
        "Desnudas 30 segundos en el baño, tocad mutuamente.",
        "Riesgo acordado: flash 10 segundos en la penumbra.",
        "Si pierdes otra ronda, te corres en el cine.",
        "69 hasta orgasmo 3 minutos en fila vacía."
      ]
    }
  },
  "playa": {
    "suave": {
      "hetero": {
        "chica": [
          "Tras una duna, besad con lengua 30 segundos. Separad si oís pasos en la arena.",
          "Susurrale qué harías bajo el parasol si no hubiera bañistas cerca.",
          "En la orilla, guía su mano sobre tu bikini 20 segundos.",
          "Caminad por la arena de la mano y deja que te pellizque el culo al pasar alguien.",
          "Confiesa tres fantasías en la playa: dunas, noche, agua…",
          "Frota tu entrepierna contra su muslo en la toalla — ropa de baño puesta — 30 segundos.",
          "Frota coños — bikini puesto — 30 segundos en la toalla."
        ],
        "chico": [
          "Susurrale qué parte de su cuerpo lamerías en la arena.",
          "En la toalla, pon tu mano bajo su bikini en el muslo 30 segundos.",
          "Confiesa dónde te morirías de follártela en la playa.",
          "Besad en la duna 30 segundos mirando si viene alguien.",
          "Ajusta tu erección en el bañador delante de ella 15 segundos sin disimular del todo.",
          "Mano sobre tu polla en la toalla 20 segundos."
        ]
      },
      "chico_chico": [
        "En la duna, frota pollas — bañador puesto — 30 segundos.",
        "Besad 30 segundos tras una roca. Parar si oís pasos.",
        "Susurrad fantasías en la playa mientras camináis.",
        "Confesad dónde os excitaría que os vieran en la arena.",
        "Abrazad en el agua poco profunda rozando erecciones 45 segundos.",
        "Tras una roca, abraza a {ganador} empujando erección contra su culo — bañador puesto — 45 segundos."
      ],
      "chica_chica": [
        "En la toalla, guía su mano bajo tu bikini 30 segundos.",
        "Besad tras una duna 30 segundos.",
        "Susurrale fantasías en la playa mientras frotais muslos.",
        "Confesad dónde os pillarían en la playa.",
        "Abrazad en el agua con caderas pegadas 45 segundos."
      ]
    },
    "picante": {
      "hetero": {
        "chica": [
          "Tras una roca, quítate el bikini arriba y deja que chupe tus pezones 1 minuto.",
          "En la duna, baja el bikini abajo y deja que te toque 90 segundos. Toalla lista.",
          "Mastúrbate en la toalla bajo el pareo 90 segundos mientras {ganador} mira la playa.",
          "En el agua poco profunda, frota tu coño contra su mano 1 minuto.",
          "Flash: enseña las tetas 5 segundos tras la duna.",
          "Mastúrbalo bajo la toalla 2 minutos.",
          "Frota tu polla contra su bikini 1 minuto en la arena oculta.",
          "En la roca, chúpale la polla 90 segundos.",
          "Flash de tetas o coño 5 segundos tras la roca.",
          "Frotad coños en el agua poco profunda 1 minuto."
        ],
        "chico": [
          "Quítate el bañador abajo tras la duna y deja que te masturbe 90 segundos.",
          "Lame su coño tras la roca 90 segundos. Vigilad bañistas.",
          "Arrodíllate y saca la polla 15 segundos. Cubre con toalla si hay gente.",
          "Mete dedos bajo su bikini 2 minutos en la duna.",
          "Confiesa fantasía en la playa en voz baja.",
          "Flash: enseña tu polla 5 segundos tras la roca.",
          "Simula chupar su polla bajo el parasol — ropa puesta — 45 segundos.",
          "Lame su coño en la duna 90 segundos."
        ]
      },
      "chico_chico": [
        "Masturbad mutuamente tras la duna 2 minutos. Cubrid si oís pasos.",
        "Bajaos el bañador y frota pollas 1 minuto en la arena.",
        "Masturbación mutua bajo la toalla 2 minutos.",
        "Confesad fantasía en la playa de noche.",
        "Flash mutuo 5 segundos tras la duna.",
        "En el agua, masturbad mutuamente 90 segundos."
      ],
      "chica_chica": [
        "Quitaos bikini abajo tras la roca y tocaos 2 minutos.",
        "Tribbing en la toalla 2 minutos bajo pareos.",
        "Besad y mano bajo bikini 90 segundos.",
        "Confesad dónde os correrte en la playa."
      ]
    },
    "extremo": {
      "hetero": {
        "chica": [
          "Desnúdate completa 30 segundos tras la duna frente a {ganador}. Viste si oís voces.",
          "Mastúrbate hasta correrte en la toalla mientras {ganador} vigila.",
          "Riesgo acordado: folla con {ganador} 90 segundos en la duna visible de lejos.",
          "Sexo en el agua poco profunda 2 minutos. Palabra de seguridad.",
          "Prohibido correrte hasta la siguiente ronda.",
          "{ganador} te folla en la arena oculta 2 minutos."
        ],
        "chico": [
          "Folla a {ganador} tras la duna 2 minutos.",
          "Cómele el coño hasta orgasmo tras la roca 4 minutos.",
          "Mastúrbate hasta correrte en la duna mientras ella mira.",
          "Desnúdate 1 minuto en la playa de noche.",
          "Riesgo acordado: polla dentro 90 segundos en la arena.",
          "Si pierdes otra ronda, acabas en la playa.",
          "Correrte en su mano bajo la toalla.",
          "Riesgo acordado: pollas fuera 10 segundos en la duna."
        ]
      },
      "chico_chico": [
        "Follad tras la duna 3 minutos.",
        "Oral hasta correrte en la roca 4 minutos.",
        "Masturbad hasta correros en la playa de noche.",
        "69 en la toalla 3 minutos.",
        "Prohibido correrte hasta la siguiente ronda.",
        "Desnúdate y follad en el agua 2 minutos.",
        "Arrodíllate y chupa su polla tras la roca hasta que acabe o 4 minutos."
      ],
      "chica_chica": [
        "Orgasmo con lengua en la duna 4 minutos.",
        "Desnudas completas 1 minuto bajo la duna.",
        "Tribbing hasta correrte en la toalla 3 minutos.",
        "Sexo oral tras la roca 2 minutos.",
        "Riesgo acordado: flash 10 segundos en la playa.",
        "Si pierdes otra ronda, te corres en la playa.",
        "Dedos profundos en el agua 3 minutos."
      ]
    }
  },
  "restaurante": {
    "suave": {
      "hetero": {
        "chica": [
          "Bajo la mesa, roza su pie con tu pierna desnuda 30 segundos sin mirarle.",
          "Susurrale al oído qué harías en el baño de este restaurante.",
          "En la terraza, guía su mano sobre tu muslo bajo el mantel 20 segundos.",
          "Confiesa tres fantasías en un restaurante: baño, terraza, bajo la mesa…",
          "Pasa tus dedos por su nuca mientras pedís la cuenta.",
          "Quítate las bragas en el baño y vuelve a la mesa. Cruza las piernas mirando a {ganador}."
        ],
        "chico": [
          "Bajo el mantel, pon tu mano en el muslo interno de {ganador} 30 segundos.",
          "Susurrale qué parte de su cuerpo lamerías en el baño del local.",
          "En un rincón de la terraza, bésala en el cuello 20 segundos.",
          "Confiesa dónde te excitaría tocártela en un restaurante.",
          "Roza tu erección contra su pie bajo la mesa 15 segundos.",
          "Guíala al baño y susurra qué harías si entrarais juntos.",
          "Bajo la mesa, roza vuestras piernas y pollas — ropa puesta — 30 segundos."
        ]
      },
      "chico_chico": [
        "Susurrad fantasías en la terraza del restaurante.",
        "Besad discretamente en un rincón al salir al baño 20 segundos.",
        "Mano de {ganador} sobre tu muslo bajo el mantel 20 segundos.",
        "Confesad dónde os excitaría que os pillaran en un restaurante.",
        "Abrazad en la calle al salir rozando erecciones 30 segundos."
      ],
      "chica_chica": [
        "Bajo el mantel, guía su mano a tu muslo 30 segundos.",
        "Susurrale fantasías en la terraza.",
        "Besad en el baño un segundo al cruzaros — 20 segundos si está vacío.",
        "Frota muslos bajo la mesa 30 segundos.",
        "Confesad dónde os tocaríais en un restaurante.",
        "Abrazad en la terraza con caderas pegadas 30 segundos."
      ]
    },
    "picante": {
      "hetero": {
        "chica": [
          "En el baño del restaurante: quítate las bragas y dáselas a {ganador}. Él mete la mano bajo tu falda al volver 1 minuto.",
          "Bajo el mantel, mastúrbalo por encima del pantalón 90 segundos.",
          "En el cubículo del baño, besad y métale la mano bajo su falda 30 segundos.",
          "Mastúrbate discretamente en el baño 90 segundos. {ganador} hace de lookout en la puerta.",
          "En la terraza de noche, mano en su entrepierna 2 minutos.",
          "Flash: enseña las tetas 3 segundos en el baño si está vacío.",
          "En el baño, frota tu polla contra ella 1 minuto contra la pared.",
          "En el baño del restaurante, chúpale la polla 90 segundos.",
          "Quitad bragas en el baño y volved — dedos discretos 2 minutos."
        ],
        "chico": [
          "En el baño, lame su coño 90 segundos en silencio. Salid por separado.",
          "Mete dedos bajo su falda bajo el mantel 2 minutos.",
          "Ella te masturba bajo la chaqueta en la terraza 2 minutos.",
          "Confiesa fantasía en el restaurante mientras come.",
          "Saca la polla 10 segundos en el baño para que la vea.",
          "Pide permiso bajo la mesa y obedece lo que diga 2 minutos.",
          "Simula chupar su polla bajo la mesa — inclinada — 45 segundos con mantel largo.",
          "Besad en la terraza y mano en la polla 90 segundos.",
          "En el baño, lame su coño 90 segundos."
        ]
      },
      "chico_chico": [
        "Masturbad mutuamente en el cubículo 2 minutos.",
        "Masturbación mutua bajo el mantel 90 segundos.",
        "Confesad fantasía de follaros en el baño del local.",
        "Sacad las pollas en el baño 90 segundos si está vacío.",
        "Flash mutuo 3 segundos en el baño."
      ],
      "chica_chica": [
        "Manos bajo la ropa bajo el mantel 2 minutos.",
        "Tribbing en el baño grande 90 segundos si cabéis.",
        "Besad en la terraza con mano bajo falda 90 segundos.",
        "Confesad dónde os correrte en un restaurante.",
        "Flash de tetas 3 segundos en el baño."
      ]
    },
    "extremo": {
      "hetero": {
        "chica": [
          "Sexo oral en el cubículo del baño 3 minutos en silencio.",
          "Monta su regazo en el baño o folla contra la pared 2 minutos.",
          "Mastúrbate hasta correrte en el baño mientras {ganador} vigila.",
          "Arrodíllate en el baño y chúpale hasta que acabe.",
          "Prohibido correrte hasta la siguiente ronda.",
          "Follad en el baño del restaurante 2 minutos. Palabra de seguridad."
        ],
        "chico": [
          "Folla a {ganador} en el baño 2 minutos.",
          "Cómele el coño en el cubículo 4 minutos.",
          "Correrte en su mano en el baño.",
          "Riesgo acordado: sexo rápido en el baño 90 segundos.",
          "Desnúdate de cintura para abajo en el baño 30 segundos.",
          "Si pierdes otra ronda, acabas en el restaurante.",
          "Ella te masturba hasta correrte bajo el mantel.",
          "Riesgo acordado: dedos o polla bajo el mantel hasta casi correrte 90 segundos.",
          "Riesgo acordado: pollas fuera 10 segundos en el baño vacío."
        ]
      },
      "chico_chico": [
        "Follad en el baño 3 minutos.",
        "Oral hasta correrte en el cubículo 4 minutos.",
        "69 en el baño 2 minutos.",
        "Correros mutuamente en el baño.",
        "Prohibido correrte hasta la siguiente ronda.",
        "Sexo en el baño del restaurante 2 minutos."
      ],
      "chica_chica": [
        "Orgasmo con lengua en el baño 4 minutos.",
        "Dedos profundos en el cubículo 3 minutos.",
        "Tribbing en el baño 2 minutos.",
        "Desnudas 30 segundos en el baño, tocad mutuamente.",
        "Riesgo acordado: flash 10 segundos al salir a la terraza.",
        "Si pierdes otra ronda, te corres en el restaurante.",
        "69 en el baño 3 minutos."
      ]
    }
  },
  "parking": {
    "suave": {
      "hetero": {
        "chica": [
          "En el ascensor del parking, bésalo en el cuello 15 segundos si estáis solos.",
          "Susurrale qué harías entre coches si la planta estuviera vacía.",
          "Camina delante de él por la rampa rozando tu culo contra su mano 20 segundos.",
          "Confiesa tres fantasías en un parking: ascensor, coche, escalera…",
          "En una plaza vacía, abraza a {ganador} frotando entrepiernas 45 segundos.",
          "Detrás de una columna, guía su mano sobre tu pecho 20 segundos.",
          "Entre coches, frota muslos y coños — ropa puesta — 30 segundos."
        ],
        "chico": [
          "Susurrale en el ascensor qué harías si se parara entre plantas.",
          "Confiesa dónde te excitaría follártela en un garaje.",
          "En la escalera del parking, bésala 20 segundos sin mirar cámaras.",
          "Guía su mano sobre tu polla en un rincón entre coches 15 segundos.",
          "Detrás de un pilar, abraza y frota entrepiernas 45 segundos.",
          "Mano sobre tu polla detrás de un pilar 20 segundos."
        ]
      },
      "chico_chico": [
        "En el ascensor del parking, besad 20 segundos si estáis solos.",
        "Entre coches, frota pollas — ropa puesta — 30 segundos.",
        "Susurrad fantasías en el parking vacío.",
        "Confesad dónde os excitaría que os pillaran en el garaje.",
        "Abrazad en una plaza vacía empujando erecciones 45 segundos.",
        "En el parking vacío, empuja tu erección contra su culo — ropa puesta — 30 segundos."
      ],
      "chica_chica": [
        "En el ascensor, besad 20 segundos si estáis solas.",
        "Susurrale fantasías en el parking.",
        "Guía su mano bajo tu ropa detrás de un pilar 20 segundos.",
        "Confesad dónde os tocaríais en el garaje.",
        "Abrazad en la rampa con caderas pegadas 30 segundos."
      ]
    },
    "picante": {
      "hetero": {
        "chica": [
          "En el ascensor del parking, abre tu braga y guía su mano 30 segundos hasta que abra puertas.",
          "Entre coches, sube la falda y deja que te toque 90 segundos mirando si viene alguien.",
          "En el coche en una plaza, mastúrbalo 2 minutos.",
          "En la escalera del parking, mano bajo tu falda 1 minuto.",
          "Flash: enseña las tetas 5 segundos entre columnas.",
          "Mastúrbate en el coche del parking 90 segundos.",
          "En el ascensor, frota tu polla contra ella 30 segundos hasta que suene el piso.",
          "En el coche en una plaza, chúpale la polla 90 segundos.",
          "Frota tu polla contra su culo contra un vehículo 1 minuto.",
          "Quitad bragas en el baño del parking si hay."
        ],
        "chico": [
          "Contra un coche, mete dedos bajo su braga 90 segundos.",
          "En la plaza vacía, baja el pantalón lo justo — 15 segundos — para que vea.",
          "Lame su coño en el coche en una plaza 90 segundos.",
          "Ella te masturba en el asiento trasero 2 minutos.",
          "Confiesa fantasía en el parking en voz baja.",
          "Flash: enseña tu polla 5 segundos entre coches.",
          "Simula chupar su polla inclinada en el asiento — ropa puesta — 45 segundos.",
          "Entre columnas, lame su coño contra el coche 90 segundos — braga apartada."
        ]
      },
      "chico_chico": [
        "En el ascensor, masturbad mutuamente 30 segundos si está vacío.",
        "Entre coches, Masturbación mutua 2 minutos.",
        "Sacad las pollas en el coche 2 minutos mirando la rampa.",
        "Flash mutuo 5 segundos en planta vacía.",
        "Confesad fantasía en el garaje."
      ],
      "chica_chica": [
        "En el ascensor, mano bajo ropa 30 segundos.",
        "En el coche, tocaos mutuamente 2 minutos.",
        "Tribbing en el asiento trasero 2 minutos.",
        "Flash de tetas 5 segundos en planta vacía.",
        "Besad y dedos bajo falda en la escalera 90 segundos."
      ]
    },
    "extremo": {
      "hetero": {
        "chica": [
          "En el coche en una plaza: monta o folla 2 minutos. Para si hay luces.",
          "Sexo oral en el ascensor entre plantas 30 segundos si está vacío — o en el coche 3 minutos.",
          "Mastúrbate hasta correrte en el parking mientras {ganador} vigila la rampa.",
          "Riesgo acordado: sexo entre coches 90 segundos en planta semi-vacía.",
          "Arrodíllate entre coches y chúpale hasta que acabe.",
          "Prohibido correrte hasta la siguiente ronda.",
          "{ganador} te folla en el asiento trasero 3 minutos."
        ],
        "chico": [
          "Folla a {ganador} en el coche en el parking 3 minutos.",
          "Cómele el coño en el coche 4 minutos.",
          "Correrte en su mano en la plaza vacía.",
          "Riesgo acordado: polla dentro entre columnas 90 segundos.",
          "Desnúdate 1 minuto en planta vacía mientras ella vigila.",
          "Si pierdes otra ronda, acabas en el parking.",
          "Sexo en la escalera del garaje 2 minutos si está vacía.",
          "Riesgo acordado: pollas fuera 10 segundos en el parking."
        ]
      },
      "chico_chico": [
        "Follad en el coche 3 minutos en una plaza.",
        "Oral en el ascensor o coche 4 minutos.",
        "69 en el asiento trasero 3 minutos.",
        "Correros en planta vacía uno tras otro.",
        "Prohibido correrte hasta la siguiente ronda.",
        "Follad entre coches 2 minutos."
      ],
      "chica_chica": [
        "Orgasmo en el coche 4 minutos.",
        "Dedos en el ascensor 30 segundos o en el coche 3 minutos.",
        "Tribbing en plaza vacía 3 minutos.",
        "Sexo oral en el coche 2 minutos.",
        "Riesgo acordado: flash 10 segundos en el garaje.",
        "Si pierdes otra ronda, te corres en el parking.",
        "Desnudas 1 minuto en planta vacía."
      ]
    }
  }
};
;
;
;
;
;
