// app-state.js — shared constants, DOM refs, mutable state (getter/setter), pure helpers

// ── Storage keys ──────────────────────────────────────────────────────────────
export const STORAGE_KEY        = "maths-cp-etoiles";
export const STORAGE_NIVEAU     = "maths-cp-niveau";
export const STORAGE_GENRE      = "maths-cp-genre";
export const RENARD_NOM_KEY     = "renard-nom";
export const RENARD_NAISSANCE_KEY = "renard-naissance";
export const RENARD_FAIM_KEY    = "renard-faim";
export const RENARD_FAIM_TS_KEY = "renard-faim-ts";
export const RENARD_BONHEUR_KEY = "renard-bonheur";
export const RENARD_BONHEUR_TS_KEY = "renard-bonheur-ts";
export const RENARD_CALIN_DATE_KEY = "renard-calin-date";
export const RENARD_STREAK_KEY  = "renard-streak";

// ── Constants ─────────────────────────────────────────────────────────────────
export const NIVEAU = { CP: "cp", CE1: "ce1", CE2: "ce2" };
export const GENRE  = { FILLE: "fille", GARCON: "garcon" };

export const ANIMAUX = ["🐱", "🐶", "🐰", "🐻", "🦊", "🐸", "🐥", "🐧", "🦋", "🐝"];

// ── DOM refs ──────────────────────────────────────────────────────────────────
export const elGenre      = document.getElementById("ecran-genre");
export const elMenu       = document.getElementById("ecran-menu");
export const elJeu        = document.getElementById("ecran-jeu");
export const elTotal      = document.getElementById("total-etoiles");
export const elBadge      = document.getElementById("jeu-niveau-badge");
export const elTitre      = document.getElementById("jeu-titre");
export const elQuestion   = document.getElementById("zone-question");
export const elChoix      = document.getElementById("zone-choix");
export const elFeedback   = document.getElementById("feedback");
export const elSuivant    = document.getElementById("btn-suivant");
export const btnRetour    = document.getElementById("btn-retour");
export const elSousTitre  = document.getElementById("sous-titre");
export const elIconeGenre = document.getElementById("icone-genre-actuel");

// ── Mutable state ─────────────────────────────────────────────────────────────
let jeuCourant   = null;
let bonneReponse = null;
let repondu      = false;
let niveauCourant = lireNiveau();
let genreCourant  = lireGenre();

export function getJeuCourant()         { return jeuCourant; }
export function setJeuCourant(v)        { jeuCourant = v; }
export function getBonneReponse()       { return bonneReponse; }
export function setBonneReponse(v)      { bonneReponse = v; }
export function getRepondu()            { return repondu; }
export function setRepondu(v)           { repondu = v; }
export function getNiveauCourant()      { return niveauCourant; }
export function getGenreCourant()       { return genreCourant; }

// ── Niveau ────────────────────────────────────────────────────────────────────
export function lireNiveau() {
  const v = localStorage.getItem(STORAGE_NIVEAU);
  if (v === NIVEAU.CE1) return NIVEAU.CE1;
  if (v === NIVEAU.CE2) return NIVEAU.CE2;
  return NIVEAU.CP;
}

export function sauverNiveau(n) {
  localStorage.setItem(STORAGE_NIVEAU, n);
  niveauCourant = n;
}

export function estCE1() {
  return niveauCourant === NIVEAU.CE1;
}

export function estCE2() {
  return niveauCourant === NIVEAU.CE2;
}

// ── Genre ─────────────────────────────────────────────────────────────────────
export function lireGenre() {
  const v = localStorage.getItem(STORAGE_GENRE);
  return v === GENRE.GARCON ? GENRE.GARCON : GENRE.FILLE;
}

export function sauverGenre(g) {
  localStorage.setItem(STORAGE_GENRE, g);
  genreCourant = g;
}

export function estFille() {
  return genreCourant === GENRE.FILLE;
}

export function majGenre() {
  const f = estFille();
  if (elSousTitre) {
    elSousTitre.textContent = f
      ? "Des jeux pour devenir championne !"
      : "Des jeux pour devenir champion !";
  }
  if (elIconeGenre) elIconeGenre.textContent = f ? "👧" : "👦";
}

export function syncNiveauButtons() {
  document.querySelectorAll(".niveau-btn").forEach((btn) => {
    btn.classList.toggle("actif", btn.dataset.niveau === niveauCourant);
  });
}

export function majLabelsMenu() {
  const desc = document.getElementById("desc-addition");
  if (desc) {
    if (estCE2()) desc.textContent = "Jusqu'à 999";
    else if (estCE1()) desc.textContent = "Jusqu'à 79";
    else desc.textContent = "Jusqu'à 10";
  }
}

export function setBadgeVisible(visible) {
  if (!elBadge) return;
  if (visible) {
    elBadge.hidden = false;
    let label = "Niveau : CP";
    if (estCE1()) label = "Niveau : CE1";
    if (estCE2()) label = "Niveau : CE2";
    elBadge.textContent = label;
  } else {
    elBadge.hidden = true;
  }
}

// ── Étoiles (base) ────────────────────────────────────────────────────────────
export function lireEtoiles() {
  const n = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

// Base version — used by app-renard.js to wrap with evolution detection
export function _ajouterEtoilesBase(n) {
  const t = lireEtoiles() + n;
  localStorage.setItem(STORAGE_KEY, String(t));
  elTotal.textContent = t;
}

// ── Faim / Bonheur ────────────────────────────────────────────────────────────
export function lireFaim() {
  const v = parseFloat(localStorage.getItem(RENARD_FAIM_KEY));
  return Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 80;
}

export function sauverFaim(v) {
  localStorage.setItem(RENARD_FAIM_KEY, String(Math.max(0, Math.min(100, v))));
  localStorage.setItem(RENARD_FAIM_TS_KEY, String(Date.now()));
}

export function lireBonheur() {
  const v = parseFloat(localStorage.getItem(RENARD_BONHEUR_KEY));
  return Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 80;
}

export function sauverBonheur(v) {
  localStorage.setItem(RENARD_BONHEUR_KEY, String(Math.max(0, Math.min(100, v))));
  localStorage.setItem(RENARD_BONHEUR_TS_KEY, String(Date.now()));
}

export function appliquerDecay(valKey, tsKey, tauxParHeure) {
  const ts = parseInt(localStorage.getItem(tsKey) || "0", 10);
  if (!ts) return;
  const heures = (Date.now() - ts) / 3600000;
  const val = parseFloat(localStorage.getItem(valKey) || "80");
  const nvVal = Math.max(0, val - tauxParHeure * heures);
  localStorage.setItem(valKey, String(nvVal));
  localStorage.setItem(tsKey, String(Date.now()));
}

export function mettreAJourJauges() {
  appliquerDecay(RENARD_FAIM_KEY, RENARD_FAIM_TS_KEY, 20 / 24);
  appliquerDecay(RENARD_BONHEUR_KEY, RENARD_BONHEUR_TS_KEY, 15 / 24);
  if (!localStorage.getItem(RENARD_FAIM_TS_KEY)) sauverFaim(lireFaim());
  if (!localStorage.getItem(RENARD_BONHEUR_TS_KEY)) sauverBonheur(lireBonheur());
}

// ── Renard persistence helpers ────────────────────────────────────────────────
export function lireNomRenard() {
  return localStorage.getItem(RENARD_NOM_KEY) || null;
}

export function sauverNomRenard(nom) {
  localStorage.setItem(RENARD_NOM_KEY, nom);
  if (!localStorage.getItem(RENARD_NAISSANCE_KEY)) {
    localStorage.setItem(RENARD_NAISSANCE_KEY, new Date().toISOString().slice(0, 10));
  }
}

export function peutFaireCalin() {
  const d = localStorage.getItem(RENARD_CALIN_DATE_KEY);
  return d !== new Date().toISOString().slice(0, 10);
}

export function lireAccessoires() {
  try { return JSON.parse(localStorage.getItem("renard-accessoires") || "[]"); }
  catch { return []; }
}

export function lireTenue() {
  try { return JSON.parse(localStorage.getItem("renard-tenue") || "{}"); }
  catch { return {}; }
}

export function sauverTenue(t) { localStorage.setItem("renard-tenue", JSON.stringify(t)); }

export function debloquerAccessoire(id) {
  try {
    const liste = JSON.parse(localStorage.getItem("renard-accessoires") || "[]");
    if (!liste.includes(id)) {
      liste.push(id);
      localStorage.setItem("renard-accessoires", JSON.stringify(liste));
    }
  } catch { /* ignore */ }
}

export function lireStreak() {
  try { return JSON.parse(localStorage.getItem(RENARD_STREAK_KEY)) || { count: 0, lastVisit: "" }; }
  catch { return { count: 0, lastVisit: "" }; }
}

export function sauverStreak(s) { localStorage.setItem(RENARD_STREAK_KEY, JSON.stringify(s)); }

// ── Pure helpers ──────────────────────────────────────────────────────────────
export function melanger(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function entiersDistincts(min, max, count, exclude) {
  const set = new Set(exclude != null ? [exclude] : []);
  const out = [];
  let guard = 0;
  while (out.length < count && guard++ < 100) {
    const n = min + Math.floor(Math.random() * (max - min + 1));
    if (!set.has(n)) {
      set.add(n);
      out.push(n);
    }
  }
  return out;
}

export function propositionsAvecBonne(bonne, min, max, nbFausse) {
  if (min > max) {
    const t = min;
    min = max;
    max = t;
  }
  const fausses = entiersDistincts(min, max, nbFausse, bonne);
  return melanger([bonne, ...fausses]);
}

export function afficherChoix(nombres, handler) {
  elChoix.innerHTML = "";
  nombres.forEach((n) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.textContent = String(n);
    b.dataset.valeur = String(n);
    b.addEventListener("click", () => handler(Number(b.dataset.valeur), b));
    elChoix.appendChild(b);
  });
}

// ── Confetti ──────────────────────────────────────────────────────────────────
export function confetti() {
  const root = document.getElementById("confetti");
  const sym = ["⭐", "✨", "🌟", "💫", "🎉"];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("span");
    s.textContent = sym[i % sym.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 0.4 + "s";
    root.appendChild(s);
    setTimeout(() => s.remove(), 2500);
  }
}
