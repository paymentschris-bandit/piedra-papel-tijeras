/** Utilidades compartidas (generador Node). La app usa la misma lógica en challenges.js */

export const SWINGER_GROUP_RE =
  /Pareja B|pareja ajena|pareja invitada os mira|los cuatro|los dos chicos|las dos chicas|las chicas se|los chicos reciben|tres parejas|seis personas|cinco personas|parejas cruzadas|Intercambio completo|intercambio total|dos parejas en|dos parejas,|dos parejas —|chicos en círculo|chicas en el centro|chicas al centro|orgía mixta|vuestros chicos|los chicos forman|los chicos se masturban|las tres chicas|intercambiad bragas|intercambiad calzoncillos|intercambio con Pareja B|intercambio de pareja una ronda|intercambio de manos con Pareja B|intercambio oral:|intercambio de masturbación con Pareja B|intercambio suave en .* con Pareja B|otra pareja gay|otra pareja lésbica|intercambio con pareja lésbica|intercambio con pareja gay|cinco personas|orgía suave en círculo: cada uno toca|grabación consensuada solo cuerpos mientras intercambiáis caricias con Pareja B|\bel otro chico\b|\bla otra chica\b|roleplay de presentación swinger|simula sexo con el otro chico|simula sexo con la otra chica|tú montas al otro chico|swap cruzado/i;

export function isSwingerGroupChallenge(text) {
  return SWINGER_GROUP_RE.test(text);
}

export function fixChicaGender(text) {
  return text
    .replace(/\bte masturba\b/gi, "te masturba con la mano")
    .replace(/\brecibes masturbación\b/gi, "recibes masturbación con la mano")
    .replace(/\bmientras vuestros chicos miran\b/gi, "mientras {ganador} mira");
}

export function splitParejaGrupo(list, loserGender) {
  const pareja = [];
  const grupo = [];
  for (const text of list) {
    const fixed = loserGender === "chica" ? fixChicaGender(text) : text;
    if (isSwingerGroupChallenge(fixed)) grupo.push(fixed);
    else pareja.push(fixed);
  }
  return { pareja, grupo };
}
