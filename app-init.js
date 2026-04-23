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
  syncNiveauButtons,
  majLabelsMenu,
  majGenre,
  mettreAJourJauges,
  setBadgeVisible,
  getNiveauCourant,
  getJeuCourant,
  estCE2,
} from "./app-state.js";

import {
  mettreAJourRenardHeader,
  montrerNommage,
  mettreAJourStreak,
  afficherStreakHeader,
  montrerMaison,
  montrerDressing,
} from "./app-renard.js";

import {
  montrerMenu,
  montrerJeu,
  questionSuivante,
  resetFeedback,
} from "./app-nav.js";

import { lancerCompte, lancerAddition, lancerSoustraction, lancerCompare, lancerSuite, lancerDoubles, lancerMoitie, lancerDizaines, lancerPairImpair } from "./games-maths.js";
import { lancerFormes, lancerFractions, lancerSymetrie, lancerPerimetre, lancerAngles } from "./games-formes.js";
import { lancerHeure, lancerDurees, lancerMesures, lancerMasse } from "./games-temps.js";
import { lancerMonnaieCp, lancerMonnaieCe1 } from "./games-argent.js";
import { lancerMultiplication, lancerDivision, lancerProbleme } from "./games-avance.js";
import { lancerSyllabes, lancerLecture, lancerAnglaisMots, lancerTraduction } from "./games-langage.js";

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
};

// ── Initialisation ────────────────────────────────────────────────────────────
elTotal.textContent = lireEtoiles();
syncNiveauButtons();
majLabelsMenu();
mettreAJourJauges();
mettreAJourRenardHeader();
const streakInit = mettreAJourStreak();
afficherStreakHeader(streakInit.count);

// ── Démarrage ─────────────────────────────────────────────────────────────────
if (!lireNomRenard()) {
  montrerNommage();
} else if (localStorage.getItem("maths-cp-genre")) {
  majGenre();
  montrerMenu();
  const nom = lireNomRenard();
  if (elSousTitre) {
    elSousTitre.textContent = `${nom} t'attendait ! 🦊`;
    setTimeout(() => majGenre(), 3500);
  }
}
// Sinon : #ecran-genre déjà actif dans le HTML

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
    elGenre.hidden = false;
    elGenre.classList.add("actif");
    mettreAJourRenardHeader();
  });
}

// ── Boutons niveau ────────────────────────────────────────────────────────────
document.querySelectorAll(".niveau-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const n = btn.dataset.niveau;
    if (n === getNiveauCourant()) return;
    sauverNiveau(n);
    syncNiveauButtons();
    majLabelsMenu();
    const jeu = getJeuCourant();
    if (jeu) {
      setBadgeVisible(true);
      resetFeedback();
      if (lanceurs[jeu]) lanceurs[jeu]();
    }
  });
});

// ── Boutons jeux ──────────────────────────────────────────────────────────────
document.querySelectorAll(".carte-jeu").forEach((btn) => {
  btn.addEventListener("click", () => montrerJeu(btn.dataset.jeu, lanceurs));
});

// ── Navigation ────────────────────────────────────────────────────────────────
btnRetour.addEventListener("click", montrerMenu);
elSuivant.addEventListener("click", () => questionSuivante(lanceurs));

// ── Sélection du genre ────────────────────────────────────────────────────────
document.querySelectorAll(".btn-genre").forEach((btn) => {
  btn.addEventListener("click", () => {
    sauverGenre(btn.dataset.genre);
    montrerMenu();
  });
});

// ── Changer de profil ─────────────────────────────────────────────────────────
const btnChangerGenre = document.getElementById("btn-changer-genre");
if (btnChangerGenre) {
  btnChangerGenre.addEventListener("click", () => {
    elMenu.hidden = true;
    elMenu.classList.remove("actif");
    elGenre.hidden = false;
    elGenre.classList.add("actif");
  });
}

// ── Ma Maison ─────────────────────────────────────────────────────────────────
const btnMaison = document.getElementById("btn-maison");
if (btnMaison) btnMaison.addEventListener("click", () => montrerMaison(montrerMenu));

const btnRetourMaison = document.getElementById("btn-retour-maison");
if (btnRetourMaison) btnRetourMaison.addEventListener("click", montrerMenu);

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
