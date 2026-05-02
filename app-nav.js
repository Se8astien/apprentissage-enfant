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
  setBonneReponse,
  setBadgeVisible,
  estFille,
  estGrand,
  estMinuteurDisponible,
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
  lireChronoJeuActif,
  sauverChronoJeuActif,
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
import { getMasques } from "./app-params.js";
import { texteDescCarteJeu } from "./app-menu-descriptions.js";

// Re-export confetti so game files can import it from here if desired
export { confetti } from "./app-state.js";

// ── Module-level combo counter (only used in nav) ─────────────────────────────
let comboActuel = 0;
let erreursSerie = 0;
let fatigueActivee = false;
let rattrapageRestant = 0;
let rattrapageDiffOriginale = null;
let questionsDepuisDebutJeu = 0;
let mauvaisesDepuisDebutJeu = 0;
let essaisDepuisEncouragement = 0;
let correctionsDepuisEncouragement = 0;
let derniereQuestionEtaitErreur = false;
let indicesSession = 0;

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
  if (!lireChronoJeuActif()) return 0;
  if (!estMinuteurDisponible()) return 0;
  const base = 30 + Math.min(4, erreursSerie) * 7;
  const max = estGrand() ? 56 : 64;
  return Math.min(max, base);
}

function startChrono() {
  const secs = secondesChrono();
  stopChrono();
  majUiBoutonChrono();
  const el = document.getElementById("chrono");
  if (secs <= 0) {
    if (el && estMinuteurDisponible()) {
      el.hidden = false;
      el.textContent = "🕊️ Temps libre";
      el.className = "chrono chrono-libre";
    }
    return;
  }
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
  afficherAideDouce(getBonneReponse(), { timeout: true });
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
  preparerOutilsQuestion();
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

function libelleBonneReponse(correct) {
  if (correct == null) return "";
  return String(correct);
}

function getAideDouceEl() {
  return document.getElementById("aide-douce");
}

function getOutilsJeuEl() {
  return document.getElementById("outils-jeu");
}

function getEffortProgressEl() {
  return document.getElementById("effort-progress");
}

function getQuestionTexteLisible() {
  const zq = document.getElementById("zone-question");
  if (!zq) return "";
  return zq.textContent.replace(/\s+/g, " ").trim();
}

function rappelErreur(jeu) {
  const aides = {
    compte: "Astuce : touche chaque objet une seule fois 🐾",
    addition: "Astuce : commence par les unités 🔢",
    soustraction: "Astuce : retire petit à petit ✋",
    compare: "Astuce : compte les chiffres, puis compare de gauche à droite ⚖️",
    suite: "Astuce : cherche de combien on avance à chaque fois 🔢",
    doubles: "Astuce : c'est le même nombre deux fois 👯",
    moitie: "Astuce : partage en 2 groupes égaux ✂️",
    dizaines: "Astuce : une barre vaut 10, un point vaut 1 📊",
    pairimpair: "Astuce : fais des paires de 2 🟣",
    perlesDorees: "Astuce : compte centaines, dizaines, puis unités 🟡",
    planche100: "Astuce : regarde la ligne et la colonne de la planche 🔢",
    formes: "Astuce : compte les côtés et les sommets 🔷",
    multiplication: "Astuce : pense en paquets égaux 📦",
    division: "Astuce : partage en groupes égaux 🍪",
    fractions: "Astuce : compare les parts du même tout 🍕",
    fractionsCM: "Astuce : mets les fractions au même dénominateur si besoin 🍕",
    symetrie: "Astuce : imagine le pli du miroir 🪞",
    perimetre: "Astuce : additionne tous les côtés du tour 🔲",
    angles: "Astuce : compare avec un angle droit 📐",
    calendrier: "Astuce : avance doucement dans les jours ou les mois 📅",
    heure: "Astuce : regarde d'abord la petite aiguille 🕐",
    durees: "Astuce : avance par heures, puis par minutes ⏱️",
    mesures: "Astuce : vérifie l'unité avant de calculer 📏",
    masse: "Astuce : compare les plateaux de la balance ⚖️",
    monnaiecp: "Astuce : additionne d'abord les plus grosses pièces 🪙",
    monnaiece1: "Astuce : compte les euros puis les centimes 💶",
    probleme: "Astuce : cherche ce qu'on demande avant de calculer 📖",
    decimaux: "Astuce : regarde bien la virgule ,",
    aires: "Astuce : compte les petits carrés de la surface 📐",
    proportionnalite: "Astuce : cherche le lien entre les deux lignes ⚖️",
    pourcentages: "Astuce : 50%, c'est la moitié ; 25%, c'est le quart %",
    sons: "Astuce : dis le mot tout doucement 🔤",
    syllabes: "Astuce : tape les syllabes dans tes mains 👏",
    lecture: "Astuce : lis lentement chaque mot 📖",
    lecturePhrase: "Astuce : regarde l'image puis lis toute la phrase 🖼️",
    phraseMobile: "Astuce : relis la phrase avec chaque mot possible 📝",
    lectureTexte: "Astuce : retourne chercher l'information dans le texte 📖",
    grammaire: "Astuce : repère d'abord le verbe 🧠",
    homophones: "Astuce : remplace le petit mot pour vérifier 📝",
    synonymes: "Astuce : cherche un mot qui veut dire presque pareil 🔁",
    conjugaison: "Astuce : repère la personne puis le temps ✍️",
    anglais: "Astuce : regarde l'image et dis le mot à voix basse 🇬🇧",
    traduction: "Astuce : pense au mot anglais déjà vu 🔤",
    allemand: "Astuce : regarde l'image et répète le mot 🇩🇪",
    traductionAllemand: "Astuce : pense au mot allemand déjà vu 🔤",
    espagnol: "Astuce : regarde l'image et répète le mot 🇪🇸",
    traductionEspagnol: "Astuce : pense au mot espagnol déjà vu 🔤",
    italien: "Astuce : regarde l'image et répète le mot 🇮🇹",
    traductionItalien: "Astuce : pense au mot italien déjà vu 🔤",
    portugais: "Astuce : regarde l'image et répète le mot 🇵🇹",
    traductionPortugais: "Astuce : pense au mot portugais déjà vu 🔤",
    sequence: "Astuce : suis les étapes dans l'ordre 🤖",
    code: "Astuce : lis le programme ligne par ligne 💻",
  };
  return aides[jeu] || "Astuce : prends ton temps et relis 👀";
}

function afficherAideDouce(correct, { timeout = false } = {}) {
  const el = getAideDouceEl();
  if (!el) return;
  const bonne = libelleBonneReponse(correct);
  el.hidden = false;
  el.innerHTML = "";

  const titre = document.createElement("p");
  titre.className = "aide-douce-titre";
  titre.textContent = timeout
    ? "Le temps est fini, mais tu peux apprendre."
    : "Bonne tentative, on apprend avec l'erreur.";

  const indice = document.createElement("p");
  indice.className = "aide-douce-indice";
  indice.textContent = rappelErreur(getJeuCourant());

  const reponse = document.createElement("p");
  reponse.className = "aide-douce-reponse";
  reponse.textContent = bonne ? `La bonne réponse était : ${bonne}` : "Regarde la réponse en vert.";

  const encouragement = document.createElement("p");
  encouragement.className = "aide-douce-encouragement";
  encouragement.textContent = estGrand()
    ? "Observe la méthode, puis essaie la suivante."
    : "Respire, regarde bien, puis essaie la suivante avec Foxy.";

  el.append(titre, indice, reponse, encouragement);
}

function cacherAideDouce() {
  const el = getAideDouceEl();
  if (!el) return;
  el.hidden = true;
  el.innerHTML = "";
}

function afficherIndiceAvantReponse() {
  if (getRepondu()) return;
  if (!indiceUtiliseQuestion) {
    indiceUtiliseQuestion = true;
    indicesSession++;
    if (indicesSession >= 5 && debloquerBadge("curieux")) {
      const b = BADGES.find(x => x.id === "curieux");
      if (b) afficherNotifBadge(b);
    }
  }
  const el = getAideDouceEl();
  if (!el) return;
  el.hidden = false;
  el.innerHTML = "";
  const titre = document.createElement("p");
  titre.className = "aide-douce-titre";
  titre.textContent = "Petit coup de pouce";
  const indice = document.createElement("p");
  indice.className = "aide-douce-indice";
  indice.textContent = rappelErreur(getJeuCourant());
  const encouragement = document.createElement("p");
  encouragement.className = "aide-douce-encouragement";
  encouragement.textContent = estGrand()
    ? "Utilise l'indice, puis choisis ta réponse."
    : "Tu peux prendre ton temps, puis choisir.";
  el.append(titre, indice, encouragement);
  track("hint_used", { game_name: getJeuCourant(), niveau: getNiveauCourant() });
}

function lireQuestion() {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    afficherToastSimple("🔇 Lecture audio indisponible", "Tu peux lire la consigne doucement.");
    return;
  }
  const texte = getQuestionTexteLisible();
  if (!texte) return;
  window.speechSynthesis.cancel();
  const voix = new SpeechSynthesisUtterance(texte);
  voix.lang = "fr-FR";
  voix.rate = estGrand() ? 0.98 : 0.9;
  window.speechSynthesis.speak(voix);
  track("question_read_aloud", { game_name: getJeuCourant(), niveau: getNiveauCourant() });
}

function afficherToastSimple(titre, detail) {
  const app = document.querySelector(".app");
  if (!app) return;
  const toast = document.createElement("div");
  toast.className = "toast-progression";
  const span = document.createElement("span");
  span.textContent = titre;
  const strong = document.createElement("strong");
  strong.textContent = detail;
  toast.append(span, strong);
  app.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function mettreAJourProgressEffort() {
  const el = getEffortProgressEl();
  if (!el) return;
  const total = questionsDepuisDebutJeu + mauvaisesDepuisDebutJeu;
  if (total <= 0) {
    el.hidden = true;
    el.textContent = "";
    return;
  }
  el.hidden = false;
  const effort = Math.min(5, total);
  el.textContent = `🌱 Effort ${effort}/5`;
}

function recompenserEffortSiBesoin() {
  if (essaisDepuisEncouragement < 5) return;
  essaisDepuisEncouragement = 0;
  ajouterEtoiles(1);
  progresserMission("etoiles");
  afficherToastSimple("🌱 Bel effort !", "+1 étoile pour ta persévérance");
  if (debloquerBadge("perseverant")) {
    const b = BADGES.find(x => x.id === "perseverant");
    if (b) afficherNotifBadge(b);
  }
  track("effort_reward", {
    game_name: getJeuCourant(),
    niveau: getNiveauCourant(),
    questions: questionsDepuisDebutJeu,
    errors: mauvaisesDepuisDebutJeu,
  });
}

function recompenserCorrectionSiBesoin(correct) {
  if (!correct) {
    derniereQuestionEtaitErreur = true;
    return;
  }
  if (!derniereQuestionEtaitErreur) return;
  derniereQuestionEtaitErreur = false;
  correctionsDepuisEncouragement++;
  if (correctionsDepuisEncouragement < 2) return;
  correctionsDepuisEncouragement = 0;
  afficherToastSimple("💪 Erreur corrigée !", "Tu as continué après une difficulté");
  track("error_recovered", { game_name: getJeuCourant(), niveau: getNiveauCourant() });
}

function preparerOutilsQuestion() {
  cacherAideDouce();
  brancherOutilsQuestion();
  mettreAJourProgressEffort();
  mettreAJourBoutonRevision();
}

function lancerRevisionDepuisBouton(jeu) {
  const questions = getWrongQuestions(jeu);
  if (!jeu || questions.length === 0) return;
  track("revision_started", { game_name: jeu, niveau: getNiveauCourant(), wrong_count: questions.length, source: "inline" });
  const btn = document.getElementById("btn-reviser-erreurs");
  if (btn) btn.hidden = true;
  entrerRevision(jeu, questions);
  if (debloquerBadge("revision")) {
    const b = BADGES.find(x => x.id === "revision");
    if (b) afficherNotifBadge(b);
  }
}

export function proposerRevisionSiErreurs(jeu, onRetourMenu) {
  const questions = getWrongQuestions(jeu);
  if (!jeu || questions.length === 0) return false;
  const overlay = document.createElement("div");
  overlay.className = "evolution-overlay";
  overlay.innerHTML = `
    <div class="evolution-carte">
      <p style="font-size:2rem;margin:0">🔁</p>
      <p class="evolution-titre">Tu as ${questions.length} question${questions.length > 1 ? "s" : ""} à revoir</p>
      <p class="evolution-msg">On les reprend doucement ?</p>
      <button type="button" class="btn-evolution-fermer" id="revision-oui">Oui, je m'entraîne 💪</button>
      <button type="button" class="btn-revision-non" id="revision-non">Plus tard</button>
    </div>`;
  document.body.appendChild(overlay);
  piegerFocus(overlay);
  document.getElementById("revision-oui").addEventListener("click", () => {
    track("revision_started", { game_name: jeu, niveau: getNiveauCourant(), wrong_count: questions.length, source: "exit" });
    overlay.remove();
    entrerRevision(jeu, questions);
    if (debloquerBadge("revision")) {
      const b = BADGES.find(x => x.id === "revision");
      if (b) afficherNotifBadge(b);
    }
  });
  document.getElementById("revision-non").addEventListener("click", () => {
    track("revision_declined", { game_name: jeu, niveau: getNiveauCourant(), wrong_count: questions.length });
    clearWrongQuestions(jeu);
    overlay.remove();
    if (onRetourMenu) onRetourMenu();
  });
  return true;
}

function mettreAJourBoutonRevision() {
  const btn = document.getElementById("btn-reviser-erreurs");
  if (!btn) return;
  const jeu = getJeuCourant();
  const nb = jeu ? getWrongQuestions(jeu).length : 0;
  btn.hidden = nb <= 0 || !!_modeRevision;
  btn.textContent = nb > 0 ? `🔁 Revoir ${nb} question${nb > 1 ? "s" : ""}` : "🔁 Revoir mes erreurs";
  btn.setAttribute("aria-label", nb > 0 ? `Revoir ${nb} question${nb > 1 ? "s" : ""} difficile${nb > 1 ? "s" : ""}` : "Revoir mes erreurs");
  if (btn.dataset.amRevisionBound !== "1") {
    btn.dataset.amRevisionBound = "1";
    btn.addEventListener("click", () => lancerRevisionDepuisBouton(getJeuCourant()));
  }
}

function afficherActionRevision(jeu) {
  if (!jeu || _modeRevision) return;
  mettreAJourBoutonRevision();
  const nb = getWrongQuestions(jeu).length;
  if (nb <= 0) return;
  afficherToastSimple("🔁 Tu pourras t'entraîner", "Le bouton Revoir garde tes questions difficiles.");
}

function brancherOutilsQuestion() {
  const outils = getOutilsJeuEl();
  if (!outils) return;
  outils.hidden = false;
  const btnIndice = document.getElementById("btn-indice-question");
  if (btnIndice && btnIndice.dataset.amHintBound !== "1") {
    btnIndice.dataset.amHintBound = "1";
    btnIndice.addEventListener("click", afficherIndiceAvantReponse);
  }
  const btnLire = document.getElementById("btn-lire-question");
  if (btnLire && btnLire.dataset.amReadBound !== "1") {
    btnLire.dataset.amReadBound = "1";
    btnLire.addEventListener("click", lireQuestion);
  }
}

function cacherOutilsQuestion() {
  const outils = getOutilsJeuEl();
  if (outils) outils.hidden = true;
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
  cacherAideDouce();
  if (elSuivant) elSuivant.hidden = true;
  setRepondu(false);
}

// ── apresReponse (implémentation commune) ─────────────────────────────────────
function _apresReponseImpl(choix, bouton, correct, isText) {
  if (getRepondu()) return;
  setRepondu(true);
  stopChrono();
  questionsDepuisDebutJeu++;
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
    recompenserCorrectionSiBesoin(true);
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
    mauvaisesDepuisDebutJeu++;
    essaisDepuisEncouragement++;
    recompenserCorrectionSiBesoin(false);
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
    afficherAideDouce(correct);
    afficherActionRevision(getJeuCourant());
    declencherReactionRenard(false);
    tenterModeFatigue();
  }
  mettreAJourProgressEffort();
  recompenserEffortSiBesoin();
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
  const masques = getMasques();
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
  const nivMenu = getNiveauCourant();
  document.querySelectorAll(".carte-jeu[data-jeu]").forEach((btn) => {
    const jeu = btn.dataset.jeu;
    const descEl = btn.querySelector(".desc-jeu");
    if (descEl) {
      const d = texteDescCarteJeu(jeu, nivMenu);
      if (d) descEl.textContent = d;
    }
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
  majUiBoutonChrono();
}

export function majUiBoutonChrono() {
  const btn = document.getElementById("btn-chrono");
  if (!btn) return;
  syncPrefsDepuisStockage();
  const chronoOk = estMinuteurDisponible();
  btn.hidden = !chronoOk;
  if (!chronoOk) return;
  const on = lireChronoJeuActif();
  const symEl = btn.querySelector(".header-chrono-symbole");
  const labelEl = btn.querySelector(".header-chrono-label");
  const sym = on ? "⏱️" : "🌿";
  if (symEl) symEl.textContent = sym;
  if (labelEl) labelEl.textContent = on ? "Chrono" : "Zen";
  btn.dataset.chronoEtat = on ? "limite" : "libre";
  btn.setAttribute("aria-pressed", on ? "true" : "false");
  btn.setAttribute(
    "aria-label",
    on
      ? "Mode chrono activé. Appuie pour passer en mode zen sans limite de temps."
      : "Mode zen activé, sans limite de temps. Appuie pour remettre le chrono.",
  );
  btn.title = on
    ? "Mode chrono : réponds avant la fin. Appuie ici pour jouer tranquillement."
    : "Mode zen : prends tout ton temps. Appuie ici pour remettre le chrono.";
}

export function reglerMinuteurPourEnfant(actif) {
  syncPrefsDepuisStockage();
  if (!estMinuteurDisponible()) return;
  sauverChronoJeuActif(!!actif);
  if (!lireChronoJeuActif()) stopChrono();
  majUiBoutonChrono();
}

export function basculerMinuteurViaHeader() {
  syncPrefsDepuisStockage();
  if (!estMinuteurDisponible()) return false;
  const next = !lireChronoJeuActif();
  sauverChronoJeuActif(next);
  if (!next) stopChrono();
  majUiBoutonChrono();
  return true;
}

export function brancherBoutonChronoMenu() {
  const btn = document.getElementById("btn-chrono");
  if (!btn || btn.dataset.amChronoBound === "1") return;
  btn.dataset.amChronoBound = "1";
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    basculerMinuteurViaHeader();
  });
}

// ── montrerMenu ───────────────────────────────────────────────────────────────
export function montrerMenu() {
  const menu = elMenu || document.getElementById("ecran-menu");
  if (!menu) return;
  syncPrefsDepuisStockage();
  resetFeedback();
  stopChrono();
  cacherOutilsQuestion();
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
  questionsDepuisDebutJeu = 0;
  mauvaisesDepuisDebutJeu = 0;
  essaisDepuisEncouragement = 0;
  correctionsDepuisEncouragement = 0;
  derniereQuestionEtaitErreur = false;
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
