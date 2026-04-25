// games-langage.js — lancerSyllabes, lancerLecture, lancerAnglaisMots, lancerTraduction,
//                   lancerSons, lancerGrammaire, lancerLecturePhrase, lancerPhraseMobile,
//                   lancerLectureTexte

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
  getDifficulte,
} from "./app-state.js";

import { apresReponse, apresReponseTexte } from "./app-nav.js";

// ── Syllabes ──────────────────────────────────────────────────────────────────
const MOTS_SYLLABES_CP = [
  { mot: "maison",  parties: ["mai", "son"] },
  { mot: "lapin",   parties: ["la", "pin"] },
  { mot: "chapeau", parties: ["cha", "peau"] },
  { mot: "robot",   parties: ["ro", "bot"] },
  { mot: "vélo",    parties: ["vé", "lo"] },
  { mot: "ballon",  parties: ["bal", "lon"] },
  { mot: "sapin",   parties: ["sa", "pin"] },
  { mot: "bateau",  parties: ["ba", "teau"] },
  { mot: "soleil",  parties: ["so", "leil"] },
  { mot: "chaton",  parties: ["cha", "ton"] },
  { mot: "mouton",  parties: ["mou", "ton"] },
  { mot: "matin",   parties: ["ma", "tin"] },
  { mot: "pomme",   parties: ["pom", "me"] },
  { mot: "nuage",   parties: ["nu", "age"] },
  { mot: "tigre",   parties: ["ti", "gre"] },
];

const MOTS_SYLLABES_CE1 = [
  { mot: "papillon",   parties: ["pa", "pil", "lon"] },
  { mot: "chocolat",   parties: ["cho", "co", "lat"] },
  { mot: "tomate",     parties: ["to", "ma", "te"] },
  { mot: "biberon",    parties: ["bi", "be", "ron"] },
  { mot: "camion",     parties: ["ca", "mi", "on"] },
  { mot: "princesse",  parties: ["prin", "ces", "se"] },
  { mot: "dinosaure",  parties: ["di", "no", "saure"] },
  { mot: "araignée",   parties: ["a", "rai", "gnée"] },
  { mot: "éléphant",   parties: ["é", "lé", "phant"] },
  { mot: "domino",     parties: ["do", "mi", "no"] },
  { mot: "girafe",     parties: ["gi", "ra", "fe"] },
  { mot: "tortue",     parties: ["tor", "tue"] },
  { mot: "ananas",     parties: ["a", "na", "nas"] },
  { mot: "carotte",    parties: ["ca", "rot", "te"] },
  { mot: "licorne",    parties: ["li", "cor", "ne"] },
];

const MOTS_SYLLABES_CE2 = [
  { mot: "bibliothèque",   parties: ["bi","blio","thèque"] },
  { mot: "anniversaire",   parties: ["an","ni","ver","saire"] },
  { mot: "médicament",     parties: ["mé","di","ca","ment"] },
  { mot: "hippopotame",    parties: ["hip","po","po","tame"] },
  { mot: "calculatrice",   parties: ["cal","cu","la","trice"] },
  { mot: "extraordinaire", parties: ["ex","tra","or","di","naire"] },
  { mot: "aquarium",       parties: ["a","qua","ri","um"] },
  { mot: "photographie",   parties: ["pho","to","gra","phie"] },
  { mot: "thermomètre",    parties: ["ther","mo","mètre"] },
  { mot: "gymnaste",       parties: ["gym","naste"] },
  { mot: "végétarien",     parties: ["vé","gé","ta","rien"] },
  { mot: "dictionnaire",   parties: ["dic","tion","naire"] },
  { mot: "élémentaire",    parties: ["é","lé","men","taire"] },
  { mot: "capitalisme",    parties: ["ca","pi","ta","lis","me"] },
  { mot: "archéologie",    parties: ["ar","ché","o","lo","gie"] },
];

export function lancerSyllabes() {
  elTitre.textContent = "📖 Syllabes";
  const liste = estCE2() ? MOTS_SYLLABES_CE2 : estCE1() ? MOTS_SYLLABES_CE1 : MOTS_SYLLABES_CP;
  const item = liste[Math.floor(Math.random() * liste.length)];
  const parties = item.parties;
  const indexCache = Math.floor(Math.random() * parties.length);
  const syllabeCachee = parties[indexCache];

  const affiche = parties.map((s, i) =>
    i === indexCache
      ? `<span style="color:var(--rose);border-bottom:3px solid var(--rose);padding:0 2px;min-width:2ch;display:inline-block">___</span>`
      : `<span>${s}</span>`
  ).join('<span style="opacity:0.4;margin:0 1px">·</span>');

  elQuestion.innerHTML =
    "<p>Quelle syllabe manque ?</p>" +
    `<p style="font-size:1.7rem;font-weight:700;color:var(--primaire);letter-spacing:0.04em;margin-top:0.5rem">${affiche}</p>`;

  const toutesListes = [...MOTS_SYLLABES_CP, ...MOTS_SYLLABES_CE1, ...MOTS_SYLLABES_CE2];
  const piscine = toutesListes.flatMap((m) => m.parties).filter((s) => s !== syllabeCachee);
  const distracteurs = melanger(piscine).slice(0, 3);
  const options = melanger([syllabeCachee, ...distracteurs]);
  setBonneReponse(options.indexOf(syllabeCachee));

  elChoix.innerHTML = "";
  options.forEach((syl, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.textContent = syl;
    b.dataset.valeur = String(idx);
    b.addEventListener("click", () => apresReponse(idx, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── Lecture ───────────────────────────────────────────────────────────────────
const MOTS_IMAGES_CP = [
  { emoji: "🐱", mot: "chat",       fausses: ["chien", "lapin", "ours"] },
  { emoji: "🐶", mot: "chien",      fausses: ["chat", "loup", "renard"] },
  { emoji: "🐰", mot: "lapin",      fausses: ["souris", "chat", "lièvre"] },
  { emoji: "🍎", mot: "pomme",      fausses: ["poire", "cerise", "orange"] },
  { emoji: "🌸", mot: "fleur",      fausses: ["arbre", "feuille", "fruit"] },
  { emoji: "🏠", mot: "maison",     fausses: ["château", "école", "garage"] },
  { emoji: "⭐", mot: "étoile",     fausses: ["lune", "soleil", "nuage"] },
  { emoji: "🌙", mot: "lune",       fausses: ["soleil", "étoile", "nuage"] },
  { emoji: "🐟", mot: "poisson",    fausses: ["requin", "crabe", "baleine"] },
  { emoji: "🚂", mot: "train",      fausses: ["bus", "avion", "bateau"] },
  { emoji: "🦁", mot: "lion",       fausses: ["tigre", "ours", "loup"] },
  { emoji: "🐸", mot: "grenouille", fausses: ["crapaud", "lézard", "serpent"] },
  { emoji: "🌈", mot: "arc-en-ciel",fausses: ["nuage", "soleil", "pluie"] },
  { emoji: "🎈", mot: "ballon",     fausses: ["bulle", "boule", "balle"] },
  { emoji: "🍓", mot: "fraise",     fausses: ["cerise", "tomate", "pomme"] },
];

const MOTS_IMAGES_CE1 = [
  { emoji: "🦋", mot: "papillon",  fausses: ["libellule", "coccinelle", "abeille"] },
  { emoji: "🐘", mot: "éléphant",  fausses: ["hippopotame", "rhinocéros", "girafe"] },
  { emoji: "🚀", mot: "fusée",     fausses: ["avion", "hélicoptère", "satellite"] },
  { emoji: "🦊", mot: "renard",    fausses: ["loup", "chacal", "coyote"] },
  { emoji: "🐊", mot: "crocodile", fausses: ["alligator", "lézard", "iguane"] },
  { emoji: "🌋", mot: "volcan",    fausses: ["montagne", "colline", "falaise"] },
  { emoji: "🐙", mot: "pieuvre",   fausses: ["méduse", "calmar", "crabe"] },
  { emoji: "🦒", mot: "girafe",    fausses: ["zèbre", "éléphant", "chameau"] },
  { emoji: "🌵", mot: "cactus",    fausses: ["palmier", "bambou", "arbuste"] },
  { emoji: "🦜", mot: "perroquet", fausses: ["toucan", "flamant", "pélican"] },
  { emoji: "🐉", mot: "dragon",    fausses: ["dinosaure", "monstre", "serpent"] },
  { emoji: "🏔️", mot: "montagne",  fausses: ["colline", "falaise", "volcan"] },
];

const MOTS_IMAGES_CE2 = [
  { emoji: "🗺️", mot: "carte",        fausses: ["boussole","atlas","globe"] },
  { emoji: "🏛️", mot: "monument",     fausses: ["château","temple","musée"] },
  { emoji: "🔭", mot: "télescope",    fausses: ["microscope","lunette","jumelle"] },
  { emoji: "🧬", mot: "biologie",     fausses: ["chimie","physique","médecine"] },
  { emoji: "⚗️", mot: "expérience",   fausses: ["mélange","réaction","chimie"] },
  { emoji: "🎭", mot: "théâtre",      fausses: ["cinéma","cirque","spectacle"] },
  { emoji: "📰", mot: "journal",      fausses: ["magazine","livre","affiche"] },
  { emoji: "🧭", mot: "boussole",     fausses: ["carte","compas","montre"] },
  { emoji: "🏗️", mot: "construction", fausses: ["bâtiment","usine","chantier"] },
  { emoji: "🎨", mot: "peinture",     fausses: ["dessin","sculpture","photographie"] },
  { emoji: "🌡️", mot: "température",  fausses: ["météo","chaleur","mesure"] },
  { emoji: "💻", mot: "ordinateur",   fausses: ["tablette","téléphone","écran"] },
];

export function lancerLecture() {
  elTitre.textContent = "📚 Lecture";
  const liste = estCE2() ? MOTS_IMAGES_CE2 : estCE1() ? MOTS_IMAGES_CE1 : MOTS_IMAGES_CP;
  const item = liste[Math.floor(Math.random() * liste.length)];

  elQuestion.innerHTML =
    "<p style='font-size:0.95rem;margin-bottom:0.25rem'>Quel mot correspond à cette image ?</p>" +
    `<span style="font-size:4.5rem;line-height:1.2;display:block">${item.emoji}</span>`;

  const fausses = melanger(item.fausses).slice(0, 3);
  const options = melanger([item.mot, ...fausses]);
  setBonneReponse(options.indexOf(item.mot));

  elChoix.innerHTML = "";
  options.forEach((mot, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.fontSize = "1rem";
    b.textContent = mot;
    b.dataset.valeur = String(idx);
    b.addEventListener("click", () => apresReponse(idx, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── Anglais mots ──────────────────────────────────────────────────────────────
const ANGLAIS_IMAGES_CP = [
  { emoji: "🐱", mot: "cat",     fausses: ["dog", "bird", "fish"] },
  { emoji: "🐶", mot: "dog",     fausses: ["cat", "cow", "pig"] },
  { emoji: "🏠", mot: "house",   fausses: ["school", "car", "tree"] },
  { emoji: "🌳", mot: "tree",    fausses: ["flower", "grass", "leaf"] },
  { emoji: "⭐", mot: "star",    fausses: ["moon", "sun", "cloud"] },
  { emoji: "🌙", mot: "moon",    fausses: ["star", "sun", "sky"] },
  { emoji: "🍎", mot: "apple",   fausses: ["orange", "banana", "pear"] },
  { emoji: "🎈", mot: "balloon", fausses: ["ball", "bubble", "kite"] },
  { emoji: "📚", mot: "book",    fausses: ["pen", "bag", "desk"] },
  { emoji: "🚗", mot: "car",     fausses: ["bus", "bike", "boat"] },
  { emoji: "🌸", mot: "flower",  fausses: ["tree", "leaf", "plant"] },
  { emoji: "🐟", mot: "fish",    fausses: ["bird", "frog", "crab"] },
  { emoji: "☀️", mot: "sun",     fausses: ["moon", "star", "cloud"] },
  { emoji: "🍰", mot: "cake",    fausses: ["pie", "bread", "sweet"] },
  { emoji: "🐸", mot: "frog",    fausses: ["fish", "snake", "duck"] },
];

const ANGLAIS_IMAGES_CE1 = [
  { emoji: "🦋", mot: "butterfly", fausses: ["dragonfly", "ladybug", "bee"] },
  { emoji: "🐘", mot: "elephant",  fausses: ["hippo", "rhino", "giraffe"] },
  { emoji: "🚀", mot: "rocket",    fausses: ["plane", "ship", "balloon"] },
  { emoji: "🌋", mot: "volcano",   fausses: ["mountain", "hill", "island"] },
  { emoji: "🦊", mot: "fox",       fausses: ["wolf", "bear", "deer"] },
  { emoji: "🌵", mot: "cactus",    fausses: ["palm", "bamboo", "bush"] },
  { emoji: "🦜", mot: "parrot",    fausses: ["eagle", "owl", "swan"] },
  { emoji: "🍕", mot: "pizza",     fausses: ["pasta", "burger", "salad"] },
  { emoji: "🌈", mot: "rainbow",   fausses: ["thunder", "storm", "cloud"] },
  { emoji: "🎸", mot: "guitar",    fausses: ["piano", "violin", "drum"] },
  { emoji: "🐙", mot: "octopus",   fausses: ["jellyfish", "squid", "crab"] },
  { emoji: "🦒", mot: "giraffe",   fausses: ["zebra", "elephant", "camel"] },
  { emoji: "👁️", mot: "eye",       fausses: ["ear", "nose", "mouth"] },
  { emoji: "👂", mot: "ear",       fausses: ["eye", "nose", "hand"] },
  { emoji: "✏️", mot: "pencil",    fausses: ["pen", "ruler", "eraser"] },
  { emoji: "📐", mot: "ruler",     fausses: ["pencil", "scissors", "book"] },
  { emoji: "🎒", mot: "backpack",  fausses: ["bag", "suitcase", "purse"] },
  { emoji: "🖍️", mot: "crayon",    fausses: ["pen", "pencil", "marker"] },
];

const ANGLAIS_IMAGES_CE2 = [
  { emoji: "🌍", mot: "world",       fausses: ["country","earth","globe"] },
  { emoji: "🏔️", mot: "mountain",    fausses: ["hill","volcano","cliff"] },
  { emoji: "🌊", mot: "ocean",       fausses: ["sea","lake","river"] },
  { emoji: "🏙️", mot: "city",        fausses: ["town","village","capital"] },
  { emoji: "✈️", mot: "airplane",    fausses: ["helicopter","rocket","balloon"] },
  { emoji: "🌿", mot: "plant",       fausses: ["tree","flower","grass"] },
  { emoji: "🔬", mot: "microscope",  fausses: ["telescope","binoculars","camera"] },
  { emoji: "📱", mot: "phone",       fausses: ["computer","tablet","screen"] },
  { emoji: "💡", mot: "light",       fausses: ["lamp","candle","fire"] },
  { emoji: "🌡️", mot: "temperature", fausses: ["weather","heat","cold"] },
  { emoji: "🚂", mot: "train",       fausses: ["metro","tram","cable car"] },
  { emoji: "🎭", mot: "theatre",     fausses: ["cinema","concert","show"] },
];

export function lancerAnglaisMots() {
  elTitre.textContent = "🇬🇧 English";
  const liste = estCE2() ? ANGLAIS_IMAGES_CE2 : estCE1() ? ANGLAIS_IMAGES_CE1 : ANGLAIS_IMAGES_CP;
  const item = liste[Math.floor(Math.random() * liste.length)];

  elQuestion.innerHTML =
    "<p style='font-size:0.95rem;margin-bottom:0.25rem'>What is this in English?</p>" +
    `<span style="font-size:4.5rem;line-height:1.2;display:block">${item.emoji}</span>`;

  const fausses = melanger(item.fausses).slice(0, 3);
  const options = melanger([item.mot, ...fausses]);
  setBonneReponse(options.indexOf(item.mot));

  elChoix.innerHTML = "";
  options.forEach((mot, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.fontSize = "1rem";
    b.textContent = mot;
    b.dataset.valeur = String(idx);
    b.addEventListener("click", () => apresReponse(idx, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── Traduction ────────────────────────────────────────────────────────────────
const TRAD_CP = [
  { fr: "chat",    en: "cat",    fausses: ["dog", "bird", "fish"] },
  { fr: "chien",   en: "dog",    fausses: ["cat", "cow", "pig"] },
  { fr: "rouge",   en: "red",    fausses: ["blue", "green", "yellow"] },
  { fr: "bleu",    en: "blue",   fausses: ["red", "green", "pink"] },
  { fr: "un",      en: "one",    fausses: ["two", "three", "four"] },
  { fr: "deux",    en: "two",    fausses: ["one", "three", "five"] },
  { fr: "grand",   en: "big",    fausses: ["small", "tall", "old"] },
  { fr: "petit",   en: "small",  fausses: ["big", "tall", "young"] },
  { fr: "maison",  en: "house",  fausses: ["school", "park", "shop"] },
  { fr: "livre",   en: "book",   fausses: ["pen", "bag", "desk"] },
  { fr: "ami",     en: "friend", fausses: ["family", "teacher", "baby"] },
  { fr: "eau",     en: "water",  fausses: ["milk", "juice", "tea"] },
  { fr: "soleil",  en: "sun",    fausses: ["moon", "star", "cloud"] },
  { fr: "pomme",   en: "apple",  fausses: ["pear", "orange", "grape"] },
  { fr: "trois",   en: "three",  fausses: ["one", "two", "four"] },
  { fr: "quatre",  en: "four",   fausses: ["two", "three", "five"] },
  { fr: "cinq",    en: "five",   fausses: ["four", "six", "seven"] },
  { fr: "jaune",   en: "yellow", fausses: ["red", "blue", "green"] },
  { fr: "vert",    en: "green",  fausses: ["yellow", "blue", "red"] },
  { fr: "table",   en: "table",  fausses: ["chair", "bed", "desk"] },
  { fr: "voiture", en: "car",    fausses: ["bus", "bike", "boat"] },
];

const TRAD_CE1 = [
  { fr: "école",    en: "school",    fausses: ["house", "park", "church"] },
  { fr: "famille",  en: "family",    fausses: ["friend", "teacher", "team"] },
  { fr: "heureux",  en: "happy",     fausses: ["sad", "angry", "tired"] },
  { fr: "rapide",   en: "fast",      fausses: ["slow", "big", "loud"] },
  { fr: "beau",     en: "beautiful", fausses: ["ugly", "strange", "plain"] },
  { fr: "manger",   en: "to eat",    fausses: ["to drink", "to sleep", "to run"] },
  { fr: "jouer",    en: "to play",   fausses: ["to eat", "to sleep", "to read"] },
  { fr: "courir",   en: "to run",    fausses: ["to jump", "to walk", "to swim"] },
  { fr: "dormir",   en: "to sleep",  fausses: ["to eat", "to run", "to dream"] },
  { fr: "pays",     en: "country",   fausses: ["city", "town", "village"] },
  { fr: "mer",      en: "sea",       fausses: ["lake", "river", "pond"] },
  { fr: "fleur",    en: "flower",    fausses: ["tree", "leaf", "grass"] },
  { fr: "tête",     en: "head",      fausses: ["hand", "foot", "arm"] },
  { fr: "main",     en: "hand",      fausses: ["foot", "arm", "finger"] },
  { fr: "pied",     en: "foot",      fausses: ["leg", "hand", "knee"] },
  { fr: "nez",      en: "nose",      fausses: ["mouth", "ear", "eye"] },
  { fr: "règle",    en: "ruler",     fausses: ["pencil", "eraser", "book"] },
  { fr: "crayon",   en: "pencil",    fausses: ["pen", "ruler", "crayon"] },
  { fr: "gomme",    en: "eraser",    fausses: ["pencil", "ruler", "pen"] },
  { fr: "orange",   en: "orange",    fausses: ["red", "purple", "pink"] },
  { fr: "violet",   en: "purple",    fausses: ["pink", "blue", "grey"] },
  { fr: "long",     en: "long",      fausses: ["short", "wide", "tall"] },
  { fr: "chaud",    en: "hot",       fausses: ["cold", "warm", "cool"] },
];

const TRAD_CE2 = [
  { fr: "courir",        en: "to run",      fausses: ["to jump","to walk","to swim"] },
  { fr: "nager",         en: "to swim",     fausses: ["to run","to fly","to dive"] },
  { fr: "chanter",       en: "to sing",     fausses: ["to dance","to play","to listen"] },
  { fr: "écrire",        en: "to write",    fausses: ["to read","to draw","to copy"] },
  { fr: "lire",          en: "to read",     fausses: ["to write","to study","to learn"] },
  { fr: "difficile",     en: "difficult",   fausses: ["easy","simple","hard"] },
  { fr: "facile",        en: "easy",        fausses: ["difficult","hard","simple"] },
  { fr: "important",     en: "important",   fausses: ["useful","necessary","serious"] },
  { fr: "différent",     en: "different",   fausses: ["similar","same","equal"] },
  { fr: "mathématiques", en: "maths",       fausses: ["science","history","art"] },
  { fr: "histoire",      en: "history",     fausses: ["geography","science","language"] },
  { fr: "géographie",    en: "geography",   fausses: ["history","science","maths"] },
  { fr: "musique",       en: "music",       fausses: ["art","dance","drama"] },
  { fr: "dessin",        en: "art",         fausses: ["music","drama","craft"] },
  { fr: "sciences",      en: "science",     fausses: ["maths","history","geography"] },
  { fr: "pays",          en: "country",     fausses: ["city","town","region"] },
  { fr: "montagne",      en: "mountain",    fausses: ["hill","volcano","cliff"] },
  { fr: "forêt",         en: "forest",      fausses: ["jungle","park","garden"] },
  { fr: "rivière",       en: "river",       fausses: ["lake","sea","stream"] },
  { fr: "magnifique",    en: "magnificent", fausses: ["beautiful","wonderful","great"] },
];

export function lancerTraduction() {
  elTitre.textContent = "🇬🇧 Traduction";
  const diff = getDifficulte();
  // At higher difficulty, draw from a larger combined pool
  let liste;
  if (estCE2()) {
    liste = diff === 0 ? TRAD_CE2.slice(0, 10) : diff === 1 ? TRAD_CE2 : [...TRAD_CE1, ...TRAD_CE2];
  } else if (estCE1()) {
    liste = diff === 0 ? TRAD_CE1.slice(0, 10) : diff === 1 ? TRAD_CE1 : [...TRAD_CE1, ...TRAD_CE2.slice(0, 8)];
  } else {
    liste = diff === 0 ? TRAD_CP.slice(0, 10) : diff === 1 ? TRAD_CP : [...TRAD_CP, ...TRAD_CE1.slice(0, 8)];
  }
  const item = liste[Math.floor(Math.random() * liste.length)];

  elQuestion.innerHTML =
    "<p style='font-size:0.9rem;margin-bottom:0.4rem'>Comment dit-on en anglais ?</p>" +
    `<p style="font-size:2.2rem;font-weight:700;color:var(--primaire);margin:0">${item.fr}</p>`;

  const fausses = melanger(item.fausses).slice(0, 3);
  const options = melanger([item.en, ...fausses]);
  setBonneReponse(options.indexOf(item.en));

  elChoix.innerHTML = "";
  options.forEach((mot, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.fontSize = "1rem";
    b.textContent = mot;
    b.dataset.valeur = String(idx);
    b.addEventListener("click", () => apresReponse(idx, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── Sons (phonétique Montessori) ──────────────────────────────────────────────
const MOTS_SONS_CP = [
  { mot: "POMME",  emoji: "🍎",  initial: "P",  final: "M" },
  { mot: "BATEAU", emoji: "⛵",  initial: "B",  final: "O" },
  { mot: "CHAT",   emoji: "🐱",  initial: "CH", final: "A" },
  { mot: "DENT",   emoji: "🦷",  initial: "D",  final: "AN" },
  { mot: "FLEUR",  emoji: "🌸",  initial: "F",  final: "EU" },
  { mot: "GIRAFE", emoji: "🦒",  initial: "G",  final: "F" },
  { mot: "HIBOU",  emoji: "🦉",  initial: "H",  final: "OU" },
  { mot: "LIVRE",  emoji: "📚",  initial: "L",  final: "R" },
  { mot: "MAISON", emoji: "🏠",  initial: "M",  final: "ON" },
  { mot: "NUAGE",  emoji: "☁️",  initial: "N",  final: "J" },
  { mot: "OISEAU", emoji: "🐦",  initial: "OI", final: "O" },
  { mot: "PLUIE",  emoji: "🌧️", initial: "P",  final: "I" },
  { mot: "RENARD", emoji: "🦊",  initial: "R",  final: "D" },
  { mot: "SOLEIL", emoji: "☀️",  initial: "S",  final: "L" },
  { mot: "TABLE",  emoji: "🪑",  initial: "T",  final: "L" },
  { mot: "VACHE",  emoji: "🐄",  initial: "V",  final: "SH" },
];

const SONS_CE1 = [
  { mot: "BOUCHE",  emoji: "👄", son: "OU", position: "milieu" },
  { mot: "LAPIN",   emoji: "🐰", son: "IN", position: "fin" },
  { mot: "BANANE",  emoji: "🍌", son: "AN", position: "milieu" },
  { mot: "CITRON",  emoji: "🍋", son: "ON", position: "fin" },
  { mot: "BLEU",    emoji: "🔵", son: "EU", position: "fin" },
  { mot: "CANARD",  emoji: "🦆", son: "AN", position: "milieu" },
  { mot: "FENÊTRE", emoji: "🪟", son: "EU", position: "milieu" },
  { mot: "JARDIN",  emoji: "🌱", son: "IN", position: "fin" },
  { mot: "MOUTON",  emoji: "🐑", son: "OU", position: "milieu" },
  { mot: "PINGOUIN",emoji: "🐧", son: "IN", position: "milieu" },
];

const SONS_CE2 = [
  { mot: "CAILLOU",   emoji: "🪨", son: "AIL",   position: "milieu" },
  { mot: "GENOU",     emoji: "🦵", son: "OU",    position: "fin" },
  { mot: "TABLEAU",   emoji: "🖼️", son: "EAU",   position: "fin" },
  { mot: "GRENOUILLE",emoji: "🐸", son: "OUIL",  position: "milieu" },
  { mot: "PAILLE",    emoji: "🌾", son: "AILLE", position: "milieu" },
  { mot: "BOUTEILLE", emoji: "🍼", son: "EILLE", position: "fin" },
  { mot: "FEUILLE",   emoji: "🍃", son: "EUIL",  position: "fin" },
  { mot: "SOLEIL",    emoji: "☀️", son: "EIL",   position: "fin" },
  { mot: "OISEAU",    emoji: "🐦", son: "EAU",   position: "fin" },
  { mot: "CHAPEAU",   emoji: "🎩", son: "EAU",   position: "fin" },
];

const POOL_SONS_CP = ["A","B","CH","D","E","F","G","H","I","J","L","M","N","O","OI","OU","P","R","S","T","V","AN","EU","SH"];
const POOL_SONS_CE1 = ["OU","IN","AN","ON","EU","AI","OI","UN","EN"];
const POOL_SONS_CE2 = ["EAU","AIL","OUIL","AILLE","EILLE","EUIL","EIL","OU","AN","IN"];

export function lancerSons() {
  elTitre.textContent = "🔤 Les sons";
  const diff = getDifficulte();

  if (estCE2()) {
    const item = SONS_CE2[Math.floor(Math.random() * SONS_CE2.length)];
    const bonne = item.son;
    setBonneReponse(bonne);
    elQuestion.innerHTML =
      `<p style="font-size:0.9rem;margin-bottom:0.3rem">Quel son entends-tu dans ce mot ?</p>` +
      `<span style="font-size:4rem;line-height:1.2;display:block">${item.emoji}</span>` +
      `<p style="font-size:1.8rem;font-weight:700;color:var(--primaire);letter-spacing:0.05em">${item.mot}</p>`;
    const distracteurs = melanger(POOL_SONS_CE2.filter(s => s !== bonne)).slice(0, 3);
    const options = melanger([bonne, ...distracteurs]);
    elChoix.innerHTML = "";
    options.forEach(son => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix"; b.style.fontSize = "1.1rem";
      b.textContent = son; b.dataset.valeur = son;
      b.addEventListener("click", () => apresReponseTexte(son, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
    return;
  }

  if (estCE1()) {
    const item = SONS_CE1[Math.floor(Math.random() * SONS_CE1.length)];
    const bonne = item.son;
    setBonneReponse(bonne);
    elQuestion.innerHTML =
      `<p style="font-size:0.9rem;margin-bottom:0.3rem">Quel son entends-tu dans ce mot ?</p>` +
      `<span style="font-size:4rem;line-height:1.2;display:block">${item.emoji}</span>` +
      `<p style="font-size:1.8rem;font-weight:700;color:var(--primaire);letter-spacing:0.05em">${item.mot}</p>`;
    const distracteurs = melanger(POOL_SONS_CE1.filter(s => s !== bonne)).slice(0, 3);
    const options = melanger([bonne, ...distracteurs]);
    elChoix.innerHTML = "";
    options.forEach(son => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix"; b.style.fontSize = "1.1rem";
      b.textContent = son; b.dataset.valeur = son;
      b.addEventListener("click", () => apresReponseTexte(son, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
    return;
  }

  // CP
  const item = MOTS_SONS_CP[Math.floor(Math.random() * MOTS_SONS_CP.length)];
  const demanderFinal = diff >= 1 && Math.random() < 0.5;
  const bonne = demanderFinal ? item.final : item.initial;
  const posLabel = demanderFinal ? "à la <strong>fin</strong>" : "au <strong>début</strong>";
  setBonneReponse(bonne);
  elQuestion.innerHTML =
    `<p style="font-size:0.9rem;margin-bottom:0.3rem">Quel son entends-tu ${posLabel} de ce mot ?</p>` +
    `<span style="font-size:4rem;line-height:1.2;display:block">${item.emoji}</span>` +
    `<p style="font-size:1.8rem;font-weight:700;color:var(--primaire);letter-spacing:0.05em">${item.mot}</p>`;
  const distracteurs = melanger(POOL_SONS_CP.filter(s => s !== bonne)).slice(0, 3);
  const options = melanger([bonne, ...distracteurs]);
  elChoix.innerHTML = "";
  options.forEach(son => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn-choix"; b.style.fontSize = "1.1rem";
    b.textContent = son; b.dataset.valeur = son;
    b.addEventListener("click", () => apresReponseTexte(son, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── Grammaire Montessori ──────────────────────────────────────────────────────
const PHRASES_GRAMMAIRE = [
  { phrase: "Le **chat** mange.", mot: "chat", nature: "nom" },
  { phrase: "La fille **court** vite.", mot: "court", nature: "verbe" },
  { phrase: "Un gros **chien** aboie.", mot: "chien", nature: "nom" },
  { phrase: "Le chat **mange** du poisson.", mot: "mange", nature: "verbe" },
  { phrase: "La **petite** souris dort.", mot: "petite", nature: "adjectif" },
  { phrase: "**Le** soleil brille.", mot: "Le", nature: "determinant" },
  { phrase: "Un **beau** jardin fleuri.", mot: "beau", nature: "adjectif" },
  { phrase: "Les enfants **jouent** dehors.", mot: "jouent", nature: "verbe" },
  { phrase: "**Une** pomme rouge tombe.", mot: "Une", nature: "determinant" },
  { phrase: "Le lapin **saute** haut.", mot: "saute", nature: "verbe" },
  { phrase: "La **grande** maison blanche.", mot: "grande", nature: "adjectif" },
  { phrase: "**Mon** renard est roux.", mot: "Mon", nature: "determinant" },
  { phrase: "Le **papillon** vole.", mot: "papillon", nature: "nom" },
  { phrase: "Les **jolis** fleurs parfumées.", mot: "jolis", nature: "adjectif" },
  { phrase: "**Ta** sœur chante bien.", mot: "Ta", nature: "determinant" },
  { phrase: "Les oiseaux **chantent** le matin.", mot: "chantent", nature: "verbe" },
  { phrase: "Une **grosse** tortue marche.", mot: "grosse", nature: "adjectif" },
  { phrase: "**L'**éléphant boit de l'eau.", mot: "L'", nature: "determinant" },
  { phrase: "Le **soleil** réchauffe la terre.", mot: "soleil", nature: "nom" },
  { phrase: "Les enfants **dessinent** des maisons.", mot: "dessinent", nature: "verbe" },
];

const NATURES_LABELS = {
  nom:         { label: "▲ Nom",         css: "grammaire-nom" },
  verbe:       { label: "● Verbe",        css: "grammaire-verbe" },
  adjectif:    { label: "▲ Adjectif",     css: "grammaire-adjectif" },
  determinant: { label: "▲ Déterminant",  css: "grammaire-determinant" },
};

const PHRASES_CM1 = [
  { phrase: "**Le chat** dort sur le canapé.", mot: "Le chat", nature: "sujet" },
  { phrase: "Les enfants **jouent** dans la cour.", mot: "jouent", nature: "verbe" },
  { phrase: "**La maîtresse** explique la leçon.", mot: "La maîtresse", nature: "sujet" },
  { phrase: "Le chien **court** très vite.", mot: "court", nature: "verbe" },
  { phrase: "**Les oiseaux** chantent dans le jardin.", mot: "Les oiseaux", nature: "sujet" },
  { phrase: "Marie **mange** une pomme rouge.", mot: "mange", nature: "verbe" },
  { phrase: "**Le soleil** réchauffe la terre.", mot: "Le soleil", nature: "sujet" },
  { phrase: "Les fleurs **poussent** au printemps.", mot: "poussent", nature: "verbe" },
];

const PHRASES_CM2 = [
  { phrase: "Je **le** mange.", mot: "le", nature: "cod" },
  { phrase: "Il **lui** parle tous les jours.", mot: "lui", nature: "coi" },
  { phrase: "Nous **les** voyons souvent.", mot: "les", nature: "cod" },
  { phrase: "Elle **leur** écrit une lettre.", mot: "leur", nature: "coi" },
  { phrase: "Tu **me** donnes ce livre.", mot: "me", nature: "cod" },
  { phrase: "Il **y** pense souvent.", mot: "y", nature: "coi" },
];

export function lancerGrammaire() {
  elTitre.textContent = "▲ Grammaire";
  const diff = getDifficulte();

  if (estCM2()) {
    const item = PHRASES_CM2[Math.floor(Math.random() * PHRASES_CM2.length)];
    const phraseHtml = item.phrase.replace(/\*\*(.+?)\*\*/g, '<strong class="mot-cible">$1</strong>');
    setBonneReponse(item.nature);
    elQuestion.innerHTML =
      `<p style="font-size:0.9rem;margin-bottom:0.5rem">Le mot en gras est-il un COD ou un COI ?</p>` +
      `<p style="font-size:1.3rem;font-weight:600;line-height:1.5">${phraseHtml}</p>`;
    elChoix.innerHTML = "";
    [
      { val: "cod", label: "COD (complément d'objet direct)" },
      { val: "coi", label: "COI (complément d'objet indirect)" },
    ].forEach(({ val, label }) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix";
      b.style.cssText = "font-size:0.85rem;text-align:left;";
      b.textContent = label; b.dataset.valeur = val;
      b.addEventListener("click", () => apresReponseTexte(val, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
    return;
  }

  if (estCM1()) {
    const item = PHRASES_CM1[Math.floor(Math.random() * PHRASES_CM1.length)];
    const phraseHtml = item.phrase.replace(/\*\*(.+?)\*\*/g, '<strong class="mot-cible">$1</strong>');
    setBonneReponse(item.nature);
    elQuestion.innerHTML =
      `<p style="font-size:0.9rem;margin-bottom:0.5rem">Le groupe en gras est-il le sujet ou le verbe ?</p>` +
      `<p style="font-size:1.3rem;font-weight:600;line-height:1.5">${phraseHtml}</p>`;
    elChoix.innerHTML = "";
    [
      { val: "sujet", label: "Sujet" },
      { val: "verbe", label: "Verbe" },
    ].forEach(({ val, label }) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn-choix";
      b.textContent = label; b.dataset.valeur = val;
      b.addEventListener("click", () => apresReponseTexte(val, b, getBonneReponse()));
      elChoix.appendChild(b);
    });
    return;
  }

  let naturesDisponibles;
  if (estCE2() || (estCE1() && diff >= 2)) {
    naturesDisponibles = ["nom", "verbe", "adjectif", "determinant"];
  } else if (estCE1() || diff >= 1) {
    naturesDisponibles = ["nom", "verbe", "adjectif"];
  } else {
    naturesDisponibles = ["nom", "verbe"];
  }

  const candidats = PHRASES_GRAMMAIRE.filter(p => naturesDisponibles.includes(p.nature));
  const item = candidats[Math.floor(Math.random() * candidats.length)];

  const phraseHtml = item.phrase.replace(/\*\*(.+?)\*\*/g, '<strong class="mot-cible">$1</strong>');
  setBonneReponse(item.nature);

  elQuestion.innerHTML =
    `<p style="font-size:0.9rem;margin-bottom:0.5rem">Quelle est la nature du mot en gras ?</p>` +
    `<p style="font-size:1.3rem;font-weight:600;line-height:1.5">${phraseHtml}</p>`;

  elChoix.innerHTML = "";
  naturesDisponibles.forEach(nature => {
    const info = NATURES_LABELS[nature];
    const b = document.createElement("button");
    b.type = "button";
    b.className = `btn-choix ${info.css}`;
    b.style.fontSize = "1rem";
    b.textContent = info.label;
    b.dataset.valeur = nature;
    b.addEventListener("click", () => apresReponseTexte(nature, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── Lecture de phrases (phrase → image) ──────────────────────────────────────
const SCENES_CP = [
  { emoji: "🐱😴", phrase: "Le chat dort.", fausses: ["Le chien mange.", "La fille court.", "Le lapin saute."] },
  { emoji: "🐶🏃", phrase: "Le chien court.", fausses: ["Le chat dort.", "La fille mange.", "Le chien saute."] },
  { emoji: "👧🍎", phrase: "La fille mange une pomme.", fausses: ["Le garçon boit.", "La fille dort.", "Le chat mange."] },
  { emoji: "☀️🌧️", phrase: "Il fait beau et chaud.", fausses: ["Il pleut beaucoup.", "Il neige dehors.", "Il fait froid."] },
  { emoji: "🐸🌿", phrase: "La grenouille saute dans l'herbe.", fausses: ["Le canard nage.", "Le lapin court.", "La grenouille dort."] },
  { emoji: "🎈🎉", phrase: "C'est une fête joyeuse.", fausses: ["Il fait froid.", "La fille pleure.", "Le chat miaule."] },
  { emoji: "📚✏️", phrase: "L'enfant lit et écrit.", fausses: ["L'enfant dort.", "Le chien joue.", "L'enfant mange."] },
  { emoji: "🚂🏔️", phrase: "Le train passe dans la montagne.", fausses: ["Le bateau navigue.", "L'avion vole.", "Le train est à l'arrêt."] },
  { emoji: "🌹🐝", phrase: "L'abeille butine la rose.", fausses: ["Le papillon vole.", "L'abeille dort.", "La fleur pousse."] },
  { emoji: "⛵🌊", phrase: "Le bateau vogue sur la mer.", fausses: ["Le train roule.", "L'oiseau vole.", "Le bateau est au port."] },
];

const SCENES_CE1 = [
  { emoji: "👦🎒🏫", phrase: "Le garçon part à l'école avec son cartable.", fausses: ["La fille rentre à la maison.", "Le garçon joue au parc.", "Le chien attend dehors."] },
  { emoji: "🌦️🌈", phrase: "Après la pluie, un arc-en-ciel apparaît.", fausses: ["Il neige toute la nuit.", "Le soleil se couche.", "Un orage éclate."] },
  { emoji: "🐦🌳🍂", phrase: "L'oiseau chante dans le grand arbre automnal.", fausses: ["Le renard dort sous l'arbre.", "La feuille tombe dans l'eau.", "L'oiseau cherche de la nourriture."] },
  { emoji: "👩‍🍳🥣🌡️", phrase: "La cuisinière prépare une soupe chaude.", fausses: ["Le boulanger fait du pain.", "La cuisinière mange une salade.", "Le cuisinier prépare un gâteau."] },
  { emoji: "🚀⭐🌙", phrase: "La fusée voyage parmi les étoiles vers la lune.", fausses: ["Le satellite tourne autour de la Terre.", "L'astronaute marche sur Mars.", "La comète traverse le ciel."] },
];

const SCENES_CE2 = [
  { emoji: "🏛️📜🗺️", phrase: "Les explorateurs ont découvert une ancienne carte du trésor.", fausses: ["Les pirates ont caché leur or.", "Les archéologues ont trouvé une momie.", "Les savants ont inventé une machine."] },
  { emoji: "🌱💧☀️", phrase: "La plante a besoin d'eau et de lumière pour grandir.", fausses: ["L'animal hiberne pendant l'hiver.", "La graine devient un arbre en cent ans.", "La fleur s'épanouit uniquement la nuit."] },
  { emoji: "🎻🎼🎭", phrase: "L'orchestre joue une symphonie devant un grand public.", fausses: ["Le chanteur répète sa chanson seul.", "Les danseurs répètent leur chorégraphie.", "Le pianiste compose une nouvelle mélodie."] },
];

export function lancerLecturePhrase() {
  elTitre.textContent = "🖼️ Lire une phrase";
  const liste = estCE2() ? SCENES_CE2 : estCE1() ? SCENES_CE1 : SCENES_CP;
  const item = liste[Math.floor(Math.random() * liste.length)];

  elQuestion.innerHTML =
    `<p style="font-size:0.9rem;margin-bottom:0.4rem">Quelle phrase correspond à cette image ?</p>` +
    `<span style="font-size:3.5rem;line-height:1.3;display:block;letter-spacing:0.05em">${item.emoji}</span>`;

  const options = melanger([item.phrase, ...item.fausses.slice(0, 3)]);
  setBonneReponse(item.phrase);
  elChoix.innerHTML = "";
  options.forEach(phrase => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.cssText = "font-size:0.85rem;text-align:left;padding:0.6rem 0.8rem;";
    b.textContent = phrase;
    b.dataset.valeur = phrase;
    b.addEventListener("click", () => apresReponseTexte(phrase, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── Phrase mobile (compléter la phrase — mot manquant) ────────────────────────
const PHRASES_TROU_CP = [
  { avant: "Le chat", trou: "mange", apres: "du poisson.", fausses: ["court", "dort", "saute"] },
  { avant: "La fille", trou: "dessine", apres: "une maison.", fausses: ["mange", "dort", "court"] },
  { avant: "Le soleil", trou: "brille", apres: "dans le ciel.", fausses: ["tombe", "mange", "court"] },
  { avant: "Le chien", trou: "aboie", apres: "très fort.", fausses: ["miaule", "chante", "dort"] },
  { avant: "Les enfants", trou: "jouent", apres: "dans le jardin.", fausses: ["dorment", "mangent", "lisent"] },
  { avant: "Le lapin", trou: "saute", apres: "dans l'herbe.", fausses: ["nage", "vole", "dort"] },
  { avant: "La petite fille", trou: "pleure", apres: "car elle est triste.", fausses: ["rit", "chante", "court"] },
  { avant: "L'oiseau", trou: "chante", apres: "sur la branche.", fausses: ["miaule", "aboie", "rugit"] },
];

const PHRASES_TROU_CE1 = [
  { avant: "Le boulanger prépare", trou: "délicieux", apres: "du pain.", fausses: ["chaud", "frais", "croustillant"] },
  { avant: "Les élèves écoutent", trou: "attentivement", apres: "la maîtresse.", fausses: ["vite", "rarement", "ensemble"] },
  { avant: "La tortue marche", trou: "lentement", apres: "dans le jardin.", fausses: ["vite", "souvent", "haut"] },
  { avant: "Le vent souffle", trou: "fortement", apres: "sur les arbres.", fausses: ["doucement", "rarement", "souvent"] },
  { avant: "Chaque matin, le coq", trou: "chante", apres: "pour réveiller la ferme.", fausses: ["dort", "mange", "court"] },
  { avant: "La rivière coule", trou: "paisiblement", apres: "dans la vallée.", fausses: ["vite", "rarement", "partout"] },
  { avant: "Les étoiles", trou: "brillent", apres: "dans la nuit noire.", fausses: ["tombent", "disparaissent", "tournent"] },
  { avant: "La bibliothèque est remplie de", trou: "livres", apres: "passionnants.", fausses: ["jeux", "jouets", "images"] },
];

const PHRASES_TROU_CE2 = [
  { avant: "Les chercheurs ont", trou: "découvert", apres: "une nouvelle espèce d'insecte.", fausses: ["inventé", "mangé", "oublié"] },
  { avant: "La cathédrale a été", trou: "construite", apres: "au Moyen Âge.", fausses: ["détruite", "peinte", "visitée"] },
  { avant: "Le photographe a", trou: "immortalisé", apres: "ce magnifique coucher de soleil.", fausses: ["raté", "regardé", "oublié"] },
  { avant: "Les astronautes", trou: "flottent", apres: "en apesanteur dans la station.", fausses: ["dorment", "marchent", "tombent"] },
  { avant: "Les abeilles", trou: "pollinisent", apres: "les fleurs en récoltant le nectar.", fausses: ["mangent", "protègent", "coupent"] },
];

export function lancerPhraseMobile() {
  elTitre.textContent = "📝 Phrase mobile";
  const liste = estCE2() ? PHRASES_TROU_CE2 : estCE1() ? PHRASES_TROU_CE1 : PHRASES_TROU_CP;
  const item = liste[Math.floor(Math.random() * liste.length)];

  setBonneReponse(item.trou);
  elQuestion.innerHTML =
    `<p style="font-size:0.9rem;margin-bottom:0.5rem">Quel mot manque dans cette phrase ?</p>` +
    `<p style="font-size:1.2rem;font-weight:600;line-height:1.6">` +
    `${item.avant} <span style="background:var(--primaire);color:white;padding:0.1em 0.5em;border-radius:0.4em">___</span> ${item.apres}` +
    `</p>`;

  const options = melanger([item.trou, ...item.fausses.slice(0, 3)]);
  elChoix.innerHTML = "";
  options.forEach(mot => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.fontSize = "1rem";
    b.textContent = mot;
    b.dataset.valeur = mot;
    b.addEventListener("click", () => apresReponseTexte(mot, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── Lecture + compréhension ───────────────────────────────────────────────────
const TEXTES_CE1 = [
  {
    texte: "Léa a un petit chat roux. Il s'appelle Caramel. Chaque soir, Caramel dort sur le lit de Léa.",
    question: "Comment s'appelle le chat de Léa ?",
    bonne: "Caramel",
    fausses: ["Foxy", "Léa", "Roux"],
  },
  {
    texte: "Tom aime beaucoup les livres. Il va à la bibliothèque tous les mercredis. Il rapporte toujours trois livres à la maison.",
    question: "Combien de livres Tom rapporte-t-il ?",
    bonne: "Trois",
    fausses: ["Un", "Deux", "Quatre"],
  },
  {
    texte: "Ce matin, il neige dans le jardin. Les enfants mettent leurs bottes et leur écharpe. Ils vont construire un bonhomme de neige.",
    question: "Que vont faire les enfants ?",
    bonne: "Un bonhomme de neige",
    fausses: ["Un château de sable", "Un gâteau", "Un dessin"],
  },
  {
    texte: "La ferme de Paul a des poules, des lapins et un cheval. Chaque matin, Paul ramasse les œufs des poules. Le cheval s'appelle Sultan.",
    question: "Comment s'appelle le cheval de Paul ?",
    bonne: "Sultan",
    fausses: ["Paul", "Poule", "Lapin"],
  },
  {
    texte: "Emma adore la peinture. Elle a des pinceaux de toutes les tailles. Hier, elle a peint un magnifique arc-en-ciel.",
    question: "Qu'a peint Emma hier ?",
    bonne: "Un arc-en-ciel",
    fausses: ["Un soleil", "Une maison", "Un chien"],
  },
];

const TEXTES_CE2 = [
  {
    texte: "Les dauphins sont des mammifères marins très intelligents. Ils communiquent entre eux grâce à des sifflements. Ils vivent en groupes appelés « bancs ».",
    question: "Comment les dauphins communiquent-ils ?",
    bonne: "Par des sifflements",
    fausses: ["Par des cris", "Par des gestes", "Par des couleurs"],
  },
  {
    texte: "Le Nil est le plus long fleuve d'Afrique. Il traverse plusieurs pays avant de se jeter dans la mer Méditerranée. Les Égyptiens anciens dépendaient de ses crues pour cultiver.",
    question: "Dans quelle mer se jette le Nil ?",
    bonne: "La mer Méditerranée",
    fausses: ["La mer Rouge", "L'océan Atlantique", "La mer Noire"],
  },
  {
    texte: "La photosynthèse permet aux plantes de fabriquer leur nourriture. Elles utilisent la lumière du soleil, l'eau et le dioxyde de carbone. En échange, elles rejettent de l'oxygène.",
    question: "Que rejettent les plantes grâce à la photosynthèse ?",
    bonne: "De l'oxygène",
    fausses: ["Du CO₂", "De l'eau", "De l'azote"],
  },
  {
    texte: "Gutenberg inventa l'imprimerie en Europe vers 1450. Cette invention permit de reproduire les livres beaucoup plus vite. Elle contribua à répandre les idées à travers le monde.",
    question: "Vers quelle année Gutenberg inventa-t-il l'imprimerie ?",
    bonne: "1450",
    fausses: ["1350", "1550", "1650"],
  },
  {
    texte: "Les abeilles jouent un rôle essentiel dans la pollinisation des fleurs. Sans elles, de nombreuses plantes ne pourraient pas se reproduire. Leur disparition menacerait l'agriculture mondiale.",
    question: "Quel rôle jouent les abeilles ?",
    bonne: "La pollinisation",
    fausses: ["La décomposition", "L'irrigation", "La photosynthèse"],
  },
];

const TEXTES_CM1 = [
  {
    texte: "Le renard est un animal sauvage très rusé. Il vit dans les forêts et les campagnes. La nuit, il chasse des lapins, des souris et des poules. Sa fourrure rousse lui permet de se cacher parmi les feuilles d'automne. Les petits renards s'appellent des renardeaux.",
    question: "Comment appelle-t-on les petits renards ?",
    bonne: "Des renardeaux",
    fausses: ["Des renards", "Des renardes", "Des renardins"],
  },
  {
    texte: "Au Moyen Âge, les chevaliers portaient une armure en métal pour se protéger au combat. Cette armure pouvait peser jusqu'à 25 kg. Les chevaliers devaient s'entraîner de nombreuses années pour manier leur épée et monter à cheval. La plupart des châteaux étaient entourés de douves remplies d'eau.",
    question: "Que peut peser une armure de chevalier ?",
    bonne: "Jusqu'à 25 kg",
    fausses: ["Jusqu'à 10 kg", "Jusqu'à 50 kg", "Jusqu'à 5 kg"],
  },
  {
    texte: "Le système solaire comprend le Soleil et huit planètes. La Terre est la troisième planète à partir du Soleil. Elle est la seule planète connue à abriter la vie. Sa surface est couverte à 71% par des océans. La Lune est le seul satellite naturel de la Terre.",
    question: "Quelle proportion de la Terre est couverte par les océans ?",
    bonne: "71%",
    fausses: ["50%", "85%", "60%"],
  },
  {
    texte: "La migration des oiseaux est un phénomène remarquable. Chaque automne, des millions d'oiseaux quittent nos régions pour passer l'hiver dans des pays plus chauds. Ils utilisent les étoiles, le Soleil et le champ magnétique terrestre pour s'orienter. Au printemps, ils reviennent pour se reproduire.",
    question: "Pourquoi les oiseaux migrent-ils en automne ?",
    bonne: "Pour passer l'hiver dans des pays plus chauds",
    fausses: ["Pour chercher de la nourriture", "Pour se reproduire", "Pour fuir les prédateurs"],
  },
  {
    texte: "La photosynthèse est le processus par lequel les plantes fabriquent leur propre nourriture. Elles utilisent la lumière solaire, le dioxyde de carbone de l'air et l'eau du sol. En retour, elles produisent de l'oxygène. C'est pourquoi les forêts sont si importantes pour notre planète.",
    question: "Que produisent les plantes grâce à la photosynthèse ?",
    bonne: "De l'oxygène",
    fausses: ["Du CO₂", "De l'eau", "Du sucre uniquement"],
  },
];

const TEXTES_CM2 = [
  {
    texte: "La démocratie est un système politique dans lequel le pouvoir appartient au peuple. Les citoyens élisent leurs représentants lors d'élections. En France, chaque citoyen de plus de 18 ans a le droit de voter. La démocratie garantit aussi des libertés fondamentales comme la liberté d'expression et la liberté de la presse.",
    question: "Quelle est l'idée principale de ce texte ?",
    bonne: "La démocratie donne le pouvoir au peuple",
    fausses: ["Les élections sont obligatoires", "La France est une dictature", "Voter est interdit avant 21 ans"],
  },
  {
    texte: "Le réchauffement climatique est causé principalement par les activités humaines. L'utilisation des énergies fossiles (pétrole, charbon, gaz) libère du dioxyde de carbone qui retient la chaleur dans l'atmosphère. Les conséquences incluent la montée du niveau des mers, des événements météorologiques extrêmes et la disparition d'espèces animales.",
    question: "Quelle est la principale cause du réchauffement climatique selon ce texte ?",
    bonne: "Les activités humaines et les énergies fossiles",
    fausses: ["Les volcans", "Le Soleil", "Les animaux"],
  },
  {
    texte: "Internet a révolutionné notre façon de communiquer et d'accéder à l'information. En quelques secondes, on peut contacter une personne à l'autre bout du monde. Cependant, il faut être vigilant : certaines informations sur Internet sont fausses. Il est important d'apprendre à vérifier les sources avant de croire ce qu'on lit.",
    question: "Quel conseil donne ce texte à propos d'Internet ?",
    bonne: "Vérifier les sources avant de croire une information",
    fausses: ["Ne jamais utiliser Internet", "Croire tout ce qu'on lit", "Internet est toujours fiable"],
  },
];

export function lancerLectureTexte() {
  elTitre.textContent = "📖 Lecture";
  const liste = estCM2() ? TEXTES_CM2 : estCM1() ? TEXTES_CM1 : estCE2() ? TEXTES_CE2 : TEXTES_CE1;
  const item = liste[Math.floor(Math.random() * liste.length)];

  setBonneReponse(item.bonne);
  elQuestion.innerHTML =
    `<div style="background:white;border-radius:0.8rem;padding:0.75rem 1rem;margin-bottom:0.6rem;font-size:0.95rem;line-height:1.6;text-align:left;box-shadow:0 2px 8px var(--ombre)">` +
    item.texte +
    `</div>` +
    `<p style="font-size:0.9rem;font-weight:700">${item.question}</p>`;

  const options = melanger([item.bonne, ...item.fausses.slice(0, 3)]);
  elChoix.innerHTML = "";
  options.forEach(rep => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.cssText = "font-size:0.85rem;text-align:left;padding:0.6rem 0.8rem;";
    b.textContent = rep;
    b.dataset.valeur = rep;
    b.addEventListener("click", () => apresReponseTexte(rep, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── lancerConjugaison ─────────────────────────────────────────────────────────
const CONJ_CM1 = [
  { phrase: "Hier, il ___ (manger) une pomme.", bonne: "a mangé",   fausses: ["mange", "mangera", "mangeait"] },
  { phrase: "Nous ___ (jouer) au foot hier.", bonne: "avons joué",   fausses: ["jouons", "jouerons", "jouions"] },
  { phrase: "Elles ___ (chanter) une chanson.", bonne: "chantent",   fausses: ["ont chanté", "chanteront", "chantaient"] },
  { phrase: "Tu ___ (finir) tes devoirs ?",  bonne: "as fini",       fausses: ["finis", "finiras", "finissais"] },
  { phrase: "Je ___ (avoir) faim maintenant.", bonne: "ai",          fausses: ["avais", "aurai", "aie"] },
  { phrase: "Il ___ (être) malade hier.",    bonne: "a été",          fausses: ["est", "sera", "était"] },
  { phrase: "Ils ___ (partir) tôt ce matin.", bonne: "sont partis",  fausses: ["partent", "partiront", "partaient"] },
  { phrase: "Vous ___ (travailler) bien.",   bonne: "travaillez",     fausses: ["avez travaillé", "travaillerez", "travailliez"] },
];

const CONJ_CM2 = [
  { phrase: "Si j'avais le temps, je ___ (voyager).", bonne: "voyagerais", fausses: ["voyage", "voyagerai", "voyageais"] },
  { phrase: "L'année prochaine, ils ___ (partir) en vacances.", bonne: "partiront", fausses: ["partent", "partaient", "partiraient"] },
  { phrase: "Quand j'___ (être) petit, j'aimais les bonbons.", bonne: "étais", fausses: ["suis", "serai", "serais"] },
  { phrase: "Si tu ___ (vouloir), tu pourrais réussir.", bonne: "voulais", fausses: ["veux", "voudras", "voudrais"] },
  { phrase: "Demain, nous ___ (finir) ce projet.", bonne: "finirons", fausses: ["finissons", "finissions", "finirions"] },
  { phrase: "Autrefois, les gens ___ (vivre) sans électricité.", bonne: "vivaient", fausses: ["vivent", "vivront", "vivraient"] },
  { phrase: "Si elle était là, elle ___ (aider) tout le monde.", bonne: "aiderait", fausses: ["aide", "aidera", "aidait"] },
  { phrase: "Vous ___ (choisir) votre métier quand vous serez grands.", bonne: "choisirez", fausses: ["choisissez", "choisiriez", "choisissiez"] },
];

export function lancerConjugaison() {
  elTitre.textContent = "✍️ Conjugaison";
  const pool = estCM2() ? CONJ_CM2 : CONJ_CM1;
  const item = pool[Math.floor(Math.random() * pool.length)];
  setBonneReponse(item.bonne);
  elQuestion.innerHTML =
    `<p style="font-size:0.9rem;margin-bottom:0.5rem">Quelle est la bonne conjugaison ?</p>` +
    `<p style="font-size:1.2rem;font-weight:600;line-height:1.6;background:white;border-radius:0.8rem;padding:0.75rem 1rem;box-shadow:0 2px 8px var(--ombre)">${item.phrase}</p>`;
  const options = melanger([item.bonne, ...item.fausses.slice(0, 3)]);
  elChoix.innerHTML = "";
  options.forEach(mot => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn-choix";
    b.style.fontSize = "1rem";
    b.textContent = mot; b.dataset.valeur = mot;
    b.addEventListener("click", () => apresReponseTexte(mot, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}
