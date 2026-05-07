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

// ── 1. VOCABULAIRE RÉSEAUX (semantic fields) ────────────────────────────────
const VOCAB_RESEAUX_DONNEES = [
  { mot: "chat", synonymes: ["félin", "minou", "greffier"], domaine: "animaux", niveau: "ce1" },
  { mot: "maison", synonymes: ["demeure", "logis", "habitation"], domaine: "lieux", niveau: "ce1" },
  { mot: "coloré", synonymes: ["vivant", "bariolé", "éclatant"], domaine: "adjectifs", niveau: "ce2" },
  { mot: "rapide", synonymes: ["véloce", "agile", "prompt"], domaine: "adjectifs", niveau: "ce2" },
  { mot: "content", synonymes: ["joyeux", "heureux", "satisfait"], domaine: "émotions", niveau: "cm1" },
  { mot: "triste", synonymes: ["mélancolique", "morose", "abattu"], domaine: "émotions", niveau: "cm1" },
  { mot: "colérique", synonymes: ["furieux", "rageur", "irascible"], domaine: "émotions", niveau: "cm2" },
  { mot: "studieux", synonymes: ["appliqué", "travailleur", "diligent"], domaine: "qualités", niveau: "cm2" },
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
  const niveaux = niveauFiltres[niveau] || ["ce1", "ce2"];
  const donnees = VOCAB_RESEAUX_DONNEES.filter(d => niveaux.includes(d.niveau));
  if (donnees.length === 0) { elQuestion.innerHTML = "<p>Pas encore de questions pour ce niveau.</p>"; return; }
  const item = donnees[Math.floor(Math.random() * donnees.length)];
  const nbChoix = 2 + diff; // 2, 3 ou 4 options

  elTitre.textContent = "🧠 Vocabulaire Réseaux";
  elQuestion.innerHTML = `
    <p>Quel mot est un synonyme de <strong>"${item.mot}"</strong> ?</p>
    <p style="font-size:0.9rem;color:#666;margin-top:0.5rem">Domaine: <em>${item.domaine}</em></p>
  `;

  const distracteurs = VOCAB_RESEAUX_DONNEES
    .filter(d => d.mot !== item.mot && niveaux.includes(d.niveau))
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
  { enonce: "Marie a 5 pommes. Elle en mange 2. Combien lui en reste-t-il ?", reponse: 3, etapes: ["5 - 2 = ?"], niveau: "ce2" },
  { enonce: "Tom a 3 billes. Son ami lui en donne 4. Combien en a-t-il maintenant ?", reponse: 7, etapes: ["3 + 4 = ?"], niveau: "ce2" },
  { enonce: "Lucie achète 2 stylos à 1€ chacun. Combien dépense-t-elle ?", reponse: 2, etapes: ["2 × 1 = ?"], niveau: "cm1" },
  { enonce: "Il y a 12 gâteaux à partager entre 3 enfants. Combien chacun en reçoit-il ?", reponse: 4, etapes: ["12 ÷ 3 = ?"], niveau: "cm1" },
  { enonce: "Papa a 20€. Il dépense 8€. Puis il gagne 5€. Combien a-t-il ?", reponse: 17, etapes: ["20 - 8 = 12", "12 + 5 = ?"], niveau: "cm2" },
];

export function lancerProblèmesProgressifs() {
  const diff = getDifficulte();
  const niveau = getNiveauCourant();
  const niveauFiltres = {
    ce2: ["ce2"],
    cm1: ["ce2", "cm1"],
    cm2: ["ce2", "cm1", "cm2"],
  };
  const niveaux = niveauFiltres[niveau] || ["ce2"];
  const donnees = PROBLEMES_DONNEES.filter(d => niveaux.includes(d.niveau));
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
    texte: "Le renard roux longeait la forêt quand il aperçut une poule. Elle picorait près d'une barrière rouge. Le renard était affamé, mais la maison était trop proche. Il continua sa route.",
    questions: [
      { q: "Quel animal le renard a-t-il vu?", reponses: ["un lapin", "une poule", "un canard"], bonne: "une poule" },
      { q: "Pourquoi le renard n'a-t-il pas attaqué?", reponses: ["la poule était trop rapide", "la maison était proche", "il n'avait pas faim"], bonne: "la maison était proche" },
      { q: "Quelle était la couleur de la barrière?", reponses: ["bleue", "verte", "rouge"], bonne: "rouge" },
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
  const niveaux = niveauFiltres[niveau] || ["ce2"];
  const donnees = TEXTES_EXPRESS.filter(t => niveaux.includes(t.niveau));
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
  { mot: "saut", contextes: ["faire un saut", "un saut en longueur", "saut à la corde"], groupe: ["saut", "seau", "sceau"], niveau: "cm1" },
  { mot: "pair", contextes: ["un nombre pair", "travailler de pair"], groupe: ["pair", "père", "paire"], niveau: "cm1" },
  { mot: "cour", contextes: ["la cour de l'école", "la cour royale"], groupe: ["cour", "court", "courre"], niveau: "cm1" },
  { mot: "son", contextes: ["le son d'une cloche", "son livre"], groupe: ["son", "sont", "sonne"], niveau: "cm2" },
  { mot: "leur", contextes: ["c'est leur maison", "je leur parle"], groupe: ["leur", "leurs", "leurre"], niveau: "cm2" },
];

export function lancerHomophonesAvances() {
  const diff = getDifficulte();
  const niveau = getNiveauCourant();
  const niveauFiltres = {
    cm1: ["cm1"],
    cm2: ["cm1", "cm2"],
  };
  const niveaux = niveauFiltres[niveau] || ["cm1"];
  const donnees = HOMOPHONES_AVANCES.filter(h => niveaux.includes(h.niveau));
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
  { phrase: "Bonjour comment allez-vous", correct: "Bonjour, comment allez-vous?", ponctuation: "virgule et point d'interrogation", niveau: "ce2" },
  { phrase: "Est-ce que tu viens", correct: "Est-ce que tu viens?", ponctuation: "point d'interrogation", niveau: "ce2" },
  { phrase: "Marie crie Attention", correct: "Marie crie: Attention!", ponctuation: "deux-points et point d'exclamation", niveau: "cm1" },
  { phrase: "Les fruits pommes oranges bananes", correct: "Les fruits: pommes, oranges, bananes.", ponctuation: "deux-points, virgules et point", niveau: "cm1" },
  { phrase: "pourquoi tu ris", correct: "Pourquoi tu ris?", ponctuation: "majuscule et point d'interrogation", niveau: "cm2" },
];

export function lancerPonctuationPuzzle() {
  const diff = getDifficulte();
  const niveau = getNiveauCourant();
  const niveauFiltres = {
    ce2: ["ce2"],
    cm1: ["ce2", "cm1"],
    cm2: ["ce2", "cm1", "cm2"],
  };
  const niveaux = niveauFiltres[niveau] || ["ce2"];
  const donnees = PONCTUATION_DONNEES.filter(p => niveaux.includes(p.niveau));
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
  { famille: "pain", mots: ["panier", "boulanger", "banneau"], mot_correct: "panier", niveau: "ce1" },
  { famille: "chat", mots: ["chateau", "chaton", "chaussure"], mot_correct: "chaton", niveau: "ce1" },
  { famille: "dormir", mots: ["dortoir", "dorme", "dormition"], mot_correct: "dortoir", niveau: "ce2" },
  { famille: "lire", mots: ["lisible", "liraire", "lirait"], mot_correct: "lisible", niveau: "ce2" },
  { famille: "beauté", mots: ["beau", "beautifier", "beaucoup"], mot_correct: "beau", niveau: "cm1" },
  { famille: "liberté", mots: ["libre", "librement", "libertaire"], mot_correct: "libre", niveau: "cm1" },
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
  const niveaux = niveauFiltres[niveau] || ["ce1"];
  const donnees = AMIS_DONNEES.filter(a => niveaux.includes(a.niveau));
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
  { texte: "Bonjour, je m'appelle Sophie. J'aime jouer au football. Mon sport préféré c'est la natation. J'ai un chat noir qui s'appelle Minou.", questions: [
    { q: "Comment s'appelle la fille?", bonnes: ["Sophie"] },
    { q: "Quel est son sport préféré?", bonnes: ["natation", "la natation"] },
    { q: "Quel est le nom de son chat?", bonnes: ["Minou"] },
  ], niveau: "cp" },
  { texte: "Hier, je suis allé au zoo avec mes parents. J'ai vu des lions, des tigres et des singes. Mon animal préféré était le panda géant. Il mangeait du bambou toute la journée.", questions: [
    { q: "Où es-tu allé?", bonnes: ["au zoo", "zoo"] },
    { q: "Avec qui?", bonnes: ["mes parents", "parents"] },
    { q: "Quel était ton animal préféré?", bonnes: ["panda", "panda géant", "le panda"] },
  ], niveau: "ce1" },
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
