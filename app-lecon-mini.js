// app-lecon-mini.js — Mini-leçon ciblée après 3 erreurs sur un même jeu

const LECONS = {
  // ── Maths de base ────────────────────────────────────────────────────────────
  addition: {
    emoji: "➕",
    titre: "Rappel : l'addition",
    texte: "Additionner = mettre des quantités ensemble pour trouver le total.",
    etapes: ["Part du plus grand nombre", "Avance du plus petit", "Ex : 7 + 3 → pars de 7, avance de 3 → 10"],
  },
  soustraction: {
    emoji: "➖",
    titre: "Rappel : la soustraction",
    texte: "Soustraire = enlever une quantité. Le résultat est toujours plus petit.",
    etapes: ["Commence par écrire la grande valeur", "Enlève la petite", "Ex : 9 − 4 → retire 4 de 9 → 5"],
  },
  multiplication: {
    emoji: "✖️",
    titre: "Rappel : la multiplication",
    texte: "Multiplier = faire des groupes de même taille.",
    etapes: ["3 × 4 = 3 groupes de 4", "Ou 4 groupes de 3 (même chose)", "Apprends ta table pour aller plus vite !"],
  },
  division: {
    emoji: "➗",
    titre: "Rappel : la division",
    texte: "Diviser = partager équitablement. Le résultat est plus petit.",
    etapes: ["12 ÷ 3 : combien de fois 3 entre dans 12 ?", "3 × 4 = 12, donc 12 ÷ 3 = 4", "Utilise ta table de multiplication à l'envers"],
  },
  compte: {
    emoji: "🔢",
    titre: "Rappel : compter",
    texte: "Compter, c'est associer un nombre à chaque objet, une seule fois.",
    etapes: ["Touche chaque objet une seule fois", "Dis un nombre à chaque touche", "Le dernier nombre dit = total"],
  },
  compare: {
    emoji: "⚖️",
    titre: "Rappel : comparer des nombres",
    texte: "Pour comparer, regarde d'abord le nombre de chiffres, puis chiffre par chiffre.",
    etapes: ["Plus de chiffres = plus grand (ex: 120 > 99)", "Même longueur : compare de gauche à droite", "< = plus petit, > = plus grand, = = égal"],
  },
  suite: {
    emoji: "🔢",
    titre: "Rappel : les suites de nombres",
    texte: "Une suite de nombres suit une règle : on ajoute ou on enlève toujours la même valeur.",
    etapes: ["Regarde les 2-3 premiers nombres", "Calcule la différence entre eux", "Continue en appliquant la même différence"],
  },
  doubles: {
    emoji: "2️⃣",
    titre: "Rappel : les doubles",
    texte: "Le double d'un nombre, c'est l'additionner avec lui-même.",
    etapes: ["Double de 4 = 4 + 4 = 8", "Double = × 2 (multiplier par 2)", "Ex : double de 7 = 7 × 2 = 14"],
  },
  moitie: {
    emoji: "½",
    titre: "Rappel : la moitié",
    texte: "La moitié d'un nombre, c'est le partager en 2 parts égales.",
    etapes: ["Moitié de 10 = 10 ÷ 2 = 5", "Moitié = ÷ 2 (diviser par 2)", "Astuce : c'est l'inverse du double"],
  },
  pairimpair: {
    emoji: "🔢",
    titre: "Rappel : pair et impair",
    texte: "Un nombre pair se divise exactement par 2. Un nombre impair non.",
    etapes: ["Regarde uniquement le dernier chiffre", "0, 2, 4, 6, 8 → pair", "1, 3, 5, 7, 9 → impair"],
  },
  dizaines: {
    emoji: "🔟",
    titre: "Rappel : les dizaines",
    texte: "Les dizaines groupent les unités par 10.",
    etapes: ["1 dizaine = 10 unités", "Compte les paquets de 10", "Ex : 30 = 3 dizaines et 0 unités"],
  },
  vraiFaux: {
    emoji: "✅",
    titre: "Rappel : vrai ou faux ?",
    texte: "Calcule le résultat de chaque côté et compare.",
    etapes: ["Calcule d'abord le membre gauche", "Calcule ensuite le membre droit", "Si égaux → VRAI, sinon → FAUX"],
  },
  perlesDorees: {
    emoji: "📿",
    titre: "Rappel : les perles dorées",
    texte: "Les perles dorées représentent les unités, dizaines, centaines et milliers.",
    etapes: ["Perle seule = 1 unité", "Barre de 10 perles = 1 dizaine", "Carré = 100, cube = 1000"],
  },
  planche100: {
    emoji: "🔢",
    titre: "Rappel : la planche des 100",
    texte: "La planche des 100 aide à visualiser les nombres et leurs voisins.",
    etapes: ["Ligne suivante = +10", "Colonne suivante = +1", "Repère les multiples de 5 et 10 en jaune/rouge"],
  },
  // ── Fractions & Décimaux ─────────────────────────────────────────────────────
  fractions: {
    emoji: "🍕",
    titre: "Rappel : les fractions",
    texte: "Une fraction montre combien de parts d'un tout on prend.",
    etapes: ["Le chiffre du bas = nombre total de parts égales", "Le chiffre du haut = parts qu'on prend", "1/4 d'une pizza = 1 part sur 4 égales"],
  },
  fractionsCM: {
    emoji: "🔢",
    titre: "Rappel : les fractions (CM)",
    texte: "On peut comparer, additionner et simplifier des fractions.",
    etapes: ["Même dénominateur (bas) : compare ou additionne les numérateurs", "Dénominateurs différents : trouve un dénominateur commun", "Simplifier : divise haut et bas par le même nombre"],
  },
  courseFractions: {
    emoji: "🏁",
    titre: "Rappel : fractions équivalentes",
    texte: "Des fractions différentes peuvent représenter la même quantité.",
    etapes: ["1/2 = 2/4 = 3/6 (même valeur, écriture différente)", "Multiplie haut et bas par le même nombre", "Divise haut et bas par le même nombre (simplification)"],
  },
  decimaux: {
    emoji: "🔢",
    titre: "Rappel : les décimaux",
    texte: "Un nombre décimal a une partie entière et une partie décimale séparées par une virgule.",
    etapes: ["Avant la virgule = partie entière", "Après la virgule = dixièmes, centièmes…", "Ex : 3,7 = 3 entiers et 7 dixièmes"],
  },
  // ── Géométrie ────────────────────────────────────────────────────────────────
  formes: {
    emoji: "🔷",
    titre: "Rappel : les formes géométriques",
    texte: "Les formes se distinguent par leur nombre de côtés et leurs angles.",
    etapes: ["Triangle = 3 côtés", "Carré/rectangle = 4 côtés", "Cercle = aucun côté droit, contour arrondi"],
  },
  symetrie: {
    emoji: "🔵",
    titre: "Rappel : la symétrie",
    texte: "Une figure est symétrique si elle se superpose exactement à son image miroir.",
    etapes: ["Plie la figure sur l'axe de symétrie", "Les deux moitiés se superposent parfaitement", "Chaque point a un « reflet » à égale distance de l'axe"],
  },
  angles: {
    emoji: "📐",
    titre: "Rappel : les angles",
    texte: "Un angle mesure l'ouverture entre deux demi-droites.",
    etapes: ["Angle droit = 90° (comme le coin d'une feuille)", "Angle aigu < 90°, angle obtus > 90°", "On mesure avec un rapporteur"],
  },
  perimetre: {
    emoji: "📏",
    titre: "Rappel : le périmètre",
    texte: "Le périmètre = la longueur du tour complet d'une figure.",
    etapes: ["Additionne tous les côtés", "Rectangle : P = (longueur + largeur) × 2", "Cercle : P = 2 × π × rayon (≈ 3,14)"],
  },
  aires: {
    emoji: "🟦",
    titre: "Rappel : l'aire",
    texte: "L'aire = la surface occupée à l'intérieur d'une figure.",
    etapes: ["Rectangle : A = longueur × largeur", "Triangle : A = (base × hauteur) ÷ 2", "Carré : A = côté × côté"],
  },
  geoConstructeur: {
    emoji: "📐",
    titre: "Rappel : construction géométrique",
    texte: "Pour construire une figure, suis les indications de mesure et d'angle.",
    etapes: ["Utilise la règle pour les longueurs", "Utilise le rapporteur pour les angles", "Vérifie que les côtés et angles correspondent bien à la consigne"],
  },
  // ── Temps, mesures, monnaie ───────────────────────────────────────────────────
  heure: {
    emoji: "🕐",
    titre: "Rappel : lire l'heure",
    texte: "La petite aiguille donne les heures, la grande donne les minutes.",
    etapes: ["Petite aiguille → heures", "Grande aiguille → minutes (× 5 par graduation)", "Ex : petite sur 3, grande sur 12 = 3h00"],
  },
  horlogeExpress: {
    emoji: "⏱️",
    titre: "Rappel : l'heure (express)",
    texte: "Entraîne-toi à lire l'heure rapidement.",
    etapes: ["Identifie d'abord les heures (petite aiguille)", "Compte ensuite les minutes (grande aiguille × 5)", "Ex : 3h30 = petite entre 3 et 4, grande sur 6"],
  },
  durees: {
    emoji: "⏳",
    titre: "Rappel : les durées",
    texte: "Une durée = le temps qui passe entre un début et une fin.",
    etapes: ["Durée = heure de fin − heure de début", "1 heure = 60 minutes", "Ex : 9h00 → 9h45 = 45 minutes de durée"],
  },
  calendrier: {
    emoji: "📅",
    titre: "Rappel : le calendrier",
    texte: "Le calendrier organise les jours, semaines, mois et années.",
    etapes: ["1 semaine = 7 jours (lundi → dimanche)", "1 an = 12 mois = 365 jours (366 si bissextile)", "Les mois ont 28, 29, 30 ou 31 jours"],
  },
  chronoDefi: {
    emoji: "⏱️",
    titre: "Rappel : le chrono",
    texte: "Réponds le plus vite possible, mais prends le temps de réfléchir.",
    etapes: ["Lis bien la question avant de répondre", "Si tu ne sais pas, élimine les mauvaises réponses", "Fais confiance à ta première intuition si tu hésites"],
  },
  mesures: {
    emoji: "📏",
    titre: "Rappel : les mesures",
    texte: "On mesure les longueurs en mm, cm, m, km selon la taille.",
    etapes: ["1 cm = 10 mm", "1 m = 100 cm = 1000 mm", "1 km = 1000 m"],
  },
  masse: {
    emoji: "⚖️",
    titre: "Rappel : les masses",
    texte: "On pèse en grammes (g) et kilogrammes (kg).",
    etapes: ["1 kg = 1 000 g", "Une pomme ≈ 150 g, un enfant ≈ 30 kg", "Pour convertir : × ou ÷ 1000"],
  },
  monnaiecp: {
    emoji: "🪙",
    titre: "Rappel : la monnaie (CP)",
    texte: "L'argent se compose de pièces (centimes et euros) et de billets.",
    etapes: ["1 € = 100 centimes", "Pièces : 1ct, 2ct, 5ct, 10ct, 20ct, 50ct, 1€, 2€", "Additionne les pièces pour trouver le total"],
  },
  monnaiece1: {
    emoji: "💶",
    titre: "Rappel : la monnaie (CE1)",
    texte: "Calculer la monnaie, c'est trouver combien on rend après un achat.",
    etapes: ["Prix − paiement donné = monnaie à rendre", "Ex : article 3€, tu donnes 5€ → on te rend 2€", "Utilise les billets et pièces pour payer juste"],
  },
  marcheMalin: {
    emoji: "🛒",
    titre: "Rappel : le marché",
    texte: "Au marché, il faut calculer le total des achats et vérifier la monnaie.",
    etapes: ["Additionne les prix de chaque article", "Vérifie si la somme payée est suffisante", "Calcule la monnaie à rendre si besoin"],
  },
  // ── Calcul avancé ────────────────────────────────────────────────────────────
  pourcentages: {
    emoji: "%",
    titre: "Rappel : les pourcentages",
    texte: "Un pourcentage exprime une proportion sur 100.",
    etapes: ["50% = la moitié (÷ 2)", "25% = le quart (÷ 4)", "10% = divise par 10, 1% = divise par 100"],
  },
  proportionnalite: {
    emoji: "⚖️",
    titre: "Rappel : la proportionnalité",
    texte: "Deux grandeurs sont proportionnelles si leur rapport est toujours le même.",
    etapes: ["Trouve le coefficient : divise une valeur par l'autre", "Applique le même coefficient aux autres valeurs", "Règle de trois : a/b = c/x → x = b×c÷a"],
  },
  probleme: {
    emoji: "🧩",
    titre: "Rappel : les problèmes",
    texte: "Un problème se résout en plusieurs étapes.",
    etapes: ["Lis bien toute la question avant de calculer", "Identifie ce qu'on cherche et ce qu'on sait", "Choisis l'opération, calcule, vérifie la réponse"],
  },
  problemesProgressifs: {
    emoji: "🧩",
    titre: "Rappel : problèmes à étapes",
    texte: "Les problèmes à étapes se résolvent en plusieurs calculs successifs.",
    etapes: ["Repère toutes les informations utiles", "Fais les calculs dans le bon ordre", "Vérifie que ta réponse a du sens"],
  },
  pourquoi: {
    emoji: "🤔",
    titre: "Rappel : comprendre le raisonnement",
    texte: "Comprendre POURQUOI une réponse est correcte, c'est plus fort que juste calculer.",
    etapes: ["Lis chaque explication attentivement", "Vérifie si l'explication est logique étape par étape", "Cherche l'explication qui décrit le vrai calcul"],
  },
  // ── Langage, lecture ─────────────────────────────────────────────────────────
  lecture: {
    emoji: "📖",
    titre: "Rappel : la lecture",
    texte: "Lire, c'est reconnaître des mots et leur donner du sens.",
    etapes: ["Regarde l'image pour deviner le contexte", "Déchiffre le mot syllabe par syllabe", "Relis la phrase entière pour vérifier le sens"],
  },
  lectureTexte: {
    emoji: "📄",
    titre: "Rappel : lire un texte",
    texte: "Pour comprendre un texte, lis lentement et relis si nécessaire.",
    etapes: ["Lis tout le texte une première fois", "Pour répondre aux questions, reviens chercher dans le texte", "Les réponses sont toujours dans le texte"],
  },
  lectureExpress: {
    emoji: "⚡",
    titre: "Rappel : lecture express",
    texte: "Entraîne-toi à reconnaître les mots rapidement.",
    etapes: ["Regarde la forme globale du mot", "Repère les premières et dernières lettres", "Le sens de la phrase t'aide à deviner"],
  },
  lecturePhrase: {
    emoji: "📝",
    titre: "Rappel : lire une phrase",
    texte: "Une phrase commence par une majuscule et se termine par un point.",
    etapes: ["Lis du début jusqu'au point", "Cherche le sujet (qui ?) et le verbe (fait quoi ?)", "Vérifie que la phrase a du sens"],
  },
  sons: {
    emoji: "🔊",
    titre: "Rappel : les sons",
    texte: "Les sons (phonèmes) s'associent pour former des syllabes et des mots.",
    etapes: ["Écoute bien le son demandé", "Cherche ce son dans chaque mot", "Prononce doucement pour mieux entendre"],
  },
  syllabes: {
    emoji: "🔤",
    titre: "Rappel : les syllabes",
    texte: "Une syllabe = un seul souffle de voix.",
    etapes: ['Tape dans tes mains pour chaque syllabe', '"ma-man" = 2 syllabes, "pa-pi-er" = 3 syllabes', "Compte les voyelles pour estimer le nombre de syllabes"],
  },
  // ── Français : orthographe & grammaire ───────────────────────────────────────
  grammaire: {
    emoji: "📝",
    titre: "Rappel : la grammaire",
    texte: "La grammaire, c'est les règles qui donnent du sens aux phrases.",
    etapes: ["Trouve d'abord le verbe (action)", "Puis cherche qui fait l'action (sujet)", "Le reste complète le sens"],
  },
  homophones: {
    emoji: "📖",
    titre: "Rappel : les homophones",
    texte: "Des mots qui sonnent pareil mais s'écrivent différemment selon leur sens.",
    etapes: ['« a » = verbe avoir → "Il a un chat"', '« à » = direction/lieu → "Je vais à l\'école"', 'Astuce : remplace par "avait" — si ça marche, c\'est "a"'],
  },
  homophonesAvances: {
    emoji: "📖",
    titre: "Rappel : homophones avancés",
    texte: "Ces/ses/c'est/s'est — leur sens dépend du contexte grammatical.",
    etapes: ['"ces/ses" = déterminants devant un nom (ces livres, ses jouets)', '"c\'est" = c\'est + nom/adjectif → remplace par "cela est"', '"s\'est" = verbe pronominal → remplace par "s\'était"'],
  },
  conjugaison: {
    emoji: "🕐",
    titre: "Rappel : la conjugaison",
    texte: "Conjuguer = changer la forme du verbe selon le sujet et le temps.",
    etapes: ["Identifie le sujet (je, tu, il, nous, vous, ils)", "Identifie le temps (présent, passé, futur)", "Applique les terminaisons correspondantes"],
  },
  conjugaisonMission: {
    emoji: "🎯",
    titre: "Rappel : conjuguer (mission)",
    texte: "Entraîne-toi à conjuguer rapidement avec les bons accords.",
    etapes: ["Identifie le groupe du verbe (1er en -er, 2e en -ir…)", "Cherche la terminaison selon sujet et temps", "Les verbes irréguliers ont leurs propres formes à mémoriser"],
  },
  atelierAccords: {
    emoji: "✍️",
    titre: "Rappel : les accords",
    texte: "Le sujet et le verbe s'accordent. Le nom et l'adjectif s'accordent.",
    etapes: ["Cherche le sujet du verbe → accorde le verbe", "Cherche le nom que décrit l'adjectif → accorde l'adjectif", "Pluriel : on ajoute souvent -s ou -ent"],
  },
  synonymes: {
    emoji: "🔤",
    titre: "Rappel : les synonymes",
    texte: "Des synonymes sont des mots qui ont le même sens (ou très proche).",
    etapes: ["Essaie de remplacer le mot dans la phrase", "Le sens de la phrase doit rester le même", "Ex : content / heureux / joyeux sont synonymes"],
  },
  vocabReseaux: {
    emoji: "🌐",
    titre: "Rappel : les réseaux de mots",
    texte: "Un réseau de mots regroupe des mots liés par un même thème.",
    etapes: ["Identifie le thème commun entre les mots", "Cherche le mot qui n'appartient pas au groupe", "Ou complète avec un mot du même thème"],
  },
  amisDesmots: {
    emoji: "🤝",
    titre: "Rappel : amis des mots",
    texte: "Les amis des mots, ce sont les familles de mots avec la même racine.",
    etapes: ["Cherche la racine commune (ex : chaud, chaleur, réchauffer)", "La racine porte le sens principal", "Les préfixes et suffixes changent le sens ou la nature"],
  },
  motsJungle: {
    emoji: "🌿",
    titre: "Rappel : vocabulaire",
    texte: "Enrichir son vocabulaire, c'est apprendre de nouveaux mots et leur sens.",
    etapes: ["Lis la définition ou le contexte autour du mot", "Cherche un mot proche que tu connais déjà", "Utilise le nouveau mot dans une phrase"],
  },
  orthopuzzle: {
    emoji: "🧩",
    titre: "Rappel : l'orthographe",
    texte: "L'orthographe, c'est la manière correcte d'écrire les mots.",
    etapes: ["Prononce le mot doucement pour entendre tous les sons", "Pense aux lettres muettes habituelles (e, s, t en fin de mot)", "Vérifie si le mot vient d'une famille que tu connais"],
  },
  orthopuzzleCE1: {
    emoji: "🧩",
    titre: "Rappel : orthographe CE1",
    texte: "Reconnais les sons complexes (ou, on, an, eau, ai…).",
    etapes: ['"ou" = son dans "loup"', '"an/en" = son dans "vent"', '"eau/au" = son dans "bateau"'],
  },
  orthopuzzleCE2: {
    emoji: "🧩",
    titre: "Rappel : orthographe CE2",
    texte: "Les accords et les mots invariables s'apprennent par l'usage.",
    etapes: ["Les mots invariables (mais, ou, et, donc…) ne changent jamais", "Pense aux accords : tout s'accorde avec le sujet ou le nom", "Connais les 30 mots les plus courants par cœur"],
  },
  orthopuzzleCM1: {
    emoji: "🧩",
    titre: "Rappel : orthographe CM1",
    texte: "Les homophones grammaticaux et les terminaisons verbales.",
    etapes: ["Er/é : remplace par vendre/vendu → si vendre convient, c'est « er »", "a/à : remplace par avait → si ça marche, c'est « a »", "on/ont : remplace par ils ont → si ça marche, c'est « ont »"],
  },
  orthopuzzleCM2: {
    emoji: "🧩",
    titre: "Rappel : orthographe CM2",
    texte: "Les accords complexes et la morphologie avancée.",
    etapes: ["Cherche le sujet et accorde le verbe correctement", "Les participes passés s'accordent selon les règles du COD", "Les mots de la même famille t'aident à deviner les lettres muettes"],
  },
  detectiveErreurs: {
    emoji: "🔍",
    titre: "Rappel : trouver les erreurs",
    texte: "Lis chaque phrase lentement et vérifie les accords, la ponctuation et l'orthographe.",
    etapes: ["Cherche d'abord les accords (sujet/verbe, nom/adjectif)", "Vérifie l'orthographe des mots connus", "Regarde la ponctuation (majuscule, virgule, point)"],
  },
  phraseMobile: {
    emoji: "📝",
    titre: "Rappel : construire une phrase",
    texte: "Une phrase correcte a un sujet, un verbe et respecte l'ordre des mots.",
    etapes: ["Commence par le sujet (qui fait l'action ?)", "Place le verbe juste après", "Ajoute les compléments pour donner plus d'informations"],
  },
  ponctuationPuzzle: {
    emoji: "❗",
    titre: "Rappel : la ponctuation",
    texte: "La ponctuation aide à comprendre le sens et le rythme d'un texte.",
    etapes: ["Le point . termine une phrase", "La virgule , marque une pause courte", "! = exclamation, ? = question, : = explication"],
  },
  comprendreTexte: {
    emoji: "📄",
    titre: "Rappel : comprendre un texte",
    texte: "Les réponses aux questions se trouvent toujours dans le texte.",
    etapes: ["Lis le texte entier d'abord", "Lis la question, puis cherche la réponse dans le texte", "Souligne ou mémorise les passages importants"],
  },
  comprendreTexteCE2: {
    emoji: "📄",
    titre: "Rappel : compréhension CE2",
    texte: "Repère les informations clés et l'idée principale du texte.",
    etapes: ["Identifie les personnages, le lieu, le moment", "Cherche l'idée principale de chaque paragraphe", "Les réponses sont explicites (dans le texte) ou implicites (à déduire)"],
  },
  comprendreTexteCM1: {
    emoji: "📄",
    titre: "Rappel : compréhension CM1",
    texte: "Distingue les informations explicites des informations à déduire.",
    etapes: ["Explicite = écrit clairement dans le texte", "Implicite = à déduire d'après le contexte", "Appuie chaque réponse sur un extrait précis du texte"],
  },
  comprendreTexteCM2: {
    emoji: "📄",
    titre: "Rappel : compréhension CM2",
    texte: "Analyse le point de vue, les émotions et l'intention de l'auteur.",
    etapes: ["Identifie qui parle et depuis quel point de vue", "Cherche le ton (humoristique, dramatique, informatif…)", "Les inférences te demandent de relier plusieurs informations"],
  },
  comprehensionAudio: {
    emoji: "🎧",
    titre: "Rappel : écoute et compréhension",
    texte: "Écoute attentivement et retiens les informations importantes.",
    etapes: ["Écoute d'abord sans chercher à tout noter", "Identifie les mots-clés : qui, quoi, où, quand", "Réponds en utilisant ce que tu as entendu"],
  },
  // ── Langues vivantes ─────────────────────────────────────────────────────────
  anglais: {
    emoji: "🇬🇧",
    titre: "Rappel : anglais",
    texte: "En anglais, l'ordre des mots est différent du français.",
    etapes: ["Sujet + verbe + complément (I eat apples)", "Les adjectifs se placent avant le nom (a big dog)", "Le verbe « be » : I am, you are, he is…"],
  },
  allemand: {
    emoji: "🇩🇪",
    titre: "Rappel : allemand",
    texte: "En allemand, les noms prennent toujours une majuscule.",
    etapes: ["Tous les noms communs s'écrivent avec une majuscule", "3 genres : der (m.), die (f.), das (n.)", "L'ordre des mots peut changer selon la construction"],
  },
  espagnol: {
    emoji: "🇪🇸",
    titre: "Rappel : espagnol",
    texte: "L'espagnol est phonétique : on prononce comme on écrit.",
    etapes: ["On prononce toutes les lettres", "Les accents indiquent la syllabe accentuée", "Masculin → souvent -o, féminin → souvent -a"],
  },
  italien: {
    emoji: "🇮🇹",
    titre: "Rappel : italien",
    texte: "L'italien ressemble au français par de nombreux mots.",
    etapes: ["Repère les mots similaires au français", "La prononciation est régulière, chaque lettre se prononce", "Masculin → souvent -o, féminin → souvent -a"],
  },
  portugais: {
    emoji: "🇵🇹",
    titre: "Rappel : portugais",
    texte: "Le portugais partage de nombreuses racines avec le français et l'espagnol.",
    etapes: ["Repère les mots proches du français (família, amigo…)", "Le -ão en fin de mot = -an/-ion en français", "Masculin → -o, féminin → -a en général"],
  },
  traduction: {
    emoji: "🌐",
    titre: "Rappel : la traduction",
    texte: "Traduire, c'est transmettre le sens d'une langue à l'autre, pas mot à mot.",
    etapes: ["Comprends d'abord le sens global de la phrase", "Cherche l'équivalent naturel dans l'autre langue", "Vérifie que le sens est bien le même"],
  },
  traductionAllemand: {
    emoji: "🇩🇪",
    titre: "Rappel : traduction allemand",
    texte: "Traduis le sens, pas les mots un à un.",
    etapes: ["Identifie le sujet et le verbe principal", "Cherche le vocabulaire clé dans ta mémoire", "L'ordre des mots peut changer entre les langues"],
  },
  traductionEspagnol: {
    emoji: "🇪🇸",
    titre: "Rappel : traduction espagnol",
    texte: "L'espagnol et le français partagent beaucoup de mots proches.",
    etapes: ["Repère les mots qui ressemblent au français", "Fais attention aux « faux amis » (embarazada ≠ embarrassée)", "Construis la phrase dans l'ordre naturel de l'espagnol"],
  },
  traductionItalien: {
    emoji: "🇮🇹",
    titre: "Rappel : traduction italien",
    texte: "Beaucoup de mots italiens ressemblent au français.",
    etapes: ["Repère les mots transparents (amico, famiglia…)", "Adapte la terminaison au genre et au nombre", "Respecte l'ordre des mots de l'italien"],
  },
  traductionPortugais: {
    emoji: "🇵🇹",
    titre: "Rappel : traduction portugais",
    texte: "Le portugais partage de nombreuses racines latines avec le français.",
    etapes: ["Cherche les ressemblances avec le français", "Le -ção correspond souvent à -tion en français", "Respecte l'accord en genre et en nombre"],
  },
  // ── Logique & Code ───────────────────────────────────────────────────────────
  sequence: {
    emoji: "🤖",
    titre: "Rappel : les algorithmes",
    texte: "Un algorithme = une suite d'instructions à suivre dans l'ordre.",
    etapes: ["Lis les instructions une par une, dans l'ordre", "Exécute chaque étape mentalement", "Vérifie le résultat final obtenu"],
  },
  code: {
    emoji: "💻",
    titre: "Rappel : la programmation",
    texte: "Un programme = des instructions que l'ordinateur exécute dans l'ordre.",
    etapes: ["Lis le code ligne par ligne", "Les variables stockent des valeurs qui peuvent changer", "Les boucles répètent des instructions plusieurs fois"],
  },
  labyrintheLogique: {
    emoji: "🧭",
    titre: "Rappel : logique et déduction",
    texte: "La logique consiste à raisonner étape par étape pour trouver la bonne réponse.",
    etapes: ["Élimine les réponses impossibles", "Utilise ce que tu sais pour déduire ce que tu ne sais pas", "Vérifie ta réponse en la retestant dans le problème"],
  },
  triLogique: {
    emoji: "🔀",
    titre: "Rappel : trier et classer",
    texte: "Trier, c'est ordonner selon un critère précis (taille, valeur, ordre alpha…).",
    etapes: ["Identifie le critère de tri (du plus petit au plus grand ?)", "Compare les éléments deux par deux", "Vérifie que l'ordre final respecte bien le critère"],
  },
  // ── Musique ──────────────────────────────────────────────────────────────────
  notesMelodie: {
    emoji: "🎵",
    titre: "Rappel : les notes de musique",
    texte: "Les 7 notes se répètent : do, ré, mi, fa, sol, la, si.",
    etapes: ["Apprends les notes dans l'ordre : do ré mi fa sol la si", "Sur une portée, les notes montent = sons plus aigus", "Chaque ligne ou espace de la portée correspond à une note"],
  },
  rythmeMagique: {
    emoji: "🥁",
    titre: "Rappel : le rythme",
    texte: "Le rythme, c'est la régularité et la durée des sons dans le temps.",
    etapes: ["Frappe dans tes mains pour sentir le tempo", "Noire = 1 temps, blanche = 2 temps, ronde = 4 temps", "Les silences (soupirs) comptent aussi dans le rythme"],
  },
  tempoSprint: {
    emoji: "⏱️",
    titre: "Rappel : le tempo",
    texte: "Le tempo = la vitesse de la musique, mesurée en battements par minute.",
    etapes: ["Lent (largo) ≈ 50 bpm, rapide (allegro) ≈ 140 bpm", "Le chef d'orchestre bat la mesure pour maintenir le tempo", "Entraîne-toi en tapant le rythme régulièrement"],
  },
  // ── Malo (jeux de déduction/stratégie) ───────────────────────────────────────
  aller10Malo: {
    emoji: "🎯",
    titre: "Rappel : aller à 10",
    texte: "Trouve les combinaisons qui font exactement 10.",
    etapes: ["1 + 9 = 10, 2 + 8 = 10, 3 + 7 = 10…", "Les compléments à 10 sont très utiles en calcul mental", "Mémorise ces paires : 1-9, 2-8, 3-7, 4-6, 5-5"],
  },
  compensationMalo: {
    emoji: "⚖️",
    titre: "Rappel : la compensation",
    texte: "La compensation = arrondir un nombre pour calculer plus facilement, puis corriger.",
    etapes: ["Ex : 38 + 25 → arrondi à 40 + 25 = 65, puis -2 = 63", "On arrondit pour tomber sur un multiple de 10", "On corrige ensuite avec la différence"],
  },
  doublesMalo: {
    emoji: "2️⃣",
    titre: "Rappel : les doubles (Malo)",
    texte: "Connaître les doubles aide à faire d'autres calculs rapidement.",
    etapes: ["Double de 5 = 10, double de 6 = 12, double de 7 = 14…", "Si tu connais 7 + 7 = 14, tu calcules vite 7 + 8 = 15", "Apprends les doubles de 1 à 10 par cœur"],
  },
  estimationMalo: {
    emoji: "🔭",
    titre: "Rappel : estimer",
    texte: "Estimer, c'est trouver une valeur approchée sans calculer exactement.",
    etapes: ["Arrondis chaque nombre au dizaine ou centaine proche", "Calcule avec les arrondis", "Vérifie si le résultat est du bon ordre de grandeur"],
  },
  planificationRenard: {
    emoji: "🦊",
    titre: "Rappel : planifier",
    texte: "Planifier, c'est organiser des actions dans le bon ordre pour atteindre un but.",
    etapes: ["Commence par définir le but final", "Identifie les étapes nécessaires", "Réfléchis à l'ordre optimal pour les réaliser"],
  },
  strategieMalo: {
    emoji: "♟️",
    titre: "Rappel : la stratégie",
    texte: "Une stratégie, c'est anticiper plusieurs coups à l'avance.",
    etapes: ["Pense à ce que tu veux obtenir", "Anticipe les conséquences de chaque action", "Choisis l'action qui t'amène le plus près de ton but"],
  },
  strategiemalo: {
    emoji: "♟️",
    titre: "Rappel : la stratégie",
    texte: "Une stratégie, c'est anticiper plusieurs coups à l'avance.",
    etapes: ["Pense à ce que tu veux obtenir", "Anticipe les conséquences de chaque action", "Choisis l'action qui t'amène le plus près de ton but"],
  },
};

const _erreursParJeuSession = Object.create(null);
let _leconAfficheeJeu = null;

export function signalerErreurLecon(jeuId) {
  if (!jeuId) return;
  _erreursParJeuSession[jeuId] = (_erreursParJeuSession[jeuId] || 0) + 1;
  if (_leconAfficheeJeu === jeuId) return;
  if (_erreursParJeuSession[jeuId] >= 3) {
    _leconAfficheeJeu = jeuId;
    afficherLeconMini(jeuId);
  }
}

export function reinitialiserLeconJeu(jeuId) {
  if (jeuId) delete _erreursParJeuSession[jeuId];
  if (_leconAfficheeJeu === jeuId) _leconAfficheeJeu = null;
}

export function afficherLeconMini(jeuId) {
  const lecon = LECONS[jeuId];
  if (!lecon) return;

  const overlay = document.createElement("div");
  overlay.className = "mini-lecon-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", lecon.titre);

  const etapesHtml = lecon.etapes
    .map((e, i) => `<li data-num="${i + 1}">${e}</li>`)
    .join("");

  overlay.innerHTML = `
    <div class="mini-lecon-carte">
      <div class="mini-lecon-emoji">${lecon.emoji}</div>
      <h3 class="mini-lecon-titre">${lecon.titre}</h3>
      <p class="mini-lecon-texte">${lecon.texte}</p>
      <ol class="mini-lecon-etapes">${etapesHtml}</ol>
      <button type="button" class="btn-mini-lecon-ok">C'est compris ! 💪</button>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.querySelector(".btn-mini-lecon-ok")?.focus();
  overlay.querySelector(".btn-mini-lecon-ok")?.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
}
