const state = {
  player1: "",
  player2: "",
  gender1: "chico",
  gender2: "chica",
  intensity: "picante",
  maxRounds: 10,
  currentRound: 1,
  scores: { p1: 0, p2: 0 },
  currentPlayer: 1,
  choices: { p1: null, p2: null },
  usedChallenges: [],
  lastResult: null,
  playMode: "local",
  choiceMode: "buttons",
  phase: "playing",
  activeScreen: "age",
};

function showScreen(name) {
  state.activeScreen = name;
  showScreenAnimated(name);
}

function getPlayerGender(playerNum) {
  return playerNum === 1 ? state.gender1 : state.gender2;
}

function getPlayerName(playerNum) {
  return playerNum === 1 ? state.player1 : state.player2;
}

function formatPlayerName(playerNum) {
  const name = getPlayerName(playerNum);
  const icon = getGenderIcon(getPlayerGender(playerNum));
  return `${icon} ${name}`;
}

function updatePairLabel() {
  const label = document.getElementById("pair-label");
  if (label) {
    label.textContent = getPairLabel(state.gender1, state.gender2);
  }
}

function updateSetupForPlayMode() {
  const isNetwork = state.playMode === "online" || state.playMode === "webcam";
  const isOutdoor = state.playMode === "outdoor";
  document.getElementById("online-join-block")?.classList.toggle("hidden", !isNetwork);
  document.getElementById("online-hint")?.classList.toggle("hidden", !isNetwork);
  document.getElementById("outdoor-hint")?.classList.toggle("hidden", !isOutdoor);
  document.getElementById("lobby-webcam-note")?.classList.toggle("hidden", state.playMode !== "webcam");

  const hint = document.getElementById("online-hint");
  if (hint) {
    hint.textContent =
      state.playMode === "webcam"
        ? "Modo webcam: entrad los dos por HTTPS (URL de Vercel o localhost). Ver aviso rosa si usáis http://IP."
        : "Modo dos móviles: crea la sala y comparte el código con tu pareja.";
  }

  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.textContent = isOutdoor
      ? "Salir a jugar"
      : state.playMode === "webcam"
        ? "Crear sala con webcam"
        : isNetwork
          ? "Crear sala online"
          : "Comenzar partida";
  }

  const p2Field = document.querySelectorAll(".player-field")[1];
  if (p2Field) {
    p2Field.style.display = isNetwork ? "none" : "";
  }

  if (typeof updateWebcamContextBanner === "function") updateWebcamContextBanner();
}

function initAgeGate() {
  const checkbox = document.getElementById("age-confirm");
  const enterBtn = document.getElementById("enter-btn");

  checkbox.addEventListener("change", () => {
    enterBtn.disabled = !checkbox.checked;
  });

  enterBtn.addEventListener("click", () => showScreen("setup"));
}

function initSetup() {
  document.querySelectorAll(".intensity-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".intensity-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.intensity = btn.dataset.level;
      const mood = state.intensity === "progresivo" ? "picante" : state.intensity;
      if (typeof setGlobalMood === "function") setGlobalMood(mood);
    });
  });

  document.querySelectorAll(".mode-btn[data-play-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn[data-play-mode]").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.playMode = btn.dataset.playMode;
      updateSetupForPlayMode();
      if (typeof updateWebcamContextBanner === "function") updateWebcamContextBanner();
    });
  });

  document.querySelectorAll(".mode-btn[data-choice-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn[data-choice-mode]").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.choiceMode = btn.dataset.choiceMode;
    });
  });

  document.querySelectorAll(".gender-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const player = btn.dataset.player;
      const gender = btn.dataset.gender;

      document.querySelectorAll(`.gender-btn[data-player="${player}"]`).forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      if (player === "1") state.gender1 = gender;
      else state.gender2 = gender;

      updatePairLabel();
    });
  });

  updatePairLabel();
  updateSetupForPlayMode();

  document.getElementById("start-btn").addEventListener("click", handleStartClick);
  document.getElementById("join-room-btn")?.addEventListener("click", handleJoinClick);
  document.getElementById("copy-code-btn")?.addEventListener("click", copyRoomCode);
  document.getElementById("cancel-lobby-btn")?.addEventListener("click", cancelLobby);

  initRoulette(handleRouletteLock);
}

function handleStartClick() {
  if (state.playMode === "online" || state.playMode === "webcam") {
    startOnlineHost();
  } else {
    startLocalGame();
  }
}

function handleJoinClick() {
  const code = document.getElementById("room-code")?.value.trim();
  if (!code) {
    alert("Introduce el código de la sala.");
    return;
  }

  const guestName = document.getElementById("player1").value.trim() || "Jugador 2";
  state.player1 = "Anfitrión";
  state.player2 = guestName;
  state.gender2 = state.gender1;
  state.playMode = document.querySelector('.mode-btn[data-play-mode="webcam"].selected')
    ? "webcam"
    : "online";
  MP.role = "guest";

  joinOnlineRoom(code, onGuestConnected)
    .then(() => {
      document.getElementById("lobby-title").textContent = "Conectando…";
      document.getElementById("lobby-subtitle").textContent = "Sincronizando con la sala";
      document.getElementById("room-code-display").textContent = code;
      document.getElementById("lobby-status").innerHTML = "<span class='lobby-spinner'></span><span>Conectando…</span>";
      document.getElementById("copy-code-btn").classList.add("hidden");
      showScreen("lobby");
    })
    .catch((err) => alert(err.message || "Error al unirse."));
}

function startLocalGame() {
  const p1 = document.getElementById("player1").value.trim();
  const p2 = document.getElementById("player2").value.trim();

  if (!p1 || !p2) {
    alert("Introduce los nombres de ambos jugadores.");
    return;
  }

  state.player1 = p1;
  state.player2 = p2;
  if (state.playMode !== "outdoor") {
    state.playMode = "local";
  }
  resetGameState();
  beginGame();
}

function startOnlineHost() {
  const p1 = document.getElementById("player1").value.trim();
  const p2 = document.getElementById("player2")?.value.trim() || "Jugador 2";

  if (!p1) {
    alert("Introduce tu nombre.");
    return;
  }

  state.player1 = p1;
  state.player2 = p2;
  resetGameState();

  createOnlineRoom(onGuestConnected)
    .then((code) => {
      document.getElementById("room-code-display").textContent = code;
      document.getElementById("lobby-title").textContent =
        isWebcamMode() ? "Sala webcam creada" : "Sala creada";
      document.getElementById("lobby-subtitle").textContent =
        isWebcamMode()
          ? "Comparte el código — conectaréis cámara al empezar"
          : "Comparte este código con tu pareja";
      document.getElementById("lobby-status").innerHTML =
        '<span class="lobby-spinner"></span><span>Esperando al jugador 2…</span>';
      document.getElementById("copy-code-btn").classList.remove("hidden");
      document.getElementById("lobby-webcam-note")?.classList.toggle("hidden", !isWebcamMode());
      showScreen("lobby");

      if (isWebcamMode() && typeof initWebcamMedia === "function") {
        initWebcamMedia();
      }
    })
    .catch((err) => alert(err.message || "Error al crear la sala."));
}

function onGuestConnected() {
  document.getElementById("lobby-status").innerHTML =
    '<span style="color:var(--gold)">✓</span><span>¡Conectados! Empezando…</span>';

  const start = () => {
    setTimeout(() => beginGame(), 800);
  };

  if (isWebcamMode() && typeof onWebcamSessionReady === "function") {
    onWebcamSessionReady().finally(start);
  } else {
    start();
  }
}

function cancelLobby() {
  cleanupPeer();
  showScreen("setup");
}

function resetGameState() {
  state.maxRounds = parseInt(document.getElementById("rounds").value, 10);
  state.currentRound = 1;
  state.scores = { p1: 0, p2: 0 };
  state.usedChallenges = [];
  state.choices = { p1: null, p2: null };
  state.currentPlayer = 1;
  state.lastResult = null;
  state.phase = "playing";
}

function beginGame() {
  document.body.classList.toggle("outdoor-active", isOutdoorPlayMode());
  showChoiceUI(state.choiceMode);
  updateOnlineResultControls();
  startRound();
  showScreen("game");
  if (isHost()) sendFullState("game");
}

function updateScoreboard() {
  const s1 = document.getElementById("score-p1");
  const s2 = document.getElementById("score-p2");
  s1.querySelector(".player-name").textContent = formatPlayerName(1);
  s2.querySelector(".player-name").textContent = formatPlayerName(2);
  s1.querySelector(".score").textContent = state.scores.p1;
  s2.querySelector(".score").textContent = state.scores.p2;

  const roundLabel = document.getElementById("round-label");
  if (state.maxRounds >= 999) {
    roundLabel.textContent = `Ronda ${state.currentRound}`;
  } else {
    roundLabel.textContent = `Ronda ${state.currentRound} / ${state.maxRounds}`;
  }

  updateProgressLevelUI();
}

function startRound() {
  state.choices = { p1: null, p2: null };
  state.phase = "playing";

  if (isOnlineMode()) {
    state.currentPlayer = getLocalPlayerNum();
  } else {
    state.currentPlayer = 1;
  }

  updateScoreboard();
  updateTurnUI();
  setActivePlayer(isOnlineMode() ? getLocalPlayerNum() : state.currentPlayer);
  showChoiceUI(state.choiceMode);
  resetChoiceUI();

  if (state.choiceMode === "roulette") {
    startRouletteSpin();
  } else {
    staggerChoices();
  }
}

function resetChoiceUI() {
  document.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("selected", "dimmed");
  });
  document.getElementById("waiting-msg")?.classList.add("hidden");
  document.getElementById("p1-choice-hidden")?.classList.add("hidden");
  resetRouletteUI();
}

function updateTurnUI() {
  const turnLabel = document.getElementById("turn-label");
  const waitingMsg = document.getElementById("waiting-msg");

  if (isOnlineMode()) {
    const myNum = getLocalPlayerNum();
    const myName = getPlayerName(myNum);
    const myKey = myNum === 1 ? "p1" : "p2";
    const otherKey = myNum === 1 ? "p2" : "p1";
    const hasChosen = !!state.choices[myKey];
    const opponentChosen = !!state.choices[otherKey];

    if (state.phase === "result" || state.phase === "end") return;

    if (hasChosen) {
      turnLabel.innerHTML = `Esperando al otro jugador…`;
      waitingMsg?.classList.remove("hidden");
    } else if (opponentChosen) {
      turnLabel.innerHTML = `¡Tu pareja ya eligió! <strong>${escapeHtml(myName)}</strong>, te toca ${getGenderIcon(getPlayerGender(myNum))}`;
      waitingMsg?.classList.add("hidden");
    } else {
      turnLabel.innerHTML = `Tu turno — <strong>${escapeHtml(myName)}</strong> ${getGenderIcon(getPlayerGender(myNum))}`;
      waitingMsg?.classList.add("hidden");
    }
    return;
  }

  if (state.choiceMode === "roulette" && state.currentPlayer === 2) {
    document.getElementById("p1-choice-hidden")?.classList.remove("hidden");
  }

  const name = getPlayerName(state.currentPlayer);
  turnLabel.innerHTML = `Turno de <strong>${escapeHtml(name)}</strong> ${getGenderIcon(getPlayerGender(state.currentPlayer))}`;
  waitingMsg?.classList.add("hidden");
}

function updateOnlineResultControls() {
  const isOnline = isOnlineMode();
  const isGuestPlayer = isGuest();
  document.getElementById("next-round-btn")?.classList.toggle("hidden", isOnline && isGuestPlayer);
  document.getElementById("new-challenge-btn")?.classList.toggle("hidden", isOnline && isGuestPlayer);
  document.getElementById("host-wait-msg")?.classList.toggle("hidden", !isOnline || !isGuestPlayer);
}

function lockOnlineChoiceUI() {
  if (!isOnlineMode()) return;

  const myNum = getLocalPlayerNum();
  const myKey = myNum === 1 ? "p1" : "p2";
  if (!state.choices[myKey]) return;

  document.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.disabled = true;
  });
  document.getElementById("roulette-lock-btn")?.setAttribute("disabled", "true");
  document.getElementById("roulette-lock-btn")?.classList.add("hidden");
  document.getElementById("roulette-hint")?.classList.add("hidden");
  stopRouletteSpin(true);
}

function syncGameScreenFromRemote() {
  const myNum = getLocalPlayerNum();
  const myKey = myNum === 1 ? "p1" : "p2";

  setActivePlayer(myNum);

  if (state.choiceMode === "roulette") {
    if (!state.choices[myKey] && !Roulette.locked) {
      startRouletteSpin();
    } else if (state.choices[myKey]) {
      stopRouletteSpin(true);
      document.getElementById("roulette-locked")?.classList.remove("hidden");
      lockOnlineChoiceUI();
    }
  } else if (state.choices[myKey]) {
    lockOnlineChoiceUI();
  }

  updateTurnUI();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function updateProgressLevelUI() {
  const el = document.getElementById("progress-level");
  if (!el) return;

  if (state.intensity === "progresivo") {
    el.textContent = getProgressiveHint(state.currentRound, state.maxRounds);
    el.classList.remove("hidden");
    updateEscaladaBar(state.currentRound, state.maxRounds);
    const mood = getProgressiveIntensity(state.currentRound, state.maxRounds);
    if (typeof setGlobalMood === "function") setGlobalMood(mood);
  } else {
    el.classList.add("hidden");
    hideEscaladaBar();
  }
}

function getChallengeLabel(intensity) {
  const remote = isRemotePlayMode();
  const outdoor = isOutdoorPlayMode();
  const tag = remote ? "Reto a distancia · " : outdoor ? "Reto al aire libre · " : "";
  if (state.intensity === "progresivo") {
    return `${tag}Reto para el perdedor · ${getIntensityLabel(intensity)}`;
  }
  if (remote) return "Reto a distancia · cumple frente a la cámara";
  if (outdoor) return "Reto al aire libre · cumple donde indique el reto";
  return "Reto para el perdedor";
}

function pickChallenge(loserNum, winnerNum, round = state.currentRound) {
  const pairType = getPairType(state.gender1, state.gender2);
  const loserGender = getPlayerGender(loserNum);
  const loserName = getPlayerName(loserNum);
  const winnerName = getPlayerName(winnerNum);
  const effectiveIntensity = getEffectiveIntensity(state.intensity, round, state.maxRounds);

  const challenge = getRandomChallenge(
    effectiveIntensity,
    pairType,
    loserGender,
    state.usedChallenges,
    loserName,
    winnerName
  );

  return { ...challenge, effectiveIntensity };
}

function initGameControls() {
  document.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleChoice(btn.dataset.choice));
  });

  document.getElementById("next-round-btn").addEventListener("click", handleNextRound);
  document.getElementById("new-challenge-btn").addEventListener("click", handleNewChallenge);
  document.getElementById("play-again-btn").addEventListener("click", handlePlayAgain);
  document.getElementById("back-setup-btn").addEventListener("click", () => {
    cleanupPeer();
    document.body.classList.remove("outdoor-active");
    showScreen("setup");
  });
}

function handleNextRound() {
  if (state.lastResult?.winner === null) {
    startRound();
    showScreen("game");
    if (isHost()) sendNextRound();
    return;
  }

  if (state.currentRound >= state.maxRounds) {
    showEndScreen();
  } else {
    state.currentRound++;
    startRound();
    showScreen("game");
  }
  if (isHost()) sendNextRound();
}

function handleNewChallenge() {
  if (!state.lastResult?.winner) return;
  if (isOnlineMode() && !isHost()) return;

  const loserNum = state.lastResult.winner === 1 ? 2 : 1;
  const challenge = pickChallenge(loserNum, state.lastResult.winner);
  state.usedChallenges.push(challenge.id);
  document.getElementById("challenge-text").textContent = challenge.text;
  document.getElementById("challenge-label").textContent =
    getChallengeLabel(challenge.effectiveIntensity);
  animateChallengeReveal();
  animateChallengeRevealDecor(challenge.effectiveIntensity);

  if (isHost()) {
    sendMessage({
      type: "newChallenge",
      text: challenge.text,
      label: getChallengeLabel(challenge.effectiveIntensity),
    });
  }
}

function handlePlayAgain() {
  state.scores = { p1: 0, p2: 0 };
  state.currentRound = 1;
  state.usedChallenges = [];
  startRound();
  showScreen("game");
  if (isHost()) sendFullState("game");
}

function handleChoice(choice) {
  if (state.choiceMode === "roulette") return;

  if (isOnlineMode()) {
    const myNum = getLocalPlayerNum();
    const key = myNum === 1 ? "p1" : "p2";
    if (state.choices[key]) return;

    const selectedBtn = document.querySelector(`.choice-btn[data-choice="${choice}"]`);
    if (selectedBtn) animateChoice(selectedBtn);

    document.querySelectorAll(".choice-btn").forEach((btn) => { btn.disabled = true; });
    sendChoice(myNum, choice);
    state.choices[key] = choice;
    lockOnlineChoiceUI();
    updateTurnUI();
    return;
  }

  const key = state.currentPlayer === 1 ? "p1" : "p2";
  state.choices[key] = choice;

  const selectedBtn = document.querySelector(`.choice-btn[data-choice="${choice}"]`);
  if (selectedBtn) animateChoice(selectedBtn);

  if (state.currentPlayer === 1) {
    state.currentPlayer = 2;
    document.querySelectorAll(".choice-btn").forEach((btn) => {
      btn.disabled = false;
      btn.classList.remove("selected", "dimmed");
    });
    document.getElementById("p1-choice-hidden")?.classList.remove("hidden");
    updateTurnUI();
    setActivePlayer(2);
    staggerChoices();
  } else {
    document.querySelectorAll(".choice-btn").forEach((btn) => { btn.disabled = true; });
    setTimeout(() => showRoundResult(false), 700);
  }
}

function handleRouletteLock(choice) {
  if (isOnlineMode()) {
    const myNum = getLocalPlayerNum();
    const key = myNum === 1 ? "p1" : "p2";
    if (state.choices[key]) return;
    state.choices[key] = choice;
    sendChoice(myNum, choice);
    lockOnlineChoiceUI();
    updateTurnUI();
    return;
  }

  const key = state.currentPlayer === 1 ? "p1" : "p2";
  state.choices[key] = choice;

  if (state.currentPlayer === 1) {
    state.currentPlayer = 2;
    document.getElementById("p1-choice-hidden")?.classList.remove("hidden");
    updateTurnUI();
    setActivePlayer(2);
    setTimeout(() => {
      resetRouletteUI();
      startRouletteSpin();
    }, 600);
  } else {
    setTimeout(() => showRoundResult(false), 500);
  }
}

function showRoundResult(fromRemote = false) {
  const { p1, p2 } = state.choices;
  const winner = determineWinner(p1, p2);

  state.phase = "result";
  state.lastResult = winner ? { winner, winnerName: getPlayerName(winner), loserName: getPlayerName(winner === 1 ? 2 : 1), loserNum: winner === 1 ? 2 : 1 } : { winner: null };

  if (winner === 1) {
    state.scores.p1++;
    if (!fromRemote) animateScoreBump(1);
  } else if (winner === 2) {
    state.scores.p2++;
    if (!fromRemote) animateScoreBump(2);
  }

  let challengeData = null;
  if (winner && (!isOnlineMode() || isHost())) {
    const loserNum = winner === 1 ? 2 : 1;
    challengeData = pickChallenge(loserNum, winner);
    state.usedChallenges.push(challengeData.id);
  }

  renderResultUI(winner, challengeData);

  if (!fromRemote) {
    animateResultReveal(winner);
    if (winner) animateWinDecor();
    if (challengeData) {
      animateChallengeReveal();
      animateChallengeRevealDecor(challengeData.effectiveIntensity);
    }
  } else if (challengeData) {
    setChallengeMood(challengeData.effectiveIntensity);
  }

  updateScoreboard();
  updateOnlineResultControls();

  const resultCard = document.querySelector(".result-card");
  if (resultCard) {
    resultCard.classList.remove("animate-in");
    void resultCard.offsetWidth;
    resultCard.classList.add("animate-in");
  }

  showScreen("result");

  if (isHost()) {
    sendRoundResult();
  }
}

function renderResultUI(winner, challengeData) {
  const { p1, p2 } = state.choices;

  document.getElementById("result-choices").innerHTML = `
    <div class="result-choice ${winner === 1 ? "winner" : winner === 2 ? "loser" : ""}">
      <span class="emoji">${CHOICE_EMOJI[p1]}</span>
      <span class="name">${escapeHtml(formatPlayerName(1))}</span>
    </div>
    <div class="result-choice ${winner === 2 ? "winner" : winner === 1 ? "loser" : ""}">
      <span class="emoji">${CHOICE_EMOJI[p2]}</span>
      <span class="name">${escapeHtml(formatPlayerName(2))}</span>
    </div>
  `;

  const title = document.getElementById("result-title");
  const subtitle = document.getElementById("result-subtitle");
  const challengeBox = document.getElementById("challenge-box");
  const newChallengeBtn = document.getElementById("new-challenge-btn");

  if (winner === null) {
    title.textContent = "¡Empate!";
    subtitle.textContent = "Nadie gana. Repitan la ronda.";
    challengeBox.classList.add("hidden");
    newChallengeBtn.classList.add("hidden");
    document.getElementById("challenge-label").textContent = "Reto para el perdedor";
  } else {
    const winnerName = getPlayerName(winner);
    const loserName = getPlayerName(winner === 1 ? 2 : 1);
    title.textContent = `¡${winnerName} gana!`;
    subtitle.textContent = `${loserName} debe cumplir el reto…`;

    if (challengeData) {
      document.getElementById("challenge-text").textContent = challengeData.text;
      document.getElementById("challenge-label").textContent =
        getChallengeLabel(challengeData.effectiveIntensity);
    }

    challengeBox.classList.toggle("hidden", !challengeData);
    newChallengeBtn.classList.toggle("hidden", !challengeData);
    if (challengeData && typeof setChallengeMood === "function") {
      setChallengeMood(challengeData.effectiveIntensity);
    }
  }
}

function renderResultFromState(remote) {
  state.choices = { ...remote.choices };
  state.lastResult = remote.lastResult;
  state.scores = { ...remote.scores };

  const challengeData = remote.challengeText
    ? { text: remote.challengeText, effectiveIntensity: state.intensity }
    : null;

  renderResultUI(remote.lastResult?.winner ?? null, challengeData);

  if (remote.challengeText) {
    document.getElementById("challenge-text").textContent = remote.challengeText;
    document.getElementById("challenge-label").textContent = remote.challengeLabel;
    const mood = getEffectiveIntensity(state.intensity, state.currentRound, state.maxRounds);
    setChallengeMood(mood);
  }

  updateOnlineResultControls();
}

function showEndScreen() {
  state.phase = "end";
  const p1 = state.scores.p1;
  const p2 = state.scores.p2;
  let winnerNum = null;

  if (p1 > p2) winnerNum = 1;
  else if (p2 > p1) winnerNum = 2;

  renderEndFromState({
    scores: state.scores,
    winnerNum,
    finalChallengeText: winnerNum
      ? getRandomFinalReward(
          state.intensity,
          getPairType(state.gender1, state.gender2),
          getPlayerGender(winnerNum === 1 ? 2 : 1),
          getPlayerName(winnerNum === 1 ? 2 : 1),
          getPlayerName(winnerNum)
        )
      : "Ambos eligen un reto extremo para el otro según vuestro tipo de pareja y los cumplís esta noche.",
  });

  showScreen("end");
  if (isHost()) {
    const payload = getSerializableState("end");
    payload.phase = "end";
    sendMessage({ type: "fullState", state: payload });
  }

  const endCard = document.querySelector(".end-card");
  if (endCard) {
    endCard.classList.remove("animate-in");
    void endCard.offsetWidth;
    endCard.classList.add("animate-in");
  }
}

function renderEndFromState(data) {
  const p1 = data.scores?.p1 ?? state.scores.p1;
  const p2 = data.scores?.p2 ?? state.scores.p2;
  let winnerNum = data.winnerNum ?? null;
  if (winnerNum === null) {
    if (p1 > p2) winnerNum = 1;
    else if (p2 > p1) winnerNum = 2;
  }

  if (winnerNum) {
    const winnerName = getPlayerName(winnerNum);
    document.getElementById("winner-title").innerHTML =
      `${iconHtml("crown", "sex-icon sex-icon-sm")} ${escapeHtml(winnerName)} domina la partida`;
    document.getElementById("final-scores").textContent =
      `${formatPlayerName(1)} ${p1} — ${p2} ${formatPlayerName(2)}`;
    document.getElementById("final-challenge-text").textContent =
      data.finalChallengeText ||
      getRandomFinalReward(
        state.intensity,
        getPairType(state.gender1, state.gender2),
        getPlayerGender(winnerNum === 1 ? 2 : 1),
        getPlayerName(winnerNum === 1 ? 2 : 1),
        winnerName
      );

    const finalLabel = document.querySelector("#final-challenge-box .challenge-label");
    if (finalLabel) {
      finalLabel.textContent =
        state.intensity === "progresivo"
          ? "Premio final del ganador · Extremo"
          : "Premio final del ganador";
    }
    setChallengeMood("extremo");
    emojiRain("extremo", 25);
    pulseVignette(3000);
  } else {
    document.getElementById("winner-title").textContent = "¡Empate total!";
    document.getElementById("final-scores").textContent =
      `${formatPlayerName(1)} ${p1} — ${p2} ${formatPlayerName(2)}`;
    document.getElementById("final-challenge-text").textContent =
      data.finalChallengeText ||
      "Ambos eligen un reto extremo para el otro según vuestro tipo de pareja y los cumplís esta noche.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ensureInitialScreen();
  initAgeGate();
  initSetup();
  initGameControls();
});

function ensureInitialScreen() {
  const active = document.querySelector(".screen.active");
  if (!active) {
    document.getElementById("age-gate")?.classList.add("active");
  }
}
