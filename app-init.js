// app-init.js — point d'entrée : init état, routage écrans, listeners

import {
  elTotal,
  elSousTitre,
  btnRetour,
  elSuivant,
  sauverNiveau,
  sauverGenre,
  setDifficulte,
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
  STORAGE_THEME_NUIT,
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
  brancherBoutonChronoMenu,
  majUiBoutonChrono,
  proposerRevisionSiErreurs,
} from "./app-nav.js";

import {
  afficherMissions,
  debloquerBadge,
  afficherNotifBadge,
  BADGES,
  lireBadges,
  getMessageRecompenseDifferee,
} from "./app-gamification.js";

import { afficherIntroHistoire } from "./app-histoire.js";
import { LISTE_IDS_JEUX, assurerLanceurDansMap } from "./games-registry.js";
import {
  track,
  setAnalyticsConsent,
  flushAnalyticsQueue,
  chargerTagAnalytics,
  CONSENT_KEY,
} from "./app-analytics.js";
import { toggleSons, sonsActifs } from "./app-sons.js";
import { initProfils, getProfils, basculerProfil, creerProfil, syncProfilActif } from "./app-profils.js";
import { montrerParams } from "./app-params.js";
import { rafraichirUiComplete } from "./app-sync-ui.js";
import { stockageGet, stockageSet } from "./app-stockage.js";
import {
  initAventure,
  montrerAventure,
  consommerRetourDepuisAventure,
  rafraichirAventureSiOuverte,
} from "./app-aventure.js";
import { chargerQueteActive } from "./app-quests.js";
import { evaluerBadges } from "./app-social-badges.js";
import { initialiserArbresCompetences } from "./app-skill-trees.js";
import { initialiserAudio } from "./app-audio-mode.js";
import { calculerStatistiquesEnfant } from "./app-parent-dashboard-features.js";
import { initFunMenuBar, accueillirWeekEndSiMenu } from "./app-fun-menu.js";
import { afficherMenuHome } from "./app-menu-home.js";
import { afficherParentDashboard } from "./app-parent-dashboard.js";
import { afficherTableauBordProfesseur } from "./app-teacher-dashboard.js";
import "./mobile-utils.js";
import { initAnalyticsTracking } from "./app-analytics-tracking.js";
import { afficherCalendrierMenu } from "./app-calendrier.js";
import { afficherObjectifMenu, progresserObjectif } from "./app-objectif-semaine.js";
import { afficherDefiMenu, progresserDefi } from "./app-defi-parents.js";

const lanceurs = {};

window.__amModuleReady = false;

function uneFois(el, evt, fn) {
  if (!el || el.dataset.amBound === "1") return;
  el.dataset.amBound = "1";
  el.addEventListener(evt, fn);
  if (evt === "click") {
    el.addEventListener("touchend", (e) => {
      e.preventDefault();
      fn(e);
    });
  }
}

function idEcranOnboarding() {
  if (!landingDejaVu()) return "ecran-landing";
  const etape = etapeCourante();
  if (etape === "genre") return "ecran-genre";
  if (etape === "classe") return "ecran-classe";
  if (etape === "nommage") return "ecran-nommage";
  return "ecran-menu";
}

window.__amRecharger = rafraichirUiComplete;

// -- Helpers d'ecrans
function montrerClasse() {
  if (!montrerEcranParId("ecran-classe")) return;
  const mascot = document.getElementById("classe-mascotte");
  if (mascot) mascot.innerHTML = svgRenard(getStade(lireEtoiles()), 80, {});
  const diffChoix = document.getElementById("diff-choix");
  if (diffChoix) diffChoix.hidden = true;
  const btnRapide = document.getElementById("btn-classe-rapide");
  if (btnRapide) btnRapide.hidden = true;
  document.querySelectorAll(".btn-classe").forEach(b => b.classList.remove("selectionne"));
}

function _verifierRevisionDemain() {
  try {
    const data = JSON.parse(localStorage.getItem("am-revision-demain") || "null");
    if (!data) return;
    const hier = new Date();
    hier.setDate(hier.getDate() - 1);
    const dateHier = hier.toISOString().slice(0, 10);
    if (data.date !== dateHier) return;
    const noms = (data.jeux || []).map((j) => {
      const carte = document.querySelector(`.carte-jeu[data-jeu="${j}"] .nom-jeu`);
      return carte?.textContent?.trim() || j;
    }).join(", ");
    if (!noms) return;
    setTimeout(() => {
      import("./app-nav.js").then((m) => {
        if (typeof m.afficherToastSimple === "function") {
          m.afficherToastSimple("🔁 Révision du jour", `Hier tu avais du mal avec : ${noms}. On reessaie ?`);
        }
      });
    }, 1500);
  } catch { /* ignore */ }
}

function _afficherRecompenseDifferee() {
  try {
    const msg = getMessageRecompenseDifferee?.();
    if (!msg) return;
    setTimeout(() => {
      import("./app-nav.js").then((m) => {
        if (typeof m.afficherToastSimple === "function") {
          m.afficherToastSimple("✨ Presque !", msg);
        }
      });
    }, 3000);
  } catch { /* ignore */ }
}

function entrerMenu() {
  montrerMenu();
  afficherMissions();
  accueillirWeekEndSiMenu();
  afficherCalendrierMenu();
  afficherObjectifMenu();
  afficherDefiMenu();
  _verifierRevisionDemain();
  _afficherRecompenseDifferee();
}

// -- Routeur central : 1 point qui decide quel ecran montrer
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
      : `${nom} t'attendait ! \u{1F98A}`;
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
  [cta1, cta2].forEach((el) => {
    if (!el || el.dataset.amBound === "1") return;
    el.addEventListener("click", passer);
  });
}

function brancherOnboardingUI() {
  try {
    const bnr0 = document.getElementById("banner-rgpd");
    if (bnr0 && !stockageGet(CONSENT_KEY)) bnr0.hidden = false;
  } catch { /* ignore */ }

  montrerEcranParId(idEcranOnboarding());

  ["btn-landing-cta", "btn-landing-cta-2"].forEach((id) => {
    const el = document.getElementById(id);
    uneFois(el, "click", () => {
      marquerLandingVu();
      routerVersEtape();
    });
  });

  document.querySelectorAll(".btn-genre").forEach((btn) => {
    uneFois(btn, "click", () => {
      const g = btn.getAttribute("data-genre");
      if (!g) return;
      sauverGenre(g);
      routerVersEtape();
    });
  });

  const bClasse = document.querySelectorAll(".btn-classe");
  bClasse.forEach((btn) => {
    uneFois(btn, "click", () => {
      const nv = btn.getAttribute("data-niveau");
      if (!nv) return;
      sauverNiveau(nv);
      bClasse.forEach((b) => b.classList.toggle("selectionne", b === btn));
      const diffEl = document.getElementById("diff-choix");
      if (diffEl) {
        diffEl.hidden = false;
        try { diffEl.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch { /* ignore */ }
      }
      const btnRapide = document.getElementById("btn-classe-rapide");
      if (btnRapide) btnRapide.hidden = false;
      rajusterJeuxParNiveau();
    });
  });

  const btnClasseRapide = document.getElementById("btn-classe-rapide");
  uneFois(btnClasseRapide, "click", () => {
    const btnSel = document.querySelector(".btn-classe.selectionne");
    const nv = btnSel ? btnSel.getAttribute("data-niveau") : null;
    if (!nv) return;
    sauverNiveau(nv);
    setDifficulte(1);
    rajusterJeuxParNiveau();
    routerVersEtape();
  });

  document.querySelectorAll(".btn-diff").forEach((btn) => {
    uneFois(btn, "click", () => {
      let d = parseInt(btn.getAttribute("data-diff") || "1", 10);
      if (Number.isNaN(d)) d = 1;
      setDifficulte(Math.max(0, Math.min(2, d)));
      routerVersEtape();
    });
  });

  const modalClasse = document.getElementById("menu-classe-modal");
  const fermerClasse = () => {
    if (modalClasse) modalClasse.hidden = true;
  };

  document.querySelectorAll(".niveau-btn").forEach((btn) => {
    uneFois(btn, "click", () => {
      const nv = btn.getAttribute("data-niveau");
      if (!nv) return;
      sauverNiveau(nv);
      rajusterJeuxParNiveau();
      rafraichirUiComplete();
      rafraichirAventureSiOuverte();
      fermerClasse();
    });
  });

  const formNom = document.getElementById("nommage-form");
  uneFois(formNom, "submit", (ev) => {
    ev.preventDefault();
    const inp = document.getElementById("input-nom-renard");
    const nom = ((inp && inp.value) || "").trim().slice(0, 12) || "Foxy";
    sauverNomRenard(nom);
    mettreAJourRenardHeader();
    routerVersEtape();
    setTimeout(() => afficherIntroHistoire(nom), 0);
    rafraichirUiComplete();
  });

  const bnr = document.getElementById("banner-rgpd");
  uneFois(document.getElementById("btn-rgpd-accepter"), "click", () => {
    setAnalyticsConsent("accepte");
    chargerTagAnalytics();
    if (bnr) bnr.hidden = true;
  });
  uneFois(document.getElementById("btn-rgpd-refuser"), "click", () => {
    setAnalyticsConsent("refuse");
    if (bnr) bnr.hidden = true;
  });

  function syncUiTheme(btn) {
    const nuit = stockageGet(STORAGE_THEME_NUIT) === "1";
    btn.textContent = nuit ? "☀️" : "\u{1F319}";
    btn.setAttribute("aria-pressed", nuit ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      nuit ? "Mode nuit actif — passer en mode jour clair" : "Activer le mode nuit (ecran plus doux)",
    );
  }

  function syncUiSons(btn) {
    const on = sonsActifs();
    btn.textContent = on ? "\u{1F50A}" : "\u{1F507}";
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.classList.toggle("header-tool-sons-muet", !on);
    btn.setAttribute(
      "aria-label",
      on ? "Sons actives — appuie pour couper les bruits du jeu" : "Sons coupes — appuie pour les rallumer",
    );
  }

  const btnTheme = document.getElementById("btn-theme");
  if (btnTheme) {
    syncUiTheme(btnTheme);
    uneFois(btnTheme, "click", () => {
      const nuit = stockageGet(STORAGE_THEME_NUIT) !== "1";
      stockageSet(STORAGE_THEME_NUIT, nuit ? "1" : "0");
      document.documentElement.setAttribute("data-theme", nuit ? "nuit" : "");
      syncUiTheme(btnTheme);
    });
  }

  const btnSonsBar = document.getElementById("btn-sons");
  if (btnSonsBar) {
    syncUiSons(btnSonsBar);
    uneFois(btnSonsBar, "click", () => {
      toggleSons();
      syncUiSons(btnSonsBar);
    });
  }

  function partager() {
    const data = {
      title: "Apprentissage Magique — Jeux Montessori",
      text: "\u{1F98A} Des jeux Montessori gratuits pour apprendre en s'amusant, du CP au CM2 !",
      url: "https://apprentissage-magique.fr",
    };
    if (navigator.share) {
      navigator.share(data).catch(() => {});
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`,
        "_blank",
        "noopener"
      );
    }
  }
  uneFois(document.getElementById("btn-landing-partager"), "click", partager);
  uneFois(document.getElementById("btn-partager"), "click", partager);

  const ouvrirClasse = () => {
    if (!modalClasse) return;
    modalClasse.hidden = false;
    const focus = document.getElementById("btn-changer-rythme");
    if (focus) focus.focus();
  };
  uneFois(document.getElementById("btn-classe-menu"), "click", ouvrirClasse);
  uneFois(document.getElementById("btn-fermer-classe-modal"), "click", fermerClasse);
  if (modalClasse && modalClasse.dataset.amBound !== "1") {
    modalClasse.dataset.amBound = "1";
    modalClasse.addEventListener("click", (ev) => {
      if (ev.target === modalClasse) fermerClasse();
    });
  }
  uneFois(document.getElementById("btn-changer-rythme"), "click", () => {
    const prochain = (getDifficulte() + 1) % 3;
    setDifficulte(prochain);
    rafraichirUiComplete();
  });

  uneFois(document.getElementById("btn-changer-genre"), "click", () => {
    montrerEcranParId("ecran-genre");
  });

  setTimeout(() => {
    if (window.__amModuleReady) return;
    document.querySelectorAll(".carte-jeu[data-jeu]").forEach((btn) => {
      uneFois(btn, "click", () => {
        alert("Les jeux ne se chargent pas en local (file://). Lance un serveur, par exemple :\n\n  python3 -m http.server 8000\n\npuis ouvre http://localhost:8000");
      });
    });
  }, 1500);

  window.addEventListener("error", (ev) => {
    try {
      const src = ev && ev.filename ? String(ev.filename) : "";
      if (src.includes("app-") || src.includes("games-")) {
        console.error("[Apprentissage] erreur dans", src, ev && ev.message);
      }
    } catch { /* ignore */ }
  });
}

initAventure({
  montrerJeu,
  assurerLanceurDansMap,
  lanceurs,
  entrerMenu,
});

brancherOnboardingUI();
brancherBoutonChronoMenu();
majUiBoutonChrono();

// -- Selecteur de profils (multi-comptes)
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
      <span class="profil-niveau">${NIVEAUX_LABELS[p.niveau || "cp"] || "\u{1F331} CP"}</span>
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

// -- Initialisation etat + premier ecran
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

// Appliquer les préférences d'accessibilité au démarrage
if (localStorage.getItem("am-mode-dyslexie") === "1") document.body.classList.add("mode-dyslexie");
if (localStorage.getItem("am-mode-daltonisme") === "1") document.body.classList.add("mode-daltonisme");

function premierEcran() {
  if (profilsListe.length >= 2 && !sessionStorage.getItem("skip-selector")) {
    afficherSelecteurProfils(profilsListe, profilActifId);
    return;
  }
  sessionStorage.removeItem("skip-selector");
  syncPrefsDepuisStockage();
  if (etapeCourante() === "menu" && document.getElementById("ecran-menu")?.classList.contains("actif")) {
    entrerMenu();
    if (elSousTitre) {
      const nom = lireNomRenard();
      elSousTitre.textContent = estGrand()
        ? `Bon retour, ${nom} !`
        : `${nom} t'attendait ! \u{1F98A}`;
      setTimeout(() => majGenre(), 3500);
    }
  }
}
premierEcran();

// Filet de securite : si aucun ecran n'est visible, route a nouveau
setTimeout(() => {
  if (!document.querySelector(".ecran.actif:not([hidden])")) routerVersEtape();
}, 800);

// -- Boutons jeux
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

function rajusterJeuxParNiveau() {
  const niveauCourant = getNiveauCourant();
  if (!niveauCourant) {
    document.querySelectorAll(".carte-jeu[data-niveaux]").forEach(btn => {
      btn.hidden = false;
    });
    return;
  }
  document.querySelectorAll(".carte-jeu[data-niveaux]").forEach(btn => {
    const niveaux = (btn.dataset.niveaux || "").split(/\s+/).filter(Boolean);
    const estDisponible = niveaux.includes(niveauCourant);
    btn.hidden = !estDisponible;
  });
}

majEtoilesMaitrise();
rajusterJeuxParNiveau();

document.querySelectorAll(".carte-jeu").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const jeu = btn.dataset.jeu;
    if (!jeu) return;
    const ok = await assurerLanceurDansMap(jeu, lanceurs);
    if (!ok || typeof lanceurs[jeu] !== "function") return;
    track("game_start", { game_name: jeu, niveau: getNiveauCourant(), difficulte: getDifficulte() });
    montrerJeu(jeu, lanceurs);
    window._jeuActifId = jeu;
  });
});

initFunMenuBar({ montrerJeu, assurerLanceurDansMap, lanceurs });

const btnAventure = document.getElementById("btn-aventure");
if (btnAventure) {
  btnAventure.addEventListener("click", () => {
    track("aventure_from_menu", { niveau: getNiveauCourant() });
    montrerAventure();
  });
}

function retourDepuisJeuVersMenuOuAventure() {
  if (consommerRetourDepuisAventure()) {
    montrerAventure();
    return;
  }
  entrerMenu();
}

function gererRetourJeu() {
  const jeu = getJeuCourant();
  const wrongs = getWrongQuestions(jeu);
  track("game_exit", {
    game_name: jeu || "",
    niveau: getNiveauCourant(),
    wrong_count: wrongs.length,
    revision_prompted: wrongs.length > 0,
  });
  if (proposerRevisionSiErreurs(jeu, retourDepuisJeuVersMenuOuAventure)) {
    return;
  }
  retourDepuisJeuVersMenuOuAventure();
}

// -- Navigation jeu
if (btnRetour) btnRetour.addEventListener("click", gererRetourJeu);
const btnRetourBas = document.getElementById("btn-retour-bas");
if (btnRetourBas) btnRetourBas.addEventListener("click", gererRetourJeu);
if (elSuivant) elSuivant.addEventListener("click", () => questionSuivante(lanceurs));

const btnMaison = document.getElementById("btn-maison");
if (btnMaison) btnMaison.addEventListener("click", () => montrerMaison(entrerMenu));

const btnRetourMaison = document.getElementById("btn-retour-maison");
if (btnRetourMaison) btnRetourMaison.addEventListener("click", entrerMenu);

const btnDressing = document.getElementById("btn-dressing");
if (btnDressing) btnDressing.addEventListener("click", montrerDressing);

const btnRetourDressing = document.getElementById("btn-retour-dressing");
if (btnRetourDressing) btnRetourDressing.addEventListener("click", () => montrerMaison(entrerMenu));

// -- Modal classe suivante
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
      confetti({ tier: "burst" });
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

// -- Badges screen
const btnBadges = document.getElementById("btn-badges");
if (btnBadges) {
  btnBadges.addEventListener("click", () => {
    const ecranBadges = document.getElementById("ecran-badges");
    const grille = document.getElementById("badges-grille");
    const compteur = document.getElementById("badges-compteur");
    if (!ecranBadges) return;
    revelerSeulEcran(ecranBadges);
    const obtenus = lireBadges();
    if (compteur) compteur.textContent = `${obtenus.length} / ${BADGES.length} trophees`;
    if (grille) grille.innerHTML = BADGES.map(b => `
      <div class="badge-carte ${obtenus.includes(b.id) ? "obtenu" : "verrouille"}">
        <span class="badge-emoji">${obtenus.includes(b.id) ? b.emoji : "\u{1F512}"}</span>
        <div class="badge-nom">${b.nom}</div>
        <div class="badge-desc">${obtenus.includes(b.id) ? b.desc : "???"}</div>
      </div>`).join("");
  });
}
const btnRetourBadges = document.getElementById("btn-retour-badges");
if (btnRetourBadges) btnRetourBadges.addEventListener("click", entrerMenu);

// -- Streak / "de retour" badges
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

// -- Profils header
const btnProfilsHeader = document.getElementById("btn-profils-header");
if (btnProfilsHeader) {
  if (profilsListe.length >= 2) btnProfilsHeader.hidden = false;
  btnProfilsHeader.addEventListener("click", () => {
    afficherSelecteurProfils(getProfils(), profilActifId);
  });
}

{
  const consentSauve = stockageGet(CONSENT_KEY);
  if (consentSauve) {
    setAnalyticsConsent(consentSauve);
    if (consentSauve === "accepte") chargerTagAnalytics();
  }
  window.addEventListener("storage", (ev) => {
    if (ev.key !== CONSENT_KEY || !ev.newValue) return;
    setAnalyticsConsent(ev.newValue);
    if (ev.newValue === "accepte") chargerTagAnalytics();
  });
}

// -- Parametres parents
const btnParams = document.getElementById("btn-params");
if (btnParams) btnParams.addEventListener("click", () => montrerParams(entrerMenu));

// -- Menu d'accueil (home menu)
function afficherMenuHomeScreen() {
  const elMenuHome = document.getElementById("ecran-menu-home");
  if (elMenuHome) {
    revelerSeulEcran(elMenuHome);
    afficherMenuHome();
  }
}

const btnMenuHome = document.getElementById("btn-maison-menu");
if (btnMenuHome) btnMenuHome.addEventListener("click", afficherMenuHomeScreen);

// -- Tableau de bord parent
function afficherParentDashboardScreen() {
  const elParentDash = document.getElementById("ecran-parent-dashboard");
  if (elParentDash) {
    revelerSeulEcran(elParentDash);
    afficherParentDashboard();
  }
}

const btnParentMenu = document.getElementById("btn-parent-menu");
if (btnParentMenu) btnParentMenu.addEventListener("click", afficherParentDashboardScreen);

// -- Tableau de bord professeur
function afficherTeacherDashboardScreen() {
  const elTeacherDash = document.getElementById("ecran-teacher-dashboard");
  if (elTeacherDash) {
    revelerSeulEcran(elTeacherDash);
    afficherTableauBordProfesseur();
  }
}

const btnTeacherMenu = document.getElementById("btn-teacher-menu");
if (btnTeacherMenu) btnTeacherMenu.addEventListener("click", afficherTeacherDashboardScreen);

// -- Certificat imprimable
function imprimerCertificat() {
  const nom = lireNomRenard() || "???";
  const niveau = { cp: "CP", ce1: "CE1", ce2: "CE2", cm1: "CM1", cm2: "CM2" }[getNiveauCourant()] || "CP";
  const etoiles = lireEtoiles();
  const badgesObtenus = lireBadges();
  const nbJeux = LISTE_IDS_JEUX.filter((j) => lireMaitrise(j).some(Boolean)).length;
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
        <span class="cert-fox">\u{1F98A}</span>
        <h1 class="cert-titre">Apprentissage Magique</h1>
        <p class="cert-sous-titre">Certificat de progression</p>
      </div>
      <div class="cert-corps">
        <p class="cert-decerne">Decerne a</p>
        <h2 class="cert-nom">${nom}</h2>
        <p class="cert-classe">Classe de <strong>${niveau}</strong></p>
        <div class="cert-stats">
          <div class="cert-stat"><span class="cert-stat-nb">${etoiles}</span><span class="cert-stat-label">⭐ etoiles</span></div>
          <div class="cert-stat"><span class="cert-stat-nb">${badgesObtenus.length}</span><span class="cert-stat-label">\u{1F3C5} badges</span></div>
          <div class="cert-stat"><span class="cert-stat-nb">${nbJeux}</span><span class="cert-stat-label">\u{1F3AE} jeux maitrise</span></div>
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
const btnCertificatMenu = document.getElementById("btn-certificat-menu");
if (btnCertificatMenu) btnCertificatMenu.addEventListener("click", imprimerCertificat);

// -- Raccourcis clavier
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

// -- Service worker cleanup (legacy)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(regs => regs.forEach(r => r.unregister()))
    .catch(() => {});
}

// -- Analytics : debut / fin de session
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
chargerQueteActive();
initialiserArbresCompetences();
initialiserAudio();
window.addEventListener("beforeunload", trackSessionEnd);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") trackSessionEnd();
});

// Brancher la progression des objectifs lors des bonnes réponses
document.addEventListener("am:bonneReponse", (e) => {
  const jeu = e.detail?.jeu || window._jeuActifId;
  if (jeu) {
    progresserObjectif(jeu);
    progresserDefi(jeu);
  }
});

window.__amModuleReady = true;
