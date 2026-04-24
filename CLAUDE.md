# Apprentissage Magique — Guide pour Claude

Application web éducative pour enfants CP/CE1/CE2 (6–9 ans). Jeux de maths et de langage avec un compagnon renard.

## Architecture

**Vanilla JS + ES modules natifs** — pas de bundler, pas de framework, pas de dépendances.

```
index.html          ~190 lignes  — HTML statique, écrans cachés/visibles via JS
style.css          ~1400 lignes  — styles, catégories jeux, animations
app-state.js        ~290 lignes  — état partagé, constantes, helpers purs
app-renard.js       ~360 lignes  — compagnon renard (accessoires, dressing, streak)
app-nav.js          ~215 lignes  — navigation, combo, apresReponse
app-init.js         ~185 lignes  — point d'entrée, map lanceurs, event listeners
games-maths.js      ~730 lignes  — 9 jeux mathématiques
games-formes.js     ~570 lignes  — 5 jeux géométrie/formes
games-temps.js      ~525 lignes  — 4 jeux temps/mesures
games-argent.js     ~240 lignes  — 2 jeux monnaie
games-avance.js     ~300 lignes  — 3 jeux avancés (multiplication, division, problèmes)
games-langage.js    ~360 lignes  — 4 jeux langage/anglais
```

## État partagé (app-state.js)

L'état mutable est exposé via getters/setters pour éviter les imports circulaires :

```js
getBonneReponse() / setBonneReponse(v)   // réponse correcte de la question courante
getRepondu() / setRepondu(v)             // l'enfant a-t-il déjà répondu ?
getJeuCourant() / setJeuCourant(v)       // clé du jeu actif (ex: "addition")
getNiveauCourant()                       // 'cp' | 'ce1' | 'ce2'
getDifficulte()                          // 0=débutant | 1=normal | 2=expert
```

## Patterns clés

### Brancher CP / CE1 / CE2
```js
import { estCE1, estCE2 } from './app-state.js';

if (estCE2()) {
  // logique CE2
} else if (estCE1()) {
  // logique CE1
} else {
  // logique CP
}
```

### Difficulté progressive
```js
import { getDifficulte } from './app-state.js';
const diff = getDifficulte(); // 0, 1 ou 2

// Paramétrer un jeu selon la difficulté :
const maxVal = estCE2() ? [300, 600, 999][diff]
             : estCE1() ? [30,  55,  79][diff]
             :             [5,   8,  10][diff];
```

### Valider une réponse
```js
import { apresReponse } from './app-nav.js';
btn.addEventListener('click', () => apresReponse(valeur, btn, getBonneReponse()));
```

### Générer des propositions
```js
import { propositionsAvecBonne, afficherChoix } from './app-state.js';
const props = propositionsAvecBonne(bonne, min, max, 3); // 3 fausses + 1 bonne
afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
```

### Ajouter un jeu
1. Créer `lancerMonJeu()` dans le fichier `games-*.js` approprié, l'exporter
2. L'importer dans `app-init.js` et l'ajouter à la map `lanceurs`
3. Ajouter un bouton `.carte-jeu` dans `index.html` avec `data-jeu="monJeu"`

## Niveaux et difficulté

- **Classe** (`cp`/`ce1`/`ce2`) : choisie à l'onboarding, stockée dans `localStorage`
- **Difficulté** (`0`/`1`/`2`) : progression automatique dans la session
  - 0 = Débutant → parametres plus simples, visuels emoji
  - 1 = Normal → standard pour la classe
  - 2 = Expert → paramètres étendus, moins d'aide visuelle
- Après 10 bonnes réponses consécutives (combo ×10), difficulté proposée à la hausse

## Compagnon renard (app-renard.js)

- 5 stades d'évolution selon les étoiles gagnées (0/21/61/151/301)
- Accessoires débloquables par streak : chapeau (3j), lunettes (7j), écharpe (30j)
- Couronne débloquée au stade 4 (renard légendaire)
- Jauges faim + bonheur diminuent avec le temps, se remplissent en jouant/nourrissant

## Conventions

- **Vérifier la syntaxe** après chaque modification : `node --check fichier.js`
- **Ne modifier que la branche concernée** (CE2, CE1 ou CP) sans toucher aux autres
- **Pas de commentaires** sauf pour les invariants non-évidents
- **Pas de bundler** — les modules ES natifs suffisent, tester dans un navigateur récent
- `git checkout master` pour les livraisons finales
