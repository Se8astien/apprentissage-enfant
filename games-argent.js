// games-argent.js — lancerMonnaieCp, lancerMonnaieCe1

import {
  elTitre,
  elQuestion,
  elChoix,
  setBonneReponse,
  getBonneReponse,
  estCE1,
  estCE2,
  melanger,
  entiersDistincts,
  getDifficulte,
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

// ── Billets ───────────────────────────────────────────────────────────────────
const BILLETS_DEF = [
  { val: 500,  label: "5€",  color: "#2ecc71" },
  { val: 1000, label: "10€", color: "#3498db" },
  { val: 2000, label: "20€", color: "#9b59b6" },
  { val: 5000, label: "50€", color: "#e67e22" },
];

function svgBillet(val, label, color) {
  return `<svg width="72" height="36" viewBox="0 0 72 36">
    <rect x="1" y="1" width="70" height="34" rx="4" fill="${color}" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
    <text x="36" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="white" font-family="Fredoka,sans-serif">${label}</text>
  </svg>`;
}

// ── lancerMonnaieCp ───────────────────────────────────────────────────────────
export function lancerMonnaieCp() {
  elTitre.textContent = "🪙 La monnaie";
  const diff = getDifficulte();

  if (estCE2()) {
    // Pick 2 notes randomly
    const noteA = BILLETS_DEF[Math.floor(Math.random() * BILLETS_DEF.length)];
    const noteB = BILLETS_DEF[Math.floor(Math.random() * BILLETS_DEF.length)];
    const total = noteA.val + noteB.val;
    setBonneReponse(total);

    const billetsSvg = [noteA, noteB]
      .map(b => svgBillet(b.val, b.label, b.color))
      .join('<span style="display:inline-block;width:12px"></span>');

    elQuestion.innerHTML = `<div class="monnaie-question">
      <p>Quelle est la valeur <strong>totale</strong> de ces billets ?</p>
      <div style="text-align:center;margin-top:0.6rem">${billetsSvg}</div>
    </div>`;

    const dist = entiersDistincts(Math.max(500, total - 3000), total + 3000, 3, total);
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

  const pool = estCE1() ? PIECES_DEF : PIECES_DEF.slice(0, 6);
  const nbPieces = [2, 3, 4][diff] + Math.floor(Math.random() * 2);
  const maxTotal = estCE1() ? [150, 200, 300][diff] : [50, 75, 100][diff];
  const chosenPieces = [];
  let total = 0;
  for (let i = 0; i < nbPieces; i++) {
    const available = pool.filter((p) => total + p.val <= maxTotal);
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

  if (estCE2()) {
    // 3 items at integer euro prices (1€–15€ each). Pay with 50€ note.
    const articles = melanger(ARTICLES_BOUTIQUE).slice(0, 3);
    const prixA = (1 + Math.floor(Math.random() * 15)) * 100;
    const prixB = (1 + Math.floor(Math.random() * 15)) * 100;
    const prixC = (1 + Math.floor(Math.random() * 15)) * 100;
    const total = prixA + prixB + prixC;
    const paye = 5000; // 50€
    if (total >= paye) { lancerMonnaieCe1(); return; }
    const change = paye - total;
    setBonneReponse(change);

    elQuestion.innerHTML = `<div class="monnaie-question">
      <p style="font-size:0.85rem;margin:0 0 0.35rem">Ces 3 articles coûtent <strong>${labelEuros(prixA)}</strong>, <strong>${labelEuros(prixB)}</strong> et <strong>${labelEuros(prixC)}</strong>. Tu paies <strong>50€</strong>. Combien reçois-tu ?</p>
      <div class="monnaie-ligne">${articles[0].emoji} ${articles[0].nom} → <strong>${labelEuros(prixA)}</strong></div>
      <div class="monnaie-ligne">${articles[1].emoji} ${articles[1].nom} → <strong>${labelEuros(prixB)}</strong></div>
      <div class="monnaie-ligne">${articles[2].emoji} ${articles[2].nom} → <strong>${labelEuros(prixC)}</strong></div>
      <div class="monnaie-ligne">💵 Tu donnes <strong>50€</strong></div>
      <div class="monnaie-ligne">💰 On te rend <strong>?</strong></div>
    </div>`;

    const dist = entiersDistincts(Math.max(100, change - 1000), Math.min(4900, change + 1000), 3, change);
    const opts = melanger([change, ...dist]);
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

export function lancerMarcheMalin() {
  elTitre.textContent = "🛒 Marché malin";
  const diff = getDifficulte();
  const nbArticles = estCE2() ? 3 : estCE1() ? [2, 2, 3][diff] : 2;
  const pool = melanger(ARTICLES_BOUTIQUE).slice(0, nbArticles);
  const prixBase = estCE2()
    ? [100, 150, 200, 250, 300, 350, 400, 500]
    : estCE1()
      ? [50, 100, 150, 200, 250, 300]
      : [20, 50, 80, 100, 120];

  const prix = pool.map(() => prixBase[Math.floor(Math.random() * prixBase.length)]);
  const total = prix.reduce((acc, v) => acc + v, 0);
  setBonneReponse(total);

  const lignes = pool.map((a, i) =>
    `<div class="monnaie-ligne">${a.emoji} ${a.nom} → <strong>${labelEuros(prix[i])}</strong></div>`
  ).join("");

  elQuestion.innerHTML = `<div class="monnaie-question">
    <p style="font-size:0.9rem;margin:0 0 0.35rem">
      Tu prends ${nbArticles} article${nbArticles > 1 ? "s" : ""}. Combien dois-tu payer en tout ?
    </p>
    ${lignes}
    <div class="monnaie-ligne">🧾 Total = <strong>?</strong></div>
  </div>`;

  const marge = estCE2() ? 300 : estCE1() ? 200 : 100;
  const faux = entiersDistincts(Math.max(1, total - marge), total + marge, 3, total);
  const opts = melanger([total, ...faux]);
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
