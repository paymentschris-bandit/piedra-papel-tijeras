/** Expande un banco de retos con variaciones legibles (sin duplicados vacíos). */
export function expandChallengeBank(bank, needed) {
  const variations = [
    "",
    " Hazlo más despacio.",
    " Esta vez sin hablar.",
    " Repite con los ojos cerrados.",
    " {ganador} elige el ritmo.",
    " Cambiad de sitio antes de empezar.",
    " Sin prisa — disfrutad cada segundo.",
    " Repetid el reto el doble de tiempo si os apetece.",
    " Mirad a los ojos todo el rato.",
    " Susurrad lo que sentís mientras lo hacéis.",
    " Parad a mitad y volved a empezar.",
    " Hacedlo de pie en lugar de sentados.",
  ];
  const items = [];
  let round = 0;
  while (items.length < needed && round < variations.length + 5) {
    for (const line of bank) {
      if (items.length >= needed) break;
      const suffix = variations[round % variations.length];
      const t = line.endsWith(".") ? line.slice(0, -1) + suffix + "." : line + suffix;
      if (!items.includes(t)) items.push(t);
    }
    round++;
  }
  while (items.length < needed) {
    const t = bank[items.length % bank.length];
    if (!items.includes(t)) items.push(t);
    else break;
  }
  return items.slice(0, needed);
}
