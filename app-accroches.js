const ACCROCHES = {
  compte: ["Compte bien chaque image, un par un.", "Les amis du renard attendent ton décompte !"],
  addition: ["Petit défi : additionne comme au marché.", "Le renard pose des pommes, à toi d'additionner."],
  soustraction: ["On enlève, il en reste combien ?", "Imagine que tu partages, puis tu enlèves."],
  compare: ["Lequel est le plus costaud en chiffres ?", "Regarde bien avant de trancher."],
  suite: ["La suite a un secret : même pas à pas.", "Trouve le nombre qui complète la famille."],
  doubles: ["Deux fois le même nombre, c'est magique.", "Double, toujours double !"],
  moitie: ["Partage équitable, deux parts pareilles.", "Coupe en deux parts justes."],
  dizaines: ["Les barres valent dix, les points valent un.", "Compte les dizaines puis les unités."],
  pairimpair: ["Deux par deux, ou il en reste un ?", "Fais des paires dans ta tête."],
  perlesDorees: ["Chaque perle a une valeur.", "Les perles dorées racontent un nombre."],
  planche100: ["Suis la grille comme une carte au trésor.", "Ligne et colonne se croisent."],
  formes: ["Observe les côtés et les angles.", "Quelle forme se cache derrière ?"],
  fractions: ["Les parts doivent être du même gâteau.", "Combien de parts coloriées ?"],
  symetrie: ["Imagine un miroir au milieu.", "Le reflet doit être identique."],
  perimetre: ["Fais le tour complet, sans oublier un côté.", "Additionne tous les bords."],
  angles: ["Droit, aigu ou obtus ?", "Compare avec l'angle d'une feuille."],
  aires: ["Compte les carreaux à l'intérieur.", "La surface, c'est l'intérieur."],
  calendrier: ["Les jours défilent dans l'ordre.", "Quel jour vient après ?"],
  heure: ["Petite aiguille, grande aiguille…", "Lis l'horloge calmement."],
  durees: ["Avance le temps dans ta tête.", "Combien de minutes se sont écoulées ?"],
  mesures: ["Même unité pour tout mesurer.", "Regarde l'échelle avant de répondre."],
  masse: ["Quel plateau penche le plus ?", "La balance ne ment pas."],
  monnaiecp: ["Compte les pièces une par une.", "Le marchand compte sur toi."],
  monnaiece1: ["Euros puis centimes.", "Fais le total comme à la caisse."],
  multiplication: ["Des paquets tous pareils.", "Pense à des groupes égaux."],
  division: ["Partage équitablement.", "Combien dans chaque groupe ?"],
  probleme: ["Lis l'histoire jusqu'au bout.", "Repère la question cachée."],
  decimaux: ["La virgule sépare les parties.", "Regarde bien les dixièmes."],
  syllabes: ["Découpe le mot en petits sons.", "Tape les syllabes doucement."],
  lecture: ["L'image t'aide à deviner.", "Lis le mot en suivant les lettres."],
  lecturePhrase: ["Une phrase, une image.", "Quelle phrase raconte la même chose ?"],
  phraseMobile: ["Quel mot rend la phrase logique ?", "Essaie la phrase à voix haute."],
  lectureTexte: ["La réponse est dans le texte.", "Relis le passage utile."],
  grammaire: ["Nature du mot : qui fait l'action ?", "Repère le verbe d'abord."],
  homophones: ["Deux mots qui se ressemblent…", "Le sens t'aide à choisir."],
  synonymes: ["Presque le même sens.", "Un mot qui se rapproche."],
  conjugaison: ["Quelle terminaison pour cette personne ?", "Pense au temps de l'action."],
  anglais: ["What is it in English ?", "Regarde l'image, dis le mot."],
  traduction: ["Du français vers l'anglais.", "Souviens-toi du mot vu en cours."],
  sons: ["Écoute les sons dans le mot.", "Découpe doucement."],
  sequence: ["Une étape après l'autre.", "Suis l'algorithme pas à pas."],
  code: ["Le programme obéit à l'ordre.", "Simule dans ta tête."],
  vraiFaux: ["Une seule affirmation à juger.", "Vrai ou faux, sans hésitation longue."],
};

export function texteAccrocheAleatoire(jeuId) {
  const liste = ACCROCHES[jeuId];
  if (!liste || !liste.length) return null;
  if (Math.random() > 0.38) return null;
  return liste[Math.floor(Math.random() * liste.length)];
}

export function ligneAccrocheMenu(jeuId) {
  const liste = ACCROCHES[jeuId];
  if (!liste?.length) return null;
  return liste[0];
}
