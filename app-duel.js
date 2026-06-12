// app-duel.js — mode duel à deux joueurs sur le même appareil (chacun son tour)

import { getNiveauCourant, getDifficulte } from "./app-state.js";
import { track } from "./app-analytics.js";

const NB_QUESTIONS_TOTAL = 6;

const JOUEURS = [
  { nom: "Joueur 1", emoji: "🔵" },
  { nom: "Joueur 2", emoji: "🔴" },
];

let deps = null;
let duel = null;

export function duelEnCours() {
  return duel !== null;
}

function jeuxPourDuel(niveau) {
  const out = [];
  document.querySelectorAll(".carte-jeu[data-jeu]").forEach((btn) => {
    if (out.length >= 8) return;
    const id = btn.getAttribute("data-jeu");
    const nv = (btn.getAttribute("data-niveaux") || "").trim().split(/\s+/);
    if (!id || !nv.includes(niveau)) return;
    const emoji = btn.querySelector(".emoji-jeu")?.textContent?.trim() || "🎮";
    const nom = btn.querySelector(".nom-jeu")?.textContent?.trim() || id;
    out.push({ id, emoji, nom });
  });
  return out;
}

function fermerChoix() {
  document.getElementById("duel-choix-overlay")?.remove();
}

function ouvrirChoixJeu() {
  fermerChoix();
  const jeux = jeuxPourDuel(getNiveauCourant());
  const overlay = document.createElement("div");
  overlay.id = "duel-choix-overlay";
  overlay.className = "duel-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Choisir le jeu du duel");
  const boite = document.createElement("div");
  boite.className = "duel-boite";
  const titre = document.createElement("h2");
  titre.className = "duel-titre";
  titre.textContent = "⚔️ Duel à deux !";
  const sous = document.createElement("p");
  sous.className = "duel-sous";
  sous.textContent = "Chacun son tour, 3 questions chacun. Choisissez votre jeu :";
  const grille = document.createElement("div");
  grille.className = "duel-choix-grille";
  jeux.forEach((j) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "duel-choix-jeu";
    b.innerHTML = `<span class="duel-choix-emoji">${j.emoji}</span><span>${j.nom}</span>`;
    b.addEventListener("click", () => {
      fermerChoix();
      demarrerDuel(j.id);
    });
    grille.appendChild(b);
  });
  const fermer = document.createElement("button");
  fermer.type = "button";
  fermer.className = "duel-btn-fermer";
  fermer.textContent = "← Retour";
  fermer.addEventListener("click", fermerChoix);
  boite.appendChild(titre);
  boite.appendChild(sous);
  boite.appendChild(grille);
  boite.appendChild(fermer);
  overlay.appendChild(boite);
  document.body.appendChild(overlay);
}

async function demarrerDuel(jeuId) {
  if (!deps) return;
  const ok = await deps.assurerLanceurDansMap(jeuId, deps.lanceurs);
  if (!ok || typeof deps.lanceurs[jeuId] !== "function") return;
  duel = { jeu: jeuId, scores: [0, 0], tour: 0, repondues: 0 };
  track("duel_start", { game_name: jeuId, niveau: getNiveauCourant(), difficulte: getDifficulte() });
  deps.montrerJeu(jeuId, deps.lanceurs);
  majBanniere();
}

function majBanniere() {
  if (!duel) return;
  let banner = document.getElementById("duel-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "duel-banner";
    banner.className = "duel-banner";
    banner.setAttribute("aria-live", "polite");
    const titre = document.getElementById("jeu-titre");
    titre?.parentNode?.insertBefore(banner, titre.nextSibling);
  }
  const j = JOUEURS[duel.tour];
  banner.innerHTML =
    `<span class="duel-banner-tour">⚔️ Au tour de ${j.emoji} <strong>${j.nom}</strong></span>` +
    `<span class="duel-banner-scores">🔵 ${duel.scores[0]} — ${duel.scores[1]} 🔴</span>`;
  banner.hidden = false;
}

function retirerBanniere() {
  const banner = document.getElementById("duel-banner");
  if (banner) banner.remove();
}

export function signalerReponseDuel(estCorrect) {
  if (!duel) return;
  if (estCorrect) duel.scores[duel.tour] += 1;
  duel.repondues += 1;
  if (duel.repondues >= NB_QUESTIONS_TOTAL) {
    finirDuel();
    return;
  }
  duel.tour = duel.repondues % 2;
  majBanniere();
}

function finirDuel() {
  const [s1, s2] = duel.scores;
  track("duel_end", { game_name: duel.jeu, niveau: getNiveauCourant(), score1: s1, score2: s2 });
  const jeuRejouer = duel.jeu;
  duel = null;
  retirerBanniere();

  const overlay = document.createElement("div");
  overlay.id = "duel-resultat-overlay";
  overlay.className = "duel-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Résultat du duel");
  const boite = document.createElement("div");
  boite.className = "duel-boite";

  let emoji, titreTxt, sousTxt;
  if (s1 === s2) {
    emoji = "🤝";
    titreTxt = "Égalité !";
    sousTxt = "Bravo à tous les deux, quelle équipe !";
  } else {
    const gagnant = s1 > s2 ? JOUEURS[0] : JOUEURS[1];
    emoji = "🏆";
    titreTxt = `${gagnant.emoji} ${gagnant.nom} gagne !`;
    sousTxt = "Bien joué à tous les deux, c'était un beau duel !";
  }
  boite.innerHTML =
    `<div class="duel-resultat-emoji">${emoji}</div>` +
    `<h2 class="duel-titre">${titreTxt}</h2>` +
    `<p class="duel-resultat-scores">🔵 Joueur 1 : <strong>${s1}</strong> · 🔴 Joueur 2 : <strong>${s2}</strong></p>` +
    `<p class="duel-sous">${sousTxt}</p>`;

  const btnRejouer = document.createElement("button");
  btnRejouer.type = "button";
  btnRejouer.id = "btn-duel-rejouer";
  btnRejouer.className = "duel-btn-action";
  btnRejouer.textContent = "⚔️ Revanche !";
  btnRejouer.addEventListener("click", () => {
    overlay.remove();
    demarrerDuel(jeuRejouer);
  });
  const btnMenu = document.createElement("button");
  btnMenu.type = "button";
  btnMenu.id = "btn-duel-retour-menu";
  btnMenu.className = "duel-btn-fermer";
  btnMenu.textContent = "← Retour au menu";
  btnMenu.addEventListener("click", () => {
    overlay.remove();
    deps?.entrerMenu();
  });
  boite.appendChild(btnRejouer);
  boite.appendChild(btnMenu);
  overlay.appendChild(boite);
  document.body.appendChild(overlay);
}

export function annulerDuelSiActif() {
  if (!duel) return;
  track("duel_abandon", { game_name: duel.jeu, niveau: getNiveauCourant() });
  duel = null;
  retirerBanniere();
}

export function initDuel(d) {
  deps = d;
  const btn = document.getElementById("btn-duel");
  if (btn) {
    btn.addEventListener("click", () => {
      track("duel_from_menu", { niveau: getNiveauCourant() });
      ouvrirChoixJeu();
    });
  }
}
