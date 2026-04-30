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
  { q: q("Programme :", "x ← 2\nRÉPÉTER 3 FOIS\n  x ← x + 2\nAfficher x", "Que va afficher le programme ?"),
    bonne: "8", fausses: ["6", "4", "2"] },
  { q: q("Programme :", "SI 3 > 8 ALORS\n  Afficher 'Oui'\nSINON\n  Afficher 'Non'", "Que va afficher le programme ?"),
    bonne: "'Non'", fausses: ["'Oui'", "3", "8"] },
  { q: q("Programme :", "x ← 10\nx ← x - 4\nAfficher x", "Que va afficher le programme ?"),
    bonne: "6", fausses: ["14", "4", "10"] },
  { q: q("Programme :", "n ← 0\nRÉPÉTER 5 FOIS\n  n ← n + 1\nAfficher n", "Que va afficher le programme ?"),
    bonne: "5", fausses: ["0", "4", "6"] },
  { q: q("Programme :", "x ← 6\nSI x MOD 2 = 0 ALORS\n  Afficher 'Pair'\nSINON\n  Afficher 'Impair'", "Que va afficher le programme ?"),
    bonne: "'Pair'", fausses: ["'Impair'", "6", "0"] },
  { q: q("Programme :", "x ← 3\nSI x MOD 2 = 0 ALORS\n  Afficher 'Pair'\nSINON\n  Afficher 'Impair'", "Que va afficher le programme ?"),
    bonne: "'Impair'", fausses: ["'Pair'", "3", "1"] },
  { q: q("🐛 Ce programme doit afficher 15, mais il affiche 13 :", "x ← 5\nx ← x + 8\nAfficher x", "Quelle ligne contient l'erreur ?"),
    bonne: "x ← x + 8 (devrait être + 10)", fausses: ["x ← 5", "Afficher x", "Il n'y a pas d'erreur"] },
  { q: q("Programme :", "a ← 4\nb ← 3\nAfficher a × b", "Que va afficher le programme ?"),
    bonne: "12", fausses: ["7", "1", "34"] },
];

const CODE_CM1 = [
  { q: q("Programme :", "x ← 3\ny ← 2\nAfficher x × y", "Que va afficher le programme ?"),
    bonne: "6", fausses: ["5", "9", "1"] },
  { q: q("Programme :", "n ← 1\nRÉPÉTER 4 FOIS\n  n ← n × 2\nAfficher n", "Que va afficher le programme ?"),
    bonne: "16", fausses: ["8", "4", "2"] },
  { q: q("Programme :", "n ← 12\nRÉPÉTER 2 FOIS\n  n ← n ÷ 2\nAfficher n", "Que va afficher le programme ?"),
    bonne: "3", fausses: ["6", "4", "24"] },
  { q: q("Programme :", "x ← 1\ny ← 1\nz ← x + y\nAfficher z", "Que va afficher le programme ?"),
    bonne: "2", fausses: ["1", "11", "0"] },
  { q: q("Programme :", "n ← 0\nRÉPÉTER 3 FOIS\n  n ← n + 5\nAfficher n", "Que va afficher le programme ?"),
    bonne: "15", fausses: ["5", "10", "20"] },
  { q: q("Programme avec condition complexe :", "x ← 3\ny ← 4\nSI x > 5 ET y > 0 ALORS\n  Afficher 'Oui'\nSINON\n  Afficher 'Non'", "Que va afficher le programme ? (x=3 n'est pas > 5)"),
    bonne: "'Non'", fausses: ["'Oui'", "3", "4"] },
  { q: q("Programme :", "x ← 7\nAfficher x × x", "Que va afficher le programme ?"),
    bonne: "49", fausses: ["14", "7", "77"] },
  { q: q("🐛 Ce programme doit afficher 20 :", "x ← 5\nx ← x + 12\nAfficher x", "Quelle est l'erreur ?"),
    bonne: "x ← x + 12 (devrait être + 15)", fausses: ["x ← 5", "Afficher x", "Il n'y a pas d'erreur"] },
  { q: q("Programme :", "a ← 8\nb ← 3\nAfficher a MOD b", "Que va afficher le programme ? (MOD = reste de la division)"),
    bonne: "2", fausses: ["3", "5", "0"] },
  { q: q("Variable piège :", "a ← 5\nb ← a\na ← a + 3\nAfficher b", "Que va afficher le programme ? (b a été copié AVANT la modification de a)"),
    bonne: "5", fausses: ["8", "3", "13"] },
  { q: q("Programme :", "n ← 2\nRÉPÉTER 3 FOIS\n  n ← n × n\nAfficher n", "Après 1 répétition n=4, après 2 répétitions n=16. Que vaut n à la fin ?"),
    bonne: "256", fausses: ["16", "64", "8"] },
  { q: q("Programme :", "n ← 15\nSI n MOD 3 = 0 ALORS\n  Afficher 'Multiple de 3'\nSINON\n  Afficher 'Pas multiple de 3'", "Que va afficher le programme ?"),
    bonne: "'Multiple de 3'", fausses: ["'Pas multiple de 3'", "15", "0"] },
];

const CODE_CM2 = [
  { q: q("Boucle imbriquée :", "RÉPÉTER 3 FOIS\n  RÉPÉTER 2 FOIS\n    Dessiner ★\nCombien d'étoiles ?", "Que va afficher le programme ?"),
    bonne: "6 étoiles", fausses: ["5 étoiles", "3 étoiles", "2 étoiles"] },
  { q: q("Suite de Fibonacci : 1, 1, 2, 3, 5, 8 …", "a ← 5\nb ← 8\nc ← a + b\nAfficher c", "Quel est le prochain terme de la suite ?"),
    bonne: "13", fausses: ["10", "11", "16"] },
  { q: q("Programme :", "a ← 2\nb ← 3\nc ← a × b\nAfficher c + 1", "Que va afficher le programme ?"),
    bonne: "7", fausses: ["6", "5", "8"] },
  { q: q("Échange de variables :", "x ← 5\ny ← 3\nt ← x\nx ← y\ny ← t\nAfficher x", "Que va afficher le programme ?"),
    bonne: "3", fausses: ["5", "8", "t"] },
  { q: q("Programme :", "n ← 1024\nRÉPÉTER 4 FOIS\n  n ← n ÷ 2\nAfficher n", "Que va afficher le programme ?"),
    bonne: "64", fausses: ["128", "32", "256"] },
  { q: q("Programme Pythagore :", "a ← 3\nb ← 4\nAfficher a×a + b×b", "Que va afficher le programme ?"),
    bonne: "25", fausses: ["14", "7", "12"] },
  { q: q("Programme :", "x ← 5\ny ← x + 1\nz ← y + 1\nAfficher z", "Que va afficher le programme ?"),
    bonne: "7", fausses: ["5", "6", "8"] },
  { q: q("Condition double :", "x ← 5\nSI x > 0 ET x < 10 ALORS\n  Afficher 'OK'\nSINON\n  Afficher 'Hors limite'", "Que va afficher le programme ?"),
    bonne: "'OK'", fausses: ["'Hors limite'", "5", "0"] },
  { q: q("Programme :", "n ← 0\nRÉPÉTER 5 FOIS\n  n ← n + n + 1\nAfficher n", "Après 3 répétitions: 0→1→3→7. Que vaut n à la fin ?"),
    bonne: "31", fausses: ["15", "10", "25"] },
  { q: q("🐛 Ce programme doit afficher 12, mais il affiche 8 :", "x ← 2\nRÉPÉTER 3 FOIS\n  x ← x + 2\nAfficher x", "Quel est le problème ?"),
    bonne: "RÉPÉTER 3 FOIS (devrait être 5 fois)", fausses: ["x ← 2 (devrait être 4)", "x ← x + 2 (devrait être + 4)", "Il n'y a pas d'erreur"] },
  { q: q("Tri à bulles — principe :", "Comparer a et b.\nSI a > b ALORS échanger a et b.", "Quel est le but de cette condition dans un algorithme de tri ?"),
    bonne: "Mettre le plus grand en dernier", fausses: ["Additionner a et b", "Multiplier a et b", "Supprimer le plus grand"] },
  { q: q("Programme :", "n ← 6\nrésultat ← 1\nRÉPÉTER n FOIS\n  résultat ← résultat + résultat\nAfficher résultat", "Que vaut résultat ? (2⁶)"),
    bonne: "64", fausses: ["32", "12", "36"] },
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
