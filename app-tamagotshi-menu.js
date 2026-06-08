// app-tamagotshi-menu.js — Tamagotshi renard sur l'écran menu

import {
  lireEtoiles,
  lireFaim,
  lireBonheur,
  sauverFaim,
  sauverBonheur,
  lireNomRenard,
  confetti,
  estGrand,
  localDate,
} from "./app-state.js";

import { getStade, svgRenard } from "./app-renard.js";
import { sonBonne } from "./app-sons.js";

const MESSAGES = {
  nourrir: [
    "Yum yum ! 😋 Merci !",
    "Miam miam ! Déli­cieux !",
    "C'était bon ! Bol ! 🍖",
    "Slurp ! Plus, plus ! 🤤",
  ],
  calin: [
    "Mmmm... 🤗 Trop bien !",
    "Ronron... ❤️ J'aime !",
    "Câlin câlin ! 💕",
    "Merci... te ❤️",
  ],
  jouer: [
    "Allons-y ! 🎮✨",
    "J'ai hâte ! Yess ! 🚀",
    "Hourra ! On joue ? 🎉",
  ],
  sad: [
    "J'ai un peu faim...",
    "Tu me manques...",
    "J'attends ton aide...",
  ],
};

export function initialiserTamagotchiMenu() {
  const tamagotshiEl = document.getElementById("tamagotshi-renard");
  if (!tamagotshiEl) return;

  rafraichirTamagotchiUI();

  // Événements
  document.getElementById("btn-tamagotshi-nourrir")?.addEventListener("click", nourrir);
  document.getElementById("btn-tamagotshi-calin")?.addEventListener("click", calin);
  document.getElementById("btn-tamagotshi-jouer")?.addEventListener("click", jouer);

  // Clic sur le renard = câlin
  tamagotshiEl.addEventListener("click", calin);

  // Rafraichir periodicly
  setInterval(rafraichirTamagotchiUI, 5000);
}

export function rafraichirTamagotchiUI() {
  const nom = lireNomRenard();
  const etoiles = lireEtoiles();
  const stade = getStade(etoiles);
  const faim = Math.max(0, lireFaim());
  const bonheur = Math.max(0, lireBonheur());

  // Mettre à jour le renard
  const tamagotshiEl = document.getElementById("tamagotshi-renard");
  if (tamagotshiEl) {
    tamagotshiEl.innerHTML = svgRenard(stade, 180, {
      accessoires: {},
      triste: bonheur < 30,
    });
  }

  // Mettre à jour les textes
  const nomEl = document.getElementById("tamagotshi-nom");
  if (nomEl) nomEl.textContent = nom;

  const stadeEl = document.getElementById("tamagotshi-stade");
  if (stadeEl) stadeEl.textContent = [
    "Bébé renard 🥚",
    "Jeune renard 🐥",
    "Renard malin 🦊",
    "Renard magique ✨",
    "Renard légendaire ⭐",
  ][stade];

  // Mettre à jour les stats (0-100%)
  const faim100 = Math.min(100, Math.max(0, faim / 10));
  const bonheur100 = Math.min(100, Math.max(0, bonheur / 3));

  const statFaim = document.getElementById("stat-faim");
  const statBonheur = document.getElementById("stat-bonheur");

  if (statFaim) statFaim.style.width = faim100 + "%";
  if (statBonheur) statBonheur.style.width = bonheur100 + "%";

  // Message automatique si triste
  if (bonheur < 20) {
    afficherMessage(MESSAGES.sad[Math.floor(Math.random() * MESSAGES.sad.length)]);
  }
}

function nourrir() {
  const faim = lireFaim();
  if (faim < 5) {
    afficherMessage("Mon ventre est déjà plein ! 😄");
    return;
  }

  sauverFaim(Math.max(0, faim - 15));
  const bonheur = lireBonheur();
  sauverBonheur(Math.min(100, bonheur + 5));

  afficherMessage(MESSAGES.nourrir[Math.floor(Math.random() * MESSAGES.nourrir.length)]);
  sonBonne();
  confetti({ tier: "sparkle" });
  rafraichirTamagotchiUI();
}

function calin() {
  const bonheur = lireBonheur();
  sauverBonheur(Math.min(100, bonheur + 10));

  const faim = lireFaim();
  sauverFaim(Math.min(100, faim + 3));

  afficherMessage(MESSAGES.calin[Math.floor(Math.random() * MESSAGES.calin.length)]);
  sonBonne();
  confetti({ tier: "sparkle", sobre: true });
  rafraichirTamagotchiUI();
}

function jouer() {
  // Le clic sur "Jouer" n'ouvre pas un jeu, ça va lancer un jeu aléatoire
  // Pour l'instant on affiche juste un message
  const bonheur = lireBonheur();
  sauverBonheur(Math.min(100, bonheur + 8));

  const faim = lireFaim();
  sauverFaim(Math.min(100, faim + 5)); // Jouer augmente la faim

  afficherMessage(MESSAGES.jouer[Math.floor(Math.random() * MESSAGES.jouer.length)]);
  sonBonne();
  confetti({ tier: "sparkle" });
  rafraichirTamagotchiUI();

  // TODO: Ouvrir un jeu aléatoire ou le menu de jeux
}

function afficherMessage(msg) {
  const msgEl = document.getElementById("tamagotshi-message");
  if (!msgEl) return;

  msgEl.textContent = msg;
  msgEl.style.animation = "none";
  setTimeout(() => {
    msgEl.style.animation = "fadeInOut 2s ease-in-out forwards";
  }, 10);
}

export { rafraichirTamagotchiUI as majTamagotchiMenu };
