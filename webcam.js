const WC = {
  localStream: null,
  currentCall: null,
  camEnabled: true,
  micEnabled: true,
  handlersRegistered: false,
  fullscreen: false,
};

function isMobileWebcamLayout() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function updateWebcamFullscreenBtn() {
  const btn = document.getElementById("wc-fullscreen-btn");
  if (!btn) return;
  btn.textContent = WC.fullscreen ? "Ventana ▢" : "Pantalla ▣";
  btn.title = WC.fullscreen ? "Modo ventana flotante" : "Cámara a pantalla completa";
}

function applyWebcamLayout() {
  if (!isWebcamMode() && !document.body.classList.contains("webcam-preview")) return;
  const panel = document.getElementById("webcam-panel");
  if (!panel || panel.classList.contains("hidden")) return;

  document.body.classList.toggle("webcam-fullscreen", WC.fullscreen);
  document.body.classList.toggle("webcam-pip", !WC.fullscreen);
  panel.classList.toggle("webcam-minimized", false);
  updateWebcamFullscreenBtn();
}

function setWebcamFullscreen(on) {
  WC.fullscreen = !!on;
  applyWebcamLayout();
}

function toggleWebcamFullscreen() {
  setWebcamFullscreen(!WC.fullscreen);
}

function setWebcamChallengeLive(on) {
  document.body.classList.toggle("webcam-challenge-live", !!on);
}

function updateWebcamScreenMode(screenName) {
  if (!isWebcamMode()) {
    document.body.classList.remove("webcam-reto-mode", "webcam-play-mode", "webcam-challenge-live");
    return;
  }
  const isReto = screenName === "result" || screenName === "end";
  document.body.classList.toggle("webcam-reto-mode", isReto);
  document.body.classList.toggle("webcam-play-mode", screenName === "game");
}

function showWebcamPanel() {
  document.getElementById("webcam-panel")?.classList.remove("hidden");
  document.body.classList.add("webcam-active");
  if (WC.fullscreen === false && isMobileWebcamLayout()) {
    WC.fullscreen = true;
  }
  applyWebcamLayout();
}

function hideWebcamPanel() {
  document.getElementById("webcam-panel")?.classList.add("hidden");
  document.body.classList.remove(
    "webcam-active",
    "webcam-fullscreen",
    "webcam-pip",
    "webcam-reto-mode",
    "webcam-play-mode",
    "webcam-challenge-live"
  );
  document.getElementById("wc-challenge-overlay")?.classList.add("hidden");
}

function updateRemoteVideoLabel() {
  const label = document.getElementById("remote-video-label");
  if (!label) return;
  const myNum = getLocalPlayerNum();
  const remoteNum = myNum === 1 ? 2 : 1;
  label.textContent = getPlayerName(remoteNum) || "Pareja";
}

function attachRemoteStream(stream) {
  const video = document.getElementById("remote-video");
  if (video) {
    video.srcObject = stream;
  }
  updateRemoteVideoLabel();
}

function bindCall(call) {
  if (!call) return;
  WC.currentCall = call;
  call.on("stream", attachRemoteStream);
  call.on("close", () => {
    if (WC.currentCall === call) WC.currentCall = null;
  });
  call.on("error", (err) => console.warn("Webcam call error:", err));
}

function registerWebcamHandlers() {
  if (!MP.peer || WC.handlersRegistered || !isWebcamMode()) return;
  WC.handlersRegistered = true;

  MP.peer.on("call", (call) => {
    if (!WC.localStream) return;
    bindCall(call);
    call.answer(WC.localStream);
  });
}

function isSecureWebcamContext() {
  return window.isSecureContext === true;
}

function getWebcamBlockReason() {
  if (location.protocol === "file:") {
    return "Abre el juego con el servidor Python, no haciendo doble clic en index.html.";
  }
  if (!isSecureWebcamContext()) {
    const host = location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
    if (!isLocal) {
      return null; // mensaje largo en updateWebcamContextBanner
    }
  }
  const gum =
    navigator.mediaDevices?.getUserMedia?.bind(navigator.mediaDevices) ||
    legacyGetUserMedia();
  if (!gum) {
    return "Tu navegador no permite usar la cámara aquí. Prueba Chrome o Safari actualizado.";
  }
  return null;
}

function getWebcamBlockedSimpleMessage() {
  const ip = location.hostname;
  return {
    title: "La cámara no funciona con esta dirección",
    why:
      "Entraste con http://" +
      ip +
      " — Chrome y el móvil bloquean la cámara en HTTP. Usa HTTPS (Vercel) o localhost.",
    steps: [
      "Opción fácil: abre el juego en la URL de Vercel (https://…vercel.app) en PC y móvil.",
      "Uno crea sala en modo Webcam, el otro se une con el código.",
      "Permite cámara y micrófono cuando lo pida el navegador.",
      "Alternativa local: python serve-https.py → https://localhost:8443 (PC) y https://" +
        ip +
        ":8443 (móvil, misma WiFi).",
    ],
  };
}

function legacyGetUserMedia() {
  const fn =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  if (!fn) return null;
  return (constraints) =>
    new Promise((resolve, reject) => fn.call(navigator, constraints, resolve, reject));
}

async function requestWebcamStream() {
  const constraints = {
    video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: true,
  };
  if (navigator.mediaDevices?.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }
  const legacy = legacyGetUserMedia();
  if (legacy) return legacy(constraints);
  throw new Error("getUserMedia no disponible");
}

function updateWebcamContextBanner() {
  let banner = document.getElementById("webcam-context-banner");
  const reason = isWebcamMode() ? getWebcamBlockReason() : null;
  const insecure =
    isWebcamMode() &&
    !isSecureWebcamContext() &&
    location.hostname !== "localhost" &&
    location.hostname !== "127.0.0.1";

  if (!reason && !insecure) {
    banner?.remove();
    return;
  }

  if (!banner) {
    banner = document.createElement("div");
    banner.id = "webcam-context-banner";
    banner.className = "webcam-context-banner";
    document.body.prepend(banner);
  }

  if (insecure) {
    const msg = getWebcamBlockedSimpleMessage();
    banner.innerHTML =
      `<p class="webcam-banner-title">${msg.title}</p>` +
      `<p class="webcam-banner-why">${msg.why}</p>` +
      `<ol class="webcam-banner-steps">${msg.steps.map((s) => `<li>${s}</li>`).join("")}</ol>`;
    return;
  }

  banner.innerHTML = `<p><strong>Webcam:</strong> ${reason}</p>`;
}

function showWebcamBlockAlert(reason) {
  if (
    reason === "needs-https" ||
    (!isSecureWebcamContext() &&
      location.hostname !== "localhost" &&
      location.hostname !== "127.0.0.1")
  ) {
    alert(
      "La cámara no funciona con http://" +
        location.hostname +
        "\n\nSigue los pasos del recuadro rosa arriba:\n" +
        "1) python serve-https.py en el PC\n" +
        "2) PC → https://localhost:8443\n" +
        "3) Móvil → https://" +
        location.hostname +
        ":8443"
    );
    return;
  }
  alert(reason);
}

async function initWebcamMedia() {
  if (!isWebcamMode()) return true;

  const blockReason = getWebcamBlockReason();
  const needsHttps =
    !isSecureWebcamContext() &&
    location.hostname !== "localhost" &&
    location.hostname !== "127.0.0.1";

  if (blockReason || needsHttps) {
    showWebcamBlockAlert(blockReason || "needs-https");
    updateWebcamContextBanner();
    return false;
  }

  if (WC.localStream) {
    showWebcamPanel();
    return true;
  }

  try {
    WC.localStream = await requestWebcamStream();

    const localVideo = document.getElementById("local-video");
    if (localVideo) {
      localVideo.srcObject = WC.localStream;
      localVideo.muted = true;
    }

    showWebcamPanel();
    updateWebcamControlLabels();
    return true;
  } catch (err) {
    console.error(err);
    const name = err?.name || "";
    let msg =
      "No se pudo acceder a la cámara o al micrófono. Comprueba los permisos del navegador.";
    if (name === "NotAllowedError") {
      msg = "Permiso denegado. En la barra de direcciones pulsa el icono de cámara y permite acceso.";
    } else if (name === "NotFoundError") {
      msg = "No se encontró cámara o micrófono en este dispositivo.";
    } else if (name === "NotReadableError") {
      msg = "La cámara está en uso por otra aplicación (Zoom, Teams, etc.). Ciérrala e inténtalo de nuevo.";
    }
    showWebcamBlockAlert(msg);
    return false;
  }
}

function startWebcamCall() {
  if (!isWebcamMode() || !WC.localStream || !MP.peer?.open || !MP.roomCode) return;

  registerWebcamHandlers();

  if (isGuest()) {
    const call = MP.peer.call(getPeerId(MP.roomCode), WC.localStream);
    bindCall(call);
  }
}

function updateWebcamControlLabels() {
  const camBtn = document.getElementById("wc-toggle-cam");
  const micBtn = document.getElementById("wc-toggle-mic");
  if (camBtn) camBtn.textContent = WC.camEnabled ? "Cámara ON" : "Cámara OFF";
  if (micBtn) micBtn.textContent = WC.micEnabled ? "Mic ON" : "Mic OFF";
}

function toggleWebcamTrack(kind) {
  if (!WC.localStream) return;
  if (kind === "video") {
    WC.camEnabled = !WC.camEnabled;
    WC.localStream.getVideoTracks().forEach((t) => {
      t.enabled = WC.camEnabled;
    });
  } else {
    WC.micEnabled = !WC.micEnabled;
    WC.localStream.getAudioTracks().forEach((t) => {
      t.enabled = WC.micEnabled;
    });
  }
  updateWebcamControlLabels();
}

function stopWebcam() {
  if (WC.currentCall) {
    try {
      WC.currentCall.close();
    } catch (_) {
      /* ignore */
    }
    WC.currentCall = null;
  }

  if (WC.localStream) {
    WC.localStream.getTracks().forEach((t) => t.stop());
    WC.localStream = null;
  }

  ["local-video", "remote-video"].forEach((id) => {
    const v = document.getElementById(id);
    if (v) v.srcObject = null;
  });

  WC.handlersRegistered = false;
  WC.camEnabled = true;
  WC.micEnabled = true;
  hideWebcamPanel();
}

async function onWebcamSessionReady() {
  if (!isWebcamMode()) return;
  const ok = await initWebcamMedia();
  if (ok) startWebcamCall();
}

function initWebcamControls() {
  document.getElementById("wc-fullscreen-btn")?.addEventListener("click", toggleWebcamFullscreen);
  document.getElementById("wc-toggle-cam")?.addEventListener("click", () => toggleWebcamTrack("video"));
  document.getElementById("wc-toggle-mic")?.addEventListener("click", () => toggleWebcamTrack("audio"));
  window.addEventListener("resize", () => {
    if (isWebcamMode() && isMobileWebcamLayout() && !document.getElementById("webcam-panel")?.classList.contains("hidden")) {
      if (!document.body.classList.contains("webcam-pip")) WC.fullscreen = true;
      applyWebcamLayout();
    }
  });
}

function initWebcamDevPreview() {
  const params = new URLSearchParams(location.search);
  if (params.get("preview") !== "webcam") return;
  const host = location.hostname;
  if (host !== "localhost" && host !== "127.0.0.1") return;

  document.body.classList.add("webcam-preview", "webcam-fullscreen");
  WC.fullscreen = true;
  showWebcamPanel();

  const remote = document.getElementById("remote-video");
  const local = document.getElementById("local-video");
  if (remote) remote.classList.add("webcam-preview-placeholder");
  if (local) local.classList.add("webcam-preview-placeholder");

  const label = document.getElementById("remote-video-label");
  if (label) label.textContent = "Pareja (vista previa)";

  let banner = document.getElementById("webcam-dev-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "webcam-dev-banner";
    banner.className = "webcam-dev-banner";
    banner.innerHTML =
      "<strong>Vista previa webcam</strong> — Así se ve el panel en móvil. " +
      "F12 → icono móvil → elige iPhone/Android. Quita <code>?preview=webcam</code> para jugar de verdad.";
    document.body.prepend(banner);
  }

  if (navigator.mediaDevices?.getUserMedia) {
    requestWebcamStream()
      .then((stream) => {
        WC.localStream = stream;
        if (local) {
          local.srcObject = stream;
          local.classList.remove("webcam-preview-placeholder");
        }
      })
      .catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initWebcamControls();
  initWebcamDevPreview();
});
