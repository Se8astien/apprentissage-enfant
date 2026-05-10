// app-improvements.js — 15 améliorations pédagogiques intégrées
// #1 Explications contextuelles + #2 Badges + #5 Indices + #10 Diagnostic + #15 Vocabulaire

import {
  getDifficulte,
  getNiveauCourant,
  estCP,
  estCE1,
  estCE2,
  estCM1,
  estCM2,
  NIVEAU,
} from "./app-state.js";

// ============================================================================
// #1 - EXPLICATIONS CONTEXTUELLES (au clic sur faux)
// ============================================================================

const EXPLICATIONS_CONTEXTUELLES = {
  // Maths
  addition: {
    faux_inverse: {
      pattern: (rep, bonne) => rep === bonne - 10 || rep === bonne + 10,
      explication: (rep, bonne) => `
        ❌ Tu as répondu ${rep}
        💡 Presque! Mais regarde le signe: c'est <strong>+</strong> (ajouter), pas <strong>−</strong> (enlever)
        ✅ ${Math.floor(bonne / 10) * 10} + ${bonne % 10} = ${bonne}
      `,
    },
    oubli_retenue: {
      pattern: (rep, bonne) => Math.abs(rep - bonne) === 1,
      explication: (rep, bonne) => `
        ❌ Tu as répondu ${rep}
        💡 Attention à la retenue!
        ${Math.floor(bonne / 10) * 10} + ${bonne % 10}
                ↓
        Quand on dépasse 10, on met 1 dizaine en plus
        ✅ Le bon résultat est ${bonne}
      `,
    },
  },
  soustraction: {
    confusion_addition: {
      pattern: (rep, bonne) => rep > bonne,
      explication: (rep, bonne) => `
        ❌ Tu as répondu ${rep}
        💡 C'est une soustraction (−), pas une addition (+)
        Soustraire = enlever, donc le résultat est PLUS PETIT
        ✅ ${Math.floor(bonne) + 5} − 5 = ${bonne}
      `,
    },
  },
  division: {
    confusion_multiplication: {
      pattern: (rep, bonne) => rep > bonne,
      explication: (rep, bonne) => `
        ❌ Tu as répondu ${rep}
        💡 Diviser = partager entre, donc le résultat est PLUS PETIT
        24 ÷ 4 = "combien de 4 dans 24?" = 6
        ✅ ${bonne}
      `,
    },
  },
  // Français
  homophones: {
    confusion_sens: {
      pattern: (rep, bonne) => rep && bonne,
      explication: (rep, bonne) => `
        ❌ Tu as choisi: <strong>${rep}</strong>
        💡 Regarde le contexte:
        • "a" = avoir (verbe) → "Il <strong>a</strong> un chat"
        • "à" = vers/direction → "Je vais <strong>à</strong> l'école"
        ✅ La bonne réponse était: <strong>${bonne}</strong>
      `,
    },
  },
};

export function obtenirExplication(jeuId, reponseEnfant, bonneReponse) {
  if (!EXPLICATIONS_CONTEXTUELLES[jeuId]) return null;

  const explicas = EXPLICATIONS_CONTEXTUELLES[jeuId];
  for (const [key, {pattern, explication}] of Object.entries(explicas)) {
    if (pattern(reponseEnfant, bonneReponse)) {
      return explication(reponseEnfant, bonneReponse);
    }
  }

  // Explication générique par défaut
  return `
    ❌ Ce n'était pas la bonne réponse
    💡 Essaie de comprendre pourquoi avant de continuer
    ✅ La bonne réponse était: <strong>${bonneReponse}</strong>
  `;
}

// ============================================================================
// #2 - BADGES DE MAÎTRISE (par compétence)
// ============================================================================

const BADGES_MAITRISE = {
  debutant: { nom: "🥉 Débutant", condition: (stats) => stats.bonnes >= 5 },
  intermediaire: { nom: "🥈 Intermédiaire", condition: (stats) => stats.bonnes >= 10 && stats.tempsMoyen < 12 },
  expert: { nom: "🥇 Expert", condition: (stats) => stats.bonnes >= 20 && stats.tempsMoyen < 8 && stats.tauxReussite >= 85 },
};

export function obtenirBadgesMaitrise(jeuId, stats) {
  const badges = [];

  if (BADGES_MAITRISE.debutant.condition(stats)) badges.push(BADGES_MAITRISE.debutant.nom);
  if (BADGES_MAITRISE.intermediaire.condition(stats)) badges.push(BADGES_MAITRISE.intermediaire.nom);
  if (BADGES_MAITRISE.expert.condition(stats)) badges.push(BADGES_MAITRISE.expert.nom);

  return badges;
}

export function afficherBadgesMaitrise(jeuId, stats) {
  const badges = obtenirBadgesMaitrise(jeuId, stats);
  if (badges.length === 0) return "";

  return `
    <div style="text-align: center; margin: 1rem 0; padding: 1rem; background: #f9f9f9; border-radius: 0.5rem;">
      <p style="font-size: 0.9rem; color: #666; margin: 0 0 0.5rem;">🏆 Tu as débloqué:</p>
      <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
        ${badges.map(b => `<span style="font-size: 1.2rem;">${b}</span>`).join("")}
      </div>
    </div>
  `;
}

// ============================================================================
// #5 - INDICES ADAPTATIFS (selon historique tentatives)
// ============================================================================

const INDICES_PROGRESSIFS = {
  addition: [
    "💡 Rappel: addition = ajouter",
    "💡 Petit indice: compte sur tes doigts ou des objets",
    "💡 Grand indice: 8 + 2 = 10, donc 8 + 3 = ?",
  ],
  soustraction: [
    "💡 Rappel: soustraction = enlever",
    "💡 Petit indice: compte en arrière",
    "💡 Grand indice: j'ai 10, j'enlève 3, combien reste?",
  ],
  division: [
    "💡 Rappel: division = partager/grouper",
    "💡 Petit indice: combien de groupes de 4 dans 24?",
    "💡 Grand indice: 4 × 6 = 24, donc 24 ÷ 4 = ?",
  ],
  homophones: [
    "💡 Rappel: ces mots sonnent pareils mais n'ont pas le même sens",
    "💡 Petit indice: regarde la nature du mot (verbe, préposition, etc.)",
    "💡 Grand indice: remplace par un synonyme pour vérifier",
  ],
};

export function obtenirIndiceAdapte(jeuId, tentative) {
  const indices = INDICES_PROGRESSIFS[jeuId];
  if (!indices) return "💡 Réfléchis bien!";

  const niveau = Math.min(tentative - 1, indices.length - 1);
  return indices[niveau];
}

// ============================================================================
// #10 - DIAGNOSTIC D'ERREURS (patterns)
// ============================================================================

export function diagnostiquerErreur(jeuId, reponse, bonne, tentative) {
  const diagnostics = {
    confusion_base: tentative > 2 && Math.abs(reponse - bonne) > 5,
    fatigue: tentative > 4,
    manque_concentration: tentative === 2 && !reponse,
    confiance_insuffisante: tentative > 3 && reponse === 0,
  };

  const diagnostic = Object.entries(diagnostics).find(([_, val]) => val);
  if (!diagnostic) return null;

  const suggestions = {
    confusion_base: "Je pense que tu n'as pas bien compris ce concept. On essaie avec des exemples plus simples?",
    fatigue: "Tu as l'air fatigué 😴 Ça serait bien de prendre une pause!",
    manque_concentration: "Concentre-toi bien et essaie encore 💪",
    confiance_insuffisante: "Tu as l'air d'avoir peur de te tromper. C'est OK de faire des erreurs — c'est comme ça qu'on apprend!",
  };

  return {
    type: diagnostic[0],
    suggestion: suggestions[diagnostic[0]],
  };
}

// ============================================================================
// #15 - VOCABULAIRE ADAPTÉ AU NIVEAU
// ============================================================================

const VOCABULAIRE_ADAPTE = {
  [NIVEAU.cp]: {
    bravo: "🎉 Bravo!",
    faux: "❌ Pas bon",
    indice: "💡 Aide",
    reessaye: "Essaie encore",
  },
  [NIVEAU.ce1]: {
    bravo: "🎉 Super!",
    faux: "❌ C'est faux",
    indice: "💡 Indice",
    reessaye: "Réessaie",
  },
  [NIVEAU.ce2]: {
    bravo: "✅ Excellent!",
    faux: "❌ Incorrect",
    indice: "💡 Conseil",
    reessaye: "Nouvel essai",
  },
  [NIVEAU.cm1]: {
    bravo: "✅ Très bien!",
    faux: "❌ Mauvaise réponse",
    indice: "💡 Suggestion",
    reessaye: "Réessaie",
  },
  [NIVEAU.cm2]: {
    bravo: "✅ Parfait!",
    faux: "❌ Incorrect",
    indice: "💡 Astuce",
    reessaye: "Nouvel essai",
  },
};

export function getMot(mot) {
  const niveau = getNiveauCourant();
  const vocab = VOCABULAIRE_ADAPTE[niveau] || VOCABULAIRE_ADAPTE[NIVEAU.cp];
  return vocab[mot] || mot;
}

// ============================================================================
// #6 - QUÊTES NARRATIVES (structure)
// ============================================================================

const QUETES_NARRATIVES = {
  anniversaire_renard: {
    titre: "🎭 L'anniversaire du Renard",
    etapes: [
      {
        nom: "Prépare les invités",
        jeu: "compte",
        objectif: 15,
        description: "Compte 15 amis pour l'anniversaire",
      },
      {
        nom: "Ajoute les gâteaux",
        jeu: "addition",
        objectif: 5,
        description: "Ajoute 8 gâteaux + 5 biscuits",
      },
      {
        nom: "Partage les cadeaux",
        jeu: "division",
        objectif: 3,
        description: "Partage 24 cadeaux en 4 groupes",
      },
    ],
    recompense: "🎉 Décore la tanière avec des points!",
  },
};

export function obtenirQuete(queteId) {
  return QUETES_NARRATIVES[queteId];
}

// ============================================================================
// #7 - CHRONO PÉDAGOGIQUE (temps intelligent)
// ============================================================================

const TEMPS_OPTIMAUX = {
  [NIVEAU.cp]: 8, // minutes
  [NIVEAU.ce1]: 10,
  [NIVEAU.ce2]: 12,
  [NIVEAU.cm1]: 15,
  [NIVEAU.cm2]: 20,
};

export function obtenirSuggestionTemps(tempsEcoule) {
  const niveau = getNiveauCourant();
  const optimal = TEMPS_OPTIMAUX[niveau];

  if (tempsEcoule < optimal * 0.5) {
    return "⏱️ Tu travailles très vite! Prends le temps de bien réfléchir 🤔";
  }
  if (tempsEcoule > optimal * 1.5) {
    return "⏱️ Tu as bien travaillé aujourd'hui. Peut-être un repos? 😊";
  }
  return null;
}

// ============================================================================
// #11 - MODE LABORATOIRE (sans pression)
// ============================================================================

export function getConfigLaboMode() {
  return {
    afficherScore: false,
    afficherCombo: false,
    afficherGamification: false,
    message: "🔬 Mode Laboratoire — Explore sans pression! Tout est pour apprendre.",
    afficherExplicationsDetailees: true,
  };
}

// ============================================================================
// #13 - PALMARÈS FAMILLE (structure)
// ============================================================================

export function creerPalmaresFamille(statsEnfants) {
  const palmares = Object.entries(statsEnfants)
    .sort(([_, a], [__, b]) => b.pointsTotal - a.pointsTotal)
    .map(([nom, stats], idx) => ({
      rang: idx + 1,
      nom,
      points: stats.pointsTotal,
      domaine: stats.meilleursJeux?.[0] || "Tous les domaines",
    }));

  return `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 1rem; text-align: center;">
      <h2 style="margin: 0 0 1.5rem; font-size: 1.5rem;">🏆 Palmarès de la semaine</h2>
      ${palmares.map(p => `
        <div style="margin: 1rem 0; padding: 0.8rem; background: rgba(255,255,255,0.1); border-radius: 0.5rem;">
          <strong>#${p.rang}</strong> ${p.nom}: <strong>${p.points} points</strong>
          <p style="font-size: 0.85rem; margin: 0.3rem 0 0;">📚 ${p.domaine}</p>
        </div>
      `).join("")}

      <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.3);">
        <p style="font-size: 0.9rem; margin: 0;">🎯 <strong>Défi de la semaine:</strong> Faites 500 additions ENSEMBLE!</p>
      </div>
    </div>
  `;
}

// ============================================================================
// #14 - EXPORT PDF (data structure)
// ============================================================================

export function genererDataPDF(statsEnfant, semaine) {
  return {
    titre: `Progression de ${statsEnfant.nom} — Semaine du ${semaine}`,
    sections: [
      {
        titre: "📊 Résultats par domaine",
        items: Object.entries(statsEnfant.domaines).map(([domaine, stats]) => ({
          domaine,
          tauxReussite: stats.tauxReussite,
          status: stats.tauxReussite >= 80 ? "✅ Solide" : stats.tauxReussite >= 60 ? "⚠️ En cours" : "🔴 À revoir",
        })),
      },
      {
        titre: "💡 Recommandations",
        items: [
          "Refais les domaines à 🔴 cette semaine",
          "Bravo pour tes ✅ — continue!",
          "Prochaine étape: divisions guidées",
        ],
      },
    ],
  };
}
