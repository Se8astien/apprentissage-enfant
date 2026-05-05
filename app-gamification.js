// app-gamification.js — badges, missions du jour, stats

import { lireEtoiles, confetti, lireStreak, escapeHtml, piegerFocus } from "./app-state.js";
import { sonTrophee } from "./app-sons.js";

// ── Badges ────────────────────────────────────────────────────────────────────
export const BADGES = [
  { id: "premier_pas",  emoji: "🌱", nom: "Premiers pas",     desc: "Répondre à ta première question" },
  { id: "etoile_10",    emoji: "⭐",  nom: "Collectionneur",   desc: "Gagner 10 étoiles" },
  { id: "etoile_50",    emoji: "🌟",  nom: "Super étoile",     desc: "Gagner 50 étoiles" },
  { id: "etoile_100",   emoji: "💫",  nom: "Étoile filante",   desc: "Gagner 100 étoiles" },
  { id: "etoile_300",   emoji: "✨",  nom: "Galaxie",          desc: "Gagner 300 étoiles" },
  { id: "combo5",       emoji: "🔥",  nom: "En feu !",         desc: "Faire un combo ×5" },
  { id: "combo10",      emoji: "🚀",  nom: "Supersonique !",   desc: "Faire un combo ×10" },
  { id: "combo20",      emoji: "💥",  nom: "Inarrêtable !",    desc: "Faire un combo ×20" },
  { id: "maitrise1",    emoji: "🥉",  nom: "Apprenti",         desc: "Maîtriser un premier jeu" },
  { id: "maitrise3",    emoji: "🥈",  nom: "Confirmé",         desc: "Maîtriser 3 jeux" },
  { id: "maitrise10",   emoji: "🥇",  nom: "Expert",           desc: "Maîtriser 10 jeux" },
  { id: "streak3",      emoji: "📅",  nom: "Assidu",           desc: "Jouer 3 jours de suite" },
  { id: "streak7",      emoji: "🏅",  nom: "Régulier",         desc: "Jouer 7 jours de suite" },
  { id: "streak30",     emoji: "🏆",  nom: "Champion",         desc: "Jouer 30 jours de suite" },
  { id: "ce1",          emoji: "🚀",  nom: "Au CE1 !",         desc: "Passer en CE1" },
  { id: "ce2",          emoji: "⭐",  nom: "Au CE2 !",         desc: "Passer en CE2" },
  { id: "cm1",          emoji: "🌟",  nom: "Au CM1 !",         desc: "Passer en CM1" },
  { id: "cm2",          emoji: "🏆",  nom: "Au CM2 !",         desc: "Passer en CM2" },
  { id: "jeux5",        emoji: "🎮",  nom: "Joueur",           desc: "Jouer à 5 jeux différents" },
  { id: "jeux15",       emoji: "🗺️",  nom: "Explorateur",      desc: "Jouer à 15 jeux différents" },
  { id: "q50",          emoji: "📝",  nom: "Studieux",         desc: "Répondre à 50 questions" },
  { id: "q200",         emoji: "📚",  nom: "Passionné",        desc: "Répondre à 200 questions" },
  { id: "mission1",     emoji: "🎯",  nom: "Première mission", desc: "Compléter une mission du jour" },
  { id: "mission7",     emoji: "🌈",  nom: "Fidèle",           desc: "Compléter 7 missions du jour" },
  { id: "renard_lv2",   emoji: "🦊",  nom: "Ami du renard",    desc: "Faire évoluer le renard" },
  { id: "diff_expert",  emoji: "💎",  nom: "Niveau Expert",    desc: "Atteindre le niveau Expert" },
  { id: "retour",       emoji: "🌞",  nom: "De retour !",      desc: "Rejouer après 2 jours d'absence" },
  { id: "perseverant",  emoji: "💪",  nom: "Persévérant",      desc: "Continuer après 3 difficultés" },
  { id: "curieux",      emoji: "💡",  nom: "Curieux",          desc: "Demander 5 indices pour apprendre" },
  { id: "revision",     emoji: "🔁",  nom: "Je corrige",       desc: "Revoir une question difficile" },
  { id: "objectif",     emoji: "🎯",  nom: "Objectif atteint", desc: "Réussir un objectif de session" },
  { id: "lecture_facile", emoji: "👀", nom: "Lecture facile",  desc: "Activer l'aide de lecture" },
  { id: "narrateur",    emoji: "🔊",  nom: "Narrateur",        desc: "Écouter 5 consignes ou réponses" },
];

const BADGES_STORAGE_KEY = "badges-obtenus";

export function lireBadges() {
  try { return JSON.parse(localStorage.getItem(BADGES_STORAGE_KEY) || "[]"); }
  catch { return []; }
}

export function debloquerBadge(id) {
  const liste = lireBadges();
  if (liste.includes(id)) return false;
  liste.push(id);
  localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(liste));
  return true;
}

// ── File d'attente des notifs badges ──────────────────────────────────────────
let _notifQueue = [];
let _notifVisible = false;

export function afficherNotifBadge(badge) {
  _notifQueue.push(badge);
  if (!_notifVisible) _afficherProchaineBadge();
}

function _afficherProchaineBadge() {
  if (_notifQueue.length === 0) { _notifVisible = false; return; }
  _notifVisible = true;
  const badge = _notifQueue.shift();

  const overlay = document.createElement("div");
  overlay.className = "badge-notif-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "badge-notif-dialog-lbl");
  overlay.innerHTML = `
    <div class="badge-notif-carte">
      <p id="badge-notif-dialog-lbl" class="badge-notif-label">Nouveau trophée !</p>
      <span class="badge-notif-emoji">${badge.emoji}</span>
      <h3 class="badge-notif-nom">${badge.nom}</h3>
      <p class="badge-notif-desc">${badge.desc}</p>
      <button type="button" class="btn-evolution-fermer">Super !</button>
    </div>`;
  document.body.appendChild(overlay);
  piegerFocus(overlay);
  confetti({ tier: "burst" });
  sonTrophee();

  const fermer = () => {
    overlay.remove();
    _afficherProchaineBadge();
  };
  overlay.querySelector(".btn-evolution-fermer").addEventListener("click", fermer);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) fermer(); });
}

// ── Missions du jour ──────────────────────────────────────────────────────────
const MISSIONS_STORAGE_KEY = "missions-jour";
const STATS_PAR_JEU_KEY    = "stats-questions";
const STATS_GLOBAL_KEY     = "stats-global-questions";
const JEUX_JOUES_KEY       = "jeux-joues";
const MISSIONS_TOTAL_KEY   = "missions-total-completees";

const TYPES_MISSIONS = [
  () => { const n = [3, 5, 8][~~(Math.random() * 3)]; return { type: "bonnes", emoji: "✅", texte: `Donne ${n} bonnes réponses`, cible: n, progres: 0, complete: false }; },
  () => { const n = [5, 10, 15][~~(Math.random() * 3)]; return { type: "etoiles", emoji: "⭐", texte: `Gagne ${n} étoiles`, cible: n, progres: 0, complete: false }; },
  () => { const n = [2, 3][~~(Math.random() * 2)]; return { type: "jeux", emoji: "🎮", texte: `Joue à ${n} jeux différents`, cible: n, progres: 0, complete: false, joues: [] }; },
  () => ({ type: "combo5", emoji: "🔥", texte: "Fais un combo ×5 🔥", cible: 1, progres: 0, complete: false }),
];

function lireStatsParJeu() {
  try {
    const raw = localStorage.getItem(STATS_PAR_JEU_KEY);
    if (!raw || /^\d+$/.test(raw.trim())) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function libelleMissionJeu(jeuId) {
  const labels = {
    addition: "les additions",
    soustraction: "les soustractions",
    multiplication: "les multiplications",
    division: "les divisions",
    fractions: "les fractions",
    fractionsCM: "les fractions",
    lecture: "la lecture",
    lectureTexte: "la lecture de texte",
    grammaire: "la grammaire",
    conjugaison: "la conjugaison",
    heure: "l'heure",
    decimaux: "les décimaux",
  };
  return labels[jeuId] || "ce jeu";
}

function missionFocusJeuFaible() {
  const perJeu = lireStatsParJeu();
  const candidats = Object.entries(perJeu)
    .filter(([, s]) => s && Number.isFinite(s.total) && s.total >= 4)
    .map(([jeu, s]) => {
      const total = Math.max(1, parseInt(s.total, 10) || 0);
      const bonnes = Math.max(0, parseInt(s.bonnes, 10) || 0);
      return { jeu, total, bonnes, taux: bonnes / total };
    })
    .sort((a, b) => a.taux - b.taux || b.total - a.total);
  if (candidats.length === 0) return null;
  const cible = candidats[0];
  const objectif = cible.total >= 12 ? 5 : 3;
  const tauxPct = Math.round(cible.taux * 100);
  return {
    type: "focus_jeu",
    emoji: "🎯",
    texte: `Progresse en ${libelleMissionJeu(cible.jeu)} (${objectif} bonnes réponses)`,
    pourquoi: `Parce que sur ce jeu, tu réussis un peu moins souvent (${tauxPct}% de bonnes réponses sur tes derniers essais).`,
    cible: objectif,
    progres: 0,
    complete: false,
    jeuId: cible.jeu,
  };
}

function dateAujourdhui() {
  return new Date().toISOString().slice(0, 10);
}

export function lireMissionsJour() {
  try {
    const raw = localStorage.getItem(MISSIONS_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (
        data &&
        typeof data === "object" &&
        data.date === dateAujourdhui() &&
        Array.isArray(data.missions) &&
        data.missions.length > 0
      ) {
        return data;
      }
    }
  } catch { /* ignore */ }
  return _genererMissionsJour();
}

function _genererMissionsJour() {
  // Persist previous day's completions before resetting
  try {
    const raw = localStorage.getItem(MISSIONS_STORAGE_KEY);
    if (raw) {
      const prev = JSON.parse(raw);
      if (prev.date !== dateAujourdhui() && prev.totalCompletees) {
        const cumul = parseInt(localStorage.getItem(MISSIONS_TOTAL_KEY) || "0", 10);
        localStorage.setItem(MISSIONS_TOTAL_KEY, String(cumul + prev.totalCompletees));
      }
    }
  } catch { /* ignore */ }
  const missions = [];
  const focus = missionFocusJeuFaible();
  if (focus) missions.push(focus);
  const shuffled = TYPES_MISSIONS.slice().sort(() => Math.random() - 0.5);
  shuffled.forEach((fn) => {
    if (missions.length >= 3) return;
    const m = fn();
    if (missions.some((x) => x.type === m.type)) return;
    missions.push(m);
  });
  const data = { date: dateAujourdhui(), missions, totalCompletees: 0 };
  localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(data));
  return data;
}

function _sauverMissionsJour(data) {
  localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(data));
}

export function progresserMission(type, data) {
  const store = lireMissionsJour();
  const nouvCompletes = [];
  if (!Array.isArray(store.missions)) return nouvCompletes;

  store.missions.forEach(m => {
    if (m.complete) return;
    if (m.type !== type) return;

    if (type === "bonnes" || type === "etoiles") {
      m.progres++;
    } else if (type === "jeux") {
      const jeuId = data;
      if (!m.joues) m.joues = [];
      if (!m.joues.includes(jeuId)) {
        m.joues.push(jeuId);
        m.progres = m.joues.length;
      }
    } else if (type === "combo5") {
      m.progres = 1;
    } else if (type === "focus_jeu") {
      if (m.jeuId && data === m.jeuId) m.progres++;
    }

    if (m.progres >= m.cible) {
      m.complete = true;
      m.progres = m.cible;
      nouvCompletes.push(m);
      store.totalCompletees = (store.totalCompletees || 0) + 1;
    }
  });

  _sauverMissionsJour(store);
  return nouvCompletes;
}

export function afficherMissions() {
  const widget = document.getElementById("missions-widget");
  if (!widget) return;
  const store = lireMissionsJour();
  const missions = Array.isArray(store.missions) ? store.missions : [];
  widget.innerHTML = missions.map(m => {
    const pct = Math.min(100, Math.round((m.progres / m.cible) * 100));
    return `
      <div class="mission-item${m.complete ? " complete" : ""}">
        <span class="mission-emoji">${m.emoji}</span>
        <div style="flex:1">
          <div class="mission-texte">${escapeHtml(m.texte)}</div>
          ${m.pourquoi ? `<p class="mission-pourquoi">${escapeHtml(m.pourquoi)}</p>` : ""}
          <div class="mission-progress">${m.progres} / ${m.cible}</div>
          <div class="mission-barre"><div class="mission-barre-fill" style="width:${pct}%"></div></div>
        </div>
      </div>`;
  }).join("");
}

export function lireStatsQuestions() {
  let g = parseInt(localStorage.getItem(STATS_GLOBAL_KEY) || "0", 10);
  if (!Number.isFinite(g)) g = 0;
  if (g > 0) return g;

  try {
    const raw = localStorage.getItem(STATS_PAR_JEU_KEY);
    if (raw && /^\d+$/.test(raw.trim())) {
      const n = parseInt(raw, 10);
      if (Number.isFinite(n) && n > 0) {
        localStorage.setItem(STATS_GLOBAL_KEY, String(n));
      }
      return Number.isFinite(n) ? n : 0;
    }
  } catch { /* ignore */ }

  return g;
}

export function incrementStats(bonneReponse, jeuId) {
  const total = lireStatsQuestions() + 1;
  localStorage.setItem(STATS_GLOBAL_KEY, String(total));

  if (jeuId) {
    try {
      const joues = JSON.parse(localStorage.getItem(JEUX_JOUES_KEY) || "[]");
      if (!joues.includes(jeuId)) {
        joues.push(jeuId);
        localStorage.setItem(JEUX_JOUES_KEY, JSON.stringify(joues));
      }
    } catch { /* ignore */ }

    try {
      const raw = localStorage.getItem(STATS_PAR_JEU_KEY);
      const perJeu = raw && !/^\d+$/.test(raw.trim()) ? JSON.parse(raw) : {};
      if (!perJeu[jeuId]) perJeu[jeuId] = { bonnes: 0, total: 0 };
      perJeu[jeuId].total++;
      if (bonneReponse) perJeu[jeuId].bonnes++;
      localStorage.setItem(STATS_PAR_JEU_KEY, JSON.stringify(perJeu));
    } catch { /* ignore */ }
  }
}

function _lireJeuxJoues() {
  try { return JSON.parse(localStorage.getItem(JEUX_JOUES_KEY) || "[]"); }
  catch { return []; }
}

function _compterJeuxMaitrises() {
  let count = 0;
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key.startsWith("maitrise-")) {
      try {
        const m = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(m) && m.some(Boolean)) count++;
      } catch { /* ignore */ }
    }
  }
  return count;
}

function _lireTotalMissionsCompletees() {
  const total = parseInt(localStorage.getItem(MISSIONS_TOTAL_KEY) || "0", 10);
  const store = lireMissionsJour();
  const missions = Array.isArray(store.missions) ? store.missions : [];
  const completeesCeJour = missions.filter(m => m.complete).length;
  return total + completeesCeJour;
}

export function verifierBadgesStats() {
  const nouveaux = [];

  const etoiles = lireEtoiles();
  const questions = lireStatsQuestions();
  const jeuxJoues = _lireJeuxJoues();
  const streak = lireStreak();
  const streakCount = streak.count || 0;
  const maitrises = _compterJeuxMaitrises();
  const missionsTotal = _lireTotalMissionsCompletees();

  const checks = [
    { id: "premier_pas",  cond: questions >= 1 },
    { id: "etoile_10",    cond: etoiles >= 10 },
    { id: "etoile_50",    cond: etoiles >= 50 },
    { id: "etoile_100",   cond: etoiles >= 100 },
    { id: "etoile_300",   cond: etoiles >= 300 },
    { id: "maitrise1",    cond: maitrises >= 1 },
    { id: "maitrise3",    cond: maitrises >= 3 },
    { id: "maitrise10",   cond: maitrises >= 10 },
    { id: "streak3",      cond: streakCount >= 3 },
    { id: "streak7",      cond: streakCount >= 7 },
    { id: "streak30",     cond: streakCount >= 30 },
    { id: "jeux5",        cond: jeuxJoues.length >= 5 },
    { id: "jeux15",       cond: jeuxJoues.length >= 15 },
    { id: "q50",          cond: questions >= 50 },
    { id: "q200",         cond: questions >= 200 },
    { id: "renard_lv2",   cond: etoiles >= 21 },
    { id: "mission1",     cond: missionsTotal >= 1 },
    { id: "mission7",     cond: missionsTotal >= 7 },
  ];

  for (const { id, cond } of checks) {
    if (cond && debloquerBadge(id)) nouveaux.push(id);
  }

  return nouveaux;
}
