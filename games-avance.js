// games-avance.js — lancerMultiplication, lancerDivision, lancerProbleme

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

// ── lancerMultiplication ──────────────────────────────────────────────────────
export function lancerMultiplication() {
  elTitre.textContent = "✖️ Multiplication";
  const diff = getDifficulte();

  if (estCM2()) {
    // CM2 : deux facteurs à 2 chiffres
    const a = 10 + Math.floor(Math.random() * [20, 50, 89][diff]);
    const b = 10 + Math.floor(Math.random() * [20, 50, 89][diff]);
    const produit = a * b;
    setBonneReponse(produit);
    elQuestion.innerHTML =
      `<p style="font-size:0.85rem;margin:0 0 0.3rem">Calcule ce produit :</p>` +
      `<p class="equation" style="font-size:2.4rem;font-weight:700;margin:0.4rem 0">${a} × ${b} = ?</p>` +
      `<p style="font-size:0.78rem;color:#888">💡 Décompose : (${Math.floor(a/10)*10} + ${a%10}) × ${b}</p>`;
    const pmin = Math.max(100, produit - 200), pmax = Math.min(9801, produit + 200);
    const props = propositionsAvecBonne(produit, pmin, pmax, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (estCM1()) {
    // CM1 : tables jusqu'à 12, un facteur peut être à 2 chiffres
    const tables12 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const mult = tables12[Math.floor(Math.random() * tables12.length)];
    const useDeuxChiffres = diff >= 1 && Math.random() < 0.40;
    const fact = useDeuxChiffres
      ? 11 + Math.floor(Math.random() * [4, 9, 19][diff])
      : 1 + Math.floor(Math.random() * 12);
    const produit = mult * fact;
    setBonneReponse(produit);
    elQuestion.innerHTML =
      `<p style="font-size:0.85rem;margin:0 0 0.3rem">Calcule ce produit :</p>` +
      `<p class="equation" style="font-size:2.4rem;font-weight:700;margin:0.4rem 0">${fact} × ${mult} = ?</p>`;
    const pmin = Math.max(2, produit - 30), pmax = Math.min(500, produit + 30);
    const props = propositionsAvecBonne(produit, pmin, pmax, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (estCE2()) {
    const tablesCE2 = [
      [2, 3, 4, 5, 10],
      [2, 3, 4, 5, 6, 7, 8, 9, 10],
      [2, 3, 4, 5, 6, 7, 8, 9, 11, 12],
    ];
    const tables = tablesCE2[diff];
    const mult = tables[Math.floor(Math.random() * tables.length)];
    const maxFact = 12;
    const fact = 1 + Math.floor(Math.random() * maxFact);
    const produit = mult * fact;

    // 30% chance: ask for missing factor "A × ? = C"
    if (Math.random() < 0.30) {
      setBonneReponse(fact);
      elQuestion.innerHTML =
        `<p style="font-size:0.85rem;margin:0 0 0.3rem">Trouve le facteur manquant :</p>` +
        `<p class="equation" style="font-size:2.4rem;font-weight:700;margin:0.4rem 0">${mult} × ? = ${produit}</p>`;
      const pmin = Math.max(1, fact - 4), pmax = fact + 4;
      const props = propositionsAvecBonne(fact, pmin, pmax, 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    } else {
      setBonneReponse(produit);
      elQuestion.innerHTML =
        `<p style="font-size:0.85rem;margin:0 0 0.3rem">Calcule ce produit :</p>` +
        `<p class="equation" style="font-size:2.4rem;font-weight:700;margin:0.4rem 0">${fact} × ${mult} = ?</p>` +
        `<p style="font-size:0.78rem;color:#888">(tables × ${mult})</p>`;
      const pmin = Math.max(2, produit - 18), pmax = Math.min(150, produit + 18);
      const props = propositionsAvecBonne(produit, pmin, pmax, 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    }
    return;
  }

  const tablesCE1 = [[2, 5], [2, 3, 5], [2, 3, 4, 5, 10]];
  const tablesCP  = [[2], [2, 3], [2, 3, 5]];
  const tables = estCE1() ? tablesCE1[diff] : tablesCP[diff];
  const mult = tables[Math.floor(Math.random() * tables.length)];
  const maxFact = estCE1() ? [6, 8, 10][diff] : [3, 4, 5][diff];
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
  const diff = getDifficulte();

  if (estCM2()) {
    // CM2 : division avec reste
    const diviseurs12 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const diviseur = diviseurs12[Math.floor(Math.random() * diviseurs12.length)];
    const quotient = 10 + Math.floor(Math.random() * [20, 40, 90][diff]);
    const reste = Math.floor(Math.random() * diviseur);
    const total = diviseur * quotient + reste;
    setBonneReponse(quotient);
    elQuestion.innerHTML = `<div class="div-question">
      <p style="font-size:0.88rem;margin:0 0 0.5rem">Calcule le quotient (partie entière) :</p>
      <p class="equation" style="font-size:2.2rem;font-weight:700;margin:.4rem 0">${total} ÷ ${diviseur} = ?</p>
      <p style="font-size:0.78rem;color:#888">💡 Résultat entier, il peut y avoir un reste</p>
    </div>`;
    const props = propositionsAvecBonne(quotient, Math.max(1, quotient - 8), quotient + 8, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (estCM1()) {
    // CM1 : diviseurs jusqu'à 12, quotient 2 chiffres
    const diviseurs12 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const diviseur = diviseurs12[Math.floor(Math.random() * diviseurs12.length)];
    const quotient = 10 + Math.floor(Math.random() * [10, 20, 40][diff]);
    const total = diviseur * quotient;
    setBonneReponse(quotient);
    elQuestion.innerHTML = `<div class="div-question">
      <p style="font-size:0.88rem;margin:0 0 0.5rem">Calcule cette division :</p>
      <p class="equation" style="font-size:2.2rem;font-weight:700;margin:.4rem 0">${total} ÷ ${diviseur} = ?</p>
    </div>`;
    const props = propositionsAvecBonne(quotient, Math.max(1, quotient - 8), quotient + 8, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  if (estCE2()) {
    const diviseursCE2 = [
      [2, 3, 4, 5],
      [2, 3, 4, 5, 6, 7],
      [2, 3, 4, 5, 6, 7, 8, 9],
    ];
    const diviseurs = diviseursCE2[diff];
    const diviseur = diviseurs[Math.floor(Math.random() * diviseurs.length)];
    const quotient = 1 + Math.floor(Math.random() * 12);

    // 25% chance: add remainder context
    if (Math.random() < 0.25) {
      const reste = Math.floor(Math.random() * (diviseur - 1));
      const total = diviseur * quotient + reste;
      setBonneReponse(quotient);
      elQuestion.innerHTML = `<div class="div-question">
        <p style="font-size:0.88rem;margin:0 0 0.5rem">Combien de groupes entiers de <strong>${diviseur}</strong> dans <strong>${total}</strong> ?</p>
        <p class="equation" style="font-size:2.2rem;font-weight:700;margin:.4rem 0">${total} ÷ ${diviseur} = ?</p>
        <p style="font-size:0.78rem;color:#888">(groupes entiers, sans le reste)</p>
      </div>`;
    } else {
      const total = diviseur * quotient;
      setBonneReponse(quotient);
      elQuestion.innerHTML = `<div class="div-question">
        <p style="font-size:0.88rem;margin:0 0 0.5rem">Calcule cette division :</p>
        <p class="equation" style="font-size:2.2rem;font-weight:700;margin:.4rem 0">${total} ÷ ${diviseur} = ?</p>
      </div>`;
    }
    const props = propositionsAvecBonne(quotient, Math.max(1, quotient - 4), quotient + 4, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    return;
  }

  const diviseursCE1 = [[2, 5], [2, 3, 5], [2, 3, 4, 5, 10]];
  const diviseursCP  = [[2], [2, 3], [2, 3]];
  const diviseurs = estCE1() ? diviseursCE1[diff] : diviseursCP[diff];
  const diviseur = diviseurs[Math.floor(Math.random() * diviseurs.length)];
  const maxQuot = estCE1() ? [5, 8, 10][diff] : [3, 4, 5][diff];
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
  ce2: [
    { generer() {
      const etageres = 3 + Math.floor(Math.random()*8);
      const parEtagere = 4 + Math.floor(Math.random()*8);
      const vendus = Math.floor(Math.random()*(etageres*parEtagere - 5)) + 1;
      const rep = etageres * parEtagere - vendus;
      return { texte: `Une boulangerie prépare <strong>${etageres}</strong> étagères de <strong>${parEtagere}</strong> pains 🍞. Elle en vend <strong>${vendus}</strong>. Combien reste-t-il de pains ?`, rep, min: Math.max(0, rep-20), max: rep+20 };
    } },
    { generer() {
      const mat = 1 + Math.floor(Math.random()*8);
      const apr = 1 + Math.floor(Math.random()*8);
      const jours = 2 + Math.floor(Math.random()*5);
      const rep = (mat + apr) * jours;
      return { texte: `Lola roule <strong>${mat} km</strong> le matin et <strong>${apr} km</strong> l'après-midi, pendant <strong>${jours} jours</strong>. Combien de km en tout ?`, rep, min: Math.max(0, rep-20), max: rep+20 };
    } },
    { generer() {
      const nb = 2 + Math.floor(Math.random()*4);
      const prixU = 1 + Math.floor(Math.random()*5);
      const gomme = 1 + Math.floor(Math.random()*3);
      const budget = 10;
      const depense = nb * prixU + gomme;
      const rep = budget - depense;
      if (rep < 0) return PROBLEMES.ce2[2].generer();
      return { texte: `<strong>${nb}</strong> stylos coûtent <strong>${prixU}€</strong> chacun. Une gomme coûte <strong>${gomme}€</strong>. Julie paie avec <strong>${budget}€</strong>. Combien reçoit-elle ?`, rep, min: Math.max(0, rep-5), max: rep+5 };
    } },
    { generer() {
      const groupes = 3 + Math.floor(Math.random()*10);
      const parGroupe = 3 + Math.floor(Math.random()*7);
      const total = groupes * parGroupe;
      return { texte: `<strong>${total}</strong> élèves 🏫 sont répartis en groupes de <strong>${parGroupe}</strong>. Combien de groupes y a-t-il ?`, rep: groupes, min: Math.max(1, groupes-6), max: groupes+6 };
    } },
    { generer() {
      const departH = 8 + Math.floor(Math.random()*5);
      const dureeH = 1 + Math.floor(Math.random()*4);
      const arH = departH + dureeH;
      return { texte: `Un train part à <strong>${departH}h00</strong> 🚂. Le trajet dure <strong>${dureeH} heure${dureeH>1?"s":""}</strong>. À quelle heure arrive-t-il ?`, rep: arH, min: arH-3, max: arH+3 };
    } },
  ],
};

const PROBLEMES_CM1 = [
  { generer() {
    const prix = 5 + Math.floor(Math.random() * 20);
    const nb = 3 + Math.floor(Math.random() * 8);
    const remise = Math.floor(Math.random() * 10) + 1;
    const rep = prix * nb - remise;
    return { texte: `Un livre coûte <strong>${prix}€</strong>. Paul achète <strong>${nb}</strong> livres et bénéficie d'une remise de <strong>${remise}€</strong>. Combien paie-t-il en tout ?`, rep, min: Math.max(0, rep - 20), max: rep + 20 };
  } },
  { generer() {
    const vitesse = 4 + Math.floor(Math.random() * 6);
    const temps = 2 + Math.floor(Math.random() * 4);
    const rep = vitesse * temps;
    return { texte: `Un cycliste roule à <strong>${vitesse} km/h</strong> pendant <strong>${temps} heures</strong>. Quelle distance a-t-il parcourue ?`, rep, min: Math.max(0, rep - 15), max: rep + 15 };
  } },
  { generer() {
    const largeur = 5 + Math.floor(Math.random() * 15);
    const longueur = 10 + Math.floor(Math.random() * 20);
    const rep = 2 * (largeur + longueur);
    return { texte: `Un jardin rectangulaire mesure <strong>${longueur} m</strong> de long et <strong>${largeur} m</strong> de large. Quel est son périmètre ?`, rep, min: Math.max(0, rep - 20), max: rep + 20 };
  } },
  { generer() {
    const total = 100 + Math.floor(Math.random() * 500);
    const parts = 3 + Math.floor(Math.random() * 5);
    const p1 = Math.floor(Math.random() * (total / 2));
    const p2 = Math.floor(Math.random() * (total - p1 - 10));
    const rep = total - p1 - p2;
    return { texte: `Une cagnotte contient <strong>${total}€</strong>. On en dépense <strong>${p1}€</strong> puis encore <strong>${p2}€</strong>. Combien reste-t-il ?`, rep, min: Math.max(0, rep - 30), max: rep + 30 };
  } },
];

const PROBLEMES_CM2 = [
  { generer() {
    const n = 3 + Math.floor(Math.random() * 4);
    const prixUnit = 1 + Math.floor(Math.random() * 5);
    const qte = n + 1 + Math.floor(Math.random() * n * 2);
    const rep = prixUnit * qte;
    return { texte: `<strong>${n}</strong> stylos coûtent <strong>${n * prixUnit}€</strong>. Combien coûtent <strong>${qte}</strong> stylos ?`, rep, min: Math.max(0, rep - 10), max: rep + 10 };
  } },
  { generer() {
    const n = 2 + Math.floor(Math.random() * 3);
    const prixUnit = 2 + Math.floor(Math.random() * 8);
    const qte = n + Math.floor(Math.random() * 5) + 1;
    const rep = prixUnit * qte;
    return { texte: `<strong>${n}</strong> cahiers coûtent <strong>${n * prixUnit}€</strong>. Quel est le prix de <strong>${qte}</strong> cahiers ?`, rep, min: Math.max(0, rep - 15), max: rep + 15 };
  } },
  { generer() {
    const vitesse = 60 + Math.floor(Math.random() * 40) * 10;
    const temps = 1 + Math.floor(Math.random() * 4);
    const rep = vitesse * temps;
    return { texte: `Une voiture roule à <strong>${vitesse} km/h</strong>. Quelle distance parcourt-elle en <strong>${temps} heure${temps > 1 ? "s" : ""}</strong> ?`, rep, min: Math.max(0, rep - 100), max: rep + 100 };
  } },
];

export function lancerProbleme() {
  elTitre.textContent = "📖 Problème du jour";
  const pool = estCM2() ? PROBLEMES_CM2 : estCM1() ? PROBLEMES_CM1 : estCE2() ? PROBLEMES.ce2 : estCE1() ? PROBLEMES.ce1 : PROBLEMES.cp;
  const tmpl = pool[Math.floor(Math.random() * pool.length)];
  const { texte, rep, min, max } = tmpl.generer();
  setBonneReponse(rep);
  elQuestion.innerHTML = `<div class="probleme-question"><p>${texte}</p></div>`;
  const props = propositionsAvecBonne(rep, Math.max(0, min), Math.max(max, min + 5), 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── lancerFractionsCM ─────────────────────────────────────────────────────────
export function lancerFractionsCM() {
  elTitre.textContent = "½ Fractions CM";

  if (estCM2()) {
    const type = Math.random() < 0.5 ? "addition" : "reduction";
    if (type === "addition") {
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
    } else {
      const multiples = [2, 3, 4, 5, 6];
      const k = multiples[Math.floor(Math.random() * multiples.length)];
      const numSimp = 1 + Math.floor(Math.random() * 4);
      const denomSimp = numSimp + 1 + Math.floor(Math.random() * 4);
      const numBig = numSimp * k;
      const denomBig = denomSimp * k;
      setBonneReponse(numSimp);
      elQuestion.innerHTML =
        `<p style="font-size:0.9rem;margin:0 0 0.4rem">Simplifie cette fraction :</p>` +
        `<p class="equation" style="font-size:2.4rem;font-weight:700;margin:0.4rem 0">${numBig}/${denomBig} = ?/${denomSimp}</p>` +
        `<p style="font-size:0.78rem;color:#888">💡 Divise le numérateur par ${k}</p>`;
      const props = propositionsAvecBonne(numSimp, Math.max(1, numSimp - 3), numSimp + 4, 3);
      afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
    }
    return;
  }

  // CM1 : fraction d'une quantité
  const couples = [
    { num: 1, denom: 2, qty: 10 }, { num: 1, denom: 2, qty: 20 }, { num: 3, denom: 4, qty: 20 },
    { num: 2, denom: 5, qty: 25 }, { num: 3, denom: 4, qty: 12 }, { num: 2, denom: 3, qty: 15 },
    { num: 1, denom: 4, qty: 20 }, { num: 3, denom: 5, qty: 30 },
  ];
  const item = couples[Math.floor(Math.random() * couples.length)];
  const rep = Math.round(item.qty * item.num / item.denom);
  setBonneReponse(rep);
  elQuestion.innerHTML =
    `<p style="font-size:0.9rem;margin:0 0 0.4rem">Calcule :</p>` +
    `<p class="equation" style="font-size:2.4rem;font-weight:700;margin:0.4rem 0">${item.num}/${item.denom} de ${item.qty} = ?</p>` +
    `<p style="font-size:0.78rem;color:#888">💡 Divise ${item.qty} par ${item.denom} puis multiplie par ${item.num}</p>`;
  const props = propositionsAvecBonne(rep, Math.max(1, rep - 6), rep + 6, 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}

// ── lancerProportionnalite ────────────────────────────────────────────────────
export function lancerProportionnalite() {
  elTitre.textContent = "⚖️ Proportionnalité";

  if (!estCM2()) {
    setBonneReponse(0);
    elQuestion.innerHTML =
      `<div style="text-align:center;padding:1rem">` +
      `<p style="font-size:2rem">🎓</p>` +
      `<p style="font-size:1rem;font-weight:700;color:var(--primaire)">Ce jeu est pour le CM2</p>` +
      `<p style="font-size:0.9rem;color:#888">Passe en CM2 pour débloquer la proportionnalité !</p>` +
      `</div>`;
    elChoix.innerHTML = "";
    return;
  }

  const situations = [
    { contexte: (n, pu, q) => `${n} stylos coûtent <strong>${n * pu}€</strong>. Combien coûtent <strong>${q}</strong> stylos ?`, n: null, pu: null },
    { contexte: (n, pu, q) => `${n} cahiers coûtent <strong>${n * pu}€</strong>. Quel est le prix de <strong>${q}</strong> cahiers ?`, n: null, pu: null },
    { contexte: (n, pu, q) => `Pour faire ${n} gâteaux il faut <strong>${n * pu} œufs</strong>. Combien d'œufs pour <strong>${q}</strong> gâteaux ?`, n: null, pu: null },
    { contexte: (n, pu, q) => `${n} pommes pèsent <strong>${n * pu} g</strong>. Combien pèsent <strong>${q}</strong> pommes ?`, n: null, pu: null },
  ];
  const sit = situations[Math.floor(Math.random() * situations.length)];
  const n = 2 + Math.floor(Math.random() * 4);
  const prixUnit = 1 + Math.floor(Math.random() * 5);
  const q = n + 1 + Math.floor(Math.random() * (n * 3));
  const rep = prixUnit * q;
  setBonneReponse(rep);
  elQuestion.innerHTML =
    `<div class="probleme-question"><p>${sit.contexte(n, prixUnit, q)}</p></div>`;
  const props = propositionsAvecBonne(rep, Math.max(1, rep - 10), rep + 10, 3);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
}
