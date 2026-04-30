// games-maths.js — lancerCompte, lancerAddition, lancerSoustraction, lancerCompare,
//                  lancerSuite, lancerDoubles, lancerMoitie, lancerDizaines, lancerPairImpair,
//                  lancerPerlesDorees, lancerPlanche100

import {
  ANIMAUX,
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

import { apresReponse, apresReponseTexte } from "./app-nav.js";

function afficherChoixTexte(options, bonne) {
  elChoix.innerHTML = "";
  options.forEach(v => {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "btn-choix";
    btn.textContent = v; btn.dataset.valeur = v;
    btn.addEventListener("click", () => apresReponseTexte(v, btn, bonne));
    elChoix.appendChild(btn);
  });
}

// ── lancerCompte ──────────────────────────────────────────────────────────────
export function lancerCompte() {
  elTitre.textContent = "Compte-moi ça !";
  const diff = getDifficulte();

  if (estCE2()) {
    const mins = [2, 3, 5][diff];
    const maxs = [6, 8, 10][diff];
    const idxs = [];
    while (idxs.length < 3) {
      const i = Math.floor(Math.random() * ANIMAUX.length);
      if (!idxs.includes(i)) idxs.push(i);
    }
    const [eA, eB, eC] = idxs.map(i => ANIMAUX[i]);
    const nA = mins + Math.floor(Math.random() * (maxs - mins + 1));
    const nB = mins + Math.floor(Math.random() * (maxs - mins + 1));
    const nC = mins + Math.floor(Math.random() * (maxs - mins + 1));
    const total3 = nA + nB + nC;
    const lA = Array(nA).fill(eA).join(" ");
    const lB = Array(nB).fill(eB).join(" ");
    const lC = Array(nC).fill(eC).join(" ");
    const typeEcart3 = diff >= 1 && Math.random() < 0.40;
    if (typeEcart3) {
      const maxN3 = Math.max(nA, nB, nC);
      const minN3 = Math.min(nA, nB, nC);
      const ecart3 = maxN3 - minN3;
      const emGrand = nA === maxN3 ? eA : (nB === maxN3 ? eB : eC);
      const emPetit = nA === minN3 ? eA : (nB === minN3 ? eB : eC);
      setBonneReponse(ecart3);
      elQuestion.innerHTML =
        `<p>Combien de ${emGrand} <strong>de plus</strong> que de ${emPetit} ?</p>` +
        `<p class="ligne-emojis petit">${lA}</p>` +
        `<p class="ligne-emojis petit">${lB}</p>` +
        `<p class="ligne-emojis petit">${lC}</p>`;
      const props = propositionsAvecBonne(ecart3, Math.max(0, ecart3 - 5), Math.min(10, ecart3 + 5), 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    } else {
      setBonneReponse(total3);
      elQuestion.innerHTML =
        `<p>Combien d'animaux <strong>en tout</strong> ?</p>` +
        `<p class="ligne-emojis petit">${lA}</p>` +
        `<p class="ligne-emojis petit">${lB}</p>` +
        `<p class="ligne-emojis petit">${lC}</p>`;
      const props = propositionsAvecBonne(total3, Math.max(9, total3 - 8), Math.min(30, total3 + 8), 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    }
    return;
  }

  if (estCE1()) {
    const mins = [2, 3, 5][diff];
    const maxs = [5, 9, 12][diff];
    const idxA = Math.floor(Math.random() * ANIMAUX.length);
    let idxB = Math.floor(Math.random() * ANIMAUX.length);
    if (idxB === idxA) idxB = (idxA + 1) % ANIMAUX.length;
    const emojiA = ANIMAUX[idxA];
    const emojiB = ANIMAUX[idxB];
    const nA = mins + Math.floor(Math.random() * (maxs - mins + 1));
    const nB = mins + Math.floor(Math.random() * (maxs - mins + 1));
    const ligneA = Array(nA).fill(emojiA).join(" ");
    const ligneB = Array(nB).fill(emojiB).join(" ");
    const typeEcart = diff >= 1 && Math.random() < 0.4 && nA !== nB;
    if (typeEcart) {
      const ecart = Math.abs(nA - nB);
      const plusGrand = nA > nB ? emojiA : emojiB;
      const plusPetit = nA > nB ? emojiB : emojiA;
      setBonneReponse(ecart);
      elQuestion.innerHTML =
        `<p>Combien de ${plusGrand} <strong>de plus</strong> que de ${plusPetit} ?</p>` +
        `<p class="ligne-emojis petit">${ligneA}</p>` +
        `<p class="ligne-emojis petit">${ligneB}</p>`;
      const props = propositionsAvecBonne(ecart, Math.max(0, ecart - 4), Math.min(12, ecart + 4), 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    } else {
      const total = nA + nB;
      setBonneReponse(total);
      elQuestion.innerHTML =
        `<p>Combien d'animaux <strong>en tout</strong> ?</p>` +
        `<p class="ligne-emojis petit">${ligneA}</p>` +
        `<p class="ligne-emojis petit">${ligneB}</p>`;
      const props = propositionsAvecBonne(total, Math.max(4, total - 5), Math.min(24, total + 5), 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    }
    return;
  }

  // CP (default)
  const minN = [1, 3, 8][diff];
  const maxN = [5, 10, 15][diff];
  const n = minN + Math.floor(Math.random() * (maxN - minN + 1));
  const emoji = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
  // Regroup emojis in rows of 5 for easier counting
  let lignesHtml = "";
  for (let i = 0; i < n; i += 5) {
    const row = Array(Math.min(5, n - i)).fill(emoji).join(" ");
    lignesHtml += `<p class="ligne-emojis${n > 5 ? " petit" : ""}">${row}</p>`;
  }
  elQuestion.innerHTML = "<p>Combien d'animaux tu vois ?</p>" + lignesHtml;
  setBonneReponse(n);
  const props = propositionsAvecBonne(n, Math.max(1, n - 3), Math.min(maxN + 2, n + 3), 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── lancerAddition ────────────────────────────────────────────────────────────
export function lancerAddition() {
  elTitre.textContent = "Addition magique";
  const diff = getDifficulte();
  let a;
  let b;
  let total;
  let html;

  if (estCM2()) {
    // CM2 : addition de décimaux simples (ex: 3,5 + 2,7)
    const entA = 1 + Math.floor(Math.random() * 9);
    const decA = 1 + Math.floor(Math.random() * 9);
    const entB = 1 + Math.floor(Math.random() * 9);
    const decB = 1 + Math.floor(Math.random() * 9);
    a = entA + decA / 10;
    b = entB + decB / 10;
    total = Math.round((a + b) * 10) / 10;
    const aStr = entA + "," + decA;
    const bStr = entB + "," + decB;
    const totalStr = Math.floor(total) + "," + (Math.round(total * 10) % 10);
    setBonneReponse(totalStr);
    html =
      "<p style='font-size:0.88rem;margin:0 0 0.35rem'>Calcule cette addition :</p>" +
      '<p class="equation" style="font-size:2.2rem;font-weight:700">' + aStr + " + " + bStr + " = ?</p>" +
      "<p style='font-size:0.78rem;color:#888;margin-top:0.4rem'>💡 Aligne les virgules !</p>";
    elQuestion.innerHTML = html;
    const fausses = [];
    const variants = [-1, 1, -2, 2, -11, 11];
    for (const v of melanger(variants)) {
      const candidate = Math.round(total * 10 + v);
      if (candidate > 0) {
        const cStr = Math.floor(candidate / 10) + "," + (candidate % 10);
        if (!fausses.includes(cStr) && cStr !== totalStr) fausses.push(cStr);
        if (fausses.length >= 3) break;
      }
    }
    while (fausses.length < 3) fausses.push(Math.floor(total + fausses.length + 1) + ",0");
    const options = melanger([totalStr, ...fausses.slice(0, 3)]);
    afficherChoixTexte(options, getBonneReponse());
    return;
  }

  if (estCM1()) {
    const maxCM1 = [999, 4999, 9999][diff];
    total = 100 + Math.floor(Math.random() * maxCM1);
    a = 1 + Math.floor(Math.random() * (total - 1));
    b = total - a;
    html =
      "<p style='font-size:0.88rem;margin:0 0 0.35rem'>Calcule cette addition :</p>" +
      '<p class="equation" style="font-size:2.2rem;font-weight:700">' + a + " + " + b + " = ?</p>" +
      "<p style='font-size:0.78rem;color:#888;margin-top:0.4rem'>💡 Pense à l'addition posée</p>";
    elQuestion.innerHTML = html;
    setBonneReponse(total);
    const props = propositionsAvecBonne(total, Math.max(100, total - 500), Math.min(9999, total + 500), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (estCE2()) {
    const maxCE2 = [300, 600, 999][diff];
    total = 100 + Math.floor(Math.random() * maxCE2);
    a = 1 + Math.floor(Math.random() * (total - 1));
    b = total - a;
    html =
      "<p style='font-size:0.88rem;margin:0 0 0.35rem'>Calcule cette addition :</p>" +
      '<p class="equation" style="font-size:2.2rem;font-weight:700">' + a + " + " + b + " = ?</p>" +
      "<p style='font-size:0.78rem;color:#888;margin-top:0.4rem'>💡 Pense à l'addition posée pour les grands nombres</p>";
    elQuestion.innerHTML = html;
    setBonneReponse(total);
    const props = propositionsAvecBonne(total, Math.max(100, total - 80), Math.min(999, total + 80), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (!estCE1()) {
    const maxCP = [5, 8, 10][diff];
    a = 1 + Math.floor(Math.random() * maxCP);
    b = 1 + Math.floor(Math.random() * maxCP);
    total = a + b;
    if (total <= 10) {
      const e1 = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
      let e2 = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
      if (e2 === e1) e2 = ANIMAUX[(ANIMAUX.indexOf(e1) + 1) % ANIMAUX.length];
      html =
        "<p>Combien en tout ?</p>" +
        '<p class="ligne-emojis">' +
        Array(a).fill(e1).join(" ") +
        " <span style='opacity:.5'>+</span> " +
        Array(b).fill(e2).join(" ") +
        "</p>" +
        '<p class="equation">' + a + " + " + b + " = ?</p>";
    } else {
      html =
        "<p>Calcule :</p>" +
        '<p class="equation" style="font-size:2rem;margin-top:.75rem">' +
        a + " + " + b + " = ?</p>";
    }
    const props = propositionsAvecBonne(total, Math.max(2, total - 6), Math.min(20, total + 6), 3);
    elQuestion.innerHTML = html;
    setBonneReponse(total);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  // CE1 : addition jusqu'à 79, parfois avec un multiple de 10 (20%)
  const maxCE1 = [30, 55, 79][diff];
  const useDizaine = Math.random() < 0.20;
  if (useDizaine) {
    const dizaines = [10, 20, 30, 40, 50];
    a = dizaines[Math.floor(Math.random() * dizaines.length)];
    b = 5 + Math.floor(Math.random() * Math.max(5, maxCE1 - 10));
  } else {
    total = 21 + Math.floor(Math.random() * Math.max(1, maxCE1 - 20));
    a = 1 + Math.floor(Math.random() * (total - 1));
    b = total - a;
  }
  total = a + b;

  html =
    "<p style='font-size:0.88rem;margin:0 0 0.35rem'>Calcule cette addition :</p>" +
    '<p class="equation" style="font-size:2.4rem;font-weight:700;margin-top:.75rem">' +
    a + " + " + b + " = ?</p>";

  elQuestion.innerHTML = html;
  setBonneReponse(total);
  const pmin = Math.max(2, total - 15);
  const pmax = Math.min(95, total + 15);
  const props = propositionsAvecBonne(total, pmin, pmax, 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── lancerSoustraction ────────────────────────────────────────────────────────
export function lancerSoustraction() {
  elTitre.textContent = "Les pommes";
  const diff = getDifficulte();
  let total;
  let enleve;
  let reste;

  if (estCM2()) {
    const maxCM2s = [9999, 49999, 99999][diff];
    total = 1000 + Math.floor(Math.random() * maxCM2s);
    enleve = 1 + Math.floor(Math.random() * (total - 1));
    reste = total - enleve;
    elQuestion.innerHTML =
      "<p style='font-size:0.88rem;margin:0 0 0.35rem'>Calcule cette soustraction :</p>" +
      '<p class="equation" style="font-size:2.2rem;font-weight:700;margin-top:.75rem">' + total + " − " + enleve + " = ?</p>" +
      "<p style='font-size:0.78rem;color:#888;margin-top:0.4rem'>💡 Soustraction posée</p>";
    setBonneReponse(reste);
    const props = propositionsAvecBonne(reste, Math.max(0, reste - 5000), Math.min(99998, reste + 5000), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (estCM1()) {
    const maxCM1s = [999, 4999, 9999][diff];
    total = 100 + Math.floor(Math.random() * maxCM1s);
    enleve = 1 + Math.floor(Math.random() * (total - 1));
    reste = total - enleve;
    elQuestion.innerHTML =
      "<p style='font-size:0.88rem;margin:0 0 0.35rem'>Calcule cette soustraction :</p>" +
      '<p class="equation" style="font-size:2.2rem;font-weight:700;margin-top:.75rem">' + total + " − " + enleve + " = ?</p>" +
      "<p style='font-size:0.78rem;color:#888;margin-top:0.4rem'>💡 Pense à la soustraction posée</p>";
    setBonneReponse(reste);
    const props = propositionsAvecBonne(reste, Math.max(0, reste - 500), Math.min(9998, reste + 500), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (estCE2()) {
    const maxCE2s = [300, 600, 999][diff];
    total = 100 + Math.floor(Math.random() * maxCE2s);
    enleve = 1 + Math.floor(Math.random() * (total - 1));
    reste = total - enleve;
    elQuestion.innerHTML =
      "<p style='font-size:0.88rem;margin:0 0 0.35rem'>Calcule cette soustraction :</p>" +
      '<p class="equation" style="font-size:2.2rem;font-weight:700;margin-top:.75rem">' + total + " − " + enleve + " = ?</p>" +
      "<p style='font-size:0.78rem;color:#888;margin-top:0.4rem'>💡 Pense à la soustraction posée</p>";
    setBonneReponse(reste);
    const props = propositionsAvecBonne(reste, Math.max(0, reste - 80), Math.min(998, reste + 80), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (!estCE1()) {
    const maxCPs = [10, 14, 20][diff];
    total = 4 + Math.floor(Math.random() * (maxCPs - 3));
  } else {
    const maxCE1s = [30, 55, 79][diff];
    total = 21 + Math.floor(Math.random() * Math.max(1, maxCE1s - 20));
  }
  enleve = 1 + Math.floor(Math.random() * (total - 1));
  reste = total - enleve;

  if (!estCE1() && total <= 10) {
    const biffees = Array(enleve).fill('<span style="opacity:0.25;text-decoration:line-through">🍎</span>');
    const restantes = Array(reste).fill("🍎");
    elQuestion.innerHTML =
      "<p>On mange <strong>" + enleve + "</strong> pommes sur <strong>" + total + "</strong>. Combien reste-t-il ?</p>" +
      '<p class="ligne-emojis">' + [...biffees, ...restantes].join(" ") + "</p>" +
      '<p class="equation">' + total + " − " + enleve + " = ?</p>";
  } else if (!estCE1()) {
    elQuestion.innerHTML =
      "<p>Il y a <strong>" + total + "</strong> pommes 🍎</p>" +
      "<p>On en mange <strong>" + enleve + "</strong>. Combien il en reste ?</p>" +
      '<p class="equation">' + total + " − " + enleve + " = ?</p>";
  } else {
    elQuestion.innerHTML =
      "<p style='font-size:0.88rem;margin:0 0 0.35rem'>Calcule cette soustraction :</p>" +
      '<p class="equation" style="font-size:2.4rem;font-weight:700;margin-top:.4rem">' + total + " − " + enleve + " = ?</p>" +
      "<p style='font-size:0.78rem;color:#888;margin-top:0.4rem'>💡 Pour les grands nombres, pense à la soustraction posée !</p>";
  }
  setBonneReponse(reste);
  const props = estCE1()
    ? propositionsAvecBonne(reste, Math.max(0, reste - 15), Math.min(89, reste + 15), 3)
    : propositionsAvecBonne(reste, 0, Math.min(20, total), 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── lancerCompare ─────────────────────────────────────────────────────────────
export function lancerCompare() {
  elTitre.textContent = "Le plus grand";
  let a;
  let b;

  if (estCM2()) {
    const type = Math.floor(Math.random() * 3);
    if (type === 0) {
      a = 100000 + Math.floor(Math.random() * 900000);
      b = 100000 + Math.floor(Math.random() * 900000);
      if (a === b) b = b < 999999 ? b + 1 : b - 1;
      setBonneReponse(Math.max(a, b));
      elQuestion.innerHTML =
        "<p>Quel nombre est le <strong>plus grand</strong> ?</p>" +
        '<p class="equation" style="font-size:clamp(1.2rem,5vw,1.8rem);text-align:center;margin-top:0.5rem">' +
        a.toLocaleString("fr-FR") + " &nbsp; ou &nbsp; " + b.toLocaleString("fr-FR") + "</p>";
      afficherChoix(melanger([a, b]), (val, btn) => apresReponse(val, btn, getBonneReponse()));
    } else if (type === 1) {
      const entA = 1 + Math.floor(Math.random() * 9);
      const decA = 1 + Math.floor(Math.random() * 9);
      const entB = 1 + Math.floor(Math.random() * 9);
      const decB = 1 + Math.floor(Math.random() * 9);
      const valA = entA + decA / 10;
      const valB = entB + decB / 10;
      if (valA === valB) { lancerCompare(); return; }
      const strA = entA + "," + decA;
      const strB = entB + "," + decB;
      setBonneReponse(valA > valB ? strA : strB);
      elQuestion.innerHTML =
        "<p>Quel nombre décimal est le <strong>plus grand</strong> ?</p>" +
        '<p class="equation" style="font-size:clamp(1.4rem,6vw,2.2rem);text-align:center;margin-top:0.5rem">' +
        strA + " &nbsp; ou &nbsp; " + strB + "</p>";
      elChoix.innerHTML = "";
      [strA, strB].forEach(str => {
        const btn = document.createElement("button");
        btn.type = "button"; btn.className = "btn-choix";
        btn.textContent = str; btn.dataset.valeur = str;
        btn.addEventListener("click", () => apresReponseTexte(str, btn, getBonneReponse()));
        elChoix.appendChild(btn);
      });
    } else {
      a = 100000 + Math.floor(Math.random() * 900000);
      b = 100000 + Math.floor(Math.random() * 900000);
      let c = 100000 + Math.floor(Math.random() * 900000);
      while (c === a || c === b) c = 100000 + Math.floor(Math.random() * 900000);
      if (a === b) b = b < 999999 ? b + 1 : b - 1;
      setBonneReponse(Math.min(a, b, c));
      elQuestion.innerHTML =
        "<p>Quel est le <strong>plus petit</strong> de ces trois nombres ?</p>" +
        '<p class="equation" style="font-size:clamp(1.1rem,4.5vw,1.6rem);text-align:center;margin-top:0.5rem">' +
        a.toLocaleString("fr-FR") + " &nbsp; " + b.toLocaleString("fr-FR") + " &nbsp; " + c.toLocaleString("fr-FR") + "</p>";
      afficherChoix(melanger([a, b, c]), (val, btn) => apresReponse(val, btn, getBonneReponse()));
    }
    return;
  }

  if (estCM1()) {
    if (Math.random() < 0.50) {
      a = 10000 + Math.floor(Math.random() * 90000);
      b = 10000 + Math.floor(Math.random() * 90000);
      if (a === b) b = b < 99999 ? b + 1 : b - 1;
      setBonneReponse(Math.max(a, b));
      elQuestion.innerHTML =
        "<p>Quel nombre est le <strong>plus grand</strong> ?</p>" +
        '<p class="equation" style="font-size:clamp(1.3rem,5.5vw,2rem);text-align:center;margin-top:0.5rem">' +
        a.toLocaleString("fr-FR") + " &nbsp; ou &nbsp; " + b.toLocaleString("fr-FR") + "</p>";
      afficherChoix(melanger([a, b]), (val, btn) => apresReponse(val, btn, getBonneReponse()));
    } else {
      a = 10000 + Math.floor(Math.random() * 90000);
      b = 10000 + Math.floor(Math.random() * 90000);
      if (a === b) b = b < 99999 ? b + 1 : b - 1;
      const symbole = a < b ? "<" : ">";
      setBonneReponse(symbole);
      elQuestion.innerHTML =
        "<p>Quel signe faut-il mettre entre ces deux nombres ?</p>" +
        '<p class="equation" style="font-size:clamp(1.3rem,5.5vw,2rem);text-align:center;margin-top:0.5rem">' +
        a.toLocaleString("fr-FR") + " &nbsp; <span style='color:#fd79a8'>?</span> &nbsp; " + b.toLocaleString("fr-FR") + "</p>" +
        "<p style='font-size:0.78rem;color:#888;margin-top:0.3rem'>💡 Le signe \"ouvre la bouche\" vers le plus grand</p>";
      elChoix.innerHTML = "";
      ["<", ">"].forEach(sym => {
        const btn = document.createElement("button");
        btn.type = "button"; btn.className = "btn-choix";
        btn.style.fontSize = "2rem"; btn.style.fontWeight = "700";
        btn.textContent = sym; btn.dataset.valeur = sym;
        btn.addEventListener("click", () => apresReponseTexte(sym, btn, getBonneReponse()));
        elChoix.appendChild(btn);
      });
    }
    return;
  }

  if (estCE2()) {
    if (Math.random() < 0.50) {
      // 50% : deux nombres à 4 chiffres → plus grand
      a = 1000 + Math.floor(Math.random() * 9000);
      b = 1000 + Math.floor(Math.random() * 9000);
      if (a === b) b = b < 9999 ? b + 1 : b - 1;
      setBonneReponse(Math.max(a, b));
      elQuestion.innerHTML =
        "<p>Quel nombre est le <strong>plus grand</strong> ?</p>" +
        '<p class="equation" style="font-size:clamp(1.4rem,6vw,2.2rem);text-align:center;margin-top:0.5rem">' +
        a + " &nbsp; ou &nbsp; " + b + "</p>";
      afficherChoix(melanger([a, b]), (val, btn) => apresReponse(val, btn, getBonneReponse()));
    } else {
      // 50% : trois nombres à 2 chiffres → plus petit
      a = 10 + Math.floor(Math.random() * 90);
      b = 10 + Math.floor(Math.random() * 90);
      let c = 10 + Math.floor(Math.random() * 90);
      while (c === a || c === b) c = 10 + Math.floor(Math.random() * 90);
      if (a === b) b = b < 99 ? b + 1 : b - 1;
      setBonneReponse(Math.min(a, b, c));
      elQuestion.innerHTML =
        "<p>Quel est le <strong>plus petit</strong> de ces trois nombres ?</p>" +
        '<p class="equation" style="font-size:clamp(1.4rem,6vw,2.2rem);text-align:center;margin-top:0.5rem">' +
        a + " &nbsp; " + b + " &nbsp; " + c + "</p>";
      afficherChoix(melanger([a, b, c]), (val, btn) => apresReponse(val, btn, getBonneReponse()));
    }
    return;
  }

  if (!estCE1()) {
    a = 1 + Math.floor(Math.random() * 20);
    b = 1 + Math.floor(Math.random() * 20);
  } else {
    if (Math.random() < 0.30) {
      a = 100 + Math.floor(Math.random() * 900);
      b = 100 + Math.floor(Math.random() * 900);
    } else {
      a = 10 + Math.floor(Math.random() * 90);
      b = 10 + Math.floor(Math.random() * 90);
    }
  }
  if (a === b) b = b < 999 ? b + 1 : b - 1;

  // CE1 : 40% chance de demander le symbole < > =
  if (estCE1() && Math.random() < 0.40) {
    const symbole = a < b ? "<" : ">";
    setBonneReponse(symbole);
    elQuestion.innerHTML =
      "<p>Quel signe faut-il mettre entre ces deux nombres ?</p>" +
      '<p class="equation" style="font-size:clamp(1.6rem,7vw,2.4rem);text-align:center;margin-top:0.5rem">' +
      a + " &nbsp; <span style='color:#fd79a8'>?</span> &nbsp; " + b + "</p>" +
      "<p style='font-size:0.78rem;color:#888;margin-top:0.3rem'>💡 Le signe \"ouvre la bouche\" vers le plus grand</p>";
    elChoix.innerHTML = "";
    ["<", ">"].forEach(sym => {
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "btn-choix";
      btn.style.fontSize = "2rem"; btn.style.fontWeight = "700";
      btn.textContent = sym; btn.dataset.valeur = sym;
      btn.addEventListener("click", () => apresReponseTexte(sym, btn, getBonneReponse()));
      elChoix.appendChild(btn);
    });
    return;
  }

  setBonneReponse(Math.max(a, b));
  elQuestion.innerHTML =
    "<p>Quel nombre est le <strong>plus grand</strong> ?</p>" +
    '<p class="equation" style="font-size:clamp(1.6rem,7vw,2.4rem);text-align:center;margin-top:0.5rem">' +
    a + " &nbsp; ou &nbsp; " + b + "</p>";
  afficherChoix(melanger([a, b]), (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── lancerSuite ───────────────────────────────────────────────────────────────
export function lancerSuite() {
  elTitre.textContent = "Numéro manquant";
  const diff = getDifficulte();
  let debut, step;
  if (estCM2()) {
    const stepPools = [
      [500, 1000],
      [250, 500, 1000, 2000],
      [100, 250, 500, 1000, 2000, 5000],
    ];
    const pool = stepPools[diff];
    step = pool[Math.floor(Math.random() * pool.length)];
    debut = step * (1 + Math.floor(Math.random() * 8));
  } else if (estCM1()) {
    const stepPools = [
      [100, 500],
      [100, 250, 500, 1000],
      [100, 250, 500, 1000],
    ];
    const pool = stepPools[diff];
    step = pool[Math.floor(Math.random() * pool.length)];
    debut = step * (1 + Math.floor(Math.random() * 10));
  } else if (estCE2()) {
    const stepPoolsCE2 = [
      [1, 2, 5, 10],
      [3, 4, 6, 7, 8, 9, 25, 50],
      [3, 4, 6, 7, 8, 9, 25, 50, 100],
    ];
    const pool = stepPoolsCE2[diff];
    step = pool[Math.floor(Math.random() * pool.length)];
    debut = 1 + Math.floor(Math.random() * [100, 150, 200][diff]);
  } else if (!estCE1()) {
    step = diff === 0 ? 1 : (Math.random() < 0.35 ? 2 : 1);
    debut = 1 + Math.floor(Math.random() * Math.max(1, 20 - step * 4));
  } else {
    const r = Math.random();
    if (diff >= 1 && r < 0.20) step = 3;
    else if (diff >= 1 && r < 0.40) step = 4;
    else step = [1, 2, 5, 10][Math.floor(Math.random() * 4)];
    debut = 1 + Math.floor(Math.random() * Math.max(1, [50, 75, 95][diff] - step * 4));
  }
  const suite = [debut, debut + step, debut + step * 2, debut + step * 3, debut + step * 4];
  const indexCache = 1 + Math.floor(Math.random() * 3);
  setBonneReponse(suite[indexCache]);
  const affiche = suite.map((n, i) => (i === indexCache ? "?" : String(n)));
  const regleTexte = (estCE1() || estCE2()) ? ` (on avance de ${step} en ${step})` : "";
  elQuestion.innerHTML =
    `<p>Continue la suite${regleTexte} — quel nombre manque ?</p>` +
    '<p class="suite">' + affiche.join(" — ") + "</p>";
  const min = Math.max(1, getBonneReponse() - step * 3);
  const max = getBonneReponse() + step * 3;
  const props = propositionsAvecBonne(getBonneReponse(), min, max, 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── lancerDoubles ─────────────────────────────────────────────────────────────
export function lancerDoubles() {
  elTitre.textContent = "Doubles";

  if (estCE2()) {
    const typeD = Math.random();
    if (typeD < 0.33) {
      // Double d'un multiple de 5 jusqu'à 200
      const n = 5 * (1 + Math.floor(Math.random() * 40));
      const rep = 2 * n;
      setBonneReponse(rep);
      elQuestion.innerHTML =
        `<p style='font-size:0.9rem;margin:0 0 0.3rem'>Quel est le double de ce nombre ?</p>` +
        `<p class="equation" style="font-size:2.2rem;font-weight:700">Le double de <strong>${n}</strong> = ?</p>` +
        `<p style='font-size:0.82rem;color:#888'>(double = ${n} + ${n})</p>`;
      const props = propositionsAvecBonne(rep, Math.max(10, rep - 40), Math.min(410, rep + 40), 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    } else if (typeD < 0.67) {
      // Moitié d'un multiple pair de 5 jusqu'à 400
      const n = 10 * (1 + Math.floor(Math.random() * 40));
      const rep = n / 2;
      setBonneReponse(rep);
      elQuestion.innerHTML =
        `<p style='font-size:0.9rem;margin:0 0 0.3rem'>Quelle est la moitié de ce nombre ?</p>` +
        `<p class="equation" style="font-size:2.2rem;font-weight:700">La moitié de <strong>${n}</strong> = ?</p>` +
        `<p style='font-size:0.82rem;color:#888'>(moitié = ${n} ÷ 2)</p>`;
      const props = propositionsAvecBonne(rep, Math.max(5, rep - 30), Math.min(205, rep + 30), 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    } else {
      // Quart d'un multiple de 4 jusqu'à 100
      const n = 4 * (1 + Math.floor(Math.random() * 25));
      const rep = n / 4;
      setBonneReponse(rep);
      elQuestion.innerHTML =
        `<p style='font-size:0.9rem;margin:0 0 0.3rem'>Quel est le quart de ce nombre ?</p>` +
        `<p class="equation" style="font-size:2.2rem;font-weight:700">Le quart de <strong>${n}</strong> = ?</p>` +
        `<p style='font-size:0.82rem;color:#888'>(quart = ${n} ÷ 4)</p>`;
      const props = propositionsAvecBonne(rep, Math.max(1, rep - 8), Math.min(26, rep + 8), 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    }
    return;
  }

  if (!estCE1()) {
    const n = 1 + Math.floor(Math.random() * 10);
    const d = n + n;
    elQuestion.innerHTML =
      "<p>Le double de <strong>" + n + "</strong>, c'est combien ?</p>" +
      '<p class="equation">' + n + " + " + n + " = ?</p>";
    setBonneReponse(d);
    const props = propositionsAvecBonne(d, Math.max(2, d - 6), Math.min(22, d + 6), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  // CE1 : doubles 1–20, ou moitiés de nombres pairs 2–40
  const useDouble = Math.random() < 0.55;
  if (useDouble) {
    const n = 1 + Math.floor(Math.random() * 20);
    const d = n * 2;
    setBonneReponse(d);
    elQuestion.innerHTML =
      `<p style='font-size:0.9rem;margin:0 0 0.3rem'>Quel est le double de ce nombre ?</p>` +
      `<p class="equation" style="font-size:2.2rem;font-weight:700">Le double de <strong>${n}</strong> = ?</p>` +
      `<p style='font-size:0.82rem;color:#888'>(double = le nombre + lui-même : ${n} + ${n})</p>`;
    const props = propositionsAvecBonne(d, Math.max(2, d - 10), Math.min(42, d + 10), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
  } else {
    const moitie = 1 + Math.floor(Math.random() * 20);
    const n = moitie * 2;
    setBonneReponse(moitie);
    elQuestion.innerHTML =
      `<p style='font-size:0.9rem;margin:0 0 0.3rem'>Quelle est la moitié de ce nombre ?</p>` +
      `<p class="equation" style="font-size:2.2rem;font-weight:700">La moitié de <strong>${n}</strong> = ?</p>` +
      `<p style='font-size:0.82rem;color:#888'>(moitié = partager en 2 groupes égaux)</p>`;
    const props = propositionsAvecBonne(moitie, Math.max(1, moitie - 6), Math.min(22, moitie + 6), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
  }
}

// ── lancerMoitie ──────────────────────────────────────────────────────────────
export function lancerMoitie() {
  elTitre.textContent = "✂️ La moitié";
  const emoji = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];

  if (estCE2()) {
    // CE2 : quart de multiples de 4 jusqu'à 100
    const n = 4 * (2 + Math.floor(Math.random() * 24));
    const quart = n / 4;
    setBonneReponse(quart);
    elQuestion.innerHTML = `<div class="moitie-question">
      <p style="font-size:0.9rem;margin:0 0 0.5rem">Quel est le <strong>quart</strong> de <strong>${n}</strong> ?</p>
      <p class="equation" style="font-size:2.4rem;font-weight:700;margin:.4rem 0">${n} ÷ 4 = ?</p>
    </div>`;
    const props = propositionsAvecBonne(quart, Math.max(1, quart - 10), Math.min(26, quart + 10), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (!estCE1()) {
    const moitie = 1 + Math.floor(Math.random() * 10);
    const n = moitie * 2;
    setBonneReponse(moitie);
    const row1 = Array(moitie).fill(emoji).join(" ");
    const row2 = Array(moitie).fill("❓").join(" ");
    elQuestion.innerHTML = `<div class="moitie-question">
      <p style="font-size:0.9rem;margin:0 0 0.5rem">Il y a <strong>${n}</strong> ${emoji}. Partage-les en <strong>2 parts égales</strong>. Combien dans chaque moitié ?</p>
      <div class="moitie-row">${row1}</div>
      <div class="moitie-sep">— — —</div>
      <div class="moitie-row moitie-cache">${row2}</div>
    </div>`;
    const props = propositionsAvecBonne(moitie, Math.max(1, moitie - 5), Math.min(12, moitie + 5), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  // CE1 : moitiés jusqu'à 50 (n jusqu'à 100), sans visuel pour les grands nombres
  const moitie = 1 + Math.floor(Math.random() * 25);
  const n = moitie * 2;
  setBonneReponse(moitie);
  let contenuVisuel;
  if (n <= 20) {
    const row1 = Array(moitie).fill(emoji).join(" ");
    const row2 = Array(moitie).fill("❓").join(" ");
    contenuVisuel = `<div class="moitie-row">${row1}</div>
      <div class="moitie-sep">— — —</div>
      <div class="moitie-row moitie-cache">${row2}</div>`;
  } else {
    contenuVisuel = `<p class="equation" style="font-size:2.4rem;font-weight:700;margin:.4rem 0">${n} ÷ 2 = ?</p>`;
  }
  elQuestion.innerHTML = `<div class="moitie-question">
    <p style="font-size:0.9rem;margin:0 0 0.5rem">Il y a <strong>${n}</strong> ${emoji}. Quelle est la <strong>moitié</strong> ?</p>
    ${contenuVisuel}
  </div>`;
  const props = propositionsAvecBonne(moitie, Math.max(1, moitie - 8), Math.min(27, moitie + 8), 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── svgDizUn / svgDizUnCent (local helpers) ───────────────────────────────────
function svgDizUn(diz, un) {
  const barW = 14, barH = 48, gap = 5, dotR = 8, dotGap = 20;
  let items = "";
  let x = 8;
  for (let i = 0; i < diz; i++) {
    items += `<rect x="${x}" y="6" width="${barW}" height="${barH}" rx="4" fill="#6c5ce7" opacity="0.85"/>`;
    x += barW + gap;
  }
  if (diz > 0 && un > 0) x += 10;
  for (let i = 0; i < un; i++) {
    items += `<circle cx="${x + dotR}" cy="30" r="${dotR}" fill="#fdcb6e" opacity="0.9"/>`;
    x += dotGap;
  }
  const w = Math.max(x + 10, 60);
  return `<svg width="${w}" height="60" viewBox="0 0 ${w} 60">${items}</svg>`;
}

function svgDizUnCent(cent, diz, un) {
  const bigW = 20, bigH = 60, barW = 12, barH = 44, gap = 4, dotR = 7, dotGap = 18;
  let items = "";
  let x = 8;
  for (let i = 0; i < cent; i++) {
    items += `<rect x="${x}" y="4" width="${bigW}" height="${bigH}" rx="4" fill="#e17055" opacity="0.85"/>`;
    x += bigW + gap + 2;
  }
  if (cent > 0 && (diz > 0 || un > 0)) x += 8;
  for (let i = 0; i < diz; i++) {
    items += `<rect x="${x}" y="12" width="${barW}" height="${barH}" rx="3" fill="#6c5ce7" opacity="0.85"/>`;
    x += barW + gap;
  }
  if (diz > 0 && un > 0) x += 8;
  for (let i = 0; i < un; i++) {
    items += `<circle cx="${x + dotR}" cy="34" r="${dotR}" fill="#fdcb6e" opacity="0.9"/>`;
    x += dotGap;
  }
  const w = Math.max(x + 12, 60);
  return `<svg width="${w}" height="70" viewBox="0 0 ${w} 70">${items}</svg>`;
}

function svgMilliers(mil, cent, diz, un) {
  const milW = 28, milH = 72, bigW = 20, bigH = 60, barW = 12, barH = 44, gap = 4, dotR = 7, dotGap = 18;
  let items = "";
  let x = 8;
  for (let i = 0; i < mil; i++) {
    items += `<rect x="${x}" y="2" width="${milW}" height="${milH}" rx="5" fill="#d63031" opacity="0.85"/>`;
    x += milW + gap + 2;
  }
  if (mil > 0 && (cent > 0 || diz > 0 || un > 0)) x += 10;
  for (let i = 0; i < cent; i++) {
    items += `<rect x="${x}" y="8" width="${bigW}" height="${bigH}" rx="4" fill="#e17055" opacity="0.85"/>`;
    x += bigW + gap + 2;
  }
  if (cent > 0 && (diz > 0 || un > 0)) x += 8;
  for (let i = 0; i < diz; i++) {
    items += `<rect x="${x}" y="18" width="${barW}" height="${barH}" rx="3" fill="#6c5ce7" opacity="0.85"/>`;
    x += barW + gap;
  }
  if (diz > 0 && un > 0) x += 8;
  for (let i = 0; i < un; i++) {
    items += `<circle cx="${x + dotR}" cy="40" r="${dotR}" fill="#fdcb6e" opacity="0.9"/>`;
    x += dotGap;
  }
  const w = Math.max(x + 12, 80);
  return `<svg width="${w}" height="80" viewBox="0 0 ${w} 80">${items}</svg>`;
}

// ── lancerDizaines ────────────────────────────────────────────────────────────
export function lancerDizaines() {
  elTitre.textContent = "📊 Dizaines & Unités";

  if (estCE2()) {
    const useMilliers = Math.random() < 0.50;
    let n2, mil, cent2, diz2, un2, legende2, svgEl2;
    if (useMilliers) {
      mil  = 1 + Math.floor(Math.random() * 9);
      cent2 = Math.floor(Math.random() * 10);
      diz2  = Math.floor(Math.random() * 10);
      un2   = Math.floor(Math.random() * 10);
      n2 = mil * 1000 + cent2 * 100 + diz2 * 10 + un2;
      if (n2 < 1000) n2 = mil * 1000;
      svgEl2 = svgMilliers(mil, cent2, diz2, un2);
      legende2 = `<span style="color:#d63031;font-weight:700">▮ grande plaque rouge = 1000</span>
        &nbsp;·&nbsp;
        <span style="color:#e17055;font-weight:700">▮ orange = 100</span>
        &nbsp;·&nbsp;
        <span style="color:#6c5ce7;font-weight:700">▪ barre = 10</span>
        &nbsp;·&nbsp;
        <span style="color:#d4a017;font-weight:700">● point = 1</span>`;
    } else {
      // fall back to CE1 behaviour (centaines)
      const cent3 = 1 + Math.floor(Math.random() * 9);
      const diz3  = Math.floor(Math.random() * 10);
      const un3   = Math.floor(Math.random() * 10);
      n2 = cent3 * 100 + diz3 * 10 + un3;
      if (n2 < 100) n2 = cent3 * 100;
      svgEl2 = svgDizUnCent(cent3, diz3, un3);
      legende2 = `<span style="color:#e17055;font-weight:700">▮ grande barre = 100</span>
        &nbsp;·&nbsp;
        <span style="color:#6c5ce7;font-weight:700">▪ barre = 10</span>
        &nbsp;·&nbsp;
        <span style="color:#d4a017;font-weight:700">● point = 1</span>`;
    }
    setBonneReponse(n2);
    elQuestion.innerHTML = `<div class="diz-question">
      <p style="font-size:0.75rem;margin:0 0 0.55rem">${legende2}</p>
      ${svgEl2}
      <p style="font-size:0.9rem;margin:0.5rem 0 0;font-weight:600">Quel nombre est représenté ?</p>
    </div>`;
    const props = propositionsAvecBonne(n2, Math.max(100, n2 - 300), Math.min(9999, n2 + 300), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (!estCE1()) {
    const max = 69;
    const n = 11 + Math.floor(Math.random() * (max - 10));
    const diz = Math.floor(n / 10);
    const un = n % 10;
    setBonneReponse(n);
    elQuestion.innerHTML = `<div class="diz-question">
      <p style="font-size:0.82rem;margin:0 0 0.55rem">
        <span style="color:#6c5ce7;font-weight:700">▮ barre = 10 (dizaine)</span>
        &nbsp;·&nbsp;
        <span style="color:#d4a017;font-weight:700">● point = 1 (unité)</span>
      </p>
      ${svgDizUn(diz, un)}
      <p style="font-size:0.9rem;margin:0.5rem 0 0;font-weight:600">Quel nombre est représenté ?</p>
    </div>`;
    const props = propositionsAvecBonne(n, Math.max(10, n - 22), Math.min(max, n + 22), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  // CE1 : 50% chance d'utiliser les centaines (nombres jusqu'à 999)
  const useCent = Math.random() < 0.50;
  let n, cent, diz, un, legende, svgEl, maxProp;
  if (useCent) {
    cent = 1 + Math.floor(Math.random() * 9);
    diz  = Math.floor(Math.random() * 10);
    un   = Math.floor(Math.random() * 10);
    n = cent * 100 + diz * 10 + un;
    if (n < 100) n = cent * 100;
    svgEl = svgDizUnCent(cent, diz, un);
    legende = `<span style="color:#e17055;font-weight:700">▮ grande barre = 100 (centaine)</span>
      &nbsp;·&nbsp;
      <span style="color:#6c5ce7;font-weight:700">▪ barre = 10 (dizaine)</span>
      &nbsp;·&nbsp;
      <span style="color:#d4a017;font-weight:700">● point = 1 (unité)</span>`;
    maxProp = 999;
  } else {
    n = 11 + Math.floor(Math.random() * 88);
    diz = Math.floor(n / 10);
    un = n % 10;
    svgEl = svgDizUn(diz, un);
    legende = `<span style="color:#6c5ce7;font-weight:700">▮ barre = 10 (dizaine)</span>
      &nbsp;·&nbsp;
      <span style="color:#d4a017;font-weight:700">● point = 1 (unité)</span>`;
    maxProp = 99;
  }
  setBonneReponse(n);
  elQuestion.innerHTML = `<div class="diz-question">
    <p style="font-size:0.78rem;margin:0 0 0.55rem">${legende}</p>
    ${svgEl}
    <p style="font-size:0.9rem;margin:0.5rem 0 0;font-weight:600">Quel nombre est représenté ?</p>
  </div>`;
  const props = propositionsAvecBonne(n, Math.max(10, n - 30), Math.min(maxProp, n + 30), 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── lancerPairImpair ──────────────────────────────────────────────────────────
function svgPairesIcon(pair) {
  const n = pair ? 4 : 5;
  let circles = "";
  for (let i = 0; i < n; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const color = col === 0 ? "#6c5ce7" : "#fd79a8";
    circles += `<circle cx="${20 + col * 30}" cy="${18 + row * 30}" r="11" fill="${color}" opacity="0.9"/>`;
  }
  const h = 18 + Math.ceil(n / 2) * 30;
  return `<svg width="70" height="${h}" viewBox="0 0 70 ${h}">${circles}</svg>`;
}

export function lancerPairImpair() {
  elTitre.textContent = "Pair ou Impair ?";
  const max = estCE2() ? 9999 : (estCE1() ? 99 : 20);
  const n = 2 + Math.floor(Math.random() * (max - 1));
  const estPair = n % 2 === 0;
  setBonneReponse(estPair ? 0 : 1);

  let questionHtml;
  if ((!estCE1() && !estCE2()) || n <= 20) {
    let dots = "";
    for (let i = 0; i < n; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const color = col === 0 ? "#6c5ce7" : "#fd79a8";
      dots += `<circle cx="${22 + col * 30}" cy="${20 + row * 30}" r="12" fill="${color}" opacity="0.85"/>`;
    }
    const svgH = 20 + Math.ceil(n / 2) * 30;
    questionHtml = `<div class="pair-question">
      <p style="font-size:0.85rem;margin:0 0 0.4rem;color:#555">Peut-on ranger ces objets <strong>en 2 groupes égaux</strong> ?</p>
      <span class="pair-nombre">${n}</span>
      <svg width="74" height="${svgH}" viewBox="0 0 74 ${svgH}">${dots}</svg>
    </div>`;
  } else {
    questionHtml = `<div class="pair-question">
      <p style="font-size:0.85rem;margin:0 0 0.35rem;color:#555">
        Un nombre est <strong>pair</strong> si son dernier chiffre est 0, 2, 4, 6 ou 8.<br>
        Un nombre est <strong>impair</strong> si son dernier chiffre est 1, 3, 5, 7 ou 9.
      </p>
      <span class="pair-nombre" style="font-size:3rem">${n}</span>
      <p style="font-size:0.82rem;margin:0.35rem 0 0;color:#888">Ce nombre est-il pair ou impair ?</p>
    </div>`;
  }

  elQuestion.innerHTML = questionHtml;

  elChoix.innerHTML = "";
  [
    { val: 0, icon: svgPairesIcon(true),  label: "Pair 🟰" },
    { val: 1, icon: svgPairesIcon(false), label: "Impair ≠" },
  ].forEach(({ val, icon, label }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix btn-visuel2";
    b.innerHTML = icon + `<div style="font-size:0.9rem;font-weight:700;margin-top:0.25rem;color:var(--primaire)">${label}</div>`;
    b.dataset.valeur = String(val);
    b.addEventListener("click", () => apresReponse(val, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── Perles dorées helpers ─────────────────────────────────────────────────────
function htmlPerles(milliers, centaines, dizaines, unites) {
  const groupes = [];
  if (milliers > 0) {
    groupes.push(
      `<div class="perle-groupe">` +
      `<span class="perle-millier">${"🟫".repeat(milliers)}</span>` +
      `<span class="perle-label">×1000</span>` +
      `</div>`
    );
  }
  if (centaines > 0) {
    groupes.push(
      `<div class="perle-groupe">` +
      `<span class="perle-centaine">${"🟧".repeat(centaines)}</span>` +
      `<span class="perle-label">×100</span>` +
      `</div>`
    );
  }
  if (dizaines > 0) {
    groupes.push(
      `<div class="perle-groupe">` +
      `<span class="perle-dizaine">${"🟪".repeat(dizaines)}</span>` +
      `<span class="perle-label">×10</span>` +
      `</div>`
    );
  }
  if (unites > 0) {
    groupes.push(
      `<div class="perle-groupe">` +
      `<span class="perle-unite">${"🟡".repeat(unites)}</span>` +
      `<span class="perle-label">×1</span>` +
      `</div>`
    );
  }
  return `<div class="perles-conteneur">${groupes.join("")}</div>`;
}

// ── lancerPerlesDorees ────────────────────────────────────────────────────────
export function lancerPerlesDorees() {
  elTitre.textContent = "🟡 Perles dorées";
  const diff = getDifficulte();

  let n, mil, cent, diz, un, question, bonne, maxDigit;

  if (estCE2()) {
    mil  = 1 + Math.floor(Math.random() * 9);
    cent = Math.floor(Math.random() * 10);
    diz  = Math.floor(Math.random() * 10);
    un   = Math.floor(Math.random() * 10);
    n = mil * 1000 + cent * 100 + diz * 10 + un;
    const dim = Math.floor(Math.random() * 4);
    if (dim === 0) { bonne = mil;  question = "milliers"; maxDigit = 9; }
    else if (dim === 1) { bonne = cent; question = "centaines"; maxDigit = 9; }
    else if (dim === 2) { bonne = diz;  question = "dizaines"; maxDigit = 9; }
    else               { bonne = un;   question = "unités"; maxDigit = 9; }
  } else if (estCE1()) {
    if (diff <= 0) {
      cent = 1 + Math.floor(Math.random() * 1);
      diz  = Math.floor(Math.random() * 10);
      un   = Math.floor(Math.random() * 10);
      n = cent * 100 + diz * 10 + un;
      const dim = Math.random() < 0.5 ? "dizaines" : "unités";
      bonne = dim === "dizaines" ? diz : un;
      question = dim;
      maxDigit = 9;
    } else {
      cent = 1 + Math.floor(Math.random() * 9);
      diz  = Math.floor(Math.random() * 10);
      un   = Math.floor(Math.random() * 10);
      n = cent * 100 + diz * 10 + un;
      const dim2 = Math.floor(Math.random() * 3);
      if (dim2 === 0) { bonne = cent; question = "centaines"; maxDigit = 9; }
      else if (dim2 === 1) { bonne = diz; question = "dizaines"; maxDigit = 9; }
      else               { bonne = un;  question = "unités"; maxDigit = 9; }
    }
    mil = 0;
  } else {
    mil = 0; cent = 0;
    if (diff === 0) {
      diz = 1 + Math.floor(Math.random() * 9);
      un = 0;
      n = diz * 10;
      bonne = diz; question = "dizaines"; maxDigit = 9;
    } else if (diff === 1) {
      n = 10 + Math.floor(Math.random() * 89);
      diz = Math.floor(n / 10); un = n % 10;
      bonne = un; question = "unités"; maxDigit = 9;
    } else {
      n = 10 + Math.floor(Math.random() * 89);
      diz = Math.floor(n / 10); un = n % 10;
      bonne = diz; question = "dizaines"; maxDigit = 9;
    }
  }

  setBonneReponse(bonne);
  elQuestion.innerHTML =
    `<p class="equation" style="font-size:2.4rem;font-weight:700;margin-bottom:0.3rem">${n}</p>` +
    htmlPerles(mil || 0, cent || 0, diz || 0, un || 0) +
    `<p style="font-size:0.95rem;margin-top:0.3rem">Combien de <strong>${question}</strong> dans ce nombre ?</p>`;

  const props = propositionsAvecBonne(bonne, 0, maxDigit, 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── lancerPlanche100 ──────────────────────────────────────────────────────────
export function lancerPlanche100() {
  elTitre.textContent = "🔢 Planche des cent";

  let min, max, step;
  if (estCE2()) {
    step = 10;
    min = 10; max = 990;
  } else if (estCE1()) {
    step = 1;
    min = 1; max = 100;
  } else {
    step = 1;
    min = 1; max = 20;
  }

  const plage = [];
  for (let i = min; i <= max; i += step) plage.push(i);
  const n = plage[Math.floor(Math.random() * plage.length)];
  setBonneReponse(n);

  function cellVal(v) {
    if (v < min || v > max) return "·";
    return String(v);
  }

  const noisins = [
    [cellVal(n - step - step), cellVal(n - step - 1 * (estCE2() ? 10 : 1)), cellVal(n - step + step - step + step - step + step)],
  ];

  const row1 = [n - (estCE2() ? 11 : 11), n - (estCE2() ? 10 : 10), n - (estCE2() ? 9 : 9)];
  const row2 = [n - (estCE2() ? 1 : 1), n, n + (estCE2() ? 1 : 1)];
  const row3 = [n + (estCE2() ? 9 : 9), n + (estCE2() ? 10 : 10), n + (estCE2() ? 11 : 11)];

  function tdVal(v) {
    if (v === n) return `<td class="planche-vide">?</td>`;
    if (v < min || v > max) return `<td>·</td>`;
    return `<td>${v}</td>`;
  }

  const tableHtml =
    `<table class="planche-mini">` +
    `<tr>${row1.map(tdVal).join("")}</tr>` +
    `<tr>${row2.map(tdVal).join("")}</tr>` +
    `<tr>${row3.map(tdVal).join("")}</tr>` +
    `</table>`;

  elQuestion.innerHTML =
    `<p style="font-size:0.9rem;margin-bottom:0.2rem">Quel nombre se cache sous le <strong style="color:var(--primaire)">?</strong> ?</p>` +
    tableHtml;

  const pmin = Math.max(min, n - step * 5);
  const pmax = Math.min(max, n + step * 5);
  const props = propositionsAvecBonne(n, pmin, pmax, 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── lancerDecimaux ────────────────────────────────────────────────────────────
export function lancerDecimaux() {
  elTitre.textContent = "🔢 Décimaux";
  const diff = getDifficulte();

  if (estCM2()) {
    const type = Math.floor(Math.random() * 3);
    if (type === 0) {
      // addition de décimaux
      const entA = 1 + Math.floor(Math.random() * 9);
      const decA = 1 + Math.floor(Math.random() * 9);
      const entB = 1 + Math.floor(Math.random() * 9);
      const decB = 1 + Math.floor(Math.random() * 9);
      const total = Math.round((entA + decA / 10 + entB + decB / 10) * 10) / 10;
      const totalStr = Math.floor(total) + "," + (Math.round(total * 10) % 10);
      setBonneReponse(totalStr);
      elQuestion.innerHTML =
        "<p style='font-size:0.9rem;margin:0 0 0.3rem'>Calcule :</p>" +
        `<div class="equation">${entA},${decA} + ${entB},${decB} = ?</div>`;
      const fausses = [];
      for (const v of [-1, 1, -2, 2, 10, -10]) {
        const c = Math.round(total * 10) + v;
        if (c > 0) {
          const s = Math.floor(c / 10) + "," + (c % 10);
          if (!fausses.includes(s) && s !== totalStr) fausses.push(s);
          if (fausses.length >= 3) break;
        }
      }
      while (fausses.length < 3) fausses.push((Math.floor(total) + fausses.length + 1) + ",0");
      afficherChoixTexte(melanger([totalStr, ...fausses.slice(0, 3)]), getBonneReponse());
    } else if (type === 1) {
      // multiplication par 10 ou 100
      const facteurs = [10, 100, 1000];
      const facteur = facteurs[Math.floor(Math.random() * facteurs.length)];
      const entN = 1 + Math.floor(Math.random() * 9);
      const decN = 1 + Math.floor(Math.random() * 9);
      const nombre = entN + decN / 10;
      const result = Math.round(nombre * facteur * 10) / 10;
      setBonneReponse(result);
      elQuestion.innerHTML =
        "<p style='font-size:0.9rem;margin:0 0 0.3rem'>Calcule :</p>" +
        `<div class="equation">${entN},${decN} × ${facteur} = ?</div>` +
        "<p style='font-size:0.78rem;color:#888'>💡 Multiplie par " + facteur + " : déplace la virgule</p>";
      const props = propositionsAvecBonne(result, Math.max(1, result - result / 2), result + result, 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    } else {
      // soustraction de décimaux
      const entA = 5 + Math.floor(Math.random() * 9);
      const decA = 1 + Math.floor(Math.random() * 9);
      const entB = 1 + Math.floor(Math.random() * (entA - 1));
      const decB = 1 + Math.floor(Math.random() * 9);
      const total = Math.round((entA + decA / 10 - entB - decB / 10) * 10) / 10;
      if (total <= 0) { lancerDecimaux(); return; }
      const totalStr = Math.floor(total) + "," + (Math.abs(Math.round(total * 10) % 10));
      setBonneReponse(totalStr);
      elQuestion.innerHTML =
        "<p style='font-size:0.9rem;margin:0 0 0.3rem'>Calcule :</p>" +
        `<div class="equation">${entA},${decA} − ${entB},${decB} = ?</div>`;
      const fausses = [];
      for (const v of [-1, 1, -2, 2, 10, -10]) {
        const c = Math.round(total * 10) + v;
        if (c > 0) {
          const s = Math.floor(c / 10) + "," + (c % 10);
          if (!fausses.includes(s) && s !== totalStr) fausses.push(s);
          if (fausses.length >= 3) break;
        }
      }
      while (fausses.length < 3) fausses.push((Math.floor(total) + fausses.length + 1) + ",0");
      afficherChoixTexte(melanger([totalStr, ...fausses.slice(0, 3)]), getBonneReponse());
    }
    return;
  }

  // CM1
  if (diff === 0) {
    // lire un décimal : "3 unités + 7 dixièmes"
    const entN = 1 + Math.floor(Math.random() * 9);
    const decN = 1 + Math.floor(Math.random() * 9);
    const nombreStr = entN + "," + decN;
    setBonneReponse(nombreStr);
    elQuestion.innerHTML =
      "<p style='font-size:0.9rem;margin:0 0 0.4rem'>Quel nombre est représenté ?</p>" +
      `<p class="equation" style="font-size:1.6rem;font-weight:700">${entN} unités + ${decN} dixièmes</p>`;
    const fausses = [];
    const variants = [[entN + 1, decN], [entN, decN + 1], [entN - 1 > 0 ? entN - 1 : entN + 2, decN]];
    for (const [e, d] of variants) {
      const s = e + "," + d;
      if (!fausses.includes(s) && s !== nombreStr) fausses.push(s);
    }
    while (fausses.length < 3) fausses.push((entN + fausses.length + 1) + "," + decN);
    afficherChoixTexte(melanger([nombreStr, ...fausses.slice(0, 3)]), getBonneReponse());
  } else if (diff === 1) {
    // comparer deux décimaux
    const entA = 1 + Math.floor(Math.random() * 9);
    const decA = Math.floor(Math.random() * 10);
    let entB = 1 + Math.floor(Math.random() * 9);
    let decB = Math.floor(Math.random() * 10);
    while (entA === entB && decA === decB) decB = (decB + 1) % 10;
    const aStr = entA + "," + decA;
    const bStr = entB + "," + decB;
    const bonneRep = (entA + decA / 10) > (entB + decB / 10) ? aStr : bStr;
    setBonneReponse(bonneRep);
    elQuestion.innerHTML =
      "<p style='font-size:0.9rem;margin:0 0 0.3rem'>Quel nombre est le plus grand ?</p>" +
      `<p class="equation" style="font-size:2rem;font-weight:700">${aStr} ou ${bStr}</p>`;
    afficherChoixTexte(melanger([aStr, bStr]), getBonneReponse());
  } else {
    // arrondir à l'unité
    const entN = 1 + Math.floor(Math.random() * 9);
    const decN = 1 + Math.floor(Math.random() * 9);
    const arrondi = decN >= 5 ? entN + 1 : entN;
    setBonneReponse(arrondi);
    elQuestion.innerHTML =
      "<p style='font-size:0.9rem;margin:0 0 0.3rem'>Arrondis à l'unité la plus proche :</p>" +
      `<p class="equation" style="font-size:2.4rem;font-weight:700">${entN},${decN}</p>` +
      "<p style='font-size:0.78rem;color:#888'>💡 Si le chiffre après la virgule est ≥ 5, on arrondit vers le haut</p>";
    const props = propositionsAvecBonne(arrondi, Math.max(1, arrondi - 3), arrondi + 3, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
  }
}
