const homeScreen = document.querySelector("#home-screen");
const playScreen = document.querySelector("#play-screen");
const arena = document.querySelector("#arena");
const targetLayer = document.querySelector("#target-layer");
const scoreValue = document.querySelector("#score-value");
const progressValue = document.querySelector("#progress-value");
const progressLabel = document.querySelector("#progress-label");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const modeLabel = document.querySelector("#mode-label");
const dangerLabel = document.querySelector("#danger-label");
const playHint = document.querySelector("#play-hint");
const outcomeCard = document.querySelector("#outcome-card");
const outcomeIcon = document.querySelector("#outcome-icon");
const outcomeKicker = document.querySelector("#outcome-kicker");
const outcomeTitle = document.querySelector("#outcome-title");
const outcomeCopy = document.querySelector("#outcome-copy");
const outcomeArt = document.querySelector("#outcome-art");
const announcer = document.querySelector("#announcer");
const tricksterWarning = document.querySelector("#trickster-warning");
const soundToggle = document.querySelector("#sound-toggle");
const soundIcon = document.querySelector("#sound-icon");
const soundLabel = document.querySelector("#sound-label");

const unlockKey = "pip-pop-unlocked";
const modeNames = {
  normal: "Normal",
  hard: "Hard",
  endless: "Endless",
};

let selectedMode = "normal";
let activeMode = "normal";
let score = 0;
let targets = [];
let pointerPosition;
let nextCharacterId = 0;
let movementTimer;
let catchTimer;
let roundNumber = 0;
let soundEnabled = true;
let audioContext;
let musicTimer;
let musicBeat = 0;
let unlocked = localStorage.getItem(unlockKey) === "true";

function updateModeCards() {
  document.querySelectorAll(".mode-card").forEach((card) => {
    const mode = card.dataset.mode;
    const available = mode === "normal" || unlocked;
    card.disabled = !available;
    card.classList.toggle("is-locked", !available);
    card.classList.toggle("is-selected", mode === selectedMode);
    card.setAttribute("aria-pressed", String(mode === selectedMode));
    const marker = card.querySelector(".mode-check, .mode-lock");
    marker.textContent = mode === selectedMode ? "✓" : available ? "" : "🔒";
    marker.setAttribute("aria-label", available ? "" : "Locked");
  });

  document.querySelector("#unlock-note").textContent = unlocked
    ? "All modes unlocked!"
    : "2 more modes unlock at 100";
}

function chooseMode(mode) {
  if (mode !== "normal" && !unlocked) return;
  selectedMode = mode;
  updateModeCards();
}

function showHome() {
  window.clearInterval(movementTimer);
  window.clearTimeout(catchTimer);
  stopMusic();
  roundNumber += 1;
  movementTimer = undefined;
  playScreen.hidden = true;
  homeScreen.hidden = false;
  outcomeCard.hidden = true;
  updateModeCards();
}

function getBadTargetCount() {
  if (activeMode === "hard") return 3;
  if (activeMode === "endless" || score >= 20) return 1;
  return 0;
}

function getMovementDelay() {
  if (activeMode === "hard") return Math.max(350, 720 - score * 4);
  return Math.max(500, 1550 - score * 9);
}

function getTargetPosition(excludedTarget) {
  const bounds = arena.getBoundingClientRect();
  const targetSize = window.matchMedia("(max-width: 620px)").matches ? 90 : 102;
  const paddingX = targetSize / 2 + 9;
  const paddingY = targetSize / 2 + 16;
  const pointer = pointerPosition
    ? { x: pointerPosition.x - bounds.left, y: pointerPosition.y - bounds.top }
    : undefined;
  const positions = targets
    .filter(({ element }) => element !== excludedTarget && element.isConnected)
    .map(({ element }) => ({
      x: Number.parseFloat(element.style.left),
      y: Number.parseFloat(element.style.top),
    }));

  for (let attempt = 0; attempt < 80; attempt += 1) {
    const position = {
      x: paddingX + Math.random() * Math.max(1, bounds.width - paddingX * 2),
      y: paddingY + Math.random() * Math.max(1, bounds.height - paddingY * 2),
    };
    if (
      pointer &&
      Math.abs(position.x - pointer.x) < targetSize * 0.62 &&
      Math.abs(position.y - pointer.y) < targetSize * 0.68
    ) {
      continue;
    }
    const hasRoom = positions.every((other) => {
      const distance = Math.hypot(position.x - other.x, position.y - other.y);
      return distance > targetSize + 15;
    });
    if (hasRoom) return position;
  }

  return {
    x: paddingX + Math.random() * Math.max(1, bounds.width - paddingX * 2),
    y: paddingY + Math.random() * Math.max(1, bounds.height - paddingY * 2),
  };
}

function moveTarget(target) {
  const position = getTargetPosition(target.element);
  target.element.style.left = `${position.x}px`;
  target.element.style.top = `${position.y}px`;
}

function characterArt(kind) {
  const isTrickster = kind === "bad";
  const instance = ++nextCharacterId;
  const colors = isTrickster
    ? { coat: "#191720", deep: "#0d1614", spot: "#28794e", hair: "#251429", hairLight: "#55394f", hairDark: "#100d17", hairShine: "#65bc83", trim: "#b5d17c" }
    : { coat: "#a8324b", deep: "#27202d", spot: "#e15a6a", hair: "#ece8f0", hairLight: "#fffefa", hairDark: "#a79baa", hairShine: "#fffefa", trim: "#ffd77f" };
  const pattern = isTrickster
    ? '<path d="M7 0 14 7 7 14 0 7Z" fill="#61b96d"/><path d="M7 0 7 14 0 7Z" fill="#17261d" opacity=".82"/>'
    : '<path d="m7 1 1.8 4 4.3.4-3.3 2.8 1 4.2L7 10.1l-3.8 2.3 1-4.2L.9 5.4 5.2 5Z" fill="#ffd46f"/>';
  const eyes = isTrickster
    ? '<path d="m43 39 9 2-9 5m29-7-9 2 9 5" fill="none" stroke="#262137" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'
    : '<path d="M41 43q5-7 11 0m14 0q5-7 11 0" fill="none" stroke="#262137" stroke-width="3.5" stroke-linecap="round"/>';
  const smile = isTrickster
    ? '<path d="M42 54q17 16 32-1-3 15-17 16-10-1-15-15Z" fill="#342439" stroke="#272038" stroke-width="2"/><path d="m49 59 3 5m7-3v5m7-8-2 5" stroke="#fff1d9" stroke-width="1.6" stroke-linecap="round"/>'
    : '<path d="M42 54q16 13 32 0-3 16-16 17-13-1-16-17Z" fill="#342439" stroke="#272038" stroke-width="2"/><path d="M47 58q11 5 22 0l-2 6q-9 4-18 0Z" fill="#fff8e9"/><path d="M53 59v6m6-6v6m6-6v5" stroke="#b8acaa" stroke-width="1"/>';

  return `
    <svg class="jester-art ${isTrickster ? "jester-art--trickster" : "jester-art--smiler"}"
      viewBox="0 0 112 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="coat-${instance}" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="${colors.spot}"/><stop offset="1" stop-color="${colors.coat}"/>
        </linearGradient>
        <linearGradient id="hair-${instance}" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="${colors.hairLight}"/><stop offset=".48" stop-color="${colors.hair}"/><stop offset="1" stop-color="${colors.hairDark}"/>
        </linearGradient>
        <linearGradient id="gold-${instance}" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="#fff0b0"/><stop offset=".5" stop-color="${colors.trim}"/><stop offset="1" stop-color="#bb762d"/>
        </linearGradient>
        <pattern id="fabric-${instance}" width="14" height="14" patternUnits="userSpaceOnUse">${pattern}</pattern>
        <filter id="shadow-${instance}" x="-40%" y="-30%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" flood-color="#101525" flood-opacity=".28"/>
        </filter>
      </defs>
      <ellipse cx="56" cy="124" rx="28" ry="5" fill="#171b2d" opacity=".22"/>
      <g filter="url(#shadow-${instance})">
        <path d="M42 90 18 105l-9-18 28-17m37 20 24 13 8-18-29-16" fill="url(#coat-${instance})" stroke="#1b2034" stroke-width="3" stroke-linejoin="round"/>
        <path d="m15 93 9 7-8 9-9-4m90-11-9 8 8 10 9-6" fill="${colors.deep}" stroke="#1b2034" stroke-width="2.5" stroke-linejoin="round"/>
        <g class="puppet-arm puppet-arm--left">
          <path d="m35 74-20 12" fill="none" stroke="#1c2033" stroke-width="12" stroke-linecap="round"/>
          <path d="m35 73-20 12" fill="none" stroke="url(#coat-${instance})" stroke-width="8" stroke-linecap="round"/>
          <path d="m18 82-8 1-4 6 5 5 7-2 4-6Z" fill="#fff3e3" stroke="#272238" stroke-width="2"/>
          <path d="m12 86-1 5m5-5-1 5" stroke="#8292a7" stroke-width="1"/>
        </g>
        <g class="puppet-arm puppet-arm--right">
          <path d="m77 73 20 13" fill="none" stroke="#1c2033" stroke-width="12" stroke-linecap="round"/>
          <path d="m77 73 20 13" fill="none" stroke="url(#coat-${instance})" stroke-width="8" stroke-linecap="round"/>
          <path d="m94 82 8 1 4 6-5 5-7-2-4-6Z" fill="#fff3e3" stroke="#272238" stroke-width="2"/>
          <path d="m100 86 1 5m-5-5 1 5" stroke="#8292a7" stroke-width="1"/>
        </g>
        <path d="M37 68q19-9 38 0l9 36q-27 13-56 0Z" fill="url(#coat-${instance})" stroke="#22233a" stroke-width="2.5"/>
        <path d="M37 72q19-7 38 0l3 11q-21 7-44 0Z" fill="url(#fabric-${instance})" opacity=".95"/>
        <path d="m56 70-8 15 8 12 8-12Z" fill="#fff3e1" stroke="#b88956" stroke-width="1.4"/>
        <path d="M38 81q18 8 37 0M36 103q20 8 41 0" fill="none" stroke="url(#gold-${instance})" stroke-width="3"/>
        <path d="M48 91h16" stroke="#22233a" stroke-width="1.5" opacity=".7"/>
        <circle cx="56" cy="92" r="2.7" fill="url(#gold-${instance})"/>
        <path d="M41 65q3 10 8 5l7-7 7 7q5 5 8-5l-4-7H45Z" fill="#fff3e1" stroke="#a57a55" stroke-width="1.4"/>
        <path d="m42 66 4-3 3 7 4-8 4 8 4-8 4 8 4-7 4 3" fill="none" stroke="url(#gold-${instance})" stroke-width="2"/>
        <path d="M27 29q-17 7-23 45l8 3q8-11 20-23m48-26q18 9 28 44l-9 4q-8-13-21-23" fill="url(#coat-${instance})" stroke="#22233a" stroke-width="2.3" stroke-linejoin="round"/>
        <path d="M27 31q-13 12-20 42l7 3q8-16 22-24m49-20q17 14 24 42l-7 3Q93 61 78 52" fill="url(#fabric-${instance})" opacity=".92"/>
        <path d="m11 71 3 8-5 5-5-4 2-8Zm90 0-3 8 5 5 5-4-2-8Z" fill="url(#gold-${instance})" stroke="#543d34" stroke-width="1.5"/>
        <circle cx="8" cy="80" r="3" fill="#ffe5a0"/><circle cx="104" cy="80" r="3" fill="#ffe5a0"/>
        <path d="M24 39Q8 23 25 6q11 4 22 23m41 10Q104 22 88 6q-11 4-21 23" fill="${colors.coat}" stroke="#20243a" stroke-width="2.5"/>
        <path d="M24 39Q8 23 25 6q11 4 22 23m41 10Q104 22 88 6q-11 4-21 23" fill="url(#fabric-${instance})"/>
        <path d="M25 7Q13 19 18 37l6 2Q21 20 31 11m57-4q12 12 7 30l-6 2q3-19-7-28" fill="none" stroke="url(#gold-${instance})" stroke-width="1.5" opacity=".85"/>
        <path d="M15 76q-2 5-4 7m86-7q2 5 4 7" fill="none" stroke="#20243a" stroke-width="3"/>
        <circle cx="9" cy="85" r="4.5" fill="url(#gold-${instance})" stroke="#543d34" stroke-width="1.3"/>
        <circle cx="103" cy="85" r="4.5" fill="url(#gold-${instance})" stroke="#543d34" stroke-width="1.3"/>
        <path d="M29 40q1-22 27-23 26 1 27 23-5 21-27 27-22-6-27-27Z" fill="#fff8ed" stroke="#302a39" stroke-width="2"/>
        <path d="M31 43q-8-22 10-29l15 8q-13 1-19 18m44 3q8-22-10-29L56 22q13 1 19 18" fill="url(#hair-${instance})" stroke="${colors.hairDark}" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M34 34q5-17 19-17l-8 7q-6 1-11 10m40 0Q69 17 58 17l8 7q5 1 8 10" fill="none" stroke="${colors.hairShine}" stroke-width="2" opacity=".85"/>
        <path d="M40 23q-9 7-8 21l-5 12q-1 8-6 13 14-1 20-18m27-28q10 8 9 21l5 12q1 8 6 13-14-1-20-18" fill="url(#hair-${instance})" stroke="${colors.hairDark}" stroke-width="1.5" stroke-linejoin="round"/>
        ${eyes}
        ${smile}
        <path d="M47 19Q39 9 32 13L23 7q8-9 19-4 9 3 14 12 5-9 14-12 11-5 19 4l-9 6q-7-4-15 6l-9 11Z" fill="url(#hair-${instance})" stroke="${colors.hairDark}" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M54 18q-9-11-17-10m23 10q8-10 15-11" fill="none" stroke="${colors.hairShine}" stroke-width="2" stroke-linecap="round"/>
      </g>
    </svg>`;
}

function createTarget(kind) {
  const target = document.createElement("button");
  const isGood = kind === "good";
  target.className = `target target--${kind}`;
  target.type = "button";
  target.dataset.hit = "false";
  target.setAttribute("aria-label", isGood ? "Catch the smiling white-haired jester" : "Diamond-pattern trickster — do not catch");
  target.innerHTML = characterArt(kind);

  const targetData = { kind, element: target };
  target.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      activateTarget(targetData);
    }
  });
  target.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
      event.preventDefault();
      activateTarget(targetData);
    }
  });
  target.addEventListener("click", (event) => {
    if (event.detail === 0) activateTarget(targetData);
  });

  targets.push(targetData);
  targetLayer.append(target);
  moveTarget(targetData);
}

function drawTargets() {
  targetLayer.replaceChildren();
  targets = [];
  createTarget("good");
  for (let index = 0; index < getBadTargetCount(); index += 1) {
    createTarget("bad");
  }
}

function updateScore() {
  scoreValue.textContent = String(score);
  const isEndless = activeMode === "endless";
  const progressPercent = isEndless ? score % 100 : Math.min(score, 100);
  const isOneAwayFromTrickster = activeMode === "normal" && score === 19;

  progressValue.textContent = isEndless ? `${score} caught` : `${score} / 100`;
  progressLabel.textContent = isEndless ? "Keep the streak going" : "Your first 100";
  progressFill.style.width = `${progressPercent}%`;
  progressTrack.setAttribute("aria-valuenow", String(progressPercent));
  progressTrack.setAttribute(
    "aria-label",
    isEndless ? "Endless mode score" : "Progress to 100 points",
  );
  dangerLabel.textContent =
    activeMode === "hard"
      ? "Three tricksters — stay sharp!"
      : activeMode === "endless"
        ? "One trickster is in the mix"
        : isOneAwayFromTrickster
          ? "One ticket left — trickster next!"
          : score >= 20
          ? "The trickster is in the mix!"
          : "Trickster arrives at 20";
  tricksterWarning.hidden = !isOneAwayFromTrickster;
  if (isOneAwayFromTrickster) {
    playHint.innerHTML =
      '<span class="hint-spark" aria-hidden="true">✦</span> One more ticket and the trickster joins. Stay sharp!';
  } else {
    playHint.innerHTML =
      activeMode === "hard"
        ? '<span class="hint-spark" aria-hidden="true">✦</span> Catch the speedy jester. Dodge three tricksters.'
        : activeMode === "endless"
          ? '<span class="hint-spark" aria-hidden="true">✦</span> Keep catching. One trickster ends the show.'
          : '<span class="hint-spark" aria-hidden="true">✦</span> Catch the smiling jester. Avoid the trickster!';
  }
}

function ensureAudioContext() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return undefined;
  if (!audioContext) audioContext = new AudioContextConstructor();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

function playTone(notes, waveType = "sine", volume = 0.11) {
  if (!soundEnabled) return;
  const context = ensureAudioContext();
  if (!context) return;

  const start = context.currentTime;
  notes.forEach(([frequency, offset, duration]) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, start + offset);
    gain.gain.setValueAtTime(0.0001, start + offset);
    gain.gain.exponentialRampToValueAtTime(volume, start + offset + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start + offset);
    oscillator.stop(start + offset + duration);
  });
}

function playSqueakSound() {
  if (!soundEnabled) return;
  const context = ensureAudioContext();
  if (!context) return;

  const start = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(740, start);
  oscillator.frequency.exponentialRampToValueAtTime(1320, start + 0.07);
  oscillator.frequency.exponentialRampToValueAtTime(960, start + 0.17);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.09, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + 0.21);
  playTone([[1480, 0.045, 0.07]], "sine", 0.018);
}

function playOopsSound() {
  playTone([[392, 0, 0.17], [349, 0.14, 0.2], [311, 0.3, 0.29]], "triangle", 0.09);
}

function playWinSound() {
  playTone([[523, 0, 0.18], [659, 0.13, 0.18], [784, 0.26, 0.18], [1047, 0.4, 0.34]], "triangle", 0.1);
}

function playMusicBeat() {
  const melody = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047];
  const bass = [131, 0, 0, 165, 0, 0, 175, 0, 0, 196, 0, 0];
  const note = melody[musicBeat % melody.length];
  playTone([[note, 0, 0.2]], "triangle", 0.027);
  if (musicBeat % 2 === 0) playTone([[note * 1.5, 0.045, 0.12]], "sine", 0.012);
  if (bass[musicBeat % bass.length]) {
    playTone([[bass[musicBeat % bass.length], 0, 0.3]], "sine", 0.045);
  }
  musicBeat += 1;
}

function startMusic() {
  if (!soundEnabled || musicTimer || !ensureAudioContext()) return;
  musicBeat = 0;
  playMusicBeat();
  musicTimer = window.setInterval(playMusicBeat, 375);
}

function stopMusic() {
  window.clearInterval(musicTimer);
  musicTimer = undefined;
}

function startMovement() {
  window.clearInterval(movementTimer);
  movementTimer = window.setInterval(() => {
    const goodTarget = targets.find((target) => target.kind === "good");
    if (!goodTarget || outcomeCard.hidden === false) return;
    moveTarget(goodTarget);
  }, getMovementDelay());
}

function unlockModes() {
  if (unlocked) return;
  unlocked = true;
  localStorage.setItem(unlockKey, "true");
}

function showOutcomeArt(source) {
  const image = document.createElement("img");
  image.src = source;
  image.alt = "";
  image.decoding = "async";
  outcomeArt.replaceChildren(image);
}

function finishGame(result) {
  window.clearInterval(movementTimer);
  window.clearTimeout(catchTimer);
  stopMusic();
  movementTimer = undefined;
  outcomeCard.hidden = false;
  outcomeCard.classList.remove("outcome-card--win", "outcome-card--lose");

  if (result === "win") {
    const didUnlock = activeMode === "normal" && !unlocked;
    if (activeMode === "normal") unlockModes();
    outcomeCard.classList.add("outcome-card--win");
    showOutcomeArt("assets/pierrot-win-roses.png");
    outcomeIcon.textContent = "🌹";
    outcomeKicker.textContent = didUnlock ? "The whole tent is cheering!" : "That's some catching!";
    outcomeTitle.textContent = didUnlock ? "A show-stopping 100!" : "Encore!";
    outcomeCopy.textContent = didUnlock
      ? "Hard and Endless are waiting in the wings. The circus is yours!"
      : `You caught ${score} jesters in ${modeNames[activeMode]} mode. Fancy another round?`;
    playWinSound();
    if (didUnlock) {
      updateModeCards();
      announcer.textContent = "You scored 100 and unlocked Hard and Endless modes!";
    }
  } else {
    outcomeCard.classList.add("outcome-card--lose");
    showOutcomeArt("assets/trickster-game-over.png");
    outcomeIcon.textContent = "🎭";
    outcomeKicker.textContent = "The lights go out…";
    outcomeTitle.textContent = "The trickster got you!";
    outcomeCopy.textContent = `You collected ${score} tickets. The diamond jester brought the show to a close.`;
    playOopsSound();
    announcer.textContent = `Game over. You scored ${score}.`;
  }
}

function activateTarget(target) {
  if (outcomeCard.hidden === false || target.element.dataset.hit === "true") return;
  target.element.dataset.hit = "true";

  if (target.kind === "bad") {
    finishGame("lose");
    return;
  }

  window.clearInterval(movementTimer);
  movementTimer = undefined;
  score += 1;
  playSqueakSound();
  target.element.classList.add("is-celebrating");
  updateScore();
  announcer.textContent =
    activeMode === "normal" && score === 19
      ? "Heads up! The trickster joins in at 20 tickets."
      : `Jester caught. Score ${score}.`;

  const currentRound = roundNumber;
  catchTimer = window.setTimeout(() => {
    if (roundNumber !== currentRound) return;
    if (activeMode !== "endless" && score >= 100) {
      finishGame("win");
      return;
    }
    drawTargets();
    startMovement();
  }, 300);
}

function startGame() {
  window.clearTimeout(catchTimer);
  roundNumber += 1;
  activeMode = selectedMode;
  score = 0;
  startMusic();
  homeScreen.hidden = true;
  playScreen.hidden = false;
  outcomeCard.hidden = true;
  modeLabel.textContent = `${modeNames[activeMode]} mode`;
  document.querySelector("#play-title").textContent =
    activeMode === "endless" ? "Keep the show going!" : "The show is yours!";
  document.querySelector("#play-title").setAttribute("tabindex", "-1");
  progressTrack.setAttribute("aria-valuemax", "100");
  updateScore();
  drawTargets();
  startMovement();
  document.querySelector("#play-title").focus({ preventScroll: true });
}

document.querySelector("#hero-mascot").innerHTML = characterArt("good");

document.addEventListener("pointermove", (event) => {
  pointerPosition = { x: event.clientX, y: event.clientY };
});

document.addEventListener("pointerdown", (event) => {
  pointerPosition = { x: event.clientX, y: event.clientY };
});

document.querySelectorAll(".mode-card").forEach((card) => {
  card.addEventListener("click", () => chooseMode(card.dataset.mode));
});

document.querySelector("#start-button").addEventListener("click", startGame);
document.querySelector("#back-button").addEventListener("click", showHome);
document.querySelector("#outcome-home-button").addEventListener("click", showHome);
document.querySelector("#retry-button").addEventListener("click", startGame);

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundLabel.textContent = soundEnabled ? "Music & sound" : "Sound off";
  soundToggle.setAttribute(
    "aria-label",
    soundEnabled ? "Turn music and sound off" : "Turn music and sound on",
  );
  soundIcon.textContent = soundEnabled ? "♫" : "♪";
  if (soundEnabled) {
    if (playScreen.hidden === false && outcomeCard.hidden) startMusic();
  } else {
    stopMusic();
    if (audioContext?.state === "running") void audioContext.suspend();
  }
});

updateModeCards();
