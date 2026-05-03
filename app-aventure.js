import {
  revelerSeulEcran,
  getNiveauCourant,
  getDifficulte,
  NIVEAU,
  lireEtatAventure,
  sauverEtatAventure,
} from "./app-state.js";
import { track } from "./app-analytics.js";

const SS_RETOUR = "am-aventure-retour";
const SS_INDEX = "am-aventure-case-index";

const CHEMIN_BASE = [
  "compte",
  "addition",
  "formes",
  "suite",
  "calendrier",
  "sequence",
  "syllabes",
  "lecture",
  "monnaiecp",
  "heure",
  "mesures",
  "multiplication",
  "probleme",
  "grammaire",
  "anglais",
  "lectureTexte",
  "decimaux",
  "aires",
  "proportionnalite",
];

const MONDES = {
  [NIVEAU.CP]: { data: "cp", titre: "La prairie des débuts", sous: "Un pas après l'autre avec le renard." },
  [NIVEAU.CE1]: { data: "ce1", titre: "Le sentier de la forêt", sous: "Les défis se suivent sur le chemin." },
  [NIVEAU.CE2]: { data: "ce2", titre: "Le lac des défis", sous: "Chaque case cache une nouvelle énigme." },
  [NIVEAU.CM1]: { data: "cm1", titre: "La montagne des maîtres", sous: "Gravis les étapes une par une." },
  [NIVEAU.CM2]: { data: "cm2", titre: "Les étoiles du sommet", sous: "Les derniers défis t'attendent." },
};

let deps = null;
let cheminCourant = [];
let indexCourant = 0;

function carteJouablePourNiveau(jeuId, niveau) {
  const el = document.querySelector(`.carte-jeu[data-jeu="${jeuId}"]`);
  if (!el) return false;
  const nv = (el.getAttribute("data-niveaux") || "").trim().split(/\s+/);
  return nv.includes(niveau);
}

function jeuxDisponiblesPourNiveau(niveau) {
  const vus = new Set();
  const out = [];
  for (const id of CHEMIN_BASE) {
    if (!carteJouablePourNiveau(id, niveau)) continue;
    vus.add(id);
    out.push(id);
  }
  if (out.length >= 6) return out.slice(0, 12);
  document.querySelectorAll(".carte-jeu[data-jeu]").forEach((btn) => {
    const id = btn.getAttribute("data-jeu");
    if (!id || vus.has(id) || !carteJouablePourNiveau(id, niveau)) return;
    vus.add(id);
    out.push(id);
  });
  return out.slice(0, 12);
}

function cheminPourNiveau(niveau) {
  return jeuxDisponiblesPourNiveau(niveau);
}

function elEcran() {
  return document.getElementById("ecran-aventure");
}

function appliquerMonde(niveau) {
  const ecran = elEcran();
  if (!ecran) return;
  const info = MONDES[niveau] || MONDES[NIVEAU.CP];
  ecran.dataset.monde = info.data;
  const h = document.getElementById("aventure-monde-titre");
  const p = document.getElementById("aventure-soustitre");
  if (h) h.textContent = info.titre;
  if (p) p.textContent = info.sous;
}

function sauverPosition(niveau, pos, done) {
  sauverEtatAventure(niveau, { pos, done });
}

function rendreGrille() {
  const grille = document.getElementById("aventure-grille");
  if (!grille) return;
  grille.innerHTML = "";
  if (cheminCourant.length === 0) {
    const p = document.createElement("p");
    p.className = "aventure-vide";
    p.textContent = "Aucun défi pour ta classe. Demande à un parent de vérifier le menu.";
    grille.appendChild(p);
    return;
  }
  const niveau = getNiveauCourant();
  const etat = lireEtatAventure(niveau);
  const doneSet = new Set(etat.done);
  cheminCourant.forEach((jeuId, i) => {
    const carte = document.querySelector(`.carte-jeu[data-jeu="${jeuId}"]`);
    const emoji = carte?.querySelector(".emoji-jeu")?.textContent?.trim() || "🎮";
    const nom = carte?.querySelector(".nom-jeu")?.textContent?.trim() || jeuId;
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "aventure-case";
    if (i === indexCourant) cell.classList.add("aventure-case--ici");
    if (doneSet.has(i)) cell.classList.add("aventure-case--fait");
    cell.dataset.index = String(i);
    const num = document.createElement("span");
    num.className = "aventure-case-num";
    num.textContent = String(i + 1);
    const em = document.createElement("span");
    em.className = "aventure-case-emoji";
    em.textContent = emoji;
    if (i === indexCourant) {
      const fox = document.createElement("span");
      fox.className = "aventure-renard-sur-case";
      fox.setAttribute("aria-hidden", "true");
      fox.textContent = "🦊";
      cell.appendChild(num);
      cell.appendChild(em);
      cell.appendChild(fox);
    } else {
      cell.appendChild(num);
      cell.appendChild(em);
    }
    cell.setAttribute("aria-label", `Case ${i + 1}, ${nom}`);
    cell.addEventListener("click", () => {
      allerVersIndex(i);
    });
    grille.appendChild(cell);
  });
}

function allerVersIndex(i) {
  const max = Math.max(0, cheminCourant.length - 1);
  const cible = Math.max(0, Math.min(max, i));
  indexCourant = cible;
  const niveau = getNiveauCourant();
  const etat = lireEtatAventure(niveau);
  sauverPosition(niveau, indexCourant, etat.done);
  majBoutonsNav();
  rendreGrille();
}

function majBoutonsNav() {
  const btnR = document.getElementById("btn-aventure-reculer");
  const btnA = document.getElementById("btn-aventure-avancer");
  const btnJ = document.getElementById("btn-aventure-jouer");
  const max = Math.max(0, cheminCourant.length - 1);
  if (btnR) btnR.disabled = indexCourant <= 0;
  if (btnA) btnA.disabled = indexCourant >= max;
  if (btnJ) btnJ.disabled = cheminCourant.length === 0;
}

export function rafraichirAventureSiOuverte() {
  const ecran = elEcran();
  if (!ecran || !ecran.classList.contains("actif") || ecran.hidden) return;
  montrerAventure();
}

export function montrerAventure() {
  const ecran = elEcran();
  if (!ecran) return;
  const niveau = getNiveauCourant();
  appliquerMonde(niveau);
  cheminCourant = cheminPourNiveau(niveau);
  const etat = lireEtatAventure(niveau);
  const max = Math.max(0, cheminCourant.length - 1);
  indexCourant = Math.min(Math.max(0, etat.pos), max);
  sauverPosition(niveau, indexCourant, etat.done);
  rendreGrille();
  majBoutonsNav();
  revelerSeulEcran(ecran);
  track("aventure_open", { niveau });
}

function preparerLancementDepuisAventure(indexCase) {
  sessionStorage.setItem(SS_RETOUR, "1");
  sessionStorage.setItem(SS_INDEX, String(indexCase));
}

export function consommerRetourDepuisAventure() {
  if (sessionStorage.getItem(SS_RETOUR) !== "1") return false;
  sessionStorage.removeItem(SS_RETOUR);
  const idx = parseInt(sessionStorage.getItem(SS_INDEX) || "-1", 10);
  sessionStorage.removeItem(SS_INDEX);
  const niveau = getNiveauCourant();
  const etat = lireEtatAventure(niveau);
  const done = [...new Set([...etat.done, idx].filter((n) => n >= 0))];
  sauverEtatAventure(niveau, { pos: idx >= 0 ? idx : etat.pos, done });
  return true;
}

export function montrerMenuOuAventureApresRevision(montrerMenuFn, afficherMissionsFn) {
  if (sessionStorage.getItem(SS_RETOUR) === "1") {
    sessionStorage.removeItem(SS_RETOUR);
    const idx = parseInt(sessionStorage.getItem(SS_INDEX) || "-1", 10);
    sessionStorage.removeItem(SS_INDEX);
    const niveau = getNiveauCourant();
    const etat = lireEtatAventure(niveau);
    const done = [...new Set([...etat.done, idx].filter((n) => n >= 0))];
    sauverEtatAventure(niveau, { pos: idx >= 0 ? idx : etat.pos, done });
    montrerAventure();
    afficherMissionsFn();
    return;
  }
  montrerMenuFn();
  afficherMissionsFn();
}

export function initAventure(d) {
  deps = d;
  const btnRet = document.getElementById("btn-retour-aventure");
  if (btnRet) {
    btnRet.addEventListener("click", () => {
      track("aventure_exit_menu", { niveau: getNiveauCourant() });
      d.entrerMenu();
    });
  }
  const btnR = document.getElementById("btn-aventure-reculer");
  const btnA = document.getElementById("btn-aventure-avancer");
  const btnJ = document.getElementById("btn-aventure-jouer");
  if (btnR) {
    btnR.addEventListener("click", () => {
      allerVersIndex(indexCourant - 1);
    });
  }
  if (btnA) {
    btnA.addEventListener("click", () => {
      allerVersIndex(indexCourant + 1);
    });
  }
  if (btnJ) {
    btnJ.addEventListener("click", async () => {
      const jeu = cheminCourant[indexCourant];
      if (!jeu || !deps) return;
      const ok = await deps.assurerLanceurDansMap(jeu, deps.lanceurs);
      if (!ok || typeof deps.lanceurs[jeu] !== "function") return;
      preparerLancementDepuisAventure(indexCourant);
      track("game_start", {
        game_name: jeu,
        niveau: getNiveauCourant(),
        difficulte: getDifficulte(),
        source: "aventure",
      });
      deps.montrerJeu(jeu, deps.lanceurs);
    });
  }
}
