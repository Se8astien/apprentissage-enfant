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
  lireAccessoires,
  debloquerAccessoire,
  getNiveauCourant,
  getDifficulte,
  getDifficulteJeu,
  setDifficulteJeu,
  getDiffLabel,
  marquerMaitrise,
  lireMaitrise,
  escapeHtml,
  DIFFICULTE_ICONES,
  DIFFICULTE_LABELS,
  libelleDifficulteProfil,
  getDifficulteProfil,
  piegerFocus,
  revelerSeulEcran,
  syncPrefsDepuisStockage,
  lireChronoJeuActif,
  sauverChronoJeuActif,
  elQuestion,
  sauverDernierJeuMenu,
} from "./app-state.js";

import { texteAccrocheAleatoire } from "./app-accroches.js";
import { rafraichirBarreFunMenu } from "./app-fun-menu.js";

import { track } from "./app-analytics.js";
import { montrerMenuOuAventureApresRevision } from "./app-aventure.js";
import { sonBonne, sonMauvaise, sonCombo, sonMission, sonAccessoire } from "./app-sons.js";

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
let bonnesSession = 0;
let erreursSession = 0;
let indicesSession = 0;
let lecturesSession = 0;
let revisionsSession = 0;
let objectifSession = null;
let objectifSessionAtteint = false;
let lectureFacileActivee = false;
let miniLeconVueJeu = null;
let indiceUtiliseQuestion = false;

function jeuActifId() {
  const j = getJeuCourant();
  if (j) return j;
  return document.getElementById("ecran-jeu")?.dataset?.jeuActif || null;
}

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
      el.textContent = "∞ Temps libre";
      el.className = "chrono chrono-libre";
    }
    return;
  }
  if (!el) return;
  el.hidden = false;
  let reste = secs;
  el.textContent = `⏱ ${reste}s`;
  el.className = "chrono" + (getDifficulte() >= 2 ? " chrono--expert" : "");
  _chronoTimer = setInterval(() => {
    reste--;
    if (reste <= 0) { clearInterval(_chronoTimer); _chronoTimer = null; chronoExpire(); return; }
    el.textContent = `⏱ ${reste}s`;
    if (reste <= 10) el.className = "chrono chrono-urgent" + (getDifficulte() >= 2 ? " chrono--expert" : "");
  }, 1000);
}

function stopChrono() {
  if (_chronoTimer) { clearInterval(_chronoTimer); _chronoTimer = null; }
  const el = document.getElementById("chrono");
  if (el) el.hidden = true;
}

function enregistrerErreurQuestion() {
  erreursSession++;
  mauvaisesDepuisDebutJeu++;
  essaisDepuisEncouragement++;
  recompenserCorrectionSiBesoin(false);
}

function chronoExpire() {
  if (getRepondu()) return;
  setRepondu(true);
  stopChrono();
  questionsDepuisDebutJeu++;
  enregistrerErreurQuestion();
  elChoix.querySelectorAll(".btn-choix").forEach(btn => {
    btn.disabled = true;
    if (Number(btn.dataset.valeur) === getBonneReponse() || btn.dataset.valeur === String(getBonneReponse()))
      btn.classList.add("bonne");
  });
  track("question_wrong", { game_name: getJeuCourant(), niveau: getNiveauCourant(), timeout: true });
  sonMauvaise();
  incrementStats(false, getJeuCourant());
  comboActuel = 0;
  elFeedback.textContent = "⏰ Temps écoulé ! Indice : relis doucement la question 👀";
  elFeedback.className = "feedback non";
  afficherAideDouce(getBonneReponse(), { timeout: true });
  montrerExplicationVisuelle(getBonneReponse());
  afficherActionRevision(jeuActifId());
  declencherReactionRenard(false);
  verifierObjectifSession();
  mettreAJourProgressEffort();
  recompenserEffortSiBesoin();
  elSuivant.hidden = false;
}

// ── Mode révision ─────────────────────────────────────────────────────────────
const _wrongByGame = Object.create(null);
let _modeRevision = null;

export function getWrongQuestions(jeu) {
  return _wrongByGame[jeu] || [];
}
export function clearWrongQuestions(jeu) {
  delete _wrongByGame[jeu];
}

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
  jeuEl.dataset.jeuActif = nomJeu;
  setBadgeVisible(true);
  resetFeedback();
  preparerOutilsQuestion();
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
    revisionsSession++;
    verifierObjectifSession();
    afficherBilanSession();
    montrerMenuOuAventureApresRevision(montrerMenu, afficherMissions);
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
  preparerOutilsQuestion();
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
  injectAccrocheQuestion(jeu);
}

function injectAccrocheQuestion(jeu) {
  if (_modeRevision) return;
  document.getElementById("accroche-contexte")?.remove();
  const t = texteAccrocheAleatoire(jeu);
  if (!t) return;
  const wrap = document.createElement("p");
  wrap.id = "accroche-contexte";
  wrap.className = "accroche-contexte";
  wrap.textContent = t;
  const zq = elQuestion || document.getElementById("zone-question");
  if (!zq) return;
  zq.insertBefore(wrap, zq.firstChild);
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

function getBilanSessionEl() {
  return document.getElementById("bilan-session");
}

function getLeconJeuEl() {
  return document.getElementById("mini-lecon-jeu");
}

function getExplicationVisuelleEl() {
  return document.getElementById("explication-visuelle");
}

function getQuestionTexteLisible() {
  const zq = document.getElementById("zone-question");
  if (!zq) return "";
  return zq.textContent.replace(/\s+/g, " ").trim();
}

function extraireNombresQuestion() {
  const zq = document.getElementById("zone-question");
  if (!zq) return [];
  const raw = zq.textContent.replace(/\s+/g, " ");
  const matches = raw.match(/\d+/g);
  if (!matches) return [];
  return matches.map((s) => parseInt(s, 10)).filter((n) => Number.isFinite(n));
}

function lireTexte(texte) {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    afficherToastSimple("🔇 Lecture audio indisponible", "Tu peux lire doucement.");
    return false;
  }
  const propre = String(texte || "").replace(/\s+/g, " ").trim();
  if (!propre) return false;
  window.speechSynthesis.cancel();
  const voix = new SpeechSynthesisUtterance(propre);
  voix.lang = "fr-FR";
  voix.rate = estGrand() ? 0.98 : 0.9;
  window.speechSynthesis.speak(voix);
  return true;
}

function getTexteJeu(jeu) {
  const carte = jeu ? document.querySelector(`.carte-jeu[data-jeu="${jeu}"]`) : null;
  return carte?.querySelector(".nom-jeu")?.textContent?.trim() || jeu || "ce jeu";
}

function getGuidageDuJour() {
  const n = getNiveauCourant();
  if (n === "cm2") return ["proportionnalite", "pourcentages", "lectureTexte"];
  if (n === "cm1") return ["decimaux", "fractionsCM", "aires"];
  if (n === "ce2") return ["fractions", "heure", "lectureTexte"];
  if (n === "ce1") return ["addition", "soustraction", "multiplication"];
  return ["compte", "addition", "lecture"];
}

function leconPourJeu(jeu) {
  const lecons = {
    compte: "Je compte chaque objet une seule fois, avec mon doigt si besoin.",
    addition: "Pour additionner, je peux partir du plus grand nombre puis avancer.",
    soustraction: "Pour soustraire, j'enlève petit à petit et je regarde ce qui reste.",
    multiplication: "Multiplier, c'est faire des paquets de même taille.",
    division: "Diviser, c'est partager en groupes égaux.",
    fractions: "Une fraction montre combien de parts d'un même tout on prend.",
    fractionsCM: "Pour comparer des fractions, je regarde le dénominateur et les parts.",
    heure: "La petite aiguille donne l'heure, la grande aiguille donne les minutes.",
    grammaire: "Je cherche d'abord le verbe, puis je regarde les autres mots autour.",
    lecture: "Je regarde l'image, puis je lis le mot doucement.",
    lectureTexte: "Je peux retourner dans le texte pour retrouver l'information.",
    sequence: "Un algorithme se lit étape par étape, dans l'ordre.",
    code: "Je lis chaque ligne du programme, puis je prévois le résultat.",
  };
  return lecons[jeu] || "Je lis la consigne, je prends mon temps, puis je choisis.";
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

function montrerExplicationVisuelle(correct) {
  const el = getExplicationVisuelleEl();
  if (!el) return;
  const jeu = getJeuCourant();
  const question = getQuestionTexteLisible();
  el.innerHTML = "";
  el.hidden = false;

  const titre = document.createElement("p");
  titre.className = "explication-titre";
  titre.textContent = "Regarde la méthode";

  const visuel = document.createElement("div");
  visuel.className = "explication-visuel";
  let detail = "";

  const nombres = extraireNombresQuestion();
  if (jeu === "addition" && nombres.length >= 2) {
    const [a, b] = nombres;
    visuel.textContent = "🔵".repeat(Math.min(a, 9)) + " + " + "🟡".repeat(Math.min(b, 9));
    detail = `${a} puis encore ${b}, cela fait ${correct}.`;
    if (a + b > 18) detail = `Additionne par paquets : la réponse est ${correct}.`;
  } else if (jeu === "soustraction" && nombres.length >= 2) {
    const [a, b] = nombres;
    visuel.textContent = "🍎".repeat(Math.min(a, 12)) + "  ➜  " + "❌".repeat(Math.min(b, 12));
    detail = `On part de ${a}, on enlève ${b}. Il reste ${correct}.`;
  } else if (jeu === "fractions" || jeu === "fractionsCM") {
    visuel.textContent = "◼️ ◼️ ◻️ ◻️";
    detail = "Compare les parts colorées avec le même tout.";
  } else if (jeu === "grammaire" || jeu === "conjugaison") {
    visuel.textContent = "Sujet  →  verbe  →  complément";
    detail = "Repère d'abord le verbe, puis regarde les mots autour.";
  } else if (question) {
    visuel.textContent = "👀  →  💡  →  ✅";
    detail = `Relis la consigne doucement. La bonne réponse était ${correct}.`;
  } else {
    visuel.textContent = "💡";
    detail = `La bonne réponse était ${correct}.`;
  }

  const texte = document.createElement("p");
  texte.className = "explication-detail";
  texte.textContent = detail;
  el.append(titre, visuel, texte);
}

function cacherAideDouce() {
  const el = getAideDouceEl();
  if (!el) return;
  el.hidden = true;
  el.innerHTML = "";
  const explication = getExplicationVisuelleEl();
  if (explication) {
    explication.hidden = true;
    explication.innerHTML = "";
  }
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
  const texte = getQuestionTexteLisible();
  if (!texte) return;
  if (lireTexte(texte)) {
    lecturesSession++;
    track("question_read_aloud", { game_name: getJeuCourant(), niveau: getNiveauCourant() });
  }
}

function lireTexteCourt(texte, source) {
  if (!texte) return;
  if (lireTexte(texte)) {
    lecturesSession++;
    if (lecturesSession >= 5 && debloquerBadge("narrateur")) {
      const b = BADGES.find(x => x.id === "narrateur");
      if (b) afficherNotifBadge(b);
    }
    track("text_read_aloud", { game_name: getJeuCourant(), niveau: getNiveauCourant(), source });
  }
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

function debloquerAccessoireEffort(id, message) {
  if (lireAccessoires().includes(id)) return;
  debloquerAccessoire(id);
  sonAccessoire();
  mettreAJourRenardHeader();
  afficherToastSimple(message, "Va voir le dressing de ton renard.");
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
  const missEffort = progresserMission("etoiles");
  if (missEffort.length) {
    sonMission();
    setTimeout(() => confetti({ tier: "burst" }), 260);
  }
  debloquerAccessoireEffort("medaille-effort", "🏅 Médaille d'effort débloquée !");
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
  debloquerAccessoireEffort("cape-courage", "🦸 Cape courage débloquée !");
  afficherToastSimple("💪 Erreur corrigée !", "Tu as continué après une difficulté");
  track("error_recovered", { game_name: getJeuCourant(), niveau: getNiveauCourant() });
}

function verifierObjectifSession() {
  if (!objectifSession || objectifSessionAtteint) return;
  const atteint =
    (objectifSession === "etoiles3" && bonnesSession >= 3) ||
    (objectifSession === "revision" && revisionsSession >= 1) ||
    (objectifSession === "questions5" && (bonnesSession + erreursSession) >= 5);
  if (!atteint) return;
  objectifSessionAtteint = true;
  afficherToastSimple("🎯 Objectif réussi !", "Tu peux continuer ou faire une pause.");
  if (debloquerBadge("objectif")) {
    const b = BADGES.find(x => x.id === "objectif");
    if (b) afficherNotifBadge(b);
  }
  track("session_goal_reached", { goal: objectifSession, niveau: getNiveauCourant() });
}

function afficherBilanSession() {
  const el = getBilanSessionEl();
  if (!el) return;
  const total = bonnesSession + erreursSession;
  if (total <= 0 && indicesSession <= 0 && revisionsSession <= 0) {
    el.hidden = true;
    el.innerHTML = "";
    return;
  }
  el.hidden = false;
  el.innerHTML = "";
  const titre = document.createElement("p");
  titre.className = "bilan-session-titre";
  titre.textContent = "Bravo pour ta session !";
  const stats = document.createElement("p");
  stats.className = "bilan-session-stats";
  stats.textContent = `${total} question${total > 1 ? "s" : ""} · ${indicesSession} indice${indicesSession > 1 ? "s" : ""} · ${revisionsSession} révision${revisionsSession > 1 ? "s" : ""}`;
  const encouragement = document.createElement("p");
  encouragement.className = "bilan-session-texte";
  encouragement.textContent = objectifSessionAtteint
    ? "Objectif atteint, Foxy est fier de toi."
    : "Tu as appris en essayant, c'est déjà une réussite.";
  el.append(titre, stats, encouragement);
}

function mettreAJourObjectifSession() {
  const box = document.getElementById("objectif-session");
  if (!box) return;
  box.hidden = !!objectifSession;
}

function choisirObjectifSession(goal) {
  objectifSession = goal;
  objectifSessionAtteint = false;
  mettreAJourObjectifSession();
  const labels = {
    etoiles3: "Gagner 3 étoiles",
    questions5: "Faire 5 questions",
    revision: "Revoir mes erreurs",
  };
  afficherToastSimple("🎯 Objectif choisi", labels[goal] || "Je joue tranquillement");
  track("session_goal_selected", { goal, niveau: getNiveauCourant() });
}

function brancherObjectifSession() {
  const box = document.getElementById("objectif-session");
  if (!box || box.dataset.amGoalBound === "1") return;
  box.dataset.amGoalBound = "1";
  box.querySelectorAll("[data-objectif]").forEach((btn) => {
    btn.addEventListener("click", () => choisirObjectifSession(btn.dataset.objectif));
  });
}

function afficherGuidageDuJour() {
  const el = document.getElementById("guidage-jour");
  if (!el) return;
  const ids = getGuidageDuJour().filter((jeu) => {
    const carte = document.querySelector(`.carte-jeu[data-jeu="${jeu}"]`);
    return carte && !carte.hidden;
  });
  if (ids.length === 0) {
    el.hidden = true;
    el.innerHTML = "";
    return;
  }
  el.hidden = false;
  el.innerHTML = "";
  const titre = document.createElement("p");
  titre.className = "guidage-titre";
  titre.textContent = "🦊 Parcours conseillé";
  const texte = document.createElement("p");
  texte.className = "guidage-texte";
  texte.textContent = ids.map(getTexteJeu).join(" → ");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "guidage-btn";
  btn.textContent = "Commencer";
  btn.addEventListener("click", () => {
    const carte = document.querySelector(`.carte-jeu[data-jeu="${ids[0]}"]`);
    if (carte) carte.click();
  });
  el.append(titre, texte, btn);
}

function appliquerLectureFacile() {
  const jeuEl = elJeu || document.getElementById("ecran-jeu");
  if (jeuEl) jeuEl.classList.toggle("lecture-facile", lectureFacileActivee);
  const btn = document.getElementById("btn-lecture-facile");
  if (btn) {
    btn.setAttribute("aria-pressed", lectureFacileActivee ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      lectureFacileActivee
        ? "Lecture facile activée : texte plus grand"
        : "Activer la lecture facile : texte plus grand dans les jeux",
    );
  }
}

function basculerLectureFacile() {
  lectureFacileActivee = !lectureFacileActivee;
  appliquerLectureFacile();
  if (lectureFacileActivee && debloquerBadge("lecture_facile")) {
    const b = BADGES.find(x => x.id === "lecture_facile");
    if (b) afficherNotifBadge(b);
  }
  track("easy_reading_toggle", { active: lectureFacileActivee, niveau: getNiveauCourant() });
}

function afficherMiniLecon(jeu) {
  const el = getLeconJeuEl();
  if (!el || miniLeconVueJeu === jeu || _modeRevision) return;
  miniLeconVueJeu = jeu;
  el.hidden = false;
  el.innerHTML = "";
  const titre = document.createElement("p");
  titre.className = "mini-lecon-titre";
  titre.textContent = `🦊 Avant de jouer à ${getTexteJeu(jeu)}`;
  const texte = document.createElement("p");
  texte.className = "mini-lecon-texte";
  texte.textContent = leconPourJeu(jeu);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mini-lecon-btn";
  btn.textContent = "J'ai compris, je joue";
  btn.addEventListener("click", () => { el.hidden = true; });
  el.append(titre, texte, btn);
}

function preparerOutilsQuestion() {
  indiceUtiliseQuestion = false;
  cacherAideDouce();
  brancherOutilsQuestion();
  mettreAJourProgressEffort();
  mettreAJourBoutonRevision();
  appliquerLectureFacile();
}

function lancerRevisionDepuisBouton(jeu) {
  const questions = getWrongQuestions(jeu);
  if (!jeu || questions.length === 0) return;
  track("revision_started", { game_name: jeu, niveau: getNiveauCourant(), wrong_count: questions.length, source: "inline" });
  const btn = document.getElementById("btn-reviser-erreurs");
  if (btn) btn.hidden = true;
  debloquerAccessoireEffort("sac-aventure", "🎒 Sac d'aventure débloqué !");
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
    debloquerAccessoireEffort("sac-aventure", "🎒 Sac d'aventure débloqué !");
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

function mettreAJourBoutonRevision(jeuCible) {
  const btn = document.getElementById("btn-reviser-erreurs");
  if (!btn) return;
  const jeu = jeuCible !== undefined ? jeuCible : jeuActifId();
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
  const j = jeu || jeuActifId();
  if (!j || _modeRevision) return;
  mettreAJourBoutonRevision(j);
  const nb = getWrongQuestions(j).length;
  if (nb <= 0) return;
  afficherToastSimple("🔁 Tu pourras t'entraîner", "Le bouton Revoir garde tes questions difficiles.");
}

function brancherAudioChoix() {
  elChoix.querySelectorAll(".btn-choix").forEach((btn) => {
    if (btn.dataset.amReadChoiceBound === "1") return;
    btn.dataset.amReadChoiceBound = "1";
    const texte = btn.textContent.trim();
    btn.setAttribute("aria-label", `${texte}. Entrée pour répondre.`);
    btn.addEventListener("contextmenu", (ev) => {
      ev.preventDefault();
      lireTexteCourt(texte, "choice_context");
    });
  });
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
  brancherAudioChoix();
  const btnLectureFacile = document.getElementById("btn-lecture-facile");
  if (btnLectureFacile) {
    if (btnLectureFacile.dataset.amEasyReadBound !== "1") {
      btnLectureFacile.dataset.amEasyReadBound = "1";
      btnLectureFacile.addEventListener("click", basculerLectureFacile);
    }
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
  const bulle = correct
    ? (estGrand() ? "Bravo !" : "Ouais ! 🎉")
    : (estGrand() ? "Presque bon." : "Tu y es presque !");
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
  confetti({ tier: "burst" });
  sonCombo();
  track("combo_reached", { game_name: getJeuCourant(), niveau: getNiveauCourant(), combo: nb });
  if (nb >= 5) {
    const mCombo = progresserMission("combo5");
    afficherMissions();
    if (mCombo.length) {
      sonMission();
      setTimeout(() => confetti(estGrand() ? { tier: "sparkle", sobre: true } : { tier: "sparkle" }), 450);
    }
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
    bonnesSession++;
    comboActuel++;
    erreursSerie = 0;
    recompenserCorrectionSiBesoin(true);
    track("question_correct", { game_name: getJeuCourant(), niveau: getNiveauCourant(), combo: comboActuel });
    const ok = messagesOk();
    elFeedback.textContent = (estGrand() ? "Correct — " : "✓ ") + ok[Math.floor(Math.random() * ok.length)];
    elFeedback.className = "feedback ok";
    ajouterEtoiles(1);
    sauverFaim(lireFaim() + 5);
    confetti(estGrand() ? { tier: "sparkle", sobre: true } : { tier: "sparkle" });
    sonBonne(comboActuel);
    declencherReactionRenard(true);
    incrementStats(true, getJeuCourant());
    const missOk = [
      ...progresserMission("bonnes"),
      ...progresserMission("etoiles"),
      ...progresserMission("jeux", getJeuCourant()),
    ];
    afficherMissions();
    if (missOk.length) {
      sonMission();
      setTimeout(() => confetti({ tier: "burst" }), 320);
    }
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
    const idJeuErreur = jeuActifId();
    erreursSession++;
    erreursSerie++;
    mauvaisesDepuisDebutJeu++;
    essaisDepuisEncouragement++;
    recompenserCorrectionSiBesoin(false);
    if (!_modeRevision && idJeuErreur) {
      if (!_wrongByGame[idJeuErreur]) _wrongByGame[idJeuErreur] = [];
      const _zq = document.getElementById("zone-question");
      _wrongByGame[idJeuErreur].push({ html: _zq ? _zq.innerHTML : "", bonne: correct, isText, options: [...elChoix.querySelectorAll(".btn-choix")].map(b => b.textContent.trim()) });
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
    montrerExplicationVisuelle(correct);
    afficherActionRevision(idJeuErreur);
    declencherReactionRenard(false);
    tenterModeFatigue();
  }
  verifierObjectifSession();
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
  toast.innerHTML = estGrand()
    ? `<span>Tu passes en mode expert pour ce jeu.</span><strong>${getDiffLabel()}</strong>`
    : `<span>🎉 Tu passes en mode Ninja !</span><strong>${getDiffLabel()}</strong>`;
  app.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function proposerClasseSuivante() {
  const suivantNom = { cp: "CE1 🚀", ce1: "CE2 ⭐", ce2: "CM1 🌟", cm1: "CM2 🏆", cm2: null }[getNiveauCourant()];
  if (!suivantNom) { confetti({ tier: "burst" }); return; }
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
  const diffProfil = getDifficulteProfil();
  const marqueurRythme = DIFFICULTE_ICONES[diffProfil] || "⚡";
  const diffProfilEl = document.getElementById("btn-changer-rythme");
  if (diffProfilEl) {
    diffProfilEl.textContent = libelleDifficulteProfil();
    const nomsRythme = ["Débutant", "Normal", "Expert"];
    diffProfilEl.setAttribute(
      "aria-label",
      `Ton rythme : ${nomsRythme[getDifficulteProfil()]}. Touche pour changer.`,
    );
  }
  document.querySelectorAll(".niveau-btn").forEach((btn) => {
    const actif = btn.dataset.niveau === getNiveauCourant();
    btn.classList.toggle("actif", actif);
    btn.setAttribute("aria-pressed", actif ? "true" : "false");
  });
  filtrerJeuxParNiveau();
  const nivMenu = getNiveauCourant();
  document.querySelectorAll(".carte-jeu[data-jeu]").forEach((btn) => {
    const jeu = btn.dataset.jeu;
    const emojiEl = btn.querySelector(".emoji-jeu");
    if (emojiEl) {
      if (!emojiEl.dataset.baseEmoji) emojiEl.dataset.baseEmoji = emojiEl.textContent.trim();
      emojiEl.textContent = `${marqueurRythme} ${emojiEl.dataset.baseEmoji}`;
    }
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
  rafraichirBarreFunMenu();
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
  const sym = on ? "⏱️" : "∞";
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
  const jeuQuitte = jeuActifId() || getJeuCourant();
  if (jeuQuitte) sauverDernierJeuMenu(jeuQuitte);
  syncPrefsDepuisStockage();
  resetFeedback();
  stopChrono();
  cacherOutilsQuestion();
  _modeRevision = null;
  rattrapageRestant = 0;
  rattrapageDiffOriginale = null;
  const ecranJeuData = document.getElementById("ecran-jeu");
  if (ecranJeuData) delete ecranJeuData.dataset.jeuActif;
  setJeuCourant(null);
  setBadgeVisible(false);
  const modal = document.getElementById("modal-classe-suivante");
  if (modal) modal.hidden = true;
  revelerSeulEcran(menu);
  synchroniserAffichageMenu();
  brancherObjectifSession();
  mettreAJourObjectifSession();
  afficherGuidageDuJour();
  afficherBilanSession();
}

// ── montrerJeu ────────────────────────────────────────────────────────────────
export function montrerJeu(nom, lanceurs) {
  const jeu = elJeu || document.getElementById("ecran-jeu");
  if (!jeu || !nom || !lanceurs || typeof lanceurs[nom] !== "function") return;
  setJeuCourant(nom);
  jeu.dataset.jeuActif = nom;
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
  miniLeconVueJeu = null;
  revelerSeulEcran(jeu);
  setBadgeVisible(true);
  const diffBadge = document.getElementById("diff-badge");
  if (diffBadge) { diffBadge.hidden = false; diffBadge.textContent = getDiffLabel(); }
  resetFeedback();
  _histoireQuestions[nom] = [];
  lancerAvecAntiRepeat(nom, lanceurs);
  afficherMiniLecon(nom);
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
