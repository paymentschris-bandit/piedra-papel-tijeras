/**
 * Verifica que la elección se guarda en state.choices antes de resetear animación.
 * Ejecutar: node test-roulette-choice.mjs
 */

const ROULETTE_CHOICES = ["piedra", "papel", "tijeras"];

function getRouletteChoiceAtRotation(rotation) {
  const normalized = ((rotation % 360) + 360) % 360;
  const index = Math.floor(((360 - normalized + 30) % 360) / 360 * 3) % 3;
  const indexFixed = Math.floor(((360 - normalized + 30) % 360) / 120) % 3;
  return ROULETTE_CHOICES[indexFixed];
}

function simulateLockFlow(rotation) {
  const state = { choices: { p1: null, p2: null }, currentPlayer: 1 };
  const Roulette = {
    rotation,
    speed: 8,
    spinning: true,
    locked: false,
    lastLockedChoice: null,
  };

  const choice = getRouletteChoiceAtRotation(Roulette.rotation);

  // 1) Guardar elección (handleRouletteLock / onLock)
  const key = state.currentPlayer === 1 ? "p1" : "p2";
  state.choices[key] = choice;

  // 2) Reset animación (applyRouletteLockedUI / zeroRouletteMotion)
  Roulette.rotation = 0;
  Roulette.speed = 0;
  Roulette.spinning = false;
  Roulette.locked = true;
  Roulette.lastLockedChoice = choice;

  return { state, Roulette, choice };
}

function simulateTwoPlayerRound() {
  const state = { choices: { p1: null, p2: null }, currentPlayer: 1 };

  function register(player, rotation) {
    const key = player === 1 ? "p1" : "p2";
    const choice = getRouletteChoiceAtRotation(rotation);
    state.choices[key] = choice;
    return choice;
  }

  const c1 = register(1, 45);
  const c2 = register(2, 200);

  return { c1, c2, p1: state.choices.p1, p2: state.choices.p2 };
}

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log("  OK:", msg);
  } else {
    failed++;
    console.error("  FAIL:", msg);
  }
}

console.log("Test 1: elección persiste tras reset animación");
const r1 = simulateLockFlow(127);
assert(r1.state.choices.p1 === r1.choice, `state.choices.p1 = ${r1.state.choices.p1}`);
assert(r1.Roulette.rotation === 0, "rotation = 0");
assert(r1.Roulette.speed === 0, "speed = 0");
assert(r1.Roulette.lastLockedChoice === r1.choice, "lastLockedChoice coincide");

console.log("\nTest 2: dos jugadores — ambas elecciones guardadas");
const r2 = simulateTwoPlayerRound();
assert(r2.p1 === r2.c1 && r2.p2 === r2.c2, `p1=${r2.p1} p2=${r2.p2}`);
assert(r2.p1 !== null && r2.p2 !== null, "ninguna elección es null");

console.log("\nTest 3: getRouletteChoiceAtRotation estable");
assert(getRouletteChoiceAtRotation(0) === getRouletteChoiceAtRotation(360), "0° = 360°");
assert(ROULETTE_CHOICES.includes(getRouletteChoiceAtRotation(999)), "rotación alta sigue siendo válida");

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
