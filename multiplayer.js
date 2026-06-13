const MP = {
  peer: null,
  conn: null,
  role: null,
  roomCode: null,
  connected: false,
  onMessage: null,
};

function generateRoomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function isOnlineMode() {
  return state.playMode === "online" || state.playMode === "webcam";
}

function isWebcamMode() {
  return state.playMode === "webcam";
}

function isHost() {
  return MP.role === "host";
}

function isGuest() {
  return MP.role === "guest";
}

function getLocalPlayerNum() {
  if (!isOnlineMode()) return state.currentPlayer;
  return isHost() ? 1 : 2;
}

function getPeerId(code) {
  return `ppt-${code}`;
}

function createOnlineRoom(onConnected) {
  return new Promise((resolve, reject) => {
    if (typeof Peer === "undefined") {
      reject(new Error("PeerJS no cargado. Comprueba tu conexión a internet."));
      return;
    }

    MP.role = "host";
    MP.roomCode = generateRoomCode();
    MP.connected = false;

    cleanupPeer();

    MP.peer = new Peer(getPeerId(MP.roomCode), {
      debug: 1,
    });

    if (isWebcamMode() && typeof registerWebcamHandlers === "function") {
      registerWebcamHandlers();
    }

    const timeout = setTimeout(() => {
      reject(new Error("Tiempo de espera agotado al crear la sala."));
    }, 15000);

    MP.peer.on("open", () => {
      clearTimeout(timeout);
      resolve(MP.roomCode);
    });

    MP.peer.on("connection", (conn) => {
      MP.conn = conn;
      setupConnection(conn, onConnected);
    });

    MP.peer.on("error", (err) => {
      clearTimeout(timeout);
      if (err.type === "unavailable-id") {
        MP.roomCode = generateRoomCode();
        createOnlineRoom(onConnected).then(resolve).catch(reject);
        return;
      }
      reject(err);
    });
  });
}

function joinOnlineRoom(code, onConnected) {
  return new Promise((resolve, reject) => {
    if (typeof Peer === "undefined") {
      reject(new Error("PeerJS no cargado. Comprueba tu conexión a internet."));
      return;
    }

    const cleanCode = code.replace(/\D/g, "");
    if (cleanCode.length !== 6) {
      reject(new Error("El código debe tener 6 dígitos."));
      return;
    }

    MP.role = "guest";
    MP.roomCode = cleanCode;
    MP.connected = false;

    cleanupPeer();

    MP.peer = new Peer({ debug: 1 });

    if (isWebcamMode() && typeof registerWebcamHandlers === "function") {
      registerWebcamHandlers();
    }

    const timeout = setTimeout(() => {
      reject(new Error("No se pudo conectar. Comprueba el código e inténtalo de nuevo."));
    }, 15000);

    MP.peer.on("open", () => {
      MP.conn = MP.peer.connect(getPeerId(cleanCode), { reliable: true });

      MP.conn.on("open", () => {
        clearTimeout(timeout);
        const guestName = document.getElementById("player1")?.value.trim() || "Jugador 2";
        const guestGender =
          document.querySelector('.gender-btn[data-player="1"].selected')?.dataset.gender || "chica";
        sendMessage({ type: "join", name: guestName, gender: guestGender });
        resolve();
      });

      MP.conn.on("data", (data) => {
        handleIncoming(data, onConnected);
      });

      MP.conn.on("error", reject);
      MP.conn.on("close", () => {
        MP.connected = false;
      });
    });

    MP.peer.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

function setupConnection(conn, onConnected) {
  conn.on("open", () => {
    MP.connected = true;
    if (isHost()) {
      sendFullState();
      if (onConnected) onConnected();
    }
  });

  conn.on("data", (data) => {
    handleIncoming(data, onConnected);
  });

  conn.on("close", () => {
    MP.connected = false;
  });
}

function handleIncoming(data, onConnected) {
  if (!data || !data.type) return;

  switch (data.type) {
    case "join":
      if (isHost()) {
        if (data.name) state.player2 = data.name;
        if (data.gender) state.gender2 = data.gender;
        updatePairLabel?.();
        sendFullState();
        if (onConnected) onConnected();
      }
      break;
    case "fullState":
      applyRemoteState(data.state);
      if (isGuest() && onConnected && !MP.connected) {
        MP.connected = true;
        onConnected();
      }
      break;
    case "roundResult":
      if (isGuest()) {
        applyRemoteState({ ...data.state, screen: "result", phase: "result" });
      }
      break;
    case "choice":
      if (isHost()) {
        const key = data.player === 1 ? "p1" : "p2";
        state.choices[key] = data.choice;
        if (state.choices.p1 && state.choices.p2) {
          showRoundResult(true);
        } else {
          sendFullState();
        }
      }
      break;
    case "nextRound":
      if (isGuest()) applyRemoteState(data.state);
      break;
    case "newChallenge":
      if (isGuest()) {
        document.getElementById("challenge-text").textContent = data.text;
        document.getElementById("challenge-label").textContent = data.label;
        animateChallengeReveal();
      }
      break;
    case "syncState":
      applyRemoteState(data.state);
      break;
    default:
      break;
  }

  if (MP.onMessage) MP.onMessage(data);
}

function sendMessage(msg) {
  if (MP.conn && MP.conn.open) {
    MP.conn.send(msg);
  }
}

function getSerializableState(forcedScreen) {
  return {
    player1: state.player1,
    player2: state.player2,
    gender1: state.gender1,
    gender2: state.gender2,
    intensity: state.intensity,
    maxRounds: state.maxRounds,
    currentRound: state.currentRound,
    scores: { ...state.scores },
    choiceMode: state.choiceMode,
    playMode: state.playMode,
    choices: { ...state.choices },
    phase: state.phase || "playing",
    lastResult: state.lastResult,
    challengeText: document.getElementById("challenge-text")?.textContent || "",
    challengeLabel: document.getElementById("challenge-label")?.textContent || "",
    finalChallengeText: document.getElementById("final-challenge-text")?.textContent || "",
    usedChallenges: [...state.usedChallenges],
    screen: forcedScreen || state.activeScreen || getCurrentScreenName(),
  };
}

function getCurrentScreenName() {
  if (state.activeScreen) return state.activeScreen;
  if (document.getElementById("result-screen")?.classList.contains("active")) return "result";
  if (document.getElementById("end-screen")?.classList.contains("active")) return "end";
  return "game";
}

function resolveRemoteScreen(remote) {
  if (remote.phase === "end") return "end";
  if (remote.phase === "result") return "result";
  if (remote.choices?.p1 && remote.choices?.p2 && remote.challengeText) return "result";
  return remote.screen || "game";
}

function sendFullState(forcedScreen) {
  sendMessage({ type: "fullState", state: getSerializableState(forcedScreen) });
}

function sendRoundResult() {
  const payload = getSerializableState("result");
  payload.phase = "result";
  payload.screen = "result";
  sendMessage({ type: "roundResult", state: payload });
  sendMessage({ type: "fullState", state: payload });
}

function sendChoice(playerNum, choice) {
  if (isHost()) {
    const key = playerNum === 1 ? "p1" : "p2";
    state.choices[key] = choice;
    if (state.choices.p1 && state.choices.p2) {
      showRoundResult(true);
    } else {
      sendFullState();
    }
  } else {
    sendMessage({ type: "choice", player: playerNum, choice });
  }
}

function sendNextRound() {
  if (!isHost()) return;
  const payload = getSerializableState("game");
  payload.phase = "playing";
  payload.screen = "game";
  sendMessage({ type: "nextRound", state: payload });
  sendMessage({ type: "fullState", state: payload });
}

function applyRemoteState(remote) {
  if (!remote) return;

  state.player1 = remote.player1;
  state.player2 = remote.player2;
  state.gender1 = remote.gender1;
  state.gender2 = remote.gender2;
  state.intensity = remote.intensity;
  state.maxRounds = remote.maxRounds;
  state.currentRound = remote.currentRound;
  state.scores = { ...remote.scores };
  state.choiceMode = remote.choiceMode;
  state.playMode = remote.playMode;
  state.choices = { ...remote.choices };
  state.phase = remote.phase;
  state.lastResult = remote.lastResult;
  state.usedChallenges = remote.usedChallenges || [];

  const screen = resolveRemoteScreen(remote);

  updateScoreboard();
  updateProgressLevelUI();
  showChoiceUI(state.choiceMode);
  updateOnlineResultControls();

  if (screen === "game") {
    resetChoiceUI();
    syncGameScreenFromRemote();
    showScreen("game");
  } else if (screen === "result") {
    renderResultFromState(remote);
    animateResultReveal(remote.lastResult?.winner ?? null);
    if (remote.lastResult?.winner) animateWinDecor();
    if (remote.challengeText) {
      const mood = getEffectiveIntensity(state.intensity, state.currentRound, state.maxRounds);
      animateChallengeRevealDecor(mood);
    }
    updateOnlineResultControls();
    showScreen("result");
  } else if (screen === "end") {
    renderEndFromState({
      scores: remote.scores,
      finalChallengeText: remote.finalChallengeText,
    });
    showScreen("end");
  }
}

function cleanupPeer() {
  if (typeof stopWebcam === "function") stopWebcam();
  if (MP.conn) {
    MP.conn.close();
    MP.conn = null;
  }
  if (MP.peer) {
    MP.peer.destroy();
    MP.peer = null;
  }
  MP.connected = false;
}

function copyRoomCode() {
  if (!MP.roomCode) return;
  navigator.clipboard?.writeText(MP.roomCode).then(() => {
    const btn = document.getElementById("copy-code-btn");
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = "¡Copiado!";
      setTimeout(() => { btn.textContent = orig; }, 2000);
    }
  });
}
