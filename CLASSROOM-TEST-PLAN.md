# 🧪 Plan de Test en Classe — Apprentissage Magique

**Objectif**: Valider l'efficacité pédagogique des 10 jeux (3 Phase 1 + 7 Phase 2) en conditions réelles classroom.

---

## 📋 Phase 1: Préparation (Semaine 1)

### 1.1 Identifier les écoles/classes pilotes

**Critères:**
- ✅ Au moins 2-3 écoles (élémentaire + primaire)
- ✅ Niveaux couverts: CP, CE1, CE2, CM1, CM2
- ✅ Accès à 1-2 salles avec tablettes/ordinateurs
- ✅ Enseignant motivé pour test 6 semaines
- ✅ Permission parentale (formulaire RGPD simple)

**Coordination:**
- [ ] Contacter directrices/enseignants volontaires
- [ ] Fournir formulaire consent parents
- [ ] Planifier calendrier d'accès aux salles

### 1.2 Préparer les enfants

**Information:**
- Présenter l'app comme "jeu d'apprentissage nouveau"
- Pas examen, pas notes = juste pour apprendre
- Donnez les niveaux (CP/CE1/etc) correctement dans onboarding

**Setup technique:**
- [ ] Tester wifi/connexion tablettes/ordis
- [ ] Installer navigateur moderne (Chrome/Firefox/Safari)
- [ ] Créer 2-3 profils test (garçon/fille, niveaux différents)

---

## 🎮 Phase 2: Baseline (Semaine 1-2)

### 2.1 Évaluation de départ

**Pour chaque enfant (30 min):**
- [ ] Math: level au-dessus, vitesse calcul mental (+ comparer 5 résultats)
- [ ] Lecture: lire petit texte, comprehension questions (% réussite)
- [ ] Orthographe: dicter 10 mots, scorer homophones/pluriels (% errors)

**Enregistrement:**
```
BASELINE_DATA.csv:
enfant_id, niveau, math_vitesse, lecture_comprehension, ortho_errors, date
```

### 2.2 Jouer sans les 3 jeux P1

Pendant 5 jours, enfants jouent TOUS les autres jeux (40+ existants), PAS StratégieMalo/ComprendreTexte/OrthoPuzzle.

**But**: Voir si jeux non-cibles améliorent les scores.

**Attendre**: Stabilisation des scores (à la ligne de base).

---

## 🎯 Phase 3: Introduction Games P1 (Semaine 3-4)

### 3.1 StratégieMalo (calcul mental)

**Durée**: 4 sessions de 10 min/semaine, 2 semaines

**Plan:**
- Jour 1-3: Doubles (CE1)
- Jour 4-6: Aller à 10 (CE2)
- Jour 7-10: Compensation (CM1)
- Jour 11-14: Estimation (CM2)

**Mesure:**
- [ ] Temps de réponse par calcul (via logging)
- [ ] % erreurs calcul mental post-jeu
- [ ] Observer: Les enfants utilisent-ils la stratégie hors-jeu ?

**Hypothèse**: +40% vitesse, -50% erreurs après 2 semaines

### 3.2 ComprendreTexte (lecture)

**Durée**: 3 sessions de 10 min/semaine, 2 semaines

**Plan:**
- Jour 1-4: Qui/Quoi/Où (CE2)
- Jour 5-8: Pourquoi/Comment (CM1)
- Jour 9-14: Inférence/Critique (CM2)

**Mesure:**
- [ ] % réussite questions compréhension
- [ ] Relire-t-il pour chercher indices ?
- [ ] Engagement en lecture en classe?

**Hypothèse**: +25% compréhension, unlock 30-40% enfants "lire sans comprendre"

### 3.3 OrthoPuzzle (orthographe)

**Durée**: 3 sessions de 10 min/semaine, 2 semaines

**Plan:**
- Jour 1-3: Homophones (et/est, a/à, on/ont) (CE1)
- Jour 4-6: Sons complexes (c/ç, g/j, é/è/ê) (CE2)
- Jour 7-10: Pluriels/accords (chats, baux, verbes) (CM1)
- Jour 11-14: Difficultés CM2 (leur/leurs, c'est/ça) (CM2)

**Mesure:**
- [ ] % réussite homophones
- [ ] % accords verbe-sujet en écriture libre
- [ ] Erreurs dictée = moins de fautes ?

**Hypothèse**: +35% maîtrise orthographe, -40% erreurs homophones

---

## 📊 Phase 4: Mesure Post-Intervention (Semaine 5-6)

### 4.1 Révaluation

**Mêmes tests qu'au baseline, APRÈS 2 sem jeux P1:**
- [ ] Calcul mental: vitesse + % erreurs
- [ ] Lecture: % compréhension questions
- [ ] Orthographe: dictée (homophones, pluriels, accords)

**Comparaison:**
```
RESULTS_DATA.csv:
enfant_id, baseline_math_time, post_math_time, improvement_%, 
baseline_reading, post_reading, improvement_%,
baseline_ortho_errors, post_ortho_errors, improvement_%
```

### 4.2 Observations qualitatives

**Pour chaque jeu P1:**

**StratégieMalo:**
- [ ] Enfant parle-t-il de stratégies hors-jeu ? ("Je fais 8+2+5!")
- [ ] Applique-t-il au calcul mental en classe ?
- [ ] Plus confiant en calcul ? (demander)

**ComprendreTexte:**
- [ ] Relit-il spontanément pour chercher indices ?
- [ ] Participe plus en littérature en classe ?
- [ ] Pose-t-il des questions de compréhension ?

**OrthoPuzzle:**
- [ ] Hésite moins entre homophones ?
- [ ] Autocorriges les accords en rédaction ?
- [ ] Demande-t-il "c'est et/est ?" moins souvent ?

---

## 🎮 Phase 5: Tests P2 Games (Optional, Semaine 6-7)

Si P1 games valides, tester 2-3 P2 games avec sous-groupe:

### 5.1 VocabRéseaux (vocabulaire)

**Mesure:**
- Écriture libre avant/après: richesse vocab (+% synonymes)
- Reconnaissance mots: peut-il grouper par sens ?

### 5.2 ProblèmesProgressifs (problèmes Math)

**Mesure:**
- % réussite problèmes multi-étapes avant/après
- Décompose-t-il les problèmes mieux ? (observe)

### 5.3 LectureExpress (lecture rapide)

**Mesure:**
- Vitesse lecture (mots/min) + % compréhension
- Peut-il lire + comprendre en 5 min au lieu de 15 min ?

---

## 📈 Analyse des Résultats

### Métriques clés

| Jeu | Hypothèse | Mesure | Success = |
|------|-----------|--------|-----------|
| **StratégieMalo** | +40% vitesse | Temps réponse moyen | 8+7 < 3sec (vs 10sec avant) |
| | -50% erreurs | % calculs corrects | 90%+ (vs 50% avant) |
| **ComprendreTexte** | +25% compréhension | % questions justes | 90%+ (vs 65% avant) |
| | Unlock 30-40% | Enfants "lisent comprendre" | Passent de 30% → 85% |
| **OrthoPuzzle** | +35% orthographe | % homophones justes | 90%+ (vs 55% avant) |
| | -40% erreurs | Erreurs dictée | -10 fautes sur 50 mots |

### Analyse statistique

**Pour chaque métrique:**
1. Comparer baseline vs post-intervention
2. T-test statistique (p < 0.05 = significatif)
3. Effect size (Cohen's d: 0.2=petit, 0.5=moyen, 0.8=grand)

**Exemple:**
```
StratégieMalo - Calcul mental vitesse:
- Baseline: moyenne 8.5 sec par calc (SD=2.1)
- Post: moyenne 4.2 sec par calc (SD=1.8)
- Amélioration: 50% (!), t-test p=0.001, d=2.1 (énorme!)
→ SUCCÈS
```

---

## 🗣️ Retours Qualitatifs

### Interviews courtes (5 min par enfant)

**Questions:**
1. "Quel jeu t'a le plus aidé ? Pourquoi ?"
2. "As-tu remarqué que tu calcules / lis / écris mieux ?"
3. "Tu veux continuer à jouer ?"

**Réponses à collecter:**
- Citation enfant
- Catégoriser: "A aidé" vs "Pas aidé" vs "Amusant mais inutile"

### Entretiens enseignants (15 min)

**Points:**
1. "Avez-vous remarqué des changements en classe ?"
2. "Quels jeux ont eu le + d'impact ?"
3. "Manquait-il quelque chose ?"
4. "Vous recommanderiez à d'autres profs ?"

---

## 🚀 Résultats Attendus

### Succès total (tous les critères met):
- ✅ StratégieMalo: +40% vitesse, -50% erreurs, Enfants demandent de rejouer
- ✅ ComprendreTexte: +25% compréhension, enfants participent + en classe
- ✅ OrthoPuzzle: +35% orthographe, moins de fautes homophones
- ✅ P2 games: 2-3 montrent du potentiel
- ✅ Rétention: 80%+ enfants veulent rejouer après test

### Succès partiel (2/3 critères):
- Jeu a l'air efficace, mais peut-être besoin d'ajustements en difficultés/contenu

### Peu efficace (< 1/3 critères):
- Retravailler le jeu ou le retirer des priorités P2

---

## 📋 Checklist Complète

- [ ] **Semaine 1**: Écoles identifiées, formulaires signés, wifi testé
- [ ] **Semaine 1-2**: Baseline collectée, 40+ autres jeux testés
- [ ] **Semaine 3-4**: StratégieMalo 4 sessions × 2 sem, données collectées
- [ ] **Semaine 3-4**: ComprendreTexte 3 sessions × 2 sem, données collectées
- [ ] **Semaine 3-4**: OrthoPuzzle 3 sessions × 2 sem, données collectées
- [ ] **Semaine 5-6**: Post-test réalisé (mêmes tests que baseline)
- [ ] **Semaine 6-7**: Analyses statistiques complétées
- [ ] **Semaine 6-7**: Interviews enfants/profs enregistrées
- [ ] **Semaine 7**: Rapport complet avec résultats

---

## 📞 Contacts & Ressources

**Données à collecter par enfant:**
- `baseline_results.csv` (vitesse calcul, % compréhension, % erreurs ortho)
- `post_results.csv` (mêmes mesures après 2 sem jeux)
- `game_logs.json` (actions dans chaque jeu, via logging navigateur)
- `interviews.txt` (citations enfants, notes profs)

**Signalements d'erreurs:**
- Si jeu crash: noter navigateur + niveau + action
- Si feedback est faux: signaler avec nom jeu + étape
- Si trop difficile/facile: noter niveau et suggestions

**Succès = Déploiement à +20 écoles dans 3 mois**

---

## 🎯 Next Steps si Succès

1. **Semaine 8-12**: Implémentation P2 jeux (PonctuationPuzzle, AmisDesmots, etc.)
2. **Semaine 12+**: Rollout à 20+ écoles + analyse longitudinale (6 mois)
3. **Mois 4-6**: Features: Audio pour lectures, images pour textes, parent dashboard
4. **Mois 6+**: Expansion à autres pays/langues si intérêt
