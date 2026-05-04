// games-formes.js — lancerFormes, lancerFractions, lancerSymetrie, lancerPerimetre, lancerAngles

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
  propositionsAvecBonne,
  afficherChoix,
  getDifficulte,
} from "./app-state.js";

import { apresReponse } from "./app-nav.js";

// ── Formes ────────────────────────────────────────────────────────────────────
const FORMES_CP  = ["cercle", "carré", "rectangle", "triangle", "losange"];
const FORMES_CE1 = ["cercle", "carré", "rectangle", "triangle", "losange", "pentagone", "hexagone"];
const FORMES_CE2 = ["cercle", "carré", "rectangle", "triangle", "losange", "pentagone", "hexagone", "octogone"];
const COULEURS_FORMES = ["#6c5ce7", "#00cec9", "#fd79a8", "#fdcb6e", "#00b894", "#e17055"];

const FORMES_COTES = {
  "cercle": 0, "carré": 4, "rectangle": 4, "triangle": 3,
  "losange": 4, "pentagone": 5, "hexagone": 6, "octogone": 8,
};

function svgForme(type, taille, couleur) {
  const cx = taille / 2, cy = taille / 2, r = taille * 0.38;
  switch (type) {
    case "cercle":
      return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${couleur}"/></svg>`;
    case "carré": {
      const s = r * 1.55;
      return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><rect x="${cx - s / 2}" y="${cy - s / 2}" width="${s}" height="${s}" rx="4" fill="${couleur}"/></svg>`;
    }
    case "rectangle": {
      const rw = r * 2, rh = r * 1.1;
      return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><rect x="${cx - rw / 2}" y="${cy - rh / 2}" width="${rw}" height="${rh}" rx="4" fill="${couleur}"/></svg>`;
    }
    case "triangle": {
      const pts = `${cx},${cy - r} ${cx - r * 0.95},${cy + r * 0.6} ${cx + r * 0.95},${cy + r * 0.6}`;
      return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><polygon points="${pts}" fill="${couleur}"/></svg>`;
    }
    case "losange": {
      const pts = `${cx},${cy - r} ${cx + r * 0.72},${cy} ${cx},${cy + r} ${cx - r * 0.72},${cy}`;
      return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><polygon points="${pts}" fill="${couleur}"/></svg>`;
    }
    case "pentagone": {
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * 2 * Math.PI - Math.PI / 2;
        pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
      }
      return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><polygon points="${pts.join(" ")}" fill="${couleur}"/></svg>`;
    }
    case "hexagone": {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * 2 * Math.PI - Math.PI / 2;
        pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
      }
      return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><polygon points="${pts.join(" ")}" fill="${couleur}"/></svg>`;
    }
    case "octogone": {
      const pts = [];
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * 2 * Math.PI - Math.PI / 2;
        pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
      }
      return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><polygon points="${pts.join(" ")}" fill="${couleur}"/></svg>`;
    }
    default: return "";
  }
}

export function lancerFormes() {
  elTitre.textContent = "🔷 Les formes";
  const diff = getDifficulte();

  if (estCE2()) {
    // CE2 : 100% texte — "N côtés → quel nom ?"
    const liste = FORMES_CE2;
    const idx = Math.floor(Math.random() * liste.length);
    const forme = liste[idx];
    // for "cercle" (0 sides) always ask shape by SVG, not by sides
    const cotes = FORMES_COTES[forme];
    setBonneReponse(idx);
    if (forme === "cercle") {
      const couleurQ = COULEURS_FORMES[Math.floor(Math.random() * COULEURS_FORMES.length)];
      elQuestion.innerHTML = `<div class="forme-question">${svgForme(forme, 130, couleurQ)}</div>` +
        `<p style="font-size:0.82rem;margin:0.3rem 0 0;color:#888">Comment s'appelle cette figure ?</p>`;
    } else {
      elQuestion.innerHTML = `<p style="font-size:0.9rem;margin:0 0 0.4rem">Comment s'appelle une figure à <strong>${cotes} côtés</strong> ?</p>`;
    }
    const autresIdx = melanger(
      liste.map((_, i) => i).filter((i) => i !== idx && FORMES_COTES[liste[i]] !== cotes)
    ).slice(0, 3);
    const optionsIdx = melanger([idx, ...autresIdx]);
    elChoix.innerHTML = "";
    optionsIdx.forEach((i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix"; b.style.fontSize = "1rem";
      b.textContent = liste[i]; b.dataset.valeur = String(i);
      b.addEventListener("click", () => apresReponse(i, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
    return;
  }

  // At higher difficulty, expand the available pool
  const listeBase = estCE1() ? FORMES_CE1 : FORMES_CP;
  const listeAvec = estCE1()
    ? (diff >= 2 ? FORMES_CE2 : (diff >= 1 ? FORMES_CE1 : FORMES_CE1))
    : (diff >= 2 ? FORMES_CE1 : (diff >= 1 ? [...FORMES_CP, "pentagone"] : FORMES_CP));
  const liste = listeAvec;
  const idx = Math.floor(Math.random() * liste.length);
  const forme = liste[idx];
  const couleurQ = COULEURS_FORMES[Math.floor(Math.random() * COULEURS_FORMES.length)];
  setBonneReponse(idx);

  const demandeCotes = estCE1() && Math.random() < 0.40 && forme !== "cercle";
  const cotes = FORMES_COTES[forme];

  if (demandeCotes) {
    elQuestion.innerHTML = `<p style="font-size:0.9rem;margin:0 0 0.4rem">Comment s'appelle une figure à <strong>${cotes} côtés</strong> ?</p>`;
    const autresIdx = melanger(liste.map((_, i) => i).filter((i) => i !== idx && FORMES_COTES[liste[i]] !== cotes)).slice(0, 3);
    const optionsIdx = melanger([idx, ...autresIdx]);
    elChoix.innerHTML = "";
    optionsIdx.forEach((i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix"; b.style.fontSize = "1rem";
      b.textContent = liste[i]; b.dataset.valeur = String(i);
      b.addEventListener("click", () => apresReponse(i, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
  } else {
    elQuestion.innerHTML = `<div class="forme-question">${svgForme(forme, 130, couleurQ)}</div>` +
      (estCE1() ? `<p style="font-size:0.82rem;margin:0.3rem 0 0;color:#888">Comment s'appelle cette figure ?</p>` : "");
    const autresIdx = melanger(liste.map((_, i) => i).filter((i) => i !== idx)).slice(0, 3);
    const optionsIdx = melanger([idx, ...autresIdx]);
    elChoix.innerHTML = "";
    optionsIdx.forEach((i) => {
      const ci = (COULEURS_FORMES.indexOf(couleurQ) + i + 1) % COULEURS_FORMES.length;
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix btn-forme";
      b.innerHTML = svgForme(liste[i], 75, COULEURS_FORMES[ci]);
      b.dataset.valeur = String(i);
      b.addEventListener("click", () => apresReponse(i, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
  }
}

// ── Fractions ─────────────────────────────────────────────────────────────────
function svgFraction(num, denom, taille) {
  const cx = taille / 2, cy = taille / 2, r = taille * 0.42;
  const angleOffset = -Math.PI / 2;
  let parts = "";
  for (let i = 0; i < denom; i++) {
    const a1 = (i / denom) * 2 * Math.PI + angleOffset;
    const a2 = ((i + 1) / denom) * 2 * Math.PI + angleOffset;
    const x1 = (cx + r * Math.cos(a1)).toFixed(2);
    const y1 = (cy + r * Math.sin(a1)).toFixed(2);
    const x2 = (cx + r * Math.cos(a2)).toFixed(2);
    const y2 = (cy + r * Math.sin(a2)).toFixed(2);
    const fill = i < num ? "#6c5ce7" : "#e8e0ff";
    const la = 1 / denom > 0.5 ? 1 : 0;
    parts += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${la} 1 ${x2},${y2} Z" fill="${fill}" stroke="white" stroke-width="2"/>`;
  }
  return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}">
    ${parts}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#6c5ce7" stroke-width="2"/>
  </svg>`;
}

export function lancerFractions() {
  elTitre.textContent = "🍕";

  if (estCM2()) {
    // CM2 : addition de fractions même dénominateur
    const denom = 3 + Math.floor(Math.random() * 8);
    const num1 = 1 + Math.floor(Math.random() * (denom - 1));
    const num2 = 1 + Math.floor(Math.random() * (denom - 1));
    const numResult = num1 + num2;
    setBonneReponse(numResult);
    elQuestion.innerHTML =
      `<p style="font-size:0.9rem;margin:0 0 0.4rem">Calcule :</p>` +
      `<p class="equation" style="font-size:2.4rem;font-weight:700;margin:0.4rem 0">${num1}/${denom} + ${num2}/${denom} = ?/${denom}</p>` +
      `<p style="font-size:0.78rem;color:#888">💡 Même dénominateur : additionne les numérateurs</p>`;
    const props = propositionsAvecBonne(numResult, Math.max(1, numResult - 4), numResult + 4, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (estCM1()) {
    const type = Math.random() < 0.5 ? "compare" : "quantite";
    if (type === "compare") {
      // comparer fractions même dénominateur
      const denom = 4 + Math.floor(Math.random() * 6);
      const num1 = 1 + Math.floor(Math.random() * (denom - 1));
      let num2 = 1 + Math.floor(Math.random() * (denom - 1));
      while (num2 === num1) num2 = 1 + Math.floor(Math.random() * (denom - 1));
      const bonne = num1 > num2 ? num1 : num2;
      setBonneReponse(bonne);
      elQuestion.innerHTML =
        `<p style="font-size:0.9rem;margin:0 0 0.4rem">Quelle fraction est la plus grande ?</p>` +
        `<p class="equation" style="font-size:2rem;font-weight:700;margin:0.4rem 0">${num1}/${denom} ou ${num2}/${denom}</p>`;
      const opts = melanger([num1, num2]);
      elChoix.innerHTML = "";
      opts.forEach(val => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "btn-choix";
        b.textContent = val + "/" + denom; b.dataset.valeur = String(val);
        b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
        elChoix.appendChild(b);
      });
    } else {
      // fraction d'une quantité
      const couples = [
        { num: 1, denom: 2, qty: 10 }, { num: 3, denom: 4, qty: 20 }, { num: 2, denom: 5, qty: 25 },
        { num: 2, denom: 3, qty: 15 }, { num: 1, denom: 4, qty: 20 }, { num: 3, denom: 5, qty: 30 },
      ];
      const item = couples[Math.floor(Math.random() * couples.length)];
      const rep = Math.round(item.qty * item.num / item.denom);
      setBonneReponse(rep);
      elQuestion.innerHTML =
        `<p style="font-size:0.9rem;margin:0 0 0.4rem">Calcule :</p>` +
        `<p class="equation" style="font-size:2.4rem;font-weight:700;margin:0.4rem 0">${item.num}/${item.denom} de ${item.qty} = ?</p>`;
      const props = propositionsAvecBonne(rep, Math.max(1, rep - 6), rep + 6, 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    }
    return;
  }

  const pool = estCE2()
    ? [
        { n: 1, d: 2 }, { n: 1, d: 4 }, { n: 3, d: 4 },
        { n: 1, d: 3 }, { n: 2, d: 3 }, { n: 2, d: 4 },
        { n: 1, d: 5 }, { n: 2, d: 5 }, { n: 3, d: 5 }, { n: 4, d: 5 },
        { n: 1, d: 6 }, { n: 5, d: 6 },
      ]
    : estCE1()
    ? [{ n: 1, d: 2 }, { n: 1, d: 4 }, { n: 3, d: 4 }, { n: 1, d: 3 }, { n: 2, d: 3 }, { n: 2, d: 4 }]
    : [{ n: 1, d: 2 }, { n: 1, d: 4 }, { n: 3, d: 4 }];
  const bonne = pool[Math.floor(Math.random() * pool.length)];
  setBonneReponse(bonne.n * 10 + bonne.d);

  elQuestion.innerHTML =
    `<p style="font-size:0.88rem;margin:0 0 0.3rem">Quelle <strong>fraction</strong> de la figure est coloriée en violet ?</p>` +
    `<div class="fraction-question">${svgFraction(bonne.n, bonne.d, 130)}</div>`;

  const fausses = melanger(pool.filter((f) => f.n !== bonne.n || f.d !== bonne.d)).slice(0, 3);
  while (fausses.length < 3) {
    const extras = [{ n: 2, d: 4 }, { n: 1, d: 6 }, { n: 2, d: 6 }];
    const e = extras.find((x) => (x.n * 10 + x.d) !== getBonneReponse() && !fausses.find((f) => f.n === x.n && f.d === x.d));
    if (e) fausses.push(e); else break;
  }
  const options = melanger([bonne, ...fausses.slice(0, 3)]);

  elChoix.innerHTML = "";
  options.forEach((f) => {
    const val = f.n * 10 + f.d;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix btn-forme";
    b.innerHTML = svgFraction(f.n, f.d, 75);
    b.dataset.valeur = String(val);
    b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── Symétrie ──────────────────────────────────────────────────────────────────
function svgDemiFigure(type, taille, gauche) {
  const cx = taille / 2, cy = taille / 2, r = taille * 0.38;
  const g = gauche ? -1 : 1;
  let shape = "";
  if (type === 0) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * 2 * Math.PI - Math.PI / 2;
      pts.push(`${(cx + r * Math.cos(a) * g).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
      const a2 = a + Math.PI / 5;
      pts.push(`${(cx + r * 0.42 * Math.cos(a2) * g).toFixed(2)},${(cy + r * 0.42 * Math.sin(a2)).toFixed(2)}`);
    }
    shape = `<polygon points="${pts.join(" ")}" fill="#fdcb6e"/>`;
  } else if (type === 1) {
    const bw = r * 1.4;
    shape = `<rect x="${Math.min(cx, cx - r * 0.7 * g)}" y="${cy}" width="${bw}" height="${r * 0.85}" fill="#00cec9"/>
      <polygon points="${cx},${cy - r * 0.6} ${cx - r * 0.8 * g},${cy} ${cx + r * 0.8 * g},${cy}" fill="#fd79a8"/>`;
  } else if (type === 2) {
    const pts1 = `${cx},${cy} ${cx + r * 0.85 * g},${cy - r * 0.65} ${cx + r * 0.4 * g},${cy + r * 0.3}`;
    const pts2 = `${cx},${cy} ${cx + r * 0.85 * g},${cy + r * 0.65} ${cx + r * 0.4 * g},${cy - r * 0.3}`;
    shape = `<polygon points="${pts1}" fill="#6c5ce7" opacity="0.85"/>
      <polygon points="${pts2}" fill="#fd79a8" opacity="0.85"/>`;
  } else if (type === 3) {
    const pts = `${cx},${cy - r * 0.8} ${cx + r * 0.9 * g},${cy} ${cx},${cy + r * 0.25} ${cx + r * 0.5 * g},${cy + r * 0.9}`;
    shape = `<polygon points="${pts}" fill="#00b894"/>`;
  } else {
    const pts = `${cx},${cy - r} ${cx - r * 0.55 * g},${cy - r * 0.05} ${cx},${cy + r * 0.1} ${cx - r * 0.7 * g},${cy + r}`;
    shape = `<polygon points="${pts}" fill="#e17055"/>`;
  }
  return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}">
    <line x1="${cx}" y1="4" x2="${cx}" y2="${taille - 4}" stroke="#c4b5f9" stroke-width="2" stroke-dasharray="5,3"/>
    ${shape}
  </svg>`;
}

function svgIrregulier(taille) {
  // Simple irregular quadrilateral — clearly not symmetric
  const W = taille, H = taille;
  const pts = `${W*0.18},${H*0.25} ${W*0.82},${H*0.18} ${W*0.75},${H*0.78} ${W*0.22},${H*0.88}`;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><polygon points="${pts}" fill="#fdcb6e" stroke="#e17055" stroke-width="2"/></svg>`;
}

export function lancerSymetrie() {
  elTitre.textContent = "🪞 Symétrie";

  if (estCM2()) {
    const AXES_DATA = [
      { nom: "carré",     svg: svgForme("carré",     130, COULEURS_FORMES[0]), axes: 4 },
      { nom: "rectangle", svg: svgForme("rectangle", 130, COULEURS_FORMES[1]), axes: 2 },
      { nom: "triangle",  svg: svgForme("triangle",  130, COULEURS_FORMES[2]), axes: 3 },
      { nom: "losange",   svg: svgForme("losange",   130, COULEURS_FORMES[3]), axes: 2 },
      { nom: "pentagone", svg: svgForme("pentagone", 130, COULEURS_FORMES[0]), axes: 5 },
      { nom: "hexagone",  svg: svgForme("hexagone",  130, COULEURS_FORMES[1]), axes: 6 },
    ];
    const item = AXES_DATA[Math.floor(Math.random() * AXES_DATA.length)];
    setBonneReponse(item.axes);
    elQuestion.innerHTML =
      `<p style="font-size:0.88rem;margin:0 0 0.4rem">Combien d'<strong>axes de symétrie</strong> a ce ${item.nom} ?</p>` +
      `<div class="forme-question">${item.svg}</div>`;
    const fausses = [1, 2, 3, 4, 5, 6].filter(n => n !== item.axes);
    const opts = melanger([item.axes, ...melanger(fausses).slice(0, 3)]);
    elChoix.innerHTML = "";
    opts.forEach(n => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix";
      b.textContent = String(n);
      b.dataset.valeur = String(n);
      b.addEventListener("click", () => apresReponse(n, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
    return;
  }

  if (estCE2()) {
    const SYMETRIQUES = ["cercle", "carré", "rectangle", "triangle", "losange", "pentagone", "hexagone"];
    const estSym = Math.random() < 0.50;
    setBonneReponse(estSym ? 1 : 0);
    let svgFig;
    let nomFig;
    if (estSym) {
      nomFig = SYMETRIQUES[Math.floor(Math.random() * SYMETRIQUES.length)];
      const couleur = COULEURS_FORMES[Math.floor(Math.random() * COULEURS_FORMES.length)];
      svgFig = svgForme(nomFig, 130, couleur);
    } else {
      svgFig = svgIrregulier(130);
    }
    elQuestion.innerHTML =
      `<p style="font-size:0.88rem;margin:0 0 0.4rem">Cette figure a-t-elle un <strong>axe de symétrie</strong> ?</p>` +
      `<div class="forme-question">${svgFig}</div>`;
    elChoix.innerHTML = "";
    [{ val: 1, label: "✅ Oui" }, { val: 0, label: "❌ Non" }].forEach(({ val, label }) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix";
      b.textContent = label; b.dataset.valeur = String(val);
      b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
    return;
  }

  const nbTypes = estCE1() ? 5 : 3;
  const type = Math.floor(Math.random() * nbTypes);
  setBonneReponse(1); // correct = miroir (gauche=true)

  elQuestion.innerHTML =
    `<p style="font-size:0.88rem;margin:0 0 0.4rem">Quelle est l'image <strong>miroir</strong> de cette figure (dans le 🪞) ?</p>` +
    `<div class="symetrie-question">${svgDemiFigure(type, 130, false)}</div>`;

  const autresTypes = [0, 1, 2, 3, 4].filter(t => t !== type && (estCE1() || t < 3));
  const [t1, t2] = melanger(autresTypes);
  const options = melanger([
    { val: 1, svg: svgDemiFigure(type, 78, true) },
    { val: 0, svg: svgDemiFigure(type, 78, false) },
    { val: 2, svg: svgDemiFigure(t1, 78, true) },
    { val: 3, svg: svgDemiFigure(t2, 78, false) },
  ]);

  elChoix.innerHTML = "";
  options.forEach(({ val, svg }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix btn-forme";
    b.innerHTML = svg;
    b.dataset.valeur = String(val);
    b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── Périmètre ─────────────────────────────────────────────────────────────────
function svgPerimetre(type, a, b) {
  const W = 260, H = 190;
  let shape = "", labels = "";
  const fs = 15, fw = 700, fc = "#5344c7";

  if (type === "carre") {
    const s = 100, x0 = (W - s) / 2, y0 = (H - s) / 2;
    shape = `<rect x="${x0}" y="${y0}" width="${s}" height="${s}" fill="#f0eeff" stroke="#6c5ce7" stroke-width="3" rx="3"/>`;
    labels += `<text x="${W/2}" y="${y0-10}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
    labels += `<text x="${W/2}" y="${y0+s+20}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
    labels += `<text x="${x0-10}" y="${H/2+5}" text-anchor="end" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
    labels += `<text x="${x0+s+10}" y="${H/2+5}" text-anchor="start" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
  } else if (type === "rectangle") {
    const rw = 150, rh = 80, x0 = (W - rw) / 2, y0 = (H - rh) / 2;
    shape = `<rect x="${x0}" y="${y0}" width="${rw}" height="${rh}" fill="#f0eeff" stroke="#6c5ce7" stroke-width="3" rx="3"/>`;
    labels += `<text x="${W/2}" y="${y0-10}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
    labels += `<text x="${W/2}" y="${y0+rh+20}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
    labels += `<text x="${x0-10}" y="${H/2+5}" text-anchor="end" font-size="${fs}" font-weight="${fw}" fill="${fc}">${b} cm</text>`;
    labels += `<text x="${x0+rw+10}" y="${H/2+5}" text-anchor="start" font-size="${fs}" font-weight="${fw}" fill="${fc}">${b} cm</text>`;
  } else if (type === "triangle") {
    const side = 110, cx = W / 2, cy = H / 2 + 10;
    const th = side * Math.sqrt(3) / 2;
    const p1 = `${cx.toFixed(1)},${(cy - th * 0.65).toFixed(1)}`;
    const p2 = `${(cx - side / 2).toFixed(1)},${(cy + th * 0.35).toFixed(1)}`;
    const p3 = `${(cx + side / 2).toFixed(1)},${(cy + th * 0.35).toFixed(1)}`;
    shape = `<polygon points="${p1} ${p2} ${p3}" fill="#f0eeff" stroke="#6c5ce7" stroke-width="3"/>`;
    labels += `<text x="${cx}" y="${(cy + th * 0.35 + 18).toFixed(1)}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
    labels += `<text x="${(cx - side / 4 - 14).toFixed(1)}" y="${(cy - th * 0.15).toFixed(1)}" text-anchor="end" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
    labels += `<text x="${(cx + side / 4 + 14).toFixed(1)}" y="${(cy - th * 0.15).toFixed(1)}" text-anchor="start" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
  } else {
    // trapeze : a = top (smaller), b = bottom (larger), c = two equal sides (passed as b param)
    const c = b;
    const topW = 90, botW = 150, trapH = 80;
    const x0 = (W - botW) / 2, y0 = (H - trapH) / 2;
    const xTopL = x0 + (botW - topW) / 2, xTopR = xTopL + topW;
    const p1t = `${xTopL},${y0}`;
    const p2t = `${xTopR},${y0}`;
    const p3t = `${x0 + botW},${y0 + trapH}`;
    const p4t = `${x0},${y0 + trapH}`;
    shape = `<polygon points="${p1t} ${p2t} ${p3t} ${p4t}" fill="#f0eeff" stroke="#6c5ce7" stroke-width="3"/>`;
    // top label
    labels += `<text x="${(xTopL + xTopR) / 2}" y="${y0 - 10}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
    // bottom label
    labels += `<text x="${W / 2}" y="${y0 + trapH + 20}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a + 6} cm</text>`;
    // left side
    labels += `<text x="${(xTopL + x0) / 2 - 12}" y="${y0 + trapH / 2 + 5}" text-anchor="end" font-size="${fs}" font-weight="${fw}" fill="${fc}">${c} cm</text>`;
    // right side
    labels += `<text x="${(xTopR + x0 + botW) / 2 + 12}" y="${y0 + trapH / 2 + 5}" text-anchor="start" font-size="${fs}" font-weight="${fw}" fill="${fc}">${c} cm</text>`;
  }
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="font-family:Fredoka,sans-serif">${shape}${labels}</svg>`;
}

export function lancerPerimetre() {
  elTitre.textContent = "🔲 Périmètre";
  const diff = getDifficulte();

  if (estCM2()) {
    // CM2 : aire rectangle (l × L), résultat en cm²
    const l = 2 + Math.floor(Math.random() * [10, 20, 30][diff]);
    const L = 2 + Math.floor(Math.random() * [10, 20, 30][diff]);
    const aire = l * L;
    setBonneReponse(aire);
    elQuestion.innerHTML = `<div class="perimetre-question">
      <p>Calcule l'<strong>aire</strong> de ce rectangle (en cm²).</p>
      ${svgPerimetre("rectangle", L, l)}
    </div>` +
      `<p style="font-size:0.78rem;color:#888;margin-top:0.4rem">💡 Aire = longueur × largeur</p>`;
    const props = propositionsAvecBonne(aire, Math.max(1, aire - Math.max(10, aire / 3)), aire + Math.max(10, aire / 3), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (estCM1()) {
    // CM1 : périmètre triangle quelconque (3 côtés différents)
    const maxT = [8, 15, 20][diff];
    let a = 2 + Math.floor(Math.random() * maxT);
    let b, c;
    do { b = 2 + Math.floor(Math.random() * maxT); } while (b === a);
    do { c = 2 + Math.floor(Math.random() * maxT); } while (c === a || c === b);
    const perimetre = a + b + c;
    setBonneReponse(perimetre);
    const W = 260, H = 190, cx = W / 2, cy = H / 2 + 10;
    const h = 100;
    const p1 = `${cx},${cy - h * 0.6}`;
    const p2 = `${cx - 70},${cy + h * 0.4}`;
    const p3 = `${cx + 70},${cy + h * 0.4}`;
    const fs = 15, fw = 700, fc = "#5344c7";
    const svgT = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="font-family:Fredoka,sans-serif">
      <polygon points="${p1} ${p2} ${p3}" fill="#f0eeff" stroke="#6c5ce7" stroke-width="3"/>
      <text x="${cx}" y="${cy + h * 0.4 + 18}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>
      <text x="${cx - 50}" y="${cy - 5}" text-anchor="end" font-size="${fs}" font-weight="${fw}" fill="${fc}">${b} cm</text>
      <text x="${cx + 50}" y="${cy - 5}" text-anchor="start" font-size="${fs}" font-weight="${fw}" fill="${fc}">${c} cm</text>
    </svg>`;
    elQuestion.innerHTML = `<div class="perimetre-question">
      <p>Calcule le <strong>périmètre</strong> de ce triangle (en cm).</p>
      ${svgT}
    </div>`;
    const props = propositionsAvecBonne(perimetre, Math.max(6, perimetre - 15), perimetre + 15, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  const maxC = estCE2() ? [12, 18, 25][diff] : (estCE1() ? [8, 12, 15][diff] : [5, 7, 8][diff]);
  const types = estCE2()
    ? ["carre", "rectangle", "triangle", "trapeze"]
    : estCE1()
    ? ["carre", "rectangle", "triangle"]
    : ["carre", "rectangle"];
  const type = types[Math.floor(Math.random() * types.length)];

  let a, b, perimetre;
  if (type === "carre") {
    a = 2 + Math.floor(Math.random() * (maxC - 1)); b = a;
    perimetre = 4 * a;
  } else if (type === "rectangle") {
    a = 2 + Math.floor(Math.random() * (maxC - 1));
    do { b = 2 + Math.floor(Math.random() * (maxC - 1)); } while (b === a);
    perimetre = 2 * (a + b);
  } else if (type === "triangle") {
    a = 2 + Math.floor(Math.random() * (maxC - 1)); b = a;
    perimetre = 3 * a;
  } else {
    // trapeze : a = top, bottom = a+6, c = two equal sides
    a = 3 + Math.floor(Math.random() * (maxC - 3));
    b = 2 + Math.floor(Math.random() * (maxC - 2)); // c = side length
    const bottom = a + 6;
    perimetre = a + bottom + 2 * b;
  }
  setBonneReponse(perimetre);

  const noms = {
    carre: "carré", rectangle: "rectangle",
    triangle: "triangle équilatéral", trapeze: "trapèze",
  };
  elQuestion.innerHTML = `<div class="perimetre-question">
    <p>Calcule le <strong>périmètre</strong> de ce ${noms[type]} (en cm).</p>
    ${svgPerimetre(type, a, b)}
  </div>`;

  const props = propositionsAvecBonne(perimetre, Math.max(4, perimetre - 12), perimetre + 14, 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── Angles ────────────────────────────────────────────────────────────────────
function svgAngle(degres, taille) {
  const cx = taille * 0.22, cy = taille * 0.74;
  const lon = taille * 0.6;
  const rad = degres * Math.PI / 180;
  const x1 = cx + lon, y1 = cy;
  const x2 = (cx + lon * Math.cos(rad)).toFixed(2);
  const y2 = (cy - lon * Math.sin(rad)).toFixed(2);

  let mark = "";
  if (degres === 90) {
    const sq = taille * 0.13;
    mark = `<path d="M${(cx + sq).toFixed(1)},${cy} L${(cx + sq).toFixed(1)},${(cy - sq).toFixed(1)} L${cx},${(cy - sq).toFixed(1)}" fill="none" stroke="#6c5ce7" stroke-width="2"/>`;
  } else {
    const r = taille * 0.2;
    const ax = (cx + r * Math.cos(rad)).toFixed(2);
    const ay = (cy - r * Math.sin(rad)).toFixed(2);
    mark = `<path d="M${(cx + r).toFixed(1)},${cy} A${r},${r} 0 0 0 ${ax},${ay}" fill="#c4b5f9" opacity="0.55" stroke="#6c5ce7" stroke-width="1.5"/>`;
  }
  return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}" xmlns="http://www.w3.org/2000/svg">
    <line x1="${cx}" y1="${cy}" x2="${x1}" y2="${y1}" stroke="#5344c7" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#5344c7" stroke-width="3.5" stroke-linecap="round"/>
    ${mark}
    <circle cx="${cx}" cy="${cy}" r="5" fill="#5344c7"/>
  </svg>`;
}

function svgPolygoneAngles(polyType, taille) {
  const W = taille, H = taille;
  const cx = W / 2, cy = H / 2;
  const r = taille * 0.36;
  const fs = 13, fw = 700, fc = "#5344c7";
  const sqSz = taille * 0.08;
  let shape = "", marks = "";
  if (polyType === "rectangle") {
    const rw = r * 1.9, rh = r * 1.1;
    const x0 = cx - rw / 2, y0 = cy - rh / 2;
    shape = `<rect x="${x0}" y="${y0}" width="${rw}" height="${rh}" fill="#f0eeff" stroke="#6c5ce7" stroke-width="2.5" rx="2"/>`;
    // 4 right angle marks
    [[x0,y0,1,1],[x0+rw,y0,-1,1],[x0,y0+rh,1,-1],[x0+rw,y0+rh,-1,-1]].forEach(([px,py,dx,dy]) => {
      marks += `<path d="M${px+dx*sqSz},${py} L${px+dx*sqSz},${py+dy*sqSz} L${px},${py+dy*sqSz}" fill="none" stroke="#e17055" stroke-width="1.5"/>`;
    });
  } else if (polyType === "triangle") {
    const p1x = cx, p1y = cy - r;
    const p2x = cx - r * 0.9, p2y = cy + r * 0.6;
    const p3x = cx + r * 0.9, p3y = cy + r * 0.6;
    shape = `<polygon points="${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}" fill="#f0eeff" stroke="#6c5ce7" stroke-width="2.5"/>`;
    // no right angle marks
  } else {
    // L-shape with 2 right angles visible at the outer corners
    const lx = cx - r * 0.8, ly = cy - r * 0.8;
    const lw = r * 1.6, lh = r * 1.6, sw = r * 0.65, sh = r * 0.65;
    const pts = [
      `${lx},${ly}`, `${lx+lw},${ly}`, `${lx+lw},${ly+sh}`,
      `${lx+sw},${ly+sh}`, `${lx+sw},${ly+lh}`, `${lx},${ly+lh}`,
    ].join(" ");
    shape = `<polygon points="${pts}" fill="#f0eeff" stroke="#6c5ce7" stroke-width="2.5"/>`;
    // 2 outer right angle marks
    marks += `<path d="M${lx+sqSz},${ly} L${lx+sqSz},${ly+sqSz} L${lx},${ly+sqSz}" fill="none" stroke="#e17055" stroke-width="1.5"/>`;
    marks += `<path d="M${lx},${ly+lh-sqSz} L${lx+sqSz},${ly+lh-sqSz} L${lx+sqSz},${ly+lh}" fill="none" stroke="#e17055" stroke-width="1.5"/>`;
  }
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${shape}${marks}</svg>`;
}

export function lancerAngles() {
  elTitre.textContent = "📐 Les angles";
  let degres, bonneVal;

  if (estCM2()) {
    // CM2 : somme des angles d'un triangle = 180°, trouver l'angle manquant
    const a1 = 20 + Math.floor(Math.random() * 80);
    const a2 = 20 + Math.floor(Math.random() * (140 - a1));
    const manquant = 180 - a1 - a2;
    if (manquant <= 0 || manquant >= 180) { lancerAngles(); return; }
    setBonneReponse(manquant);
    elQuestion.innerHTML =
      `<p style="font-size:0.88rem;margin:0 0 0.4rem">💡 La somme des angles d'un triangle = <strong>180°</strong></p>` +
      `<p class="equation" style="font-size:1.8rem;font-weight:700;margin:0.4rem 0">${a1}° + ${a2}° + ? = 180°</p>` +
      `<p style="font-size:0.9rem;margin-top:0.3rem">Quel est l'angle manquant ?</p>`;
    const props = propositionsAvecBonne(manquant, Math.max(1, manquant - 20), Math.min(170, manquant + 20), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (estCM1()) {
    // CM1 : mesurer un angle en degrés (choix parmi 4 valeurs)
    const angleVals = [30, 45, 60, 90, 120, 135, 150];
    const idx = Math.floor(Math.random() * angleVals.length);
    degres = angleVals[idx];
    bonneVal = degres;
    setBonneReponse(bonneVal);
    elQuestion.innerHTML =
      `<p style="font-size:0.78rem;color:#888;margin:0 0 0.3rem">📐 Combien de degrés mesure cet angle ?</p>` +
      `<div class="angle-question">${svgAngle(degres, 160)}</div>`;
    elChoix.innerHTML = "";
    const faux = melanger(angleVals.filter(v => v !== degres)).slice(0, 3);
    melanger([degres, ...faux]).forEach(val => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix";
      b.textContent = val + "°"; b.dataset.valeur = String(val);
      b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
    return;
  }

  if (estCE2()) {
    if (Math.random() < 0.40) {
      // CE2 variant : "Combien d'angles droits dans ce polygone ?"
      const polyTypes = ["rectangle", "triangle", "lshape"];
      const polyType = polyTypes[Math.floor(Math.random() * polyTypes.length)];
      const anglesMap = { rectangle: 4, triangle: 0, lshape: 2 };
      bonneVal = anglesMap[polyType];
      setBonneReponse(bonneVal);
      const nomFig = polyType === "lshape" ? "cette figure en L" : (polyType === "rectangle" ? "ce rectangle" : "ce triangle");
      elQuestion.innerHTML =
        `<p style="font-size:0.82rem;margin:0 0 0.35rem">Combien d'<strong>angles droits</strong> dans ${nomFig} ?</p>` +
        `<div class="angle-question">${svgPolygoneAngles(polyType, 160)}</div>`;
      elChoix.innerHTML = "";
      melanger([0, 1, 2, 4]).forEach((val) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "btn-choix";
        b.textContent = String(val); b.dataset.valeur = String(val);
        b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
        elChoix.appendChild(b);
      });
    } else {
      // CE2 standard: classify acute/right/obtuse (same as CE1)
      const idx = Math.floor(Math.random() * 3);
      if (idx === 0) { degres = 90; bonneVal = 0; }
      else if (idx === 1) { degres = 15 + Math.floor(Math.random() * 60); bonneVal = 1; }
      else { degres = 110 + Math.floor(Math.random() * 55); bonneVal = 2; }
      setBonneReponse(bonneVal);
      elQuestion.innerHTML =
        `<p style="font-size:0.78rem;color:#888;margin:0 0 0.3rem">📐 Quel type d'angle vois-tu ?</p>` +
        `<div class="angle-question">${svgAngle(degres, 160)}</div>`;
      elChoix.innerHTML = "";
      [
        { val: 0, label: "Angle droit (90°)" },
        { val: 1, label: "Angle aigu (< 90°)" },
        { val: 2, label: "Angle obtus (> 90°)" },
      ].forEach(({ val, label }, i) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "btn-choix";
        b.textContent = label; b.dataset.valeur = String(val);
        if (i === 2) b.style.gridColumn = "1 / -1";
        b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
        elChoix.appendChild(b);
      });
    }
    return;
  }

  if (!estCE1()) {
    if (Math.random() < 0.5) {
      degres = 90; bonneVal = 0;
    } else {
      degres = Math.random() < 0.5
        ? 15 + Math.floor(Math.random() * 55)
        : 110 + Math.floor(Math.random() * 55);
      bonneVal = 1;
    }
    setBonneReponse(bonneVal);
    elQuestion.innerHTML =
      `<p style="font-size:0.8rem;color:#777;margin:0 0 0.35rem">📐 Un angle <strong>droit</strong> forme un coin parfait, comme le coin d'une feuille.</p>` +
      `<div class="angle-question">${svgAngle(degres, 150)}</div>`;
    elChoix.innerHTML = "";
    [{ val: 0, label: "✅ Angle droit" }, { val: 1, label: "❌ Pas droit" }].forEach(({ val, label }) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix";
      b.textContent = label; b.dataset.valeur = String(val);
      b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
  } else {
    const idx = Math.floor(Math.random() * 3);
    if (idx === 0) { degres = 90; bonneVal = 0; }
    else if (idx === 1) { degres = 15 + Math.floor(Math.random() * 60); bonneVal = 1; }
    else { degres = 110 + Math.floor(Math.random() * 55); bonneVal = 2; }
    setBonneReponse(bonneVal);
    elQuestion.innerHTML =
      `<p style="font-size:0.78rem;color:#888;margin:0 0 0.3rem">📐 Quel type d'angle vois-tu ?</p>` +
      `<div class="angle-question">${svgAngle(degres, 160)}</div>`;
    elChoix.innerHTML = "";
    [
      { val: 0, label: "Angle droit (90°)" },
      { val: 1, label: "Angle aigu (< 90°)" },
      { val: 2, label: "Angle obtus (> 90°)" },
    ].forEach(({ val, label }, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix";
      b.textContent = label; b.dataset.valeur = String(val);
      if (i === 2) b.style.gridColumn = "1 / -1";
      b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
  }
}

// ── lancerAires ───────────────────────────────────────────────────────────────
export function lancerAires() {
  elTitre.textContent = "📐 Aires";
  const diff = getDifficulte();

  if (estCM2()) {
    // CM2 : aire triangle (base × hauteur / 2)
    const base = 2 + Math.floor(Math.random() * [8, 14, 20][diff]);
    const hauteur = 2 + Math.floor(Math.random() * [8, 14, 20][diff]);
    const aire = Math.round(base * hauteur / 2);
    setBonneReponse(aire);
    const W = 260, H = 190;
    const cx = W / 2, cy = H / 2;
    const bpx = base * 10, hpx = hauteur * 8;
    const x0 = cx - bpx / 2, x1 = cx + bpx / 2, y0 = cy + hpx / 2, y2 = cy - hpx / 2;
    const svgT = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="font-family:Fredoka,sans-serif">
      <polygon points="${x0},${y0} ${x1},${y0} ${cx},${y2}" fill="#f0eeff" stroke="#6c5ce7" stroke-width="3"/>
      <line x1="${cx}" y1="${y0}" x2="${cx}" y2="${y2}" stroke="#fd79a8" stroke-width="2" stroke-dasharray="5,3"/>
      <text x="${cx}" y="${y0 + 18}" text-anchor="middle" font-size="14" font-weight="700" fill="#5344c7">${base} cm</text>
      <text x="${cx + 10}" y="${(y0 + y2) / 2}" text-anchor="start" font-size="13" font-weight="700" fill="#c0226a">h = ${hauteur} cm</text>
    </svg>`;
    elQuestion.innerHTML = `<div class="perimetre-question">
      <p>Calcule l'<strong>aire</strong> de ce triangle (en cm²).</p>
      ${svgT}
      <p style="font-size:0.78rem;color:#888">💡 Aire = base × hauteur ÷ 2</p>
    </div>`;
    const pMin = Math.max(1, aire - Math.max(5, Math.round(aire / 3)));
    const pMax = aire + Math.max(5, Math.round(aire / 3));
    const props = propositionsAvecBonne(aire, pMin, pMax, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  // CM1 : aire rectangle (l × L) et carré (c²)
  const useSquare = Math.random() < 0.4;
  if (useSquare) {
    const c = 2 + Math.floor(Math.random() * [6, 10, 15][diff]);
    const aire = c * c;
    setBonneReponse(aire);
    elQuestion.innerHTML = `<div class="perimetre-question">
      <p>Calcule l'<strong>aire</strong> de ce carré (en cm²).</p>
      ${svgPerimetre("carre", c, c)}
      <p style="font-size:0.78rem;color:#888">💡 Aire = côté × côté = ${c} × ${c}</p>
    </div>`;
    const props = propositionsAvecBonne(aire, Math.max(1, aire - Math.max(5, Math.round(aire / 3))), aire + Math.max(5, Math.round(aire / 3)), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
  } else {
    const l = 2 + Math.floor(Math.random() * [6, 10, 15][diff]);
    const L = 2 + Math.floor(Math.random() * [6, 10, 15][diff]);
    const aire = l * L;
    setBonneReponse(aire);
    elQuestion.innerHTML = `<div class="perimetre-question">
      <p>Calcule l'<strong>aire</strong> de ce rectangle (en cm²).</p>
      ${svgPerimetre("rectangle", L, l)}
      <p style="font-size:0.78rem;color:#888">💡 Aire = longueur × largeur</p>
    </div>`;
    const props = propositionsAvecBonne(aire, Math.max(1, aire - Math.max(5, Math.round(aire / 3))), aire + Math.max(5, Math.round(aire / 3)), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
  }
}

export function lancerCourseFractions() {
  elTitre.textContent = "🏁 Course des fractions";
  const diff = getDifficulte();
  const denomMax = estCM2() ? [9, 12, 16][diff] : estCM1() ? [8, 10, 12][diff] : [6, 8, 10][diff];
  const denom = 3 + Math.floor(Math.random() * Math.max(2, denomMax - 2));
  const num = 1 + Math.floor(Math.random() * (denom - 1));
  const facteurMax = estCM2() ? 5 : estCM1() ? 4 : 3;
  const facteur = 2 + Math.floor(Math.random() * (facteurMax - 1));
  const bonne = `${num * facteur}/${denom * facteur}`;
  const cible = `${num}/${denom}`;
  const fausses = [];
  const essais = [
    `${num + 1}/${denom + 1}`,
    `${Math.max(1, num - 1)}/${denom}`,
    `${num * facteur}/${denom * Math.max(2, facteur - 1)}`,
    `${num * (facteur + 1)}/${denom * facteur}`,
    `${num + facteur}/${denom * facteur}`,
  ];
  essais.forEach((f) => {
    if (f !== bonne && !fausses.includes(f)) fausses.push(f);
  });
  while (fausses.length < 3) {
    const n = 1 + Math.floor(Math.random() * (denom * facteur));
    const d = denom * facteur;
    const f = `${n}/${d}`;
    if (f !== bonne && !fausses.includes(f)) fausses.push(f);
  }
  const options = melanger([bonne, ...fausses.slice(0, 3)]);
  setBonneReponse(options.indexOf(bonne));
  elQuestion.innerHTML =
    `<p style="font-size:0.9rem;margin:0 0 0.35rem">Trouve une fraction équivalente à :</p>` +
    `<p class="equation" style="font-size:2rem;font-weight:800;margin:0 0 0.45rem;color:var(--primaire)">${cible}</p>` +
    `<p style="font-size:0.78rem;color:#888;margin:0">Même part du gâteau, écriture différente.</p>`;
  elChoix.innerHTML = "";
  options.forEach((val, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.fontSize = "1rem";
    b.textContent = val;
    b.dataset.valeur = String(idx);
    b.addEventListener("click", () => apresReponse(idx, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

export function lancerGeoConstructeur() {
  elTitre.textContent = "🧱 Géo-constructeur";
  const diff = getDifficulte();
  const tri = 1 + Math.floor(Math.random() * [2, 3, 4][diff]);
  const car = 1 + Math.floor(Math.random() * [2, 3, 4][diff]);
  const rec = (estCM1() || estCM2()) ? Math.floor(Math.random() * [2, 3, 4][diff]) : 0;
  const pent = estCM2() && diff > 0 ? Math.floor(Math.random() * 2) : 0;
  const total = tri * 3 + car * 4 + rec * 4 + pent * 5;
  setBonneReponse(total);
  const morceaux = [`${tri} triangle${tri > 1 ? "s" : ""}`, `${car} carré${car > 1 ? "s" : ""}`];
  if (rec > 0) morceaux.push(`${rec} rectangle${rec > 1 ? "s" : ""}`);
  if (pent > 0) morceaux.push(`${pent} pentagone${pent > 1 ? "s" : ""}`);
  elQuestion.innerHTML =
    `<p style="font-size:0.9rem;margin:0 0 0.35rem">Combien de côtés au total ?</p>` +
    `<p style="font-size:1.05rem;font-weight:700;margin:0 0 0.45rem;color:var(--primaire)">${morceaux.join(" + ")}</p>`;
  const minVal = Math.max(3, total - [6, 8, 10][diff]);
  const maxVal = total + [8, 12, 16][diff];
  const props = propositionsAvecBonne(total, minVal, maxVal, 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}
