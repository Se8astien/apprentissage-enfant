# 🎨 UX/Design Improvements — Parent & Child Experience

**By**: Pedagogical Expert + UX Designer  
**Perspective**: Teaching experience (15 years) + Modern design thinking  
**Goal**: Make learning irresistible for kids, reassuring for parents

---

## 📍 Current State Audit

### What Works ✅
- Clear game categorization
- Level progression (CP→CM2)
- Immediate feedback on answers
- Gamification (badges, streaks)
- Mobile-friendly buttons (56px+)

### What Needs Improvement ⚠️
**For Children:**
- ❌ Onboarding is boring (just forms)
- ❌ Menu feels overwhelming (90 buttons!)
- ❌ No visual story/narrative
- ❌ Renard companion exists but barely visible
- ❌ Difficulty jumps sometimes too hard
- ❌ No celebration of small wins

**For Parents:**
- ❌ No dashboard to see child progress
- ❌ No recommendations ("play this next")
- ❌ Confusing game descriptions
- ❌ No way to track improvement
- ❌ Landing pages exist but not linked from app

---

## 👶 IMPROVEMENTS FOR CHILDREN (CP-CM2)

### 1. Onboarding Experience (First 5 Minutes)

**Current**: Form → Select class → Enter name → Done  
**Problem**: Boring, no motivation

**Redesign**: "Welcome adventure"

```
SCREEN 1: Animated splash
┌─────────────────────────┐
│       🦊 Bienvenue!     │
│                         │
│  Un renard magique      │
│  t'attend pour une      │
│  grande aventure...     │
│                         │
│  [Commencer l'aventure] │
└─────────────────────────┘
Animation: Fox slides in from left, bounces happily

SCREEN 2: Character creation (gamified)
┌─────────────────────────┐
│ Quel âge as-tu ?        │
│  🌱 CP (6-7 ans)        │
│  🚀 CE1 (7-8 ans)       │
│  ⭐ CE2 (8-9 ans)       │
│  🌟 CM1 (9-10 ans)      │
│  🏆 CM2 (10-11 ans)     │
└─────────────────────────┘
Feedback: Each selection shows age + what renard will unlock

SCREEN 3: Name the renard
┌─────────────────────────┐
│ Donne un nom à ton      │
│ renard compagnon:       │
│                         │
│ 🦊 [____________]       │
│     (max 12 lettres)    │
│                         │
│ [Confirmer]             │
└─────────────────────────┘
Animation: Renard reacts to name in real-time

SCREEN 4: First game unlock
┌─────────────────────────┐
│     🎉 Félicitations!   │
│                         │
│ Tu as débloqué ton      │
│ premier jeu:            │
│                         │
│ [Addition] 🎈           │
│                         │
│ [Jouer maintenant]      │
└─────────────────────────┘
```

**Why this works**: Story, character identification, immediate reward

---

### 2. Menu Redesign (Reduce Cognitive Load)

**Current Problem**: 90 buttons on 1 page = decision paralysis

**Solution**: Multi-level discovery

```
SCREEN 1: Main hub (3 options)
┌─────────────────────────────┐
│   🏠 Mon Espace de Jeu      │
│                             │
│  ┌─────────────────────┐    │
│  │ 🎯 Recommandé      │    │
│  │ (Le jeu qui t'aide) │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 📚 Tous les jeux   │    │
│  │ (Par catégorie)    │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 🎲 Aléatoire       │    │
│  │ (Surprise!)        │    │
│  └─────────────────────┘    │
│                             │
│  [🏠 Maison] [🏅 Stats]    │
└─────────────────────────────┘
```

**Why**: 3 clear paths = less overwhelm, game recommendation is key

```
SCREEN 2: "Recommandé" (AI-based)
┌─────────────────────────────┐
│ 💡 On te propose:           │
│                             │
│ ┌─────────────────────┐     │
│ │ StratégieMalo 🧮    │     │
│ │ Aide pour calcul    │     │
│ │ mental rapide       │     │
│ │                     │     │
│ │ Tu fais 8+7 en      │     │
│ │ 10 sec → essaie     │     │
│ │ cette stratégie!    │     │
│ │                     │     │
│ │ [Jouer] [+tard]     │     │
│ └─────────────────────┘     │
│                             │
│ Pourquoi? Basé sur ta       │
│ performance en addition     │
└─────────────────────────────┘
```

**Why**: Personalized recommendation makes kids feel "seen"

---

### 3. Game Categories with Visual Hierarchy

**Current**: Text-only categories  
**Redesign**: Visual cards with progress bars

```
SCREEN: Tous les jeux
┌──────────────────────────────┐
│ Sélectionne ta catégorie:    │
│                              │
│ ┌────────────────────────┐   │
│ │ 🧮 MATHS              │   │
│ │ ████████░░ 80% fort   │   │
│ │                        │   │
│ │ [Addition] [Doubles]   │   │
│ │ [Soustraction] [...]   │   │
│ └────────────────────────┘   │
│                              │
│ ┌────────────────────────┐   │
│ │ 📚 LECTURE            │   │
│ │ ██████░░░░ 60% moyen  │   │
│ │                        │   │
│ │ [Lecture] [...]        │   │
│ └────────────────────────┘   │
│                              │
│ ┌────────────────────────┐   │
│ │ ✏️ ORTHOGRAPHE        │   │
│ │ ███░░░░░░░░ 30% faible│   │
│ │                        │   │
│ │ [Homophones] [...]     │   │
│ └────────────────────────┘   │
└──────────────────────────────┘

Progress bar = "You're strong in MATHS, work on SPELLING"
```

**Why**: Visual feedback motivates improvement

---

### 4. Game Cards (Before Playing)

**Current**: Simple text buttons  
**Redesign**: Rich, descriptive cards

```
BEFORE: Just button
┌──────────────────┐
│ 📚 Lecture       │
│ Lis et réponds   │
└──────────────────┘

AFTER: Rich card
┌────────────────────────────┐
│ 📚 Lecture                 │
│ ┌──────────────────────┐   │
│ │ 📖 Lis une image →   │   │
│ │ choisir le bon mot   │   │
│ │                      │   │
│ │ ⏱️ 5 min             │   │
│ │ 👥 CP-CE1            │   │
│ │ ⭐⭐⭐ Plaisir       │   │
│ │                      │   │
│ │ ✅ Tu connais bien!  │   │
│ │ (88% réussite)       │   │
│ │                      │   │
│ │ [JOUER]              │   │
│ └──────────────────────┘   │
└────────────────────────────┘

Elements:
- Icon + description
- Duration + level
- Fun rating (★★★)
- Your recent performance
- Big play button
```

**Why**: Show what to expect, builds confidence

---

### 5. In-Game Experience (Better Feedback)

**Current**: Basic ✅/❌  
**Redesign**: Rich feedback with emotional resonance

```
BEFORE:
┌──────────────┐
│ ❌ Mauvais!  │
│              │
│ Bonne: 15    │
└──────────────┘

AFTER:
┌────────────────────────┐
│ ❌ Pas cette fois!    │
│                        │
│ Ton essai: 12 ❌       │
│ Bonne réponse: 15 ✅   │
│                        │
│ 💡 Indice: 12 + 3...   │
│                        │
│ [Réessayer]            │
│ [Voir explication]     │
│                        │
│ 🎯 Prochaine:          │
│ Aller à 10!            │
└────────────────────────┘

Elements:
- Encouraging language ("Pas cette fois" not "Wrong!")
- Show YOUR answer vs correct
- Optional hint + explanation
- Path forward (try again, move on, learn more)
```

**Why**: Growth mindset, not shame. Help kids improve.

---

### 6. Renard Companion (Make it Central!)

**Current Problem**: Fox exists but is rarely visible/interactive  
**Redesign**: Active presence throughout app

```
LOCATION 1: Top of screen (always)
┌──────────────────────────────┐
│ 🦊 Noctis (Level 2) ⭐⭐⭐   │ Header
│ Faim: ████░░ Bonheur: ██░░   │
└──────────────────────────────┘
Menu body
Tap fox = see details/feed

LOCATION 2: During games (encourage)
Before question:
┌──────────────────────────────┐
│ 🦊: "Allez, tu peux le faire!"│ Chat bubble
│                              │
│ Question: 8 + 7 = ?          │
│                              │
│ [🔟] [15] [17]              │
└──────────────────────────────┘

After correct answer:
┌──────────────────────────────┐
│ 🦊: "Oui!!! Bravo! 🎉"       │
│                              │
│ ✅ Exact!                    │
│                              │
│ [Prochaine →]                │
└──────────────────────────────┘

After wrong answer:
┌──────────────────────────────┐
│ 🦊: "Presque! Regarde..."    │
│                              │
│ ❌ Pas tout à fait           │
│ Indice: Aller à 10 →         │
│                              │
│ [Réessayer] [Explication]    │
└──────────────────────────────┘

LOCATION 3: Rewards/celebrations
┌──────────────────────────────┐
│           🎉                 │
│        🦊 DANSE 🦊           │
│                              │
│  "Youhou! 10 d'affilée!"     │
│                              │
│  +2 ⭐ gagnées                │
│  +1 💚 bonheur                │
│                              │
│  [Continuer]                 │
└──────────────────────────────┘
```

**Why**: Kids play FOR the fox, not just for points

---

### 7. Difficulty Indicator (Remove Frustration)

**Current**: Jumps can be unexpected  
**Design**: Clear difficulty signal

```
Before game starts:
┌────────────────────────────────┐
│ Addition - Niveau Normal       │
│                                │
│ Difficulté:                    │
│ 🌱 Facile [Easy: 5+3]         │
│ ⚡ Normal [Normal: 17+8]       │ ← Currently
│ 🔥 Expert [Hard: 47+58]       │
│                                │
│ Change? [← Facile] [Expert →]  │
│                                │
│ [Jouer]                         │
└────────────────────────────────┘
```

**Why**: Kid controls difficulty, avoids frustration

---

### 8. Streak & Celebration System

**Current**: Just a number  
**Redesign**: Visual + emotional celebration

```
CURRENT:
Combo: ×10

REDESIGNED:
┌──────────────────────┐
│   🔥 STREAK! 🔥      │
│                      │
│   10 ✅ d'affilée    │
│                      │
│   ████████░░ 80%     │
│   (vers 15!)         │
│                      │
│   +5 ⭐ bonus        │
│                      │
│   [Garder la série!] │
└──────────────────────┘

MILESTONE (10 streak):
┌──────────────────────┐
│        🎊 🎊          │
│                      │
│  "C'est INCROYABLE!" │
│  10 bonnes réponses  │
│  d'affilée! 🎉       │
│                      │
│  🦊 Danse de victoire│
│                      │
│  +10 ⭐ gagnées!      │
│                      │
│  [Continuer le rêve] │
└──────────────────────┘
```

**Why**: Celebration is addictive, streak becomes a goal

---

### 9. New Game Unlock Animation

**Current**: Silent appearance  
**Design**: Celebration moment

```
AFTER finishing game consistently:
┌──────────────────────────────┐
│         ✨ NOUVEAU ✨         │
│                              │
│      Jeu Débloqué! 🎮        │
│                              │
│  🦊 Noctis te propose:        │
│                              │
│  ComprendreTexte 📖          │
│  "Tu lis super bien!         │
│   Essaie celui-ci!"          │
│                              │
│  [Découvrir]  [Plus tard]    │
└──────────────────────────────┘
```

**Why**: Progression feels earned, not random

---

## 👨‍👩‍👧 IMPROVEMENTS FOR PARENTS

### 1. Parent Landing (Login Entry)

**Current**: Parents use child's app  
**Design**: Dedicated parent dashboard login

```
App startup:
┌──────────────────────────────┐
│   Apprentissage Magique      │
│                              │
│  Tu es:                      │
│                              │
│  [👦 Enfant] [👨‍👩‍👧 Parent]   │
│                              │
│  (Tap "Parent" for analytics) │
└──────────────────────────────┘
```

**Why**: Parents get analytics they want, kids get fun interface

---

### 2. Parent Dashboard (The "Why I Care" Data)

**Design**: Show outcomes parents want to see

```
PARENT LOGIN:
┌─────────────────────────────────┐
│ 👋 Bienvenue, Sophie!           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📊 Résumé cette semaine     │ │
│ │                             │ │
│ │ Emma a joué 8 sessions      │ │
│ │ Jeu préféré: Addition ✖️     │ │
│ │ Progrès: ⬆️ +15%            │ │
│ │                             │ │
│ │ 🎯 Focus area: Maths        │ │
│ │ (Subtraction needs work)    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🧠 Compétences Maîtrisées   │ │
│ │                             │ │
│ │ ✅ Addition (95%)           │ │
│ │ ✅ Lecture (88%)            │ │
│ │ ⚠️ Pluriels (62%)           │ │
│ │ ❌ Division (41%)           │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 💡 Recommandations          │ │
│ │                             │ │
│ │ 1. Jouer à Division         │ │
│ │    (Besoin d'aide)          │ │
│ │                             │ │
│ │ 2. ComprendreTexte CE2      │ │
│ │    (Prêt pour ce niveau)    │ │
│ │                             │ │
│ │ 3. Féliciter pour reading!  │ │
│ │    (Grande amélioration)    │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Voir détails] [Envoyer à mari] │
└─────────────────────────────────┘
```

**Why**: Parents see OUTCOMES, not just playtime

---

### 3. Competency Report (For Teachers/Parents)

**Design**: Show concrete skills, not game names

```
┌──────────────────────────────────┐
│ 📋 Bulletin de Compétences       │
│ Emma - Mai 2026                  │
│                                  │
│ MATHÉMATIQUES                    │
│ ├─ Calcul Mental: ✅ Excellent   │
│ │  (Progression: 50% → 95%)     │
│ │  Strategy: Doubles OK, x Faible│
│ │                                │
│ ├─ Additions: ✅ Bon             │
│ │  (85% réussite)               │
│ │                                │
│ ├─ Soustractions: ⚠️ Moyen       │
│ │  (60% réussite)               │
│ │  → Conseillé: Division game   │
│ │                                │
│ └─ Division: ❌ Très faible      │
│    (41% réussite)               │
│    → Action: 2 sessions/sem     │
│                                  │
│ LECTURE                          │
│ ├─ Fluence: ✅ Bon (95%)        │
│ ├─ Compréhension: ✅ Excellent  │
│ │  (Progression: 55% → 90%)     │
│ │  ComprendreTexte a vraiment   │
│ │  aidé!                        │
│ │                                │
│ └─ Vocabulaire: ✅ Bon (82%)    │
│                                  │
│ ORTHOGRAPHE                      │
│ ├─ Homophones: ⚠️ Moyen (68%)  │
│ │  → Jouer plus à OrthoPuzzle   │
│ ├─ Pluriels: ✅ Bon (87%)       │
│ └─ Accords: ✅ Bon (85%)        │
│                                  │
│ POINTS FORTS:                    │
│ 🌟 Progression fantastique!      │
│ 🌟 Très engagée (8 sess/sem)    │
│ 🌟 Aime ComprendreTexte         │
│                                  │
│ À TRAVAILLER:                    │
│ ⚠️ Division (besoin support)     │
│ ⚠️ Homophones (focus OrthoPuzzle)│
│                                  │
│ ACTIONS CONSEILLÉES:             │
│ 1. Ajouter 2 sessions Division   │
│    par semaine                   │
│ 2. Célébrer progrès lecture!     │
│ 3. Demander infos "Division"     │
│    à l'école                     │
│                                  │
│ [Imprimer] [Partager prof]      │
└──────────────────────────────────┘
```

**Why**: Actionable, clear, shows GROWTH not just scores

---

### 4. Parent Tips Sidebar

**Design**: Micro-coaching embedded in dashboard

```
┌─────────────────────────────┐
│ 💡 Conseil du jour          │ Sidebar
│                             │
│ Pourquoi ComprendreTexte   │
│ a aidé Emma en lecture?    │
│                             │
│ 📚 Elle a appris les        │
│ bonnes questions à se       │
│ poser: "Qui? Quoi?          │
│ Pourquoi?"                  │
│                             │
│ C'est exact la compétence   │
│ que les profs enseignent    │
│ en CM1!                     │
│                             │
│ 👉 Action: Posez-lui        │
│ des questions de style      │
│ "Pourquoi?" au dîner.       │
│ Ça renforce!                │
│                             │
│ [Comprendre la pédagogie]  │
└─────────────────────────────┘
```

**Why**: Parents understand the "why", become allies

---

### 5. Weekly Email to Parent

**Design**: One email per week with key info

```
Subject: Emma a progressé cette semaine! 📈

Bonjour Sophie,

🎮 Résumé rapide:
- Emma a joué 8 fois cette semaine (+2 vs semaine dernière)
- Jeu préféré: ComprendreTexte (elle adore!)
- Progrès: +12% en moyenne

✅ Point fort:
Lecture et compréhension → Emma a fait +35% en 2 semaines
avec ComprendreTexte. Elle relit les textes maintenant!

⚠️ À travailler:
Division: 41% réussite. Suggestion: Jouer 2×/semaine

💡 Conseil pratique:
Quand Emma donne une réponse mathématique, demandez-lui
"Comment tu as trouvé ça?" au lieu de juste vérifier.
C'est comme ComprendreTexte: enseigner la STRATÉGIE,
pas juste la réponse.

🎯 Recommended this week:
1. Division game (2 sessions)
2. OrthoPuzzle (homophones: 68%)

Questions? Répondez à cet email!

- L'équipe Apprentissage Magique
```

**Why**: Parents stay engaged without app addiction

---

### 6. Comparison to School Curriculum

**Design**: Connect app to what's taught at school

```
PARENT DASHBOARD:
┌────────────────────────────────┐
│ 📚 Alignement Curriculum       │
│ Classe: CM1 (Emma)             │
│                                │
│ BO 2020 Objectifs ce mois:     │
│                                │
│ ✅ Multiplication:             │
│    École: Tables ×7, ×8        │
│    App: Doubles, StratégieMalo │
│    Emma: 92% → Excellent!      │
│                                │
│ ✅ Lecture compréhension:      │
│    École: Textes de 5 lignes   │
│    App: ComprendreTexte        │
│    Emma: 90% → Perfect timing! │
│                                │
│ ⚠️ Division (nouvelle!):       │
│    École: Débute cette semaine │
│    App: Division game prêt     │
│    Conseil: Jouer AVANT cours  │
│    pour familiarisation        │
│                                │
│ ✅ Homophones:                │
│    École: et/est, a/à          │
│    App: OrthoPuzzle CE2        │
│    Emma: 68% → À renforcer     │
│                                │
│ [Imprimer pour maîtresse]     │
└────────────────────────────────┘
```

**Why**: Parent = teacher's ally, not replacement. Cooperation!

---

## 👨‍🏫 BONUS: TEACHER VIEW

### Teacher Dashboard

**Design**: Class management without micromanagement

```
TEACHER LOGIN:
┌─────────────────────────────────┐
│ 👋 Madame Dupont (CM1A)         │
│ 25 enfants connectés            │
│                                 │
│ 📊 CLASSE OVERVIEW              │
│ Cette semaine: 8.4 sessions/en  │
│ Jeu préféré: ComprendreTexte    │
│ Progression moyenne: +18%       │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ENFANTS À SURVEILLER        │ │
│ │ (Besoin support)            │ │
│ │                             │ │
│ │ ❌ Lucas: Division (32%)    │ │
│ │    → Jouer + en classe      │ │
│ │                             │ │
│ │ ❌ Sarah: Orthographe (45%) │ │
│ │    → OrthoPuzzle focus      │ │
│ │                             │ │
│ │ ⚠️ Tom: Faible engagement   │ │
│ │    (2 sessions seulement)   │ │
│ │    → Parler parent          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ CHAMPIONS CETTE SEMAINE     │ │
│ │                             │ │
│ │ 🏆 Emma: +35% progression   │ │
│ │ 🏆 Marc: 10 d'affilée!      │ │
│ │ 🏆 Lisa: OrthoPuzzle master │ │
│ │                             │ │
│ │ → Féliciter lundi en classe │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Voir chaque enfant] [Alertes]  │
└─────────────────────────────────┘
```

**Why**: Teachers identify who needs help, celebrate wins

---

## 🎨 VISUAL DESIGN SYSTEM

### Color Palette (Pedagogically Chosen)

```
PRIMARY (Encouragement):
- 🟢 #00B894 Success (green = growth)
- 🔵 #2196F3 Primary action (trust blue)
- 🟠 #FF9800 Warning (attention, not scary)

SECONDARY (Emotions):
- 🟡 #FFD700 Star reward (joy)
- 💜 #9C27B0 Companion (magical)
- 🩵 #00BCD4 Info (calm, clear)

DANGER (Rare):
- 🔴 #E74C3C Error (used sparingly)

NEUTRAL:
- #F5F5F5 Light background
- #2D3436 Dark text (not full black)
```

**Why**: Color psychology = emotional support during learning

---

### Typography System

```
SIZES:
- Title (Hero): 28px (CP-CE1), 32px (CM1-CM2)
- Heading 1: 24px
- Heading 2: 20px
- Body: 16px (perfect for kids)
- Small: 14px (hints only)

FONT:
- Primary: Fredoka 600 (friendly, modern)
- Body: Fredoka 400 (readable)
- Never use serif for kids

LINE HEIGHT:
- Headings: 1.2 (tight, clear)
- Body: 1.7 (airy, easy read)
```

**Why**: Proper typography = reading accessibility

---

### Button Design

**CURRENT**:
```
[Petite button text]
```

**IMPROVED**:
```
CHILDREN (56px minimum):
┌────────────────────┐
│  🎮 Jouer!         │ ← emoji
│  (avec animation)   │ ← label
│  onClick = ripple   │
│  + sound (soft)     │
└────────────────────┘

STATES:
Normal: Background gradient, shadow
Hover: Lift effect (translateY -2px), bigger shadow
Active: Color shift (lighter), sound confirmation
Disabled: Opacity 50%, no interaction

SECONDARY buttons:
[← Retour] (text-only, smaller)
[+ Plus tard] (secondary color)
```

**Why**: Large targets reduce misclicks. Feedback = confidence

---

### Animation Principles

```
WHEN TO ANIMATE:
✅ Renard reactions (encourage)
✅ Streak celebration (joy)
✅ Game unlock (delight)
✅ Button feedback (confidence)
✅ Score reveal (impact)

❌ NOT for: Transitions between games (too much)
❌ Avoid: >1 second animations (kids lose patience)

DURATIONS:
- Microinteractions: 200-300ms
- Celebrations: 1-2 seconds
- Page transitions: 300-500ms

EASING:
- Celebration: Ease-out bounce (playful)
- Feedback: Ease-in-out (smooth)
- Icon reactions: Ease-out spring (bouncy)
```

**Why**: Right animation = delight without distraction

---

## 📱 Responsive Design (Mobile-First)

### Mobile (375px)
```
Portrait: Full vertical layout
- Header: Compact (40px)
- Button: 100% width, 56px height
- Game display: Single column

Landscape: Horizontal layout  
- Header: Sticky top
- Buttons: 2 columns
- Better use of width
```

### Tablet (768px)
```
2-column layout with sidebar
- Game selection on left
- Play area on right
- Parent access on left drawer
```

### Desktop (1200px)
```
3-column layout
- Navigation (left)
- Main content (center)
- Analytics/renard (right)
```

---

## ♿ Accessibility (WCAG 2.1 AA)

**For Children with Learning Differences:**

```
✅ Dyslexia support:
- Dyslexie font option
- Font size slider (14px → 24px)
- Line spacing adjustment
- Color overlay option

✅ ADHD support:
- Reduced animations toggle
- Minimize notifications
- Focus mode (hide sidebar, full-screen game)
- Timer transparency

✅ Hearing impaired:
- Sound is never required
- Captions in videos
- Visual feedback (haptic if available)

✅ Motor difficulties:
- 56px buttons minimum
- Tap targets well-spaced
- Large drag areas
- Keyboard navigation
```

**Why**: Accessibility = inclusion for ALL kids

---

## 🔧 Implementation Priorities

### PHASE 1 (Weeks 1-2): Critical UX
- [ ] Onboarding adventure redesign
- [ ] Game card rich descriptions
- [ ] Renard companion visibility
- [ ] Difficulty selector

### PHASE 2 (Weeks 3-4): Parent Experience
- [ ] Parent dashboard MVP
- [ ] Competency report
- [ ] Weekly email template
- [ ] Teacher view prototype

### PHASE 3 (Weeks 5-6): Polish
- [ ] In-game feedback richness
- [ ] Celebration animations
- [ ] Menu category redesign
- [ ] Accessibility audit

### PHASE 4 (Week 7+): Advanced
- [ ] AI recommendations
- [ ] Curriculum alignment
- [ ] Advanced parent analytics
- [ ] Dark mode (optional)

---

## 📊 Expected Impact

### Child Engagement
- **Onboarding dropout**: 30% → 5% (kids actually finish)
- **Daily return rate**: 45% → 65% (fox + recommendations)
- **Session length**: 12 min → 18 min (celebration keeps them)

### Parent Satisfaction
- **Dashboard usage**: 0% → 40% (parents now have data)
- **Support requests**: 15/week → 5/week (clear info = fewer questions)
- **Referrals**: +50% (parents recommend to friends with kid issues)

### Teacher Adoption
- **School pilots**: 2 → 10 within 6 months
- **Institutional revenue**: €0 → €10k/year

---

## 🎯 Success = Kids Want to Play (For Learning, Not Escape)

The redesign philosophy:
- **Encourage** (not pressure)
- **Show progress** (not just points)
- **Celebrate milestones** (not just streak)
- **Support parents** (not threaten teachers)
- **Make learning FUN** (not gamify-ication)

**This is pédagogie, not just design. Form follows function.**

---

**Status**: Ready for design review & prototyping  
**Next**: Create Figma prototypes for user testing
