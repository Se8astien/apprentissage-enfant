# PLAN — Compagnon renard évolutif

> **À valider avant de coder.** Chaque étape = 1 commit atomique.
> Phase 1 (MVP) en 5 étapes. Phase 2 en 4 étapes supplémentaires.

---

## Analyse de l'existant

| Point d'ancrage | Fichier | Ligne |
|---|---|---|
| Fox emoji header | `index.html` | 933 — `<div class="mascotte">🦊</div>` |
| Fox emoji genre-screen | `index.html` | 946 — `<div class="genre-mascotte">🦊</div>` |
| Étoiles localStorage | `index.html` | `STORAGE_KEY = "maths-cp-etoiles"` |
| `ajouterEtoiles(n)` | `index.html` | ~l.1280 — ajoute au total, met à jour `elTotal` |
| `apresReponse()` | `index.html` | ~l.1230 — hook correct/incorrect |
| `confetti()` | `index.html` | ~l.260 — réutilisable |
| Écrans existants | `index.html` | `#ecran-genre`, `#ecran-menu`, `#ecran-jeu` |

### Stratégie d'intégration

- **Zéro modification** aux fonctions de jeu existantes
- Hook via **wrapper** sur `ajouterEtoiles` pour intercepter les gains d'étoiles
- Nouveaux écrans ajoutés **en dehors** du flux existant (`#ecran-nommage`, `#ecran-maison`)
- Tout le state renard dans ses propres clés localStorage

---

## Nouvelles clés localStorage

```
renard-nom          → "Foxy"  (string, max 12 chars)
renard-naissance    → "2024-09-01" (ISO date)
renard-stade-vu     → 0  (stade affiché pour détecter l'évolution)
```

*(Phase 2 : renard-faim, renard-bonheur, renard-streak, renard-accessoires)*

---

## SVG renard — design (5 stades)

Fox SVG hand-coded, viewBox 0 0 100 120, composé de :
- Oreilles (triangles), tête (ellipse), blanc du ventre
- Yeux (2 cercles blanc + pupille + brillance)
- Nez (ellipse), sourire (arc path)
- Joues roses (opacité 40%)

**Différences visuelles par stade :**

| Stade | Nom | Couleur corps | Yeux | Extra |
|---|---|---|---|---|
| 0 (0–20 ⭐) | Bébé renard | `#f5b97e` sable | `#3d2b1f` | Corps compact, oreilles rondes |
| 1 (21–60 ⭐) | Jeune renard | `#e8872a` orange | `#1a1a1a` | + grand, sourire large |
| 2 (61–150 ⭐) | Renard malin | `#c96416` orange foncé | `#0d0d0d` | Sourcils malins, clin d'œil |
| 3 (151–300 ⭐) | Renard magique | `#9c59d1` violet | `#4b0082` | Particules ✨ CSS autour |
| 4 (301+ ⭐) | Renard légendaire | `#ffd700` doré | `#c8860a` | Couronne SVG au sommet |

Animation **idle** (Ma Maison uniquement) : `@keyframes` breathing (scaleY 0.98↔1.01 sur 3s) + blinking (eyes scaleY 0→1 toutes les 4s).

---

## Phase 1 — MVP (5 commits)

### Étape 1 — SVG renard + 5 stades dans le header
**Durée estimée : 20 min**

- Créer `svgRenard(stade, taille)` → retourne string SVG
- Créer `getStade(etoiles)` → 0..4 selon les seuils
- Remplacer `🦊` (header l.933) et `🦊` (genre-screen l.946) par l'SVG réactif
- La mascotte header se met à jour à chaque gain d'étoiles
- Commit : `"Renard : SVG du compagnon avec 5 stades visuels"`

---

### Étape 2 — Nommage premier lancement
**Durée estimée : 15 min**

- Au démarrage : si `renard-nom` absent → afficher `#ecran-nommage` avant `#ecran-genre`
- HTML : champ texte (maxlength=12), bouton "C'est parti !", renard SVG bébé animé
- Valider (trim, fallback "Foxy"), stocker `renard-nom` + `renard-naissance`
- Enchaîner sur `#ecran-genre` normalement
- Si renard-nom présent → afficher en header un badge `[Nom] 🦊`
- Commit : `"Renard : écran de nommage au premier lancement"`

---

### Étape 3 — Évolution avec animation
**Durée estimée : 15 min**

- Wrapper sur `ajouterEtoiles` :
  ```js
  const _ajouterEtoilesOriginal = ajouterEtoiles;
  ajouterEtoiles = function(n) {
    const avant = lireEtoiles();
    _ajouterEtoilesOriginal(n);
    const apres = lireEtoiles();
    if (getStade(apres) > getStade(avant)) declencherEvolution(getStade(apres));
    mettreAJourRenardHeader();
  };
  ```
- `declencherEvolution(stade)` : overlay centré avec renard zoomé + confettis + message
  `"✨ Ton renard évolue ! Il devient [Nom du stade] !"` + bouton fermer
- Stocker `renard-stade-vu` pour ne déclencher qu'une fois
- Commit : `"Renard : système d'évolution avec animation spectaculaire"`

---

### Étape 4 — Écran Ma Maison
**Durée estimée : 20 min**

- Ajouter bouton `🏠 Ma Maison` en bas du menu (avant `#btn-changer-genre`)
- Nouvel écran `#ecran-maison` avec :
  - `← Retour` (vers menu)
  - Grand renard SVG animé (taille 180px) avec animation breathing CSS
  - Nom + stade (`"[Nom] — Renard malin"`)
  - `"Tu as [Nom] depuis X jours"` (calcul depuis `renard-naissance`)
  - Barre de progression vers prochain stade avec étoiles restantes
  - ⭐ total affiché en grand
- CSS : `#ecran-maison` suit le même pattern `.ecran` existant
- Commit : `"Renard : écran Ma Maison avec renard animé"`

---

### Étape 5 — Réaction renard sur bonne/mauvaise réponse
**Durée estimée : 15 min**

- Ajouter `<div id="renard-reaction" aria-hidden="true"></div>` dans `#ecran-jeu`
- Dans le wrapper `ajouterEtoiles` (bonne réponse) : déclencher `.renard-saute`
- Dans `apresReponse` (mauvaise réponse) : déclencher `.renard-encourage`
- CSS :
  - `.renard-saute` : fox slide-in depuis bas droite, bounce, slide-out (1.5s total)
  - `.renard-encourage` : fox apparaît, hoche la tête, disparaît
- Bulle de texte au-dessus du fox : bonne réponse = `"Ouais ! 🎉"`, mauvaise = `"Tu y es presque !"` (jamais de réprimande)
- Commit : `"Renard : réaction visuelle sur bonne et mauvaise réponse"`

---

## Phase 2 — Enrichissement (4 commits)

### Étape 6 — Jauges Faim & Bonheur
- `renard-faim` et `renard-bonheur` (0–100), décroissance temporelle calculée à l'ouverture
- Affichage dans Ma Maison : barres colorées animées
- Bouton "Nourrir 🍎" (coûte 2 ⭐, +30 faim), "Câlin ❤️" (1x/jour, +20 bonheur)
- Fox triste visuellement si faim ou bonheur < 20% (yeux tombants en SVG)
- Commit : `"Renard : jauges Faim et Bonheur avec décroissance temporelle"`

### Étape 7 — Streak quotidien 🔥
- `renard-streak` : `{lastVisit, count}` dans localStorage
- Calcul au démarrage : même jour → rien, jour suivant → +1, sinon → reset doux
- Affichage 🔥 dans le header avec le nombre
- Paliers J+3, J+7, J+30 : débloquer accessoires (chapeau, lunettes, écharpe)
- Message bienveillant si streak brisé : "Le renard t'a attendu, mais il est content que tu sois là !"
- Commit : `"Renard : streak quotidien 🔥 avec récompenses paliers"`

### Étape 8 — Garde-robe & accessoires
- `renard-accessoires` : array d'IDs débloqués, `renard-tenue` : IDs actifs
- 6 accessoires définis : chapeau J+3, lunettes J+7, écharpe J+30, couronne stade 4, etc.
- Écran Dressing accessible depuis Ma Maison : grille d'accessoires, clic pour équiper
- `svgRenard` accepte un objet `accessoires` qui superpose les SVG d'accessoires
- Commit : `"Renard : garde-robe et accessoires débloquables"`

### Étape 9 — Combo 5 bonnes réponses d'affilée
- Compteur `comboActuel` remis à 0 sur mauvaise réponse
- Combo ×5 : overlay "Ton renard est fier ! ⭐ Bonus !" + 1 étoile bonus
- Combo ×10 : idem + 3 étoiles bonus
- Commit : `"Renard : système de combo avec bonus étoiles"`

---

## Fichiers touchés

| Fichier | Nature des changements |
|---|---|
| `index.html` | Ajout HTML écrans + CSS + JS inline |
| `app.js` | Miroir des mêmes changements JS |
| `style.css` | Miroir du CSS ajouté (pour app.js) |

## Garanties

- ✅ Zéro modification des fonctions de jeu (`lancerXxx`, `apresReponse` original)
- ✅ 100% localStorage, aucun réseau
- ✅ Mobile-first (tailles en `clamp`, touch-friendly)
- ✅ Dégradation gracieuse : si localStorage bloqué → fox statique, jeux fonctionnent
- ✅ RGPD : aucune donnée ne quitte le navigateur

---

*En attente de validation pour démarrer l'Étape 1.*
