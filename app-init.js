// app-init.js — point d'entrée : init état, routage écrans, listeners

import {
  elTotal,
  elSousTitre,
  btnRetour,
  elSuivant,
  sauverNiveau,
  lireNomRenard,
  sauverNomRenard,
  lireEtoiles,
  majGenre,
  mettreAJourJauges,
  getNiveauCourant,
  getJeuCourant,
  estGrand,
  getDifficulte,
  lireMaitrise,
  confetti,
  escapeHtml,
  NIVEAUX_LABELS,
  piegerFocus,
  revelerSeulEcran,
  syncPrefsDepuisStockage,
} from "./app-state.js";

import {
  etapeCourante,
  landingDejaVu,
  marquerLandingVu,
  montrerEcranParId,
} from "./app-route.js";

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
  getWrongQuestions,
  clearWrongQuestions,
  entrerRevision,
  synchroniserAffichageMenu,
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

// ── Analytics setup ──────────────────────────────────────────────────────────
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", wait_for_update: 500 });

const GA_ID = "G-5EDQ2KCS8X";
let analyticsCharge = false;
function chargerAnalytics() {
  if (analyticsCharge || document.querySelector(`script[src*="${GA_ID}"]`)) return;
  analyticsCharge = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
}

// ── Lancers map ───────────────────────────────────────────────────────────────
const lanceurs = {
  compte: lancerCompte, addition: lancerAddition, soustraction: lancerSoustraction,
  compare: lancerCompare, suite: lancerSuite, doubles: lancerDoubles,
  heure: lancerHeure, pairimpair: lancerPairImpair, dizaines: lancerDizaines,
  formes: lancerFormes, monnaiecp: lancerMonnaieCp, moitie: lancerMoitie,
  multiplication: lancerMultiplication, division: lancerDivision, fractions: lancerFractions,
  mesures: lancerMesures, monnaiece1: lancerMonnaieCe1, symetrie: lancerSymetrie,
  syllabes: lancerSyllabes, lecture: lancerLecture, anglais: lancerAnglaisMots,
  traduction: lancerTraduction, durees: lancerDurees, probleme: lancerProbleme,
  masse: lancerMasse, perimetre: lancerPerimetre, angles: lancerAngles,
  perlesDorees: lancerPerlesDorees, planche100: lancerPlanche100, sons: lancerSons,
  grammaire: lancerGrammaire, lecturePhrase: lancerLecturePhrase, phraseMobile: lancerPhraseMobile,
  lectureTexte: lancerLectureTexte, aires: lancerAires, decimaux: lancerDecimaux,
  fractionsCM: lancerFractionsCM, proportionnalite: lancerProportionnalite, pourcentages: lancerPourcentages,
  conjugaison: lancerConjugaison, homophones: lancerHomophones, synonymes: lancerSynonymes,
  calendrier: lancerCalendrier, allemand: lancerAllemandMots, traductionAllemand: lancerTraductionAllemand,
  espagnol: lancerEspagnolMots, traductionEspagnol: lancerTraductionEspagnol,
  italien: lancerItalienMots, traductionItalien: lancerTraductionItalien,
  portugais: lancerPortugaisMots, traductionPortugais: lancerTraductionPortugais,
  sequence: lancerSequence, code: lancerCode,
};

// ── Helpers d'écrans ──────────────────────────────────────────────────────────
function montrerClasse() {
  if (!montrerEcranParId("ecran-classe")) return;
  const mascot = document.getElementById("classe-mascotte");
  if (mascot) mascot.innerHTML = svgRenard(getStade(lireEtoiles()), 80, {});
  const diffChoix = document.getElementById("diff-choix");
  if (diffChoix) diffChoix.hidden = true;
  document.querySelectorAll(".btn-classe").forEach(b => b.classList.remove("selectionne"));
}

function entrerMenu() {
  montrerMenu();
  afficherMissions();
}

window.__amRecharger = () => {
  try {
    syncPrefsDepuisStockage();
    syncProfilActif(lireEtoiles(), lireNomRenard(), getNiveauCourant());
    synchroniserAffichageMenu();
    afficherMissions();
  } catch { /* ignore */ }
};

// ── Routeur central : 1 point qui décide quel écran montrer ──────────────────
function routerVersEtape() {
  syncPrefsDepuisStockage();
  const etape = etapeCourante();
  if (etape === "genre") {
    montrerEcranParId("ecran-genre");
    return;
  }
  if (etape === "classe") {
    montrerClasse();
    return;
  }
  if (etape === "nommage") {
    montrerNommage();
    return;
  }
  entrerMenu();
  if (elSousTitre) {
    const nom = lireNomRenard();
    elSousTitre.textContent = estGrand()
      ? `Bon retour, ${nom} !`
      : `${nom} t'attendait ! 🦊`;
    setTimeout(() => majGenre(), 3500);
  }
}

function montrerLandingPuisRouter() {
  const ecranLanding = document.getElementById("ecran-landing");
  if (!ecranLanding || landingDejaVu()) {
    routerVersEtape();
    return;
  }
  revelerSeulEcran(ecranLanding);
  const passer = () => {
    marquerLandingVu();
    routerVersEtape();
  };
  const cta1 = document.getElementById("btn-landing-cta");
  const cta2 = document.getElementById("btn-landing-cta-2");
  if (cta1) cta1.addEventListener("click", passer);
  if (cta2) cta2.addEventListener("click", passer);
}

// ── Sélecteur de profils (multi-comptes) ──────────────────────────────────────
function afficherSelecteurProfils(liste, actifId) {
  const ecran = document.getElementById("ecran-profils");
  const grille = document.getElementById("profils-grille");
  const btnAjout = document.getElementById("btn-ajouter-profil");
  if (!ecran || !grille) {
    sessionStorage.setItem("skip-selector", "1");
    montrerLandingPuisRouter();
    return;
  }
  revelerSeulEcran(ecran);

  grille.innerHTML = liste.map(p => {
    const stade = getStade(p.etoiles || 0);
    return `<button type="button" class="profil-carte${p.id === actifId ? " actif" : ""}" data-id="${p.id}">
      <div class="profil-fox">${svgRenard(stade, 68, {})}</div>
      <span class="profil-nom">${escapeHtml(p.nom || "Renard")}</span>
      <span class="profil-niveau">${NIVEAUX_LABELS[p.niveau || "cp"] || "🌱 CP"}</span>
      <span class="profil-etoiles">⭐ ${p.etoiles || 0}</span>
    </button>`;
  }).join("");

  if (btnAjout) btnAjout.hidden = liste.length >= 4;

  grille.querySelectorAll(".profil-carte").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (id === actifId) {
        sessionStorage.setItem("skip-selector", "1");
        montrerLandingPuisRouter();
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

// ── Initialisation état + premier écran ──────────────────────────────────────
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
} catch { /* ignore */ }
syncProfilActif(lireEtoiles(), lireNomRenard(), getNiveauCourant());

function premierEcran() {
  if (profilsListe.length >= 2 && !sessionStorage.getItem("skip-selector")) {
    afficherSelecteurProfils(profilsListe, profilActifId);
    return;
  }
  sessionStorage.removeItem("skip-selector");
  // L'écran initial est déjà révélé par le mini script inline du HTML.
  // On ne fait que rafraîchir l'affichage menu si on est sur le menu (étoiles, missions).
  syncPrefsDepuisStockage();
  if (etapeCourante() === "menu" && document.getElementById("ecran-menu")?.classList.contains("actif")) {
    entrerMenu();
    if (elSousTitre) {
      const nom = lireNomRenard();
      elSousTitre.textContent = estGrand()
        ? `Bon retour, ${nom} !`
        : `${nom} t'attendait ! 🦊`;
      setTimeout(() => majGenre(), 3500);
    }
  }
}
premierEcran();

// Filet de sécurité unique : si pour une raison X aucun écran n'est visible, route à nouveau
setTimeout(() => {
  if (!document.querySelector(".ecran.actif:not([hidden])")) routerVersEtape();
}, 800);

// Onboarding (genre/classe/diff/nommage/niveau header) entièrement géré par le mini script inline.
// Le module ajoute uniquement l'intro d'histoire après le nommage.
const formNommageMod = document.getElementById("nommage-form");
if (formNommageMod) {
  formNommageMod.addEventListener("submit", () => {
    const inp = document.getElementById("input-nom-renard");
    const nom = ((inp && inp.value) || "").trim().slice(0, 12) || "Foxy";
    sauverNomRenard(nom);
    mettreAJourRenardHeader();
    setTimeout(() => afficherIntroHistoire(nom), 0);
  });
}

// ── Boutons jeux ──────────────────────────────────────────────────────────────
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

document.querySelectorAll(".carte-jeu").forEach(btn => {
  btn.addEventListener("click", () => {
    const jeu = btn.dataset.jeu;
    if (!jeu || typeof lanceurs[jeu] !== "function") return;
    track("game_start", { game_name: jeu, niveau: getNiveauCourant(), difficulte: getDifficulte() });
    montrerJeu(jeu, lanceurs);
  });
});

// ── Navigation jeu ────────────────────────────────────────────────────────────
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
      entrerMenu();
    });
  } else {
    entrerMenu();
  }
});
if (elSuivant) elSuivant.addEventListener("click", () => questionSuivante(lanceurs));

// Changer de genre/classe gérés par le mini script inline.

const btnMaison = document.getElementById("btn-maison");
if (btnMaison) btnMaison.addEventListener("click", () => montrerMaison(entrerMenu));

const btnRetourMaison = document.getElementById("btn-retour-maison");
if (btnRetourMaison) btnRetourMaison.addEventListener("click", entrerMenu);

const btnDressing = document.getElementById("btn-dressing");
if (btnDressing) btnDressing.addEventListener("click", montrerDressing);

const btnRetourDressing = document.getElementById("btn-retour-dressing");
if (btnRetourDressing) btnRetourDressing.addEventListener("click", () => montrerMaison(entrerMenu));

// ── Modal classe suivante ────────────────────────────────────────────────────
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
      if (debloquerBadge(suivant)) {
        const b = BADGES.find(x => x.id === suivant);
        if (b) afficherNotifBadge(b);
      }
    }
    entrerMenu();
  });
}
const modalNon = document.getElementById("modal-non");
if (modalNon) modalNon.addEventListener("click", () => fermerModalClasse());

// ── Badges screen ─────────────────────────────────────────────────────────────
const btnBadges = document.getElementById("btn-badges");
if (btnBadges) {
  btnBadges.addEventListener("click", () => {
    const ecranBadges = document.getElementById("ecran-badges");
    const grille = document.getElementById("badges-grille");
    const compteur = document.getElementById("badges-compteur");
    if (!ecranBadges) return;
    revelerSeulEcran(ecranBadges);
    const obtenus = lireBadges();
    if (compteur) compteur.textContent = `${obtenus.length} / ${BADGES.length} trophées`;
    if (grille) grille.innerHTML = BADGES.map(b => `
      <div class="badge-carte ${obtenus.includes(b.id) ? "obtenu" : "verrouille"}">
        <span class="badge-emoji">${obtenus.includes(b.id) ? b.emoji : "🔒"}</span>
        <div class="badge-nom">${b.nom}</div>
        <div class="badge-desc">${obtenus.includes(b.id) ? b.desc : "???"}</div>
      </div>`).join("");
  });
}
const btnRetourBadges = document.getElementById("btn-retour-badges");
if (btnRetourBadges) btnRetourBadges.addEventListener("click", entrerMenu);

// ── Streak / "de retour" badges ──────────────────────────────────────────────
{
  const streakCount = streakInit.count || 0;
  [
    { min: 3, id: "streak3" },
    { min: 7, id: "streak7" },
    { min: 30, id: "streak30" },
  ].forEach(({ min, id }) => {
    if (streakCount >= min && debloquerBadge(id)) {
      const b = BADGES.find(x => x.id === id);
      if (b) afficherNotifBadge(b);
    }
  });
}
{
  const rawStreak = localStorage.getItem("renard-streak");
  if (rawStreak) {
    try {
      const s = JSON.parse(rawStreak);
      if (s.lastVisit) {
        const last = new Date(s.lastVisit);
        const diffDays = Math.floor((Date.now() - last) / 86400000);
        if (diffDays >= 2 && debloquerBadge("retour")) {
          const b = BADGES.find(x => x.id === "retour");
          if (b) afficherNotifBadge(b);
        }
      }
    } catch { /* ignore */ }
  }
}

// Partage géré par le mini script inline (fonctionne même sans modules ES).

// ── Profils header ────────────────────────────────────────────────────────────
const btnProfilsHeader = document.getElementById("btn-profils-header");
if (btnProfilsHeader) {
  if (profilsListe.length >= 2) btnProfilsHeader.hidden = false;
  btnProfilsHeader.addEventListener("click", () => {
    afficherSelecteurProfils(getProfils(), profilActifId);
  });
}

// RGPD : boutons gérés par mini script inline. Le module se contente de synchroniser
// l'analytics (chargement GA + flag consent) avec le choix déjà persisté.
{
  const consentSauve = localStorage.getItem("rgpd-consent");
  if (consentSauve) {
    setAnalyticsConsent(consentSauve);
    if (consentSauve === "accepte") chargerAnalytics();
  }
  window.addEventListener("storage", (ev) => {
    if (ev.key !== "rgpd-consent" || !ev.newValue) return;
    setAnalyticsConsent(ev.newValue);
    if (ev.newValue === "accepte") chargerAnalytics();
  });
}

// Sons : bouton géré par inline (toggle localStorage "sons-actifs") ; module aligne app-sons.
const btnSonsMod = document.getElementById("btn-sons");
if (btnSonsMod) {
  btnSonsMod.addEventListener("click", () => {
    const veutOn = localStorage.getItem("sons-actifs") !== "0";
    if (sonsActifs() !== veutOn) toggleSons();
  });
}

// ── Paramètres parents ────────────────────────────────────────────────────────
const btnParams = document.getElementById("btn-params");
if (btnParams) btnParams.addEventListener("click", () => montrerParams(entrerMenu));

// ── Certificat imprimable ────────────────────────────────────────────────────
function imprimerCertificat() {
  const nom = lireNomRenard() || "???";
  const niveau = { cp: "CP", ce1: "CE1", ce2: "CE2", cm1: "CM1", cm2: "CM2" }[getNiveauCourant()] || "CP";
  const etoiles = lireEtoiles();
  const badgesObtenus = lireBadges();
  const nbJeux = Object.keys(lanceurs).filter(j => lireMaitrise(j).some(Boolean)).length;
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
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

// ── Service worker cleanup (legacy) ───────────────────────────────────────────
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(regs => regs.forEach(r => r.unregister()))
    .catch(() => {});
}

// ── Analytics : début / fin de session ───────────────────────────────────────
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

window.__amModuleReady = true;
