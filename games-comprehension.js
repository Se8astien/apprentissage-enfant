// games-comprehension.js — ComprendreTexte: compréhension progressive par questions
// Niveaux: CE2 (qui/quoi) → CM1 (pourquoi/comment) → CM2 (inférence/critique)
// Pédagogie: apprendre à poser les BONNES questions pour comprendre

import {
  elTitre,
  elQuestion,
  elChoix,
  setBonneReponse,
  getBonneReponse,
  estCE2,
  estCM1,
  estCM2,
  estGrand,
  melanger,
  afficherChoix,
  getDifficulte,
  getNiveauCourant,
  NIVEAU,
} from "./app-state.js";

import { apresReponse } from "./app-nav.js";

// ============================================================================
// TEXTES PAR NIVEAU (avec images emoji pour contexte)
// ============================================================================

const TEXTES_CE2 = [
  {
    titre: "La Cabane dans l'Arbre",
    texte: "Léo a construit une cabane. Elle est dans un grand chêne. Ses copains viennent y jouer après l'école. Ils jouent à des jeux de détectives.",
    emoji: "🌳",
    questions: [
      { type: "qui", q: "Qui a construit la cabane ?", opts: ["Léo", "Un copain", "Papa"], bonne: "Léo" },
      { type: "quoi", q: "Où est la cabane ?", opts: ["Dans un chêne", "En bas de l'arbre", "Sur le toit"], bonne: "Dans un chêne" },
      { type: "quoi", q: "Qu'est-ce que les copains font dans la cabane ?", opts: ["Jouent à des jeux", "Dorment", "Mangent du gâteau"], bonne: "Jouent à des jeux" },
    ]
  },
  {
    titre: "Le Gâteau d'Anniversaire",
    texte: "Marine a 8 ans aujourd'hui. Maman a préparé un gâteau au chocolat. Papa a acheté des ballons rouges et bleus. Tous les copains de Marine viennent fêter son anniversaire.",
    emoji: "🎂",
    questions: [
      { type: "qui", q: "Qui fête son anniversaire ?", opts: ["Marine", "Maman", "Papa"], bonne: "Marine" },
      { type: "quoi", q: "Quel âge a Marine ?", opts: ["7 ans", "8 ans", "9 ans"], bonne: "8 ans" },
      { type: "quoi", q: "Quelle couleur ont les ballons ?", opts: ["Rouges et bleus", "Juste rouges", "Jaunes et verts"], bonne: "Rouges et bleus" },
    ]
  },
  {
    titre: "Le Chat Noir",
    texte: "Il y a un chat noir qui vit près de l'école. Il s'appelle Minou. Les enfants lui donnent à manger. Le chat aime jouer avec une balle rouge.",
    emoji: "🐱",
    questions: [
      { type: "qui", q: "Quel est le nom du chat ?", opts: ["Minou", "Félix", "Tom"], bonne: "Minou" },
      { type: "quoi", q: "De quelle couleur est le chat ?", opts: ["Noir", "Gris", "Blanc"], bonne: "Noir" },
      { type: "quoi", q: "Avec quoi le chat aime jouer ?", opts: ["Une balle rouge", "Une corde", "Une souris"], bonne: "Une balle rouge" },
    ]
  },
];

const TEXTES_CM1 = [
  {
    titre: "Marine a Peur des Abeilles",
    texte: "Marine a peur des abeilles. Elle n'aime pas aller au jardin. Sa maman a acheté des fleurs. Elle les a mises près de la maison. Maintenant, Marine ne peut pas jouer dehors.",
    emoji: "🐝",
    questions: [
      { type: "qui", q: "Qui a peur des abeilles ?", opts: ["Marine", "Maman", "Papa"], bonne: "Marine" },
      { type: "pourquoi", q: "Pourquoi Marine ne peut pas jouer dehors ?", opts: ["Elle a peur des abeilles et il y a des fleurs", "Elle est malade", "Elle n'aime pas dehors"], bonne: "Elle a peur des abeilles et il y a des fleurs" },
      { type: "comment", q: "Qu'aurait pu faire maman pour aider Marine ?", opts: ["Mettre les fleurs ailleurs", "Ignorer sa peur", "Lui acheter plus de fleurs"], bonne: "Mettre les fleurs ailleurs" },
    ]
  },
  {
    titre: "L'Accident du Vélo",
    texte: "Thomas était pressé d'aller à l'école. Il a pédalé très vite. Il n'a pas regardé la route. Un caillou sur la route a fait tomber son vélo. Thomas s'est fait mal au bras. Il est allé à l'hôpital.",
    emoji: "🚴",
    questions: [
      { type: "qui", q: "Qui a eu un accident ?", opts: ["Thomas", "L'école", "Un caillou"], bonne: "Thomas" },
      { type: "pourquoi", q: "Pourquoi Thomas est tombé ?", opts: ["Il était pressé et n'a pas vu le caillou", "Il était malade", "La route était mouillée"], bonne: "Il était pressé et n'a pas vu le caillou" },
      { type: "lecon", q: "Quelle leçon Thomas devrait apprendre ?", opts: ["Regarder la route en pédalant", "Ne jamais aller à l'école", "Aller plus vite"], bonne: "Regarder la route en pédalant" },
    ]
  },
];

const TEXTES_CM2 = [
  {
    titre: "L'Ami Oublié",
    texte: "Julien et Marc sont meilleurs amis depuis 3 ans. Ils font tout ensemble. Un jour, Julien a une invitation pour une fête d'anniversaire. Il oublie d'inviter Marc. Marc l'apprend par quelqu'un d'autre. Il ne parle plus à Julien.",
    emoji: "😢",
    questions: [
      { type: "qui", q: "Qui a oublié d'inviter Marc ?", opts: ["Julien", "Un copain", "Les parents"], bonne: "Julien" },
      { type: "emotion", q: "Comment se sent probablement Marc ?", opts: ["Triste et blessé", "Heureux", "Indifférent"], bonne: "Triste et blessé" },
      { type: "critique", q: "Crois-tu que Julien a bien agi ? Pourquoi ?", opts: ["Non, il a oublié son meilleur ami", "Oui, c'est normal", "C'est pas grave"], bonne: "Non, il a oublié son meilleur ami" },
      { type: "solution", q: "Que devrait faire Julien pour arranger les choses ?", opts: ["S'excuser sincèrement à Marc", "Continuer comme si de rien n'était", "Inviter Marc la prochaine fois"], bonne: "S'excuser sincèrement à Marc" },
    ]
  },
  {
    titre: "Le Secret",
    texte: "Lisa a entendu un secret sur sa meilleure amie Célia. Elle l'a promis à quelqu'un. Mais elle brûle de le dire à Célia. Elle pense que c'est important que Célia sache. Finalement, Lisa décide de ne rien dire.",
    emoji: "🤫",
    questions: [
      { type: "dilemme", q: "Pourquoi c'est difficile pour Lisa ?", opts: ["Elle veut protéger son amie ET respecter la confiance", "Elle est méchante", "Elle n'aime pas Célia"], bonne: "Elle veut protéger son amie ET respecter la confiance" },
      { type: "critique", q: "Crois-tu que Lisa a bien décidé ? Pourquoi ?", opts: ["Oui, elle respecte sa promesse et fait confiance à Célia", "Non, elle devrait dire", "C'est pareil"], bonne: "Oui, elle respecte sa promesse et fait confiance à Célia" },
      { type: "opinion", q: "Et toi, qu'aurais-tu fait ?", opts: ["Parler à Lisa sans trahir le secret", "Rien dire du tout", "Tout raconter"], bonne: "Parler à Lisa sans trahir le secret" },
    ]
  },
];

// ============================================================================
// ORCHESTRATEUR: sélectionne texte et questions adaptées
// ============================================================================

export async function lancerComprendreTexte() {
  const niveau = getNiveauCourant();
  const diff = getDifficulte();

  let ensemble_textes;

  if (niveau === NIVEAU.ce2) {
    ensemble_textes = TEXTES_CE2;
  } else if (niveau === NIVEAU.cm1) {
    ensemble_textes = TEXTES_CM1;
  } else if (niveau === NIVEAU.cm2) {
    ensemble_textes = TEXTES_CM2;
  } else {
    // CP/CE1: pas encore niveau compréhension
    ensemble_textes = TEXTES_CE2.slice(0, 1); // texte très simple
  }

  // Choisir texte aléatoire
  const texte_courant = ensemble_textes[Math.floor(Math.random() * ensemble_textes.length)];

  // Afficher le texte avec emoji contexte
  afficherTexteAvecQuestions(texte_courant, niveau);
}

function afficherTexteAvecQuestions(texte_obj, niveau) {
  const { titre, texte, emoji, questions } = texte_obj;

  // Afficher le titre + texte
  elTitre.textContent = `📖 ${titre}`;

  // Générer HTML pour le texte avec double-clic pour relire
  const texte_html = `
    <div style="background: #fbfbff; border-radius: 0.8rem; padding: 1rem; margin-bottom: 1rem; border-left: 4px solid #6c5ce7;">
      <div style="font-size: 2.5rem; text-align: center; margin-bottom: 0.8rem;">${emoji}</div>
      <div style="font-size: 1rem; line-height: 1.8; color: #2d3436; margin-bottom: 0.5rem;">
        <strong>${titre}</strong>
      </div>
      <p style="font-size: 0.95rem; line-height: 1.7; color: #2d3436; margin: 0;">
        ${texte}
      </p>
      <p style="font-size: 0.8rem; color: #999; margin-top: 0.5rem; cursor: help;" title="Double-clic pour relire lentement">
        💡 Lis bien le texte. Tu vas répondre à des questions.
      </p>
    </div>
  `;

  elQuestion.innerHTML = texte_html;

  // Ajouter les questions une à une
  afficherQuestionsProgressives(questions, 0);
}

function afficherQuestionsProgressives(questions, index_courant) {
  if (index_courant >= questions.length) {
    // Toutes les questions répondues
    const recap = document.createElement("div");
    recap.style.cssText = "background: #f0fff5; border-radius: 0.8rem; padding: 1rem; margin-top: 1rem; text-align: center;";
    recap.innerHTML = `
      <div style="font-size: 1.3rem; margin-bottom: 0.5rem;">🎉</div>
      <strong>Excellent! Tu as bien compris le texte!</strong>
      <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
        Tu as répondu aux questions. Continue à lire et comprendre!
      </p>
    `;
    elQuestion.appendChild(recap);
    return;
  }

  const question = questions[index_courant];
  const { type, q, opts, bonne } = question;

  // Icône par type de question
  const icones = {
    qui: "👤",
    quoi: "🤔",
    pourquoi: "❓",
    comment: "💭",
    emotion: "😊",
    critique: "⚖️",
    dilemme: "🎯",
    solution: "✨",
    opinion: "💬",
    lecon: "📚",
  };

  const icone = icones[type] || "❓";

  // Afficher la question
  const question_div = document.createElement("div");
  question_div.style.cssText = "background: #fbfbff; border-radius: 0.8rem; padding: 1rem; margin-top: 1rem; border-left: 4px solid #00b894;";
  question_div.innerHTML = `
    <div style="font-size: 1rem; margin-bottom: 0.8rem; color: #2d3436;">
      <span style="font-size: 1.2rem; margin-right: 0.3rem;">${icone}</span>
      <strong>Question ${index_courant + 1}/${questions.length}:</strong>
      <div style="margin-top: 0.5rem; font-size: 0.95rem;">
        ${q}
      </div>
    </div>
  `;

  elQuestion.appendChild(question_div);

  // Afficher les choix
  setBonneReponse(bonne);

  const choix_div = document.createElement("div");
  choix_div.style.cssText = "display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.8rem;";

  opts.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-choix";
    btn.textContent = opt;
    btn.style.cssText = "text-align: left; min-height: 2.8rem;";
    btn.dataset.valeur = opt;

    btn.addEventListener("click", () => {
      const correct = opt === bonne;

      if (correct) {
        // Bonne réponse → question suivante
        btn.style.background = "#00b894";
        btn.style.color = "#fff";

        const feedback = document.createElement("div");
        feedback.style.cssText = "color: #00b894; font-size: 0.9rem; margin-top: 0.5rem; padding: 0.5rem; background: #f0fff5; border-radius: 0.5rem;";
        feedback.textContent = `✅ Correct! Tu as bien compris cette partie.`;
        question_div.appendChild(feedback);

        setTimeout(() => {
          // Nettoyer et afficher prochaine question
          question_div.remove();
          choix_div.remove();
          afficherQuestionsProgressives(questions, index_courant + 1);
        }, 1500);
      } else {
        // Mauvaise réponse → feedback et réessai
        btn.style.background = "#e17055";
        btn.style.color = "#fff";

        const feedback = document.createElement("div");
        feedback.style.cssText = "color: #e17055; font-size: 0.9rem; margin-top: 0.5rem; padding: 0.5rem; background: #ffe5e0; border-radius: 0.5rem;";
        feedback.textContent = `❌ Rellis le texte pour cette réponse. La bonne réponse est: "${bonne}"`;
        question_div.appendChild(feedback);

        // Réactiver les autres boutons
        setTimeout(() => {
          Array.from(choix_div.querySelectorAll("button")).forEach((b) => {
            b.disabled = false;
            b.style.background = "";
            b.style.color = "";
          });
        }, 2000);
      }
    });

    choix_div.appendChild(btn);
  });

  elQuestion.appendChild(choix_div);
}

// ============================================================================
// Variantes spécialisées par niveau (optionnel)
// ============================================================================

export async function lancerComprendreTexteCE2() {
  const niveau = getNiveauCourant();
  const texte_courant = TEXTES_CE2[Math.floor(Math.random() * TEXTES_CE2.length)];
  afficherTexteAvecQuestions(texte_courant, NIVEAU.ce2);
}

export async function lancerComprendreTexteCM1() {
  const texte_courant = TEXTES_CM1[Math.floor(Math.random() * TEXTES_CM1.length)];
  afficherTexteAvecQuestions(texte_courant, NIVEAU.cm1);
}

export async function lancerComprendreTexteCM2() {
  const texte_courant = TEXTES_CM2[Math.floor(Math.random() * TEXTES_CM2.length)];
  afficherTexteAvecQuestions(texte_courant, NIVEAU.cm2);
}
