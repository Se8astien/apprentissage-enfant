// games-p2.js — Phase 2 games (7 new pedagogical games)
// VocabRéseaux, ProblèmesProgressifs, LectureExpress, HomophonesAvancés,
// PonctuationPuzzle, AmisDesmots, CompréhensionAudio

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
  estCP,
  melanger,
  afficherChoix,
  getDifficulte,
  getNiveauCourant,
  NIVEAU,
} from "./app-state.js";

import { apresReponse } from "./app-nav.js";

// ============================================================================
// 1. VOCABRESEAUX: Vocabulary networks by semantic field
// ============================================================================

const VOCAB_RESEAUX = [
  {
    niveau: NIVEAU.ce1,
    champ: "La famille",
    mot_centre: "MAMAN",
    mots_lies: ["mère", "maman", "mamie", "grand-mère"],
    mots_faux: ["papa", "frère", "école"],
    definition: "MÈRE = parent féminin. MAMIE = grand-mère. MAMAN = autre mot pour mère."
  },
  {
    niveau: NIVEAU.ce2,
    champ: "Les animaux domestiques",
    mot_centre: "CHAT",
    mots_lies: ["félin", "minou", "matou", "animal de compagnie"],
    mots_faux: ["chien", "oiseau", "poisson"],
    definition: "Un CHAT est un félin domestique. Synonymes: MINOU, MATOU."
  },
  {
    niveau: NIVEAU.cm1,
    champ: "Sentiments positifs",
    mot_centre: "JOIE",
    mots_lies: ["bonheur", "contentement", "allégresse", "gaieté"],
    mots_faux: ["tristesse", "colère", "peur"],
    definition: "JOIE = sentiment positif intense. Synonymes: BONHEUR, CONTENTEMENT."
  },
  {
    niveau: NIVEAU.cm2,
    champ: "Actions rapides",
    mot_centre: "COURIR",
    mots_lies: ["sprinter", "galoper", "foncer", "se dépêcher"],
    mots_faux: ["marcher", "sauter", "arrêter"],
    definition: "COURIR = se déplacer rapidement à pied. Variantes: SPRINTER (très vite), GALOPER (chevaux)."
  }
];

export async function lancerVocabReseaux() {
  const niveau = getNiveauCourant();
  const puzzles = VOCAB_RESEAUX.filter(p => p.niveau >= niveau);
  if (puzzles.length === 0) return lancerVocabReseau(VOCAB_RESEAUX[0]);

  const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  lancerVocabReseau(puzzle);
}

function lancerVocabReseau(puzzle) {
  const { champ, mot_centre, mots_lies, mots_faux, definition } = puzzle;

  elTitre.textContent = `📚 VocabRéseaux: ${champ}`;

  const html = `
    <div style="background: #e3f2fd; padding: 1.5rem; border-radius: 0.8rem; margin-bottom: 1.5rem;">
      <p style="font-size: 1.2rem; font-weight: 700; color: #1976d2; margin: 0 0 1rem 0;">
        ${mot_centre}
      </p>
      <p style="font-size: 0.95rem; color: #555; margin: 0;">
        Lequel de ces mots est <strong>synonyme ou lié</strong> au mot ci-dessus ?
      </p>
    </div>
  `;

  elQuestion.innerHTML = html;

  const options = melanger([...mots_lies.slice(0, 2), ...mots_faux.slice(0, 2)]);
  setBonneReponse(mots_lies[0]);

  afficherChoix(options, (val, btn) => {
    const correct = mots_lies.includes(val);
    if (correct) {
      btn.style.background = "#4caf50";
      btn.style.color = "#fff";
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #4caf50; font-size: 0.9rem; margin-top: 1rem; padding: 1rem; background: #f1f8f6; border-radius: 0.5rem;";
      feedback.textContent = `✅ Exact! ${definition}`;
      elQuestion.appendChild(feedback);

      setTimeout(() => {
        elQuestion.innerHTML = "";
        lancerVocabReseaux();
      }, 2000);
    } else {
      btn.style.background = "#ff6b6b";
      btn.style.color = "#fff";
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #ff6b6b; font-size: 0.9rem; margin-top: 1rem; padding: 1rem; background: #ffe5e5; border-radius: 0.5rem;";
      feedback.textContent = `❌ Non. Bonne réponse: ${mots_lies[0]}. ${definition}`;
      elQuestion.appendChild(feedback);
    }
  });
}

// ============================================================================
// 2. PROBLEMESPROGRESSIFS: Scaffolded word problem solving
// ============================================================================

const PROBLEMES_PROGRESSIFS = [
  {
    niveau: NIVEAU.ce2,
    niveau_diff: "Étape 1: Identifier",
    texte: "Léo a 5 pommes. Il en donne 2 à sa sœur. Combien lui en reste-t-il ?",
    question: "Combien de pommes reste-t-il à Léo ?",
    etapes: ["Léo a 5 pommes", "Il en donne 2", "5 - 2 = ?"],
    reponse: "3",
    explication: "5 - 2 = 3. Quand on enlève, on utilise la soustraction."
  },
  {
    niveau: NIVEAU.cm1,
    niveau_diff: "Étape 2: Comprendre les relations",
    texte: "Un livre coûte 8€. Un stylo coûte 3 fois moins cher. Quel est le prix du stylo ?",
    question: "Combien coûte le stylo ?",
    etapes: ["Livre = 8€", "Stylo = 3 fois moins", "8 ÷ 3 ≈ ?"],
    reponse: "2,67 ou 3",
    explication: "8 ÷ 3 = 2,67€. 'Fois moins' = division."
  },
  {
    niveau: NIVEAU.cm2,
    niveau_diff: "Étape 3: Multi-étapes",
    texte: "Una classe a 24 enfants. 1/3 sont partis en excursion. Les autres jouent au foot. Le foot se joue par équipes de 4. Combien d'équipes ?",
    question: "Combien d'équipes de foot ?",
    etapes: ["24 enfants", "1/3 partis = 8 enfants", "Restent = 24 - 8 = 16", "Équipes de 4 = 16 ÷ 4 = 4"],
    reponse: "4",
    explication: "24 - (24÷3) = 16. 16÷4 = 4 équipes. 3 étapes!"
  }
];

export async function lancerProblèmesProgressifs() {
  const niveau = getNiveauCourant();
  const probleme = PROBLEMES_PROGRESSIFS.find(p => p.niveau <= niveau) ||
                  PROBLEMES_PROGRESSIFS[0];
  lancerProblemeProgre(probleme);
}

function lancerProblemeProgre(probleme) {
  const { texte, question, etapes, reponse, explication, niveau_diff } = probleme;

  elTitre.textContent = `📖 ProblèmesProgressifs - ${niveau_diff}`;

  const html = `
    <div style="background: #fff9e6; padding: 1.5rem; border-radius: 0.8rem; margin-bottom: 1.5rem;">
      <p style="font-size: 1rem; color: #333; margin: 0 0 1rem 0;">
        ${texte}
      </p>
      <div style="background: #fff; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
        <p style="font-size: 0.9rem; color: #666; margin: 0;">
          <strong>Étapes du calcul :</strong><br/>
          ${etapes.map((e, i) => `${i + 1}. ${e}`).join("<br/>")}
        </p>
      </div>
      <p style="font-size: 0.95rem; color: #333; margin-top: 1rem; font-weight: 600;">
        ${question}
      </p>
    </div>
  `;

  elQuestion.innerHTML = html;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Écris ta réponse...";
  input.style.cssText = "padding: 0.8rem; font-size: 1rem; width: 100%; max-width: 300px; margin-top: 1rem;";

  const btn = document.createElement("button");
  btn.textContent = "Vérifier";
  btn.style.cssText = "padding: 0.8rem 1.5rem; background: #2196f3; color: white; border: none; border-radius: 0.5rem; cursor: pointer; margin-top: 1rem; font-size: 1rem;";

  btn.addEventListener("click", () => {
    const userAnswer = input.value.trim().toLowerCase().replace(/\s+/g, "");
    const correct = reponse.toLowerCase().replace(/\s+/g, "").includes(userAnswer);

    if (correct || userAnswer.includes(reponse.split(" ")[0])) {
      btn.style.background = "#4caf50";
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #4caf50; margin-top: 1rem; padding: 1rem; background: #f1f8f6; border-radius: 0.5rem;";
      feedback.textContent = `✅ Correct! ${explication}`;
      elQuestion.appendChild(feedback);

      setTimeout(() => {
        elQuestion.innerHTML = "";
        lancerProblèmesProgressifs();
      }, 2500);
    } else {
      btn.style.background = "#ff6b6b";
      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #ff6b6b; margin-top: 1rem; padding: 1rem; background: #ffe5e5; border-radius: 0.5rem;";
      feedback.textContent = `❌ La bonne réponse est ${reponse}. ${explication}`;
      elQuestion.appendChild(feedback);
    }
  });

  elQuestion.appendChild(input);
  elQuestion.appendChild(btn);
}

// ============================================================================
// 3. LECTUREEXPRESS: Speed reading with comprehension
// ============================================================================

const LECTURE_EXPRESS_TEXTES = [
  {
    niveau: NIVEAU.ce2,
    texte: "Malia court dans le parc. Elle voit un papillon bleu. Elle le suit. Le papillon vole très haut. Malia saute pour l'attraper mais elle tombe!",
    questions: [
      { q: "Où court Malia ?", opts: ["Au parc", "À l'école", "À la maison"], bonne: "Au parc" },
      { q: "Quelle couleur est le papillon ?", opts: ["Bleu", "Jaune", "Rouge"], bonne: "Bleu" },
      { q: "Qu'est-ce qui arrive à Malia ?", opts: ["Elle attrape le papillon", "Elle tombe", "Elle s'endort"], bonne: "Elle tombe" }
    ]
  },
  {
    niveau: NIVEAU.cm1,
    texte: "Sophie rêve d'être astronaute. Elle étudie les mathématiques tous les jours. Ses notes s'améliorent. Ses parents lui achètent un télescope. La nuit, Sophie observe les étoiles. Elle imagine déjà son voyage sur la Lune!",
    questions: [
      { q: "Quel est le rêve de Sophie ?", opts: ["Être docteur", "Être astronaute", "Être professeur"], bonne: "Être astronaute" },
      { q: "Pourquoi Sophie étudie les maths ?", opts: ["Parce que c'est obligatoire", "Parce qu'elle rêve d'être astronaute", "Parce que ses parents le veulent"], bonne: "Parce qu'elle rêve d'être astronaute" },
      { q: "Qu'observe Sophie la nuit ?", opts: ["Les papillons", "Les étoiles", "Les voitures"], bonne: "Les étoiles" }
    ]
  }
];

export async function lancerLectureExpress() {
  const niveau = getNiveauCourant();
  const textes = LECTURE_EXPRESS_TEXTES.filter(t => t.niveau <= niveau);
  const texte = textes[Math.floor(Math.random() * textes.length)] || LECTURE_EXPRESS_TEXTES[0];

  afficherLectureExpress(texte, 0);
}

function afficherLectureExpress(texte, questionIndex) {
  if (questionIndex === 0) {
    elTitre.textContent = "⚡ LectureExpress";

    const html = `
      <div style="background: #f0f7ff; padding: 2rem; border-radius: 0.8rem; margin-bottom: 1.5rem; position: relative;">
        <div style="font-size: 1.5rem; position: absolute; top: 1rem; right: 1rem; color: #2196f3;">⏱️</div>
        <p style="font-size: 1rem; line-height: 1.8; color: #333; margin: 0;">
          ${texte.texte}
        </p>
        <p style="font-size: 0.85rem; color: #999; margin-top: 1rem; margin-bottom: 0;">
          💡 Lis bien. Tu auras 3 questions de compréhension.
        </p>
      </div>
    `;

    elQuestion.innerHTML = html;

    const btn = document.createElement("button");
    btn.textContent = "J'ai compris, passons aux questions →";
    btn.style.cssText = "padding: 1rem 1.5rem; background: #2196f3; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem;";

    btn.addEventListener("click", () => {
      elQuestion.innerHTML = "";
      afficherLectureExpress(texte, 1);
    });

    elQuestion.appendChild(btn);
  } else if (questionIndex < texte.questions.length + 1) {
    const question = texte.questions[questionIndex - 1];
    setBonneReponse(question.bonne);

    elTitre.textContent = `⚡ LectureExpress - Question ${questionIndex}/${texte.questions.length}`;

    const html = `
      <div style="background: #f9f9f9; padding: 1.5rem; border-radius: 0.8rem; margin-bottom: 1.5rem;">
        <p style="font-size: 1rem; color: #333; margin: 0;">
          ${question.q}
        </p>
      </div>
    `;

    elQuestion.innerHTML = html;

    const choixDiv = document.createElement("div");
    choixDiv.style.cssText = "display: flex; flex-direction: column; gap: 0.8rem;";

    question.opts.forEach(opt => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-choix";
      btn.textContent = opt;
      btn.style.cssText = "text-align: left; padding: 1rem; font-size: 0.95rem;";
      btn.dataset.valeur = opt;

      btn.addEventListener("click", () => {
        const correct = opt === question.bonne;

        if (correct) {
          btn.style.background = "#4caf50";
          btn.style.color = "#fff";

          setTimeout(() => {
            if (questionIndex === texte.questions.length) {
              elQuestion.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: #f1f8f6; border-radius: 0.8rem;">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">🎉</div>
                  <p style="font-size: 1.1rem; font-weight: 700; color: #2e7d32; margin: 0;">
                    Excellent! Tu as compris le texte!
                  </p>
                </div>
              `;

              setTimeout(() => {
                elQuestion.innerHTML = "";
                lancerLectureExpress();
              }, 2000);
            } else {
              elQuestion.innerHTML = "";
              afficherLectureExpress(texte, questionIndex + 1);
            }
          }, 1500);
        } else {
          btn.style.background = "#ff6b6b";
          btn.style.color = "#fff";

          const feedback = document.createElement("div");
          feedback.style.cssText = "color: #ff6b6b; margin-top: 1rem; padding: 1rem; background: #ffe5e5; border-radius: 0.5rem;";
          feedback.textContent = `❌ Mauvaise réponse. Bonne: ${question.bonne}`;
          elQuestion.appendChild(feedback);
        }
      });

      choixDiv.appendChild(btn);
    });

    elQuestion.appendChild(choixDiv);
  }
}

// ============================================================================
// 4. HOMOPHONESAVANCES: Complex homophones (CM1-CM2)
// ============================================================================

const HOMOPHONES_AVANCES = [
  {
    niveau: NIVEAU.cm1,
    homophone1: "saut",
    homophone2: "seau",
    homophone3: "sceau",
    exemple1: "Le ___ du coureur a été spectaculaire.",
    exemple2: "Il a versé de l'eau dans le ___.",
    exemple3: "Le ___ du roi est en cire.",
    reponses: ["saut", "seau", "sceau"],
    definitions: "SAUT=jump, SEAU=bucket, SCEAU=seal (of wax). 3 homophones CM1!"
  },
  {
    niveau: NIVEAU.cm2,
    homophone1: "ce",
    homophone2: "se",
    homophone3: "ceux",
    exemple1: "___ matin, il y a du brouillard.",
    exemple2: "Elle ___ lève tôt.",
    exemple3: "___ qui arrivent en retard doivent aller au bureau.",
    reponses: ["ce", "se", "ceux"],
    definitions: "CE=demonstrative, SE=reflexive pronoun, CEUX=those. Very common in CM2!"
  }
];

export async function lancerHomophonesAvances() {
  const niveau = getNiveauCourant();
  const homophones = HOMOPHONES_AVANCES.filter(h => h.niveau <= niveau);
  const puzzle = homophones[Math.floor(Math.random() * homophones.length)] ||
                HOMOPHONES_AVANCES[0];
  lancerHomophoneAvance(puzzle);
}

function lancerHomophoneAvance(puzzle) {
  const { homophone1, homophone2, homophone3, exemple1, exemple2, exemple3, reponses, definitions, niveau } = puzzle;

  elTitre.textContent = "🎯 HomophonesAvancés";

  const examples = [
    { txt: exemple1, ans: homophone1 },
    { txt: exemple2, ans: homophone2 },
    { txt: exemple3, ans: homophone3 }
  ];

  const currentExample = examples[Math.floor(Math.random() * examples.length)];
  setBonneReponse(currentExample.ans);

  const html = `
    <div style="background: #f3e5f5; padding: 1.5rem; border-radius: 0.8rem; margin-bottom: 1.5rem;">
      <p style="font-size: 0.95rem; color: #333; line-height: 1.6; margin: 0;">
        ${currentExample.txt}
      </p>
      <p style="font-size: 0.85rem; color: #999; margin-top: 1rem; margin-bottom: 0;">
        Choisis le bon homophones : ${homophone1}, ${homophone2}, ${homophone3}
      </p>
    </div>
  `;

  elQuestion.innerHTML = html;

  const options = [homophone1, homophone2, homophone3];
  afficherChoix(options, (val, btn) => {
    const correct = val === currentExample.ans;

    if (correct) {
      btn.style.background = "#9c27b0";
      btn.style.color = "#fff";

      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #9c27b0; margin-top: 1rem; padding: 1rem; background: #f3e5f5; border-radius: 0.5rem;";
      feedback.textContent = `✅ Exact! ${definitions}`;
      elQuestion.appendChild(feedback);

      setTimeout(() => {
        elQuestion.innerHTML = "";
        lancerHomophonesAvances();
      }, 2000);
    } else {
      btn.style.background = "#ff6b6b";
      btn.style.color = "#fff";

      const feedback = document.createElement("div");
      feedback.style.cssText = "color: #ff6b6b; margin-top: 1rem; padding: 1rem; background: #ffe5e5; border-radius: 0.5rem;";
      feedback.textContent = `❌ Non, c'est "${currentExample.ans}". ${definitions}`;
      elQuestion.appendChild(feedback);
    }
  });
}

// ============================================================================
// Exported stubs for other P2 games (to be expanded)
// ============================================================================

export async function lancerPonctuationPuzzle() {
  elTitre.textContent = "📌 PonctuationPuzzle (Coming soon!)";
  elQuestion.innerHTML = "<p>Ce jeu arrive bientôt...</p>";
}

export async function lancerAmisDesmots() {
  elTitre.textContent = "🔤 AmisDesmots (Coming soon!)";
  elQuestion.innerHTML = "<p>Ce jeu arrive bientôt...</p>";
}

export async function lancerComprehensionAudio() {
  elTitre.textContent = "🔊 CompréhensionAudio (Coming soon!)";
  elQuestion.innerHTML = "<p>Ce jeu arrive bientôt...</p>";
}
