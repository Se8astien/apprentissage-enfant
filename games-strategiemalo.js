// games-strategiemalo.js — StratégieMalo: calcul mental avec stratégies intelligentes
// Niveaux: CE1 (doubles) → CE2 (décomposition) → CM1+ (compensation/sauts)
// Pédagogie: enseigner COMMENT calculer vite, pas juste CALCULER

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
  estGrand,
  melanger,
  propositionsAvecBonne,
  afficherChoix,
  getDifficulte,
  getNiveauCourant,
  NIVEAU,
} from "./app-state.js";

import { apresReponse, apresReponseTexte } from "./app-nav.js";

// ============================================================================
// CE1: Doubles et moitiés (fondations)
// ============================================================================

export async function lancerStrategieDoubles() {
  const diff = getDifficulte();

  // CE1 progression: 2+2 → 10+10 → 20+20
  const paires = [
    { a: 2, b: 2, strategie: "Double de 2 = 4" },
    { a: 3, b: 3, strategie: "Double de 3 = 6" },
    { a: 4, b: 4, strategie: "Double de 4 = 8" },
    { a: 5, b: 5, strategie: "Double de 5 = 10" },
    { a: 6, b: 6, strategie: "Double de 6 = 12" },
    { a: 7, b: 7, strategie: "Double de 7 = 14" },
    { a: 8, b: 8, strategie: "Double de 8 = 16" },
    { a: 9, b: 9, strategie: "Double de 9 = 18" },
    { a: 10, b: 10, strategie: "Double de 10 = 20" },
  ];

  const paire = paires[Math.floor(Math.random() * paires.length)];
  const bonne = paire.a + paire.b;

  elTitre.textContent = "🎯 Doubles — La stratégie la plus rapide !";
  elQuestion.innerHTML = `
    <div style="font-size: 1.3rem; font-weight: 700; color: #6c5ce7; margin-bottom: 0.8rem;">
      ${paire.a} + ${paire.b} = ?
    </div>
    <div style="background: #fbfbff; border-radius: 0.8rem; padding: 0.8rem; font-size: 0.9rem; color: #5c5c5c; margin-bottom: 1rem;">
      💡 <strong>Astuce:</strong> Quand les deux nombres sont les mêmes, c'est un DOUBLE!
      <br>Double de ${paire.a} = ${bonne}
    </div>
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <span style="display: inline-block; background: #e0d5ff; padding: 0.4rem 0.8rem; border-radius: 0.6rem; font-size: 0.85rem;">
        ◼️ ${paire.a}
      </span>
      <span style="display: inline-block; background: #e0d5ff; padding: 0.4rem 0.8rem; border-radius: 0.6rem; font-size: 0.85rem;">
        ◼️ ${paire.a}
      </span>
      <span style="display: inline-block; background: #fff; padding: 0.4rem 0.8rem; border-radius: 0.6rem; font-size: 0.85rem; border: 2px solid #6c5ce7;">
        = ?
      </span>
    </div>
  `;

  setBonneReponse(bonne);

  // Propositions intelligentes
  const props = [
    bonne,
    bonne + 1,
    bonne - 1,
    paire.a + (paire.a - 1),
  ].filter((v, i, arr) => arr.indexOf(v) === i && v > 0);

  afficherChoix(melanger(props).slice(0, 3), (val, btn) => {
    const correct = Number(val) === bonne;
    if (correct) {
      apresReponse(val, btn, bonne);
    } else {
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #e17055; font-size: 0.9rem; margin-top: 0.5rem;";
      feedback.textContent = `Pas tout à fait. Double de ${paire.a} = ${bonne}. Mémorise ce double !`;
      elQuestion.appendChild(feedback);
      setTimeout(() => apresReponse(val, btn, bonne), 2000);
    }
  });
}

// ============================================================================
// CE2: Aller à 10 (décomposition intelligente)
// ============================================================================

export async function lancerStrategieAller10() {
  const diff = getDifficulte();

  // Paires qui nécessitent "aller à 10"
  const cas = [
    { a: 8, b: 7, etapes: "8+7 = 8+2+5 = 10+5 = 15", desc: "Je complète à 10, puis j'ajoute le reste" },
    { a: 9, b: 6, etapes: "9+6 = 9+1+5 = 10+5 = 15", desc: "J'ajoute 1 pour faire 10, puis le reste" },
    { a: 7, b: 8, etapes: "7+8 = 7+3+5 = 10+5 = 15", desc: "Je complète à 10 (3), puis j'ajoute 5" },
    { a: 9, b: 4, etapes: "9+4 = 9+1+3 = 10+3 = 13", desc: "Je fais 10 en premier" },
    { a: 8, b: 5, etapes: "8+5 = 8+2+3 = 10+3 = 13", desc: "Deux étapes: d'abord 10, puis le reste" },
  ];

  const cas_courant = cas[Math.floor(Math.random() * cas.length)];
  const { a, b, etapes, desc } = cas_courant;
  const bonne = a + b;

  elTitre.textContent = "🎯 Aller à 10 — La clé pour être rapide !";
  elQuestion.innerHTML = `
    <div style="font-size: 1.3rem; font-weight: 700; color: #6c5ce7; margin-bottom: 0.8rem;">
      ${a} + ${b} = ?
    </div>
    <div style="background: #fbfbff; border-radius: 0.8rem; padding: 0.8rem; font-size: 0.9rem; color: #5c5c5c; margin-bottom: 1rem;">
      💡 <strong>Stratégie:</strong> ${desc}
      <br><span style="font-family: monospace; font-size: 0.85rem; color: #6c5ce7; font-weight: 600;">${etapes}</span>
    </div>
    <div style="display: flex; gap: 0.3rem; flex-wrap: wrap; margin-bottom: 0.8rem;">
      ${Array(a).fill(0).map(() => '<span style="display: inline-block; width: 1.2rem; height: 1.2rem; background: #e0d5ff; border-radius: 0.3rem;"></span>').join('')}
      ${Array(b).fill(0).map(() => '<span style="display: inline-block; width: 1.2rem; height: 1.2rem; background: #c5b5ff; border-radius: 0.3rem;"></span>').join('')}
    </div>
  `;

  setBonneReponse(bonne);

  const props = melanger([bonne, bonne+1, bonne-1, a+a, b+b]).slice(0, 4);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, bonne));
}

// ============================================================================
// CM1+: Compensation et sauts (stratégies avancées)
// ============================================================================

export async function lancerStrategieCompensation() {
  const diff = getDifficulte();

  // Cas où compensation (ajouter/enlever des deux côtés) aide
  const cas = [
    {
      a: 27, b: 5,
      strategie: "Compensation",
      etapes: "27 + 5 = (27+3) + (5-3) = 30 + 2 = 32",
      desc: "Je fais 30 en premier (arrondi facile), puis j'ajuste"
    },
    {
      a: 38, b: 14,
      strategie: "Compensation soustraction",
      etapes: "38 - 14 = (38+2) - (14+2) = 40 - 16 = 24",
      desc: "J'ajoute 2 des deux côtés pour arrondir"
    },
    {
      a: 43, b: 17,
      strategie: "Décomposition additive",
      etapes: "43 + 17 = 40 + 20 = 60",
      desc: "Je calcule par dizaines (40+20), c'est plus facile!"
    },
    {
      a: 52, b: 19,
      strategie: "Sauts intelligents",
      etapes: "52 + 19 = 52 + 20 - 1 = 72 - 1 = 71",
      desc: "J'arrondie 19 à 20, puis j'enlève 1"
    },
  ];

  const cas_courant = cas[Math.floor(Math.random() * cas.length)];
  const { a, b, strategie, etapes, desc } = cas_courant;
  const bonne = a + b;

  elTitre.textContent = `🎯 ${strategie} — Les experts calculent comme ça!`;
  elQuestion.innerHTML = `
    <div style="font-size: 1.3rem; font-weight: 700; color: #6c5ce7; margin-bottom: 0.8rem;">
      ${a} + ${b} = ?
    </div>
    <div style="background: #fbfbff; border-radius: 0.8rem; padding: 0.8rem; font-size: 0.9rem; color: #5c5c5c; margin-bottom: 1rem;">
      🧠 <strong>Comment faire:</strong> ${desc}
      <br><span style="font-family: monospace; font-size: 0.85rem; color: #6c5ce7; font-weight: 600;">${etapes}</span>
    </div>
    <p style="font-size: 0.85rem; color: #888; margin: 0.5rem 0;">
      💡 Cette stratégie = rapide ET sans erreur. À mémoriser!
    </p>
  `;

  setBonneReponse(bonne);

  const props = melanger([bonne, bonne+2, bonne-2, a+a]).slice(0, 4);
  afficherChoix(props, (val, btn) => apresReponse(val, btn, bonne));
}

// ============================================================================
// CM2: Estimation + calcul exact (vérification stratégique)
// ============================================================================

export async function lancerStrategieEstimation() {
  const diff = getDifficulte();

  const cas = [
    { a: 47, b: 3, estim: 50*3, exact: 47*3, desc: "Arrondis 47 à 50 pour estimer d'abord" },
    { a: 23, b: 5, estim: 25*5, exact: 23*5, desc: "Arrondis 23 à 25, puis calcule exact" },
    { a: 198, b: 4, estim: 200*4, exact: 198*4, desc: "200 × 4 c'est facile, puis tu ajustes" },
  ];

  const cas_courant = cas[Math.floor(Math.random() * cas.length)];
  const { a, b, estim, exact, desc } = cas_courant;

  elTitre.textContent = "🎯 Estimer PUIS calculer exact — Méthode des experts!";
  elQuestion.innerHTML = `
    <div style="font-size: 1.3rem; font-weight: 700; color: #6c5ce7; margin-bottom: 0.8rem;">
      ${a} × ${b} = ?
    </div>
    <div style="background: #fbfbff; border-radius: 0.8rem; padding: 0.8rem; font-size: 0.9rem; margin-bottom: 1rem;">
      📊 <strong>Étape 1: Estimer (rapide)</strong>
      <div style="font-family: monospace; font-size: 0.85rem; color: #6c5ce7; font-weight: 600; margin-top: 0.3rem;">
        ≈ ${estim} (réponse environ)
      </div>

      <div style="margin-top: 0.8rem; border-top: 1px solid #d0d0d0; padding-top: 0.5rem;">
        🔢 <strong>Étape 2: Calculer exact</strong>
        <div style="font-family: monospace; font-size: 0.85rem; color: #6c5ce7; font-weight: 600; margin-top: 0.3rem;">
          = ${exact} (c'est proche de l'estimation ✅)
        </div>
      </div>
    </div>
  `;

  setBonneReponse(exact);

  const props = melanger([exact, exact+2, exact-2, estim]).slice(0, 4);
  afficherChoix(props, (val, btn) => {
    const correct = Number(val) === exact;
    if (correct) {
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #00b894; font-size: 0.9rem; margin-top: 0.8rem; padding: 0.5rem; background: #f0fff5; border-radius: 0.5rem;";
      feedback.innerHTML = `✅ Excellent! Tu as estimé (≈${estim}) ET calculé exact (=${exact}). C'est comme ça qu'on devient rapide!`;
      elQuestion.appendChild(feedback);
    }
    apresReponse(val, btn, exact);
  });
}

// ============================================================================
// Orchestrateur: sélectionne la stratégie adaptée au niveau
// ============================================================================

export async function lancerStratégieMalo() {
  const niveau = getNiveauCourant();
  const diff = getDifficulte();

  // CE1: Doubles obligatoires
  if (niveau === NIVEAU.cp || niveau === NIVEAU.ce1) {
    return lancerStrategieDoubles();
  }

  // CE2: 50% doubles (révision) + 50% aller à 10
  if (niveau === NIVEAU.ce2) {
    const choix = Math.random() > 0.5 ? "doubles" : "aller10";
    if (choix === "doubles") {
      return lancerStrategieDoubles();
    } else {
      return lancerStrategieAller10();
    }
  }

  // CM1: Décomposition, compensation, sauts
  if (niveau === NIVEAU.cm1) {
    return lancerStrategieCompensation();
  }

  // CM2: Estimation + exact
  if (niveau === NIVEAU.cm2) {
    return lancerStrategieEstimation();
  }
}
