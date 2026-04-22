// games-argent.js — lancerMonnaieCp, lancerMonnaieCe1

import {
  elTitre,
  elQuestion,
  elChoix,
  setBonneReponse,
  getBonneReponse,
  estCE1,
  melanger,
  entiersDistincts,
} from "./app-state.js";

import { apresReponse } from "./app-nav.js";

// ── Pièces ────────────────────────────────────────────────────────────────────
const PIECES_DEF = [
  { val: 1,   label: "1c",  color: "#b87333", r: 18 },
  { val: 2,   label: "2c",  color: "#b87333", r: 20 },
  { val: 5,   label: "5c",  color: "#b87333", r: 22 },
  { val: 10,  label: "10c", color: "#c0c0c0", r: 22 },
  { val: 20,  label: "20c", color: "#c0c0c0", r: 24 },
  { val: 50,  label: "50c", color: "#c0c0c0", r: 26 },
  { val: 100, label: "1€",  color: "#f9ca24", r: 28 },
  { val: 200, label: "2€",  color: "#f9ca24", r: 30 },
];

function labelCents(v) {
  if (v === 0) return "0€";
  return v % 100 === 0 ? `${v / 100}€` : `${v}c`;
}

function labelEuros(v) {
  if (v === 0) return "0€";
  if (v % 100 === 0) return `${v / 100}€`;
  const euros = Math.floor(v / 100);
  const cents = String(v % 100).padStart(2, "0");
  return euros > 0 ? `${euros},${cents}€` : `0,${cents}€`;
}

const ARTICLES_BOUTIQUE = [
  { nom: "un livre", emoji: "📚" },
  { nom: "un jouet", emoji: "🧸" },
  { nom: "une glace", emoji: "🍦" },
  { nom: "un cahier", emoji: "📓" },
  { nom: "des crayons", emoji: "✏️" },
  { nom: "un ballon", emoji: "⚽" },
  { nom: "une gomme", emoji: "🖊️" },
  { nom: "un gâteau", emoji: "🍰" },
];

function svgPiecesLigne(pieces) {
  let x = 0;
  let circles = "";
  pieces.forEach((p) => {
    x += p.r + 6;
    circles += `<circle cx="${x}" cy="32" r="${p.r}" fill="${p.color}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>`;
    circles += `<text x="${x}" y="${32 + p.r * 0.27}" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="${Math.round(p.r * 0.65)}" font-weight="700" fill="rgba(0,0,0,0.5)">${p.label}</text>`;
    x += p.r + 6;
  });
  return `<svg width="${x}" height="64" viewBox="0 0 ${x} 64">${circles}</svg>`;
}

// ── lancerMonnaieCp ───────────────────────────────────────────────────────────
export function lancerMonnaieCp() {
  elTitre.textContent = "🪙 La monnaie";
  const pool = estCE1() ? PIECES_DEF : PIECES_DEF.slice(0, 6);
  const nbPieces = 2 + Math.floor(Math.random() * 2);
  const chosenPieces = [];
  let total = 0;
  for (let i = 0; i < nbPieces; i++) {
    const available = pool.filter((p) => total + p.val <= (estCE1() ? 200 : 100));
    if (!available.length) break;
    const p = available[Math.floor(Math.random() * available.length)];
    chosenPieces.push(p);
    total += p.val;
  }
  if (total === 0 || chosenPieces.length < 2) { lancerMonnaieCp(); return; }
  setBonneReponse(total);

  elQuestion.innerHTML = `<div class="monnaie-question">
    <p>Quelle est la valeur <strong>totale</strong> de ces pièces ?</p>
    <div style="overflow-x:auto;text-align:center;margin-top:0.4rem">${svgPiecesLigne(chosenPieces)}</div>
  </div>`;

  const dist = entiersDistincts(Math.max(1, total - 20), total + 20, 3, total);
  const opts = melanger([total, ...dist]);
  elChoix.innerHTML = "";
  opts.forEach((v) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.textContent = labelCents(v);
    b.dataset.valeur = String(v);
    b.addEventListener("click", () => apresReponse(v, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── lancerMonnaieCe1 ──────────────────────────────────────────────────────────
export function lancerMonnaieCe1() {
  elTitre.textContent = "🛍️ La monnaie";

  // 35% : question total de 2 articles ; 65% : rendu de monnaie
  const typeTotal = Math.random() < 0.35;
  if (typeTotal) {
    const pool2 = melanger(ARTICLES_BOUTIQUE).slice(0, 2);
    const prixA = [100, 150, 200, 250, 300][Math.floor(Math.random() * 5)];
    const prixB = [100, 150, 200, 250, 300][Math.floor(Math.random() * 5)];
    const total = prixA + prixB;
    setBonneReponse(total);
    elQuestion.innerHTML = `<div class="monnaie-question">
      <p style="font-size:0.85rem;margin:0 0 0.35rem">Combien coûtent ces articles <strong>en tout</strong> ?</p>
      <div class="monnaie-ligne">${pool2[0].emoji} ${pool2[0].nom} → <strong>${labelEuros(prixA)}</strong></div>
      <div class="monnaie-ligne">${pool2[1].emoji} ${pool2[1].nom} → <strong>${labelEuros(prixB)}</strong></div>
      <div class="monnaie-ligne">💰 Total = <strong>?</strong></div>
    </div>`;
    const dist = entiersDistincts(Math.max(100, total - 300), Math.min(700, total + 300), 3, total);
    const opts = melanger([total, ...dist]);
    elChoix.innerHTML = "";
    opts.forEach((v) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix";
      b.textContent = labelEuros(v); b.dataset.valeur = String(v);
      b.addEventListener("click", () => apresReponse(v, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
    return;
  }

  const prixOptions = [100, 150, 200, 250, 300, 400, 500, 750, 1000];
  const prix = prixOptions[Math.floor(Math.random() * prixOptions.length)];
  const billets = [200, 500, 1000, 2000].filter((b) => b > prix);
  if (!billets.length) { lancerMonnaieCe1(); return; }
  const paye = billets[Math.floor(Math.random() * billets.length)];
  const monnaie = paye - prix;
  setBonneReponse(monnaie);

  const article = ARTICLES_BOUTIQUE[Math.floor(Math.random() * ARTICLES_BOUTIQUE.length)];

  elQuestion.innerHTML = `<div class="monnaie-question">
    <p style="font-size:0.85rem;margin:0 0 0.35rem">Tu paies <strong>${labelEuros(paye)}</strong>. Tu reçois du rendu. Quel est le rendu ?</p>
    <div class="monnaie-ligne">${article.emoji} Tu achètes ${article.nom}</div>
    <div class="monnaie-ligne">🏷️ Ça coûte <strong>${labelEuros(prix)}</strong></div>
    <div class="monnaie-ligne">💵 Tu donnes <strong>${labelEuros(paye)}</strong></div>
    <div class="monnaie-ligne">💰 On te rend <strong>?</strong></div>
  </div>`;

  const dist = entiersDistincts(Math.max(1, monnaie - 200), Math.min(2000, monnaie + 300), 3, monnaie);
  const opts = melanger([monnaie, ...dist]);
  elChoix.innerHTML = "";
  opts.forEach((v) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.textContent = labelEuros(v);
    b.dataset.valeur = String(v);
    b.addEventListener("click", () => apresReponse(v, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}
