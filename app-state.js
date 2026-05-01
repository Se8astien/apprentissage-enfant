// app-state.js — shared constants, DOM refs, mutable state (getter/setter), pure helpers

// ── Storage keys ──────────────────────────────────────────────────────────────
export const STORAGE_KEY        = "maths-cp-etoiles";
export const STORAGE_NIVEAU     = "maths-cp-niveau";
export const STORAGE_DIFFICULTE = "apprentissage-difficulte";
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
export const NIVEAU = { CP: "cp", CE1: "ce1", CE2: "ce2", CM1: "cm1", CM2: "cm2" };
export const GENRE  = { FILLE: "fille", GARCON: "garcon" };

export const NIVEAUX_LABELS = { cp: "🌱 CP", ce1: "🚀 CE1", ce2: "⭐ CE2", cm1: "🌟 CM1", cm2: "🏆 CM2" };
export const DIFFICULTE_LABELS = ["🌱 Débutant", "⚡ Normal", "🔥 Expert"];
export const DIFFICULTE_ICONES = ["🌱", "⚡", "🔥"];

export const ANIMAUX = ["🐱", "🐶", "🐰", "🐻", "🦊", "🐸", "🐥", "🐧", "🦋", "🐝"];

// ── DOM refs ──────────────────────────────────────────────────────────────────
export const elGenre      = document.getElementById("ecran-genre");
export const elMenu       = document.getElementById("ecran-menu");
export const elJeu        = document.getElementById("ecran-jeu");
export const elTotal      = document.getElementById("total-etoiles");
export const elBadge      = document.getElementById("diff-badge");
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
  if (v === NIVEAU.CM1) return NIVEAU.CM1;
  if (v === NIVEAU.CM2) return NIVEAU.CM2;
  return NIVEAU.CP;
}

export function sauverNiveau(n) {
  const prev = localStorage.getItem(STORAGE_NIVEAU);
  localStorage.setItem(STORAGE_NIVEAU, n);
  niveauCourant = n;
  if (prev !== n) setDifficulte(0);
}

export function syncPrefsDepuisStockage() {
  niveauCourant = lireNiveau();
  genreCourant = lireGenre();
}

export function estCE1() { return niveauCourant === NIVEAU.CE1; }
export function estCE2() { return niveauCourant === NIVEAU.CE2; }
export function estCM1() { return niveauCourant === NIVEAU.CM1; }
export function estCM2() { return niveauCourant === NIVEAU.CM2; }
export function estGrand() { return niveauCourant === NIVEAU.CM1 || niveauCourant === NIVEAU.CM2; }

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

export function getDifficulteJeu(jeu) {
  const v = parseInt(localStorage.getItem("diff-jeu-" + jeu) || "0", 10);
  return (v >= 0 && v <= 2) ? v : 0;
}

export function setDifficulteJeu(jeu, v) {
  localStorage.setItem("diff-jeu-" + jeu, String(Math.max(0, Math.min(2, v))));
}

export function getDifficulte() {
  if (jeuCourant) return getDifficulteJeu(jeuCourant);
  const v = parseInt(localStorage.getItem(STORAGE_DIFFICULTE) || "0", 10);
  return (v >= 0 && v <= 2) ? v : 0;
}

export function setDifficulte(v) {
  localStorage.setItem(STORAGE_DIFFICULTE, String(Math.max(0, Math.min(2, v))));
}

export function incrementDifficulte() {
  const cur = getDifficulte();
  if (cur < 2) setDifficulte(cur + 1);
}

export function getDiffLabel() {
  return DIFFICULTE_LABELS[getDifficulte()];
}

export function setBadgeVisible(visible) {
  if (!elBadge) return;
  if (visible) {
    elBadge.hidden = false;
    elBadge.textContent = getDiffLabel();
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
    localStorage.setItem(RENARD_NAISSANCE_KEY, localDate());
  }
}

export function peutFaireCalin() {
  const d = localStorage.getItem(RENARD_CALIN_DATE_KEY);
  return d !== localDate();
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

export function revelerEcran(el) {
  if (!el) return;
  el.removeAttribute("hidden");
  el.hidden = false;
  el.classList.add("actif");
}

export function toutCacherEcrans() {
  document.querySelectorAll(".ecran").forEach((e) => {
    e.hidden = true;
    e.classList.remove("actif");
  });
}

export function revelerSeulEcran(el) {
  if (!el) return;
  toutCacherEcrans();
  revelerEcran(el);
}

// ── Accessibilité : gestion du focus dans les overlays ────────────────────────
export function piegerFocus(overlay) {
  const focusables = () => [...overlay.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")];
  const trapHandler = (e) => {
    if (e.key !== "Tab") return;
    const els = focusables();
    if (!els.length) return;
    const first = els[0];
    const last  = els[els.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  };
  overlay.addEventListener("keydown", trapHandler);
  const premier = focusables()[0];
  if (premier) setTimeout(() => premier.focus(), 50);
  return trapHandler;
}

// ── Sanitisation HTML ─────────────────────────────────────────────────────────
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Date locale (évite les bugs de timezone UTC vs local) ────────────────────
export function localDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function localDateHier() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

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

// ── Maîtrise (mastery stars) ──────────────────────────────────────────────────
export function lireMaitrise(jeu) {
  try { return JSON.parse(localStorage.getItem("maitrise-" + jeu)) || [false, false, false]; }
  catch { return [false, false, false]; }
}

export function marquerMaitrise(jeu, diff) {
  const m = lireMaitrise(jeu);
  m[diff] = true;
  localStorage.setItem("maitrise-" + jeu, JSON.stringify(m));
}

// ── Confetti ──────────────────────────────────────────────────────────────────
export function confetti() {
  const root = document.getElementById("confetti");
  root.innerHTML = "";
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
