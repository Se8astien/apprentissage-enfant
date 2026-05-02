// app-nav.js — navigation/screens, stars, combo, apresReponse, montrerMenu/Jeu

import {
  elGenre,
  elMenu,
  elJeu,
  elChoix,
  elFeedback,
  elSuivant,
  getJeuCourant,
  setJeuCourant,
  getRepondu,
  setRepondu,
  getBonneReponse,
  setBadgeVisible,
  estFille,
  estGrand,
  majGenre,
  sauverFaim,
  lireFaim,
  lireEtoiles,
  lireNomRenard,
  confetti,
  getNiveauCourant,
  getDifficulte,
  getDifficulteJeu,
  setDifficulteJeu,
  getDiffLabel,
  marquerMaitrise,
  lireMaitrise,
  escapeHtml,
  NIVEAUX_LABELS,
  DIFFICULTE_ICONES,
  DIFFICULTE_LABELS,
  piegerFocus,
  revelerSeulEcran,
  syncPrefsDepuisStockage,
} from "./app-state.js";

import { track } from "./app-analytics.js";
import { sonBonne, sonMauvaise, sonCombo } from "./app-sons.js";

import {
  ajouterEtoiles,
  svgRenard,
  getStade,
  mettreAJourMaisonBanner,
  mettreAJourRenardHeader,
} from "./app-renard.js";

import {
  incrementStats,
  progresserMission,
  afficherMissions,
  verifierBadgesStats,
  debloquerBadge,
  afficherNotifBadge,
  BADGES,
} from "./app-gamification.js";

import { getHistoireJeu } from "./app-histoire.js";

// Re-export confetti so game files can import it from here if desired
export { confetti } from "./app-state.js";

// ── Module-level combo counter (only used in nav) ─────────────────────────────
let comboActuel = 0;
let erreursSerie = 0;
let fatigueActivee = false;
let rattrapageRestant = 0;
let rattrapageDiffOriginale = null;

const LIBELLE_THEME_JEU = {
  maths: "Nombres",
  formes: "Formes",
  temps: "Temps & mesures",
  argent: "Euros",
  avance: "Calcul",
  langage: "Langage",
  cm: "Niveau CM",
  algo: "Logique",
};

// ── Mode chrono ───────────────────────────────────────────────────────────────
let _chronoTimer = null;

function secondesChrono() {
  if (!estGrand()) return 0;
  return Math.min(56, 30 + Math.min(4, erreursSerie) * 7);
}

function startChrono() {
  const secs = secondesChrono();
  if (secs <= 0) return;
  stopChrono();
  const el = document.getElementById("chrono");
  if (!el) return;
  el.hidden = false;
  let reste = secs;
  el.textContent = `⏱ ${reste}s`;
  el.className = "chrono";
  _chronoTimer = setInterval(() => {
    reste--;
    if (reste <= 0) { clearInterval(_chronoTimer); _chronoTimer = null; chronoExpire(); return; }
    el.textContent = `⏱ ${reste}s`;
    if (reste <= 10) el.className = "chrono chrono-urgent";
  }, 1000);
}

function stopChrono() {
  if (_chronoTimer) { clearInterval(_chronoTimer); _chronoTimer = null; }
  const el = document.getElementById("chrono");
  if (el) el.hidden = true;
}

function chronoExpire() {
  if (getRepondu()) return;
  setRepondu(true);
  stopChrono();
  elChoix.querySelectorAll(".btn-choix").forEach(btn => {
    btn.disabled = true;
    if (Number(btn.dataset.valeur) === getBonneReponse() || btn.dataset.valeur === String(getBonneReponse()))
      btn.classList.add("bonne");
  });
  track("question_wrong", { game_name: getJeuCourant(), niveau: getNiveauCourant(), timeout: true });
  sonMauvaise();
  comboActuel = 0;
  elFeedback.textContent = "⏰ Temps écoulé ! Indice : relis doucement la question 👀";
  elFeedback.className = "feedback non";
  declencherReactionRenard(false);
  elSuivant.hidden = false;
}

// ── Mode révision ─────────────────────────────────────────────────────────────
const _wrongByGame = {};
let _modeRevision = null;

export function getWrongQuestions(jeu) { return _wrongByGame[jeu] || []; }
export function clearWrongQuestions(jeu) { delete _wrongByGame[jeu]; }

export function entrerRevision(nomJeu, questions) {
  const qs = [...questions];
  clearWrongQuestions(nomJeu);
  _modeRevision = { jeu: nomJeu, questions: qs, index: 0 };
  setJeuCourant(nomJeu);
  comboActuel = 0;
  rattrapageRestant = 0;
  rattrapageDiffOriginale = null;
  const jeuEl = elJeu || document.getElementById("ecran-jeu");
  if (!jeuEl) return;
  setBadgeVisible(true);
  resetFeedback();
  const titre = document.getElementById("jeu-titre");
  if (titre) {
    const carte = document.querySelector(`.carte-jeu[data-jeu="${nomJeu}"]`);
    const cat = carte?.dataset.cat;
    const theme = cat && LIBELLE_THEME_JEU[cat] ? ` · ${LIBELLE_THEME_JEU[cat]}` : "";
    titre.textContent = `🔁 Révision${theme}`;
  }
  revelerSeulEcran(jeuEl);
  _afficherRevision();
}

function _afficherRevision() {
  if (!_modeRevision || _modeRevision.index >= _modeRevision.questions.length) {
    _modeRevision = null;
    montrerMenu();
    afficherMissions();
    return;
  }
  const q = _modeRevision.questions[_modeRevision.index];
  const zq = document.getElementById("zone-question");
  if (zq) zq.innerHTML = q.html;
  elChoix.innerHTML = "";
  setBonneReponse(q.bonne);
  q.options.forEach((texte, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.textContent = texte;
    if (q.isText) {
      b.dataset.valeur = texte;
      b.addEventListener("click", () => apresReponseTexte(texte, b, getBonneReponse()));
    } else {
      b.dataset.valeur = String(idx);
      b.addEventListener("click", () => apresReponse(idx, b, getBonneReponse()));
    }
    elChoix.appendChild(b);
  });
}

// ── Histoires jeu : vues une fois par session ─────────────────────────────────
const _histoiresVues = new Set();

function afficherHistoireJeu(jeu) {
  if (_histoiresVues.has(jeu)) return;
  const info = getHistoireJeu(jeu, getNiveauCourant());
  if (!info) return;
  _histoiresVues.add(jeu);

  const stade = getStade(lireEtoiles());
  const nom = lireNomRenard() || "Foxy";
  const texte = info.texte.replace(/\[Nom\]/g, escapeHtml(nom));

  const overlay = document.createElement("div");
  overlay.className = "evolution-overlay";
  overlay.innerHTML = `
    <div class="evolution-carte histoire-intro-carte">
      <p class="histoire-intro-emoji">${info.emoji}</p>
      <p class="evolution-titre">${info.titre}</p>
      <p class="histoire-intro-texte">${texte}</p>
      <div class="evolution-renard">${svgRenard(stade, 80)}</div>
      <button type="button" class="btn-evolution-fermer">Jouer ! 🎮</button>
    </div>`;
  document.body.appendChild(overlay);
  piegerFocus(overlay);
  const prevFocus = document.activeElement;
  const fermer = () => {
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.3s";
    setTimeout(() => { overlay.remove(); if (prevFocus) prevFocus.focus(); }, 300);
  };
  overlay.querySelector(".btn-evolution-fermer").addEventListener("click", fermer);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) fermer(); });
}

// ── Anti-répétition : historique des questions par jeu (session) ──────────────
const _histoireQuestions = {};
const HIST_MAX = 10;
const HIST_ESSAIS = 8;

function empreinteQuestion() {
  const el = document.getElementById("zone-question");
  return el ? el.innerHTML.trim() : "";
}

function lancerAvecAntiRepeat(jeu, lanceurs) {
  const hist = _histoireQuestions[jeu] || [];
  let essais = 0;
  let fp;
  do {
    lanceurs[jeu]();
    fp = empreinteQuestion();
    essais++;
  } while (essais < HIST_ESSAIS && hist.includes(fp));
  if (!_histoireQuestions[jeu]) _histoireQuestions[jeu] = [];
  _histoireQuestions[jeu].push(fp);
  if (_histoireQuestions[jeu].length > HIST_MAX) _histoireQuestions[jeu].shift();
}

// ── Messages ──────────────────────────────────────────────────────────────────
function messagesOk() {
  if (estGrand()) return [
    "Excellent !",
    "Très bon travail !",
    "Parfait, continue !",
    "Bien joué !",
    "Tu maîtrises ça !",
    "Bonne réponse !",
  ];
  return estFille()
    ? [
        "Bravo, championne !",
        "Super ! Tu as réussi !",
        "Génial ! Encore une étoile !",
        "Tu es trop forte !",
        "Parfait ! Continue comme ça !",
        "Incroyable ! Quelle championne !",
      ]
    : [
        "Bravo, champion !",
        "Super ! Tu as réussi !",
        "Génial ! Encore une étoile !",
        "Tu es trop fort !",
        "Parfait ! Continue comme ça !",
        "Incroyable ! Quel champion !",
      ];
}

function messagesKo() {
  if (estGrand()) return [
    "Pas tout à fait, réessaie !",
    "Attention, regarde bien…",
    "Presque ! Analyse à nouveau.",
  ];
  return [
    "Pas grave, on réessaie !",
    "Presque ! Regarde bien…",
    "Courage, la prochaine c'est la bonne !",
  ];
}

function rappelErreur(jeu) {
  const aides = {
    addition: "Astuce : commence par les unités 🔢",
    soustraction: "Astuce : retire petit à petit ✋",
    multiplication: "Astuce : pense en paquets égaux 📦",
    division: "Astuce : partage en groupes égaux 🍪",
    fractions: "Astuce : compare les parts du même tout 🍕",
    decimaux: "Astuce : regarde bien la virgule ,",
    lecture: "Astuce : lis lentement chaque mot 📖",
    grammaire: "Astuce : repère d'abord le verbe 🧠",
  };
  return aides[jeu] || "Astuce : prends ton temps et relis 👀";
}

function tenterModeFatigue() {
  const jeu = getJeuCourant();
  if (!jeu || fatigueActivee || erreursSerie < 3) return;
  const diff = getDifficulteJeu(jeu);
  if (diff <= 0) return;
  setDifficulteJeu(jeu, diff - 1);
  fatigueActivee = true;
  const app = document.querySelector(".app");
  if (!app) return;
  const toast = document.createElement("div");
  toast.className = "toast-progression";
  toast.innerHTML = "<span>💛 Pause douceur activée</span><strong>Niveau allégé</strong>";
  app.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

function activerMiniRattrapage() {
  const jeu = getJeuCourant();
  if (!jeu || rattrapageRestant > 0) return;
  rattrapageRestant = 2;
  const diff = getDifficulteJeu(jeu);
  let to = diff;
  if (!fatigueActivee && diff > 0) {
    rattrapageDiffOriginale = diff;
    to = diff - 1;
    setDifficulteJeu(jeu, to);
  } else {
    rattrapageDiffOriginale = null;
  }
  track("mini_rattrapage_start", {
    game_name: jeu,
    niveau: getNiveauCourant(),
    from: diff,
    to,
    questions: 2,
  });
}

function finaliserMiniRattrapage() {
  const jeu = getJeuCourant();
  if (!jeu || rattrapageRestant > 0) return;
  if (rattrapageDiffOriginale !== null) {
    setDifficulteJeu(jeu, rattrapageDiffOriginale);
  }
  track("mini_rattrapage_end", {
    game_name: jeu,
    niveau: getNiveauCourant(),
    restored_to: rattrapageDiffOriginale !== null ? rattrapageDiffOriginale : getDifficulteJeu(jeu),
  });
  rattrapageDiffOriginale = null;
}

// ── Reaction renard ───────────────────────────────────────────────────────────
function declencherReactionRenard(correct) {
  const el = document.getElementById("renard-reaction");
  if (!el) return;
  el.hidden = false;
  el.className = "renard-reaction";
  const stade = getStade(lireEtoiles());
  const bulle = correct ? "Ouais ! 🎉" : "Tu y es presque !";
  el.innerHTML = `<div class="renard-bulle">${bulle}</div>${svgRenard(stade, 72)}`;
  void el.offsetWidth;
  el.classList.add(correct ? "visible" : "encourage");
  setTimeout(() => { el.hidden = true; el.className = "renard-reaction"; }, 2000);
}

// ── Combo ─────────────────────────────────────────────────────────────────────
function declencherCombo(nb, onFermer) {
  const bonus = nb >= 10 ? 3 : 1;
  ajouterEtoiles(bonus);
  const nom  = lireNomRenard() || "Foxy";
  const stade = getStade(lireEtoiles());
  const overlay = document.createElement("div");
  overlay.className = "evolution-overlay";
  overlay.innerHTML = `
    <div class="evolution-carte combo-carte">
      <div class="evolution-renard">${svgRenard(stade, 100)}</div>
      <p class="combo-flamme">${nb >= 10 ? "🔥🔥 COMBO ×10 ! 🔥🔥" : "🔥 COMBO ×5 !"}</p>
      <p class="evolution-titre">${escapeHtml(nom)} est fier de toi !</p>
      <p class="evolution-msg">+${bonus} ⭐ bonus !</p>
      <button type="button" class="btn-evolution-fermer">Super !</button>
    </div>`;
  document.body.appendChild(overlay);
  piegerFocus(overlay);
  const prevFocusCombo = document.activeElement;
  confetti();
  sonCombo();
  track("combo_reached", { game_name: getJeuCourant(), niveau: getNiveauCourant(), combo: nb });
  if (nb >= 5) {
    progresserMission("combo5");
    afficherMissions();
    if (debloquerBadge("combo5")) { const b = BADGES.find(x => x.id === "combo5"); if (b) afficherNotifBadge(b); }
  }
  if (nb >= 10) {
    if (debloquerBadge("combo10")) { const b = BADGES.find(x => x.id === "combo10"); if (b) afficherNotifBadge(b); }
  }
  if (comboActuel >= 20) {
    if (debloquerBadge("combo20")) { const b = BADGES.find(x => x.id === "combo20"); if (b) afficherNotifBadge(b); }
  }
  const fermer = () => {
    overlay.remove();
    if (prevFocusCombo) prevFocusCombo.focus();
    if (onFermer) onFermer();
  };
  overlay.querySelector(".btn-evolution-fermer").addEventListener("click", fermer);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) fermer(); });
}

// ── Reset feedback ────────────────────────────────────────────────────────────
export function resetFeedback() {
  if (elFeedback) {
    elFeedback.textContent = "";
    elFeedback.className = "feedback";
  }
  if (elSuivant) elSuivant.hidden = true;
  setRepondu(false);
}

// ── apresReponse (implémentation commune) ─────────────────────────────────────
function _apresReponseImpl(choix, bouton, correct, isText) {
  if (getRepondu()) return;
  setRepondu(true);
  stopChrono();
  const boutons = elChoix.querySelectorAll(".btn-choix");
  boutons.forEach((btn) => {
    btn.disabled = true;
    const estBonne = isText
      ? btn.dataset.valeur === String(correct)
      : Number(btn.dataset.valeur) === correct;
    if (estBonne) btn.classList.add("bonne");
  });
  if (choix !== correct) bouton.classList.add("mauvaise");

  if (choix === correct) {
    comboActuel++;
    erreursSerie = 0;
    track("question_correct", { game_name: getJeuCourant(), niveau: getNiveauCourant(), combo: comboActuel });
    const ok = messagesOk();
    elFeedback.textContent = "✓ " + ok[Math.floor(Math.random() * ok.length)];
    elFeedback.className = "feedback ok";
    ajouterEtoiles(1);
    sauverFaim(lireFaim() + 5);
    confetti();
    sonBonne();
    declencherReactionRenard(true);
    incrementStats(true, getJeuCourant());
    progresserMission("bonnes");
    progresserMission("etoiles");
    progresserMission("jeux", getJeuCourant());
    afficherMissions();
    const newBadges = verifierBadgesStats();
    newBadges.forEach(id => { const b = BADGES.find(x => x.id === id); if (b) afficherNotifBadge(b); });
    if (comboActuel % 10 === 0) {
      declencherCombo(10, () => {
        marquerMaitrise(getJeuCourant(), getDifficulte());
        gererProgressionDifficulte();
        if (getDifficulte() === 2) {
          if (debloquerBadge("diff_expert")) { const b = BADGES.find(x => x.id === "diff_expert"); if (b) afficherNotifBadge(b); }
        }
      });
    } else if (comboActuel === 5) declencherCombo(5);
  } else {
    erreursSerie++;
    if (!_modeRevision) {
      const _jeu = getJeuCourant();
      if (!_wrongByGame[_jeu]) _wrongByGame[_jeu] = [];
      const _zq = document.getElementById("zone-question");
      _wrongByGame[_jeu].push({ html: _zq ? _zq.innerHTML : "", bonne: correct, isText, options: [...elChoix.querySelectorAll(".btn-choix")].map(b => b.textContent.trim()) });
    }
    track("question_wrong", { game_name: getJeuCourant(), niveau: getNiveauCourant() });
    sonMauvaise();
    comboActuel = 0;
    const ko = messagesKo();
    const base = ko[Math.floor(Math.random() * ko.length)];
    const message = erreursSerie >= 2 ? `${base} ${rappelErreur(getJeuCourant())}` : base;
    elFeedback.textContent = `✗ ${message}`;
    elFeedback.className = "feedback non";
    if (erreursSerie === 2) {
      activerMiniRattrapage();
      elFeedback.textContent += " Mini entraînement : 2 questions faciles 💡";
    }
    declencherReactionRenard(false);
    tenterModeFatigue();
  }
  if (rattrapageRestant > 0) {
    rattrapageRestant--;
    finaliserMiniRattrapage();
  }
  elSuivant.hidden = false;
}

export function apresReponse(choix, bouton, correct) {
  _apresReponseImpl(choix, bouton, correct, false);
}

export function apresReponseTexte(choix, bouton, correct) {
  _apresReponseImpl(choix, bouton, correct, true);
}

// ── Progression de difficulté ─────────────────────────────────────────────────
function gererProgressionDifficulte() {
  const jeu = getJeuCourant();
  const diff = getDifficulteJeu(jeu);
  if (diff < 2) {
    setDifficulteJeu(jeu, diff + 1);
    track("difficulty_up", { game_name: jeu, niveau: getNiveauCourant(), from: diff, to: diff + 1 });
    afficherToastDifficulte();
    const badge = document.getElementById("diff-badge");
    if (badge) { badge.hidden = false; badge.textContent = getDiffLabel(); badge.classList.add("diff-pulse"); setTimeout(() => badge.classList.remove("diff-pulse"), 1200); }
  } else {
    proposerClasseSuivante();
  }
}

function afficherToastDifficulte() {
  const app = document.querySelector(".app");
  if (!app) return;
  const toast = document.createElement("div");
  toast.className = "toast-progression";
  toast.innerHTML = `<span>🎉 Tu passes en mode Ninja !</span><strong>${getDiffLabel()}</strong>`;
  app.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function proposerClasseSuivante() {
  const suivantNom = { cp: "CE1 🚀", ce1: "CE2 ⭐", ce2: "CM1 🌟", cm1: "CM2 🏆", cm2: null }[getNiveauCourant()];
  if (!suivantNom) { confetti(); return; }
  const modal = document.getElementById("modal-classe-suivante");
  const nomEl = document.getElementById("modal-classe-nom");
  if (modal && nomEl) {
    nomEl.textContent = suivantNom;
    modal.hidden = false;
    window.dispatchEvent(new CustomEvent("classe-suivante:ouverte"));
  }
}

// ── Filtrage jeux par niveau (programme EN) ───────────────────────────────────
function filtrerJeuxParNiveau() {
  const n = getNiveauCourant();
  const masques = (() => { try { return JSON.parse(localStorage.getItem("jeux-masques")) || []; } catch { return []; } })();
  let sectionCourante = null;
  let sectionVisible = false;
  document.querySelectorAll(".grille-jeux > *").forEach(el => {
    if (el.classList.contains("grille-section")) {
      if (sectionCourante) sectionCourante.hidden = !sectionVisible;
      sectionCourante = el;
      sectionVisible = false;
    } else if (el.classList.contains("carte-jeu")) {
      const niveaux = (el.dataset.niveaux || "cp ce1 ce2 cm1 cm2").split(" ");
      const visible = niveaux.includes(n) && !masques.includes(el.dataset.jeu);
      el.hidden = !visible;
      if (visible) sectionVisible = true;
    }
  });
  if (sectionCourante) sectionCourante.hidden = !sectionVisible;
}

export function synchroniserAffichageMenu() {
  syncPrefsDepuisStockage();
  majGenre();
  mettreAJourMaisonBanner();
  const classeLabel = document.getElementById("classe-info-label");
  if (classeLabel) classeLabel.textContent = NIVEAUX_LABELS[getNiveauCourant()] || "";
  document.querySelectorAll(".niveau-btn").forEach((btn) => {
    const actif = btn.dataset.niveau === getNiveauCourant();
    btn.classList.toggle("actif", actif);
    btn.setAttribute("aria-pressed", actif ? "true" : "false");
  });
  filtrerJeuxParNiveau();
  document.querySelectorAll(".carte-jeu[data-jeu]").forEach((btn) => {
    const jeu = btn.dataset.jeu;
    const m = lireMaitrise(jeu);
    const n = m.filter(Boolean).length;

    let starsEl = btn.querySelector(".maitrise-stars");
    if (!starsEl) { starsEl = document.createElement("span"); starsEl.className = "maitrise-stars"; btn.appendChild(starsEl); }
    starsEl.textContent = n > 0 ? "★".repeat(n) + "☆".repeat(3 - n) : "";

    let diffEl = btn.querySelector(".carte-diff-badge");
    if (!diffEl) { diffEl = document.createElement("span"); diffEl.className = "carte-diff-badge"; btn.appendChild(diffEl); }
    const d = getDifficulteJeu(jeu);
    diffEl.textContent = DIFFICULTE_ICONES[d];
    diffEl.title = DIFFICULTE_LABELS[d].replace(/^[^\s]+\s/, "");

    btn.classList.toggle("jeu-maitrise", n === 3);
  });
}

// ── montrerMenu ───────────────────────────────────────────────────────────────
export function montrerMenu() {
  const menu = elMenu || document.getElementById("ecran-menu");
  if (!menu) return;
  syncPrefsDepuisStockage();
  resetFeedback();
  stopChrono();
  _modeRevision = null;
  rattrapageRestant = 0;
  rattrapageDiffOriginale = null;
  setJeuCourant(null);
  setBadgeVisible(false);
  const modal = document.getElementById("modal-classe-suivante");
  if (modal) modal.hidden = true;
  revelerSeulEcran(menu);
  synchroniserAffichageMenu();
}

// ── montrerJeu ────────────────────────────────────────────────────────────────
export function montrerJeu(nom, lanceurs) {
  const jeu = elJeu || document.getElementById("ecran-jeu");
  if (!jeu || !nom || !lanceurs || typeof lanceurs[nom] !== "function") return;
  setJeuCourant(nom);
  comboActuel = 0;
  erreursSerie = 0;
  fatigueActivee = false;
  rattrapageRestant = 0;
  rattrapageDiffOriginale = null;
  revelerSeulEcran(jeu);
  setBadgeVisible(true);
  const diffBadge = document.getElementById("diff-badge");
  if (diffBadge) { diffBadge.hidden = false; diffBadge.textContent = getDiffLabel(); }
  resetFeedback();
  _histoireQuestions[nom] = [];
  lancerAvecAntiRepeat(nom, lanceurs);
  startChrono();
  afficherHistoireJeu(nom);
}

// ── questionSuivante ──────────────────────────────────────────────────────────
export function questionSuivante(lanceurs) {
  resetFeedback();
  if (_modeRevision) {
    _modeRevision.index++;
    _afficherRevision();
    return;
  }
  const jeu = getJeuCourant();
  if (jeu && lanceurs[jeu]) {
    lancerAvecAntiRepeat(jeu, lanceurs);
    startChrono();
  }
}
