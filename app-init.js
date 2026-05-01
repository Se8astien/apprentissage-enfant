// app-init.js — lancers map, event listeners, startup (entry point)

import {
  elGenre,
  elMenu,
  elTotal,
  elSousTitre,
  btnRetour,
  elSuivant,
  sauverNiveau,
  sauverGenre,
  lireNomRenard,
  sauverNomRenard,
  lireEtoiles,
  majGenre,
  mettreAJourJauges,
  setBadgeVisible,
  getNiveauCourant,
  getJeuCourant,
  estGrand,
  STORAGE_NIVEAU,
  getDifficulte,
  setDifficulte,
  getDiffLabel,
  lireMaitrise,
  confetti,
  escapeHtml,
  NIVEAUX_LABELS,
  piegerFocus,
  revelerEcran,
} from "./app-state.js";

import {
  mettreAJourRenardHeader,
  montrerNommage,
  mettreAJourStreak,
  afficherStreakHeader,
  montrerMaison,
  montrerDressing,
  svgRenard,
  getStade,
} from "./app-renard.js";

import {
  montrerMenu,
  montrerJeu,
  questionSuivante,
  resetFeedback,
  getWrongQuestions,
  clearWrongQuestions,
  entrerRevision,
} from "./app-nav.js";

import {
  afficherMissions,
  debloquerBadge,
  afficherNotifBadge,
  BADGES,
  lireBadges,
} from "./app-gamification.js";

import { lancerCompte, lancerAddition, lancerSoustraction, lancerCompare, lancerSuite, lancerDoubles, lancerMoitie, lancerDizaines, lancerPairImpair, lancerPerlesDorees, lancerPlanche100, lancerDecimaux } from "./games-maths.js";
import { lancerFormes, lancerFractions, lancerSymetrie, lancerPerimetre, lancerAngles, lancerAires } from "./games-formes.js";
import { lancerHeure, lancerDurees, lancerMesures, lancerMasse, lancerCalendrier } from "./games-temps.js";
import { lancerMonnaieCp, lancerMonnaieCe1 } from "./games-argent.js";
import { lancerMultiplication, lancerDivision, lancerProbleme, lancerFractionsCM, lancerProportionnalite, lancerPourcentages } from "./games-avance.js";
import { lancerSyllabes, lancerLecture, lancerAnglaisMots, lancerTraduction, lancerSons, lancerGrammaire, lancerLecturePhrase, lancerPhraseMobile, lancerLectureTexte, lancerConjugaison, lancerHomophones, lancerSynonymes, lancerAllemandMots, lancerTraductionAllemand, lancerEspagnolMots, lancerTraductionEspagnol, lancerItalienMots, lancerTraductionItalien, lancerPortugaisMots, lancerTraductionPortugais } from "./games-langage.js";
import { afficherIntroHistoire } from "./app-histoire.js";
import { lancerSequence, lancerCode } from "./games-algo.js";
import { track, setAnalyticsConsent, flushAnalyticsQueue } from "./app-analytics.js";
import { toggleSons, sonsActifs } from "./app-sons.js";
import { initProfils, getProfils, basculerProfil, creerProfil, syncProfilActif } from "./app-profils.js";
import { montrerParams } from "./app-params.js";

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", wait_for_update: 500 });

{
  const w = document.getElementById("alerte-file-protocol");
  if (w) w.hidden = true;
}

const GA_ID = "G-5EDQ2KCS8X";
let analyticsCharge = false;

function chargerAnalytics() {
  if (analyticsCharge || document.querySelector(`script[src*="${GA_ID}"]`)) return;
  analyticsCharge = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
}

// ── Lancers map ───────────────────────────────────────────────────────────────
const lanceurs = {
  compte:         lancerCompte,
  addition:       lancerAddition,
  soustraction:   lancerSoustraction,
  compare:        lancerCompare,
  suite:          lancerSuite,
  doubles:        lancerDoubles,
  heure:          lancerHeure,
  pairimpair:     lancerPairImpair,
  dizaines:       lancerDizaines,
  formes:         lancerFormes,
  monnaiecp:      lancerMonnaieCp,
  moitie:         lancerMoitie,
  multiplication: lancerMultiplication,
  division:       lancerDivision,
  fractions:      lancerFractions,
  mesures:        lancerMesures,
  monnaiece1:     lancerMonnaieCe1,
  symetrie:       lancerSymetrie,
  syllabes:       lancerSyllabes,
  lecture:        lancerLecture,
  anglais:        lancerAnglaisMots,
  traduction:     lancerTraduction,
  durees:         lancerDurees,
  probleme:       lancerProbleme,
  masse:          lancerMasse,
  perimetre:      lancerPerimetre,
  angles:         lancerAngles,
  perlesDorees:   lancerPerlesDorees,
  planche100:     lancerPlanche100,
  sons:           lancerSons,
  grammaire:      lancerGrammaire,
  lecturePhrase:  lancerLecturePhrase,
  phraseMobile:   lancerPhraseMobile,
  lectureTexte:   lancerLectureTexte,
  aires:          lancerAires,
  decimaux:       lancerDecimaux,
  fractionsCM:    lancerFractionsCM,
  proportionnalite: lancerProportionnalite,
  pourcentages:   lancerPourcentages,
  conjugaison:          lancerConjugaison,
  homophones:           lancerHomophones,
  synonymes:            lancerSynonymes,
  calendrier:           lancerCalendrier,
  allemand:             lancerAllemandMots,
  traductionAllemand:   lancerTraductionAllemand,
  espagnol:             lancerEspagnolMots,
  traductionEspagnol:   lancerTraductionEspagnol,
  italien:              lancerItalienMots,
  traductionItalien:    lancerTraductionItalien,
  portugais:            lancerPortugaisMots,
  traductionPortugais:  lancerTraductionPortugais,
  sequence:             lancerSequence,
  code:                 lancerCode,
};

// ── Classe screen ─────────────────────────────────────────────────────────────
const ecranClasse = document.getElementById("ecran-classe");
const btnClasse = document.querySelectorAll(".btn-classe");
const btnNiveaux = document.querySelectorAll(".niveau-btn");

function syncNiveauButtons() {
  const niveau = getNiveauCourant();
  btnNiveaux.forEach(btn => {
    const actif = btn.dataset.niveau === niveau;
    btn.classList.toggle("actif", actif);
    btn.setAttribute("aria-pressed", actif ? "true" : "false");
  });
}

function montrerClasse() {
  if (!ecranClasse) return;
  document.querySelectorAll(".ecran").forEach(e => { e.hidden = true; e.classList.remove("actif"); });
  revelerEcran(ecranClasse);
  const mascot = document.getElementById("classe-mascotte");
  if (mascot) mascot.innerHTML = svgRenard(getStade(lireEtoiles()), 80, {});
  const diffChoix = document.getElementById("diff-choix");
  if (diffChoix) diffChoix.hidden = true;
  btnClasse.forEach(b => b.classList.remove("selectionne"));
}

function passerAuMenu() {
  if (!lireNomRenard()) {
    montrerNommage();
  } else {
    majGenre();
    syncNiveauButtons();
    montrerMenu();
    afficherMissions();
  }
}

btnClasse.forEach(btn => {
  btn.addEventListener("click", () => {
    sauverNiveau(btn.dataset.niveau);
    btnClasse.forEach(b => b.classList.toggle("selectionne", b === btn));
    const diffChoix = document.getElementById("diff-choix");
    if (diffChoix) {
      diffChoix.hidden = false;
      diffChoix.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
});

document.querySelectorAll(".btn-diff").forEach(btn => {
  btn.addEventListener("click", () => {
    setDifficulte(parseInt(btn.dataset.diff, 10));
    passerAuMenu();
  });
});

btnNiveaux.forEach(btn => {
  btn.addEventListener("click", () => {
    sauverNiveau(btn.dataset.niveau);
    syncNiveauButtons();
    montrerMenu();
    afficherMissions();
  });
});

// ── Initialisation ────────────────────────────────────────────────────────────
const { liste: profilsListe, actifId: profilActifId } = initProfils();
const sessionStartTs = Date.now();
let sessionClosed = false;
if (elTotal) elTotal.textContent = lireEtoiles();
let streakInit = { count: 0, lastVisit: "" };
try {
  majGenre();
  mettreAJourJauges();
  mettreAJourRenardHeader();
  streakInit = mettreAJourStreak();
  afficherStreakHeader(streakInit.count);
} catch (err) {
  console.error("[App] init renard/streak ignorée", err);
}
syncProfilActif(lireEtoiles(), lireNomRenard(), getNiveauCourant());

// ── Démarrage ─────────────────────────────────────────────────────────────────
function demarrerApp() {
  if (!localStorage.getItem("maths-cp-genre")) {
    const g = elGenre || document.getElementById("ecran-genre");
    if (!g) return;
    document.querySelectorAll(".ecran").forEach(e => { e.hidden = true; e.classList.remove("actif"); });
    revelerEcran(g);
  } else if (!localStorage.getItem(STORAGE_NIVEAU)) {
    montrerClasse();
  } else if (!lireNomRenard()) {
    montrerNommage();
  } else {
    montrerMenu();
    afficherMissions();
    if (elSousTitre) {
      const nom = lireNomRenard();
      elSousTitre.textContent = estGrand()
        ? `Bon retour, ${nom} !`
        : `${nom} t'attendait ! 🦊`;
      setTimeout(() => majGenre(), 3500);
    }
  }
}

function garantirUnEcranVisible() {
  let ok = false;
  document.querySelectorAll(".ecran.actif").forEach((el) => {
    if (!el.hidden) ok = true;
  });
  if (ok) return;
  try {
    demarrerApp();
  } catch (err) {
    console.error("[App] demarrerApp", err);
  }
  ok = false;
  document.querySelectorAll(".ecran.actif").forEach((el) => {
    if (!el.hidden) ok = true;
  });
  if (ok) return;
  document.querySelectorAll(".ecran").forEach(e => { e.hidden = true; e.classList.remove("actif"); });
  try {
    if (!localStorage.getItem("maths-cp-genre")) {
      const g = document.getElementById("ecran-genre");
      if (g) revelerEcran(g);
    } else if (!localStorage.getItem(STORAGE_NIVEAU)) {
      montrerClasse();
    } else if (!lireNomRenard()) {
      montrerNommage();
    } else {
      montrerMenu();
      afficherMissions();
    }
  } catch (err2) {
    console.error("[App] secours écran", err2);
    const menu = document.getElementById("ecran-menu");
    const g = document.getElementById("ecran-genre");
    if (menu) revelerEcran(menu);
    else if (g) revelerEcran(g);
  }
}

function screenCourant() {
  const elActif = document.querySelector(".ecran.actif");
  return elActif ? (elActif.id || "unknown") : "unknown";
}

function trackSessionEnd() {
  if (sessionClosed) return;
  sessionClosed = true;
  track("session_end", {
    duration_s: Math.round((Date.now() - sessionStartTs) / 1000),
    last_screen: screenCourant(),
    game_name: getJeuCourant() || "",
  });
}

function lancerDepuisSelecteur() {
  const ecranLanding = document.getElementById("ecran-landing");
  if (ecranLanding && !localStorage.getItem("landing-seen")) {
    document.querySelectorAll(".ecran").forEach((e) => { e.hidden = true; e.classList.remove("actif"); });
    revelerEcran(ecranLanding);
    const go = () => {
      localStorage.setItem("landing-seen", "1");
      ecranLanding.hidden = true;
      ecranLanding.classList.remove("actif");
      demarrerApp();
    };
    const cta1 = document.getElementById("btn-landing-cta");
    const cta2 = document.getElementById("btn-landing-cta-2");
    if (cta1) cta1.addEventListener("click", go);
    if (cta2) cta2.addEventListener("click", go);
    if (!cta1 && !cta2) go();
  } else {
    demarrerApp();
  }
}

function afficherSelecteurProfils(liste, actifId) {
  const ecran = document.getElementById("ecran-profils");
  const grille = document.getElementById("profils-grille");
  const btnAjout = document.getElementById("btn-ajouter-profil");
  if (!ecran || !grille) {
    sessionStorage.setItem("skip-selector", "1");
    lancerDepuisSelecteur();
    return;
  }
  document.querySelectorAll(".ecran").forEach(e => { e.hidden = true; e.classList.remove("actif"); });
  revelerEcran(ecran);

  const niveauLabel = NIVEAUX_LABELS;
  grille.innerHTML = liste.map(p => {
    const stade = getStade(p.etoiles || 0);
    return `<button type="button" class="profil-carte${p.id === actifId ? " actif" : ""}" data-id="${p.id}">
      <div class="profil-fox">${svgRenard(stade, 68, {})}</div>
      <span class="profil-nom">${escapeHtml(p.nom || "Renard")}</span>
      <span class="profil-niveau">${niveauLabel[p.niveau || "cp"] || "🌱 CP"}</span>
      <span class="profil-etoiles">⭐ ${p.etoiles || 0}</span>
    </button>`;
  }).join("");

  if (btnAjout) btnAjout.hidden = liste.length >= 4;

  grille.querySelectorAll(".profil-carte").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (id === actifId) {
        sessionStorage.setItem("skip-selector", "1");
        ecran.hidden = true;
        ecran.classList.remove("actif");
        lancerDepuisSelecteur();
      } else {
        basculerProfil(id);
      }
    });
  });

  if (btnAjout) {
    btnAjout.addEventListener("click", () => {
      const id = creerProfil();
      if (id) basculerProfil(id);
    });
  }
}

try {
  if (profilsListe.length >= 2 && !sessionStorage.getItem("skip-selector")) {
    afficherSelecteurProfils(profilsListe, profilActifId);
  } else {
    sessionStorage.removeItem("skip-selector");
    lancerDepuisSelecteur();
  }
} catch (err) {
  console.error("[App] boot profils / landing", err);
}

queueMicrotask(() => {
  const a = document.querySelector(".ecran.actif");
  if (a && !a.hidden) document.body.dataset.appInit = "1";
});

setTimeout(garantirUnEcranVisible, 0);
setTimeout(garantirUnEcranVisible, 600);

track("session_start", {
  niveau: getNiveauCourant(),
  difficulte: getDifficulte(),
  profil_count: profilsListe.length,
});
flushAnalyticsQueue();
window.addEventListener("beforeunload", trackSessionEnd);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") trackSessionEnd();
});

const btnProfilsHeader = document.getElementById("btn-profils-header");
if (btnProfilsHeader) {
  if (profilsListe.length >= 2) btnProfilsHeader.hidden = false;
  btnProfilsHeader.addEventListener("click", () => {
    afficherSelecteurProfils(getProfils(), profilActifId);
  });
}

// ── Formulaire de nommage ─────────────────────────────────────────────────────
const formNommage = document.getElementById("nommage-form");
if (formNommage) {
  formNommage.addEventListener("submit", (e) => {
    e.preventDefault();
    const inp = document.getElementById("input-nom-renard");
    const nom = ((inp && inp.value) || "").trim().slice(0, 12) || "Foxy";
    sauverNomRenard(nom);
    const elNommage = document.getElementById("ecran-nommage");
    elNommage.classList.remove("actif");
    elNommage.hidden = true;
    mettreAJourRenardHeader();
    syncNiveauButtons();
    montrerMenu();
    afficherMissions();
    afficherIntroHistoire(nom);
  });
}

// ── Étoiles de maîtrise ───────────────────────────────────────────────────────
function majEtoilesMaitrise() {
  document.querySelectorAll(".carte-jeu[data-jeu]").forEach(btn => {
    const jeu = btn.dataset.jeu;
    const m = lireMaitrise(jeu);
    const etoiles = m.filter(Boolean).length;
    let el = btn.querySelector(".maitrise-stars");
    if (!el) { el = document.createElement("span"); el.className = "maitrise-stars"; btn.appendChild(el); }
    el.textContent = etoiles > 0 ? "★".repeat(etoiles) + "☆".repeat(3 - etoiles) : "";
  });
}
majEtoilesMaitrise();

// ── Boutons jeux ──────────────────────────────────────────────────────────────
document.querySelectorAll(".carte-jeu").forEach((btn) => {
  btn.addEventListener("click", () => {
    track("game_start", { game_name: btn.dataset.jeu, niveau: getNiveauCourant(), difficulte: getDifficulte() });
    montrerJeu(btn.dataset.jeu, lanceurs);
  });
});

// ── Navigation ────────────────────────────────────────────────────────────────
if (btnRetour) btnRetour.addEventListener("click", () => {
  const jeu = getJeuCourant();
  const wrongs = getWrongQuestions(jeu);
  track("game_exit", {
    game_name: jeu || "",
    niveau: getNiveauCourant(),
    wrong_count: wrongs.length,
    revision_prompted: wrongs.length > 0,
  });
  if (jeu && wrongs.length > 0) {
    const overlay = document.createElement("div");
    overlay.className = "evolution-overlay";
    overlay.innerHTML = `
      <div class="evolution-carte">
        <p style="font-size:2rem;margin:0">🔁</p>
        <p class="evolution-titre">Tu as eu ${wrongs.length} erreur${wrongs.length > 1 ? "s" : ""} !</p>
        <p class="evolution-msg">Veux-tu revoir ces questions ?</p>
        <button type="button" class="btn-evolution-fermer" id="revision-oui">Oui, revoir ! 💪</button>
        <button type="button" class="btn-revision-non" id="revision-non">Non merci</button>
      </div>`;
    document.body.appendChild(overlay);
    piegerFocus(overlay);
    document.getElementById("revision-oui").addEventListener("click", () => {
      track("revision_started", { game_name: jeu, niveau: getNiveauCourant(), wrong_count: wrongs.length });
      overlay.remove();
      entrerRevision(jeu, wrongs);
    });
    document.getElementById("revision-non").addEventListener("click", () => {
      track("revision_declined", { game_name: jeu, niveau: getNiveauCourant(), wrong_count: wrongs.length });
      clearWrongQuestions(jeu);
      overlay.remove();
      montrerMenu();
      afficherMissions();
    });
  } else {
    montrerMenu();
    afficherMissions();
  }
});
if (elSuivant) elSuivant.addEventListener("click", () => questionSuivante(lanceurs));

// ── Sélection du genre ────────────────────────────────────────────────────────
document.querySelectorAll(".btn-genre").forEach((btn) => {
  btn.addEventListener("click", () => {
    sauverGenre(btn.dataset.genre);
    majGenre();
    if (!localStorage.getItem(STORAGE_NIVEAU)) {
      montrerClasse();
    } else if (!lireNomRenard()) {
      montrerNommage();
    } else {
      montrerMenu();
      afficherMissions();
    }
  });
});

// ── Changer de profil ─────────────────────────────────────────────────────────
const btnChangerGenre = document.getElementById("btn-changer-genre");
if (btnChangerGenre) {
  btnChangerGenre.addEventListener("click", () => {
    const menu = elMenu || document.getElementById("ecran-menu");
    const genre = elGenre || document.getElementById("ecran-genre");
    if (!menu || !genre) return;
    menu.hidden = true;
    menu.classList.remove("actif");
    revelerEcran(genre);
  });
}

// ── Changer de classe ─────────────────────────────────────────────────────────
const btnChangerClasse = document.getElementById("btn-changer-classe");
if (btnChangerClasse) btnChangerClasse.addEventListener("click", montrerClasse);

// ── Ma Maison ─────────────────────────────────────────────────────────────────
const btnMaison = document.getElementById("btn-maison");
if (btnMaison) btnMaison.addEventListener("click", () => montrerMaison(montrerMenu));

const btnRetourMaison = document.getElementById("btn-retour-maison");
if (btnRetourMaison) btnRetourMaison.addEventListener("click", () => { montrerMenu(); afficherMissions(); });

// ── Dressing ──────────────────────────────────────────────────────────────────
const btnDressing = document.getElementById("btn-dressing");
if (btnDressing) btnDressing.addEventListener("click", montrerDressing);

const btnRetourDressing = document.getElementById("btn-retour-dressing");
if (btnRetourDressing) btnRetourDressing.addEventListener("click", () => {
  const elDressing = document.getElementById("ecran-dressing");
  const elMaison   = document.getElementById("ecran-maison");
  elDressing.hidden = true;
  elDressing.classList.remove("actif");
  montrerMaison(montrerMenu);
});

// ── Modal : passer à la classe suivante ──────────────────────────────────────
const CLASSE_SUIVANTE = { cp: "ce1", ce1: "ce2", ce2: "cm1", cm1: "cm2", cm2: null };
let focusAvantModalClasse = null;

function fermerModalClasse({ retourFocus = true } = {}) {
  const modal = document.getElementById("modal-classe-suivante");
  if (modal) modal.hidden = true;
  if (retourFocus && focusAvantModalClasse) focusAvantModalClasse.focus();
  focusAvantModalClasse = null;
}

window.addEventListener("classe-suivante:ouverte", () => {
  const modal = document.getElementById("modal-classe-suivante");
  if (!modal) return;
  focusAvantModalClasse = document.activeElement;
  piegerFocus(modal);
});

const modalOui = document.getElementById("modal-oui");
if (modalOui) {
  modalOui.addEventListener("click", () => {
    const suivant = CLASSE_SUIVANTE[getNiveauCourant()];
    fermerModalClasse({ retourFocus: false });
    if (suivant) {
      sauverNiveau(suivant);
      confetti();
      const badgeId = suivant;
      if (debloquerBadge(badgeId)) {
        const b = BADGES.find(x => x.id === badgeId);
        if (b) afficherNotifBadge(b);
      }
    }
    montrerMenu();
    afficherMissions();
  });
}

const modalNon = document.getElementById("modal-non");
if (modalNon) {
  modalNon.addEventListener("click", () => {
    fermerModalClasse();
  });
}

// ── Badges screen ─────────────────────────────────────────────────────────────
const btnBadges = document.getElementById("btn-badges");
if (btnBadges) {
  btnBadges.addEventListener("click", () => {
    const ecranBadges = document.getElementById("ecran-badges");
    const grille = document.getElementById("badges-grille");
    const compteur = document.getElementById("badges-compteur");
    document.querySelectorAll(".ecran").forEach(e => { e.hidden = true; e.classList.remove("actif"); });
    revelerEcran(ecranBadges);
    const obtenus = lireBadges();
    compteur.textContent = `${obtenus.length} / ${BADGES.length} trophées`;
    grille.innerHTML = BADGES.map(b => `
      <div class="badge-carte ${obtenus.includes(b.id) ? "obtenu" : "verrouille"}">
        <span class="badge-emoji">${obtenus.includes(b.id) ? b.emoji : "🔒"}</span>
        <div class="badge-nom">${b.nom}</div>
        <div class="badge-desc">${obtenus.includes(b.id) ? b.desc : "???"}</div>
      </div>`).join("");
  });
}

const btnRetourBadges = document.getElementById("btn-retour-badges");
if (btnRetourBadges) {
  btnRetourBadges.addEventListener("click", () => {
    montrerMenu();
    afficherMissions();
  });
}

// ── Streak badges check at startup ───────────────────────────────────────────
{
  const streakCount = streakInit.count || 0;
  const streakBadges = [
    { min: 3,  id: "streak3" },
    { min: 7,  id: "streak7" },
    { min: 30, id: "streak30" },
  ];
  streakBadges.forEach(({ min, id }) => {
    if (streakCount >= min && debloquerBadge(id)) {
      const b = BADGES.find(x => x.id === id);
      if (b) afficherNotifBadge(b);
    }
  });
}

// ── Badge "de retour" après 2 jours d'absence ─────────────────────────────────
{
  const rawStreak = localStorage.getItem("renard-streak");
  if (rawStreak) {
    try {
      const s = JSON.parse(rawStreak);
      if (s.lastVisit) {
        const last = new Date(s.lastVisit);
        const now  = new Date();
        const diffDays = Math.floor((now - last) / 86400000);
        if (diffDays >= 2 && debloquerBadge("retour")) {
          const b = BADGES.find(x => x.id === "retour");
          if (b) afficherNotifBadge(b);
        }
      }
    } catch { /* ignore */ }
  }
}

// ── Partage ───────────────────────────────────────────────────────────────────
function partager() {
  const data = {
    title: "Apprentissage Magique — Jeux Montessori",
    text: "🦊 Des jeux Montessori gratuits pour apprendre en s'amusant, du CP au CM2 !",
    url: "https://apprentissage-magique.fr"
  };
  if (navigator.share) {
    navigator.share(data).catch(() => {});
  } else {
    window.open(
      "https://wa.me/?text=" + encodeURIComponent(data.text + " " + data.url),
      "_blank", "noopener"
    );
  }
}

const btnLandingPartager = document.getElementById("btn-landing-partager");
if (btnLandingPartager) btnLandingPartager.addEventListener("click", partager);

const btnPartagerMenu = document.getElementById("btn-partager");
if (btnPartagerMenu) btnPartagerMenu.addEventListener("click", partager);

// ── RGPD — consentement cookies ───────────────────────────────────────────────
(function () {
  const banner = document.getElementById("banner-rgpd");
  if (!banner) return;

  const consentSauve = localStorage.getItem("rgpd-consent");
  if (!consentSauve) {
    banner.hidden = false;
  } else {
    setAnalyticsConsent(consentSauve);
    if (consentSauve === "accepte") chargerAnalytics();
  }

  const btnAccept = document.getElementById("btn-rgpd-accepter");
  const btnRefuse = document.getElementById("btn-rgpd-refuser");
  if (btnAccept) {
    btnAccept.addEventListener("click", () => {
      setAnalyticsConsent("accepte");
      chargerAnalytics();
      banner.hidden = true;
    });
  }
  if (btnRefuse) {
    btnRefuse.addEventListener("click", () => {
      setAnalyticsConsent("refuse");
      banner.hidden = true;
    });
  }
})();

// ── Mode nuit ─────────────────────────────────────────────────────────────────
const btnTheme = document.getElementById("btn-theme");
if (btnTheme) {
  btnTheme.textContent = localStorage.getItem("theme-nuit") === "1" ? "☀️" : "🌙";
  btnTheme.addEventListener("click", () => {
    const nuit = localStorage.getItem("theme-nuit") !== "1";
    localStorage.setItem("theme-nuit", nuit ? "1" : "0");
    document.documentElement.setAttribute("data-theme", nuit ? "nuit" : "");
    btnTheme.textContent = nuit ? "☀️" : "🌙";
  });
}

// ── Certificat ────────────────────────────────────────────────────────────────
function imprimerCertificat() {
  const nom    = lireNomRenard() || "???";
  const niveau = { cp: "CP", ce1: "CE1", ce2: "CE2", cm1: "CM1", cm2: "CM2" }[getNiveauCourant()] || "CP";
  const etoiles = lireEtoiles();
  const badgesObtenus = lireBadges();
  const nbJeux = Object.keys(lanceurs).filter(j => lireMaitrise(j).some(Boolean)).length;
  const date   = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const badgesHtml = badgesObtenus.slice(0, 15).map(id => {
    const b = BADGES.find(x => x.id === id);
    return b ? `<span title="${b.nom}">${b.emoji}</span>` : "";
  }).join("");

  const el = document.createElement("div");
  el.id = "zone-certificat";
  el.innerHTML = `
    <div class="certificat">
      <div class="cert-header">
        <span class="cert-fox">🦊</span>
        <h1 class="cert-titre">Apprentissage Magique</h1>
        <p class="cert-sous-titre">Certificat de progression</p>
      </div>
      <div class="cert-corps">
        <p class="cert-decerne">Décerné à</p>
        <h2 class="cert-nom">${nom}</h2>
        <p class="cert-classe">Classe de <strong>${niveau}</strong></p>
        <div class="cert-stats">
          <div class="cert-stat"><span class="cert-stat-nb">${etoiles}</span><span class="cert-stat-label">⭐ étoiles</span></div>
          <div class="cert-stat"><span class="cert-stat-nb">${badgesObtenus.length}</span><span class="cert-stat-label">🏅 badges</span></div>
          <div class="cert-stat"><span class="cert-stat-nb">${nbJeux}</span><span class="cert-stat-label">🎮 jeux maîtrisés</span></div>
        </div>
        ${badgesHtml ? `<div class="cert-badges">${badgesHtml}</div>` : ""}
      </div>
      <div class="cert-footer"><p>Le ${date}</p><p>apprentissage-magique.fr</p></div>
    </div>`;
  document.body.appendChild(el);
  window.print();
  el.remove();
}

const btnCertificat = document.getElementById("btn-certificat");
if (btnCertificat) btnCertificat.addEventListener("click", imprimerCertificat);

// ── Sons ──────────────────────────────────────────────────────────────────────
const btnSons = document.getElementById("btn-sons");
if (btnSons) {
  btnSons.textContent = sonsActifs() ? "🔊" : "🔇";
  btnSons.addEventListener("click", () => {
    const on = toggleSons();
    btnSons.textContent = on ? "🔊" : "🔇";
  });
}

// ── Paramètres parents ────────────────────────────────────────────────────────
const btnParams = document.getElementById("btn-params");
if (btnParams) {
  btnParams.addEventListener("click", () => {
    montrerParams(() => { montrerMenu(); afficherMissions(); });
  });
}

// ── Raccourcis clavier ────────────────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea, select")) return;
  if (e.key === " " || e.key === "Enter") {
    const btnSuiv = document.getElementById("btn-suivant");
    if (btnSuiv && !btnSuiv.hidden) {
      e.preventDefault();
      btnSuiv.click();
      return;
    }
  }
  if (["1", "2", "3", "4"].includes(e.key)) {
    const btns = [...document.querySelectorAll("#zone-choix .btn-choix:not(:disabled)")];
    const idx = parseInt(e.key, 10) - 1;
    if (btns[idx]) btns[idx].click();
  }
  if (e.key === "Escape") {
    const modal = document.getElementById("modal-classe-suivante");
    if (modal && !modal.hidden) { fermerModalClasse(); return; }
    const btnRet = document.getElementById("btn-retour");
    if (btnRet && !document.getElementById("ecran-jeu")?.hidden) btnRet.click();
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  }).catch(() => {});
}

setTimeout(garantirUnEcranVisible, 250);
