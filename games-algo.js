// games-algo.js — lancerSequence, lancerCode

import {
  elTitre,
  elQuestion,
  elChoix,
  setBonneReponse,
  getBonneReponse,
  estCE1,
  estCE2,
  estCM1,
  estCM2,
  melanger,
  getDifficulte,
} from "./app-state.js";

import { apresReponse } from "./app-nav.js";

const LABYRINTHE_LOGIQUE = [
  { motif: "🟩 🟦 🟩 🟦 🟩 ?", bonne: "🟦", fausses: ["🟩", "🟥", "🟨"] },
  { motif: "⭐ ⭐ 🌙 ⭐ ⭐ 🌙 ?", bonne: "⭐", fausses: ["🌙", "☀️", "🌧️"] },
  { motif: "1 3 5 7 ?", bonne: "9", fausses: ["8", "10", "11"] },
  { motif: "🔺 🔺 🔻 🔺 🔺 ?", bonne: "🔻", fausses: ["🔺", "🔷", "🔵"] },
  { motif: "2 4 8 16 ?", bonne: "32", fausses: ["24", "18", "30"] },
  { motif: "⬆️ ➡️ ⬆️ ➡️ ⬆️ ?", bonne: "➡️", fausses: ["⬆️", "⬇️", "⬅️"] },
  { motif: "A C E G ?", bonne: "I", fausses: ["H", "J", "K"] },
  { motif: "🍎 🍌 🍎 🍌 🍎 ?", bonne: "🍌", fausses: ["🍎", "🍇", "🍐"] },
  { motif: "10 20 30 40 ?", bonne: "50", fausses: ["45", "60", "55"] },
  { motif: "🔴 🟡 🟢 🔴 🟡 ?", bonne: "🟢", fausses: ["🔴", "🟡", "🔵"] },
];

const PLANIFICATION_RENARD = [
  { q: "🦊 Le renard veut partir à l'école. Que doit-il faire EN PREMIER ?", bonne: "Mettre ses chaussures", fausses: ["Ouvrir son cahier", "Manger le goûter", "Dire bonsoir"] },
  { q: "🦊 Le renard plante une graine. Quelle étape vient juste APRÈS ?", bonne: "Arroser la graine", fausses: ["Cueillir la fleur", "Dormir", "Fermer le livre"] },
  { q: "🦊 Pour préparer un gâteau, quelle action vient AVANT la cuisson ?", bonne: "Verser la pâte", fausses: ["Manger le gâteau", "Laver le vélo", "Aller dormir"] },
  { q: "🦊 Le renard range sa chambre. Quelle action est la plus logique d'abord ?", bonne: "Ramasser les jouets", fausses: ["Éteindre la lumière", "Mettre le pyjama", "Ouvrir le frigo"] },
  { q: "🦊 Il est prêt pour le sport. Que fait-il en dernier ?", bonne: "Boire de l'eau", fausses: ["Mettre ses baskets", "Prendre son sac", "Sortir de la maison"] },
  { q: "🦊 Le renard lit une carte au trésor. Quelle action doit venir avant de creuser ?", bonne: "Trouver l'endroit X", fausses: ["Repartir à la maison", "Lancer le dé", "Colorier la carte"] },
];

function bloc(texte) {
  return `<div style="font-family:'Courier New',monospace;background:#f0eeff;border-radius:0.8rem;padding:0.65rem 1rem;margin:0.4rem auto;font-size:0.88rem;line-height:1.85;text-align:left;max-width:300px;border-left:3px solid #6c5ce7;color:#2d3436">${texte.replace(/\n/g, "<br>")}</div>`;
}

function q(intro, code, question) {
  return `<p style="font-size:0.85rem;margin:0 0 0.15rem;color:#636e72">${intro}</p>${bloc(code)}<p style="font-size:0.92rem;font-weight:600;margin:0.35rem 0 0">${question}</p>`;
}

function lancer(liste) {
  const item = liste[Math.floor(Math.random() * liste.length)];
  elQuestion.innerHTML = item.q;
  const fausses = melanger(item.fausses).slice(0, 3);
  const options = melanger([item.bonne, ...fausses]);
  setBonneReponse(options.indexOf(item.bonne));
  elChoix.innerHTML = "";
  options.forEach((opt, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.cssText = "font-size:0.9rem;padding:0.5rem 0.6rem";
    b.textContent = opt;
    b.dataset.valeur = String(idx);
    b.addEventListener("click", () => apresReponse(idx, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── Séquences (CP / CE1) ──────────────────────────────────────────────────────
const SEQ_CP = [
  { q: q("🤖 Le robot reçoit ces instructions :", "→  →  ↑  →", "Combien de fois va-t-il à droite (→) ?"),
    bonne: "3 fois", fausses: ["2 fois", "1 fois", "4 fois"] },
  { q: q("🤖 Programme du robot :", "↑  →  ↑  ↑", "Combien de fois monte-t-il (↑) ?"),
    bonne: "3 fois", fausses: ["4 fois", "2 fois", "1 fois"] },
  { q: q("🤖 Le robot suit un motif :", "↑ → ↑ → ↑ → ?", "Quelle instruction vient ensuite ?"),
    bonne: "↑", fausses: ["→", "↓", "←"] },
  { q: q("Pour se laver les mains, on fait ces étapes :", "A) Sécher\nB) Savonner\nC) Rincer\nD) Mouiller", "Quelle est la 1ère étape ?"),
    bonne: "D) Mouiller", fausses: ["B) Savonner", "C) Rincer", "A) Sécher"] },
  { q: q("Pour se brosser les dents, quelle étape vient EN DERNIER ?", "1) Mouiller la brosse\n2) Mettre le dentifrice\n3) Se brosser\n4) Rincer", "Quelle étape est la dernière ?"),
    bonne: "4) Rincer", fausses: ["1) Mouiller la brosse", "2) Mettre le dentifrice", "3) Se brosser"] },
  { q: q("🤖 Le robot dessine un carré :", "→ (droite)\n↓ (bas)\n← (gauche)\n? (dernière direction)", "Quelle instruction ferme le carré ?"),
    bonne: "↑ (monter)", fausses: ["→ (droite)", "← (gauche)", "↓ (bas)"] },
  { q: q("Programme simple :", "RÉPÉTER 3 FOIS\n  Avancer d'1 case", "De combien de cases le robot avance-t-il ?"),
    bonne: "3 cases", fausses: ["1 case", "2 cases", "4 cases"] },
  { q: q("Programme de dessin :", "RÉPÉTER 2 FOIS\n  Dessiner ⭐", "Combien d'étoiles va-t-il dessiner ?"),
    bonne: "2 étoiles", fausses: ["1 étoile", "3 étoiles", "4 étoiles"] },
  { q: q("🤖 Le robot part du chiffre 1 :", "Ajouter 1\nAjouter 1\nAjouter 1", "À quel chiffre arrive-t-il ?"),
    bonne: "4", fausses: ["3", "5", "2"] },
  { q: q("Combien d'instructions dans ce programme ?", "→  ↑  ←  ↓", "Compte le nombre total d'instructions."),
    bonne: "4 instructions", fausses: ["3 instructions", "5 instructions", "2 instructions"] },
  { q: q("Programme de saut :", "RÉPÉTER 4 FOIS\n  Sauter !", "Combien de fois le personnage saute-t-il ?"),
    bonne: "4 fois", fausses: ["3 fois", "5 fois", "2 fois"] },
  { q: q("Pour faire un gâteau, quelle étape vient EN 2ème ?", "1) Mélanger les ingrédients\n2) Préchauffer le four\n3) Verser la pâte\n4) Déguster", "Quelle est la 2ème étape ?"),
    bonne: "2) Préchauffer le four", fausses: ["1) Mélanger les ingrédients", "3) Verser la pâte", "4) Déguster"] },
];

const SEQ_CE1 = [
  { q: q("🎨 Un motif se répète :", "🔴🔵  🔴🔵  🔴🔵", "Quel est le motif de base qui se répète ?"),
    bonne: "🔴🔵", fausses: ["🔴🔴", "🔵🔴", "🔴🔵🔴"] },
  { q: q("🐛 Ce programme a une erreur. Il doit aller tout droit 3 fois :", "→  ↑  →", "Quelle instruction est fausse ?"),
    bonne: "↑ (2ème instruction)", fausses: ["→ (1ère instruction)", "→ (3ème instruction)", "Il n'y a pas d'erreur"] },
  { q: q("Programme :", "RÉPÉTER 4 FOIS\n  Avancer d'1 case", "De combien de cases avance le robot ?"),
    bonne: "4 cases", fausses: ["3 cases", "5 cases", "8 cases"] },
  { q: q("🤖 Le robot part de 5 :", "Ajouter 10\nAjouter 10", "À quel nombre arrive-t-il ?"),
    bonne: "25", fausses: ["20", "15", "30"] },
  { q: q("Programme de dessin :", "Dessiner ● 3 fois\nDessiner ▲ 2 fois", "Combien de formes en tout ?"),
    bonne: "5 formes", fausses: ["3 formes", "6 formes", "2 formes"] },
  { q: q("Le programme écrit des lettres dans l'ordre :", "Écrire B\nÉcrire O\nÉcrire N\nÉcrire J", "Quelle lettre est écrite en 3ème ?"),
    bonne: "N", fausses: ["B", "O", "J"] },
  { q: q("🤖 Instructions du robot :", "↑ ↑ → ↑ → ↑", "Combien de mouvements en tout ?"),
    bonne: "6 mouvements", fausses: ["4 mouvements", "5 mouvements", "7 mouvements"] },
  { q: q("🤖 Le robot part de 0 :", "RÉPÉTER 5 FOIS\n  Ajouter 1", "Quel est le résultat ?"),
    bonne: "5", fausses: ["0", "4", "6"] },
  { q: q("🎨 Motif de couleurs :", "🟡🟢🟡🟢🟡", "Quel motif de base se répète ?"),
    bonne: "🟡🟢", fausses: ["🟢🟡", "🟡🟡", "🟢🟢"] },
  { q: q("🐛 Ce programme doit répéter une action 4 fois, mais :", "RÉPÉTER 2 FOIS\n  Dessiner ⭐", "Quelle est l'erreur ?"),
    bonne: "2 devrait être 4", fausses: ["L'action est fausse", "Il n'y a pas d'erreur", "RÉPÉTER est mal écrit"] },
  { q: q("Programme :", "RÉPÉTER 3 FOIS\n  Ajouter 2\nDébut : 0", "Quel est le résultat final ?"),
    bonne: "6", fausses: ["3", "2", "8"] },
  { q: q("Pour ranger sa chambre, quelle étape vient EN DERNIER ?", "A) Ramasser les jouets\nB) Faire le lit\nC) Ranger les vêtements\nD) Fermer les tiroirs", "Quelle étape vient en dernier logiquement ?"),
    bonne: "D) Fermer les tiroirs", fausses: ["A) Ramasser les jouets", "B) Faire le lit", "C) Ranger les vêtements"] },
];

// ── Code pseudo (CE2 / CM1 / CM2) ────────────────────────────────────────────
const CODE_CE2 = [
  { q: q("Lis ce programme :", "x ← 5\nx ← x + 3\nAfficher x", "Que va afficher le programme ?"),
    bonne: "8", fausses: ["5", "3", "53"] },
  { q: q("Programme :", "a ← 10\nb ← 4\nAfficher a - b", "Que va afficher le programme ?"),
    bonne: "6", fausses: ["14", "4", "10"] },
  { q: q("Programme avec condition :", "SI 7 > 5 ALORS\n  Afficher 'Grand'\nSINON\n  Afficher 'Petit'", "Que va afficher le programme ?"),
    bonne: "'Grand'", fausses: ["'Petit'", "7", "5"] },
  { q: q("Programme de boucle :", "RÉPÉTER 4 FOIS\n  Afficher '⭐'", "Combien d'étoiles s'affichent ?"),
    bonne: "4 étoiles", fausses: ["3 étoiles", "5 étoiles", "1 étoile"] },
  { q: q("Programme :", "SI 3 > 8 ALORS\n  Afficher 'Oui'\nSINON\n  Afficher 'Non'", "Que va afficher le programme ?"),
    bonne: "'Non'", fausses: ["'Oui'", "3", "8"] },
  { q: q("Programme :", "x ← 10\nx ← x - 4\nAfficher x", "Que va afficher le programme ?"),
    bonne: "6", fausses: ["14", "4", "10"] },
  { q: q("Programme compteur :", "n ← 0\nRÉPÉTER 5 FOIS\n  n ← n + 1\nAfficher n", "Que va afficher le programme ?"),
    bonne: "5", fausses: ["0", "4", "6"] },
  { q: q("Programme :", "a ← 4\nb ← 3\nAfficher a × b", "Que va afficher le programme ?"),
    bonne: "12", fausses: ["7", "1", "34"] },
  { q: q("Programme :", "SI 10 > 20 ALORS\n  Afficher '🌞'\nSINON\n  Afficher '🌧️'", "Que va afficher le programme ?"),
    bonne: "'🌧️'", fausses: ["'🌞'", "10", "20"] },
  { q: q("Programme :", "score ← 0\nRÉPÉTER 3 FOIS\n  score ← score + 10\nAfficher score", "Que va afficher le programme ?"),
    bonne: "30", fausses: ["10", "0", "3"] },
  { q: q("🐛 Ce programme doit afficher 15, mais il affiche 13 :", "x ← 5\nx ← x + 8\nAfficher x", "Quelle ligne contient l'erreur ?"),
    bonne: "x ← x + 8 (devrait être + 10)", fausses: ["x ← 5", "Afficher x", "Il n'y a pas d'erreur"] },
  { q: q("Programme :", "vies ← 3\nRÉPÉTER 2 FOIS\n  vies ← vies - 1\nAfficher vies", "Combien de vies reste-t-il ?"),
    bonne: "1", fausses: ["2", "3", "0"] },
];

const CODE_CM1 = [
  { q: q("Programme :", "x ← 3\ny ← 4\nAfficher x + y", "Que va afficher le programme ?"),
    bonne: "7", fausses: ["12", "1", "34"] },
  { q: q("Programme :", "n ← 0\nRÉPÉTER 4 FOIS\n  n ← n + 3\nAfficher n", "Que va afficher le programme ?"),
    bonne: "12", fausses: ["3", "4", "7"] },
  { q: q("Programme :", "x ← 20\nx ← x ÷ 2\nx ← x ÷ 2\nAfficher x", "Que va afficher le programme ?"),
    bonne: "5", fausses: ["10", "4", "2"] },
  { q: q("Programme :", "points ← 100\nRÉPÉTER 3 FOIS\n  points ← points - 10\nAfficher points", "Que va afficher le programme ?"),
    bonne: "70", fausses: ["30", "90", "100"] },
  { q: q("Programme :", "x ← 5\ny ← x + 2\nAfficher y", "Que va afficher le programme ?"),
    bonne: "7", fausses: ["5", "2", "10"] },
  { q: q("Programme :", "SI 15 > 10 ALORS\n  Afficher 'Gagné !'\nSINON\n  Afficher 'Perdu...'", "Que va afficher le programme ?"),
    bonne: "'Gagné !'", fausses: ["'Perdu...'", "15", "10"] },
  { q: q("Programme :", "n ← 2\nRÉPÉTER 3 FOIS\n  n ← n × 2\nAfficher n", "2×2=4, 4×2=8, 8×2=? Que va afficher le programme ?"),
    bonne: "16", fausses: ["8", "6", "12"] },
  { q: q("🐛 Ce programme doit afficher 20 :", "score ← 5\nscore ← score + 12\nAfficher score", "Quelle est l'erreur ?"),
    bonne: "score ← score + 12 (devrait être + 15)", fausses: ["score ← 5", "Afficher score", "Il n'y a pas d'erreur"] },
  { q: q("Programme :", "a ← 6\nb ← 4\nAfficher a - b + 2", "Que va afficher le programme ?"),
    bonne: "4", fausses: ["2", "6", "12"] },
  { q: q("Programme :", "taille ← 10\ntaille ← taille + 5\ntaille ← taille - 3\nAfficher taille", "Que va afficher le programme ?"),
    bonne: "12", fausses: ["10", "15", "7"] },
  { q: q("Programme :", "n ← 0\nRÉPÉTER 6 FOIS\n  n ← n + 2\nAfficher n", "Que va afficher le programme ?"),
    bonne: "12", fausses: ["6", "8", "10"] },
  { q: q("Programme :", "SI 5 = 5 ALORS\n  Afficher '✅'\nSINON\n  Afficher '❌'", "Que va afficher le programme ?"),
    bonne: "'✅'", fausses: ["'❌'", "5", "0"] },
];

const CODE_CM2 = [
  { q: q("Programme :", "a ← 3\nb ← 4\nAfficher a × b - 2", "Que va afficher le programme ?"),
    bonne: "10", fausses: ["12", "5", "14"] },
  { q: q("Programme :", "x ← 5\ny ← x + 1\nAfficher x + y", "Que va afficher le programme ?"),
    bonne: "11", fausses: ["12", "6", "10"] },
  { q: q("Programme :", "n ← 1\nRÉPÉTER 4 FOIS\n  n ← n × 2\nAfficher n", "1×2=2, 2×2=4, 4×2=8, 8×2=? Que va afficher le programme ?"),
    bonne: "16", fausses: ["8", "32", "4"] },
  { q: q("Programme :", "vie ← 100\nRÉPÉTER 4 FOIS\n  vie ← vie - 15\nAfficher vie", "Que va afficher le programme ?"),
    bonne: "40", fausses: ["60", "85", "55"] },
  { q: q("Programme :", "SI 8 > 5 ET 3 < 10 ALORS\n  Afficher 'Vrai'\nSINON\n  Afficher 'Faux'", "Les 2 conditions sont vraies. Que va afficher le programme ?"),
    bonne: "'Vrai'", fausses: ["'Faux'", "8", "3"] },
  { q: q("Programme :", "x ← 2\ny ← x × 3\nz ← y + x\nAfficher z", "Que va afficher le programme ?"),
    bonne: "8", fausses: ["6", "10", "12"] },
  { q: q("Programme :", "n ← 32\nRÉPÉTER 4 FOIS\n  n ← n ÷ 2\nAfficher n", "32÷2=16, 16÷2=8… Que va afficher le programme ?"),
    bonne: "2", fausses: ["4", "8", "16"] },
  { q: q("🐛 Ce programme doit afficher 15, mais il affiche 11 :", "x ← 3\nRÉPÉTER 4 FOIS\n  x ← x + 2\nAfficher x", "Quelle est l'erreur ?"),
    bonne: "RÉPÉTER 4 FOIS (devrait être 6 fois)", fausses: ["x ← 3 (devrait être 5)", "x ← x + 2 (devrait être + 3)", "Il n'y a pas d'erreur"] },
  { q: q("Programme :", "total ← 0\nRÉPÉTER 5 FOIS\n  total ← total + 4\nAfficher total", "Que va afficher le programme ?"),
    bonne: "20", fausses: ["4", "5", "9"] },
  { q: q("Programme :", "x ← 10\ny ← x ÷ 2\nAfficher y + 3", "Que va afficher le programme ?"),
    bonne: "8", fausses: ["5", "13", "7"] },
  { q: q("Programme :", "SI 7 > 10 ALORS\n  Afficher 'A'\nSINON\n  Afficher 'B'", "Que va afficher le programme ?"),
    bonne: "'B'", fausses: ["'A'", "7", "10"] },
  { q: q("Programme :", "score ← 0\nRÉPÉTER 3 FOIS\n  score ← score + score + 1\nAfficher score", "score: 0→1→3→? Que va afficher le programme ?"),
    bonne: "7", fausses: ["6", "3", "9"] },
];

// ── Export : lancerSequence ───────────────────────────────────────────────────
export function lancerSequence() {
  elTitre.textContent = "🤖 Algorithmes";
  const diff = getDifficulte();
  let liste;
  if (estCM2() || estCM1()) {
    liste = diff === 0 ? SEQ_CE1.slice(0, 8) : diff === 1 ? SEQ_CE1 : [...SEQ_CE1, ...SEQ_CP.slice(0, 4)];
  } else if (estCE2() || estCE1()) {
    liste = diff === 0 ? SEQ_CE1.slice(0, 8) : diff === 1 ? SEQ_CE1 : [...SEQ_CE1, ...SEQ_CP.slice(0, 6)];
  } else {
    liste = diff === 0 ? SEQ_CP.slice(0, 8) : diff === 1 ? SEQ_CP : [...SEQ_CP, ...SEQ_CE1.slice(0, 4)];
  }
  lancer(liste);
}

// ── Export : lancerCode ───────────────────────────────────────────────────────
export function lancerCode() {
  elTitre.textContent = "💻 Code";
  const diff = getDifficulte();
  let liste;
  if (estCM2()) {
    liste = diff === 0 ? CODE_CM2.slice(0, 8) : diff === 1 ? CODE_CM2 : [...CODE_CM1, ...CODE_CM2];
  } else if (estCM1()) {
    liste = diff === 0 ? CODE_CM1.slice(0, 8) : diff === 1 ? CODE_CM1 : [...CODE_CM1, ...CODE_CM2.slice(0, 6)];
  } else if (estCE2()) {
    liste = diff === 0 ? CODE_CE2.slice(0, 8) : diff === 1 ? CODE_CE2 : [...CODE_CE2, ...CODE_CM1.slice(0, 6)];
  } else {
    liste = diff === 0 ? CODE_CE2.slice(0, 6) : diff === 1 ? CODE_CE2 : [...CODE_CE2, ...CODE_CM1.slice(0, 4)];
  }
  lancer(liste);
}

export function lancerLabyrintheLogique() {
  elTitre.textContent = "🧭 Labyrinthe logique";
  const diff = getDifficulte();
  const pool = diff === 0 ? LABYRINTHE_LOGIQUE.slice(0, 6) : diff === 1 ? LABYRINTHE_LOGIQUE : LABYRINTHE_LOGIQUE;
  const item = pool[Math.floor(Math.random() * pool.length)];
  const options = melanger([item.bonne, ...item.fausses.slice(0, 3)]);
  setBonneReponse(options.indexOf(item.bonne));

  elQuestion.innerHTML =
    "<p style='font-size:0.9rem;margin:0 0 0.35rem'>Trouve la prochaine case du chemin :</p>" +
    `<p style="font-size:1.35rem;font-weight:800;color:var(--primaire);margin:0">${item.motif}</p>`;

  elChoix.innerHTML = "";
  options.forEach((opt, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.fontSize = "1rem";
    b.textContent = opt;
    b.dataset.valeur = String(idx);
    b.addEventListener("click", () => apresReponse(idx, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

export function lancerPlanificationRenard() {
  elTitre.textContent = "🦊 Planification renard";
  const diff = getDifficulte();
  const pool = diff === 0 ? PLANIFICATION_RENARD.slice(0, 4) : diff === 1 ? PLANIFICATION_RENARD.slice(0, 5) : PLANIFICATION_RENARD;
  const item = pool[Math.floor(Math.random() * pool.length)];
  const options = melanger([item.bonne, ...item.fausses.slice(0, 3)]);
  setBonneReponse(options.indexOf(item.bonne));

  elQuestion.innerHTML = `<p style="font-size:0.92rem;margin:0 0 0.4rem">${item.q}</p>`;
  elChoix.innerHTML = "";
  options.forEach((opt, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.fontSize = "0.95rem";
    b.textContent = opt;
    b.dataset.valeur = String(idx);
    b.addEventListener("click", () => apresReponse(idx, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}
