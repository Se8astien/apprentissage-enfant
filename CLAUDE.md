# Apprentissage Magique — Guide pour Claude

Application web éducative pour enfants du CP au CM2 (6–11 ans). Jeux de maths, langage, logique et musique avec un compagnon renard.

## Utilisateurs

**Les utilisateurs sont des enfants de 6 à 11 ans.** Toute décision UX doit partir de ce fait.

- Boutons larges, faciles à taper sur tablette ou téléphone avec un petit doigt
- Textes courts, mots simples, phrases directes — pas de jargon
- Feedback immédiat et positif — encourager même en cas d'erreur
- Pas de gestes complexes, pas de double-clic, pas de drag-and-drop
- Les icônes et emojis aident à comprendre sans lire
- Les animations et sons renforcent le plaisir et la compréhension
- Aucune action destructive sans confirmation claire (ex. : ne jamais perdre la progression)
- Les parents configurent l'app (choix de classe, genre) — les enfants jouent

## Architecture

**Vanilla JS + ES modules natifs** — pas de bundler, pas de framework, pas de dépendances d’exécution. Les seules dépendances **npm** sont en **dev** : Playwright pour les tests smoke (voir **Tests**).

```
index.html              ~700 lignes  — HTML statique, écrans cachés/visibles via JS
style.css              ~4700 lignes  — styles, catégories jeux, animations
app-state.js            ~380 lignes  — état partagé, constantes, helpers purs, rendu écrans
app-route.js             ~30 lignes  — étape onboarding/menu selon localStorage + helpers landing
app-renard.js           ~400 lignes  — compagnon renard (accessoires, dressing, streak)
app-nav.js              ~640 lignes  — navigation menu/jeu, combo, apresReponse, révision
app-init.js             ~660 lignes  — point d’entrée : init état, routeur, listeners boutons
app-gamification.js     ~270 lignes  — badges (27), missions du jour, stats de jeu
games-registry.js       ~120 lignes  — registre dynamique des lanceurs de jeux (source de vérité)
games-maths.js         ~1120 lignes  — jeux mathématiques (CP→CM2)
games-formes.js         ~900 lignes  — jeux géométrie/formes (CP→CM2)
games-temps.js          ~820 lignes  — jeux temps/mesures (CP→CM2)
games-argent.js         ~300 lignes  — jeux monnaie (CP→CE2)
games-avance.js         ~550 lignes  — jeux calcul avancé (CE1→CM2)
games-langage.js       ~2250 lignes  — jeux langage/français/langues (CP→CM2)
games-algo.js           ~320 lignes  — jeux algorithmie/logique (CP→CM2)
games-musique.js        ~120 lignes  — jeux musique/rythme (CP→CM2)
seo-pages.css            ~90 lignes  — style partagé des landing pages SEO
```

## État partagé (app-state.js)

L'état mutable est exposé via getters/setters pour éviter les imports circulaires :

```js
getBonneReponse() / setBonneReponse(v)   // réponse correcte de la question courante
getRepondu() / setRepondu(v)             // l'enfant a-t-il déjà répondu ?
getJeuCourant() / setJeuCourant(v)       // clé du jeu actif (ex: "addition")
getNiveauCourant()                       // 'cp' | 'ce1' | 'ce2' | 'cm1' | 'cm2'
getDifficulte()                          // 0=débutant | 1=normal | 2=expert
```

## Patterns clés

### Brancher CP / CE1 / CE2 / CM1 / CM2
```js
import { estCE1, estCE2, estCM1, estCM2, estGrand } from './app-state.js';

if (estCM2()) {
  // logique CM2
} else if (estCM1()) {
  // logique CM1
} else if (estCE2()) {
  // logique CE2
} else if (estCE1()) {
  // logique CE1
} else {
  // logique CP
}

// Adapter le ton selon l'âge (CM1/CM2 = plus mature) :
if (estGrand()) { /* "Excellent !", "Très bon travail !" */ }
```

### Difficulté progressive
```js
import { getDifficulte } from './app-state.js';
const diff = getDifficulte(); // 0, 1 ou 2

// Paramétrer un jeu selon la difficulté :
const maxVal = estCM2() ? [999999, 999999, 999999][diff]
             : estCM1() ? [99999,  99999,  99999][diff]
             : estCE2()  ? [9999,   9999,   9999][diff]
             : estCE1()  ? [30,     55,     79][diff]
             :              [5,      8,     10][diff];
```

### Valider une réponse
```js
import { apresReponse } from './app-nav.js';
btn.addEventListener('click', () => apresReponse(valeur, btn, getBonneReponse()));
```

### Valider une réponse texte (signe, décimal…)
```js
import { apresReponseTexte } from './app-nav.js';
btn.addEventListener('click', () => apresReponseTexte(texte, btn, getBonneReponse()));
```

### Générer des propositions
```js
import { propositionsAvecBonne, afficherChoix } from './app-state.js';
const props = propositionsAvecBonne(bonne, min, max, 3); // 3 fausses + 1 bonne
afficherChoix(props, (val, btn) => apresReponse(val, btn, getBonneReponse()));
```

### Ajouter un jeu
1. Créer `lancerMonJeu()` dans le fichier `games-*.js` approprié, puis l'exporter
2. Déclarer le jeu dans `games-registry.js` (clé `data-jeu` → `[module, nomExport]`)
3. Ajouter un bouton `.carte-jeu` dans `index.html` avec `data-jeu="monJeu"` et `data-niveaux="..."`
4. Ajouter sa description par classe dans `app-menu-descriptions.js`

## Niveaux et difficulté

- **Classe** (`cp`/`ce1`/`ce2`/`cm1`/`cm2`) : choisie à l'onboarding, stockée dans `localStorage`
- **Difficulté** (`0`/`1`/`2`) : progression automatique dans la session
  - 0 = Débutant → paramètres plus simples, visuels emoji
  - 1 = Normal → standard pour la classe
  - 2 = Expert → paramètres étendus, moins d'aide visuelle
- Après 10 bonnes réponses consécutives (combo ×10), difficulté proposée à la hausse
- CM1/CM2 (`estGrand()=true`) : messages sobres, compagnon renard moins enfantin (`nomGrand`)

## Compagnon renard (app-renard.js)

- 5 stades d'évolution selon les étoiles gagnées (0/21/61/151/301)
- Accessoires débloquables par streak : chapeau (3j), lunettes (7j), écharpe (30j)
- Couronne débloquée au stade 4 (renard légendaire)
- Jauges faim + bonheur diminuent avec le temps, se remplissent en jouant/nourrissant

## Gamification (app-gamification.js)

- 27 badges débloquables (premiers pas, streaks, maîtrise par jeu…)
- Missions du jour : 3 objectifs renouvelés chaque jour (ex. "Fais 10 additions")
- Stats de jeu : parties jouées, taux de réussite, meilleure série

## Mises à jour UX/IA récentes

- Outils de question enrichis : `💡 Indice` en 2 niveaux + `🐢 Relire lentement` (CP/CE1)
- Lecture auto de la consigne en CP (Web Speech quand dispo) : activable/désactivable dans l’espace parents (`localStorage` `am-lecture-auto-cp`, désactivé si `'0'`)
- Révision espacée : après erreur, rappels automatiques vers `+5` et `+15` questions avec mise en avant du bouton `🔁`
- Mission intelligente : une mission du jour peut cibler le jeu le plus fragile (`focus_jeu`) selon les stats, avec une courte phrase « pourquoi » dans le widget
- Retour menu : encart récap de la mini-session (réussites / à retravailler sur le jeu quitté)
- Espace parents : ajout d’un plan “3 exercices conseillés pour demain” basé sur les performances réelles
- Explications visuelles renforcées sur `addition`, `soustraction`, `fractions`
- Montée de difficulté plus fine : tient compte aussi du temps de réponse moyen récent
- Onboarding rapide : bouton `Commencer vite (Normal)` après choix de classe
- Navigation jeu mobile : bouton `← Retour au menu` en bas d’écran en plus du bouton haut
- Mode Duel à deux (`app-duel.js`) : bouton `⚔️ Duel à deux` au menu, deux joueurs alternent sur le même appareil (3 questions chacun), bannière de tour dans l'écran jeu, écran de résultat avec revanche
- Refonte conversion parent-centric : landing et pages SEO orientées problèmes parents (lecture difficile, concentration, écrans passifs), avec promesse claire, trust immédiat, preuves sociales, FAQ objections et CTA explicites

## Conventions

- **Vérifier la syntaxe** après chaque modification : `node --check fichier.js`
- **Toujours brancher dans l'ordre CM2 → CM1 → CE2 → CE1 → CP** (default)
- **Ne modifier que la branche concernée** sans toucher aux autres niveaux
- **Pas de commentaires** sauf pour les invariants non-évidents
- **Pas de bundler** — les modules ES natifs suffisent, tester dans un navigateur récent
- **Copy IA/SEO** : parler d’abord au parent décideur (résultat concret + effort/temps), puis à l’enfant dans l’expérience de jeu
- **Structure des pages SEO** : problème parent → solution/pédagogie → preuves → FAQ objections → CTA
- **Trust obligatoire au-dessus de la ligne de flottaison** : gratuité, sans inscription, espace parents protégé, compatibilité tablette/ordinateur

## Workflow de développement

**À chaque évolution, TOUJOURS :**

1. **Écrire les tests unitaires en premier** (TDD)
   - Définir le comportement attendu dans le test avant d’écrire le code
   - Tests doivent couvrir happy path + cas limites
   - Format : assertions claires, noms explicites
2. **Lancer les tests** : `npm run ci` (verify + lint)
3. **Écrire le code** pour passer les tests
4. **Vérifier** : `npm run ci` doit passer en vert
5. **Committer** avec message détaillé (pourquoi, pas quoi)
6. **Pousser** sur la branche de feature

Ce workflow garantit :
- ✅ Zéro régression — les tests existants passent toujours
- ✅ Qualité immédiate — logique validée avant implémentation
- ✅ Documentation vivante — tests décrivent le comportement attendu
- ✅ Confiance — changements sans peur

## Tests (smoke E2E)

- **Playwright** : `tests/e2e/smoke-menu.spec.js` vérifie :
  - menu + rythme affiché et synchronisation des boutons CP–CM2 (`aria-pressed` sur `#niveau-cp` …)
  - affichage d’aide douce après erreur sur un jeu
  - présence des éléments conversion de landing (promesse parent, trust, preuve sociale, CTA principal)
- Première installation : `npm install` puis `npx playwright install chromium`.
- Lancer : `npm run test:e2e` (démarre un serveur HTTP statique sur le dossier du projet, comme pour un navigateur réel).

## Livraison

- **Développer et committer directement sur `master`** — pas de branche de feature, pas de PR
- **Pousser sur `master`** : `git push -u origin master`
- Merger toute branche de travail sur `master` avant de considérer la tâche terminée
