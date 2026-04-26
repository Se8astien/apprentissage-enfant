// games-temps.js — lancerHeure, lancerDurees, lancerMesures, lancerMasse, lancerCalendrier

import {
  elTitre,
  elQuestion,
  elChoix,
  setBonneReponse,
  getBonneReponse,
  estCE1,
  estCE2,
  melanger,
  propositionsAvecBonne,
  afficherChoix,
} from "./app-state.js";

import { apresReponse, resetFeedback } from "./app-nav.js";

// ── SVG horloge analogique ────────────────────────────────────────────────────
export function svgHorloge(heure, minute, taille) {
  const cx = taille / 2;
  const cy = taille / 2;
  const r = taille / 2 - 3;
  const rad = (d) => (d * Math.PI) / 180;

  const angleM = rad((minute / 60) * 360 - 90);
  const angleH = rad((((heure % 12) + minute / 60) / 12) * 360 - 90);

  const lonM = r * 0.72;
  const lonH = r * 0.50;

  const mX = (cx + lonM * Math.cos(angleM)).toFixed(2);
  const mY = (cy + lonM * Math.sin(angleM)).toFixed(2);
  const hX = (cx + lonH * Math.cos(angleH)).toFixed(2);
  const hY = (cy + lonH * Math.sin(angleH)).toFixed(2);

  let ticks = "";
  for (let i = 0; i < 12; i++) {
    const a = rad(i * 30 - 90);
    const major = i % 3 === 0;
    const r1 = r - (major ? Math.round(taille * 0.09) : Math.round(taille * 0.055));
    const r2 = r - 2;
    const x1 = (cx + r1 * Math.cos(a)).toFixed(2);
    const y1 = (cy + r1 * Math.sin(a)).toFixed(2);
    const x2 = (cx + r2 * Math.cos(a)).toFixed(2);
    const y2 = (cy + r2 * Math.sin(a)).toFixed(2);
    const sw = major ? (taille > 100 ? 3 : 2) : (taille > 100 ? 1.5 : 1);
    const col = major ? "#6c5ce7" : "#c4b5f9";
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`;
  }

  const swM = taille > 100 ? 3.5 : 2;
  const swH = taille > 100 ? 5.5 : 3.5;
  const dotR = taille > 100 ? 5.5 : 3.5;
  const bw = taille > 100 ? 3 : 2;

  return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="#6c5ce7" stroke-width="${bw}"/>
  ${ticks}
  <line x1="${cx}" y1="${cy}" x2="${mX}" y2="${mY}" stroke="#00cec9" stroke-width="${swM}" stroke-linecap="round"/>
  <line x1="${cx}" y1="${cy}" x2="${hX}" y2="${hY}" stroke="#5344c7" stroke-width="${swH}" stroke-linecap="round"/>
  <circle cx="${cx}" cy="${cy}" r="${dotR}" fill="#5344c7"/>
</svg>`;
}

export function afficherChoixHorloge(options) {
  elChoix.innerHTML = "";
  options.forEach((totalMin) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.textContent = labelHeure(totalMin);
    b.dataset.valeur = String(totalMin);
    b.addEventListener("click", () => apresReponse(totalMin, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

export function labelHeure(totalMin) {
  const h = Math.floor(totalMin / 60) || 12;
  const m = totalMin % 60;
  if (m === 0) return String(h);
  return h + "h" + String(m).padStart(2, "0");
}

function svgHorlogeAnnotee(heure, minute, taille) {
  const cx = taille / 2, cy = taille / 2;
  const r = taille / 2 - 3;
  const rad = (d) => (d * Math.PI) / 180;
  const angleM = rad((minute / 60) * 360 - 90);
  const angleH = rad((((heure % 12) + minute / 60) / 12) * 360 - 90);
  const lonM = r * 0.68, lonH = r * 0.46;
  const mX = (cx + lonM * Math.cos(angleM)).toFixed(2);
  const mY = (cy + lonM * Math.sin(angleM)).toFixed(2);
  const hX = (cx + lonH * Math.cos(angleH)).toFixed(2);
  const hY = (cy + lonH * Math.sin(angleH)).toFixed(2);
  let ticks = "";
  for (let i = 0; i < 12; i++) {
    const a = rad(i * 30 - 90);
    const r1 = r - Math.round(taille * 0.07);
    const r2 = r - 2;
    ticks += `<line x1="${(cx + r1 * Math.cos(a)).toFixed(2)}" y1="${(cy + r1 * Math.sin(a)).toFixed(2)}" x2="${(cx + r2 * Math.cos(a)).toFixed(2)}" y2="${(cy + r2 * Math.sin(a)).toFixed(2)}" stroke="#c4b5f9" stroke-width="1.5" stroke-linecap="round"/>`;
  }
  let nums = "";
  for (let n = 1; n <= 12; n++) {
    const a = rad(n * 30 - 90);
    const nr = r * 0.74;
    nums += `<text x="${(cx + nr * Math.cos(a)).toFixed(2)}" y="${(cy + nr * Math.sin(a)).toFixed(2)}" text-anchor="middle" dominant-baseline="central" font-size="${Math.round(taille * 0.10)}" fill="#4a4068" font-weight="700" font-family="inherit">${n}</text>`;
  }
  return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="#6c5ce7" stroke-width="2"/>
  ${ticks}${nums}
  <line x1="${cx}" y1="${cy}" x2="${mX}" y2="${mY}" stroke="#00cec9" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="${cx}" y1="${cy}" x2="${hX}" y2="${hY}" stroke="#5344c7" stroke-width="4" stroke-linecap="round"/>
  <circle cx="${cx}" cy="${cy}" r="3.5" fill="#5344c7"/>
</svg>`;
}

function montrerAideHeure() {
  resetFeedback();
  elChoix.innerHTML = "";
  const exemples = [
    { h: 3, m: 0,  label: "3h00",  sub: "grande sur le 12" },
    { h: 3, m: 15, label: "3h15",  sub: "grande sur le 3" },
    { h: 3, m: 30, label: "3h30",  sub: "grande sur le 6" },
    { h: 3, m: 45, label: "3h45",  sub: "grande sur le 9" },
  ];
  const exHTML = exemples.map((e) =>
    `<div class="aide-ex">
      <div class="grande-horloge">${svgHorlogeAnnotee(e.h, e.m, 90)}</div>
      <p class="aide-ex-label">${e.label}</p>
      <p class="aide-ex-sub">${e.sub}</p>
    </div>`
  ).join("");
  elQuestion.innerHTML = `
    <div class="aide-heure">
      <p class="aide-heure-titre">🕐 Comment lire l'heure ?</p>
      <div class="aide-heure-legende">
        <div class="aide-legende-item heures">🟣 Petite aiguille épaisse → les <strong>HEURES</strong></div>
        <div class="aide-legende-item minutes">🔵 Grande aiguille fine → les <strong>MINUTES</strong></div>
      </div>
      <div class="aide-heure-exemples">${exHTML}</div>
      <button type="button" class="btn-retour-aide" id="btn-retour-aide">← Nouvelle question</button>
    </div>`;
  document.getElementById("btn-retour-aide").addEventListener("click", lancerHeure);
}

// ── lancerHeure ───────────────────────────────────────────────────────────────
export function lancerHeure() {
  elTitre.textContent = "🕐 L'heure";

  let pool = [];
  if (estCE2()) {
    for (let h = 1; h <= 12; h++) {
      for (let m = 0; m < 60; m++) {
        pool.push(h * 60 + m);
      }
    }
  } else {
    const minutesPool = estCE1()
      ? [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
      : [0, 15, 30, 45];
    for (let h = 1; h <= 12; h++) {
      for (const m of minutesPool) {
        pool.push(h * 60 + m);
      }
    }
  }

  const bonne = pool[Math.floor(Math.random() * pool.length)];
  const bonneH = Math.floor(bonne / 60);
  const bonneM = bonne % 60;

  let fausses;
  if (estCE2()) {
    // Distractors: ±1, ±2, ±5 minutes from correct answer
    const offsets = [-5, -2, -1, 1, 2, 5];
    const candidats = offsets
      .map(d => bonne + d)
      .filter(t => t > 0 && t !== bonne && Math.floor(t / 60) >= 1 && Math.floor(t / 60) <= 12);
    fausses = melanger(candidats).slice(0, 3);
    // pad if needed
    while (fausses.length < 3) {
      const extra = bonne + (fausses.length % 2 === 0 ? 3 : -3);
      if (extra > 0 && extra !== bonne && !fausses.includes(extra)) fausses.push(extra);
      else break;
    }
  } else {
    const memHeure = pool.filter((t) => Math.floor(t / 60) === bonneH && t !== bonne);
    const autreHeure = pool.filter((t) => Math.floor(t / 60) !== bonneH);
    const distMemH = melanger(memHeure).slice(0, 2);
    const distAutreH = melanger(autreHeure).slice(0, 1);
    fausses = melanger([...distMemH, ...distAutreH]).slice(0, 3);
  }
  const options = melanger([bonne, ...fausses]);

  setBonneReponse(bonne);

  const questionTexte = estCE1()
    ? `<p style="font-size:0.88rem;font-weight:700;margin:0 0 0.3rem;color:var(--primaire)">Quelle heure est-il ?</p>`
    : "";
  elQuestion.innerHTML = questionTexte +
    `<div class="grande-horloge">${svgHorloge(bonneH || 12, bonneM, 160)}</div>` +
    `<button type="button" class="btn-aide-heure" id="btn-aide-heure">💡 Comment lire l'heure ?</button>`;
  document.getElementById("btn-aide-heure").addEventListener("click", montrerAideHeure);
  afficherChoixHorloge(options);
}

function texteMinutes(min) {
  if (min < 60) return min + " minutes";
  if (min === 60) return "1 heure";
  if (min === 90) return "1h30";
  if (min === 120) return "2 heures";
  return min + " minutes";
}

// ── lancerDurees ──────────────────────────────────────────────────────────────
export function lancerDurees() {
  elTitre.textContent = "⏱️ Durées";

  if (estCE2()) {
    const debutH = 8 + Math.floor(Math.random() * 10);
    const debutM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const duree1 = [30, 45, 60, 90][Math.floor(Math.random() * 4)];
    const duree2 = [15, 30, 45, 60][Math.floor(Math.random() * 4)];
    const finMin = debutH * 60 + debutM + duree1 + duree2;
    setBonneReponse(finMin);

    const affH = debutH + "h" + String(debutM).padStart(2, "0");
    elQuestion.innerHTML = `<div class="duree-question">
      <div class="grande-horloge">${svgHorloge(debutH || 12, debutM, 120)}</div>
      <p>Il est <strong>${affH}</strong>. Tu regardes un film de <strong>${texteMinutes(duree1)}</strong> puis tu fais <strong>${texteMinutes(duree2)}</strong> de vélo.</p>
      <p>À quelle heure tu finis ?</p>
    </div>`;

    const fausses = [-60, -45, -30, -15, 15, 30, 45, 60]
      .map(d => finMin + d)
      .filter(t => t > 0 && t !== finMin && Math.floor(t / 60) < 24);
    afficherChoixHorloge(melanger([finMin, ...melanger(fausses).slice(0, 3)]));
    return;
  }

  let debutH, debutM, dureeMin, texteduree;

  if (!estCE1()) {
    debutH = 8 + Math.floor(Math.random() * 9);
    debutM = 0;
    dureeMin = [30, 60][Math.floor(Math.random() * 2)];
    texteduree = dureeMin === 60 ? "1 heure" : "30 minutes";
  } else {
    debutH = 8 + Math.floor(Math.random() * 9);
    debutM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const durees = [15, 30, 45, 60, 90, 120];
    dureeMin = durees[Math.floor(Math.random() * durees.length)];
    if (dureeMin < 60) texteduree = dureeMin + " minutes";
    else if (dureeMin === 60) texteduree = "1 heure";
    else if (dureeMin === 90) texteduree = "1h30";
    else texteduree = "2 heures";
  }

  const debutMin = debutH * 60 + debutM;
  const finMin = debutMin + dureeMin;
  setBonneReponse(finMin);

  const activites = ["Tu joues", "Tu lis", "Tu dessines", "Tu danses", "Tu fais du vélo"];
  const acti = activites[Math.floor(Math.random() * activites.length)];
  const affH = debutH + "h" + String(debutM).padStart(2, "0");

  elQuestion.innerHTML = `<div class="duree-question">
    <div class="grande-horloge">${svgHorloge(debutH || 12, debutM, 120)}</div>
    <p>Il est <strong>${affH}</strong>.</p>
    <p>${acti} pendant <strong>${texteduree}</strong>.</p>
    <p>À quelle heure tu t'arrêtes ?</p>
  </div>`;

  const fausses = [-60, -45, -30, -15, 15, 30, 45, 60, 90]
    .map(d => finMin + d)
    .filter(t => t > 0 && t !== finMin && Math.floor(t / 60) < 24);
  afficherChoixHorloge(melanger([finMin, ...melanger(fausses).slice(0, 3)]));
}

// ── lancerMesures ─────────────────────────────────────────────────────────────
export function lancerMesures() {
  elTitre.textContent = "📏 Mesures";

  if (estCE2()) {
    const type = Math.floor(Math.random() * 4);
    let question, answer, rappel;
    if (type === 0) {
      const km = 1 + Math.floor(Math.random() * 20);
      answer = km * 1000;
      question = `Combien de mètres dans <strong>${km} km</strong> ?`;
      rappel = "1 km = 1 000 m";
    } else if (type === 1) {
      const m = 1 + Math.floor(Math.random() * 20);
      answer = m * 100;
      question = `Combien de cm dans <strong>${m} m</strong> ?`;
      rappel = "1 m = 100 cm";
    } else if (type === 2) {
      const kg = 1 + Math.floor(Math.random() * 20);
      answer = kg * 1000;
      question = `Combien de grammes dans <strong>${kg} kg</strong> ?`;
      rappel = "1 kg = 1 000 g";
    } else {
      const l = 1 + Math.floor(Math.random() * 20);
      answer = l * 100;
      question = `Combien de cL dans <strong>${l} L</strong> ?`;
      rappel = "1 L = 100 cL";
    }
    setBonneReponse(answer);
    elQuestion.innerHTML =
      `<p style="font-size:0.9rem;margin:0 0 0.35rem">💡 Rappel : <strong>${rappel}</strong></p>` +
      `<p class="equation" style="font-size:1.9rem;font-weight:700;margin-top:0.5rem">${question}</p>`;
    const minVal = Math.max(1, Math.round(answer * 0.6));
    const maxVal = Math.round(answer * 1.4);
    const props = propositionsAvecBonne(answer, minVal, maxVal, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (!estCE1()) {
    const maxLen = 12;
    const lenA = 3 + Math.floor(Math.random() * (maxLen - 2));
    let lenB;
    do { lenB = 3 + Math.floor(Math.random() * (maxLen - 2)); } while (lenB === lenA);
    setBonneReponse(lenA > lenB ? 0 : 1);
    const scale = 18;
    const wA = lenA * scale, wB = lenB * scale;
    const maxW = Math.max(wA, wB) + 20;
    const labelA = lenA + " cm", labelB = lenB + " cm";
    elQuestion.innerHTML = `
      <p style="font-size:0.88rem;margin:0 0 0.5rem">Quelle barre est la plus <strong>longue</strong> ?</p>
      <svg width="${maxW + 60}" height="90" viewBox="0 0 ${maxW + 60} 90">
        <rect x="10" y="10" width="${wA}" height="26" rx="6" fill="#6c5ce7" opacity="0.85"/>
        <text x="${10 + wA + 6}" y="28" fill="#5344c7" font-size="13" font-weight="700" font-family="Fredoka,sans-serif">${labelA}</text>
        <rect x="10" y="50" width="${wB}" height="26" rx="6" fill="#fd79a8" opacity="0.85"/>
        <text x="${10 + wB + 6}" y="68" fill="#c0226a" font-size="13" font-weight="700" font-family="Fredoka,sans-serif">${labelB}</text>
      </svg>`;
    elChoix.innerHTML = "";
    [
      { val: 0, col: "#6c5ce7", label: labelA },
      { val: 1, col: "#fd79a8", label: labelB },
    ].forEach(({ val, col, label }) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix"; b.style.fontSize = "1.1rem";
      b.innerHTML = `<span style="color:${col};font-weight:800">${label}</span>`;
      b.dataset.valeur = String(val);
      b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
    return;
  }

  // CE1 : 40% conversion cm↔mm, 60% comparaison de barres jusqu'à 30 cm
  const useConversion = Math.random() < 0.40;
  if (useConversion) {
    const typeConv = Math.random() < 0.5 ? "cm_vers_mm" : "mm_vers_cm";
    if (typeConv === "cm_vers_mm") {
      const cm = 1 + Math.floor(Math.random() * 20);
      const mm = cm * 10;
      setBonneReponse(mm);
      elQuestion.innerHTML =
        `<p style="font-size:0.9rem;margin:0 0 0.35rem">💡 Rappel : <strong>1 cm = 10 mm</strong></p>` +
        `<p class="equation" style="font-size:1.9rem;font-weight:700;margin-top:0.5rem">` +
        `Combien de mm dans <strong>${cm} cm</strong> ?</p>`;
      const props = propositionsAvecBonne(mm, Math.max(5, mm - 30), Math.min(220, mm + 30), 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    } else {
      const cm = 1 + Math.floor(Math.random() * 20);
      const mm = cm * 10;
      setBonneReponse(cm);
      elQuestion.innerHTML =
        `<p style="font-size:0.9rem;margin:0 0 0.35rem">💡 Rappel : <strong>10 mm = 1 cm</strong></p>` +
        `<p class="equation" style="font-size:1.9rem;font-weight:700;margin-top:0.5rem">` +
        `Combien de cm dans <strong>${mm} mm</strong> ?</p>`;
      const props = propositionsAvecBonne(cm, Math.max(1, cm - 5), Math.min(22, cm + 5), 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    }
  } else {
    const maxLen = 30;
    const lenA = 3 + Math.floor(Math.random() * (maxLen - 2));
    let lenB;
    do { lenB = 3 + Math.floor(Math.random() * (maxLen - 2)); } while (lenB === lenA);
    setBonneReponse(lenA > lenB ? 0 : 1);
    const scale = Math.min(18, 260 / maxLen);
    const wA = Math.round(lenA * scale), wB = Math.round(lenB * scale);
    const maxW = Math.max(wA, wB) + 20;
    const labelA = lenA + " cm", labelB = lenB + " cm";
    elQuestion.innerHTML = `
      <p style="font-size:0.88rem;margin:0 0 0.5rem">Quelle barre est la plus <strong>longue</strong> ?</p>
      <svg width="${maxW + 60}" height="90" viewBox="0 0 ${maxW + 60} 90">
        <rect x="10" y="10" width="${wA}" height="26" rx="6" fill="#6c5ce7" opacity="0.85"/>
        <text x="${10 + wA + 6}" y="28" fill="#5344c7" font-size="13" font-weight="700" font-family="Fredoka,sans-serif">${labelA}</text>
        <rect x="10" y="50" width="${wB}" height="26" rx="6" fill="#fd79a8" opacity="0.85"/>
        <text x="${10 + wB + 6}" y="68" fill="#c0226a" font-size="13" font-weight="700" font-family="Fredoka,sans-serif">${labelB}</text>
      </svg>`;
    elChoix.innerHTML = "";
    [
      { val: 0, col: "#6c5ce7", label: labelA },
      { val: 1, col: "#fd79a8", label: labelB },
    ].forEach(({ val, col, label }) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix"; b.style.fontSize = "1.1rem";
      b.innerHTML = `<span style="color:${col};font-weight:800">${label}</span>`;
      b.dataset.valeur = String(val);
      b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
  }
}

// ── lancerMasse ───────────────────────────────────────────────────────────────
const OBJETS_MASSE = [
  { emoji: "🍎", nom: "une pomme",    masse: 200 },
  { emoji: "📚", nom: "un livre",     masse: 500 },
  { emoji: "🧸", nom: "un doudou",    masse: 300 },
  { emoji: "⚽", nom: "un ballon",    masse: 400 },
  { emoji: "🍌", nom: "une banane",   masse: 150 },
  { emoji: "🥛", nom: "1 L de lait", masse: 1000 },
  { emoji: "🍫", nom: "un chocolat", masse: 100 },
  { emoji: "🎒", nom: "un cartable",  masse: 2000 },
  { emoji: "🐱", nom: "un chat",      masse: 4000 },
  { emoji: "🐶", nom: "un chien",     masse: 6000 },
];

function formatMasse(g) {
  if (g >= 1000 && g % 1000 === 0) return (g / 1000) + " kg";
  if (g >= 1000) return Math.floor(g / 1000) + " kg " + (g % 1000) + " g";
  return g + " g";
}

export function lancerMasse() {
  elTitre.textContent = "⚖️ La masse";

  if (estCE2()) {
    // 30% chance: conversion question kg→g
    if (Math.random() < 0.30) {
      const kg = 1 + Math.floor(Math.random() * 20);
      const answer = kg * 1000;
      setBonneReponse(answer);
      elQuestion.innerHTML =
        `<p style="font-size:0.9rem;margin:0 0 0.35rem">💡 Rappel : <strong>1 kg = 1 000 g</strong></p>` +
        `<p class="equation" style="font-size:1.9rem;font-weight:700;margin-top:0.5rem">` +
        `<strong>${kg} kg</strong> = ? g</p>`;
      const minVal = Math.max(1, Math.round(answer * 0.6));
      const maxVal = Math.round(answer * 1.4);
      const props = propositionsAvecBonne(answer, minVal, maxVal, 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
      return;
    }
    // 3-object total mass
    const trois = melanger(OBJETS_MASSE).slice(0, 3);
    const [objA, objB, objC] = trois;
    const total = objA.masse + objB.masse + objC.masse;
    setBonneReponse(total);
    elQuestion.innerHTML = `<div class="masse-question">
      <p>${objA.emoji} ${objA.nom} pèse <strong>${formatMasse(objA.masse)}</strong>.</p>
      <p>${objB.emoji} ${objB.nom} pèse <strong>${formatMasse(objB.masse)}</strong>.</p>
      <p>${objC.emoji} ${objC.nom} pèse <strong>${formatMasse(objC.masse)}</strong>.</p>
      <p>Combien pèsent-ils <strong>ensemble</strong> ?</p>
    </div>`;
    const step = total >= 1000 ? 500 : 50;
    const fausses = [-3, -2, -1, 1, 2, 3]
      .map(d => total + d * step)
      .filter(v => v > 0 && v !== total);
    const opts = melanger([total, ...melanger(fausses).slice(0, 3)]);
    elChoix.innerHTML = "";
    opts.forEach(v => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix";
      b.textContent = formatMasse(v);
      b.dataset.valeur = String(v);
      b.addEventListener("click", () => apresReponse(v, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
    return;
  }

  const deux = melanger(OBJETS_MASSE).slice(0, 2);
  const [objA, objB] = deux;

  if (!estCE1()) {
    if (objA.masse === objB.masse) { lancerMasse(); return; }
    setBonneReponse(objA.masse > objB.masse ? 0 : 1);
    elQuestion.innerHTML = `<div class="masse-question">
      <p>Lequel est le plus <strong>lourd</strong> ?</p>
      <div class="masse-objets">
        <div class="masse-objet">${objA.emoji}<br><span class="masse-val">${formatMasse(objA.masse)}</span></div>
        <div class="masse-vs">ou</div>
        <div class="masse-objet">${objB.emoji}<br><span class="masse-val">${formatMasse(objB.masse)}</span></div>
      </div>
    </div>`;
    elChoix.innerHTML = "";
    [{ val: 0, obj: objA }, { val: 1, obj: objB }].forEach(({ val, obj }) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix";
      b.textContent = obj.emoji + " " + formatMasse(obj.masse);
      b.dataset.valeur = String(val);
      b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
  } else {
    const total = objA.masse + objB.masse;
    setBonneReponse(total);
    elQuestion.innerHTML = `<div class="masse-question">
      <p>${objA.emoji} ${objA.nom} pèse <strong>${formatMasse(objA.masse)}</strong>.</p>
      <p>${objB.emoji} ${objB.nom} pèse <strong>${formatMasse(objB.masse)}</strong>.</p>
      <p>Combien pèsent-ils <strong>ensemble</strong> ?</p>
    </div>`;
    const step = total >= 1000 ? 500 : 50;
    const fausses = [-3, -2, -1, 1, 2, 3]
      .map(d => total + d * step)
      .filter(v => v > 0 && v !== total);
    const opts = melanger([total, ...melanger(fausses).slice(0, 3)]);
    elChoix.innerHTML = "";
    opts.forEach(v => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix";
      b.textContent = formatMasse(v);
      b.dataset.valeur = String(v);
      b.addEventListener("click", () => apresReponse(v, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
  }
}

// ── lancerCalendrier ──────────────────────────────────────────────────────────
const JOURS_SEM = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const MOIS_AN = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const JOURS_PAR_MOIS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function lancerCalendrier() {
  elTitre.textContent = "📅 Calendrier";

  if (estCE1()) {
    const type = Math.random() < 0.5 ? "ordre" : "jours";
    if (type === "ordre") {
      const idx = Math.floor(Math.random() * 12);
      const bonne = MOIS_AN[(idx + 1) % 12];
      setBonneReponse(bonne);
      elQuestion.innerHTML =
        `<p style="font-size:0.9rem;margin-bottom:0.5rem">Quel mois vient <strong>après</strong> :</p>` +
        `<p style="font-size:2rem;font-weight:700;color:var(--primaire);margin:0.3rem 0">${MOIS_AN[idx]}</p>`;
      const fausses = melanger(MOIS_AN.filter((_, i) => i !== (idx + 1) % 12)).slice(0, 3);
      const options = melanger([bonne, ...fausses]);
      elChoix.innerHTML = "";
      options.forEach(m => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "btn-choix"; b.style.fontSize = "0.95rem";
        b.textContent = m; b.dataset.valeur = m;
        b.addEventListener("click", () => apresReponseTexte(m, b, getBonneReponse()));
        elChoix.appendChild(b);
      });
    } else {
      const idx = Math.floor(Math.random() * 12);
      const jours = JOURS_PAR_MOIS[idx];
      setBonneReponse(jours);
      elQuestion.innerHTML =
        `<p style="font-size:0.9rem;margin-bottom:0.5rem">Combien de jours dans <strong>${MOIS_AN[idx]}</strong> ?</p>`;
      const fausses = [28, 29, 30, 31].filter(n => n !== jours);
      const options = melanger([jours, ...melanger(fausses).slice(0, 3)]);
      afficherChoix(options, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    }
    return;
  }

  // CP : quel jour vient après ?
  const idx = Math.floor(Math.random() * 7);
  const suiv = (idx + 1) % 7;
  const bonne = JOURS_SEM[suiv];
  setBonneReponse(bonne);
  elQuestion.innerHTML =
    `<p style="font-size:0.9rem;margin-bottom:0.5rem">Quel jour vient <strong>après</strong> :</p>` +
    `<p style="font-size:2rem;font-weight:700;color:var(--primaire);margin:0.3rem 0">${JOURS_SEM[idx]}</p>`;
  const fausses = melanger(JOURS_SEM.filter((_, i) => i !== suiv)).slice(0, 3);
  const options = melanger([bonne, ...fausses]);
  elChoix.innerHTML = "";
  options.forEach(j => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn-choix"; b.style.fontSize = "0.95rem";
    b.textContent = j; b.dataset.valeur = j;
    b.addEventListener("click", () => apresReponseTexte(j, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}
