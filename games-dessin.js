// games-dessin.js — Reproduis le motif (repérage visuel, grilles colorées)

import {
  elTitre,
  elQuestion,
  elChoix,
  getNiveauCourant,
  melanger,
  setBonneReponse,
} from "./app-state.js";

import { apresReponse } from "./app-nav.js";

const COULEURS = ["🟥", "🟦", "🟩", "🟨", "🟪", "🟧"];

const TAILLE_PAR_NIVEAU = {
  cp: { taille: 2, nbCouleurs: 2 },
  ce1: { taille: 2, nbCouleurs: 3 },
  ce2: { taille: 3, nbCouleurs: 3 },
  cm1: { taille: 3, nbCouleurs: 4 },
  cm2: { taille: 4, nbCouleurs: 4 },
};

function genererGrille(taille, nbCouleurs) {
  const palette = COULEURS.slice(0, nbCouleurs);
  const grille = [];
  for (let i = 0; i < taille * taille; i++) {
    grille.push(palette[Math.floor(Math.random() * palette.length)]);
  }
  return grille;
}

function grilleEgale(a, b) {
  return a.length === b.length && a.every((c, i) => c === b[i]);
}

function grilleHTML(grille, taille) {
  return `<div class="dessin-grille" style="display:grid;grid-template-columns:repeat(${taille}, 1fr);gap:4px;justify-content:center;font-size:1.8rem;line-height:1">
    ${grille.map(c => `<span>${c}</span>`).join("")}
  </div>`;
}

function variante(grille, nbCouleurs) {
  const palette = COULEURS.slice(0, nbCouleurs);
  const copie = [...grille];
  const idx = Math.floor(Math.random() * copie.length);
  let nouvelle = palette[Math.floor(Math.random() * palette.length)];
  if (palette.length > 1) {
    while (nouvelle === copie[idx]) {
      nouvelle = palette[Math.floor(Math.random() * palette.length)];
    }
  }
  copie[idx] = nouvelle;
  return copie;
}

export function lancerDessin() {
  const niveau = getNiveauCourant();
  const { taille, nbCouleurs } = TAILLE_PAR_NIVEAU[niveau] || TAILLE_PAR_NIVEAU.cp;
  const modele = genererGrille(taille, nbCouleurs);

  const grilles = [modele];
  while (grilles.length < 3) {
    const v = variante(modele, nbCouleurs);
    if (!grilles.some(g => grilleEgale(g, v))) grilles.push(v);
  }

  elTitre.textContent = "🎨 Reproduis le motif";
  elQuestion.innerHTML = `
    <p>Retrouve la grille identique au modèle :</p>
    ${grilleHTML(modele, taille)}
  `;

  const options = melanger(grilles);
  const bonIndex = options.findIndex(g => grilleEgale(g, modele));
  setBonneReponse(bonIndex);

  elChoix.innerHTML = "";
  options.forEach((grille, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-choix dessin-choix";
    btn.innerHTML = grilleHTML(grille, taille);
    btn.addEventListener("click", () => apresReponse(idx, btn, bonIndex));
    elChoix.appendChild(btn);
  });
}
