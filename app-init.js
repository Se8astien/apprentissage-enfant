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
  estCE2,
  STORAGE_NIVEAU,
  getDifficulte,
  setDifficulte,
  getDiffLabel,
  lireMaitrise,
  confetti,
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
import { lancerHeure, lancerDurees, lancerMesures, lancerMasse } from "./games-temps.js";
import { lancerMonnaieCp, lancerMonnaieCe1 } from "./games-argent.js";
import { lancerMultiplication, lancerDivision, lancerProbleme, lancerFractionsCM, lancerProportionnalite } from "./games-avance.js";
import { lancerSyllabes, lancerLecture, lancerAnglaisMots, lancerTraduction, lancerSons, lancerGrammaire, lancerLecturePhrase, lancerPhraseMobile, lancerLectureTexte, lancerConjugaison } from "./games-langage.js";

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
  conjugaison:    lancerConjugaison,
};

// ── Classe screen ─────────────────────────────────────────────────────────────
const ecranClasse = document.getElementById("ecran-classe");
const btnClasse = document.querySelectorAll(".btn-classe");

function montrerClasse() {
  document.querySelectorAll(".ecran").forEach(e => { e.hidden = true; e.classList.remove("actif"); });
  ecranClasse.hidden = false;
  ecranClasse.classList.add("actif");
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

// ── Initialisation ────────────────────────────────────────────────────────────
elTotal.textContent = lireEtoiles();
majGenre();
mettreAJourJauges();
mettreAJourRenardHeader();
const streakInit = mettreAJourStreak();
afficherStreakHeader(streakInit.count);

// ── Démarrage ─────────────────────────────────────────────────────────────────
if (!localStorage.getItem("maths-cp-genre")) {
  elGenre.hidden = false;
  elGenre.classList.add("actif");
} else if (!localStorage.getItem(STORAGE_NIVEAU)) {
  montrerClasse();
} else if (!lireNomRenard()) {
  montrerNommage();
} else {
  montrerMenu();
  afficherMissions();
  if (elSousTitre) {
    const nom = lireNomRenard();
    elSousTitre.textContent = `${nom} t'attendait ! 🦊`;
    setTimeout(() => majGenre(), 3500);
  }
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
    montrerMenu();
    afficherMissions();
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
  btn.addEventListener("click", () => montrerJeu(btn.dataset.jeu, lanceurs));
});

// ── Navigation ────────────────────────────────────────────────────────────────
btnRetour.addEventListener("click", () => { montrerMenu(); afficherMissions(); });
elSuivant.addEventListener("click", () => questionSuivante(lanceurs));

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
    elMenu.hidden = true;
    elMenu.classList.remove("actif");
    elGenre.hidden = false;
    elGenre.classList.add("actif");
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

const modalOui = document.getElementById("modal-oui");
if (modalOui) {
  modalOui.addEventListener("click", () => {
    const suivant = CLASSE_SUIVANTE[getNiveauCourant()];
    const modal = document.getElementById("modal-classe-suivante");
    if (modal) modal.hidden = true;
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
    const modal = document.getElementById("modal-classe-suivante");
    if (modal) modal.hidden = true;
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
    ecranBadges.hidden = false;
    ecranBadges.classList.add("actif");
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
