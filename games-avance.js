// games-avance.js — lancerMultiplication, lancerDivision, lancerProbleme

import {
  ANIMAUX,
  elTitre,
  elQuestion,
  elChoix,
  setBonneReponse,
  getBonneReponse,
  estCE1,
  propositionsAvecBonne,
  afficherChoix,
} from "./app-state.js";

import { apresReponse } from "./app-nav.js";

// ── lancerMultiplication ──────────────────────────────────────────────────────
export function lancerMultiplication() {
  elTitre.textContent = "✖️ Multiplication";
  const tables = estCE1() ? [2, 3, 4, 5, 10] : [2, 3, 5];
  const mult = tables[Math.floor(Math.random() * tables.length)];
  const maxFact = estCE1() ? 10 : 5;
  const fact = 1 + Math.floor(Math.random() * maxFact);
  const produit = mult * fact;
  setBonneReponse(produit);

  const emoji = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
  let groupsHtml = "";
  if (!estCE1() && produit <= 30) {
    for (let g = 0; g < fact; g++) {
      groupsHtml += `<div class="mult-groupe">${Array(mult).fill(emoji).join("")}</div>`;
    }
    elQuestion.innerHTML = `<p style="font-size:0.9rem;font-weight:700;margin:0 0 0.5rem;color:var(--primaire)">${fact} groupe${fact > 1 ? "s" : ""} de ${mult} = combien en tout ?</p><div class="mult-grille">${groupsHtml}</div>`;
  } else if (estCE1()) {
    elQuestion.innerHTML =
      `<p style="font-size:0.85rem;margin:0 0 0.3rem">Calcule ce produit :</p>` +
      `<p class="equation" style="font-size:2.4rem;font-weight:700;margin:0.4rem 0">${fact} × ${mult} = ?</p>` +
      `<p style="font-size:0.78rem;color:#888">(tables × ${mult})</p>`;
  } else {
    for (let g = 0; g < fact; g++) {
      let dotsSvg = "";
      for (let d = 0; d < mult; d++) {
        dotsSvg += `<circle cx="${12 + (d % 5) * 18}" cy="${12 + Math.floor(d / 5) * 18}" r="7" fill="#6c5ce7"/>`;
      }
      const dw = Math.min(mult, 5) * 18 + 6;
      const dh = Math.ceil(mult / 5) * 18 + 6;
      groupsHtml += `<svg class="mult-dots" width="${dw}" height="${dh}" viewBox="0 0 ${dw} ${dh}">${dotsSvg}</svg>`;
    }
    elQuestion.innerHTML = `<p style="font-size:0.9rem;font-weight:700;margin:0 0 0.5rem;color:var(--primaire)">${fact} × ${mult} = ?</p><div class="mult-grille-dots">${groupsHtml}</div>`;
  }

  const pmin = Math.max(2, produit - 18), pmax = Math.min(110, produit + 18);
  const props = propositionsAvecBonne(produit, pmin, pmax, 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── lancerDivision ────────────────────────────────────────────────────────────
export function lancerDivision() {
  elTitre.textContent = "➗ Division";
  const diviseurs = estCE1() ? [2, 3, 4, 5, 10] : [2, 3];
  const diviseur = diviseurs[Math.floor(Math.random() * diviseurs.length)];
  const maxQuot = estCE1() ? 10 : 5;
  const quotient = 1 + Math.floor(Math.random() * maxQuot);
  const total = diviseur * quotient;
  setBonneReponse(quotient);

  const emoji = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
  let questionHtml;
  if (total <= 20) {
    const totalLine = Array(total).fill(emoji).join(" ");
    let groupsHtml = "";
    for (let g = 0; g < diviseur; g++) {
      groupsHtml += `<div class="div-groupe">${g === 0 ? Array(quotient).fill(emoji).join("") : "❓"}</div>`;
    }
    questionHtml = `<p style="font-size:0.88rem;margin:0 0 0.5rem">On partage <strong>${total}</strong> ${emoji} en <strong>${diviseur}</strong> groupes égaux. Combien dans chaque groupe ?</p>
      <div class="div-total">${totalLine}</div>
      <div class="div-arrow">▼</div>
      <div class="div-groupes">${groupsHtml}</div>`;
  } else {
    questionHtml = `<p style="font-size:0.88rem;margin:0 0 0.5rem">On partage <strong>${total}</strong> ${emoji} en <strong>${diviseur}</strong> groupes égaux. Combien dans chaque groupe ?</p>
      <p class="equation" style="font-size:2.2rem;font-weight:700;margin:.4rem 0">${total} ÷ ${diviseur} = ?</p>`;
  }
  elQuestion.innerHTML = `<div class="div-question">${questionHtml}</div>`;

  const props = propositionsAvecBonne(quotient, Math.max(1, quotient - 4), quotient + 4, 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── lancerProbleme ────────────────────────────────────────────────────────────
const PROBLEMES = {
  cp: [
    { generer() {
      const a = 4 + Math.floor(Math.random() * 5);
      const b = 1 + Math.floor(Math.random() * (a - 1));
      return { texte: `Léa a <strong>${a}</strong> 🍎. Elle en mange <strong>${b}</strong>. Combien en reste-t-il ?`, rep: a - b, min: 0, max: a + 2 };
    } },
    { generer() {
      const a = 2 + Math.floor(Math.random() * 5);
      const b = 1 + Math.floor(Math.random() * 4);
      return { texte: `Tom a <strong>${a}</strong> billes 🔵. Son ami lui en donne <strong>${b}</strong>. Combien en a-t-il maintenant ?`, rep: a + b, min: a, max: a + b + 4 };
    } },
    { generer() {
      const a = 2 + Math.floor(Math.random() * 5);
      const b = 2 + Math.floor(Math.random() * 5);
      return { texte: `Il y a <strong>${a}</strong> 🐱 dans le jardin et <strong>${b}</strong> dans la maison. Combien de chats en tout ?`, rep: a + b, min: Math.max(2, a + b - 4), max: a + b + 4 };
    } },
    { generer() {
      const a = 5 + Math.floor(Math.random() * 5);
      const b = 1 + Math.floor(Math.random() * (a - 1));
      return { texte: `On avait <strong>${a}</strong> 🎈 ballons. <strong>${b}</strong> se sont envolés. Combien en reste-t-il ?`, rep: a - b, min: 0, max: a };
    } },
    { generer() {
      const g = 3 + Math.floor(Math.random() * 5);
      const f = 3 + Math.floor(Math.random() * 5);
      return { texte: `Dans la classe, <strong>${g}</strong> 👦 garçons et <strong>${f}</strong> 👧 filles. Combien d'élèves en tout ?`, rep: g + f, min: g + f - 4, max: g + f + 4 };
    } },
    { generer() {
      const n = 2 + Math.floor(Math.random() * 4);
      const k = 1 + Math.floor(Math.random() * 4);
      return { texte: `Il y a <strong>${n}</strong> 🐦 oiseaux sur un arbre. <strong>${k}</strong> autres arrivent. Combien y a-t-il d'oiseaux en tout ?`, rep: n + k, min: Math.max(2, n + k - 3), max: n + k + 3 };
    } },
    { generer() {
      const t = 4 + Math.floor(Math.random() * 6);
      const m = 1 + Math.floor(Math.random() * (t - 1));
      return { texte: `Dans un panier, il y a <strong>${t}</strong> 🍊. On en mange <strong>${m}</strong>. Combien reste-t-il ?`, rep: t - m, min: 0, max: t };
    } },
    { generer() {
      const a = 2 + Math.floor(Math.random() * 4);
      const b = 2 + Math.floor(Math.random() * 4);
      return { texte: `Camille a <strong>${a}</strong> 🖍️ crayons rouges et <strong>${b}</strong> bleus. Combien de crayons en tout ?`, rep: a + b, min: Math.max(2, a + b - 3), max: a + b + 3 };
    } },
    { generer() {
      const n = 5 + Math.floor(Math.random() * 5);
      const s = 1 + Math.floor(Math.random() * (n - 2));
      return { texte: `Il y a <strong>${n}</strong> 🌟 étoiles. <strong>${s}</strong> disparaissent. Combien reste-t-il d'étoiles ?`, rep: n - s, min: 0, max: n };
    } },
    { generer() {
      const p = 3 + Math.floor(Math.random() * 4);
      const e = 1 + Math.floor(Math.random() * 4);
      return { texte: `Noah a <strong>${p}</strong> 🍪 biscuits. Sa sœur lui en donne <strong>${e}</strong>. Combien Noah a-t-il de biscuits maintenant ?`, rep: p + e, min: Math.max(2, p + e - 3), max: p + e + 3 };
    } },
  ],
  ce1: [
    { generer() {
      const a = 20 + Math.floor(Math.random() * 40);
      const b = 10 + Math.floor(Math.random() * 20);
      return { texte: `Une bibliothèque a <strong>${a}</strong> livres de BD et <strong>${b}</strong> livres de contes. Combien de livres au total ?`, rep: a + b, min: a + b - 15, max: a + b + 15 };
    } },
    { generer() {
      const tot = 30 + Math.floor(Math.random() * 40);
      const p = 5 + Math.floor(Math.random() * 20);
      return { texte: `Le bus a <strong>${tot}</strong> passagers 🚌. À l'arrêt, <strong>${p}</strong> descendent. Combien reste-t-il ?`, rep: tot - p, min: Math.max(0, tot - p - 12), max: tot - p + 12 };
    } },
    { generer() {
      const t = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      const n = 3 + Math.floor(Math.random() * 7);
      return { texte: `Il y a <strong>${n}</strong> boîtes avec <strong>${t}</strong> 🍪 biscuits chacune. Combien de biscuits en tout ?`, rep: n * t, min: Math.max(2, n * t - 10), max: n * t + 10 };
    } },
    { generer() {
      const t = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      const q = 2 + Math.floor(Math.random() * 8);
      return { texte: `On partage <strong>${t * q}</strong> 🍬 bonbons entre <strong>${t}</strong> enfants. Combien pour chacun ?`, rep: q, min: Math.max(1, q - 4), max: q + 4 };
    } },
    { generer() {
      const a = 20 + Math.floor(Math.random() * 30);
      const b = 5 + Math.floor(Math.random() * (a - 5));
      return { texte: `Lucie a économisé <strong>${a}</strong> € 💰. Elle dépense <strong>${b}</strong> €. Combien lui reste-t-il ?`, rep: a - b, min: Math.max(0, a - b - 10), max: a - b + 10 };
    } },
    { generer() {
      const t = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      const n = 2 + Math.floor(Math.random() * 9);
      return { texte: `Une ferme a <strong>${n}</strong> enclos 🐄. Chaque enclos contient <strong>${t}</strong> vaches. Combien de vaches en tout ? (<em>${n} × ${t}</em>)`, rep: n * t, min: Math.max(2, n * t - 12), max: n * t + 12 };
    } },
    { generer() {
      const a = 15 + Math.floor(Math.random() * 20);
      const b = 5 + Math.floor(Math.random() * 10);
      const c = 3 + Math.floor(Math.random() * 8);
      const rep = a + b - c;
      return { texte: `Il y a <strong>${a}</strong> élèves dans la classe 🏫. <strong>${b}</strong> autres arrivent puis <strong>${c}</strong> partent. Combien d'élèves y a-t-il maintenant ?`, rep, min: Math.max(0, rep - 12), max: rep + 12 };
    } },
    { generer() {
      const prixU = [50, 100, 150, 200][Math.floor(Math.random() * 4)];
      const qte = 2 + Math.floor(Math.random() * 4);
      const total = prixU * qte;
      const paye = Math.ceil(total / 100) * 100 + [0, 100, 200][Math.floor(Math.random() * 3)];
      const rendu = paye - total;
      return { texte: `Hugo achète <strong>${qte}</strong> autocollants 🏷️ à <strong>${prixU} centimes</strong> chacun. Il paie avec <strong>${(paye / 100).toFixed(0)}€</strong>. Combien lui rend-on ?`, rep: rendu, min: Math.max(0, rendu - 100), max: rendu + 200 };
    } },
  ],
};

export function lancerProbleme() {
  elTitre.textContent = "📖 Problème du jour";
  const pool = estCE1() ? PROBLEMES.ce1 : PROBLEMES.cp;
  const tmpl = pool[Math.floor(Math.random() * pool.length)];
  const { texte, rep, min, max } = tmpl.generer();
  setBonneReponse(rep);
  elQuestion.innerHTML = `<div class="probleme-question"><p>${texte}</p></div>`;
  const props = propositionsAvecBonne(rep, Math.max(0, min), Math.max(max, min + 5), 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}
