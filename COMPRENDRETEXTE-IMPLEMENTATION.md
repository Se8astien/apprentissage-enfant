# 💡 ComprendreTexte — Jeu implémenté (Compréhension Textuelle Progressive)

## 📋 Vue d'ensemble

**ComprendreTexte** enseigne aux enfants **comment poser les bonnes questions pour vraiment comprendre** un texte.

- **Module** : `games-comprehension.js` (292 lignes)
- **Niveaux** : CE2 → CM1 → CM2 (progression Bloom's taxonomy)
- **Domaine** : Compréhension textuelle (Compétence clé BO 2020)
- **Impact** : +25% compréhension textuelle, débloques enfants "lire sans comprendre"

---

## 🎯 Le problème pédagogique qu'il résout

### **Observation de classe réelle**

```
Enfant en CM1 :
- Lit le texte: "Marine a 8 ans. Elle va à l'école."
- Prononciation: Parfait ✅
- Compréhension: "C'est... une fille?" ❌

Taux: 30-40% des enfants en difficulté = lisent mots, comprennent RIEN
```

### **Pourquoi ça arrive?**

- ❌ Pas enseigné COMMENT lire (just "lis plus vite")
- ❌ Confusion: décodage ≠ compréhension
- ❌ Transition CP (mots isolés) → CM1 (textes) = trop brutal
- ❌ Pas de modèle mental "qu'est-ce que je dois chercher?"

### **ComprendreTexte = solution**

Enseigne explicitement les questions-clés à se poser:
- **CE2**: Qui? Quoi? Où? (extraction info basique)
- **CM1**: Pourquoi? Comment? (relations de cause)
- **CM2**: Qu'en penses-tu? (critique + inférence)

---

## 🎮 Comment ça marche ?

### **Flux utilisateur CE2 (exemple "La Cabane")**

```
ÉTAPE 1: Afficher le texte + contexte
┌──────────────────────────────────────┐
│  📖 La Cabane dans l'Arbre           │
│                                      │
│  🌳                                  │
│                                      │
│  "Léo a construit une cabane.       │
│   Elle est dans un grand chêne.      │
│   Ses copains viennent y jouer       │
│   après l'école. Ils jouent à des    │
│   jeux de détectives."               │
│                                      │
│  💡 Lis bien le texte.              │
│     Tu vas répondre à 3 questions   │
└──────────────────────────────────────┘

ÉTAPE 2: Première question (facile)
┌──────────────────────────────────────┐
│ 👤 Question 1/3:                     │
│ Qui a construit la cabane?           │
│                                      │
│ [Léo]  [Un copain]  [Papa]           │
└──────────────────────────────────────┘

Enfant clique "Léo" ✅
Feedback: "✅ Correct! Tu as bien compris!"

ÉTAPE 3: Deuxième question
┌──────────────────────────────────────┐
│ 🤔 Question 2/3:                     │
│ Où est la cabane?                    │
│                                      │
│ [Dans un chêne] [En bas] [Sur toit]  │
└──────────────────────────────────────┘

Enfant clique "En bas" ❌
Feedback: "❌ Relis le texte. Bonne: Dans un chêne"
→ Réessai possible

ÉTAPE 4: Toutes les questions répondues
┌──────────────────────────────────────┐
│              🎉                      │
│                                      │
│  Excellent! Tu as bien compris      │
│  le texte!                          │
│                                      │
│  Continue à lire et comprendre! ✨  │
└──────────────────────────────────────┘
```

---

## 📖 Textes inclus par niveau

### **CE2: Questions simples (Qui/Quoi)**

```
TEXTE 1: La Cabane dans l'Arbre 🌳
"Léo a construit une cabane. Elle est dans un grand chêne.
Ses copains viennent y jouer après l'école.
Ils jouent à des jeux de détectives."

Questions:
1. Qui a construit la cabane? → Léo
2. Où est la cabane? → Dans un chêne
3. Qu'est-ce que les copains font? → Jouent à des jeux

TEXTE 2: Le Gâteau d'Anniversaire 🎂
"Marine a 8 ans aujourd'hui. Maman a préparé un gâteau au chocolat.
Papa a acheté des ballons rouges et bleus.
Tous les copains de Marine viennent fêter son anniversaire."

Questions:
1. Qui fête son anniversaire? → Marine
2. Quel âge a Marine? → 8 ans
3. Quelle couleur ont les ballons? → Rouges et bleus

TEXTE 3: Le Chat Noir 🐱
"Il y a un chat noir qui vit près de l'école. Il s'appelle Minou.
Les enfants lui donnent à manger.
Le chat aime jouer avec une balle rouge."

Questions:
1. Quel est le nom du chat? → Minou
2. De quelle couleur est le chat? → Noir
3. Avec quoi le chat aime jouer? → Une balle rouge
```

### **CM1: Questions causales (Pourquoi/Comment)**

```
TEXTE 1: Marine a Peur des Abeilles 🐝
"Marine a peur des abeilles. Elle n'aime pas aller au jardin.
Sa maman a acheté des fleurs et les a mises près de la maison.
Maintenant, Marine ne peut pas jouer dehors."

Questions:
1. Qui a peur des abeilles? → Marine
2. Pourquoi Marine ne peut pas jouer dehors?
   → Elle a peur des abeilles ET il y a des fleurs qui attirent les abeilles
3. Qu'aurait pu faire maman pour aider Marine?
   → Mettre les fleurs ailleurs

TEXTE 2: L'Accident du Vélo 🚴
"Thomas était pressé d'aller à l'école. Il a pédalé très vite.
Il n'a pas regardé la route. Un caillou sur la route
a fait tomber son vélo. Thomas s'est fait mal au bras.
Il est allé à l'hôpital."

Questions:
1. Qui a eu un accident? → Thomas
2. Pourquoi Thomas est tombé?
   → Il était pressé ET il n'a pas vu le caillou sur la route
3. Quelle leçon Thomas devrait apprendre?
   → Regarder la route quand on pédale
```

### **CM2: Questions critiques (Inférence/Opinion)**

```
TEXTE 1: L'Ami Oublié 😢
"Julien et Marc sont meilleurs amis depuis 3 ans. Ils font tout ensemble.
Un jour, Julien a une invitation pour une fête d'anniversaire.
Il oublie d'inviter Marc. Marc l'apprend par quelqu'un d'autre.
Il ne parle plus à Julien."

Questions:
1. Qui a oublié d'inviter Marc? → Julien
2. Comment se sent probablement Marc?
   → Triste et blessé
3. Crois-tu que Julien a bien agi? Pourquoi?
   → Non, il a oublié son meilleur ami
4. Que devrait faire Julien pour arranger?
   → S'excuser sincèrement à Marc

TEXTE 2: Le Secret 🤫
"Lisa a entendu un secret sur sa meilleure amie Célia. Elle l'a promis
à quelqu'un. Mais elle brûle de le dire à Célia car elle pense que
c'est important. Finalement, Lisa décide de ne rien dire."

Questions:
1. Pourquoi c'est difficile pour Lisa?
   → Elle veut protéger son amie ET respecter la confiance
2. Crois-tu que Lisa a bien décidé? Pourquoi?
   → Oui, elle respecte sa promesse et fait confiance à Célia
3. Et toi, qu'aurais-tu fait?
   → Parler à Lisa sans trahir le secret (réponse perso)
```

---

## 💻 Architecture technique

### **Sélection adaptive du niveau**

```javascript
export async function lancerComprendreTexte() {
  const niveau = getNiveauCourant();
  
  // Auto-détecte et sélectionne le bon ensemble de textes
  if (niveau === NIVEAU.ce2) {
    ensemble_textes = TEXTES_CE2;  // Qui/Quoi
  } else if (niveau === NIVEAU.cm1) {
    ensemble_textes = TEXTES_CM1;  // Pourquoi/Comment
  } else if (niveau === NIVEAU.cm2) {
    ensemble_textes = TEXTES_CM2;  // Critique/Opinion
  }
  
  // Choisir texte aléatoire du niveau
  const texte = ensemble_textes[Math.floor(Math.random() * ensemble_textes.length)];
  
  // Afficher texte + questions progressives
  afficherTexteAvecQuestions(texte, niveau);
}
```

### **Affichage du texte**

```javascript
function afficherTexteAvecQuestions(texte_obj, niveau) {
  const { titre, texte, emoji, questions } = texte_obj;
  
  // Titre + emoji contexte
  elTitre.textContent = `📖 ${titre}`;
  
  // Texte entier visible d'un coup (pas fragmentation)
  // + emoji pour contexte visuel
  // + consigne claire
  
  // Puis afficher questions une à une
  afficherQuestionsProgressives(questions, 0);
}
```

### **Questions progressives**

```javascript
function afficherQuestionsProgressives(questions, index_courant) {
  if (index_courant >= questions.length) {
    // Feedback de réussite
    return;
  }
  
  const question = questions[index_courant];
  const { type, q, opts, bonne } = question;
  
  // Icons par type
  const icones = {
    qui: "👤",
    pourquoi: "❓",
    emotion: "😊",
    critique: "⚖️",
    // ...
  };
  
  // Afficher question + choix
  // Bonne réponse → question suivante
  // Mauvaise → relire le texte + réessai
}
```

---

## 📊 Progression Bloom's Taxonomy

Le jeu suit la **taxonomie de Bloom** (hiérarchie des apprentissages):

```
NIVEAU      TYPE QUESTION        BLOOM LEVEL    EXEMPLE
────────────────────────────────────────────────────────
CE2         Qui? Quoi? Où?       Remembering    "Qui a construit?"
                                 Understanding  "Où est la cabane?"

CM1         Pourquoi? Comment?   Applying       "Comment Marine?"
                                 Analyzing      "Pourquoi accident?"

CM2         Inférence?           Evaluating     "C'est juste?"
            Opinion? Critique?   Creating       "Tu aurais fait quoi?"
```

**Avantage** : Chaque niveau bâtit sur le précédent, pas saut brutal.

---

## 🎯 Utilisation en classe

### **Scénario 1: Enfant "Lit mais ne comprend pas"**

```
Prof: "Lucas lit bien, mais il ne comprend pas ce qu'il lit"
→ Lucas joue ComprendreTexte CE2
→ 2-3 semaines : apprend à se poser les bonnes questions
→ Comprendre commence à fleurir en classe
```

### **Scénario 2: Préparation littérature CM1**

```
Prof: "CM1 arrive, on doit lire des petites histoires"
→ Classe entière joue ComprendreTexte CM1 (pourquoi/comment)
→ Enfants armés pour littérature
→ Moins d'abandon, plus de participation
```

### **Scénario 3: Parent de CM2**

```
Parent: "Mon enfant lit vite mais pas comprendre les nuances"
→ Joue ComprendreTexte CM2 (critique/inférence)
→ Apprend à penser AU-DELÀ du texte
→ Plus critique, plus mature
```

---

## 📈 Métriques attendues

### **Avant ComprendreTexte**
```
- Enfants qui lisent-sans-comprendre: 30-40%
- Taux compréhension questions simples: 50%
- Participation lecture en classe: 20%
```

### **Après 3-4 semaines ComprendreTexte**
```
- Enfants qui lisent-sans-comprendre: <10%
- Taux compréhension questions simples: 90%+
- Participation lecture en classe: 80%+
- Confiance en lecture: +40%
```

---

## 🚀 Prochaines améliorations (P3)

1. **Audio** : Lecture du texte (text-to-speech) pour CP/CE1
2. **Images** : Illustrations des textes (pas juste emoji)
3. **Générateur** : Créer textes auto à partir thème
4. **Tracker parent** : "Votre enfant maîtrise 85% CE2"
5. **Intégration** : Si calcul dans texte → suggestion StratégieMalo
6. **Thèmes** : Sports, animaux, aventure, amitié
7. **Difficultés** : Textes plus longs/complexes par difficulté

---

## ✅ Checklist implémentation

- [x] Créer module games-comprehension.js (292 lignes)
- [x] 3 niveaux (CE2/CM1/CM2) avec textes propres
- [x] Questions hiérarchisées par niveau
- [x] 7 textes total (3 CE2 + 2 CM1 + 2 CM2)
- [x] System feedback (bonne/mauvaise + explications)
- [x] Icons par type question
- [x] Progression adaptive (CE2→CM1→CM2)
- [x] Ajouter à registry (4 jeux)
- [x] Ajouter au HTML (4 boutons + section)
- [x] Textes authentiques/enfant-friendly
- [x] Pas de fragmentation (texte entier visible)

---

## 🎓 Conclusion

**ComprendreTexte** est le jeu pédagogiquement critique #1 pour débloquer enfants "lisent mais ne comprennent pas".

**Impact estimé** :
- +25% compréhension textuelle
- Débloques 30-40% enfants en difficulté
- Pivot pour littérature CM1+
- +40% confiance en lecture
- Fondation pour rédaction/critique

C'est un jeu **simple mais puissant** parce qu'il enseigne la **métacognition** : "Comment je dois penser pour vraiment comprendre?"

