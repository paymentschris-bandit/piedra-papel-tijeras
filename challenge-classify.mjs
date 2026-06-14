/**
 * Clasificación de retos por orientación / anatomía / perspectiva.
 * Extraído de audit-orientation-challenges.mjs para reutilizar en bancos y validación.
 */
import { isSwingerGroupChallenge } from "./swinger-challenge-utils.mjs";

export function analyzeText(text) {
  const t = text;
  const l = t.toLowerCase();

  const maleAnat =
    /\b(polla|pollas|pene|erecci[oó]n|bragueta|huevos|calzoncillos|semen)\b/i.test(t);
  const femaleAnat =
    /\b(co[nñ]o|co[nñ]os|cl[ií]toris|braga|bragas|sujetador|labios vagin|punto g)\b/i.test(t);

  const gayExclusive =
    /\b(polla con polla|polla contra polla|polla con la suya|vuestras pollas|frotad? pollas|sacad las pollas|sacad.*pollas|masturbaci[oó]n mutua.*polla|contra la suya|pollas —|pollas,|paja mutua|cada uno en la polla del otro|chup[aá] su polla.*(?:mientras|y la tuya)|69.*polla|polla — polla|follad —|follad o|uno folla al otro)\b/i.test(
      t
    ) || /\b(chico_chico|fantas[ií]as gay)\b/i.test(t);

  const lesbianExclusive =
    /\b(tribbing|frotad co[nñ]os|co[nñ]o.*co[nñ]o|vuestros co[nñ]os|co[nñ]os —|l[eé]sbic|cl[ií]toris.*cl[ií]toris|dedos en el co[nñ]o de la otra|chica_chica|fantas[ií]as l[eé]sbicas|69.*co[nñ]o)\b/i.test(
      t
    );

  const femaleLoserPOV =
    /\b(tu co[nñ]o|tu braga|tu sujetador|qu[ií]tate.*bragas|qu[ií]tate el sujetador|mojada|empapada|tus pezones|si[eé]ntate.*frota tu co[nñ]o)\b/i.test(
      t
    ) && !/\btu polla\b/i.test(t);

  const maleLoserPOV =
    /\b(tu polla|tu erecci[oó]n|tus huevos|qu[ií]tate pantal|qu[ií]tate el pantal|ponte de pie con la polla|mast[uú]rbate.*polla)\b/i.test(
      t
    );

  const maleActsFemaleWinner =
    /\b(folla a \{ganador\}|c[oó]mele el co[nñ]o|co[nñ]o de \{ganador\}|su braga|su co[nñ]o|su cl[ií]toris|chupa.*cl[ií]toris|lam(?:e|erías).*co[nñ]o|mete.*dedos en.*\{ganador\}|le chupas un pez[oó]n|qu[ií]tale el sujetador|ella te azota)/i.test(
      t
    );

  const femaleActsMaleWinner =
    /\b(chupa(?:r(?:ías|ás|a))? la polla|ch[uú]p(?:a|ale|arías).*polla|saca su polla|su erecci[oó]n|su bragueta|(?:frota|acaricia).*?(?:su )?polla|mete su polla|entre tus labios.*polla|la polla de \{ganador\})/i.test(
      t
    );

  const twoMenFocus =
    gayExclusive ||
    (maleAnat &&
      !femaleAnat &&
      /\b(culo|nalgas|follad|chup[aá] su polla|ch[uú]pala|masturbaci[oó]n mutua|frota pollas|contra la suya|sacad las pollas)\b/i.test(t) &&
      !femaleActsMaleWinner &&
      !/\b(ella|falda|braga|co[nñ]o|chica)\b/i.test(t));

  const twoWomenFocus =
    lesbianExclusive ||
    (femaleAnat &&
      !maleAnat &&
      /\b(tribbing|co[nñ]o.*co[nñ]o|dedos.*co[nñ]o|labios.*labios|69)\b/i.test(t) &&
      !maleActsFemaleWinner &&
      !/\b(polla|erecci[oó]n|bragueta|huevos)\b/i.test(t));

  return {
    maleAnat,
    femaleAnat,
    gayExclusive,
    lesbianExclusive,
    femaleLoserPOV,
    maleLoserPOV,
    maleActsFemaleWinner,
    femaleActsMaleWinner,
    twoMenFocus,
    twoWomenFocus,
  };
}

export function classifyChallenge(text, currentBucket, isGrupo = false) {
  const a = analyzeText(text);

  if (a.twoMenFocus && !a.femaleAnat) return "chico_chico";
  if (a.twoWomenFocus && !a.maleAnat) return "chica_chica";
  if (a.gayExclusive && !a.femaleAnat) return "chico_chico";
  if (a.lesbianExclusive && !a.maleAnat) return "chica_chica";

  if (isGrupo) {
    if (a.femaleLoserPOV || a.femaleActsMaleWinner) return "hetero.chica";
    if (a.maleLoserPOV || a.maleActsFemaleWinner) return "hetero.chico";
    return currentBucket;
  }

  if (a.maleAnat && a.femaleAnat) {
    if (a.femaleLoserPOV || a.femaleActsMaleWinner) return "hetero.chica";
    if (a.maleLoserPOV || a.maleActsFemaleWinner) return "hetero.chico";
    return currentBucket || "hetero.chica";
  }

  if (a.femaleAnat && !a.maleAnat) {
    if (a.maleActsFemaleWinner || a.maleLoserPOV) return "hetero.chico";
    if (a.femaleLoserPOV || a.femaleActsMaleWinner) return "hetero.chica";
    if (a.lesbianExclusive) return "chica_chica";
    return "hetero.chica";
  }

  if (a.maleAnat && !a.femaleAnat) {
    if (a.femaleActsMaleWinner || a.femaleLoserPOV) return "hetero.chica";
    if (a.maleLoserPOV || a.maleActsFemaleWinner) return "hetero.chico";
    if (a.gayExclusive) return "chico_chico";
    return "hetero.chico";
  }

  return currentBucket;
}

export function incompatibleReason(text, bucket) {
  const a = analyzeText(text);
  if (bucket === "chica_chica" && a.maleAnat && !a.femaleAnat && !isSwingerGroupChallenge(text)) {
    return "anatomía masculina en chica_chica";
  }
  if (bucket === "chico_chico" && a.femaleAnat && !a.maleAnat && !isSwingerGroupChallenge(text)) {
    return "anatomía femenina en chico_chico";
  }
  if (bucket.startsWith("hetero") && a.gayExclusive && !a.femaleAnat) {
    return "contenido gay exclusivo en hetero";
  }
  if (bucket.startsWith("hetero") && a.lesbianExclusive && !a.maleAnat) {
    return "contenido lésbico exclusivo en hetero";
  }
  if (bucket === "hetero.chica" && a.maleLoserPOV && !a.femaleLoserPOV && !a.femaleActsMaleWinner) {
    return "perspectiva masculina en hetero.chica";
  }
  if (bucket === "hetero.chico" && a.femaleLoserPOV && !a.maleLoserPOV && !a.maleActsFemaleWinner) {
    return "perspectiva femenina en hetero.chico";
  }
  return null;
}
