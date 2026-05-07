// games-orthographe.js — OrthoPuzzle: orthographe d'usage progressive
// Niveaux: CE1 (homophones) → CE2 (sons) → CM1 (pluriels) → CM2 (difficultés)
// Pédagogie: Pattern + Exception (pas de règles abstraites)

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
  afficherChoix,
  getDifficulte,
  getNiveauCourant,
  NIVEAU,
} from "./app-state.js";

import { apresReponse } from "./app-nav.js";

// ============================================================================
// CE1: Homophones simples (et/est, a/à, on/ont)
// ============================================================================

const HOMOPHONES_CE1 = [
  {
    mot: "et",
    alt: "est",
    exemple: "Je suis allé au parc ___ j'ai joué.",
    reponse: "et",
    explication: "ET = et puis, aussi. C'est la conjonction 'et'",
  },
  {
    mot: "est",
    alt: "et",
    exemple: "Mon chat ___ noir. Il ___ méchant.",
    reponse: "est et",
    explication: "EST = c'est (le verbe être). ET = et puis",
  },
  {
    mot: "a",
    alt: "à",
    exemple: "Elle ___ une balle. Elle joue ___ la balle.",
    reponse: "a à",
    explication: "A = avoir. À = vers, direction",
  },
  {
    mot: "on",
    alt: "ont",
    exemple: "___ joue au parc. Les enfants ___ joué.",
    reponse: "on ont",
    explication: "ON = quelqu'un (pronoun). ONT = ont (verbe avoir)",
  },
];

// ============================================================================
// CE2: Sons complexes (s/ss/c, é/è, ou/où)
// ============================================================================

const SONS_CE2 = [
  {
    mot: "classe",
    description: "Le 's' simple entre deux voyelles = ZZZ? Ou SS?",
    options: ["classe", "clazze"],
    bonne: "classe",
    explication: "CLASSE = SS sound. Double S = ZZZ sound. Si on écrit 'classe' c'est [klas]",
  },
  {
    mot: "sage",
    description: "Le 'ge' fait quel son?",
    options: ["saje", "saj"],
    bonne: "saje",
    explication: "SAGE = 'ge' = J sound. GE devant E = J sound toujours",
  },
  {
    mot: "été",
    description: "Quel accent? É ou È ou Ê?",
    options: ["été", "ète", "êté"],
    bonne: "été",
    explication: "ÉTÉ = aigu sur E fermé. È = grave sur E ouvert",
  },
  {
    mot: "où",
    description: "Où vs ou?",
    options: ["où", "ou"],
    bonne: "où",
    explication: "OÙ = where (accent grave). OU = or (pas accent)",
  },
];

// ============================================================================
// CM1: Pluriels et accords
// ============================================================================

const PLURIELS_CM1 = [
  {
    singular: "un chat",
    plural_options: ["les chats", "les chatz", "les chattes"],
    correct: "les chats",
    explication: "Pluriel régulier: +S. Chat→Chats (les = pluriel)",
  },
  {
    singular: "un outil",
    plural_options: ["les outils", "les outils", "les outaux"],
    correct: "les outils",
    explication: "OUTIL = -S normal. (Exception: TRAVAIL→TRAVAUX)",
  },
  {
    singular: "un bail",
    plural_options: ["les bails", "les baux", "les bailz"],
    correct: "les baux",
    explication: "BAIL/TRAVAIL/CORAIL = -AUX au pluriel (exception!)",
  },
  {
    singular: "l'enfant",
    context: "L'___ joue. Les ___ jouent.",
    blanks: [1, 2],
    answers: ["enfant", "enfants"],
    explication: "ENFANT: pas de changement au singulier. Au pluriel = +S",
  },
];

// ============================================================================
// CM2: Difficultés hautes fréquence
// ============================================================================

const DIFFICULTES_CM2 = [
  {
    phrase: "Leurs stylos sont ___.",
    options: ["bleu", "bleus", "bleue"],
    correct: "bleus",
    explication: "LEURS = pluriel. L'adjectif s'accorde au pluriel = BLEUS",
  },
  {
    phrase: "Ça ___ un secret.",
    options: ["c'est", "c'es", "ca"],
    correct: "c'est",
    explication: "ÇA = pronoun. C'EST = c'est (contraction). ÇA C'EST = correct",
  },
  {
    phrase: "Sa mère ___ ses enfants.",
    options: ["sont", "est", "es"],
    correct: "sont",
    explication: "ENFANTS = pluriel. SONT = verbe être pluriel",
  },
  {
    phrase: "Tout le monde ___ là.",
    options: ["sont", "est", "a"],
    correct: "est",
    explication: "TOUT LE MONDE = singulier (collectif). EST = singulier",
  },
  {
    phrase: "Les enfants ___ tous venus.",
    options: ["sont", "est", "a"],
    correct: "sont",
    explication: "TOUS (adjectif) = accord. ENFANTS pluriel = SONT pluriel",
  },
];

// ============================================================================
// Orchestrateur: mini-jeux courts par niveau
// ============================================================================

export async function lancerOrthoPuzzle() {
  const niveau = getNiveauCourant();
  const diff = getDifficulte();

  let puzzle;

  if (niveau === NIVEAU.cp || niveau === NIVEAU.ce1) {
    puzzle = HOMOPHONES_CE1[Math.floor(Math.random() * HOMOPHONES_CE1.length)];
    lancerHomophonesSimple(puzzle);
  } else if (niveau === NIVEAU.ce2) {
    // 50% homophones révision + 50% sons
    const choix = Math.random() > 0.5 ? "homo" : "sons";
    if (choix === "homo") {
      puzzle = HOMOPHONES_CE1[Math.floor(Math.random() * HOMOPHONES_CE1.length)];
      lancerHomophonesSimple(puzzle);
    } else {
      puzzle = SONS_CE2[Math.floor(Math.random() * SONS_CE2.length)];
      lancerSonsComplexes(puzzle);
    }
  } else if (niveau === NIVEAU.cm1) {
    puzzle = PLURIELS_CM1[Math.floor(Math.random() * PLURIELS_CM1.length)];
    lancerPlurielAccord(puzzle);
  } else if (niveau === NIVEAU.cm2) {
    puzzle = DIFFICULTES_CM2[Math.floor(Math.random() * DIFFICULTES_CM2.length)];
    lancerDifficulteCM2(puzzle);
  }
}

// ============================================================================
// CE1: Homophones simples avec contexte
// ============================================================================

function lancerHomophonesSimple(puzzle) {
  const { mot, alt, exemple, reponse, explication } = puzzle;

  elTitre.textContent = "✏️ Orthographe: Homophones";

  elQuestion.innerHTML = `
    <div style="background: #fbfbff; border-radius: 0.8rem; padding: 1rem; margin-bottom: 0.8rem;">
      <div style="font-size: 1rem; line-height: 1.7; color: #2d3436;">
        <strong>Complète la phrase:</strong>
        <br><br>
        <span style="font-size: 1.05rem;">
          ${exemple.replace(/___, /g, '<span style="background: #ffe0b2; padding: 0.2rem 0.4rem; border-radius: 0.3rem;">___</span>')}
        </span>
      </div>

      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd;">
        <strong style="color: #6c5ce7;">💡 Astuce:</strong>
        <p style="margin: 0.5rem 0 0; font-size: 0.9rem; color: #555;">
          ${explication}
        </p>
      </div>
    </div>
  `;

  setBonneReponse(reponse);

  // Options: le mot bon + alternative
  const options = [reponse, alt];
  afficherChoix(melanger(options), (val, btn) => {
    const correct = val === reponse;
    if (correct) {
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #00b894; font-size: 0.9rem; margin-top: 0.8rem; padding: 0.5rem; background: #f0fff5; border-radius: 0.5rem;";
      feedback.innerHTML = `✅ Correct! <strong>${reponse}</strong> c'est ${explication}`;
      elQuestion.appendChild(feedback);
    } else {
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #e17055; font-size: 0.9rem; margin-top: 0.8rem; padding: 0.5rem; background: #ffe5e0; border-radius: 0.5rem;";
      feedback.innerHTML = `❌ Non. C'est <strong>${reponse}</strong>. ${explication}`;
      elQuestion.appendChild(feedback);
    }
    setTimeout(() => apresReponse(val, btn, reponse), 2000);
  });
}

// ============================================================================
// CE2: Sons complexes avec discrimination
// ============================================================================

function lancerSonsComplexes(puzzle) {
  const { mot, description, options, bonne, explication } = puzzle;

  elTitre.textContent = "🔤 Orthographe: Sons Complexes";

  elQuestion.innerHTML = `
    <div style="background: #fbfbff; border-radius: 0.8rem; padding: 1rem; margin-bottom: 0.8rem;">
      <div style="font-size: 1rem; color: #2d3436;">
        <strong>${description}</strong>
        <br><br>
        <span style="font-size: 1.3rem; font-weight: 700; color: #6c5ce7;">
          ${mot}
        </span>
      </div>

      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd;">
        <strong style="color: #6c5ce7;">💡 Pense:</strong>
        <p style="margin: 0.5rem 0 0; font-size: 0.9rem; color: #555;">
          ${explication}
        </p>
      </div>
    </div>
  `;

  setBonneReponse(bonne);
  afficherChoix(melanger(options), (val, btn) => {
    const correct = val === bonne;
    if (correct) {
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #00b894; font-size: 0.9rem; margin-top: 0.8rem; padding: 0.5rem; background: #f0fff5; border-radius: 0.5rem;";
      feedback.innerHTML = `✅ Exact! ${explication}`;
      elQuestion.appendChild(feedback);
    } else {
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #e17055; font-size: 0.9rem; margin-top: 0.8rem; padding: 0.5rem; background: #ffe5e0; border-radius: 0.5rem;";
      feedback.innerHTML = `❌ Non. Bonne: <strong>${bonne}</strong>. ${explication}`;
      elQuestion.appendChild(feedback);
    }
    setTimeout(() => apresReponse(val, btn, bonne), 2000);
  });
}

// ============================================================================
// CM1: Pluriels et accords
// ============================================================================

function lancerPlurielAccord(puzzle) {
  const { singular, plural_options, correct, explication } = puzzle;

  elTitre.textContent = "📝 Orthographe: Pluriels & Accords";

  elQuestion.innerHTML = `
    <div style="background: #fbfbff; border-radius: 0.8rem; padding: 1rem; margin-bottom: 0.8rem;">
      <div style="font-size: 1rem; color: #2d3436;">
        <strong>Mets au pluriel:</strong>
        <br><br>
        <span style="font-size: 1.2rem; color: #6c5ce7;">
          ${singular}
        </span>
        <br><br>
        <span style="font-size: 0.9rem; color: #666;">
          ↓ Deviens →
        </span>
      </div>

      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd;">
        <strong style="color: #6c5ce7;">💡 Attention:</strong>
        <p style="margin: 0.5rem 0 0; font-size: 0.9rem; color: #555;">
          ${explication}
        </p>
      </div>
    </div>
  `;

  setBonneReponse(correct);
  afficherChoix(melanger(plural_options), (val, btn) => {
    const correct_val = val === correct;
    if (correct_val) {
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #00b894; font-size: 0.9rem; margin-top: 0.8rem; padding: 0.5rem; background: #f0fff5; border-radius: 0.5rem;";
      feedback.innerHTML = `✅ Juste! <strong>${correct}</strong>. ${explication}`;
      elQuestion.appendChild(feedback);
    } else {
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #e17055; font-size: 0.9rem; margin-top: 0.8rem; padding: 0.5rem; background: #ffe5e0; border-radius: 0.5rem;";
      feedback.innerHTML = `❌ Non. Bonne: <strong>${correct}</strong>. ${explication}`;
      elQuestion.appendChild(feedback);
    }
    setTimeout(() => apresReponse(val, btn, correct), 2000);
  });
}

// ============================================================================
// CM2: Difficultés hautes fréquence
// ============================================================================

function lancerDifficulteCM2(puzzle) {
  const { phrase, options, correct, explication } = puzzle;

  elTitre.textContent = "🎯 Orthographe: Difficultés CM2";

  elQuestion.innerHTML = `
    <div style="background: #fbfbff; border-radius: 0.8rem; padding: 1rem; margin-bottom: 0.8rem;">
      <div style="font-size: 1rem; color: #2d3436; line-height: 1.8;">
        <strong>Complète:</strong>
        <br><br>
        <span style="font-size: 1.05rem;">
          ${phrase.replace(/___/, '<span style="background: #ffe0b2; padding: 0.2rem 0.4rem; border-radius: 0.3rem;">___</span>')}
        </span>
      </div>

      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd;">
        <strong style="color: #6c5ce7;">💡 Pense à:</strong>
        <p style="margin: 0.5rem 0 0; font-size: 0.9rem; color: #555;">
          ${explication}
        </p>
      </div>
    </div>
  `;

  setBonneReponse(correct);
  afficherChoix(melanger(options), (val, btn) => {
    const correct_val = val === correct;
    if (correct_val) {
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #00b894; font-size: 0.9rem; margin-top: 0.8rem; padding: 0.5rem; background: #f0fff5; border-radius: 0.5rem;";
      feedback.innerHTML = `✅ Bravo! <strong>${correct}</strong>. ${explication}`;
      elQuestion.appendChild(feedback);
    } else {
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #e17055; font-size: 0.9rem; margin-top: 0.8rem; padding: 0.5rem; background: #ffe5e0; border-radius: 0.5rem;";
      feedback.innerHTML = `❌ Non. <strong>${correct}</strong>. ${explication}`;
      elQuestion.appendChild(feedback);
    }
    setTimeout(() => apresReponse(val, btn, correct), 2000);
  });
}

// ============================================================================
// Variantes spécialisées par niveau
// ============================================================================

export async function lancerOrthopuzzleCE1() {
  const puzzle = HOMOPHONES_CE1[Math.floor(Math.random() * HOMOPHONES_CE1.length)];
  lancerHomophonesSimple(puzzle);
}

export async function lancerOrthopuzzleCE2() {
  const puzzle = SONS_CE2[Math.floor(Math.random() * SONS_CE2.length)];
  lancerSonsComplexes(puzzle);
}

export async function lancerOrthopuzzleCM1() {
  const puzzle = PLURIELS_CM1[Math.floor(Math.random() * PLURIELS_CM1.length)];
  lancerPlurielAccord(puzzle);
}

export async function lancerOrthopuzzleCM2() {
  const puzzle = DIFFICULTES_CM2[Math.floor(Math.random() * DIFFICULTES_CM2.length)];
  lancerDifficulteCM2(puzzle);
}
