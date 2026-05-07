// games-p2.js — Phase 2 Games (7 experimental games)
// VocabRéseaux, ProblèmesProgressifs, LectureExpress, HomophonesAvancés, PonctuationPuzzle, AmisDesmots, CompréhensionAudio

import {
  elTitre,
  elQuestion,
  elChoix,
  getNiveauCourant,
  getDifficulte,
  estCP,
  estCE1,
  estCE2,
  estCM1,
  estCM2,
  estGrand,
  getBonneReponse,
  setBonneReponse,
  getRepondu,
  setRepondu,
  melanger,
  propositionsAvecBonne,
  afficherChoix,
} from "./app-state.js";

import { apresReponse, apresReponseTexte } from "./app-nav.js";

// ── Helpers ──────────────────────────────────────────────────────────────────
function filtrerParNiveau(donnees, niveauActuel, mappingNiveaux) {
  const niveaux = mappingNiveaux[niveauActuel] || Object.values(mappingNiveaux)[0];
  return donnees.filter(d => niveaux.includes(d.niveau));
}

// ── 1. VOCABULAIRE RÉSEAUX (semantic fields) ────────────────────────────────
const VOCAB_RESEAUX_DONNEES = [
  // CE1 - Animaux
  { mot: "chat", synonymes: ["félin", "minou", "matou"], domaine: "animaux", niveau: "ce1" },
  { mot: "chien", synonymes: ["canidé", "cabot", "clebs"], domaine: "animaux", niveau: "ce1" },
  { mot: "oiseau", synonymes: ["volatile", "ailé", "bestiole"], domaine: "animaux", niveau: "ce1" },
  { mot: "poisson", synonymes: ["aquatique", "écaille", "nageur"], domaine: "animaux", niveau: "ce1" },
  { mot: "papillon", synonymes: ["insecte", "ailé", "lépidoptère"], domaine: "animaux", niveau: "ce1" },
  { mot: "araignée", synonymes: ["arachnide", "tisserand", "arthropode"], domaine: "animaux", niveau: "ce1" },
  // CE1 - Lieux
  { mot: "maison", synonymes: ["demeure", "logis", "habitation"], domaine: "lieux", niveau: "ce1" },
  { mot: "école", synonymes: ["établissement", "institution", "collège"], domaine: "lieux", niveau: "ce1" },
  { mot: "parc", synonymes: ["jardin", "verdure", "espace vert"], domaine: "lieux", niveau: "ce1" },
  { mot: "forêt", synonymes: ["bois", "futaie", "bosquet"], domaine: "lieux", niveau: "ce1" },
  { mot: "plage", synonymes: ["rivage", "côte", "littoral"], domaine: "lieux", niveau: "ce1" },
  { mot: "montagne", synonymes: ["pic", "sommet", "chaîne"], domaine: "lieux", niveau: "ce1" },
  // CE2 - Adjectifs positifs
  { mot: "beau", synonymes: ["joli", "magnifique", "splendide"], domaine: "adjectifs", niveau: "ce2" },
  { mot: "coloré", synonymes: ["vivant", "bariolé", "éclatant"], domaine: "adjectifs", niveau: "ce2" },
  { mot: "rapide", synonymes: ["véloce", "agile", "prompt"], domaine: "adjectifs", niveau: "ce2" },
  { mot: "grand", synonymes: ["imposant", "vaste", "énorme"], domaine: "adjectifs", niveau: "ce2" },
  { mot: "petit", synonymes: ["minuscule", "menu", "microscopique"], domaine: "adjectifs", niveau: "ce2" },
  { mot: "fort", synonymes: ["puissant", "robuste", "musclé"], domaine: "adjectifs", niveau: "ce2" },
  { mot: "faible", synonymes: ["frêle", "chétif", "fragile"], domaine: "adjectifs", niveau: "ce2" },
  { mot: "chaud", synonymes: ["brûlant", "torride", "brillant"], domaine: "adjectifs", niveau: "ce2" },
  // CM1 - Émotions
  { mot: "content", synonymes: ["joyeux", "heureux", "satisfait"], domaine: "émotions", niveau: "cm1" },
  { mot: "triste", synonymes: ["mélancolique", "morose", "abattu"], domaine: "émotions", niveau: "cm1" },
  { mot: "peur", synonymes: ["effroi", "frayeur", "angoisse"], domaine: "émotions", niveau: "cm1" },
  { mot: "surprise", synonymes: ["stupéfaction", "étonnement", "choc"], domaine: "émotions", niveau: "cm1" },
  { mot: "amour", synonymes: ["affection", "tendresse", "passion"], domaine: "émotions", niveau: "cm1" },
  { mot: "colère", synonymes: ["rage", "fureur", "irritation"], domaine: "émotions", niveau: "cm1" },
  { mot: "jalousie", synonymes: ["envie", "convoitise", "dépit"], domaine: "émotions", niveau: "cm1" },
  { mot: "honte", synonymes: ["gêne", "confusion", "déshonneur"], domaine: "émotions", niveau: "cm1" },
  // CM2 - Qualités
  { mot: "colérique", synonymes: ["furieux", "rageur", "irascible"], domaine: "qualités", niveau: "cm2" },
  { mot: "studieux", synonymes: ["appliqué", "travailleur", "diligent"], domaine: "qualités", niveau: "cm2" },
  { mot: "généreux", synonymes: ["altruiste", "bienveillant", "charitable"], domaine: "qualités", niveau: "cm2" },
  { mot: "égoïste", synonymes: ["intéressé", "avare", "cupide"], domaine: "qualités", niveau: "cm2" },
  { mot: "fidèle", synonymes: ["loyal", "constant", "dévoué"], domaine: "qualités", niveau: "cm2" },
  { mot: "honnête", synonymes: ["intègre", "sincère", "loyal"], domaine: "qualités", niveau: "cm2" },
  { mot: "courageux", synonymes: ["brave", "intrépide", "vaillant"], domaine: "qualités", niveau: "cm2" },
  { mot: "intelligent", synonymes: ["brillant", "perspicace", "sagace"], domaine: "qualités", niveau: "cm2" },
  // CM2 - Sentiments/États
  { mot: "espoir", synonymes: ["attente", "confiance", "optimisme"], domaine: "états", niveau: "cm2" },
  { mot: "doute", synonymes: ["hésitation", "incertitude", "perplexité"], domaine: "états", niveau: "cm2" },
  { mot: "culpabilité", synonymes: ["remords", "repentance", "contrition"], domaine: "états", niveau: "cm2" },
  { mot: "nostalgie", synonymes: ["regret", "saudade", "mélancolie"], domaine: "états", niveau: "cm2" },
];

export function lancerVocabReseaux() {
  const diff = getDifficulte();
  const niveau = getNiveauCourant();
  const niveauFiltres = {
    ce1: ["ce1"],
    ce2: ["ce1", "ce2"],
    cm1: ["ce1", "ce2", "cm1"],
    cm2: ["ce1", "ce2", "cm1", "cm2"],
  };
  const donnees = filtrerParNiveau(VOCAB_RESEAUX_DONNEES, niveau, niveauFiltres);
  if (donnees.length === 0) { elQuestion.innerHTML = "<p>Pas encore de questions pour ce niveau.</p>"; return; }
  const item = donnees[Math.floor(Math.random() * donnees.length)];
  const nbChoix = 2 + diff; // 2, 3 ou 4 options

  elTitre.textContent = "🧠 Vocabulaire Réseaux";
  elQuestion.innerHTML = `
    <p>Quel mot est un synonyme de <strong>"${item.mot}"</strong> ?</p>
    <p style="font-size:0.9rem;color:#666;margin-top:0.5rem">Domaine: <em>${item.domaine}</em></p>
  `;

  const niveauxActuels = niveauFiltres[niveau];
  const distracteurs = VOCAB_RESEAUX_DONNEES
    .filter(d => d.mot !== item.mot && niveauxActuels.includes(d.niveau))
    .flatMap(d => d.synonymes)
    .slice(0, 5);

  const options = melanger([...item.synonymes, ...distracteurs]).slice(0, nbChoix);
  const bonIndex = options.indexOf(item.synonymes[0]);
  setBonneReponse(bonIndex);

  elChoix.innerHTML = "";
  options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-choix";
    btn.textContent = opt;
    btn.addEventListener("click", () => apresReponse(idx, btn, bonIndex));
    elChoix.appendChild(btn);
  });
}

// ── 2. PROBLÈMES PROGRESSIFS (step-by-step problem solving) ─────────────────
const PROBLEMES_DONNEES = [
  // CE2 - Addition/Soustraction simples
  { enonce: "Marie a 5 pommes. Elle en mange 2. Combien lui en reste-t-il ?", reponse: 3, etapes: ["5 - 2 = ?"], niveau: "ce2" },
  { enonce: "Tom a 3 billes. Son ami lui en donne 4. Combien en a-t-il maintenant ?", reponse: 7, etapes: ["3 + 4 = ?"], niveau: "ce2" },
  { enonce: "Alice avait 8 crayons. Elle en donne 3 à son frère. Combien lui en reste-t-il ?", reponse: 5, etapes: ["8 - 3 = ?"], niveau: "ce2" },
  { enonce: "Jules a 6 bonbons. Il en reçoit 4 de plus. Combien en a-t-il au total ?", reponse: 10, etapes: ["6 + 4 = ?"], niveau: "ce2" },
  { enonce: "Léa avait 12 stickers. Elle en utilise 5. Combien en reste-t-il ?", reponse: 7, etapes: ["12 - 5 = ?"], niveau: "ce2" },
  { enonce: "Paul a 9 billes rouges et 6 billes bleues. Combien en a-t-il au total ?", reponse: 15, etapes: ["9 + 6 = ?"], niveau: "ce2" },
  { enonce: "Sarah avait 20 euros. Elle dépense 8 euros. Combien lui reste-t-il ?", reponse: 12, etapes: ["20 - 8 = ?"], niveau: "ce2" },
  { enonce: "Martin collecte des timbres. Il en avait 15 et en reçoit 10. Combien en a-t-il ?", reponse: 25, etapes: ["15 + 10 = ?"], niveau: "ce2" },
  // CM1 - Multiplication/Division
  { enonce: "Lucie achète 2 stylos à 1€ chacun. Combien dépense-t-elle ?", reponse: 2, etapes: ["2 × 1 = ?"], niveau: "cm1" },
  { enonce: "Il y a 12 gâteaux à partager entre 3 enfants. Combien chacun en reçoit-il ?", reponse: 4, etapes: ["12 ÷ 3 = ?"], niveau: "cm1" },
  { enonce: "Chaque classe a 5 tables. Il y a 4 classes. Combien de tables au total ?", reponse: 20, etapes: ["4 × 5 = ?"], niveau: "cm1" },
  { enonce: "Maman a 18 bonbons à distribuer à ses 2 enfants équitablement. Combien chacun reçoit-il ?", reponse: 9, etapes: ["18 ÷ 2 = ?"], niveau: "cm1" },
  { enonce: "Pierre a 3 boîtes avec 8 œufs chacune. Combien d'œufs au total ?", reponse: 24, etapes: ["3 × 8 = ?"], niveau: "cm1" },
  { enonce: "Un fermier a 30 poules à mettre dans 5 enclos. Combien par enclos ?", reponse: 6, etapes: ["30 ÷ 5 = ?"], niveau: "cm1" },
  { enonce: "Sophie a 6 rangées de fleurs avec 7 fleurs par rangée. Combien au total ?", reponse: 42, etapes: ["6 × 7 = ?"], niveau: "cm1" },
  { enonce: "Une école commande 48 cahiers pour 6 classes. Combien par classe ?", reponse: 8, etapes: ["48 ÷ 6 = ?"], niveau: "cm1" },
  // CM2 - Multi-étapes
  { enonce: "Papa a 20€. Il dépense 8€ pour un livre. Puis il gagne 5€. Combien a-t-il ?", reponse: 17, etapes: ["20 - 8 = 12", "12 + 5 = ?"], niveau: "cm2" },
  { enonce: "Une confiserie a 30 chocolats. Elle en vend 12 le matin et 8 l'après-midi. Combien en reste-t-il ?", reponse: 10, etapes: ["12 + 8 = 20", "30 - 20 = ?"], niveau: "cm2" },
  { enonce: "Thomas avait 15€. Il achète 2 livres à 3€ chacun. Combien lui reste-t-il ?", reponse: 9, etapes: ["2 × 3 = 6", "15 - 6 = ?"], niveau: "cm2" },
  { enonce: "Une boulangerie a 4 plateaux avec 12 croissants chacun. Elle en vend 25. Combien reste-t-il ?", reponse: 23, etapes: ["4 × 12 = 48", "48 - 25 = ?"], niveau: "cm2" },
  { enonce: "Luc a 35 images. Il en donne un quart à son ami. Combien en reste-t-il ?", reponse: 26, etapes: ["35 ÷ 4 ≈ 8,75 → 8 ou 9", "35 - 9 = 26"], niveau: "cm2" },
];

export function lancerProblèmesProgressifs() {
  const diff = getDifficulte();
  const niveau = getNiveauCourant();
  const niveauFiltres = {
    ce2: ["ce2"],
    cm1: ["ce2", "cm1"],
    cm2: ["ce2", "cm1", "cm2"],
  };
  const donnees = filtrerParNiveau(PROBLEMES_DONNEES, niveau, niveauFiltres);
  if (donnees.length === 0) { elQuestion.innerHTML = "<p>Pas encore de problèmes pour ce niveau.</p>"; return; }
  const item = donnees[Math.floor(Math.random() * donnees.length)];

  elTitre.textContent = "📊 Problèmes Progressifs";
  const etapesHtml = item.etapes.map((e, i) => `<div style="padding:0.3rem;font-size:0.9rem;color:#666;">Étape ${i+1}: ${e}</div>`).join("");
  elQuestion.innerHTML = `
    <p><strong>${item.enonce}</strong></p>
    <div style="background:#f5f5f5;padding:0.8rem;border-radius:0.5rem;margin-top:0.5rem;font-size:0.9rem;">
      ${etapesHtml}
    </div>
    <p style="margin-top:0.8rem;font-weight:600;">Réponse:</p>
  `;

  const reponse = String(item.reponse);
  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "Tape ta réponse...";
  input.style.cssText = "width:80px;padding:0.5rem;font-size:1.1rem;border:2px solid var(--primaire);border-radius:0.4rem;text-align:center;";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn-choix";
  btn.textContent = "✓ Vérifier";
  btn.addEventListener("click", () => {
    const valeur = String(parseInt(input.value) || "");
    apresReponseTexte(valeur, btn, reponse);
  });

  elChoix.innerHTML = "";
  elChoix.appendChild(input);
  elChoix.appendChild(btn);
  input.focus();
}

// ── 3. LECTURE EXPRESS (speed reading + comprehension) ──────────────────────
const TEXTES_EXPRESS = [
  // CE2
  {
    texte: "Léa adore les chevaux. Chaque matin, elle va au stade équestre. Elle monte Tonnerre, un cheval noir et rapide. Aujourd'hui, Léa a participé à une course et elle a gagné!",
    questions: [
      { q: "Quel est le nom du cheval?", reponses: ["Tonnerre", "Léa", "Noir"], bonne: "Tonnerre" },
      { q: "Où va Léa?", reponses: ["à l'école", "au stade équestre", "à la maison"], bonne: "au stade équestre" },
      { q: "Qu'a fait Léa aujourd'hui?", reponses: ["elle a perdu", "elle a participé à une course et gagné", "elle a dormi"], bonne: "elle a participé à une course et gagné" },
    ],
    niveau: "ce2",
  },
  {
    texte: "Max est un petit garçon qui aime les jeux. Aujourd'hui, il a trouvé une balle rouge sous son lit. Il l'a lancée très haut et elle est tombée dans un buisson. Max a dû chercher longtemps avant de la retrouver.",
    questions: [
      { q: "Qui est Max?", reponses: ["un chien", "un petit garçon", "un chat"], bonne: "un petit garçon" },
      { q: "Quelle couleur était la balle?", reponses: ["bleue", "rouge", "verte"], bonne: "rouge" },
      { q: "Où la balle est-elle tombée?", reponses: ["dans l'eau", "sous le lit", "dans un buisson"], bonne: "dans un buisson" },
    ],
    niveau: "ce2",
  },
  {
    texte: "Sarah mange une pomme dans le jardin. Elle voit un oiseau qui vole parmi les fleurs. L'oiseau chante une jolie chanson. Sarah sourit en écoutant.",
    questions: [
      { q: "Où est Sarah?", reponses: ["à l'école", "dans le jardin", "à la maison"], bonne: "dans le jardin" },
      { q: "Qu'est-ce que Sarah mange?", reponses: ["une banane", "une pomme", "une orange"], bonne: "une pomme" },
      { q: "Que fait l'oiseau?", reponses: ["il dort", "il chante", "il mange"], bonne: "il chante" },
    ],
    niveau: "ce2",
  },
  // CM1
  {
    texte: "Le renard roux longeait la forêt quand il aperçut une poule. Elle picorait près d'une barrière rouge. Le renard était affamé, mais la maison était trop proche. Il continua sa route.",
    questions: [
      { q: "Quel animal le renard a-t-il vu?", reponses: ["un lapin", "une poule", "un canard"], bonne: "une poule" },
      { q: "Pourquoi le renard n'a-t-il pas attaqué?", reponses: ["la poule était trop rapide", "la maison était proche", "il n'avait pas faim"], bonne: "la maison était proche" },
      { q: "Quelle était la couleur de la barrière?", reponses: ["bleue", "verte", "rouge"], bonne: "rouge" },
    ],
    niveau: "cm1",
  },
  {
    texte: "Un jour, un jeune garçon nommé Hugo découvrit une vieille carte au grenier. La carte montrait un trésor caché près d'un rocher bleu. Hugo décida de partir en expédition avec son chien fidèle.",
    questions: [
      { q: "Quel est le nom du garçon?", reponses: ["Henry", "Hugo", "Harry"], bonne: "Hugo" },
      { q: "Où a-t-il trouvé la carte?", reponses: ["à la bibliothèque", "au grenier", "dans un magasin"], bonne: "au grenier" },
      { q: "Quelle couleur était le rocher?", reponses: ["gris", "noir", "bleu"], bonne: "bleu" },
    ],
    niveau: "cm1",
  },
  {
    texte: "La bibliothèque municipale accueille chaque jour des centaines de visiteurs. Les enfants adorent la section jeunesse avec ses histoires colorées. Les adultes apprécient le calme pour lire ou travailler.",
    questions: [
      { q: "Qui accueille la bibliothèque?", reponses: ["seulement les adultes", "seulement les enfants", "des centaines de visiteurs"], bonne: "des centaines de visiteurs" },
      { q: "Qu'y a-t-il dans la section jeunesse?", reponses: ["des ordinateurs", "des histoires colorées", "des bureaux"], bonne: "des histoires colorées" },
      { q: "Que font les adultes à la bibliothèque?", reponses: ["ils jouent", "ils lisent ou travaillent", "ils cuisinent"], bonne: "ils lisent ou travaillent" },
    ],
    niveau: "cm1",
  },
];

export function lancerLectureExpress() {
  const diff = getDifficulte();
  const niveau = getNiveauCourant();
  const niveauFiltres = {
    ce2: ["ce2"],
    cm1: ["ce2", "cm1"],
  };
  const donnees = filtrerParNiveau(TEXTES_EXPRESS, niveau, niveauFiltres);
  if (donnees.length === 0) { elQuestion.innerHTML = "<p>Pas encore de textes pour ce niveau.</p>"; return; }
  const item = donnees[Math.floor(Math.random() * donnees.length)];

  let questionIndex = 0;

  function afficherQuestion() {
    if (questionIndex >= item.questions.length) return;
    const q = item.questions[questionIndex];
    elQuestion.innerHTML = `
      <p style="background:#fff3cd;padding:0.8rem;border-radius:0.5rem;margin-bottom:1rem;font-size:0.9rem;font-style:italic;">
        "${item.texte}"
      </p>
      <p><strong>Question ${questionIndex + 1}/${item.questions.length}: ${q.q}</strong></p>
    `;

    setBonneReponse(q.reponses.indexOf(q.bonne));
    elChoix.innerHTML = "";
    q.reponses.forEach((rep, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-choix";
      btn.textContent = rep;
      btn.addEventListener("click", () => {
        apresReponse(idx, btn, q.reponses.indexOf(q.bonne));
        questionIndex++;
        if (questionIndex < item.questions.length) {
          setTimeout(afficherQuestion, 500);
        }
      });
      elChoix.appendChild(btn);
    });
  }

  elTitre.textContent = "⚡ Lecture Express";
  afficherQuestion();
}

// ── 4. HOMOPHONES AVANCÉS (3-way homophones) ───────────────────────────────
const HOMOPHONES_AVANCES = [
  // CM1
  { mot: "saut", contextes: ["faire un saut", "un saut en longueur", "saut à la corde"], groupe: ["saut", "seau", "sceau"], niveau: "cm1" },
  { mot: "pair", contextes: ["un nombre pair", "travailler de pair"], groupe: ["pair", "père", "paire"], niveau: "cm1" },
  { mot: "cour", contextes: ["la cour de l'école", "la cour royale"], groupe: ["cour", "court", "courre"], niveau: "cm1" },
  { mot: "ver", contextes: ["un ver de terre", "un vers de poésie"], groupe: ["ver", "vers", "verre"], niveau: "cm1" },
  { mot: "chair", contextes: ["la chair d'une pomme", "une pomme à chair rouge"], groupe: ["chair", "chère", "cher"], niveau: "cm1" },
  { mot: "foi", contextes: ["avoir confiance et foi", "de bonne foi"], groupe: ["foi", "foie", "fois"], niveau: "cm1" },
  { mot: "mer", contextes: ["la mer Méditerranée", "naviguer sur la mer"], groupe: ["mer", "mère", "maire"], niveau: "cm1" },
  { mot: "où", contextes: ["Où vas-tu?", "sais-tu où j'habite?"], groupe: ["où", "ou"], niveau: "cm1" },
  // CM2
  { mot: "son", contextes: ["le son d'une cloche", "son livre à lui"], groupe: ["son", "sont", "sonne"], niveau: "cm2" },
  { mot: "leur", contextes: ["c'est leur maison", "je leur parle"], groupe: ["leur", "leurs", "leurre"], niveau: "cm2" },
  { mot: "cent", contextes: ["cent personnes", "c'est magnifique!"], groupe: ["cent", "sens", "sans"], niveau: "cm2" },
  { mot: "cher", contextes: ["Mon cher ami", "C'est très cher"], groupe: ["cher", "chair", "chère"], niveau: "cm2" },
  { mot: "ce", contextes: ["ce livre est beau", "C'est mon ami"], groupe: ["ce", "se", "se"], niveau: "cm2" },
  { mot: "dé", contextes: ["jouer aux dés", "dés à coudre"], groupe: ["dé", "dès", "des"], niveau: "cm2" },
  { mot: "la", contextes: ["la première fois", "la note la"], groupe: ["la", "là", "las"], niveau: "cm2" },
];

export function lancerHomophonesAvances() {
  const diff = getDifficulte();
  const niveau = getNiveauCourant();
  const niveauFiltres = {
    cm1: ["cm1"],
    cm2: ["cm1", "cm2"],
  };
  const donnees = filtrerParNiveau(HOMOPHONES_AVANCES, niveau, niveauFiltres);
  if (donnees.length === 0) { elQuestion.innerHTML = "<p>Pas encore d'homophones pour ce niveau.</p>"; return; }
  const item = donnees[Math.floor(Math.random() * donnees.length)];
  const contexte = item.contextes[Math.floor(Math.random() * item.contextes.length)];

  elTitre.textContent = "🎯 Homophones Avancés";
  elQuestion.innerHTML = `
    <p>Complète cette phrase avec le bon homophone:</p>
    <p style="font-size:1.2rem;font-weight:700;color:var(--primaire);margin-top:0.5rem;">
      ${contexte}
    </p>
    <p style="font-size:0.9rem;color:#666;margin-top:0.5rem;">Homophones: ${item.groupe.join(" / ")}</p>
  `;

  const options = melanger(item.groupe);
  setBonneReponse(options.indexOf(item.mot));

  elChoix.innerHTML = "";
  options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-choix";
    btn.textContent = opt;
    btn.addEventListener("click", () => apresReponse(idx, btn, options.indexOf(item.mot)));
    elChoix.appendChild(btn);
  });
}

// ── 5. PONCTUATION PUZZLE (punctuation recognition) ────────────────────────
const PONCTUATION_DONNEES = [
  // CE2
  { phrase: "Bonjour comment allez-vous", correct: "Bonjour, comment allez-vous?", ponctuation: "virgule et point d'interrogation", niveau: "ce2" },
  { phrase: "Est-ce que tu viens", correct: "Est-ce que tu viens?", ponctuation: "point d'interrogation", niveau: "ce2" },
  { phrase: "Regarde le ciel bleu", correct: "Regarde le ciel bleu!", ponctuation: "point d'exclamation", niveau: "ce2" },
  { phrase: "J'aime les pommes les poires et les raisins", correct: "J'aime les pommes, les poires et les raisins.", ponctuation: "virgules et point", niveau: "ce2" },
  { phrase: "Quel est ton prénom", correct: "Quel est ton prénom?", ponctuation: "point d'interrogation", niveau: "ce2" },
  { phrase: "Au revoir mon ami", correct: "Au revoir, mon ami!", ponctuation: "virgule et point d'exclamation", niveau: "ce2" },
  // CM1
  { phrase: "Marie crie Attention", correct: "Marie crie: Attention!", ponctuation: "deux-points et point d'exclamation", niveau: "cm1" },
  { phrase: "Les fruits pommes oranges bananes", correct: "Les fruits: pommes, oranges, bananes.", ponctuation: "deux-points, virgules et point", niveau: "cm1" },
  { phrase: "Le renard rusé entra dans la maison", correct: "Le renard rusé entra dans la maison.", ponctuation: "point", niveau: "cm1" },
  { phrase: "As-tu vu mon chat noir", correct: "As-tu vu mon chat noir?", ponctuation: "point d'interrogation", niveau: "cm1" },
  { phrase: "Quelle journée formidable", correct: "Quelle journée formidable!", ponctuation: "point d'exclamation", niveau: "cm1" },
  { phrase: "Les disciplines principales sont le français l'anglais et les maths", correct: "Les disciplines principales sont: le français, l'anglais et les maths.", ponctuation: "deux-points, virgules et point", niveau: "cm1" },
  // CM2
  { phrase: "pourquoi tu ris", correct: "Pourquoi tu ris?", ponctuation: "majuscule et point d'interrogation", niveau: "cm2" },
  { phrase: "Mon ami dit Viens vite", correct: "Mon ami dit: \"Viens vite!\"", ponctuation: "guillemets, deux-points, point d'exclamation", niveau: "cm2" },
  { phrase: "J'adore les trois choses suivantes lire jouer danser", correct: "J'adore les trois choses suivantes: lire, jouer, danser.", ponctuation: "deux-points, virgules et point", niveau: "cm2" },
  { phrase: "Est-ce vraiment possible", correct: "Est-ce vraiment possible?", ponctuation: "point d'interrogation", niveau: "cm2" },
  { phrase: "Les quatre saisons sont printemps été automne hiver", correct: "Les quatre saisons sont: printemps, été, automne, hiver.", ponctuation: "deux-points et virgules", niveau: "cm2" },
];

export function lancerPonctuationPuzzle() {
  const diff = getDifficulte();
  const niveau = getNiveauCourant();
  const niveauFiltres = {
    ce2: ["ce2"],
    cm1: ["ce2", "cm1"],
    cm2: ["ce2", "cm1", "cm2"],
  };
  const donnees = filtrerParNiveau(PONCTUATION_DONNEES, niveau, niveauFiltres);
  if (donnees.length === 0) { elQuestion.innerHTML = "<p>Pas encore de ponctuation pour ce niveau.</p>"; return; }
  const item = donnees[Math.floor(Math.random() * donnees.length)];

  elTitre.textContent = "✏️ Ponctuation Puzzle";
  elQuestion.innerHTML = `
    <p>Ajoute la ponctuation correcte à cette phrase:</p>
    <p style="font-size:1.1rem;font-weight:700;color:var(--primaire);margin:1rem 0;padding:0.8rem;background:#f5f5f5;border-radius:0.5rem;">
      ${item.phrase}
    </p>
    <p style="font-size:0.85rem;color:#666;">Indice: ${item.ponctuation}</p>
  `;

  const correcteLower = item.correct.toLowerCase();
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Tape la phrase complète...";
  input.style.cssText = "width:100%;padding:0.5rem;font-size:1rem;border:2px solid var(--primaire);border-radius:0.4rem;margin-bottom:0.5rem;";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn-choix";
  btn.textContent = "✓ Vérifier";
  btn.addEventListener("click", () => {
    const reponse = input.value.trim().toLowerCase();
    const match = reponse === correcteLower;
    apresReponseTexte(match ? "correct" : "faux", btn, "correct");
  });

  elChoix.innerHTML = "";
  elChoix.appendChild(input);
  elChoix.appendChild(btn);
  input.focus();
}

// ── 6. AMIS DES MOTS (word families and rhyming) ────────────────────────────
const AMIS_DONNEES = [
  // CE1
  { famille: "pain", mots: ["panier", "boulanger", "banneau"], mot_correct: "panier", niveau: "ce1" },
  { famille: "chat", mots: ["chateau", "chaton", "chaussure"], mot_correct: "chaton", niveau: "ce1" },
  { famille: "sol", mots: ["solde", "solitaire", "solide"], mot_correct: "solide", niveau: "ce1" },
  { famille: "lait", mots: ["laiterie", "relais", "laitage"], mot_correct: "laiterie", niveau: "ce1" },
  { famille: "feu", mots: ["feuille", "feutre", "feuillade"], mot_correct: "feuille", niveau: "ce1" },
  { famille: "eau", mots: ["eauement", "eaux", "eautier"], mot_correct: "eaux", niveau: "ce1" },
  // CE2
  { famille: "dormir", mots: ["dortoir", "dorme", "dormition"], mot_correct: "dortoir", niveau: "ce2" },
  { famille: "lire", mots: ["lisible", "liraire", "lirait"], mot_correct: "lisible", niveau: "ce2" },
  { famille: "porter", mots: ["portable", "porteur", "portique"], mot_correct: "portable", niveau: "ce2" },
  { famille: "voir", mots: ["visible", "voyeur", "voiture"], mot_correct: "visible", niveau: "ce2" },
  { famille: "chant", mots: ["chanteur", "chantille", "chantage"], mot_correct: "chanteur", niveau: "ce2" },
  { famille: "marcher", mots: ["marcheur", "marche", "marchand"], mot_correct: "marcheur", niveau: "ce2" },
  // CM1
  { famille: "beauté", mots: ["beau", "beautifier", "beaucoup"], mot_correct: "beau", niveau: "cm1" },
  { famille: "liberté", mots: ["libre", "librement", "libertaire"], mot_correct: "libre", niveau: "cm1" },
  { famille: "terre", mots: ["terrasse", "terrain", "terrier"], mot_correct: "terrain", niveau: "cm1" },
  { famille: "ciel", mots: ["celestial", "cielo", "cieux"], mot_correct: "celestial", niveau: "cm1" },
  { famille: "jour", mots: ["journée", "journal", "sojourner"], mot_correct: "journée", niveau: "cm1" },
  { famille: "nuit", mots: ["nocturne", "nuitée", "minuit"], mot_correct: "nocturne", niveau: "cm1" },
  // CM2
  { famille: "vrai", mots: ["vraiment", "véracité", "vérifier"], mot_correct: "vraiment", niveau: "cm2" },
  { famille: "fort", mots: ["fortement", "forteresse", "fortun"], mot_correct: "forteresse", niveau: "cm2" },
  { famille: "jeune", mots: ["jeunesse", "rajeunir", "juvene"], mot_correct: "jeunesse", niveau: "cm2" },
  { famille: "mort", mots: ["mortalité", "mortaise", "mortifier"], mot_correct: "mortalité", niveau: "cm2" },
];

export function lancerAmisDesmots() {
  const diff = getDifficulte();
  const niveau = getNiveauCourant();
  const niveauFiltres = {
    ce1: ["ce1"],
    ce2: ["ce1", "ce2"],
    cm1: ["ce1", "ce2", "cm1"],
    cm2: ["ce1", "ce2", "cm1"],
  };
  const donnees = filtrerParNiveau(AMIS_DONNEES, niveau, niveauFiltres);
  if (donnees.length === 0) { elQuestion.innerHTML = "<p>Pas encore de mots pour ce niveau.</p>"; return; }
  const item = donnees[Math.floor(Math.random() * donnees.length)];

  elTitre.textContent = "🤝 Amis des Mots";
  elQuestion.innerHTML = `
    <p>Quel mot de la même famille que <strong>"${item.famille}"</strong>?</p>
    <p style="font-size:0.9rem;color:#666;margin-top:0.5rem;font-style:italic;">Les mots d'une famille ont une racine commune</p>
  `;

  const options = melanger(item.mots);
  setBonneReponse(options.indexOf(item.mot_correct));

  elChoix.innerHTML = "";
  options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-choix";
    btn.textContent = opt;
    btn.addEventListener("click", () => apresReponse(idx, btn, options.indexOf(item.mot_correct)));
    elChoix.appendChild(btn);
  });
}

// ── 7. COMPRÉHENSION AUDIO (audio-based listening comprehension) ────────────
const COMPREHENSION_AUDIO_DONNEES = [
  // CP
  { texte: "Bonjour, je m'appelle Sophie. J'aime jouer au football. Mon sport préféré c'est la natation. J'ai un chat noir qui s'appelle Minou.", questions: [
    { q: "Comment s'appelle la fille?", bonnes: ["Sophie"] },
    { q: "Quel est son sport préféré?", bonnes: ["natation", "la natation"] },
    { q: "Quel est le nom de son chat?", bonnes: ["Minou"] },
  ], niveau: "cp" },
  { texte: "Mon nom est Marc. Je suis en classe de CP. J'aime les dinosaures et les fusées. Ma couleur préférée est le rouge.", questions: [
    { q: "Comment s'appelle le garçon?", bonnes: ["Marc"] },
    { q: "Qu'est-ce qu'il aime?", bonnes: ["dinosaures", "fusées"] },
    { q: "Quelle est sa couleur préférée?", bonnes: ["rouge"] },
  ], niveau: "cp" },
  // CE1
  { texte: "Hier, je suis allé au zoo avec mes parents. J'ai vu des lions, des tigres et des singes. Mon animal préféré était le panda géant. Il mangeait du bambou toute la journée.", questions: [
    { q: "Où es-tu allé?", bonnes: ["au zoo", "zoo"] },
    { q: "Avec qui?", bonnes: ["mes parents", "parents"] },
    { q: "Quel était ton animal préféré?", bonnes: ["panda", "panda géant", "le panda"] },
  ], niveau: "ce1" },
  { texte: "Dimanche dernier, ma famille a pique-niqué près du lac. Nous avons mangé du fromage, du pain et des fruits. Ma petite sœur a joué avec un ballon rouge. Nous nous sommes bien amusés.", questions: [
    { q: "Où la famille a-t-elle pique-niqué?", bonnes: ["près du lac", "lac"] },
    { q: "Qu'ont-ils mangé?", bonnes: ["fromage", "pain", "fruits"] },
    { q: "Avec quoi la petite sœur jouait-elle?", bonnes: ["ballon", "ballon rouge"] },
  ], niveau: "ce1" },
  // CE2
  { texte: "Dans une petite école de montagne, les enfants apprennent à skier l'hiver. Ils étudient aussi les montagnes rocheuses et les animaux qui y vivent comme les chamois et les marmottes. Cette année, la classe va faire une excursion en raquettes.", questions: [
    { q: "Où se trouve l'école?", bonnes: ["montagne", "en montagne"] },
    { q: "Quel sport les enfants apprennent-ils?", bonnes: ["skier", "ski"] },
    { q: "Quels animaux vivent en montagne?", bonnes: ["chamois", "marmottes"] },
    { q: "Que feront les enfants cette année?", bonnes: ["excursion", "excursion en raquettes", "raquettes"] },
  ], niveau: "ce2" },
  { texte: "La bibliothèque de la ville est ouverte du lundi au samedi. Elle propose des milliers de livres, des ordinateurs et des salles de travail. Les enfants peuvent emprunter gratuitement trois livres à la fois. Beaucoup d'écoles organisent des visites guidées chaque mois.", questions: [
    { q: "Combien de livres peut-on emprunter?", bonnes: ["trois", "3"] },
    { q: "Quels jours la bibliothèque est-elle ouverte?", bonnes: ["lundi au samedi", "lundi", "samedi"] },
    { q: "Qu'y a-t-il dans la bibliothèque?", bonnes: ["livres", "ordinateurs", "salles de travail"] },
  ], niveau: "ce2" },
];

export function lancerComprehensionAudio() {
  const diff = getDifficulte();
  const niveau = getNiveauCourant();
  const donnees = COMPREHENSION_AUDIO_DONNEES.filter(c => c.niveau === niveau || (estCE1() && c.niveau === "cp"));

  if (donnees.length === 0) {
    elQuestion.innerHTML = "<p>Pas encore de compréhension audio pour ce niveau.</p>";
    return;
  }

  const item = donnees[Math.floor(Math.random() * donnees.length)];
  let questionIndex = 0;

  function afficherQuestion() {
    if (questionIndex >= item.questions.length) return;
    const q = item.questions[questionIndex];

    elTitre.textContent = "🎧 Compréhension Audio";
    elQuestion.innerHTML = `
      <p style="background:#e3f2fd;padding:0.8rem;border-radius:0.5rem;margin-bottom:1rem;font-size:0.95rem;">
        <strong>📖 Texte lu:</strong><br/>
        "${item.texte}"
      </p>
      <p><strong>Question ${questionIndex + 1}/${item.questions.length}: ${q.q}</strong></p>
    `;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Tape ta réponse...";
    input.style.cssText = "width:100%;padding:0.5rem;font-size:1rem;border:2px solid var(--primaire);border-radius:0.4rem;margin-bottom:0.5rem;";

    const bonnesLower = q.bonnes.map(b => b.toLowerCase());
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-choix";
    btn.textContent = "✓ Vérifier";
    btn.addEventListener("click", () => {
      const reponse = input.value.toLowerCase();
      const bonne = bonnesLower.some(b => reponse.split(/\s+/).some(word => word.includes(b)));
      apresReponseTexte(bonne ? "bon" : "mauvais", btn, "bon");
      questionIndex++;
      if (questionIndex < item.questions.length) {
        setTimeout(afficherQuestion, 500);
      }
    });

    elChoix.innerHTML = "";
    elChoix.appendChild(input);
    elChoix.appendChild(btn);
    input.focus();
  }

  afficherQuestion();
}
