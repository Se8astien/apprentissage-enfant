// app-ete.js — Parcours d'été : 30 étapes de révision, une par jour, pendant juillet-août

import { confetti, debloquerAccessoire, getNiveauCourant } from "./app-state.js";
import { ajouterEtoiles } from "./app-renard.js";

export const ETE_TOTAL = 30;
export const ETE_BONNES_PAR_ETAPE = 5;

const ETE_KEY = "ete-parcours";

// Paliers : étape → récompense (appliquée une seule fois, à la complétion)
const PALIERS = {
  7:  { texte: "🕶️ Lunettes de soleil débloquées pour ton renard !", appliquer: () => debloquerAccessoire("lunettes-soleil") },
  15: { texte: "⭐ +15 étoiles bonus, tu es à mi-chemin !", appliquer: () => ajouterEtoiles(15) },
  30: { texte: "🏆 Trophée d'été ! +30 étoiles, tout le parcours est fini !", appliquer: () => ajouterEtoiles(30) },
};

function dateAujourdhui() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function estPeriodeEte() {
  const force = localStorage.getItem("ete-force");
  if (force === "1") return true;
  if (force === "0") return false;
  const mois = new Date().getMonth();
  return mois === 6 || mois === 7; // juillet, août
}

export function lireEte() {
  try {
    const raw = JSON.parse(localStorage.getItem(ETE_KEY) || "{}");
    return {
      etape: Math.max(0, Math.min(ETE_TOTAL, parseInt(raw.etape, 10) || 0)),
      progres: Math.max(0, Math.min(ETE_BONNES_PAR_ETAPE, parseInt(raw.progres, 10) || 0)),
      dateEtape: typeof raw.dateEtape === "string" ? raw.dateEtape : "",
    };
  } catch {
    return { etape: 0, progres: 0, dateEtape: "" };
  }
}

function sauverEte(s) {
  localStorage.setItem(ETE_KEY, JSON.stringify(s));
}

export function etapeDisponibleAujourdhui() {
  const s = lireEte();
  return s.etape < ETE_TOTAL && s.dateEtape !== dateAujourdhui();
}

// Appelé à chaque bonne réponse pendant un jeu (depuis app-nav)
export function progresserEte() {
  if (!estPeriodeEte() || !etapeDisponibleAujourdhui()) return;
  const s = lireEte();
  s.progres++;
  if (s.progres >= ETE_BONNES_PAR_ETAPE) {
    s.etape++;
    s.progres = 0;
    s.dateEtape = dateAujourdhui();
    sauverEte(s);
    const palier = PALIERS[s.etape];
    if (palier) palier.appliquer();
    confetti({ tier: "burst" });
    afficherToastEte(
      palier ? palier.texte : `🏖️ Étape ${s.etape}/${ETE_TOTAL} du parcours d'été réussie !`
    );
  } else {
    sauverEte(s);
  }
}

function afficherToastEte(texte) {
  const app = document.querySelector(".app") || document.body;
  const toast = document.createElement("div");
  toast.className = "toast-progression toast-ete";
  toast.innerHTML = `<span>${texte}</span>`;
  app.appendChild(toast);
  setTimeout(() => toast.remove(), 3600);
}

// Jeu conseillé pour la révision du jour : le plus fragile d'abord, sinon rotation
export function jeuEteConseille(lanceursDispos) {
  try {
    const raw = localStorage.getItem("stats-questions");
    const stats = raw ? JSON.parse(raw) : {};
    let pireJeu = null;
    let pireTaux = 1;
    for (const [jeu, s] of Object.entries(stats)) {
      if (s && s.joues >= 5 && (!lanceursDispos || lanceursDispos[jeu])) {
        const taux = s.bonnes / s.joues;
        if (taux < pireTaux) { pireTaux = taux; pireJeu = jeu; }
      }
    }
    if (pireJeu) return pireJeu;
  } catch { /* stats illisibles : rotation par défaut */ }
  const rotation = {
    cp:  ["addition", "soustraction", "compte", "syllabes", "heure"],
    ce1: ["addition", "soustraction", "multiplication", "lecture", "heure"],
    ce2: ["multiplication", "division", "fractions", "grammaire", "durees"],
    cm1: ["fractionsCM", "division", "conjugaison", "proportionnalite", "decimaux"],
    cm2: ["decimaux", "pourcentages", "fractionsCM", "conjugaison", "probleme"],
  };
  const liste = rotation[getNiveauCourant()] || rotation.cp;
  const s = lireEte();
  return liste[s.etape % liste.length];
}

export function majEteWidget() {
  const el = document.getElementById("ete-section");
  if (!el) return;
  if (!estPeriodeEte()) { el.hidden = true; return; }
  el.hidden = false;

  const s = lireEte();
  const faitAujourdhui = !etapeDisponibleAujourdhui() && s.etape < ETE_TOTAL;
  const termine = s.etape >= ETE_TOTAL;

  const points = [];
  for (let i = 1; i <= ETE_TOTAL; i++) {
    if (i <= s.etape) points.push(`<span class="ete-pas ete-pas--fait">✓</span>`);
    else if (i === s.etape + 1 && !termine) points.push(`<span class="ete-pas ete-pas--actuel">🦊</span>`);
    else if (PALIERS[i]) points.push(`<span class="ete-pas ete-pas--palier">🎁</span>`);
    else points.push(`<span class="ete-pas"></span>`);
  }

  let statut;
  if (termine) {
    statut = `<p class="ete-statut">🏆 Parcours terminé, bravo ! Rendez-vous l'été prochain !</p>`;
  } else if (faitAujourdhui) {
    statut = `<p class="ete-statut">☀️ Étape du jour réussie ! Reviens demain pour la suite.</p>`;
  } else {
    statut = `
      <p class="ete-statut">Étape ${s.etape + 1}/${ETE_TOTAL} — ${s.progres}/${ETE_BONNES_PAR_ETAPE} bonnes réponses</p>
      <button type="button" class="ete-jouer" id="btn-ete-jouer">▶️ Je fais ma révision du jour</button>
    `;
  }

  el.innerHTML = `
    <div class="ete-carte">
      <p class="ete-titre">🏖️ Parcours d'été</p>
      <p class="ete-sous-titre">5 bonnes réponses par jour pour faire avancer ton renard !</p>
      <div class="ete-chemin" aria-label="Progression du parcours d'été">${points.join("")}</div>
      ${statut}
    </div>
  `;
}
