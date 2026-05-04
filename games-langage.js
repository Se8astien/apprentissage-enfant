// games-langage.js — lancerSyllabes, lancerLecture, lancerAnglaisMots, lancerTraduction,
//                   lancerSons, lancerGrammaire, lancerLecturePhrase, lancerPhraseMobile,
//                   lancerLectureTexte, lancerAllemandMots, lancerTraductionAllemand,
//                   lancerEspagnolMots, lancerTraductionEspagnol

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

const PHRASES_DETECTIVE = [
  { phrase: "Les chat joue dans le jardin.", bonne: "Le chat joue dans le jardin." },
  { phrase: "Nous mangeons des pomme.", bonne: "Nous mangeons des pommes." },
  { phrase: "Il sont content de gagner.", bonne: "Ils sont contents de gagner." },
  { phrase: "Tu a fini ton exercice.", bonne: "Tu as fini ton exercice." },
  { phrase: "Les enfant lisent une histoire.", bonne: "Les enfants lisent une histoire." },
  { phrase: "Elle chantent très bien.", bonne: "Elle chante très bien." },
  { phrase: "On n'oublie pas c'est affaires.", bonne: "On n'oublie pas ses affaires." },
  { phrase: "Demain nous irons au parc avec mes ami.", bonne: "Demain nous irons au parc avec mes amis." },
  { phrase: "Le renard et malin.", bonne: "Le renard est malin." },
  { phrase: "Ces mon livre préféré.", bonne: "C'est mon livre préféré." },
];

const ATELIER_ACCORDS = [
  { phrase: "Les ___ jouent dans la cour.", bonne: "enfants", fausses: ["enfant", "enfantes", "enfan"] },
  { phrase: "La petite fille est ___ .", bonne: "contente", fausses: ["content", "contentes", "conten"] },
  { phrase: "Ils ont une maison ___ .", bonne: "bleue", fausses: ["bleu", "bleues", "bleus"] },
  { phrase: "Mes amis sont très ___ .", bonne: "gentils", fausses: ["gentil", "gentiles", "gentille"] },
  { phrase: "La voiture rouge est ___ .", bonne: "rapide", fausses: ["rapides", "rapidu", "rapid"] },
  { phrase: "Les fleurs sont ___ .", bonne: "jolies", fausses: ["jolie", "jolis", "joliees"] },
  { phrase: "Mon frère et moi sommes ___ .", bonne: "prêts", fausses: ["prêt", "prête", "prêtes"] },
  { phrase: "Cette histoire est ___ .", bonne: "intéressante", fausses: ["intéressant", "intéressants", "intéressantes"] },
];

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

export function lancerDetectiveErreurs() {
  elTitre.textContent = "🕵️ Détective des erreurs";
  const diff = getDifficulte();
  const item = PHRASES_DETECTIVE[Math.floor(Math.random() * PHRASES_DETECTIVE.length)];
  const banque = melanger(PHRASES_DETECTIVE.map((x) => x.bonne).filter((x) => x !== item.bonne));
  const fausses = banque.slice(0, diff >= 2 ? 3 : 2);
  while (fausses.length < 3) fausses.push(banque[Math.floor(Math.random() * banque.length)] || item.bonne);
  const options = melanger([item.bonne, ...fausses.slice(0, 3)]);
  setBonneReponse(item.bonne);

  elQuestion.innerHTML =
    "<p style='font-size:0.92rem;margin-bottom:0.35rem'>Trouve la phrase bien écrite :</p>" +
    `<p style="font-size:1.1rem;font-weight:700;color:var(--primaire);margin:0">${item.phrase}</p>`;

  elChoix.innerHTML = "";
  options.forEach((texte) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.fontSize = "0.95rem";
    b.textContent = texte;
    b.dataset.valeur = texte;
    b.addEventListener("click", () => apresReponseTexte(texte, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

export function lancerAtelierAccords() {
  elTitre.textContent = "🧩 Atelier des accords";
  const diff = getDifficulte();
  const pool = diff === 0 ? ATELIER_ACCORDS.slice(0, 5) : diff === 1 ? ATELIER_ACCORDS.slice(0, 7) : ATELIER_ACCORDS;
  const item = pool[Math.floor(Math.random() * pool.length)];
  const options = melanger([item.bonne, ...item.fausses.slice(0, 3)]);
  setBonneReponse(item.bonne);

  elQuestion.innerHTML =
    "<p style='font-size:0.92rem;margin-bottom:0.35rem'>Choisis le bon mot pour compléter :</p>" +
    `<p style="font-size:1.15rem;font-weight:700;color:var(--primaire);margin:0">${item.phrase}</p>`;

  elChoix.innerHTML = "";
  options.forEach((texte) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.fontSize = "1rem";
    b.textContent = texte;
    b.dataset.valeur = texte;
    b.addEventListener("click", () => apresReponseTexte(texte, b, getBonneReponse()));
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

const ANGLAIS_IMAGES_CM1 = [
  { emoji: "🔭", mot: "telescope",    fausses: ["microscope","binoculars","camera"] },
  { emoji: "🗺️", mot: "map",          fausses: ["plan","atlas","chart"] },
  { emoji: "⚡", mot: "lightning",    fausses: ["thunder","storm","electricity"] },
  { emoji: "🏛️", mot: "museum",       fausses: ["library","gallery","monument"] },
  { emoji: "🧲", mot: "magnet",       fausses: ["battery","wire","metal"] },
  { emoji: "📖", mot: "dictionary",   fausses: ["encyclopedia","grammar","textbook"] },
  { emoji: "🧪", mot: "experiment",   fausses: ["research","test","study"] },
  { emoji: "🌐", mot: "internet",     fausses: ["computer","network","website"] },
  { emoji: "🌋", mot: "volcano",      fausses: ["mountain","crater","lava"] },
  { emoji: "🧭", mot: "compass",      fausses: ["direction","north","map"] },
  { emoji: "🏗️", mot: "construction", fausses: ["building","factory","bridge"] },
  { emoji: "🦠", mot: "virus",        fausses: ["bacteria","germ","disease"] },
];

const ANGLAIS_IMAGES_CM2 = [
  { emoji: "⚖️", mot: "justice",      fausses: ["freedom","law","equality"] },
  { emoji: "🌍", mot: "environment",  fausses: ["nature","climate","planet"] },
  { emoji: "🧬", mot: "biology",      fausses: ["chemistry","physics","science"] },
  { emoji: "🏛️", mot: "civilization", fausses: ["culture","empire","society"] },
  { emoji: "📊", mot: "graph",        fausses: ["chart","table","diagram"] },
  { emoji: "🔋", mot: "energy",       fausses: ["power","force","fuel"] },
  { emoji: "🤝", mot: "cooperation",  fausses: ["agreement","alliance","friendship"] },
  { emoji: "📜", mot: "constitution", fausses: ["law","charter","treaty"] },
  { emoji: "🔬", mot: "laboratory",   fausses: ["research","science","study"] },
  { emoji: "💊", mot: "medicine",     fausses: ["drug","treatment","health"] },
  { emoji: "🌾", mot: "agriculture",  fausses: ["farming","harvest","crop"] },
  { emoji: "🌡️", mot: "climate",      fausses: ["weather","temperature","atmosphere"] },
];

export function lancerAnglaisMots() {
  elTitre.textContent = "🇬🇧 English";
  const liste = estCM2() ? ANGLAIS_IMAGES_CM2 : estCM1() ? ANGLAIS_IMAGES_CM1 : estCE2() ? ANGLAIS_IMAGES_CE2 : estCE1() ? ANGLAIS_IMAGES_CE1 : ANGLAIS_IMAGES_CP;
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

const TRAD_CM1 = [
  { fr: "gouvernement",  en: "government",  fausses: ["country","republic","state"] },
  { fr: "environnement", en: "environment", fausses: ["nature","climate","planet"] },
  { fr: "expérience",    en: "experiment",  fausses: ["research","test","study"] },
  { fr: "découverte",    en: "discovery",   fausses: ["invention","finding","research"] },
  { fr: "électricité",   en: "electricity", fausses: ["energy","power","current"] },
  { fr: "température",   en: "temperature", fausses: ["weather","heat","degree"] },
  { fr: "volcan",        en: "volcano",     fausses: ["mountain","crater","eruption"] },
  { fr: "boussole",      en: "compass",     fausses: ["direction","north","map"] },
  { fr: "construction",  en: "construction",fausses: ["building","work","project"] },
  { fr: "expédition",    en: "expedition",  fausses: ["journey","trip","voyage"] },
  { fr: "laboratoire",   en: "laboratory",  fausses: ["research","science","study"] },
  { fr: "territoire",    en: "territory",   fausses: ["land","region","area"] },
  { fr: "population",    en: "population",  fausses: ["people","society","community"] },
  { fr: "ressource",     en: "resource",    fausses: ["material","supply","asset"] },
  { fr: "catastrophe",   en: "disaster",    fausses: ["accident","crisis","emergency"] },
];

const TRAD_CM2 = [
  { fr: "civilisation",  en: "civilization",  fausses: ["culture","empire","society"] },
  { fr: "proportionnel", en: "proportional",  fausses: ["equal","similar","related"] },
  { fr: "constitution",  en: "constitution",  fausses: ["law","charter","treaty"] },
  { fr: "agriculture",   en: "agriculture",   fausses: ["farming","harvest","crop"] },
  { fr: "coopération",   en: "cooperation",   fausses: ["agreement","alliance","friendship"] },
  { fr: "biologie",      en: "biology",       fausses: ["chemistry","physics","science"] },
  { fr: "révolution",    en: "revolution",    fausses: ["rebellion","change","movement"] },
  { fr: "démocratie",    en: "democracy",     fausses: ["republic","freedom","politics"] },
  { fr: "atmosphère",    en: "atmosphere",    fausses: ["air","sky","climate"] },
  { fr: "continent",     en: "continent",     fausses: ["country","island","peninsula"] },
  { fr: "patrimoine",    en: "heritage",      fausses: ["culture","history","tradition"] },
  { fr: "électeur",      en: "voter",         fausses: ["citizen","candidate","deputy"] },
  { fr: "superficie",    en: "area",          fausses: ["surface","space","size"] },
  { fr: "reproduction",  en: "reproduction",  fausses: ["growth","evolution","biology"] },
  { fr: "photosynthèse", en: "photosynthesis",fausses: ["biology","growth","oxygen"] },
];

export function lancerTraduction() {
  elTitre.textContent = "🇬🇧 Traduction";
  const diff = getDifficulte();
  let liste;
  if (estCM2()) {
    liste = diff === 0 ? TRAD_CM2.slice(0, 10) : diff === 1 ? TRAD_CM2 : [...TRAD_CM1, ...TRAD_CM2];
  } else if (estCM1()) {
    liste = diff === 0 ? TRAD_CM1.slice(0, 10) : diff === 1 ? TRAD_CM1 : [...TRAD_CM1, ...TRAD_CM2.slice(0, 8)];
  } else if (estCE2()) {
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
const CONJ_CE1 = [
  { phrase: "Je ___ (chanter) une chanson.", bonne: "chante", fausses: ["chantes", "chantons", "chantez"] },
  { phrase: "Elle ___ (avoir) un chien.", bonne: "a", fausses: ["as", "avons", "ont"] },
  { phrase: "Nous ___ (être) fatigués.", bonne: "sommes", fausses: ["êtes", "sont", "es"] },
  { phrase: "Tu ___ (jouer) au foot.", bonne: "joues", fausses: ["joue", "jouons", "jouez"] },
  { phrase: "Ils ___ (marcher) vite.", bonne: "marchent", fausses: ["marche", "marchons", "marchez"] },
  { phrase: "Vous ___ (dessiner) bien.", bonne: "dessinez", fausses: ["dessine", "dessinons", "dessinent"] },
  { phrase: "Le chien ___ (courir) dans le jardin.", bonne: "court", fausses: ["courent", "courrons", "coures"] },
  { phrase: "Je ___ (être) content aujourd'hui.", bonne: "suis", fausses: ["es", "est", "sommes"] },
  { phrase: "Nous ___ (avoir) deux chats.", bonne: "avons", fausses: ["avez", "ont", "ai"] },
  { phrase: "Les enfants ___ (aimer) jouer dehors.", bonne: "aiment", fausses: ["aime", "aimons", "aimez"] },
];

const CONJ_CE2 = [
  { phrase: "Demain, elle ___ (partir) en voyage.", bonne: "partira", fausses: ["part", "est partie", "partait"] },
  { phrase: "Hier, nous ___ (manger) une pizza.", bonne: "avons mangé", fausses: ["mangeons", "mangerons", "mangions"] },
  { phrase: "L'année prochaine, ils ___ (visiter) Paris.", bonne: "visiteront", fausses: ["visitent", "ont visité", "visitaient"] },
  { phrase: "Ce matin, tu ___ (finir) tes devoirs.", bonne: "as fini", fausses: ["finis", "finiras", "finissais"] },
  { phrase: "Aujourd'hui, je ___ (lire) un livre.", bonne: "lis", fausses: ["lirai", "ai lu", "lisais"] },
  { phrase: "La semaine prochaine, vous ___ (venir) chez moi.", bonne: "viendrez", fausses: ["venez", "êtes venus", "veniez"] },
  { phrase: "Hier soir, il ___ (regarder) un film.", bonne: "a regardé", fausses: ["regarde", "regardera", "regardait"] },
  { phrase: "Bientôt, les oiseaux ___ (revenir) du Sud.", bonne: "reviendront", fausses: ["reviennent", "sont revenus", "revenaient"] },
  { phrase: "La semaine dernière, elles ___ (chanter) sur scène.", bonne: "ont chanté", fausses: ["chantent", "chanteront", "chantaient"] },
  { phrase: "Dans un an, je ___ (avoir) 10 ans.", bonne: "aurai", fausses: ["ai", "avais", "aie"] },
];

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
  const pool = estCM2() ? CONJ_CM2 : estCM1() ? CONJ_CM1 : estCE2() ? CONJ_CE2 : CONJ_CE1;
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

// ── lancerHomophones ──────────────────────────────────────────────────────────
const HOMOPHONES_CE2 = [
  { phrase: "Le chat ___ dormi toute la journée.", bonne: "a", fausse: "à" },
  { phrase: "Je vais ___ l'école à pied.", bonne: "à", fausse: "a" },
  { phrase: "Le ciel ___ bleu aujourd'hui.", bonne: "est", fausse: "et" },
  { phrase: "Elle mange une pomme ___ une poire.", bonne: "et", fausse: "est" },
  { phrase: "___ mange à midi dans la cantine.", bonne: "On", fausse: "Ont" },
  { phrase: "Les enfants ___ faim après l'école.", bonne: "ont", fausse: "on" },
  { phrase: "___ cartable est très lourd.", bonne: "Son", fausse: "Sont" },
  { phrase: "Les fleurs ___ très belles.", bonne: "sont", fausse: "son" },
  { phrase: "Tu préfères le chocolat ___ la vanille ?", bonne: "ou", fausse: "où" },
  { phrase: "___ habites-tu ?", bonne: "Où", fausse: "Ou" },
  { phrase: "Papa ___ acheté du pain.", bonne: "a", fausse: "à" },
  { phrase: "Il parle ___ son ami.", bonne: "à", fausse: "a" },
  { phrase: "Le chien ___ très gentil.", bonne: "est", fausse: "et" },
  { phrase: "La fille chante ___ danse.", bonne: "et", fausse: "est" },
];

const HOMOPHONES_CM1 = [
  { phrase: "___ matin, le soleil brille fort.", bonne: "Ce", fausse: "Se" },
  { phrase: "Il ___ lève très tôt chaque jour.", bonne: "se", fausse: "ce" },
  { phrase: "Pose le livre ___.", bonne: "là", fausse: "la" },
  { phrase: "___ fille est très gentille.", bonne: "La", fausse: "Là" },
  { phrase: "Je ___ vois souvent dans le parc.", bonne: "la", fausse: "là" },
  { phrase: "Reste ___, ne bouge pas !", bonne: "là", fausse: "la" },
  { phrase: "___ problème est difficile.", bonne: "Ce", fausse: "Se" },
  { phrase: "Le chat ___ cache sous le lit.", bonne: "se", fausse: "ce" },
  ...HOMOPHONES_CE2,
];

const HOMOPHONES_CM2 = [
  { phrase: "___ élèves sont très sérieux.", bonne: "Ces", fausse: "Ses" },
  { phrase: "Il range ___ affaires dans son sac.", bonne: "ses", fausse: "ces" },
  { phrase: "___ livres sont passionnants.", bonne: "Ces", fausse: "Ses" },
  { phrase: "La fille aime ___ amis.", bonne: "ses", fausse: "ces" },
  { phrase: "Ils donnent ___ avis franchement.", bonne: "leur", fausse: "leurs" },
  { phrase: "Elles rangent ___ affaires.", bonne: "leurs", fausse: "leur" },
  { phrase: "Il ___ a dit bonjour.", bonne: "leur", fausse: "leurs" },
  { phrase: "Les enfants prennent ___ goûters.", bonne: "leurs", fausse: "leur" },
  ...HOMOPHONES_CM1,
];

export function lancerHomophones() {
  elTitre.textContent = "📝 Homophones";
  const pool = estCM2() ? HOMOPHONES_CM2 : estCM1() ? HOMOPHONES_CM1 : HOMOPHONES_CE2;
  const item = pool[Math.floor(Math.random() * pool.length)];
  setBonneReponse(item.bonne);
  const phraseAff = item.phrase.replace("___",
    `<span style="background:var(--primaire);color:white;padding:0.1em 0.5em;border-radius:0.4em">___</span>`);
  elQuestion.innerHTML =
    `<p style="font-size:0.9rem;margin-bottom:0.5rem">Quel mot complète la phrase ?</p>` +
    `<p style="font-size:1.2rem;font-weight:600;line-height:1.8;background:white;border-radius:0.8rem;padding:0.75rem 1rem;box-shadow:0 2px 8px var(--ombre)">${phraseAff}</p>`;
  elChoix.innerHTML = "";
  melanger([item.bonne, item.fausse]).forEach(mot => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn-choix";
    b.style.cssText = "font-size:1.4rem;font-weight:700;min-width:5rem;";
    b.textContent = mot; b.dataset.valeur = mot;
    b.addEventListener("click", () => apresReponseTexte(mot, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

// ── lancerSynonymes ───────────────────────────────────────────────────────────
const SYNONYMES_CE1 = [
  { mot: "rapide", syn: "vite",     ant: "lent" },
  { mot: "grand",  syn: "immense",  ant: "petit" },
  { mot: "beau",   syn: "joli",     ant: "laid" },
  { mot: "content",syn: "heureux",  ant: "triste" },
  { mot: "chaud",  syn: "brûlant",  ant: "froid" },
  { mot: "fort",   syn: "puissant", ant: "faible" },
  { mot: "propre", syn: "net",      ant: "sale" },
  { mot: "vieux",  syn: "ancien",   ant: "neuf" },
];

const SYNONYMES_CE2 = [
  { mot: "courageux",  syn: "brave",     ant: "peureux" },
  { mot: "difficile",  syn: "compliqué", ant: "facile" },
  { mot: "tranquille", syn: "calme",     ant: "agité" },
  { mot: "intelligent",syn: "malin",     ant: "bête" },
  { mot: "généreux",   syn: "gentil",    ant: "avare" },
  { mot: "bizarre",    syn: "étrange",   ant: "normal" },
  { mot: "joyeux",     syn: "gai",       ant: "triste" },
  { mot: "énorme",     syn: "gigantesque",ant: "minuscule" },
];

const SYNONYMES_CM1 = [
  { mot: "minuscule",  syn: "infime",     ant: "immense" },
  { mot: "furieux",    syn: "enragé",     ant: "calme" },
  { mot: "lumineux",   syn: "brillant",   ant: "sombre" },
  { mot: "précis",     syn: "exact",      ant: "approximatif" },
  { mot: "courageux",  syn: "intrépide",  ant: "peureux" },
  { mot: "agréable",   syn: "plaisant",   ant: "désagréable" },
];

const SYNONYMES_CM2 = [
  { mot: "bénéfique",  syn: "favorable",  ant: "nuisible" },
  { mot: "abondant",   syn: "copieux",    ant: "rare" },
  { mot: "délicat",    syn: "subtil",     ant: "grossier" },
  { mot: "audacieux",  syn: "intrépide",  ant: "timide" },
  { mot: "perspicace", syn: "clairvoyant",ant: "naïf" },
];

export function lancerSynonymes() {
  elTitre.textContent = "🔁 Synonymes";
  let pool;
  if (estCM2()) pool = [...SYNONYMES_CE1, ...SYNONYMES_CE2, ...SYNONYMES_CM1, ...SYNONYMES_CM2];
  else if (estCM1()) pool = [...SYNONYMES_CE1, ...SYNONYMES_CE2, ...SYNONYMES_CM1];
  else if (estCE2()) pool = [...SYNONYMES_CE1, ...SYNONYMES_CE2];
  else pool = SYNONYMES_CE1;

  const item = pool[Math.floor(Math.random() * pool.length)];
  const demanderSynonyme = Math.random() < 0.5;
  const bonne = demanderSynonyme ? item.syn : item.ant;
  const typeLabel = demanderSynonyme ? "synonyme" : "antonyme (contraire)";
  setBonneReponse(bonne);

  elQuestion.innerHTML =
    `<p style="font-size:0.9rem;margin-bottom:0.5rem">Quel est le <strong>${typeLabel}</strong> de :</p>` +
    `<p style="font-size:2rem;font-weight:700;color:var(--primaire);margin:0.4rem 0">${item.mot}</p>`;

  const tousLesMots = pool.flatMap(p => [p.syn, p.ant]).filter(m => m !== bonne);
  const distracteurs = melanger(tousLesMots).slice(0, 3);
  const options = melanger([bonne, ...distracteurs]);
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

// ── Allemand mots ─────────────────────────────────────────────────────────────
const ALLEMAND_IMAGES_CP = [
  { emoji: "🐱", mot: "Katze",   fausses: ["Hund", "Vogel", "Fisch"] },
  { emoji: "🐶", mot: "Hund",    fausses: ["Katze", "Kuh", "Schwein"] },
  { emoji: "🏠", mot: "Haus",    fausses: ["Schule", "Auto", "Baum"] },
  { emoji: "🌳", mot: "Baum",    fausses: ["Blume", "Gras", "Blatt"] },
  { emoji: "⭐", mot: "Stern",   fausses: ["Mond", "Sonne", "Wolke"] },
  { emoji: "🌙", mot: "Mond",    fausses: ["Stern", "Sonne", "Himmel"] },
  { emoji: "🍎", mot: "Apfel",   fausses: ["Orange", "Banane", "Birne"] },
  { emoji: "🎈", mot: "Ballon",  fausses: ["Ball", "Drachen", "Seife"] },
  { emoji: "📚", mot: "Buch",    fausses: ["Stift", "Tasche", "Tisch"] },
  { emoji: "🚗", mot: "Auto",    fausses: ["Bus", "Fahrrad", "Boot"] },
  { emoji: "🌸", mot: "Blume",   fausses: ["Baum", "Blatt", "Pflanze"] },
  { emoji: "🐟", mot: "Fisch",   fausses: ["Vogel", "Frosch", "Krabbe"] },
  { emoji: "☀️", mot: "Sonne",   fausses: ["Mond", "Stern", "Wolke"] },
  { emoji: "🍰", mot: "Kuchen",  fausses: ["Brot", "Torte", "Keks"] },
  { emoji: "🐸", mot: "Frosch",  fausses: ["Fisch", "Schlange", "Ente"] },
];

const ALLEMAND_IMAGES_CE1 = [
  { emoji: "🦋", mot: "Schmetterling", fausses: ["Libelle", "Marienkäfer", "Biene"] },
  { emoji: "🐘", mot: "Elefant",       fausses: ["Nilpferd", "Nashorn", "Giraffe"] },
  { emoji: "🚀", mot: "Rakete",        fausses: ["Flugzeug", "Schiff", "Ballon"] },
  { emoji: "🌋", mot: "Vulkan",        fausses: ["Berg", "Hügel", "Insel"] },
  { emoji: "🦊", mot: "Fuchs",         fausses: ["Wolf", "Bär", "Hirsch"] },
  { emoji: "🌵", mot: "Kaktus",        fausses: ["Palme", "Bambus", "Busch"] },
  { emoji: "🦜", mot: "Papagei",       fausses: ["Adler", "Eule", "Schwan"] },
  { emoji: "🍕", mot: "Pizza",         fausses: ["Nudeln", "Burger", "Salat"] },
  { emoji: "🌈", mot: "Regenbogen",    fausses: ["Gewitter", "Sturm", "Wolke"] },
  { emoji: "🎸", mot: "Gitarre",       fausses: ["Klavier", "Geige", "Trommel"] },
  { emoji: "🐙", mot: "Tintenfisch",   fausses: ["Qualle", "Krabbe", "Krebs"] },
  { emoji: "🦒", mot: "Giraffe",       fausses: ["Zebra", "Elefant", "Kamel"] },
  { emoji: "👁️", mot: "Auge",         fausses: ["Ohr", "Nase", "Mund"] },
  { emoji: "👂", mot: "Ohr",           fausses: ["Auge", "Nase", "Hand"] },
  { emoji: "✏️", mot: "Bleistift",     fausses: ["Stift", "Lineal", "Radiergummi"] },
  { emoji: "📐", mot: "Lineal",        fausses: ["Bleistift", "Schere", "Buch"] },
  { emoji: "🎒", mot: "Rucksack",      fausses: ["Tasche", "Koffer", "Beutel"] },
];

const ALLEMAND_IMAGES_CE2 = [
  { emoji: "🌍", mot: "Welt",        fausses: ["Land", "Erde", "Globus"] },
  { emoji: "🏔️", mot: "Berg",        fausses: ["Hügel", "Vulkan", "Fels"] },
  { emoji: "🌊", mot: "Ozean",       fausses: ["Meer", "See", "Fluss"] },
  { emoji: "🏙️", mot: "Stadt",       fausses: ["Dorf", "Hauptstadt", "Gebiet"] },
  { emoji: "✈️", mot: "Flugzeug",    fausses: ["Hubschrauber", "Rakete", "Ballon"] },
  { emoji: "🌿", mot: "Pflanze",     fausses: ["Baum", "Blume", "Gras"] },
  { emoji: "🔬", mot: "Mikroskop",   fausses: ["Teleskop", "Fernglas", "Kamera"] },
  { emoji: "📱", mot: "Telefon",     fausses: ["Computer", "Tablet", "Bildschirm"] },
  { emoji: "💡", mot: "Licht",       fausses: ["Lampe", "Kerze", "Feuer"] },
  { emoji: "🚂", mot: "Zug",         fausses: ["U-Bahn", "Straßenbahn", "Taxi"] },
  { emoji: "🎭", mot: "Theater",     fausses: ["Kino", "Konzert", "Vorstellung"] },
];

const ALLEMAND_IMAGES_CM1 = [
  { emoji: "🔭", mot: "Teleskop",     fausses: ["Mikroskop", "Fernglas", "Kamera"] },
  { emoji: "🗺️", mot: "Karte",        fausses: ["Plan", "Atlas", "Diagramm"] },
  { emoji: "⚡", mot: "Blitz",        fausses: ["Donner", "Sturm", "Elektrizität"] },
  { emoji: "🏛️", mot: "Museum",       fausses: ["Bibliothek", "Galerie", "Denkmal"] },
  { emoji: "🧲", mot: "Magnet",       fausses: ["Batterie", "Draht", "Metall"] },
  { emoji: "📖", mot: "Wörterbuch",   fausses: ["Enzyklopädie", "Grammatik", "Lehrbuch"] },
  { emoji: "🧪", mot: "Experiment",   fausses: ["Forschung", "Test", "Studie"] },
  { emoji: "🌐", mot: "Internet",     fausses: ["Computer", "Netzwerk", "Webseite"] },
  { emoji: "🧭", mot: "Kompass",      fausses: ["Richtung", "Norden", "Karte"] },
  { emoji: "🏗️", mot: "Baustelle",   fausses: ["Gebäude", "Fabrik", "Brücke"] },
  { emoji: "🦠", mot: "Virus",        fausses: ["Bakterium", "Keim", "Krankheit"] },
];

const ALLEMAND_IMAGES_CM2 = [
  { emoji: "⚖️", mot: "Gerechtigkeit",  fausses: ["Freiheit", "Gesetz", "Gleichheit"] },
  { emoji: "🌍", mot: "Umwelt",         fausses: ["Natur", "Klima", "Planet"] },
  { emoji: "🧬", mot: "Biologie",       fausses: ["Chemie", "Physik", "Wissenschaft"] },
  { emoji: "🏛️", mot: "Zivilisation",   fausses: ["Kultur", "Reich", "Gesellschaft"] },
  { emoji: "📊", mot: "Diagramm",       fausses: ["Tabelle", "Grafik", "Schema"] },
  { emoji: "🔋", mot: "Energie",        fausses: ["Kraft", "Macht", "Brennstoff"] },
  { emoji: "🤝", mot: "Zusammenarbeit", fausses: ["Abkommen", "Bündnis", "Freundschaft"] },
  { emoji: "📜", mot: "Verfassung",     fausses: ["Gesetz", "Charta", "Vertrag"] },
  { emoji: "🔬", mot: "Labor",          fausses: ["Forschung", "Wissenschaft", "Studie"] },
  { emoji: "💊", mot: "Medizin",        fausses: ["Droge", "Behandlung", "Gesundheit"] },
  { emoji: "🌾", mot: "Landwirtschaft", fausses: ["Ernte", "Bauernhof", "Anbau"] },
  { emoji: "🌡️", mot: "Klima",          fausses: ["Wetter", "Temperatur", "Atmosphäre"] },
];

export function lancerAllemandMots() {
  elTitre.textContent = "🇩🇪 Deutsch";
  const liste = estCM2() ? ALLEMAND_IMAGES_CM2 : estCM1() ? ALLEMAND_IMAGES_CM1 : estCE2() ? ALLEMAND_IMAGES_CE2 : estCE1() ? ALLEMAND_IMAGES_CE1 : ALLEMAND_IMAGES_CP;
  const item = liste[Math.floor(Math.random() * liste.length)];

  elQuestion.innerHTML =
    "<p style='font-size:0.95rem;margin-bottom:0.25rem'>Was ist das auf Deutsch?</p>" +
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

// ── Traduction Français → Allemand ────────────────────────────────────────────
const TRAD_DE_CP = [
  { fr: "chat",    de: "Katze",  fausses: ["Hund", "Vogel", "Fisch"] },
  { fr: "chien",   de: "Hund",   fausses: ["Katze", "Kuh", "Schwein"] },
  { fr: "rouge",   de: "rot",    fausses: ["blau", "grün", "gelb"] },
  { fr: "bleu",    de: "blau",   fausses: ["rot", "grün", "rosa"] },
  { fr: "un",      de: "eins",   fausses: ["zwei", "drei", "vier"] },
  { fr: "deux",    de: "zwei",   fausses: ["eins", "drei", "fünf"] },
  { fr: "grand",   de: "groß",   fausses: ["klein", "lang", "alt"] },
  { fr: "petit",   de: "klein",  fausses: ["groß", "lang", "jung"] },
  { fr: "maison",  de: "Haus",   fausses: ["Schule", "Park", "Laden"] },
  { fr: "livre",   de: "Buch",   fausses: ["Stift", "Tasche", "Tisch"] },
  { fr: "ami",     de: "Freund", fausses: ["Familie", "Lehrer", "Baby"] },
  { fr: "eau",     de: "Wasser", fausses: ["Milch", "Saft", "Tee"] },
  { fr: "soleil",  de: "Sonne",  fausses: ["Mond", "Stern", "Wolke"] },
  { fr: "pomme",   de: "Apfel",  fausses: ["Birne", "Orange", "Traube"] },
  { fr: "trois",   de: "drei",   fausses: ["eins", "zwei", "vier"] },
  { fr: "voiture", de: "Auto",   fausses: ["Bus", "Fahrrad", "Boot"] },
  { fr: "jaune",   de: "gelb",   fausses: ["rot", "blau", "grün"] },
  { fr: "vert",    de: "grün",   fausses: ["gelb", "blau", "rot"] },
];

const TRAD_DE_CE1 = [
  { fr: "école",   de: "Schule",    fausses: ["Haus", "Park", "Kirche"] },
  { fr: "famille", de: "Familie",   fausses: ["Freund", "Lehrer", "Team"] },
  { fr: "heureux", de: "glücklich", fausses: ["traurig", "wütend", "müde"] },
  { fr: "rapide",  de: "schnell",   fausses: ["langsam", "groß", "laut"] },
  { fr: "beau",    de: "schön",     fausses: ["hässlich", "seltsam", "gewöhnlich"] },
  { fr: "manger",  de: "essen",     fausses: ["trinken", "schlafen", "laufen"] },
  { fr: "jouer",   de: "spielen",   fausses: ["essen", "schlafen", "lesen"] },
  { fr: "courir",  de: "laufen",    fausses: ["springen", "gehen", "schwimmen"] },
  { fr: "dormir",  de: "schlafen",  fausses: ["essen", "laufen", "träumen"] },
  { fr: "mer",     de: "Meer",      fausses: ["See", "Fluss", "Teich"] },
  { fr: "fleur",   de: "Blume",     fausses: ["Baum", "Blatt", "Gras"] },
  { fr: "tête",    de: "Kopf",      fausses: ["Hand", "Fuß", "Arm"] },
  { fr: "main",    de: "Hand",      fausses: ["Fuß", "Arm", "Finger"] },
  { fr: "pied",    de: "Fuß",       fausses: ["Bein", "Hand", "Knie"] },
  { fr: "nez",     de: "Nase",      fausses: ["Mund", "Ohr", "Auge"] },
  { fr: "crayon",  de: "Bleistift", fausses: ["Stift", "Lineal", "Radiergummi"] },
  { fr: "chaud",   de: "heiß",      fausses: ["kalt", "warm", "kühl"] },
  { fr: "froid",   de: "kalt",      fausses: ["heiß", "warm", "kühl"] },
];

const TRAD_DE_CE2 = [
  { fr: "nager",         de: "schwimmen",         fausses: ["laufen", "fliegen", "tauchen"] },
  { fr: "chanter",       de: "singen",            fausses: ["tanzen", "spielen", "hören"] },
  { fr: "écrire",        de: "schreiben",         fausses: ["lesen", "zeichnen", "kopieren"] },
  { fr: "lire",          de: "lesen",             fausses: ["schreiben", "studieren", "lernen"] },
  { fr: "difficile",     de: "schwierig",         fausses: ["einfach", "simpel", "hart"] },
  { fr: "facile",        de: "einfach",           fausses: ["schwierig", "hart", "simpel"] },
  { fr: "important",     de: "wichtig",           fausses: ["nützlich", "notwendig", "ernst"] },
  { fr: "différent",     de: "verschieden",       fausses: ["ähnlich", "gleich", "identisch"] },
  { fr: "mathématiques", de: "Mathematik",        fausses: ["Wissenschaft", "Geschichte", "Kunst"] },
  { fr: "histoire",      de: "Geschichte",        fausses: ["Geographie", "Wissenschaft", "Sprache"] },
  { fr: "géographie",    de: "Geographie",        fausses: ["Geschichte", "Wissenschaft", "Mathematik"] },
  { fr: "musique",       de: "Musik",             fausses: ["Kunst", "Tanz", "Drama"] },
  { fr: "pays",          de: "Land",              fausses: ["Stadt", "Dorf", "Region"] },
  { fr: "montagne",      de: "Berg",              fausses: ["Hügel", "Vulkan", "Fels"] },
  { fr: "forêt",         de: "Wald",              fausses: ["Dschungel", "Park", "Garten"] },
  { fr: "rivière",       de: "Fluss",             fausses: ["See", "Meer", "Bach"] },
];

const TRAD_DE_CM1 = [
  { fr: "gouvernement",  de: "Regierung",    fausses: ["Land", "Republik", "Staat"] },
  { fr: "environnement", de: "Umwelt",       fausses: ["Natur", "Klima", "Planet"] },
  { fr: "expérience",    de: "Experiment",   fausses: ["Forschung", "Test", "Studie"] },
  { fr: "découverte",    de: "Entdeckung",   fausses: ["Erfindung", "Ergebnis", "Forschung"] },
  { fr: "électricité",   de: "Elektrizität", fausses: ["Energie", "Strom", "Kraft"] },
  { fr: "température",   de: "Temperatur",   fausses: ["Wetter", "Hitze", "Grad"] },
  { fr: "volcan",        de: "Vulkan",       fausses: ["Berg", "Krater", "Ausbruch"] },
  { fr: "boussole",      de: "Kompass",      fausses: ["Richtung", "Norden", "Karte"] },
  { fr: "expédition",    de: "Expedition",   fausses: ["Reise", "Ausflug", "Tour"] },
  { fr: "laboratoire",   de: "Labor",        fausses: ["Forschung", "Wissenschaft", "Studie"] },
  { fr: "territoire",    de: "Gebiet",       fausses: ["Land", "Region", "Fläche"] },
  { fr: "population",    de: "Bevölkerung",  fausses: ["Menschen", "Gesellschaft", "Gemeinschaft"] },
  { fr: "catastrophe",   de: "Katastrophe",  fausses: ["Unfall", "Krise", "Notfall"] },
];

const TRAD_DE_CM2 = [
  { fr: "civilisation",  de: "Zivilisation",   fausses: ["Kultur", "Reich", "Gesellschaft"] },
  { fr: "constitution",  de: "Verfassung",     fausses: ["Gesetz", "Charta", "Vertrag"] },
  { fr: "agriculture",   de: "Landwirtschaft", fausses: ["Ernte", "Bauernhof", "Anbau"] },
  { fr: "coopération",   de: "Zusammenarbeit", fausses: ["Abkommen", "Bündnis", "Freundschaft"] },
  { fr: "biologie",      de: "Biologie",       fausses: ["Chemie", "Physik", "Wissenschaft"] },
  { fr: "révolution",    de: "Revolution",     fausses: ["Aufstand", "Wandel", "Bewegung"] },
  { fr: "démocratie",    de: "Demokratie",     fausses: ["Republik", "Freiheit", "Politik"] },
  { fr: "atmosphère",    de: "Atmosphäre",     fausses: ["Luft", "Himmel", "Klima"] },
  { fr: "continent",     de: "Kontinent",      fausses: ["Land", "Insel", "Halbinsel"] },
  { fr: "patrimoine",    de: "Erbe",           fausses: ["Kultur", "Geschichte", "Tradition"] },
  { fr: "photosynthèse", de: "Photosynthese",  fausses: ["Biologie", "Wachstum", "Sauerstoff"] },
  { fr: "énergie",       de: "Energie",        fausses: ["Kraft", "Strom", "Brennstoff"] },
];

export function lancerTraductionAllemand() {
  elTitre.textContent = "🇩🇪 Traduction";
  const diff = getDifficulte();
  let liste;
  if (estCM2()) {
    liste = diff === 0 ? TRAD_DE_CM2.slice(0, 8) : diff === 1 ? TRAD_DE_CM2 : [...TRAD_DE_CM1, ...TRAD_DE_CM2];
  } else if (estCM1()) {
    liste = diff === 0 ? TRAD_DE_CM1.slice(0, 8) : diff === 1 ? TRAD_DE_CM1 : [...TRAD_DE_CM1, ...TRAD_DE_CM2.slice(0, 6)];
  } else if (estCE2()) {
    liste = diff === 0 ? TRAD_DE_CE2.slice(0, 8) : diff === 1 ? TRAD_DE_CE2 : [...TRAD_DE_CE1, ...TRAD_DE_CE2];
  } else if (estCE1()) {
    liste = diff === 0 ? TRAD_DE_CE1.slice(0, 8) : diff === 1 ? TRAD_DE_CE1 : [...TRAD_DE_CE1, ...TRAD_DE_CE2.slice(0, 6)];
  } else {
    liste = diff === 0 ? TRAD_DE_CP.slice(0, 8) : diff === 1 ? TRAD_DE_CP : [...TRAD_DE_CP, ...TRAD_DE_CE1.slice(0, 6)];
  }
  const item = liste[Math.floor(Math.random() * liste.length)];

  elQuestion.innerHTML =
    "<p style='font-size:0.9rem;margin-bottom:0.4rem'>Comment dit-on en allemand ?</p>" +
    `<p style="font-size:2.2rem;font-weight:700;color:var(--primaire);margin:0">${item.fr}</p>`;

  const fausses = melanger(item.fausses).slice(0, 3);
  const options = melanger([item.de, ...fausses]);
  setBonneReponse(options.indexOf(item.de));

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

// ── Espagnol mots ─────────────────────────────────────────────────────────────
const ESPAGNOL_IMAGES_CP = [
  { emoji: "🐱", mot: "gato",     fausses: ["perro", "pájaro", "pez"] },
  { emoji: "🐶", mot: "perro",    fausses: ["gato", "vaca", "cerdo"] },
  { emoji: "🏠", mot: "casa",     fausses: ["escuela", "coche", "árbol"] },
  { emoji: "🌳", mot: "árbol",    fausses: ["flor", "hierba", "hoja"] },
  { emoji: "⭐", mot: "estrella", fausses: ["luna", "sol", "nube"] },
  { emoji: "🌙", mot: "luna",     fausses: ["estrella", "sol", "cielo"] },
  { emoji: "🍎", mot: "manzana",  fausses: ["naranja", "plátano", "pera"] },
  { emoji: "🎈", mot: "globo",    fausses: ["pelota", "cometa", "jabón"] },
  { emoji: "📚", mot: "libro",    fausses: ["lápiz", "bolsa", "mesa"] },
  { emoji: "🚗", mot: "coche",    fausses: ["autobús", "bicicleta", "barco"] },
  { emoji: "🌸", mot: "flor",     fausses: ["árbol", "hoja", "planta"] },
  { emoji: "🐟", mot: "pez",      fausses: ["pájaro", "rana", "cangrejo"] },
  { emoji: "☀️", mot: "sol",      fausses: ["luna", "estrella", "nube"] },
  { emoji: "🍰", mot: "pastel",   fausses: ["pan", "tarta", "galleta"] },
  { emoji: "🐸", mot: "rana",     fausses: ["pez", "serpiente", "pato"] },
];

const ESPAGNOL_IMAGES_CE1 = [
  { emoji: "🦋", mot: "mariposa",  fausses: ["libélula", "mariquita", "abeja"] },
  { emoji: "🐘", mot: "elefante",  fausses: ["hipopótamo", "rinoceronte", "jirafa"] },
  { emoji: "🚀", mot: "cohete",    fausses: ["avión", "barco", "globo"] },
  { emoji: "🌋", mot: "volcán",    fausses: ["montaña", "colina", "isla"] },
  { emoji: "🦊", mot: "zorro",     fausses: ["lobo", "oso", "ciervo"] },
  { emoji: "🌵", mot: "cactus",    fausses: ["palma", "bambú", "arbusto"] },
  { emoji: "🦜", mot: "loro",      fausses: ["águila", "búho", "cisne"] },
  { emoji: "🍕", mot: "pizza",     fausses: ["pasta", "hamburguesa", "ensalada"] },
  { emoji: "🌈", mot: "arcoíris",  fausses: ["tormenta", "nube", "lluvia"] },
  { emoji: "🎸", mot: "guitarra",  fausses: ["piano", "violín", "tambor"] },
  { emoji: "🐙", mot: "pulpo",     fausses: ["medusa", "cangrejo", "langosta"] },
  { emoji: "🦒", mot: "jirafa",    fausses: ["cebra", "elefante", "camello"] },
  { emoji: "👁️", mot: "ojo",       fausses: ["oreja", "nariz", "boca"] },
  { emoji: "👂", mot: "oreja",     fausses: ["ojo", "nariz", "mano"] },
  { emoji: "✏️", mot: "lápiz",    fausses: ["bolígrafo", "regla", "goma"] },
];

const ESPAGNOL_IMAGES_CE2 = [
  { emoji: "🌍", mot: "mundo",       fausses: ["país", "tierra", "globo"] },
  { emoji: "🏔️", mot: "montaña",     fausses: ["colina", "volcán", "roca"] },
  { emoji: "🌊", mot: "océano",      fausses: ["mar", "lago", "río"] },
  { emoji: "🏙️", mot: "ciudad",      fausses: ["pueblo", "capital", "región"] },
  { emoji: "✈️", mot: "avión",       fausses: ["helicóptero", "cohete", "globo"] },
  { emoji: "🌿", mot: "planta",      fausses: ["árbol", "flor", "hierba"] },
  { emoji: "🔬", mot: "microscopio", fausses: ["telescopio", "prismático", "cámara"] },
  { emoji: "📱", mot: "teléfono",    fausses: ["ordenador", "tableta", "pantalla"] },
  { emoji: "💡", mot: "luz",         fausses: ["lámpara", "vela", "fuego"] },
  { emoji: "🚂", mot: "tren",        fausses: ["metro", "tranvía", "taxi"] },
  { emoji: "🎭", mot: "teatro",      fausses: ["cine", "concierto", "espectáculo"] },
];

const ESPAGNOL_IMAGES_CM1 = [
  { emoji: "🔭", mot: "telescopio",  fausses: ["microscopio", "prismático", "cámara"] },
  { emoji: "🗺️", mot: "mapa",        fausses: ["plano", "atlas", "diagrama"] },
  { emoji: "⚡", mot: "rayo",        fausses: ["trueno", "tormenta", "electricidad"] },
  { emoji: "🏛️", mot: "museo",       fausses: ["biblioteca", "galería", "monumento"] },
  { emoji: "🧲", mot: "imán",        fausses: ["batería", "cable", "metal"] },
  { emoji: "📖", mot: "diccionario", fausses: ["enciclopedia", "gramática", "libro"] },
  { emoji: "🧪", mot: "experimento", fausses: ["investigación", "prueba", "estudio"] },
  { emoji: "🌐", mot: "internet",    fausses: ["ordenador", "red", "página web"] },
  { emoji: "🧭", mot: "brújula",     fausses: ["dirección", "norte", "mapa"] },
  { emoji: "🦠", mot: "virus",       fausses: ["bacteria", "germen", "enfermedad"] },
];

const ESPAGNOL_IMAGES_CM2 = [
  { emoji: "⚖️", mot: "justicia",      fausses: ["libertad", "ley", "igualdad"] },
  { emoji: "🌍", mot: "medio ambiente",fausses: ["naturaleza", "clima", "planeta"] },
  { emoji: "🧬", mot: "biología",      fausses: ["química", "física", "ciencia"] },
  { emoji: "🏛️", mot: "civilización",  fausses: ["cultura", "imperio", "sociedad"] },
  { emoji: "📊", mot: "diagrama",      fausses: ["tabla", "gráfico", "esquema"] },
  { emoji: "🔋", mot: "energía",       fausses: ["fuerza", "poder", "combustible"] },
  { emoji: "🤝", mot: "cooperación",   fausses: ["acuerdo", "alianza", "amistad"] },
  { emoji: "📜", mot: "constitución",  fausses: ["ley", "carta", "tratado"] },
  { emoji: "🔬", mot: "laboratorio",   fausses: ["investigación", "ciencia", "estudio"] },
  { emoji: "💊", mot: "medicina",      fausses: ["droga", "tratamiento", "salud"] },
  { emoji: "🌾", mot: "agricultura",   fausses: ["cosecha", "granja", "cultivo"] },
  { emoji: "🌡️", mot: "clima",         fausses: ["tiempo", "temperatura", "atmósfera"] },
];

export function lancerEspagnolMots() {
  elTitre.textContent = "🇪🇸 Español";
  const liste = estCM2() ? ESPAGNOL_IMAGES_CM2 : estCM1() ? ESPAGNOL_IMAGES_CM1 : estCE2() ? ESPAGNOL_IMAGES_CE2 : estCE1() ? ESPAGNOL_IMAGES_CE1 : ESPAGNOL_IMAGES_CP;
  const item = liste[Math.floor(Math.random() * liste.length)];

  elQuestion.innerHTML =
    "<p style='font-size:0.95rem;margin-bottom:0.25rem'>¿Cómo se dice en español?</p>" +
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

// ── Traduction Français → Espagnol ────────────────────────────────────────────
const TRAD_ES_CP = [
  { fr: "chat",    es: "gato",     fausses: ["perro", "pájaro", "pez"] },
  { fr: "chien",   es: "perro",    fausses: ["gato", "vaca", "cerdo"] },
  { fr: "rouge",   es: "rojo",     fausses: ["azul", "verde", "amarillo"] },
  { fr: "bleu",    es: "azul",     fausses: ["rojo", "verde", "rosa"] },
  { fr: "un",      es: "uno",      fausses: ["dos", "tres", "cuatro"] },
  { fr: "deux",    es: "dos",      fausses: ["uno", "tres", "cinco"] },
  { fr: "grand",   es: "grande",   fausses: ["pequeño", "largo", "viejo"] },
  { fr: "petit",   es: "pequeño",  fausses: ["grande", "largo", "joven"] },
  { fr: "maison",  es: "casa",     fausses: ["escuela", "parque", "tienda"] },
  { fr: "livre",   es: "libro",    fausses: ["lápiz", "bolsa", "mesa"] },
  { fr: "ami",     es: "amigo",    fausses: ["familia", "profesor", "bebé"] },
  { fr: "eau",     es: "agua",     fausses: ["leche", "zumo", "té"] },
  { fr: "soleil",  es: "sol",      fausses: ["luna", "estrella", "nube"] },
  { fr: "pomme",   es: "manzana",  fausses: ["pera", "naranja", "uva"] },
  { fr: "trois",   es: "tres",     fausses: ["uno", "dos", "cuatro"] },
  { fr: "voiture", es: "coche",    fausses: ["autobús", "bicicleta", "barco"] },
  { fr: "jaune",   es: "amarillo", fausses: ["rojo", "azul", "verde"] },
  { fr: "vert",    es: "verde",    fausses: ["amarillo", "azul", "rojo"] },
];

const TRAD_ES_CE1 = [
  { fr: "école",   es: "escuela",  fausses: ["casa", "parque", "iglesia"] },
  { fr: "famille", es: "familia",  fausses: ["amigo", "profesor", "equipo"] },
  { fr: "heureux", es: "feliz",    fausses: ["triste", "enfadado", "cansado"] },
  { fr: "rapide",  es: "rápido",   fausses: ["lento", "grande", "fuerte"] },
  { fr: "beau",    es: "bonito",   fausses: ["feo", "raro", "normal"] },
  { fr: "manger",  es: "comer",    fausses: ["beber", "dormir", "correr"] },
  { fr: "jouer",   es: "jugar",    fausses: ["comer", "dormir", "leer"] },
  { fr: "courir",  es: "correr",   fausses: ["saltar", "caminar", "nadar"] },
  { fr: "dormir",  es: "dormir",   fausses: ["comer", "correr", "soñar"] },
  { fr: "mer",     es: "mar",      fausses: ["lago", "río", "estanque"] },
  { fr: "fleur",   es: "flor",     fausses: ["árbol", "hoja", "hierba"] },
  { fr: "tête",    es: "cabeza",   fausses: ["mano", "pie", "brazo"] },
  { fr: "main",    es: "mano",     fausses: ["pie", "brazo", "dedo"] },
  { fr: "pied",    es: "pie",      fausses: ["pierna", "mano", "rodilla"] },
  { fr: "nez",     es: "nariz",    fausses: ["boca", "oreja", "ojo"] },
  { fr: "crayon",  es: "lápiz",   fausses: ["bolígrafo", "regla", "goma"] },
  { fr: "chaud",   es: "caliente", fausses: ["frío", "tibio", "fresco"] },
  { fr: "froid",   es: "frío",     fausses: ["caliente", "tibio", "fresco"] },
];

const TRAD_ES_CE2 = [
  { fr: "nager",         es: "nadar",        fausses: ["correr", "volar", "bucear"] },
  { fr: "chanter",       es: "cantar",       fausses: ["bailar", "jugar", "escuchar"] },
  { fr: "écrire",        es: "escribir",     fausses: ["leer", "dibujar", "copiar"] },
  { fr: "lire",          es: "leer",         fausses: ["escribir", "estudiar", "aprender"] },
  { fr: "difficile",     es: "difícil",      fausses: ["fácil", "simple", "duro"] },
  { fr: "facile",        es: "fácil",        fausses: ["difícil", "duro", "simple"] },
  { fr: "important",     es: "importante",   fausses: ["útil", "necesario", "serio"] },
  { fr: "différent",     es: "diferente",    fausses: ["similar", "igual", "idéntico"] },
  { fr: "mathématiques", es: "matemáticas",  fausses: ["ciencia", "historia", "arte"] },
  { fr: "histoire",      es: "historia",     fausses: ["geografía", "ciencia", "lengua"] },
  { fr: "géographie",    es: "geografía",    fausses: ["historia", "ciencia", "matemáticas"] },
  { fr: "musique",       es: "música",       fausses: ["arte", "danza", "teatro"] },
  { fr: "pays",          es: "país",         fausses: ["ciudad", "pueblo", "región"] },
  { fr: "montagne",      es: "montaña",      fausses: ["colina", "volcán", "roca"] },
  { fr: "forêt",         es: "bosque",       fausses: ["selva", "parque", "jardín"] },
  { fr: "rivière",       es: "río",          fausses: ["lago", "mar", "arroyo"] },
];

const TRAD_ES_CM1 = [
  { fr: "gouvernement",  es: "gobierno",       fausses: ["país", "república", "estado"] },
  { fr: "environnement", es: "medio ambiente", fausses: ["naturaleza", "clima", "planeta"] },
  { fr: "expérience",    es: "experimento",    fausses: ["investigación", "prueba", "estudio"] },
  { fr: "découverte",    es: "descubrimiento", fausses: ["invención", "resultado", "investigación"] },
  { fr: "électricité",   es: "electricidad",   fausses: ["energía", "corriente", "fuerza"] },
  { fr: "température",   es: "temperatura",    fausses: ["tiempo", "calor", "grado"] },
  { fr: "volcan",        es: "volcán",         fausses: ["montaña", "cráter", "erupción"] },
  { fr: "boussole",      es: "brújula",        fausses: ["dirección", "norte", "mapa"] },
  { fr: "expédition",    es: "expedición",     fausses: ["viaje", "excursión", "tour"] },
  { fr: "laboratoire",   es: "laboratorio",    fausses: ["investigación", "ciencia", "estudio"] },
  { fr: "territoire",    es: "territorio",     fausses: ["país", "región", "área"] },
  { fr: "population",    es: "población",      fausses: ["gente", "sociedad", "comunidad"] },
  { fr: "catastrophe",   es: "catástrofe",     fausses: ["accidente", "crisis", "emergencia"] },
];

const TRAD_ES_CM2 = [
  { fr: "civilisation",  es: "civilización",  fausses: ["cultura", "imperio", "sociedad"] },
  { fr: "constitution",  es: "constitución",  fausses: ["ley", "carta", "tratado"] },
  { fr: "agriculture",   es: "agricultura",   fausses: ["cosecha", "granja", "cultivo"] },
  { fr: "coopération",   es: "cooperación",   fausses: ["acuerdo", "alianza", "amistad"] },
  { fr: "biologie",      es: "biología",      fausses: ["química", "física", "ciencia"] },
  { fr: "révolution",    es: "revolución",    fausses: ["levantamiento", "cambio", "movimiento"] },
  { fr: "démocratie",    es: "democracia",    fausses: ["república", "libertad", "política"] },
  { fr: "atmosphère",    es: "atmósfera",     fausses: ["aire", "cielo", "clima"] },
  { fr: "continent",     es: "continente",    fausses: ["país", "isla", "península"] },
  { fr: "patrimoine",    es: "patrimonio",    fausses: ["cultura", "historia", "tradición"] },
  { fr: "photosynthèse", es: "fotosíntesis",  fausses: ["biología", "crecimiento", "oxígeno"] },
  { fr: "énergie",       es: "energía",       fausses: ["fuerza", "corriente", "combustible"] },
];

export function lancerTraductionEspagnol() {
  elTitre.textContent = "🇪🇸 Traduction";
  const diff = getDifficulte();
  let liste;
  if (estCM2()) {
    liste = diff === 0 ? TRAD_ES_CM2.slice(0, 8) : diff === 1 ? TRAD_ES_CM2 : [...TRAD_ES_CM1, ...TRAD_ES_CM2];
  } else if (estCM1()) {
    liste = diff === 0 ? TRAD_ES_CM1.slice(0, 8) : diff === 1 ? TRAD_ES_CM1 : [...TRAD_ES_CM1, ...TRAD_ES_CM2.slice(0, 6)];
  } else if (estCE2()) {
    liste = diff === 0 ? TRAD_ES_CE2.slice(0, 8) : diff === 1 ? TRAD_ES_CE2 : [...TRAD_ES_CE1, ...TRAD_ES_CE2];
  } else if (estCE1()) {
    liste = diff === 0 ? TRAD_ES_CE1.slice(0, 8) : diff === 1 ? TRAD_ES_CE1 : [...TRAD_ES_CE1, ...TRAD_ES_CE2.slice(0, 6)];
  } else {
    liste = diff === 0 ? TRAD_ES_CP.slice(0, 8) : diff === 1 ? TRAD_ES_CP : [...TRAD_ES_CP, ...TRAD_ES_CE1.slice(0, 6)];
  }
  const item = liste[Math.floor(Math.random() * liste.length)];

  elQuestion.innerHTML =
    "<p style='font-size:0.9rem;margin-bottom:0.4rem'>Comment dit-on en espagnol ?</p>" +
    `<p style="font-size:2.2rem;font-weight:700;color:var(--primaire);margin:0">${item.fr}</p>`;

  const fausses = melanger(item.fausses).slice(0, 3);
  const options = melanger([item.es, ...fausses]);
  setBonneReponse(options.indexOf(item.es));

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

// ── Italien mots ──────────────────────────────────────────────────────────────
const ITALIEN_IMAGES_CP = [
  { emoji: "🐱", mot: "gatto",      fausses: ["cane", "uccello", "pesce"] },
  { emoji: "🐶", mot: "cane",       fausses: ["gatto", "mucca", "maiale"] },
  { emoji: "🏠", mot: "casa",       fausses: ["scuola", "macchina", "albero"] },
  { emoji: "🌳", mot: "albero",     fausses: ["fiore", "erba", "foglia"] },
  { emoji: "⭐", mot: "stella",     fausses: ["luna", "sole", "nuvola"] },
  { emoji: "🌙", mot: "luna",       fausses: ["stella", "sole", "cielo"] },
  { emoji: "🍎", mot: "mela",       fausses: ["arancia", "banana", "pera"] },
  { emoji: "🎈", mot: "palloncino", fausses: ["palla", "aquilone", "sapone"] },
  { emoji: "📚", mot: "libro",      fausses: ["matita", "borsa", "tavolo"] },
  { emoji: "🚗", mot: "macchina",   fausses: ["autobus", "bicicletta", "barca"] },
  { emoji: "🌸", mot: "fiore",      fausses: ["albero", "foglia", "pianta"] },
  { emoji: "🐟", mot: "pesce",      fausses: ["uccello", "rana", "granchio"] },
  { emoji: "☀️", mot: "sole",       fausses: ["luna", "stella", "nuvola"] },
  { emoji: "🍰", mot: "torta",      fausses: ["pane", "biscotto", "dolce"] },
  { emoji: "🐸", mot: "rana",       fausses: ["pesce", "serpente", "anatra"] },
];

const ITALIEN_IMAGES_CE1 = [
  { emoji: "🦋", mot: "farfalla",   fausses: ["libellula", "coccinella", "ape"] },
  { emoji: "🐘", mot: "elefante",   fausses: ["ippopotamo", "rinoceronte", "giraffa"] },
  { emoji: "🚀", mot: "razzo",      fausses: ["aereo", "nave", "pallone"] },
  { emoji: "🌋", mot: "vulcano",    fausses: ["montagna", "collina", "isola"] },
  { emoji: "🦊", mot: "volpe",      fausses: ["lupo", "orso", "cervo"] },
  { emoji: "🌵", mot: "cactus",     fausses: ["palma", "bambù", "cespuglio"] },
  { emoji: "🦜", mot: "pappagallo", fausses: ["aquila", "gufo", "cigno"] },
  { emoji: "🍕", mot: "pizza",      fausses: ["pasta", "hamburger", "insalata"] },
  { emoji: "🌈", mot: "arcobaleno", fausses: ["temporale", "nuvola", "pioggia"] },
  { emoji: "🎸", mot: "chitarra",   fausses: ["pianoforte", "violino", "tamburo"] },
  { emoji: "🐙", mot: "polpo",      fausses: ["medusa", "granchio", "aragosta"] },
  { emoji: "🦒", mot: "giraffa",    fausses: ["zebra", "elefante", "cammello"] },
  { emoji: "👁️", mot: "occhio",    fausses: ["orecchio", "naso", "bocca"] },
  { emoji: "👂", mot: "orecchio",   fausses: ["occhio", "naso", "mano"] },
  { emoji: "✏️", mot: "matita",    fausses: ["penna", "righello", "gomma"] },
];

const ITALIEN_IMAGES_CE2 = [
  { emoji: "🌍", mot: "mondo",        fausses: ["paese", "terra", "globo"] },
  { emoji: "🏔️", mot: "montagna",     fausses: ["collina", "vulcano", "roccia"] },
  { emoji: "🌊", mot: "oceano",       fausses: ["mare", "lago", "fiume"] },
  { emoji: "🏙️", mot: "città",        fausses: ["paese", "capitale", "regione"] },
  { emoji: "✈️", mot: "aereo",        fausses: ["elicottero", "razzo", "pallone"] },
  { emoji: "🌿", mot: "pianta",       fausses: ["albero", "fiore", "erba"] },
  { emoji: "🔬", mot: "microscopio",  fausses: ["telescopio", "binocolo", "camera"] },
  { emoji: "📱", mot: "telefono",     fausses: ["computer", "tablet", "schermo"] },
  { emoji: "💡", mot: "luce",         fausses: ["lampada", "candela", "fuoco"] },
  { emoji: "🚂", mot: "treno",        fausses: ["metro", "tram", "taxi"] },
  { emoji: "🎭", mot: "teatro",       fausses: ["cinema", "concerto", "spettacolo"] },
];

const ITALIEN_IMAGES_CM1 = [
  { emoji: "🔭", mot: "telescopio",   fausses: ["microscopio", "binocolo", "camera"] },
  { emoji: "🗺️", mot: "mappa",        fausses: ["piano", "atlante", "diagramma"] },
  { emoji: "⚡", mot: "fulmine",      fausses: ["tuono", "tempesta", "elettricità"] },
  { emoji: "🏛️", mot: "museo",        fausses: ["biblioteca", "galleria", "monumento"] },
  { emoji: "🧲", mot: "calamita",     fausses: ["batteria", "filo", "metallo"] },
  { emoji: "📖", mot: "dizionario",   fausses: ["enciclopedia", "grammatica", "libro"] },
  { emoji: "🧪", mot: "esperimento",  fausses: ["ricerca", "prova", "studio"] },
  { emoji: "🌐", mot: "internet",     fausses: ["computer", "rete", "sito web"] },
  { emoji: "🧭", mot: "bussola",      fausses: ["direzione", "nord", "mappa"] },
  { emoji: "🦠", mot: "virus",        fausses: ["batterio", "germe", "malattia"] },
];

const ITALIEN_IMAGES_CM2 = [
  { emoji: "⚖️", mot: "giustizia",    fausses: ["libertà", "legge", "uguaglianza"] },
  { emoji: "🌍", mot: "ambiente",     fausses: ["natura", "clima", "pianeta"] },
  { emoji: "🧬", mot: "biologia",     fausses: ["chimica", "fisica", "scienza"] },
  { emoji: "🏛️", mot: "civiltà",      fausses: ["cultura", "impero", "società"] },
  { emoji: "📊", mot: "diagramma",    fausses: ["tabella", "grafico", "schema"] },
  { emoji: "🔋", mot: "energia",      fausses: ["forza", "potere", "combustibile"] },
  { emoji: "🤝", mot: "cooperazione", fausses: ["accordo", "alleanza", "amicizia"] },
  { emoji: "📜", mot: "costituzione", fausses: ["legge", "carta", "trattato"] },
  { emoji: "🔬", mot: "laboratorio",  fausses: ["ricerca", "scienza", "studio"] },
  { emoji: "💊", mot: "medicina",     fausses: ["droga", "trattamento", "salute"] },
  { emoji: "🌾", mot: "agricoltura",  fausses: ["raccolto", "fattoria", "coltura"] },
  { emoji: "🌡️", mot: "clima",        fausses: ["tempo", "temperatura", "atmosfera"] },
];

export function lancerItalienMots() {
  elTitre.textContent = "🇮🇹 Italiano";
  const liste = estCM2() ? ITALIEN_IMAGES_CM2 : estCM1() ? ITALIEN_IMAGES_CM1 : estCE2() ? ITALIEN_IMAGES_CE2 : estCE1() ? ITALIEN_IMAGES_CE1 : ITALIEN_IMAGES_CP;
  const item = liste[Math.floor(Math.random() * liste.length)];

  elQuestion.innerHTML =
    "<p style='font-size:0.95rem;margin-bottom:0.25rem'>Come si dice in italiano?</p>" +
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

// ── Traduction Français → Italien ─────────────────────────────────────────────
const TRAD_IT_CP = [
  { fr: "chat",    it: "gatto",      fausses: ["cane", "uccello", "pesce"] },
  { fr: "chien",   it: "cane",       fausses: ["gatto", "mucca", "maiale"] },
  { fr: "rouge",   it: "rosso",      fausses: ["blu", "verde", "giallo"] },
  { fr: "bleu",    it: "blu",        fausses: ["rosso", "verde", "rosa"] },
  { fr: "un",      it: "uno",        fausses: ["due", "tre", "quattro"] },
  { fr: "deux",    it: "due",        fausses: ["uno", "tre", "cinque"] },
  { fr: "grand",   it: "grande",     fausses: ["piccolo", "lungo", "vecchio"] },
  { fr: "petit",   it: "piccolo",    fausses: ["grande", "lungo", "giovane"] },
  { fr: "maison",  it: "casa",       fausses: ["scuola", "parco", "negozio"] },
  { fr: "livre",   it: "libro",      fausses: ["matita", "borsa", "tavolo"] },
  { fr: "ami",     it: "amico",      fausses: ["famiglia", "professore", "bambino"] },
  { fr: "eau",     it: "acqua",      fausses: ["latte", "succo", "tè"] },
  { fr: "soleil",  it: "sole",       fausses: ["luna", "stella", "nuvola"] },
  { fr: "pomme",   it: "mela",       fausses: ["pera", "arancia", "uva"] },
  { fr: "trois",   it: "tre",        fausses: ["uno", "due", "quattro"] },
  { fr: "voiture", it: "macchina",   fausses: ["autobus", "bicicletta", "barca"] },
  { fr: "jaune",   it: "giallo",     fausses: ["rosso", "blu", "verde"] },
  { fr: "vert",    it: "verde",      fausses: ["giallo", "blu", "rosso"] },
];

const TRAD_IT_CE1 = [
  { fr: "école",   it: "scuola",     fausses: ["casa", "parco", "chiesa"] },
  { fr: "famille", it: "famiglia",   fausses: ["amico", "professore", "squadra"] },
  { fr: "heureux", it: "felice",     fausses: ["triste", "arrabbiato", "stanco"] },
  { fr: "rapide",  it: "veloce",     fausses: ["lento", "grande", "forte"] },
  { fr: "beau",    it: "bello",      fausses: ["brutto", "strano", "normale"] },
  { fr: "manger",  it: "mangiare",   fausses: ["bere", "dormire", "correre"] },
  { fr: "jouer",   it: "giocare",    fausses: ["mangiare", "dormire", "leggere"] },
  { fr: "courir",  it: "correre",    fausses: ["saltare", "camminare", "nuotare"] },
  { fr: "dormir",  it: "dormire",    fausses: ["mangiare", "correre", "sognare"] },
  { fr: "mer",     it: "mare",       fausses: ["lago", "fiume", "stagno"] },
  { fr: "fleur",   it: "fiore",      fausses: ["albero", "foglia", "erba"] },
  { fr: "tête",    it: "testa",      fausses: ["mano", "piede", "braccio"] },
  { fr: "main",    it: "mano",       fausses: ["piede", "braccio", "dito"] },
  { fr: "pied",    it: "piede",      fausses: ["gamba", "mano", "ginocchio"] },
  { fr: "nez",     it: "naso",       fausses: ["bocca", "orecchio", "occhio"] },
  { fr: "crayon",  it: "matita",    fausses: ["penna", "righello", "gomma"] },
  { fr: "chaud",   it: "caldo",      fausses: ["freddo", "tiepido", "fresco"] },
  { fr: "froid",   it: "freddo",     fausses: ["caldo", "tiepido", "fresco"] },
];

const TRAD_IT_CE2 = [
  { fr: "nager",         it: "nuotare",      fausses: ["correre", "volare", "tuffarsi"] },
  { fr: "chanter",       it: "cantare",      fausses: ["ballare", "giocare", "ascoltare"] },
  { fr: "écrire",        it: "scrivere",     fausses: ["leggere", "disegnare", "copiare"] },
  { fr: "lire",          it: "leggere",      fausses: ["scrivere", "studiare", "imparare"] },
  { fr: "difficile",     it: "difficile",    fausses: ["facile", "semplice", "duro"] },
  { fr: "facile",        it: "facile",       fausses: ["difficile", "duro", "semplice"] },
  { fr: "important",     it: "importante",   fausses: ["utile", "necessario", "serio"] },
  { fr: "différent",     it: "diverso",      fausses: ["simile", "uguale", "identico"] },
  { fr: "mathématiques", it: "matematica",   fausses: ["scienza", "storia", "arte"] },
  { fr: "histoire",      it: "storia",       fausses: ["geografia", "scienza", "lingua"] },
  { fr: "géographie",    it: "geografia",    fausses: ["storia", "scienza", "matematica"] },
  { fr: "musique",       it: "musica",       fausses: ["arte", "danza", "teatro"] },
  { fr: "pays",          it: "paese",        fausses: ["città", "villaggio", "regione"] },
  { fr: "montagne",      it: "montagna",     fausses: ["collina", "vulcano", "roccia"] },
  { fr: "forêt",         it: "foresta",      fausses: ["giungla", "parco", "giardino"] },
  { fr: "rivière",       it: "fiume",        fausses: ["lago", "mare", "torrente"] },
];

const TRAD_IT_CM1 = [
  { fr: "gouvernement",  it: "governo",       fausses: ["paese", "repubblica", "stato"] },
  { fr: "environnement", it: "ambiente",      fausses: ["natura", "clima", "pianeta"] },
  { fr: "expérience",    it: "esperimento",   fausses: ["ricerca", "prova", "studio"] },
  { fr: "découverte",    it: "scoperta",      fausses: ["invenzione", "risultato", "ricerca"] },
  { fr: "électricité",   it: "elettricità",   fausses: ["energia", "corrente", "forza"] },
  { fr: "température",   it: "temperatura",   fausses: ["tempo", "calore", "grado"] },
  { fr: "volcan",        it: "vulcano",       fausses: ["montagna", "cratere", "eruzione"] },
  { fr: "boussole",      it: "bussola",       fausses: ["direzione", "nord", "mappa"] },
  { fr: "expédition",    it: "spedizione",    fausses: ["viaggio", "gita", "tour"] },
  { fr: "laboratoire",   it: "laboratorio",   fausses: ["ricerca", "scienza", "studio"] },
  { fr: "territoire",    it: "territorio",    fausses: ["paese", "regione", "area"] },
  { fr: "population",    it: "popolazione",   fausses: ["gente", "società", "comunità"] },
  { fr: "catastrophe",   it: "catastrofe",    fausses: ["incidente", "crisi", "emergenza"] },
];

const TRAD_IT_CM2 = [
  { fr: "civilisation",  it: "civiltà",       fausses: ["cultura", "impero", "società"] },
  { fr: "constitution",  it: "costituzione",  fausses: ["legge", "carta", "trattato"] },
  { fr: "agriculture",   it: "agricoltura",   fausses: ["raccolto", "fattoria", "coltura"] },
  { fr: "coopération",   it: "cooperazione",  fausses: ["accordo", "alleanza", "amicizia"] },
  { fr: "biologie",      it: "biologia",      fausses: ["chimica", "fisica", "scienza"] },
  { fr: "révolution",    it: "rivoluzione",   fausses: ["rivolta", "cambiamento", "movimento"] },
  { fr: "démocratie",    it: "democrazia",    fausses: ["repubblica", "libertà", "politica"] },
  { fr: "atmosphère",    it: "atmosfera",     fausses: ["aria", "cielo", "clima"] },
  { fr: "continent",     it: "continente",    fausses: ["paese", "isola", "penisola"] },
  { fr: "patrimoine",    it: "patrimonio",    fausses: ["cultura", "storia", "tradizione"] },
  { fr: "photosynthèse", it: "fotosintesi",   fausses: ["biologia", "crescita", "ossigeno"] },
  { fr: "énergie",       it: "energia",       fausses: ["forza", "corrente", "combustibile"] },
];

export function lancerTraductionItalien() {
  elTitre.textContent = "🇮🇹 Traduction";
  const diff = getDifficulte();
  let liste;
  if (estCM2()) {
    liste = diff === 0 ? TRAD_IT_CM2.slice(0, 8) : diff === 1 ? TRAD_IT_CM2 : [...TRAD_IT_CM1, ...TRAD_IT_CM2];
  } else if (estCM1()) {
    liste = diff === 0 ? TRAD_IT_CM1.slice(0, 8) : diff === 1 ? TRAD_IT_CM1 : [...TRAD_IT_CM1, ...TRAD_IT_CM2.slice(0, 6)];
  } else if (estCE2()) {
    liste = diff === 0 ? TRAD_IT_CE2.slice(0, 8) : diff === 1 ? TRAD_IT_CE2 : [...TRAD_IT_CE1, ...TRAD_IT_CE2];
  } else if (estCE1()) {
    liste = diff === 0 ? TRAD_IT_CE1.slice(0, 8) : diff === 1 ? TRAD_IT_CE1 : [...TRAD_IT_CE1, ...TRAD_IT_CE2.slice(0, 6)];
  } else {
    liste = diff === 0 ? TRAD_IT_CP.slice(0, 8) : diff === 1 ? TRAD_IT_CP : [...TRAD_IT_CP, ...TRAD_IT_CE1.slice(0, 6)];
  }
  const item = liste[Math.floor(Math.random() * liste.length)];

  elQuestion.innerHTML =
    "<p style='font-size:0.9rem;margin-bottom:0.4rem'>Comment dit-on en italien ?</p>" +
    `<p style="font-size:2.2rem;font-weight:700;color:var(--primaire);margin:0">${item.fr}</p>`;

  const fausses = melanger(item.fausses).slice(0, 3);
  const options = melanger([item.it, ...fausses]);
  setBonneReponse(options.indexOf(item.it));

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

// ── Portugais mots ────────────────────────────────────────────────────────────
const PORTUGAIS_IMAGES_CP = [
  { emoji: "🐱", mot: "gato",       fausses: ["cachorro", "pássaro", "peixe"] },
  { emoji: "🐶", mot: "cachorro",   fausses: ["gato", "vaca", "porco"] },
  { emoji: "🏠", mot: "casa",       fausses: ["escola", "carro", "árvore"] },
  { emoji: "🌳", mot: "árvore",     fausses: ["flor", "erva", "folha"] },
  { emoji: "⭐", mot: "estrela",    fausses: ["lua", "sol", "nuvem"] },
  { emoji: "🌙", mot: "lua",        fausses: ["estrela", "sol", "céu"] },
  { emoji: "🍎", mot: "maçã",       fausses: ["laranja", "banana", "pera"] },
  { emoji: "🎈", mot: "balão",      fausses: ["bola", "pipa", "bolha"] },
  { emoji: "📚", mot: "livro",      fausses: ["lápis", "bolsa", "mesa"] },
  { emoji: "🚗", mot: "carro",      fausses: ["ônibus", "bicicleta", "barco"] },
  { emoji: "🌸", mot: "flor",       fausses: ["árvore", "folha", "planta"] },
  { emoji: "🐟", mot: "peixe",      fausses: ["pássaro", "rã", "caranguejo"] },
  { emoji: "☀️", mot: "sol",        fausses: ["lua", "estrela", "nuvem"] },
  { emoji: "🍰", mot: "bolo",       fausses: ["pão", "biscoito", "doce"] },
  { emoji: "🐸", mot: "rã",         fausses: ["peixe", "cobra", "pato"] },
];

const PORTUGAIS_IMAGES_CE1 = [
  { emoji: "🦋", mot: "borboleta",  fausses: ["libélula", "joaninha", "abelha"] },
  { emoji: "🐘", mot: "elefante",   fausses: ["hipopótamo", "rinoceronte", "girafa"] },
  { emoji: "🚀", mot: "foguete",    fausses: ["avião", "navio", "balão"] },
  { emoji: "🌋", mot: "vulcão",     fausses: ["montanha", "colina", "ilha"] },
  { emoji: "🦊", mot: "raposa",     fausses: ["lobo", "urso", "veado"] },
  { emoji: "🌵", mot: "cacto",      fausses: ["palmeira", "bambu", "arbusto"] },
  { emoji: "🦜", mot: "papagaio",   fausses: ["águia", "coruja", "cisne"] },
  { emoji: "🍕", mot: "pizza",      fausses: ["macarrão", "hambúrguer", "salada"] },
  { emoji: "🌈", mot: "arco-íris",  fausses: ["tempestade", "nuvem", "chuva"] },
  { emoji: "🎸", mot: "guitarra",   fausses: ["piano", "violino", "tambor"] },
  { emoji: "🐙", mot: "polvo",      fausses: ["medusa", "caranguejo", "lagosta"] },
  { emoji: "🦒", mot: "girafa",     fausses: ["zebra", "elefante", "camelo"] },
  { emoji: "👁️", mot: "olho",       fausses: ["orelha", "nariz", "boca"] },
  { emoji: "👂", mot: "orelha",     fausses: ["olho", "nariz", "mão"] },
  { emoji: "✏️", mot: "lápis",      fausses: ["caneta", "régua", "borracha"] },
];

const PORTUGAIS_IMAGES_CE2 = [
  { emoji: "🌍", mot: "mundo",       fausses: ["país", "terra", "globo"] },
  { emoji: "🏔️", mot: "montanha",    fausses: ["colina", "vulcão", "rocha"] },
  { emoji: "🌊", mot: "oceano",      fausses: ["mar", "lago", "rio"] },
  { emoji: "🏙️", mot: "cidade",      fausses: ["país", "capital", "região"] },
  { emoji: "✈️", mot: "avião",       fausses: ["helicóptero", "foguete", "balão"] },
  { emoji: "🌿", mot: "planta",      fausses: ["árvore", "flor", "erva"] },
  { emoji: "🔬", mot: "microscópio", fausses: ["telescópio", "binóculo", "câmera"] },
  { emoji: "📱", mot: "telefone",    fausses: ["computador", "tablet", "tela"] },
  { emoji: "💡", mot: "luz",         fausses: ["lâmpada", "vela", "fogo"] },
  { emoji: "🚂", mot: "trem",        fausses: ["metrô", "bonde", "táxi"] },
  { emoji: "🎭", mot: "teatro",      fausses: ["cinema", "concerto", "espetáculo"] },
];

const PORTUGAIS_IMAGES_CM1 = [
  { emoji: "🔭", mot: "telescópio",  fausses: ["microscópio", "binóculo", "câmera"] },
  { emoji: "🗺️", mot: "mapa",        fausses: ["plano", "atlas", "diagrama"] },
  { emoji: "⚡", mot: "relâmpago",   fausses: ["trovão", "tempestade", "eletricidade"] },
  { emoji: "🏛️", mot: "museu",       fausses: ["biblioteca", "galeria", "monumento"] },
  { emoji: "🧲", mot: "ímã",         fausses: ["bateria", "fio", "metal"] },
  { emoji: "📖", mot: "dicionário",  fausses: ["enciclopédia", "gramática", "livro"] },
  { emoji: "🧪", mot: "experimento", fausses: ["pesquisa", "prova", "estudo"] },
  { emoji: "🌐", mot: "internet",    fausses: ["computador", "rede", "site"] },
  { emoji: "🧭", mot: "bússola",     fausses: ["direção", "norte", "mapa"] },
  { emoji: "🦠", mot: "vírus",       fausses: ["bactéria", "germe", "doença"] },
];

const PORTUGAIS_IMAGES_CM2 = [
  { emoji: "⚖️", mot: "justiça",      fausses: ["liberdade", "lei", "igualdade"] },
  { emoji: "🌍", mot: "ambiente",     fausses: ["natureza", "clima", "planeta"] },
  { emoji: "🧬", mot: "biologia",     fausses: ["química", "física", "ciência"] },
  { emoji: "🏛️", mot: "civilização",  fausses: ["cultura", "império", "sociedade"] },
  { emoji: "📊", mot: "diagrama",     fausses: ["tabela", "gráfico", "esquema"] },
  { emoji: "🔋", mot: "energia",      fausses: ["força", "poder", "combustível"] },
  { emoji: "🤝", mot: "cooperação",   fausses: ["acordo", "aliança", "amizade"] },
  { emoji: "📜", mot: "constituição", fausses: ["lei", "carta", "tratado"] },
  { emoji: "🔬", mot: "laboratório",  fausses: ["pesquisa", "ciência", "estudo"] },
  { emoji: "💊", mot: "medicina",     fausses: ["droga", "tratamento", "saúde"] },
  { emoji: "🌾", mot: "agricultura",  fausses: ["colheita", "fazenda", "cultivo"] },
  { emoji: "🌡️", mot: "clima",        fausses: ["tempo", "temperatura", "atmosfera"] },
];

export function lancerPortugaisMots() {
  elTitre.textContent = "🇵🇹 Português";
  const liste = estCM2() ? PORTUGAIS_IMAGES_CM2 : estCM1() ? PORTUGAIS_IMAGES_CM1 : estCE2() ? PORTUGAIS_IMAGES_CE2 : estCE1() ? PORTUGAIS_IMAGES_CE1 : PORTUGAIS_IMAGES_CP;
  const item = liste[Math.floor(Math.random() * liste.length)];

  elQuestion.innerHTML =
    "<p style='font-size:0.95rem;margin-bottom:0.25rem'>Como se diz em português?</p>" +
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

// ── Traduction Français → Portugais ───────────────────────────────────────────
const TRAD_PT_CP = [
  { fr: "chat",    pt: "gato",     fausses: ["cachorro", "pássaro", "peixe"] },
  { fr: "chien",   pt: "cachorro", fausses: ["gato", "vaca", "porco"] },
  { fr: "rouge",   pt: "vermelho", fausses: ["azul", "verde", "amarelo"] },
  { fr: "bleu",    pt: "azul",     fausses: ["vermelho", "verde", "rosa"] },
  { fr: "un",      pt: "um",       fausses: ["dois", "três", "quatro"] },
  { fr: "deux",    pt: "dois",     fausses: ["um", "três", "cinco"] },
  { fr: "grand",   pt: "grande",   fausses: ["pequeno", "longo", "velho"] },
  { fr: "petit",   pt: "pequeno",  fausses: ["grande", "longo", "jovem"] },
  { fr: "maison",  pt: "casa",     fausses: ["escola", "parque", "loja"] },
  { fr: "livre",   pt: "livro",    fausses: ["lápis", "bolsa", "mesa"] },
  { fr: "ami",     pt: "amigo",    fausses: ["família", "professor", "bebê"] },
  { fr: "eau",     pt: "água",     fausses: ["leite", "suco", "chá"] },
  { fr: "soleil",  pt: "sol",      fausses: ["lua", "estrela", "nuvem"] },
  { fr: "pomme",   pt: "maçã",     fausses: ["pera", "laranja", "uva"] },
  { fr: "trois",   pt: "três",     fausses: ["um", "dois", "quatro"] },
  { fr: "voiture", pt: "carro",    fausses: ["ônibus", "bicicleta", "barco"] },
  { fr: "jaune",   pt: "amarelo",  fausses: ["vermelho", "azul", "verde"] },
  { fr: "vert",    pt: "verde",    fausses: ["amarelo", "azul", "vermelho"] },
];

const TRAD_PT_CE1 = [
  { fr: "école",   pt: "escola",   fausses: ["casa", "parque", "igreja"] },
  { fr: "famille", pt: "família",  fausses: ["amigo", "professor", "equipe"] },
  { fr: "heureux", pt: "feliz",    fausses: ["triste", "zangado", "cansado"] },
  { fr: "rapide",  pt: "rápido",   fausses: ["lento", "grande", "forte"] },
  { fr: "beau",    pt: "bonito",   fausses: ["feio", "estranho", "normal"] },
  { fr: "manger",  pt: "comer",    fausses: ["beber", "dormir", "correr"] },
  { fr: "jouer",   pt: "jogar",    fausses: ["comer", "dormir", "ler"] },
  { fr: "courir",  pt: "correr",   fausses: ["pular", "caminhar", "nadar"] },
  { fr: "dormir",  pt: "dormir",   fausses: ["comer", "correr", "sonhar"] },
  { fr: "mer",     pt: "mar",      fausses: ["lago", "rio", "lagoa"] },
  { fr: "fleur",   pt: "flor",     fausses: ["árvore", "folha", "erva"] },
  { fr: "tête",    pt: "cabeça",   fausses: ["mão", "pé", "braço"] },
  { fr: "main",    pt: "mão",      fausses: ["pé", "braço", "dedo"] },
  { fr: "pied",    pt: "pé",       fausses: ["perna", "mão", "joelho"] },
  { fr: "nez",     pt: "nariz",    fausses: ["boca", "orelha", "olho"] },
  { fr: "crayon",  pt: "lápis",    fausses: ["caneta", "régua", "borracha"] },
  { fr: "chaud",   pt: "quente",   fausses: ["frio", "morno", "fresco"] },
  { fr: "froid",   pt: "frio",     fausses: ["quente", "morno", "fresco"] },
];

const TRAD_PT_CE2 = [
  { fr: "nager",         pt: "nadar",        fausses: ["correr", "voar", "mergulhar"] },
  { fr: "chanter",       pt: "cantar",       fausses: ["dançar", "jogar", "escutar"] },
  { fr: "écrire",        pt: "escrever",     fausses: ["ler", "desenhar", "copiar"] },
  { fr: "lire",          pt: "ler",          fausses: ["escrever", "estudar", "aprender"] },
  { fr: "difficile",     pt: "difícil",      fausses: ["fácil", "simples", "duro"] },
  { fr: "facile",        pt: "fácil",        fausses: ["difícil", "duro", "simples"] },
  { fr: "important",     pt: "importante",   fausses: ["útil", "necessário", "sério"] },
  { fr: "différent",     pt: "diferente",    fausses: ["similar", "igual", "idêntico"] },
  { fr: "mathématiques", pt: "matemática",   fausses: ["ciência", "história", "arte"] },
  { fr: "histoire",      pt: "história",     fausses: ["geografia", "ciência", "língua"] },
  { fr: "géographie",    pt: "geografia",    fausses: ["história", "ciência", "matemática"] },
  { fr: "musique",       pt: "música",       fausses: ["arte", "dança", "teatro"] },
  { fr: "pays",          pt: "país",         fausses: ["cidade", "vila", "região"] },
  { fr: "montagne",      pt: "montanha",     fausses: ["colina", "vulcão", "rocha"] },
  { fr: "forêt",         pt: "floresta",     fausses: ["selva", "parque", "jardim"] },
  { fr: "rivière",       pt: "rio",          fausses: ["lago", "mar", "riacho"] },
];

const TRAD_PT_CM1 = [
  { fr: "gouvernement",  pt: "governo",       fausses: ["país", "república", "estado"] },
  { fr: "environnement", pt: "meio ambiente", fausses: ["natureza", "clima", "planeta"] },
  { fr: "expérience",    pt: "experiência",   fausses: ["pesquisa", "prova", "estudo"] },
  { fr: "découverte",    pt: "descoberta",    fausses: ["invenção", "resultado", "pesquisa"] },
  { fr: "électricité",   pt: "eletricidade",  fausses: ["energia", "corrente", "força"] },
  { fr: "température",   pt: "temperatura",   fausses: ["tempo", "calor", "grau"] },
  { fr: "volcan",        pt: "vulcão",        fausses: ["montanha", "cratera", "erupção"] },
  { fr: "boussole",      pt: "bússola",       fausses: ["direção", "norte", "mapa"] },
  { fr: "expédition",    pt: "expedição",     fausses: ["viagem", "excursão", "tour"] },
  { fr: "laboratoire",   pt: "laboratório",   fausses: ["pesquisa", "ciência", "estudo"] },
  { fr: "territoire",    pt: "território",    fausses: ["país", "região", "área"] },
  { fr: "population",    pt: "população",     fausses: ["pessoas", "sociedade", "comunidade"] },
  { fr: "catastrophe",   pt: "catástrofe",    fausses: ["acidente", "crise", "emergência"] },
];

const TRAD_PT_CM2 = [
  { fr: "civilisation",  pt: "civilização",   fausses: ["cultura", "império", "sociedade"] },
  { fr: "constitution",  pt: "constituição",  fausses: ["lei", "carta", "tratado"] },
  { fr: "agriculture",   pt: "agricultura",   fausses: ["colheita", "fazenda", "cultivo"] },
  { fr: "coopération",   pt: "cooperação",    fausses: ["acordo", "aliança", "amizade"] },
  { fr: "biologie",      pt: "biologia",      fausses: ["química", "física", "ciência"] },
  { fr: "révolution",    pt: "revolução",     fausses: ["levante", "mudança", "movimento"] },
  { fr: "démocratie",    pt: "democracia",    fausses: ["república", "liberdade", "política"] },
  { fr: "atmosphère",    pt: "atmosfera",     fausses: ["ar", "céu", "clima"] },
  { fr: "continent",     pt: "continente",    fausses: ["país", "ilha", "península"] },
  { fr: "patrimoine",    pt: "patrimônio",    fausses: ["cultura", "história", "tradição"] },
  { fr: "photosynthèse", pt: "fotossíntese",  fausses: ["biologia", "crescimento", "oxigênio"] },
  { fr: "énergie",       pt: "energia",       fausses: ["força", "corrente", "combustível"] },
];

export function lancerTraductionPortugais() {
  elTitre.textContent = "🇵🇹 Traduction";
  const diff = getDifficulte();
  let liste;
  if (estCM2()) {
    liste = diff === 0 ? TRAD_PT_CM2.slice(0, 8) : diff === 1 ? TRAD_PT_CM2 : [...TRAD_PT_CM1, ...TRAD_PT_CM2];
  } else if (estCM1()) {
    liste = diff === 0 ? TRAD_PT_CM1.slice(0, 8) : diff === 1 ? TRAD_PT_CM1 : [...TRAD_PT_CM1, ...TRAD_PT_CM2.slice(0, 6)];
  } else if (estCE2()) {
    liste = diff === 0 ? TRAD_PT_CE2.slice(0, 8) : diff === 1 ? TRAD_PT_CE2 : [...TRAD_PT_CE1, ...TRAD_PT_CE2];
  } else if (estCE1()) {
    liste = diff === 0 ? TRAD_PT_CE1.slice(0, 8) : diff === 1 ? TRAD_PT_CE1 : [...TRAD_PT_CE1, ...TRAD_PT_CE2.slice(0, 6)];
  } else {
    liste = diff === 0 ? TRAD_PT_CP.slice(0, 8) : diff === 1 ? TRAD_PT_CP : [...TRAD_PT_CP, ...TRAD_PT_CE1.slice(0, 6)];
  }
  const item = liste[Math.floor(Math.random() * liste.length)];

  elQuestion.innerHTML =
    "<p style='font-size:0.9rem;margin-bottom:0.4rem'>Comment dit-on en portugais ?</p>" +
    `<p style="font-size:2.2rem;font-weight:700;color:var(--primaire);margin:0">${item.fr}</p>`;

  const fausses = melanger(item.fausses).slice(0, 3);
  const options = melanger([item.pt, ...fausses]);
  setBonneReponse(options.indexOf(item.pt));

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
