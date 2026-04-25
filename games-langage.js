// games-langage.js — lancerSyllabes, lancerLecture, lancerAnglaisMots, lancerTraduction,
//                   lancerSons, lancerGrammaire

import {
  elTitre,
  elQuestion,
  elChoix,
  setBonneReponse,
  getBonneReponse,
  estCE1,
  estCE2,
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

export function lancerGrammaire() {
  elTitre.textContent = "▲ Grammaire";
  const diff = getDifficulte();

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
