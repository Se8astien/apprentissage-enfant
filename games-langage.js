// games-langage.js — lancerSyllabes, lancerLecture, lancerAnglaisMots, lancerTraduction

import {
  elTitre,
  elQuestion,
  elChoix,
  setBonneReponse,
  getBonneReponse,
  estCE1,
  estCE2,
  melanger,
} from "./app-state.js";

import { apresReponse } from "./app-nav.js";

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

export function lancerTraduction() {
  elTitre.textContent = "🇬🇧 Traduction";
  const liste = estCE1() ? TRAD_CE1 : TRAD_CP;
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
