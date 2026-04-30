// app-histoire.js — narrative layer: "La Quête de la Forêt Lumineuse"

import { lireEtoiles, lireNomRenard } from "./app-state.js";

const HISTOIRES_JEUX = {
  // ── Maths ─────────────────────────────────────────────────────────────────
  compte: {
    cp:  { emoji: "🐱🐶🐸", titre: "Les animaux de la ferme",    texte: "Les animaux de la ferme se sont tous mélangés ! Aide [Nom] à les compter un par un." },
    ce1: { emoji: "🐄🐑🐓", titre: "La prairie du fermier",      texte: "[Nom] aide le fermier à compter deux types d'animaux mélangés dans la prairie. Compare-les et trouve le total !" },
  },
  addition: {
    cp:  { emoji: "🎈🎈🎈", titre: "La fête des ballons",        texte: "Des ballons colorés s'envolent dans le ciel de la forêt ! Combien y en a-t-il en tout ? [Nom] compte sur toi !" },
    ce1: { emoji: "🎉🎊🎈", titre: "Préparatifs de fête",        texte: "[Nom] prépare les décorations pour la grande fête de la forêt. Aide-le à additionner toutes ses fournitures !" },
  },
  soustraction: {
    cp:  { emoji: "🍎🍏",   titre: "Le panier de pommes",        texte: "Un beau panier plein de pommes… mais des petits lutins en ont mangé quelques-unes ! Combien en reste-t-il ?" },
    ce1: { emoji: "🧺🦔",   titre: "Le pique-nique de [Nom]",    texte: "[Nom] prépare un pique-nique, mais des amis ont déjà pris leur part. Calcule ce qu'il reste dans le panier !" },
  },
  compare: {
    cp:  { emoji: "⚖️🦊",   titre: "Le jeu de la balance",      texte: "Deux groupes d'animaux se regardent dans la forêt. [Nom] veut savoir lequel est le plus grand. Aide-le à comparer !" },
    ce1: { emoji: "🏆⚖️",   titre: "Le tournoi de la forêt",    texte: "[Nom] arbitre le tournoi de la forêt. Il faut comparer les scores de chaque équipe — qui remporte la manche ?" },
  },
  suite: {
    cp:  { emoji: "🔢❓",   titre: "Le chiffre mystère",         texte: "Un chiffre coquin s'est caché dans la suite ! [Nom] cherche partout dans la forêt. Sauras-tu le retrouver ?" },
    ce1: { emoji: "🔢🔍",   titre: "La suite mystérieuse",       texte: "La suite de nombres a un trou mystérieux ! Observe bien le schéma et aide [Nom] à trouver l'intrus." },
  },
  doubles: {
    cp:  { emoji: "👯🦊",   titre: "La danse des jumeaux",       texte: "Les animaux adorent danser en paires ! [Nom] veut doubler chaque groupe. Aide-le à trouver les doubles !" },
    ce1: { emoji: "👯🏅",   titre: "Le tournoi en binômes",      texte: "[Nom] organise un tournoi en binômes et doit vite doubler chaque score pour remplir le tableau. Aide-le !" },
  },
  moitie: {
    cp:  { emoji: "✂️🎂",   titre: "Partage le goûter",          texte: "[Nom] veut partager son gâteau avec son ami en deux parts égales. Aide-le à trouver la moitié !" },
    ce1: { emoji: "✂️🏅",   titre: "Partage équitable",          texte: "[Nom] partage les récompenses entre deux équipes à égalité. Calcule la moitié de chaque lot !" },
  },
  dizaines: {
    cp:  { emoji: "📊🟡",   titre: "Les barres magiques",        texte: "[Nom] range ses billes en barres de 10. Aide-le à compter les dizaines et les petites unités !" },
    ce1: { emoji: "📚📊",   titre: "La bibliothèque de [Nom]",   texte: "[Nom] est bibliothécaire et range ses livres en barres de dix. Compte les dizaines et les unités !" },
  },
  pairimpair: {
    cp:  { emoji: "🟣⚡",   titre: "La fête de la forêt",        texte: "Les animaux font la fête ! Certains dansent en paires, d'autres sont tout seuls. Pair ou impair ? [Nom] a besoin de toi !" },
    ce1: { emoji: "🗃️⚡",   titre: "Le grand rangement",         texte: "[Nom] trie les objets de son grenier avant le grand rangement. Pair ou impair — teste ta rapidité !" },
  },
  perlesDorees: {
    cp:  { emoji: "🟡✨",   titre: "Le trésor des perles",       texte: "[Nom] a trouvé un coffre plein de perles dorées magiques ! Aide-le à les compter avec les grandes barres et les petites billes." },
    ce1: { emoji: "🟡📐",   titre: "L'atelier des perles",       texte: "[Nom] apprend à composer des nombres avec les perles dorées. Barres de dix et billes d'unités — à toi de jouer !" },
  },
  planche100: {
    cp:  { emoji: "🔢🗺️",  titre: "La carte des nombres",       texte: "La planche des cent est une carte magique de la forêt ! [Nom] doit trouver les bons nombres sur la carte." },
    ce1: { emoji: "🗺️🚀",  titre: "La course aux nombres",      texte: "[Nom] navigue rapidement sur la planche des cent. Repère les bons nombres pour gagner la course !" },
  },
  // ── Formes ────────────────────────────────────────────────────────────────
  formes: {
    cp:  { emoji: "🔷🔺🟡", titre: "Les formes cachées",         texte: "Des formes magiques se cachent partout dans la forêt ! Cercles, carrés, triangles… [Nom] a besoin de toi pour les reconnaître." },
    ce1: { emoji: "📐🔷🔺", titre: "Le cours de géométrie",      texte: "[Nom] étudie les figures géométriques de la forêt : côtés, sommets, angles droits. Seras-tu un bon géomètre ?" },
  },
  symetrie: {
    ce1: { emoji: "🪞✨",   titre: "Le château des miroirs",     texte: "[Nom] décore le château de la forêt avec des motifs symétriques. Trouve l'image miroir exacte !" },
  },
  perimetre: {
    ce1: { emoji: "🔲🌿",   titre: "La clôture du jardin",       texte: "[Nom] construit une clôture autour de son jardin secret. Aide-le à calculer le périmètre total !" },
  },
  // ── Temps & Mesures ───────────────────────────────────────────────────────
  calendrier: {
    cp:  { emoji: "📅🌞",   titre: "La fête des animaux",        texte: "[Nom] ne veut pas rater la grande fête des animaux ! Aide-le à lire le calendrier pour savoir quel jour c'est." },
    ce1: { emoji: "📅📋",   titre: "Le planning de la semaine",  texte: "[Nom] planifie la semaine des animaux de la forêt. Jours, semaines et mois — aide-le à bien lire le calendrier !" },
  },
  heure: {
    ce1: { emoji: "🕐⏰",   titre: "En route pour la réunion !", texte: "[Nom] doit être à l'heure à la réunion des animaux. Lis bien l'horloge pour ne pas être en retard !" },
  },
  durees: {
    ce1: { emoji: "⏱️🐻",   titre: "La sieste de l'ours",        texte: "[Nom] calcule combien de temps dure la sieste de l'ours. Aide-le à trouver la bonne heure de fin !" },
  },
  mesures: {
    ce1: { emoji: "📏🔨",   titre: "L'atelier de [Nom]",         texte: "[Nom] mesure les planches de son atelier. Centimètres et mètres — aide-le à mesurer juste !" },
  },
  masse: {
    cp:  { emoji: "⚖️🐣",   titre: "La balance de la forêt",    texte: "La balance magique de [Nom] est toute chamboulée ! Aide-le à trouver le bon poids de chaque objet." },
    ce1: { emoji: "⚖️📦",   titre: "Les colis de [Nom]",         texte: "[Nom] prépare des colis pour ses amis de la forêt. Grammes et kilogrammes — aide-le à bien peser chaque paquet !" },
  },
  // ── Argent ────────────────────────────────────────────────────────────────
  monnaiecp: {
    cp:  { emoji: "🪙🛒",   titre: "Le marché de la forêt",     texte: "[Nom] va au marché avec ses pièces brillantes ! Aide-le à compter son argent pour acheter quelque chose de délicieux." },
    ce1: { emoji: "🪙🏪",   titre: "Le stand de [Nom]",          texte: "[Nom] tient un stand au marché et reçoit des pièces de clients. Aide-le à compter et à rendre la monnaie !" },
  },
  monnaiece1: {
    ce1: { emoji: "💶🏦",   titre: "La caisse de la foire",      texte: "[Nom] gère la caisse de la grande foire de la forêt. Calcule les totaux et rends la monnaie avec précision !" },
  },
  // ── Calcul avancé ─────────────────────────────────────────────────────────
  multiplication: {
    ce1: { emoji: "✖️🍪",   titre: "Les paquets de biscuits",    texte: "[Nom] prépare des paquets de biscuits pour toute la forêt. Multiplier, c'est additionner en beaucoup plus rapide !" },
  },
  probleme: {
    ce1: { emoji: "📩🔍",   titre: "La lettre mystérieuse",      texte: "[Nom] reçoit une lettre avec un problème à résoudre. Lis bien l'énoncé, réfléchis et trouve la solution !" },
  },
  // ── Langage ───────────────────────────────────────────────────────────────
  sons: {
    cp:  { emoji: "🔤👂",   titre: "Les sons de la forêt",       texte: "[Nom] entend des sons mystérieux dans la forêt. Reconnais la lettre qui se cache dans chaque mot !" },
    ce1: { emoji: "👂🔊",   titre: "L'oreille de [Nom]",         texte: "[Nom] entraîne son oreille aux sons complexes de la forêt. Sons composés et phonèmes — à toi de les reconnaître !" },
  },
  syllabes: {
    cp:  { emoji: "📖🌀",   titre: "Les syllabes envolées",      texte: "Les syllabes jouent à cache-cache ! [Nom] cherche celles qui manquent dans les mots. Sauras-tu les retrouver ?" },
    ce1: { emoji: "📖✏️",   titre: "Le dictionnaire de la forêt", texte: "[Nom] complète le dictionnaire de la forêt avec les syllabes manquantes. Découpe bien chaque mot !" },
  },
  lecture: {
    cp:  { emoji: "📚🖼️",  titre: "Mots et images",             texte: "Les mots et les images font une randonnée dans la forêt ! Aide [Nom] à réunir chaque mot avec sa bonne image." },
    ce1: { emoji: "🖼️📚",  titre: "Le classement de la forêt",  texte: "[Nom] classe les objets de la forêt par catégories. Associe chaque mot à son image exacte !" },
  },
  lecturePhrase: {
    cp:  { emoji: "🖼️📝",  titre: "La phrase secrète",          texte: "[Nom] a trouvé de vieilles images avec des phrases mystérieuses ! Lis bien pour choisir la bonne phrase." },
    ce1: { emoji: "📝🔎",   titre: "Les messages codés",         texte: "[Nom] lit des messages codés envoyés par les animaux de la forêt. Choisis la phrase qui correspond exactement à l'image !" },
  },
  phraseMobile: {
    ce1: { emoji: "🧩📝",   titre: "La phrase cassée",           texte: "[Nom] répare des phrases cassées dans le journal de la forêt ! Remets le mot manquant exactement à sa bonne place." },
  },
  grammaire: {
    ce1: { emoji: "▲📚",    titre: "La langue des animaux",      texte: "[Nom] apprend la langue des animaux de la forêt. Repère si chaque mot est un nom, un verbe ou un adjectif !" },
  },
  synonymes: {
    ce1: { emoji: "🔁📖",   titre: "Le dictionnaire des synonymes", texte: "[Nom] enrichit le grand dictionnaire de la forêt. Trouve les mots qui ont le même sens !" },
  },
  conjugaison: {
    ce1: { emoji: "✍️📓",   titre: "Le journal de [Nom]",        texte: "[Nom] raconte les aventures de la forêt dans son journal. Conjugue bien les verbes au bon temps !" },
  },
  anglais: {
    ce1: { emoji: "🇬🇧🦊",  titre: "Les amis de la forêt",       texte: "[Nom] rencontre des amis anglophones dans la forêt ! Reconnais les objets du quotidien en anglais." },
  },
  traduction: {
    ce1: { emoji: "🔤🌍",   titre: "L'interprète de la forêt",   texte: "[Nom] aide ses amis anglophones à comprendre le français. Traduis les mots qu'ils ne connaissent pas !" },
  },
};

export function getHistoireJeu(jeuId, niveau) {
  const jeu = HISTOIRES_JEUX[jeuId];
  if (!jeu) return null;
  return jeu[niveau] || null;
}

const CHAPITRES = [
  {
    stade: 0,
    emoji: "🌑",
    titre: "La Forêt endormie",
    texte: "[Nom] vient de s'éveiller dans une forêt plongée dans le noir. La magie a disparu… mais toi, tu es là !",
    seuil: 0,
  },
  {
    stade: 1,
    emoji: "🌱",
    titre: "L'Éveil de la Forêt",
    texte: "Les premières lueurs apparaissent ! [Nom] trace un sentier dans l'obscurité. La forêt commence à se réveiller !",
    seuil: 21,
  },
  {
    stade: 2,
    emoji: "🌲",
    titre: "Les Épreuves",
    texte: "Un vieux gardien barre le chemin. Il ne laisse passer que les plus savants… et [Nom] a toi !",
    seuil: 61,
  },
  {
    stade: 3,
    emoji: "🌟",
    titre: "La Source Magique",
    texte: "Au cœur de la forêt, une source endormie attend. Tes connaissances ont le pouvoir de la réveiller !",
    seuil: 151,
  },
  {
    stade: 4,
    emoji: "🏆",
    titre: "La Légende",
    texte: "La Forêt Lumineuse brille à nouveau ! [Nom] et toi, vous êtes devenus une véritable légende !",
    seuil: 301,
  },
];

const SEUILS = [0, 21, 61, 151, 301];
const HISTOIRE_INTRO_KEY = "histoire-intro-vue";

function nomFox() {
  return lireNomRenard() || "Foxy";
}

function personnaliser(texte) {
  return texte.replace(/\[Nom\]/g, nomFox());
}

export function getChapitreParStade(stade) {
  return CHAPITRES[Math.min(Math.max(stade, 0), 4)];
}

export function getChapitreActuel() {
  const etoiles = lireEtoiles();
  let idx = 0;
  for (let i = 1; i < SEUILS.length; i++) {
    if (etoiles >= SEUILS[i]) idx = i;
  }
  return CHAPITRES[idx];
}

export function afficherIntroHistoire(nom) {
  if (localStorage.getItem(HISTOIRE_INTRO_KEY)) return;
  localStorage.setItem(HISTOIRE_INTRO_KEY, "1");

  const prenom = nom || "Foxy";
  const texte = `Il y a longtemps, une forêt magique brillait de mille étoiles. Mais la magie s'est endormie… ${prenom} a besoin de toi pour la réveiller ! Chaque bonne réponse rallume une étoile. L'aventure commence !`;

  const overlay = document.createElement("div");
  overlay.className = "evolution-overlay";
  overlay.innerHTML = `
    <div class="evolution-carte histoire-intro-carte">
      <p class="histoire-intro-emoji">🌑🦊✨</p>
      <p class="evolution-titre">La Forêt Lumineuse</p>
      <p class="histoire-intro-texte">${texte}</p>
      <button type="button" class="btn-evolution-fermer">C'est parti ! 🌟</button>
    </div>`;
  document.body.appendChild(overlay);
  const fermer = () => {
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.3s";
    setTimeout(() => overlay.remove(), 300);
  };
  overlay.querySelector(".btn-evolution-fermer").addEventListener("click", fermer);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) fermer(); });
}

export function afficherContexteHistoireMaison(container) {
  const ancien = container.querySelector("#histoire-maison-panel");
  if (ancien) ancien.remove();

  const etoiles = lireEtoiles();
  const chapitre = getChapitreActuel();
  const stade = chapitre.stade;

  let progression = "";
  if (stade < 4) {
    const seuilSuivant = SEUILS[stade + 1];
    const seuilActuel  = SEUILS[stade];
    const pct  = Math.min(100, Math.round(((etoiles - seuilActuel) / (seuilSuivant - seuilActuel)) * 100));
    const reste = seuilSuivant - etoiles;
    const chapSuivant = CHAPITRES[stade + 1];
    progression = `
      <p class="histoire-panel-suivant">${reste} ⭐ pour : ${chapSuivant.emoji} ${chapSuivant.titre}</p>
      <div class="histoire-barre-fond"><div class="histoire-barre-fill" style="width:${pct}%"></div></div>`;
  } else {
    progression = `<p class="histoire-panel-suivant">🏆 Aventure terminée — tu es une légende !</p>`;
  }

  const panel = document.createElement("div");
  panel.id = "histoire-maison-panel";
  panel.className = "histoire-panel";
  panel.innerHTML = `
    <p class="histoire-panel-label">📖 Notre aventure</p>
    <p class="histoire-panel-chapitre">${chapitre.emoji} <strong>${chapitre.titre}</strong></p>
    <p class="histoire-panel-texte">${personnaliser(chapitre.texte)}</p>
    ${progression}`;

  const jauges = container.querySelector(".maison-jauges");
  if (jauges) {
    container.insertBefore(panel, jauges);
  } else {
    container.appendChild(panel);
  }
}
