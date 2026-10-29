const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const homeScreen = $("#home-screen");
const playScreen = $("#play-screen");
const pawScreen = $("#pip-paw-screen");
const arena = $("#arena");
const targetLayer = $("#target-layer");
const outcomeCard = $("#outcome-card");
const draftOverlay = $("#draft-overlay");
const timerFill = $("#timer-fill");
const timerValue = $("#timer-value");
const timerTrack = $("#timer-track");
const announcer = $("#announcer");

const SAVE_KEY = "pip-pop-circus-save-v3";
const MODE_NAMES = {
  normal: "Normal",
  hard: "Hard",
  lunatic: "Lunatic",
  endless: "Endless",
  secret: "Secret",
};
const ACHIEVEMENTS = [
  { id: "normal-win", name: "Welcome to the show!", hint: "The curtain has a number on it. It likes three digits." },
  { id: "first-loss", name: "Welcome to the darkness", hint: "The shadows keep a little scrapbook." },
  { id: "hundred-losses", name: "Give up", hint: "The scrapbook has exactly one hundred pages." },
  { id: "hard-win", name: "Have fun in the next", hint: "Three tricksters. One jester. The encore is harder." },
  { id: "lunatic-win", name: "Try hard", hint: "The purple one knows the way through the lie." },
  { id: "endless-200", name: "This long?", hint: "Two hundred tickets is a lot of confetti." },
  { id: "pip-paw", name: "Pip-Paw Circus", hint: "A cat might sneak into the strangest show." },
  { id: "secret-win", name: "Really like this?", hint: "When the show starts acting strange, stay until the end." },
  { id: "top-score", name: "Purrrrfect score! - sorry for the pun", hint: "The local scoreboard has a very small throne." },
  { id: "first-ticket", name: "One (1) Ticket", hint: "Every grand collection begins with one tiny rectangle." },
  { id: "ten-tickets", name: "Ten Tickets in a Trench Coat", hint: "They are pretending to be a much taller score." },
  { id: "near-miss", name: "That Was Almost a Problem", hint: "One ticket before the trouble arrives. How suspenseful." },
  { id: "mimic-tapped", name: "Unscheduled Purple Meeting", hint: "The violet coworker has your calendar invite." },
  { id: "loose-ticket", name: "Loose Ticket! Mine Now.", hint: "A helpful gust has excellent timing." },
  { id: "extra-trickster", name: "More Clowns Than Chairs", hint: "The seating chart was clearly an estimate." },
  { id: "spare-ticket", name: "Spare Ticket? I’ll Take It", hint: "Pick the little safety net with a suspicious receipt." },
  { id: "silent-show", name: "The Silent Film Festival", hint: "A whole encore, and not one peep from the speakers." },
  { id: "paw-ten", name: "Ten Tiny Bonks", hint: "The paw has a punch card. It is nearly full." },
  { id: "paw-misses", name: "Three Tiny Escapes", hint: "The jesters have formed a very small getaway committee." },
  { id: "cat-clicked", name: "The Cat Distribution System", hint: "You did not find the cat. The cat found you." },
  { id: "cheater", name: "You cheater", hint: "The pawprint pass works. We are choosing not to ask why." , chipReward: false },
  { id: "bluey", name: "Bluey's hereeeeeeeee", hint: "Blue is a color. Blue is also a five-second timeout.", chipReward: false },
  { id: "gambling-first", name: "LETS GO GAMBLING", hint: "One chip enters. The wheel makes a little noise.", chipReward: false },
  { id: "empty-wheel", name: "Looks like you're outta cards", hint: "The wheel has exactly twenty pockets. You found them all.", chipReward: false },
];
const BUFF_CARDS = [
  { id: "extra-time", name: "A longer spotlight", benefit: "+0.55 seconds to catch the jester", drawback: "Tricksters dash 15% faster", icon: "⏳", benefitEffect: { time: 550 }, drawbackEffect: { badDash: 0.85 } },
  { id: "slow-baddies", name: "A little stage magic", benefit: "Tricksters take longer to dash", drawback: "One extra trickster joins the act", icon: "✨", benefitEffect: { badDash: 1.23 }, drawbackEffect: { badCount: 1 } },
  { id: "second-chance", name: "A lucky bell", benefit: "One mistaken trickster catch is forgiven", drawback: "Your catch timer is 0.35 seconds shorter", icon: "🔔", benefitEffect: { freeMistakes: 1 }, drawbackEffect: { time: -350 } },
  { id: "fast-catch", name: "Quick little feet", benefit: "Good jester gets a little easier to catch", drawback: "The tricksters copy that speed", icon: "👟", benefitEffect: { goodDash: 1.28 }, drawbackEffect: { badDash: 0.85 } },
  { id: "extra-life", name: "A spare ticket", benefit: "Survive one timer running out", drawback: "A trickster steals 0.25 seconds from each timer", icon: "🎟", benefitEffect: { timerSaves: 1 }, drawbackEffect: { time: -250 } },
];
const RARITY_ODDS = [
  { id: "mishap", name: "Bad-ish", chance: 45 },
  { id: "ordinary", name: "Average", chance: 30 },
  { id: "shiny", name: "Good", chance: 18 },
  { id: "marvelous", name: "Amazing", chance: 7 },
];
const ROULETTE_CARDS = [
  { id: "stubby-spotlight", name: "Stubby Spotlight", rarity: "mishap", icon: "🕯️", benefit: "+0.25 seconds", drawback: "Tricksters dash 20% faster", benefitEffect: { time: 250 }, drawbackEffect: { badDash: 0.8 } },
  { id: "bendy-bell", name: "Bendy Bell", rarity: "mishap", icon: "🔔", benefit: "Tricksters dash 10% slower", drawback: "Catch timer -0.3 seconds", benefitEffect: { badDash: 1.1 }, drawbackEffect: { time: -300 } },
  { id: "dusty-boots", name: "Dusty Boots", rarity: "mishap", icon: "🥾", benefit: "Good jester dashes 10% slower", drawback: "One extra trickster", benefitEffect: { goodDash: 1.1 }, drawbackEffect: { badCount: 1 } },
  { id: "tiny-umbrella", name: "Tiny Umbrella", rarity: "mishap", icon: "☂️", benefit: "One forgiven mistake", drawback: "Tricksters dash 10% faster", benefitEffect: { freeMistakes: 1 }, drawbackEffect: { badDash: 0.9 } },
  { id: "squeaky-wheel", name: "Squeaky Wheel", rarity: "mishap", icon: "🛞", benefit: "Catch timer +0.35 seconds", drawback: "Good jester dashes 10% faster", benefitEffect: { time: 350 }, drawbackEffect: { goodDash: 0.9 } },
  { id: "paper-crown", name: "Paper Crown", rarity: "ordinary", icon: "👑", benefit: "Catch timer +0.4 seconds", drawback: "Catch timer -0.2 seconds", benefitEffect: { time: 400 }, drawbackEffect: { time: -200 } },
  { id: "soft-slippers", name: "Soft Slippers", rarity: "ordinary", icon: "🥿", benefit: "Good jester dashes 15% slower", drawback: "Tricksters dash 10% faster", benefitEffect: { goodDash: 1.15 }, drawbackEffect: { badDash: 0.9 } },
  { id: "extra-cushion", name: "Extra Cushion", rarity: "ordinary", icon: "🛋️", benefit: "One forgiven mistake", drawback: "One extra trickster", benefitEffect: { freeMistakes: 1 }, drawbackEffect: { badCount: 1 } },
  { id: "stagehand-map", name: "Stagehand Map", rarity: "ordinary", icon: "🗺️", benefit: "One fewer trickster (minimum one)", drawback: "Catch timer -0.25 seconds", benefitEffect: { badCount: -1 }, drawbackEffect: { time: -250 } },
  { id: "warm-applause", name: "Warm Applause", rarity: "ordinary", icon: "👏", benefit: "Catch timer +0.6 seconds", drawback: "Good jester dashes 10% faster", benefitEffect: { time: 600 }, drawbackEffect: { goodDash: 0.9 } },
  { id: "velvet-rope", name: "Velvet Rope", rarity: "shiny", icon: "🎀", benefit: "One fewer trickster (minimum one)", drawback: "Tricksters dash 15% faster", benefitEffect: { badCount: -1 }, drawbackEffect: { badDash: 0.85 } },
  { id: "moonlit-lantern", name: "Moonlit Lantern", rarity: "shiny", icon: "🏮", benefit: "Catch timer +0.9 seconds", drawback: "One extra trickster", benefitEffect: { time: 900 }, drawbackEffect: { badCount: 1 } },
  { id: "lucky-mittens", name: "Lucky Mittens", rarity: "shiny", icon: "🧤", benefit: "Two forgiven mistakes", drawback: "Catch timer -0.35 seconds", benefitEffect: { freeMistakes: 2 }, drawbackEffect: { time: -350 } },
  { id: "sleepy-trickster", name: "Sleepy Trickster", rarity: "shiny", icon: "😴", benefit: "Tricksters dash 22% slower", drawback: "Good jester dashes 12% faster", benefitEffect: { badDash: 1.22 }, drawbackEffect: { goodDash: 0.88 } },
  { id: "golden-ticket", name: "Golden Ticket", rarity: "shiny", icon: "🎫", benefit: "Survive one timer running out", drawback: "Tricksters dash 12% faster", benefitEffect: { timerSaves: 1 }, drawbackEffect: { badDash: 0.88 } },
  { id: "starlight-sash", name: "Starlight Sash", rarity: "marvelous", icon: "🌟", benefit: "Catch timer +1.25 seconds", drawback: "One extra trickster", benefitEffect: { time: 1250 }, drawbackEffect: { badCount: 1 } },
  { id: "royal-decoy", name: "Royal Decoy", rarity: "marvelous", icon: "🎭", benefit: "Two fewer tricksters (minimum one)", drawback: "Catch timer -0.45 seconds", benefitEffect: { badCount: -2 }, drawbackEffect: { time: -450 } },
  { id: "pocket-pause", name: "Pocket Pause", rarity: "marvelous", icon: "⏸️", benefit: "Survive two timer runouts", drawback: "Tricksters dash 18% faster", benefitEffect: { timerSaves: 2 }, drawbackEffect: { badDash: 0.82 } },
  { id: "sleeping-moon", name: "Sleeping Moon", rarity: "marvelous", icon: "🌙", benefit: "Tricksters dash 30% slower", drawback: "Good jester dashes 15% faster", benefitEffect: { badDash: 1.3 }, drawbackEffect: { goodDash: 0.85 } },
  { id: "circus-crown", name: "Circus Crown", rarity: "marvelous", icon: "🎪", benefit: "Catch timer +1 second and one forgiven mistake", drawback: "One extra trickster and timer -0.3 seconds", benefitEffect: { time: 1000, freeMistakes: 1 }, drawbackEffect: { badCount: 1, time: -300 } },
];

function freshSave() {
  return {
    unlocked: { hard: false, lunatic: false, endless: false, secret: false, pipPaw: false },
    achievements: [],
    losses: 0,
    leaderboards: [],
    pawBest: 0,
    chips: 0,
    ownedCards: [],
    rouletteRemainingIds: ROULETTE_CARDS.map((card) => card.id),
    pipPawAchievementTaps: 0,
  };
}

function loadSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return freshSave();
  try {
    const saved = JSON.parse(raw);
    const defaults = freshSave();
    return {
      ...defaults,
      ...saved,
      unlocked: { ...defaults.unlocked, ...saved.unlocked },
      achievements: Array.isArray(saved.achievements) ? saved.achievements : [],
      chips: Number.isSafeInteger(saved.chips) && saved.chips >= 0
        ? saved.chips
        : ACHIEVEMENTS.filter((achievement) => achievement.chipReward !== false && saved.achievements?.includes(achievement.id)).length,
      ownedCards: Array.isArray(saved.ownedCards) ? saved.ownedCards.filter((id) => ROULETTE_CARDS.some((card) => card.id === id)) : [],
      rouletteRemainingIds: Array.isArray(saved.rouletteRemainingIds)
        ? saved.rouletteRemainingIds.filter((id) => ROULETTE_CARDS.some((card) => card.id === id))
        : ROULETTE_CARDS.map((card) => card.id).filter((id) => !saved.ownedCards?.includes(id)),
      pipPawAchievementTaps: Number.isSafeInteger(saved.pipPawAchievementTaps) && saved.pipPawAchievementTaps >= 0 ? saved.pipPawAchievementTaps : 0,
      leaderboards: Array.isArray(saved.leaderboards) ? saved.leaderboards : [],
      losses: Number.isSafeInteger(saved.losses) && saved.losses >= 0 ? saved.losses : 0,
      pawBest: Number.isSafeInteger(saved.pawBest) && saved.pawBest >= 0 ? saved.pawBest : 0,
    };
  } catch (error) {
    console.warn("Pip-Pop Circus could not read its saved progress.", error);
    return freshSave();
  }
}

let save = loadSave();
let selectedMode = "normal";
let activeMode = "normal";
let score = 0;
let targets = [];
let pointerPosition;
let movementTimer;
let countdownTimer;
let eventTimer;
let eventHideTimer;
let blueFreezeTimer;
let catchTimer;
let timerDeadline = 0;
let initialTimerDuration = 3600;
let roundNumber = 0;
let nextCharacterId = 0;
let soundEnabled = true;
let audioContext;
let musicTimer;
let musicBeat = 0;
let mimicCleared = false;
let freeMistakes = 0;
let timerSaves = 0;
let buffs = [];
let secretEvent = "none";
let secretCatUsed = false;
let inputFrozenUntil = 0;
let rouletteSpinning = false;
let selectedLeaderboard = "daily";
let pawScore = 0;
let pawMisses = 0;
let pawSeconds = 30;
let pawClock;
let pawTargetTimeout;
let pawRound = 0;
let pawActive = false;
let pawSubmitting = false;
let pawCursor;

function persistSave() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  updateAchievementCount();
}

function awardAchievement(id) {
  if (save.achievements.includes(id)) return;
  const achievement = ACHIEVEMENTS.find((item) => item.id === id);
  if (!achievement) return;
  save.achievements.push(id);
  if (achievement.chipReward !== false) save.chips += 1;
  persistSave();
  announcer.textContent = `Achievement unlocked: ${achievement.name}`;
  showEvent(`${achievement.name} — souvenir unlocked!`, "celebration");
  if (!$("#achievements-panel").hidden) renderAchievements();
}

function updateAchievementCount() {
  const count = save.achievements.length;
  $("#achievement-count").textContent = `${count}/${ACHIEVEMENTS.length}`;
  $("#achievement-summary").textContent = `${count} of ${ACHIEVEMENTS.length} unlocked`;
  $("#chip-balance").textContent = String(save.chips);
  $("#gambling-chip-balance").textContent = String(save.chips);
}

function getDraftCard(cardId) {
  return [...BUFF_CARDS, ...ROULETTE_CARDS].find((card) => card.id === cardId);
}

function getCardEffectTotal(effectName, side) {
  return buffs.reduce((total, cardId) => total + (getDraftCard(cardId)?.[`${side}Effect`]?.[effectName] || 0), 0);
}

function getCardEffectMultiplier(effectName) {
  return buffs.reduce((product, cardId) => {
    const card = getDraftCard(cardId);
    return product * (card?.benefitEffect?.[effectName] || 1) * (card?.drawbackEffect?.[effectName] || 1);
  }, 1);
}

function updateModeCards() {
  $$(".mode-card").forEach((card) => {
    const mode = card.dataset.mode;
    const available = mode === "normal" || save.unlocked[mode];
    card.disabled = !available;
    card.classList.toggle("is-locked", !available);
    card.classList.toggle("is-selected", mode === selectedMode);
    card.setAttribute("aria-pressed", String(mode === selectedMode));
    const marker = card.querySelector(".mode-check, .mode-lock");
    marker.textContent = mode === selectedMode ? "✓" : available ? "" : "🔒";
  });
  const locked = Object.values(save.unlocked).filter((value) => !value).length;
  $("#unlock-note").textContent = locked ? `${locked} act${locked === 1 ? "" : "s"} waiting backstage` : "The whole circus is yours";
}

function unlockEverythingFromAchievement() {
  save.unlocked = { hard: true, lunatic: true, endless: true, secret: true, pipPaw: true };
  awardAchievement("cheater");
  awardAchievement("pip-paw");
  persistSave();
  updateModeCards();
  $("#pip-paw-tab").hidden = false;
  renderAchievements();
  showEvent("A hidden backstage pass unlocks every act and Pip-Paw Circus!", "celebration");
  announcer.textContent = "Every game mode and Pip-Paw Circus are now unlocked!";
}

function tapPipPawAchievement(item) {
  if (save.achievements.includes("pip-paw")) return;
  save.pipPawAchievementTaps += 1;
  if (save.pipPawAchievementTaps >= 5) {
    save.pipPawAchievementTaps = 0;
    unlockEverythingFromAchievement();
    return;
  }
  persistSave();
}

function chooseMode(mode) {
  if (mode !== "normal" && !save.unlocked[mode]) return;
  selectedMode = mode;
  updateModeCards();
}

function getLocalDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getLocalWeek(date = new Date()) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - weekday);
  return getLocalDay(monday);
}

function scoresForPeriod(period) {
  const today = getLocalDay();
  const week = getLocalWeek();
  return save.leaderboards
    .filter((entry) => period === "global" || (period === "daily" && entry.day === today) || (period === "weekly" && entry.week === week))
    .sort((a, b) => b.score - a.score || a.date.localeCompare(b.date))
    .slice(0, 10);
}

function renderLeaderboards() {
  $$(".leaderboard-tab").forEach((button) => {
    const active = button.dataset.period === selectedLeaderboard;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const entries = scoresForPeriod(selectedLeaderboard);
  const list = $("#leaderboard-list");
  if (entries.length === 0) {
    list.innerHTML = '<div class="leaderboard-empty">No tickets here yet. The first score gets the spotlight.</div>';
    return;
  }
  list.replaceChildren(...entries.map((entry, index) => {
    const row = document.createElement("div");
    row.className = "leaderboard-entry";
    row.innerHTML = `<span class="leaderboard-rank">${String(index + 1).padStart(2, "0")}</span><span class="leaderboard-mode">${entry.mode}</span><strong>${entry.score}</strong>`;
    return row;
  }));
}

function recordPawScore(result) {
  const now = new Date();
  save.leaderboards.push({
    score: result,
    mode: "Pip-Paw",
    date: now.toISOString(),
    day: getLocalDay(now),
    week: getLocalWeek(now),
  });
  save.leaderboards = save.leaderboards
    .sort((a, b) => b.score - a.score || a.date.localeCompare(b.date))
    .slice(0, 300);
  save.pawBest = Math.max(save.pawBest, result);
  const ranksFirst = ["daily", "weekly", "global"].some(
    (period) => scoresForPeriod(period)[0]?.score === result,
  );
  persistSave();
  renderLeaderboards();
  if (result > 0 && ranksFirst) awardAchievement("top-score");
}

function renderAchievements() {
  const list = $("#achievement-list");
  list.replaceChildren(...ACHIEVEMENTS.map((achievement, index) => {
    const unlocked = save.achievements.includes(achievement.id);
    const item = document.createElement("article");
    const secretPass = achievement.id === "pip-paw" && !unlocked;
    item.className = `achievement-card${unlocked ? " is-earned" : ""}`;
    item.dataset.achievement = achievement.id;
    const hint = unlocked
      ? achievement.hint
      : `${index < 3 ? "Hint" : index < 6 ? "A stranger hint" : "The hint is now looking back"}: ${achievement.hint}`;
    const displayName = unlocked ? achievement.name : "???";
    const displayHint = hint;
    item.innerHTML = `<span class="achievement-seal" aria-hidden="true">${unlocked ? "✦" : "?"}</span><span class="achievement-copy"><strong>${displayName}</strong><span>${displayHint}</span></span><span class="achievement-status">${unlocked ? "Earned" : "Secret"}</span>`;
    if (secretPass) {
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.addEventListener("click", () => tapPipPawAchievement(item));
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          tapPipPawAchievement(item);
        }
      });
    }
    return item;
  }));
  updateAchievementCount();
}

function getAvailableRouletteCards() {
  const remainingIds = new Set(save.rouletteRemainingIds);
  return ROULETTE_CARDS.filter((card) => remainingIds.has(card.id));
}

function renderRoulette() {
  const remaining = getAvailableRouletteCards();
  const availableWeight = RARITY_ODDS
    .filter((rarity) => remaining.some((card) => card.rarity === rarity.id))
    .reduce((total, rarity) => total + rarity.chance, 0);
  const odds = $("#roulette-odds");
  odds.replaceChildren(...RARITY_ODDS.map((rarity) => {
    const card = document.createElement("div");
    const present = remaining.some((item) => item.rarity === rarity.id);
    const actualChance = present ? Math.round((rarity.chance / availableWeight) * 1000) / 10 : 0;
    card.className = `roulette-odds-card rarity-${rarity.id}${present ? "" : " is-empty"}`;
    card.innerHTML = `<strong>${rarity.name}</strong><span>${actualChance.toFixed(actualChance % 1 ? 1 : 0)}% · ${remaining.filter((item) => item.rarity === rarity.id).length} left</span>`;
    return card;
  }));
  const collection = $("#roulette-collection");
  collection.replaceChildren(...remaining.map((card) => {
    const entry = document.createElement("div");
    entry.className = `roulette-card rarity-${card.rarity}`;
    entry.innerHTML = `<span aria-hidden="true">${card.icon}</span><span>${card.name}</span>`;
    return entry;
  }));
  const owned = ROULETTE_CARDS.filter((card) => save.ownedCards.includes(card.id));
  $("#owned-card-count").textContent = String(owned.length);
  const ownedList = $("#owned-card-list");
  ownedList.replaceChildren(...(owned.length ? owned : [{ name: "No rare cards yet — the wheel is waiting." }]).map((card) => {
    const entry = document.createElement("div");
    entry.className = `owned-card${card.rarity ? ` rarity-${card.rarity}` : " is-empty"}`;
    entry.textContent = card.name;
    return entry;
  }));
  $("#roulette-spin").disabled = rouletteSpinning || save.chips < 1 || remaining.length === 0;
  $("#roulette-spin").textContent = remaining.length === 0 ? "The wheel is empty!" : rouletteSpinning ? "The wheel is spinning…" : "Spin · 1 chip";
  $("#roulette-remaining").textContent = `${remaining.length} / ${ROULETTE_CARDS.length} cards remain`;
  updateAchievementCount();
}

function spinRoulette() {
  const remaining = getAvailableRouletteCards();
  if (rouletteSpinning || save.chips < 1 || remaining.length === 0) return;

  const availableRarities = RARITY_ODDS.filter((rarity) => remaining.some((card) => card.rarity === rarity.id));
  const totalWeight = availableRarities.reduce((total, rarity) => total + rarity.chance, 0);
  let roll = Math.random() * totalWeight;
  let selectedRarity = availableRarities[0];
  for (const rarity of availableRarities) {
    roll -= rarity.chance;
    if (roll < 0) {
      selectedRarity = rarity;
      break;
    }
  }
  const rarityCards = remaining.filter((card) => card.rarity === selectedRarity.id);
  const wonCard = rarityCards[Math.floor(Math.random() * rarityCards.length)];

  rouletteSpinning = true;
  save.chips -= 1;
  save.rouletteRemainingIds = save.rouletteRemainingIds.filter((id) => id !== wonCard.id);
  save.ownedCards.push(wonCard.id);
  awardAchievement("gambling-first");
  if (save.rouletteRemainingIds.length === 0) awardAchievement("empty-wheel");
  persistSave();
  $("#roulette-wheel").classList.remove("is-spinning");
  void $("#roulette-wheel").offsetWidth;
  $("#roulette-wheel").classList.add("is-spinning");
  $("#roulette-result").textContent = "The wheel is rattling…";
  renderRoulette();
  window.setTimeout(() => {
    rouletteSpinning = false;
    $("#roulette-wheel").classList.remove("is-spinning");
    $("#roulette-result").textContent = `You won ${wonCard.icon} ${wonCard.name} · ${selectedRarity.name}! It may appear in an Endless draft.`;
    renderRoulette();
  }, 1500);
}

function setHomePanel(panelId) {
  $$(".home-panel").forEach((panel) => { panel.hidden = panel.id !== panelId; });
  $$(".home-tab").forEach((tab) => {
    const active = tab.dataset.panel === panelId;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
  if (panelId === "achievements-panel") renderAchievements();
  if (panelId === "leaderboards-panel") renderLeaderboards();
  if (panelId === "gambling-panel") renderRoulette();
}

function stopTimers() {
  window.clearInterval(movementTimer);
  window.clearInterval(countdownTimer);
  window.clearInterval(eventTimer);
  window.clearTimeout(eventHideTimer);
  window.clearTimeout(catchTimer);
  window.clearTimeout(blueFreezeTimer);
  movementTimer = undefined;
  countdownTimer = undefined;
  eventTimer = undefined;
  eventHideTimer = undefined;
  catchTimer = undefined;
  blueFreezeTimer = undefined;
  inputFrozenUntil = 0;
  targetLayer.classList.remove("is-input-frozen");
}

function showHome() {
  stopTimers();
  stopMusic();
  roundNumber += 1;
  playScreen.hidden = true;
  pawScreen.hidden = true;
  homeScreen.hidden = false;
  outcomeCard.hidden = true;
  draftOverlay.hidden = true;
  setHomePanel("modes-panel");
  updateModeCards();
}

function characterArt(kind, options = {}) {
  const id = ++nextCharacterId;
  const colors = {
    good: { coat: "#a8324b", light: "#ed6b71", hair: "#f7f0f3", shade: "#a79baa", trim: "#ffd77f", pattern: "#ffd46f" },
    bad: { coat: "#171720", light: "#28794e", hair: "#241629", shade: "#61415b", trim: "#b5d17c", pattern: "#66bc71" },
    mimic: { coat: "#553286", light: "#b363dc", hair: "#eadbff", shade: "#a987cc", trim: "#edd1ff", pattern: "#c784ef" },
    blue: { coat: "#174e9c", light: "#61b8ff", hair: "#d8f3ff", shade: "#6495c2", trim: "#c6f4ff", pattern: "#69d5ff" },
  }[kind] || { coat: "#a8324b", light: "#ed6b71", hair: "#f7f0f3", shade: "#a79baa", trim: "#ffd77f", pattern: "#ffd46f" };
  const smile = kind === "bad"
    ? '<path d="M41 54q17 16 32-1-3 15-17 16-10-1-15-15Z" fill="#342439" stroke="#272038" stroke-width="2"/><path d="m49 59 3 5m7-3v5m7-8-2 5" stroke="#fff1d9" stroke-width="1.6" stroke-linecap="round"/>'
    : kind === "good"
      ? ""
      : '<path d="M42 54q16 13 32 0-3 16-16 17-13-1-16-17Z" fill="#342439" stroke="#272038" stroke-width="2"/><path d="M47 58q11 5 22 0l-2 6q-9 4-18 0Z" fill="#fff8e9"/><path d="M53 59v6m6-6v6m6-6v5" stroke="#b8acaa" stroke-width="1"/>';
  const face = kind === "good"
    ? '<path d="M29 40Q31 17 56 17Q81 17 83 40Q82 57 70 62Q56 68 42 62Q30 57 29 40Z" fill="#fff8ed" stroke="#302a39" stroke-width="2"/>'
    : '<path d="M29 40q1-22 27-23 26 1 27 23-5 21-27 27-22-6-27-27Z" fill="#fff8ed" stroke="#302a39" stroke-width="2"/>';
  const eyes = kind === "bad"
    ? '<path d="m43 39 9 2-9 5m29-7-9 2 9 5" fill="none" stroke="#19432c" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'
    : '<path d="M41 43q5-7 11 0m14 0q5-7 11 0" fill="none" stroke="#262137" stroke-width="3.5" stroke-linecap="round"/>';
  const pattern = kind === "bad"
    ? '<path d="M7 0 14 7 7 14 0 7Z" fill="#61b96d"/><path d="M7 0 7 14 0 7Z" fill="#17261d" opacity=".82"/>'
    : kind === "mimic"
      ? '<path d="M7 0 14 7 7 14 0 7Z" fill="#e1aeff"/><path d="M7 0 7 14 0 7Z" fill="#67408f"/>'
      : kind === "blue"
        ? '<path d="M7 0 14 7 7 14 0 7Z" fill="#a8e8ff"/><path d="M7 0 7 14 0 7Z" fill="#2368bd"/>'
        : '<path d="m7 1 1.8 4 4.3.4-3.3 2.8 1 4.2L7 10.1l-3.8 2.3 1-4.2L.9 5.4 5.2 5Z" fill="#ffd46f"/>';
  const armsUp = options.armsUp ? " is-arms-up" : "";

  return `<svg class="jester-art jester-art--${kind}${armsUp}" viewBox="0 0 112 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="coat-${id}" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${colors.light}"/><stop offset="1" stop-color="${colors.coat}"/></linearGradient>
      <linearGradient id="hair-${id}" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${colors.shade}"/><stop offset=".48" stop-color="${colors.hair}"/><stop offset="1" stop-color="${colors.shade}"/></linearGradient>
      <linearGradient id="gold-${id}" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff0b0"/><stop offset=".5" stop-color="${colors.trim}"/><stop offset="1" stop-color="#bb762d"/></linearGradient>
      <pattern id="fabric-${id}" width="14" height="14" patternUnits="userSpaceOnUse">${pattern}</pattern>
      <filter id="shadow-${id}" x="-40%" y="-30%" width="180%" height="180%"><feDropShadow dx="0" dy="2.5" stdDeviation="2.2" flood-color="#101525" flood-opacity=".28"/></filter>
    </defs>
    <ellipse cx="56" cy="124" rx="28" ry="5" fill="#171b2d" opacity=".22"/>
    <g filter="url(#shadow-${id})">
      <g class="puppet-arm puppet-arm--left"><path d="m35 74-20 12" fill="none" stroke="#1c2033" stroke-width="12" stroke-linecap="round"/><path d="m35 73-20 12" fill="none" stroke="url(#coat-${id})" stroke-width="8" stroke-linecap="round"/><path d="m18 82-8 1-4 6 5 5 7-2 4-6Z" fill="#fff3e3" stroke="#272238" stroke-width="2"/></g>
      <g class="puppet-arm puppet-arm--right"><path d="m77 73 20 13" fill="none" stroke="#1c2033" stroke-width="12" stroke-linecap="round"/><path d="m77 73 20 13" fill="none" stroke="url(#coat-${id})" stroke-width="8" stroke-linecap="round"/><path d="m94 82 8 1 4 6-5 5-7-2-4-6Z" fill="#fff3e3" stroke="#272238" stroke-width="2"/></g>
      <path d="M37 68q19-9 38 0l9 36q-27 13-56 0Z" fill="url(#coat-${id})" stroke="#22233a" stroke-width="2.5"/>
      <path d="M37 72q19-7 38 0l3 11q-21 7-44 0Z" fill="url(#fabric-${id})" opacity=".95"/>
      <path d="m56 70-8 15 8 12 8-12Z" fill="#fff3e1" stroke="#b88956" stroke-width="1.4"/>
      <path d="M38 81q18 8 37 0M36 103q20 8 41 0" fill="none" stroke="url(#gold-${id})" stroke-width="3"/>
      <circle cx="56" cy="92" r="3" fill="url(#gold-${id})"/>
      <path d="M27 29q-17 7-23 45l8 3q8-11 20-23m48-26q18 9 28 44l-9 4q-8-13-21-23" fill="url(#coat-${id})" stroke="#22233a" stroke-width="2.3" stroke-linejoin="round"/>
      <path d="M27 31q-13 12-20 42l7 3q8-16 22-24m49-20q17 14 24 42l-7 3Q93 61 78 52" fill="url(#fabric-${id})"/>
      <path d="M24 39Q8 23 25 6q11 4 22 23m41 10Q104 22 88 6q-11 4-21 23" fill="${colors.coat}" stroke="#20243a" stroke-width="2.5"/>
      <path d="M24 39Q8 23 25 6q11 4 22 23m41 10Q104 22 88 6q-11 4-21 23" fill="url(#fabric-${id})"/>
      <circle cx="9" cy="85" r="4.5" fill="url(#gold-${id})" stroke="#543d34" stroke-width="1.3"/><circle cx="103" cy="85" r="4.5" fill="url(#gold-${id})" stroke="#543d34" stroke-width="1.3"/>
      ${face}
      ${kind === "good" ? '<path d="M27 51Q33 55 39 51Q45 57 51 53Q56 58 62 53Q68 57 74 51Q80 55 85 51L82 59Q79 66 73 61Q68 69 62 63Q56 71 50 64Q44 70 39 63Q33 68 29 59Z" fill="#fff8e9" stroke="#d4c7bd" stroke-width="1.5" stroke-linejoin="round"/>' : ""}
      <path d="M31 43q-8-22 10-29l15 8q-13 1-19 18m44 3q8-22-10-29L56 22q13 1 19 18" fill="url(#hair-${id})" stroke="${colors.shade}" stroke-width="1.7" stroke-linejoin="round"/>
      <path d="M40 23q-9 7-8 21l-5 12q-1 8-6 13 14-1 20-18m31-28q10 8 9 21l5 12q1 8 6 13-14-1-20-18" fill="url(#hair-${id})" stroke="${colors.shade}" stroke-width="1.5" stroke-linejoin="round"/>
      ${eyes}${smile}
      <path d="M47 19Q39 9 32 13L23 7q8-9 19-4 9 3 14 12 5-9 14-12 11-5 19 4l-9 6q-7-4-15 6l-9 11Z" fill="url(#hair-${id})" stroke="${colors.shade}" stroke-width="1.8" stroke-linejoin="round"/>
    </g></svg>`;
}

function getBadTargetCount() {
  if (activeMode === "hard") return 3;
  if (activeMode === "lunatic") return 5;
  if (activeMode === "endless") {
    return Math.max(1, 1 + Math.floor(score / 50) + getCardEffectTotal("badCount", "benefit") + getCardEffectTotal("badCount", "drawback"));
  }
  if (activeMode === "secret") return 1 + Math.floor(score / 25);
  return score >= 20 ? 1 : 0;
}

function getTargetPosition(excludedTarget, targetSize = 102) {
  const bounds = arena.getBoundingClientRect();
  const paddingX = Math.min(targetSize / 2 + 12, bounds.width / 3);
  const paddingY = Math.min(targetSize / 2 + 54, bounds.height / 3);
  const pointer = pointerPosition
    ? { x: pointerPosition.x - bounds.left, y: pointerPosition.y - bounds.top }
    : undefined;
  const positions = targets
    .filter((target) => target.element !== excludedTarget && target.element.isConnected)
    .map((target) => ({
      x: Number.parseFloat(target.element.style.left),
      y: Number.parseFloat(target.element.style.top),
    }));
  let best;
  let bestClearance = -Infinity;

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const position = {
      x: paddingX + Math.random() * Math.max(1, bounds.width - paddingX * 2),
      y: paddingY + Math.random() * Math.max(1, bounds.height - paddingY * 2),
    };
    const cursorGap = pointer ? Math.hypot(position.x - pointer.x, position.y - pointer.y) : Infinity;
    const targetGap = positions.length
      ? Math.min(...positions.map((other) => Math.hypot(position.x - other.x, position.y - other.y)))
      : Infinity;
    const clearance = Math.min(cursorGap - targetSize * 0.82, targetGap - targetSize - 14);
    if (clearance > bestClearance) {
      best = position;
      bestClearance = clearance;
    }
    if (cursorGap > targetSize * 1.35 && targetGap > targetSize + 14) return position;
  }
  return best || {
    x: bounds.width / 2,
    y: bounds.height / 2,
  };
}

function moveTarget(target) {
  if (!target.element.isConnected) return;
  const position = getTargetPosition(target.element, target.kind === "mimic" ? 88 : 102);
  target.element.style.left = `${position.x}px`;
  target.element.style.top = `${position.y}px`;
  target.lastDash = Date.now();
}

function getTargetDashDelay(target) {
  const difficulty = {
    normal: 1,
    hard: 0.67,
    lunatic: 0.43,
    endless: 0.72,
    secret: 0.78,
  }[activeMode] || 1;
  let delay = target.kind === "bad" ? 2250 : 1850;
  if (activeMode === "hard") delay = target.kind === "bad" ? 1450 : 1190;
  if (activeMode === "lunatic") delay = target.kind === "bad" ? 980 : 850;
  if (activeMode === "secret") delay = target.kind === "bad" ? 1850 : 1530;
  delay *= difficulty;
  if (target.kind === "bad") delay *= getCardEffectMultiplier("badDash");
  if (target.kind === "good") delay *= getCardEffectMultiplier("goodDash");
  if (activeMode === "secret" && secretEvent === "fast") delay *= 0.57;
  if (activeMode === "secret" && secretEvent === "slow") delay *= 1.55;
  if (target.kind === "good" && activeMode === "hard") delay *= 0.85;
  if (target.kind === "good" && activeMode === "lunatic") delay *= 0.7;
  return Math.max(330, delay);
}

function createTarget(kind) {
  const element = document.createElement("button");
  const target = { kind, element, lastDash: 0 };
  element.type = "button";
  element.className = `target target--${kind}`;
  element.dataset.hit = "false";
  renderTarget(target);
  element.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") activateTarget(target);
  });
  element.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
      event.preventDefault();
      activateTarget(target);
    }
  });
  element.addEventListener("click", (event) => {
    if (event.detail === 0) activateTarget(target);
  });
  targets.push(target);
  targetLayer.append(element);
  moveTarget(target);
  return target;
}

function renderTarget(target) {
  const names = {
    good: "Catch the smiling jester",
    bad: "Trickster — do not catch",
    mimic: "Purple jester — reveal the good jester",
    blue: "Blue jester — your controls are paused",
  };
  target.element.setAttribute("aria-label", names[target.kind] || "Jester");
  target.element.innerHTML = characterArt(
    target.kind === "good" && activeMode === "lunatic" && !mimicCleared
      ? "bad"
      : target.kind,
  );
}

function drawTargets() {
  targetLayer.replaceChildren();
  targets = [];
  mimicCleared = activeMode !== "lunatic";
  createTarget("good");
  if (activeMode === "lunatic") createTarget("mimic");
  for (let index = 0; index < getBadTargetCount(); index += 1) createTarget("bad");
}

function getCatchDuration() {
  let duration = {
    normal: 3800,
    hard: 3200,
    lunatic: 2900,
    endless: 3600,
    secret: 3700,
  }[activeMode] || 3600;
  duration += getCardEffectTotal("time", "benefit") + getCardEffectTotal("time", "drawback");
  if (activeMode === "secret" && secretEvent === "short") duration -= 1100;
  if (activeMode === "secret" && secretEvent === "slow") duration += 1200;
  return Math.max(1350, duration);
}

function startCatchTimer() {
  window.clearInterval(countdownTimer);
  initialTimerDuration = getCatchDuration();
  timerDeadline = performance.now() + initialTimerDuration;
  timerTrack.setAttribute("aria-valuenow", "100");
  timerValue.textContent = `${(initialTimerDuration / 1000).toFixed(1)}s`;
  timerFill.style.width = "100%";
  countdownTimer = window.setInterval(updateCatchTimer, 50);
}

function updateCatchTimer() {
  if (draftOverlay.hidden === false || outcomeCard.hidden === false) return;
  const remaining = Math.max(0, timerDeadline - performance.now());
  const percentage = Math.min(100, (remaining / initialTimerDuration) * 100);
  timerFill.style.width = `${percentage}%`;
  timerTrack.setAttribute("aria-valuenow", String(Math.round(percentage)));
  timerValue.textContent = `${(remaining / 1000).toFixed(1)}s`;
  if (remaining === 0) {
    if (activeMode === "endless" && timerSaves > 0) {
      timerSaves -= 1;
      showEvent("Your spare ticket bought one more chance!", "celebration");
      startCatchTimer();
      return;
    }
    finishGame("timeout");
  }
}

function updateScore() {
  $("#score-value").textContent = String(score);
  const endless = activeMode === "endless";
  const secret = activeMode === "secret";
  const targetScore = secret ? 250 : 100;
  const progress = endless ? Math.min(score, 200) / 2 : Math.min(score, targetScore);
  $("#progress-value").textContent = endless ? `${score} · ∞` : `${score} / ${targetScore}`;
  $("#progress-label").textContent = endless
    ? score >= 200 ? "Secret unlocked · endless tickets" : "Secret show at 200"
    : secret ? "The final curtain at 250" : "Your first 100";
  $("#progress-fill").style.width = `${progress}%`;
  $("#progress-track").setAttribute("aria-valuenow", String(progress));
  $("#progress-track").setAttribute("aria-label", endless ? "Endless tickets; Secret mode unlocks at 200" : `Progress to ${targetScore} tickets`);
  if (endless && score >= 200) {
    const newlyUnlocked = !save.unlocked.secret;
    save.unlocked.secret = true;
    awardAchievement("endless-200");
    persistSave();
    updateModeCards();
    if (newlyUnlocked) showEvent("200 tickets! Secret mode is unlocked — keep going!", "celebration");
  }
  const warning = activeMode === "normal" && score === 19;
  if (warning) awardAchievement("near-miss");
  const tricksterCount = activeMode === "secret"
    ? targets.filter((target) => target.kind === "bad" && target.element.isConnected).length
    : getBadTargetCount();
  $("#danger-label").textContent = activeMode === "lunatic"
    ? "Five tricksters + a purple mimic"
    : activeMode === "hard"
      ? "Three speedy tricksters"
      : activeMode === "endless"
        ? `${getBadTargetCount()} trickster${getBadTargetCount() === 1 ? "" : "s"} · ${buffs.length} buff${buffs.length === 1 ? "" : "s"}`
        : activeMode === "secret"
          ? `${tricksterCount} trickster${tricksterCount === 1 ? "" : "s"} · anything could happen`
          : warning
            ? "One ticket left — trickster next!"
            : score >= 20
              ? "The trickster is in the mix!"
              : "Trickster arrives at 20";
  $("#trickster-warning").hidden = !warning;
  if (warning) {
    $("#play-hint").innerHTML = '<span class="hint-spark" aria-hidden="true">✦</span> One more ticket and the trickster joins. Stay sharp!';
  } else if (activeMode === "lunatic" && !mimicCleared) {
    $("#play-hint").innerHTML = '<span class="hint-spark" aria-hidden="true">☾</span> Find the purple jester first to reveal your good one.';
  } else {
    $("#play-hint").innerHTML = `<span class="hint-spark" aria-hidden="true">✦</span> ${activeMode === "secret" ? "The tent is acting strange. Watch for surprises." : "Catch the jester before time runs out. Avoid the tricksters!"}`;
  }
}

function ensureAudioContext() {
  const Constructor = window.AudioContext || window.webkitAudioContext;
  if (!Constructor) return undefined;
  if (!audioContext) audioContext = new Constructor();
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
  playTone([[720, 0, 0.07], [1370, 0.04, 0.07], [980, 0.09, 0.15]], "sine", 0.072);
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
  if (bass[musicBeat % bass.length]) playTone([[bass[musicBeat % bass.length], 0, 0.3]], "sine", 0.045);
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
    if (outcomeCard.hidden === false || draftOverlay.hidden === false) return;
    const now = Date.now();
    targets.forEach((target) => {
      const disguisedGood = target.kind === "good" && !mimicCleared;
      if (activeMode === "lunatic" && (target.kind === "bad" || disguisedGood)) return;
      if (now - target.lastDash >= getTargetDashDelay(target)) moveTarget(target);
    });
  }, 80);
}

function showEvent(message, kind = "") {
  const banner = $("#event-banner");
  banner.textContent = message;
  banner.className = `event-banner${kind ? ` event-banner--${kind}` : ""}`;
  banner.hidden = false;
  window.clearTimeout(eventHideTimer);
  eventHideTimer = window.setTimeout(() => { banner.hidden = true; }, 2900);
}

function maybeSpawnSecretCat() {
  if (secretCatUsed || outcomeCard.hidden === false) return;
  secretCatUsed = true;
  const cat = document.createElement("button");
  cat.type = "button";
  cat.className = "secret-cat";
  cat.textContent = "🐈‍⬛";
  cat.setAttribute("aria-label", "Mystery cat! Click quickly to unlock Pip-Paw Circus");
  const bounds = arena.getBoundingClientRect();
  const position = getTargetPosition(undefined, 56);
  cat.style.left = `${Math.max(28, Math.min(bounds.width - 28, position.x))}px`;
  cat.style.top = `${Math.max(76, Math.min(bounds.height - 44, position.y))}px`;
  cat.addEventListener("click", () => unlockPipPaw(cat));
  targetLayer.append(cat);
  showEvent("Something slipped between the curtains…", "mystery");
  window.setTimeout(() => cat.remove(), 2200);
}

function triggerSecretEvent() {
  if (outcomeCard.hidden === false || draftOverlay.hidden === false || performance.now() < inputFrozenUntil) return;
  secretEvent = "none";
  const eventRoll = Math.random();
  const catChance = score >= 50 ? 0.07 : 0.035;
  if (eventRoll < catChance && !secretCatUsed) {
    maybeSpawnSecretCat();
    return;
  }
  const events = [
    { key: "slow", text: "The big top takes a slow breath. Catching gets easier!" },
    { key: "fast", text: "The music speeds up! Tricksters dash faster!" },
    { key: "short", text: "A gust stole some of your time!" },
    { key: "extra", text: "More tricksters tumble out of the wings!" },
    { key: "gift", text: "A loose ticket buys you a little extra time!" },
    { key: "blue", text: "A blue jester freezes the clock and your controls for five seconds!" },
  ];
  const event = events[Math.floor(Math.random() * events.length)];
  secretEvent = event.key;
  if (event.key === "blue") {
    awardAchievement("bluey");
    inputFrozenUntil = performance.now() + 5000;
    timerDeadline += 5000;
    targetLayer.classList.add("is-input-frozen");
    const blueJester = createTarget("blue");
    showEvent(event.text, "mystery");
    blueFreezeTimer = window.setTimeout(() => {
      blueJester.element.remove();
      targets = targets.filter((target) => target !== blueJester);
      inputFrozenUntil = 0;
      secretEvent = "none";
      targetLayer.classList.remove("is-input-frozen");
      blueFreezeTimer = undefined;
      showEvent("The blue jester vanished. Your controls are back!", "celebration");
      updateScore();
    }, 5000);
    return;
  }
  showEvent(event.text, event.key === "fast" || event.key === "short" || event.key === "extra" ? "danger" : "celebration");
  if (event.key === "gift") timerDeadline += 1600;
  if (event.key === "short") timerDeadline -= 1100;
  if (event.key === "slow") timerDeadline += 1200;
  if (event.key === "gift") awardAchievement("loose-ticket");
  if (event.key === "slow") {
    const good = targets.find((target) => target.kind === "good");
    if (good) good.lastDash += 1800;
  }
  if (event.key === "extra") {
    awardAchievement("extra-trickster");
    createTarget("bad");
  }
  updateScore();
  window.setTimeout(() => {
    if (secretEvent === event.key) {
      secretEvent = "none";
      updateScore();
    }
  }, 5200);
}

function unlockPipPaw(cat) {
  if (!cat.isConnected) return;
  cat.remove();
  save.unlocked.pipPaw = true;
  persistSave();
  $("#pip-paw-tab").hidden = false;
  awardAchievement("pip-paw");
  awardAchievement("cat-clicked");
  showEvent("A tiny cat handed you a ticket to Pip-Paw Circus!", "celebration");
  announcer.textContent = "Pip-Paw Circus is unlocked!";
}

function drawBuffDraft() {
  window.clearInterval(movementTimer);
  window.clearInterval(countdownTimer);
  movementTimer = undefined;
  countdownTimer = undefined;
  draftOverlay.hidden = false;
  $("#draft-title").textContent = `Ticket ${score}: choose your pair`;
  $("#draft-copy").textContent = "A player buff and its matching trickster drawback come as a pair.";
  const ownedCards = ROULETTE_CARDS.filter((card) => save.ownedCards.includes(card.id));
  const choices = [...BUFF_CARDS].sort(() => Math.random() - 0.5).slice(0, ownedCards.length && Math.random() < 0.55 ? 2 : 3);
  if (choices.length === 2) {
    choices.push(ownedCards[Math.floor(Math.random() * ownedCards.length)]);
  }
  choices.sort(() => Math.random() - 0.5);
  const container = $("#draft-options");
  container.replaceChildren(...choices.map((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "draft-card";
    button.innerHTML = `<span class="draft-icon" aria-hidden="true">${choice.icon}</span><strong>${choice.name}</strong><span class="draft-rarity">${choice.rarity ? `${RARITY_ODDS.find((rarity) => rarity.id === choice.rarity).name} collectible` : "Circus classic"}</span><span class="draft-benefit">Your buff · ${choice.benefit}</span><span class="draft-drawback">Trickster drawback · ${choice.drawback}</span>`;
    button.addEventListener("click", () => {
      buffs.push(choice.id);
      timerSaves += choice.benefitEffect.timerSaves || 0;
      freeMistakes += choice.benefitEffect.freeMistakes || 0;
      if (choice.benefitEffect.timerSaves) awardAchievement("spare-ticket");
      draftOverlay.hidden = true;
      showEvent(`${choice.name} picked. ${choice.drawback}!`, "mystery");
      drawTargets();
      updateScore();
      startCatchTimer();
      startMovement();
    });
    return button;
  }));
}

function finishGame(result) {
  stopTimers();
  stopMusic();
  $("#timer-row").hidden = true;
  $("#trickster-warning").hidden = true;
  $("#event-banner").hidden = true;
  outcomeCard.hidden = false;
  outcomeCard.classList.remove("outcome-card--win", "outcome-card--lose");
  const won = result === "win";
  if (won) {
    if (!soundEnabled) awardAchievement("silent-show");
    outcomeCard.classList.add("outcome-card--win");
    showOutcomeArt("assets/pierrot-win-roses.png");
    $("#outcome-icon").textContent = "🌹";
    $("#outcome-kicker").textContent = "The whole tent is cheering!";
    $("#outcome-title").textContent = activeMode === "secret" ? "Two hundred and fifty tickets!" : "Encore!";
    $("#outcome-copy").textContent = `${MODE_NAMES[activeMode]} act complete — you caught ${score} jesters!`;
    playWinSound();
    if (activeMode === "normal") {
      awardAchievement("normal-win");
      save.unlocked.hard = true;
      save.unlocked.endless = true;
      announcer.textContent = "You beat Normal mode and unlocked Hard and Endless!";
    } else if (activeMode === "hard") {
      awardAchievement("hard-win");
      save.unlocked.lunatic = true;
      announcer.textContent = "You beat Hard and unlocked Lunatic mode!";
    } else if (activeMode === "lunatic") {
      awardAchievement("lunatic-win");
      announcer.textContent = "You beat Lunatic mode. Try hard achievement unlocked!";
    } else if (activeMode === "secret") {
      awardAchievement("secret-win");
      announcer.textContent = "You beat Secret mode. Really like this? achievement unlocked!";
    }
    persistSave();
    updateModeCards();
  } else {
    outcomeCard.classList.add("outcome-card--lose");
    showOutcomeArt("assets/trickster-game-over.png");
    $("#outcome-icon").textContent = "🎭";
    $("#outcome-kicker").textContent = result === "timeout" ? "The bell rang…" : "The lights go out…";
    $("#outcome-title").textContent = result === "timeout" ? "Too slow!" : "The trickster got you!";
    $("#outcome-copy").textContent = result === "timeout"
      ? `Time ran out with ${score} tickets. The jester slipped backstage.`
      : `You collected ${score} tickets. The trickster brought the show to a close.`;
    playOopsSound();
    save.losses += 1;
    if (save.losses === 1) awardAchievement("first-loss");
    if (save.losses === 100) awardAchievement("hundred-losses");
    persistSave();
    announcer.textContent = result === "timeout" ? `Time ran out. You scored ${score}.` : `Game over. You scored ${score}.`;
  }
  $("#outcome-home-button").textContent = "Choose an act";
}

function showOutcomeArt(source) {
  const image = document.createElement("img");
  image.src = source;
  image.alt = "";
  image.decoding = "async";
  $("#outcome-art").replaceChildren(image);
}

function recordMistake() {
  if (activeMode === "endless" && freeMistakes > 0) {
    freeMistakes -= 1;
    showEvent("Your lucky bell bounced off a trickster!", "celebration");
    return false;
  }
  return true;
}

function activateTarget(target) {
  if (outcomeCard.hidden === false || draftOverlay.hidden === false || performance.now() < inputFrozenUntil || target.kind === "blue" || target.element.dataset.hit === "true") return;
  target.element.dataset.hit = "true";
  if (target.kind === "mimic") {
    mimicCleared = true;
    awardAchievement("mimic-tapped");
    target.element.remove();
    const good = targets.find((item) => item.kind === "good");
    if (good) renderTarget(good);
    startCatchTimer();
    updateScore();
    playTone([[740, 0, 0.12], [990, 0.12, 0.18]], "triangle", 0.07);
    announcer.textContent = "Purple jester tapped. Your good jester is revealed!";
    return;
  }
  if (target.kind === "bad") {
    if (!recordMistake()) {
      target.element.classList.add("is-bonked");
      target.element.remove();
      return;
    }
    finishGame("lose");
    return;
  }

  if (activeMode === "lunatic" && !mimicCleared) {
    finishGame("lose");
    return;
  }
  window.clearInterval(countdownTimer);
  countdownTimer = undefined;
  score += 1;
  if (score === 1) awardAchievement("first-ticket");
  if (score === 10) awardAchievement("ten-tickets");
  playSqueakSound();
  target.element.classList.add("is-celebrating");
  updateScore();
  announcer.textContent = `Jester caught. Score ${score}.`;
  const currentRound = roundNumber;
  catchTimer = window.setTimeout(() => {
    if (roundNumber !== currentRound) return;
    if (activeMode === "secret" && score >= 250) {
      finishGame("win");
      return;
    }
    if (activeMode !== "endless" && activeMode !== "secret" && score >= 100) {
      finishGame("win");
      return;
    }
    if (activeMode === "endless" && score % 20 === 0) {
      drawBuffDraft();
      return;
    }
    drawTargets();
    updateScore();
    startCatchTimer();
    startMovement();
  }, 220);
}

function startGame() {
  stopTimers();
  stopMusic();
  roundNumber += 1;
  activeMode = selectedMode;
  score = 0;
  mimicCleared = activeMode !== "lunatic";
  freeMistakes = 0;
  timerSaves = 0;
  buffs = [];
  secretEvent = "none";
  secretCatUsed = false;
  inputFrozenUntil = 0;
  targetLayer.classList.remove("is-input-frozen");
  homeScreen.hidden = true;
  pawScreen.hidden = true;
  playScreen.hidden = false;
  outcomeCard.hidden = true;
  draftOverlay.hidden = true;
  $("#timer-row").hidden = false;
  $("#mode-label").textContent = `${MODE_NAMES[activeMode]} mode`;
  $("#play-title").textContent = activeMode === "endless" ? "Keep the show going!" : activeMode === "secret" ? "The strange show begins…" : "The show is yours!";
  $("#play-title").setAttribute("tabindex", "-1");
  startMusic();
  updateScore();
  drawTargets();
  startCatchTimer();
  startMovement();
  if (activeMode === "secret") {
    eventTimer = window.setInterval(triggerSecretEvent, 8500 + Math.random() * 4500);
    showEvent("Secret act! Every 25 tickets adds another trickster.", "mystery");
  }
  $("#play-title").focus({ preventScroll: true });
}

function startPawGame() {
  stopPawGame();
  pawRound += 1;
  const thisPawRound = pawRound;
  pawActive = true;
  pawSubmitting = false;
  pawScore = 0;
  pawMisses = 0;
  pawSeconds = 30;
  $("#paw-result").hidden = true;
  $("#paw-score").textContent = "0";
  $("#paw-misses").textContent = "0 / 3";
  $("#paw-time").textContent = "30";
  $("#paw-best").textContent = `Best: ${save.pawBest}`;
  $("#paw-arena").classList.add("is-playing");
  spawnPawTarget(thisPawRound);
  pawClock = window.setInterval(() => {
    if (!pawActive || pawRound !== thisPawRound) return;
    pawSeconds -= 1;
    $("#paw-time").textContent = String(pawSeconds);
    if (pawSeconds <= 0) finishPawGame(thisPawRound);
  }, 1000);
}

function spawnPawTarget(thisPawRound) {
  if (!pawActive || pawRound !== thisPawRound) return;
  const layer = $("#paw-target-layer");
  layer.replaceChildren();
  const bounds = $("#paw-arena").getBoundingClientRect();
  const target = document.createElement("button");
  target.type = "button";
  target.className = "paw-jester";
  target.setAttribute("aria-label", "Jester mole. Hover to whack!");
  target.innerHTML = `${characterArt("good")}<span class="paw-whack" aria-hidden="true">🐾</span>`;
  target.style.left = `${58 + Math.random() * Math.max(1, bounds.width - 116)}px`;
  target.style.top = `${88 + Math.random() * Math.max(1, bounds.height - 152)}px`;
  let hit = false;
  const whack = (event) => {
    if (hit || !pawActive) return;
    if (event && event.pointerType === "touch") event.preventDefault();
    hit = true;
    pawScore += 1;
    $("#paw-score").textContent = String(pawScore);
    if (pawScore === 10) awardAchievement("paw-ten");
    target.classList.add("is-whacked");
    playSqueakSound();
    window.clearTimeout(pawTargetTimeout);
    pawTargetTimeout = window.setTimeout(() => spawnPawTarget(thisPawRound), 240);
  };
  target.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") whack(event);
  });
  target.addEventListener("pointerdown", whack);
  target.addEventListener("click", (event) => {
    if (event.detail === 0) whack(event);
  });
  layer.append(target);
  pawTargetTimeout = window.setTimeout(() => {
    if (hit || !pawActive || pawRound !== thisPawRound) return;
    pawMisses += 1;
    $("#paw-misses").textContent = `${pawMisses} / 3`;
    if (pawMisses >= 3) {
      finishPawGame(thisPawRound);
      return;
    }
    spawnPawTarget(thisPawRound);
  }, Math.max(900, 1650 - pawScore * 14));
}

function stopPawGame() {
  pawActive = false;
  pawRound += 1;
  window.clearInterval(pawClock);
  window.clearTimeout(pawTargetTimeout);
  pawClock = undefined;
  pawTargetTimeout = undefined;
}

function finishPawGame(thisPawRound) {
  if (pawRound !== thisPawRound || pawSubmitting) return;
  pawSubmitting = true;
  stopPawGame();
  $("#paw-arena").classList.remove("is-playing");
  $("#paw-target-layer").replaceChildren();
  $("#paw-result").hidden = false;
  $("#paw-result-title").textContent = pawMisses >= 3 ? "Three got away!" : "Lovely whacking!";
  $("#paw-result-copy").textContent = `${pawScore} jester${pawScore === 1 ? "" : "s"} whacked. ${pawMisses >= 3 ? "Try a quicker paw!" : "The show is over for now."}`;
  if (pawMisses >= 3) awardAchievement("paw-misses");
  recordPawScore(pawScore);
  $("#paw-best").textContent = `Best: ${save.pawBest}`;
}

function updateHomeArt() {
  $("#hero-jester").innerHTML = characterArt("good");
  $("#hero-trickster").innerHTML = characterArt("bad");
}

$$(".home-tab[data-panel]").forEach((tab) => {
  tab.addEventListener("click", () => setHomePanel(tab.dataset.panel));
});

$$(".mode-card").forEach((card) => {
  card.addEventListener("click", () => chooseMode(card.dataset.mode));
});

$$(".leaderboard-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    selectedLeaderboard = tab.dataset.period;
    renderLeaderboards();
  });
});

$("#start-button").addEventListener("click", startGame);
$("#roulette-spin").addEventListener("click", spinRoulette);
$("#brand-home").addEventListener("click", (event) => {
  event.preventDefault();
  showHome();
});
$("#back-button").addEventListener("click", showHome);
$("#outcome-home-button").addEventListener("click", showHome);
$("#retry-button").addEventListener("click", startGame);
$("#pip-paw-tab").addEventListener("click", () => {
  if (!save.unlocked.pipPaw) return;
  homeScreen.hidden = true;
  pawScreen.hidden = false;
  startPawGame();
});
$("#pip-paw-start").addEventListener("click", startPawGame);
$("#pip-paw-back").addEventListener("click", () => {
  stopPawGame();
  showHome();
});
$("#paw-retry").addEventListener("click", startPawGame);

document.addEventListener("pointermove", (event) => {
  pointerPosition = { x: event.clientX, y: event.clientY };
});

$("#sound-toggle").addEventListener("click", (event) => {
  soundEnabled = !soundEnabled;
  event.currentTarget.setAttribute("aria-pressed", String(soundEnabled));
  $("#sound-label").textContent = soundEnabled ? "Music & sound" : "Sound off";
  event.currentTarget.setAttribute("aria-label", soundEnabled ? "Turn music and sound off" : "Turn music and sound on");
  $("#sound-icon").textContent = soundEnabled ? "♫" : "♪";
  if (soundEnabled) {
    if (!playScreen.hidden && outcomeCard.hidden) startMusic();
  } else {
    stopMusic();
    if (audioContext?.state === "running") void audioContext.suspend();
  }
});

function initialize() {
  $("#pip-paw-tab").hidden = !save.unlocked.pipPaw;
  updateModeCards();
  updateAchievementCount();
  renderAchievements();
  renderRoulette();
  renderLeaderboards();
  updateHomeArt();
  $("#timer-row").hidden = true;
}

initialize();
