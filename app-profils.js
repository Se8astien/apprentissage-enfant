// app-profils.js — jusqu'à 4 profils d'enfants par appareil

import {
  STORAGE_KEY,
  STORAGE_NIVEAU,
  STORAGE_GENRE,
  RENARD_NOM_KEY,
} from "./app-state.js";

const CLE_LISTE = "profils-liste";
const CLE_ACTIF = "profil-actif-id";
const EXCLUS = new Set([
  "rgpd-consent", "sons-actifs", "theme-nuit", "landing-seen",
  CLE_LISTE, CLE_ACTIF,
]);

function genId() {
  return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

export function getProfils() {
  try { return JSON.parse(localStorage.getItem(CLE_LISTE)) || []; }
  catch { return []; }
}

function sauverListe(liste) {
  localStorage.setItem(CLE_LISTE, JSON.stringify(liste));
}

export function getProfilActifId() {
  return localStorage.getItem(CLE_ACTIF);
}

function makeSnapshot() {
  const snap = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!EXCLUS.has(k) && !k.startsWith("snap-")) snap[k] = localStorage.getItem(k);
  }
  return snap;
}

function sauverSnapshot(id) {
  const snap = makeSnapshot();
  localStorage.setItem("snap-" + id, JSON.stringify(snap));
  const liste = getProfils();
  const p = liste.find(x => x.id === id);
  if (p) {
    if (snap["renard-nom"]) p.nom = snap["renard-nom"];
    p.etoiles = parseInt(snap["maths-cp-etoiles"] || "0", 10);
    p.niveau   = snap["maths-cp-niveau"] || "cp";
    sauverListe(liste);
  }
}

function restaurer(id) {
  const aVider = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!EXCLUS.has(k) && !k.startsWith("snap-")) aVider.push(k);
  }
  aVider.forEach(k => localStorage.removeItem(k));
  try {
    const snap = JSON.parse(localStorage.getItem("snap-" + id) || "{}");
    Object.entries(snap).forEach(([k, v]) => localStorage.setItem(k, v));
  } catch {}
}

export function creerProfil() {
  const liste = getProfils();
  if (liste.length >= 4) return null;
  const id = genId();
  liste.push({ id, nom: "Renard " + (liste.length + 1), etoiles: 0, niveau: "cp" });
  sauverListe(liste);
  return id;
}

export function basculerProfil(idNouv) {
  const idActuel = getProfilActifId();
  if (idActuel) sauverSnapshot(idActuel);
  localStorage.setItem(CLE_ACTIF, idNouv);
  restaurer(idNouv);
  sessionStorage.setItem("skip-selector", "1");
  location.reload();
}

export function supprimerProfil(id) {
  const liste = getProfils().filter(p => p.id !== id);
  sauverListe(liste);
  localStorage.removeItem("snap-" + id);
  if (getProfilActifId() === id) {
    if (liste.length > 0) {
      localStorage.setItem(CLE_ACTIF, liste[0].id);
      restaurer(liste[0].id);
    } else {
      localStorage.removeItem(CLE_ACTIF);
    }
    sessionStorage.setItem("skip-selector", "1");
    location.reload();
  }
}

export function syncProfilActif(etoiles, nom, niveau) {
  const id = getProfilActifId();
  if (!id) return;
  const liste = getProfils();
  const p = liste.find(x => x.id === id);
  if (!p) return;
  if (nom)              p.nom    = nom;
  if (etoiles !== undefined) p.etoiles = etoiles;
  if (niveau)           p.niveau = niveau;
  sauverListe(liste);
}

const WIPE_GLOBAL_KEEP = new Set([
  ...EXCLUS,
  "parent-pin",
  "jeux-masques",
]);

export function effacerDonneesProfilCourant() {
  const niveau = localStorage.getItem(STORAGE_NIVEAU);
  const genre = localStorage.getItem(STORAGE_GENRE);
  const nomRenard = localStorage.getItem(RENARD_NOM_KEY);
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || WIPE_GLOBAL_KEEP.has(k) || k.startsWith("snap-")) continue;
    keysToRemove.push(k);
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));

  localStorage.setItem(STORAGE_KEY, "0");
  if (niveau) localStorage.setItem(STORAGE_NIVEAU, niveau);
  if (genre) localStorage.setItem(STORAGE_GENRE, genre);
  if (nomRenard) localStorage.setItem(RENARD_NOM_KEY, nomRenard);
  localStorage.setItem("badges-obtenus", "[]");
  localStorage.setItem("stats-questions", "{}");
  localStorage.setItem("stats-global-questions", "0");
  localStorage.setItem("jeux-joues", "[]");
  localStorage.setItem("missions-total-completees", "0");
  localStorage.setItem("apprentissage-difficulte", "0");
  localStorage.setItem("renard-faim", "80");
  localStorage.setItem("renard-bonheur", "80");
  localStorage.removeItem("renard-faim-ts");
  localStorage.removeItem("renard-bonheur-ts");
  localStorage.setItem("renard-streak", JSON.stringify({ count: 0, lastVisit: "" }));
  localStorage.setItem("renard-accessoires", "[]");
  localStorage.setItem("renard-tenue", "{}");
  localStorage.removeItem("renard-naissance");
  localStorage.removeItem("renard-calin-date");

  const id = getProfilActifId();
  if (id) {
    sauverSnapshot(id);
    const liste = getProfils();
    const p = liste.find(x => x.id === id);
    if (p) {
      p.etoiles = 0;
      if (niveau) p.niveau = niveau;
      if (nomRenard) p.nom = nomRenard;
      sauverListe(liste);
    }
  }
}

export function initProfils() {
  let liste   = getProfils();
  let actifId = getProfilActifId();

  if (liste.length === 0) {
    const id = genId();
    liste    = [{ id, nom: "Renard", etoiles: 0, niveau: "cp" }];
    sauverListe(liste);
    actifId  = id;
    localStorage.setItem(CLE_ACTIF, id);
  } else if (!actifId || !liste.find(p => p.id === actifId)) {
    actifId = liste[0].id;
    localStorage.setItem(CLE_ACTIF, actifId);
  }

  return { liste, actifId };
}
