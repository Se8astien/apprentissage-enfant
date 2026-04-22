// games-maths.js — lancerCompte, lancerAddition, lancerSoustraction, lancerCompare,
//                  lancerSuite, lancerDoubles, lancerMoitie, lancerDizaines, lancerPairImpair

import {
  ANIMAUX,
  elTitre,
  elQuestion,
  elChoix,
  setBonneReponse,
  getBonneReponse,
  estCE1,
  melanger,
  propositionsAvecBonne,
  afficherChoix,
} from "./app-state.js";

import { apresReponse, apresReponseTexte } from "./app-nav.js";

// ── lancerCompte ──────────────────────────────────────────────────────────────
export function lancerCompte() {
  elTitre.textContent = "Compte-moi ça !";

  if (!estCE1()) {
    const n = 3 + Math.floor(Math.random() * 13);
    const emoji = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
    const ligne = Array(n).fill(emoji).join(" ");
    elQuestion.innerHTML =
      "<p>Combien d'animaux tu vois ?</p>" +
      '<p class="ligne-emojis' + (n > 8 ? " petit" : "") + '">' + ligne + "</p>";
    setBonneReponse(n);
    const props = propositionsAvecBonne(n, Math.max(1, n - 4), Math.min(18, n + 4), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  // CE1 : deux types d'animaux, total ou différence
  const idxA = Math.floor(Math.random() * ANIMAUX.length);
  let idxB = Math.floor(Math.random() * ANIMAUX.length);
  if (idxB === idxA) idxB = (idxA + 1) % ANIMAUX.length;
  const emojiA = ANIMAUX[idxA];
  const emojiB = ANIMAUX[idxB];
  const nA = 3 + Math.floor(Math.random() * 9);
  const nB = 3 + Math.floor(Math.random() * 9);
  const ligneA = Array(nA).fill(emojiA).join(" ");
  const ligneB = Array(nB).fill(emojiB).join(" ");

  const typeDiff = Math.random() < 0.4 && nA !== nB;
  if (typeDiff) {
    const diff = Math.abs(nA - nB);
    const plusGrand = nA > nB ? emojiA : emojiB;
    const plusPetit = nA > nB ? emojiB : emojiA;
    setBonneReponse(diff);
    elQuestion.innerHTML =
      `<p>Combien de ${plusGrand} <strong>de plus</strong> que de ${plusPetit} ?</p>` +
      `<p class="ligne-emojis petit">${ligneA}</p>` +
      `<p class="ligne-emojis petit">${ligneB}</p>`;
    const props = propositionsAvecBonne(diff, Math.max(0, diff - 4), Math.min(12, diff + 4), 3);
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
}

// ── lancerAddition ────────────────────────────────────────────────────────────
export function lancerAddition() {
  elTitre.textContent = "Addition magique";
  let a;
  let b;
  let total;
  let html;

  if (!estCE1()) {
    a = 1 + Math.floor(Math.random() * 9);
    b = 1 + Math.floor(Math.random() * 9);
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
  const useDizaine = Math.random() < 0.20;
  if (useDizaine) {
    const dizaines = [10, 20, 30, 40, 50];
    a = dizaines[Math.floor(Math.random() * dizaines.length)];
    b = 5 + Math.floor(Math.random() * 30);
  } else {
    total = 21 + Math.floor(Math.random() * 59);
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
  let total;
  let enleve;
  let reste;

  if (!estCE1()) {
    total = 4 + Math.floor(Math.random() * 17);
  } else {
    total = 21 + Math.floor(Math.random() * 69);
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
  let debut, step;
  if (!estCE1()) {
    step = Math.random() < 0.35 ? 2 : 1;
    debut = 1 + Math.floor(Math.random() * Math.max(1, 20 - step * 4));
  } else {
    const r = Math.random();
    if (r < 0.20) step = 3;
    else if (r < 0.40) step = 4;
    else step = [1, 2, 5, 10][Math.floor(Math.random() * 4)];
    debut = 1 + Math.floor(Math.random() * Math.max(1, 95 - step * 4));
  }
  const suite = [debut, debut + step, debut + step * 2, debut + step * 3, debut + step * 4];
  const indexCache = 1 + Math.floor(Math.random() * 3);
  setBonneReponse(suite[indexCache]);
  const affiche = suite.map((n, i) => (i === indexCache ? "?" : String(n)));
  const regleTexte = estCE1() ? ` (on avance de ${step} en ${step})` : "";
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

// ── lancerDizaines ────────────────────────────────────────────────────────────
export function lancerDizaines() {
  elTitre.textContent = "📊 Dizaines & Unités";

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
  const max = estCE1() ? 99 : 20;
  const n = 2 + Math.floor(Math.random() * (max - 1));
  const estPair = n % 2 === 0;
  setBonneReponse(estPair ? 0 : 1);

  let questionHtml;
  if (!estCE1() || n <= 20) {
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
