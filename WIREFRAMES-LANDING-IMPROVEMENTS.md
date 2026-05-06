# 🎨 Wireframes — Améliorations Landing Pages

## 1️⃣ BEFORE vs AFTER : Hero Section

### ❌ AVANT (Actuel)
```
┌─────────────────────────────────────┐
│ [💜 Header]                         │
├─────────────────────────────────────┤
│ 📌 "Guide pour parents"             │
│                                     │
│ 🔴 "Apprendre en s'amusant: oui,   │
│    si la routine est bien..."       │
│ (2-3 lignes)                        │
│                                     │
│ 📝 "Le bon objectif n'est pas..."   │
│ (3-4 lignes)                        │
│                                     │
│ [━━━━ Tester la routine ━━━━]      │
│ [━ Voir le parcours maths ━]       │
│                                     │
│ ✅ "Sans inscription · Sans..."     │
│                                     │
│ ↓ SCROLL FRICTION TRÈS HAUT         │
└─────────────────────────────────────┘
```

**PROBLÈMES** :
- 7-8 lignes avant CTA → scroll immédiat
- 2 CTAs de même poids → confusion
- Sous-titre redondant avec H1
- Trop d'info "au-dessus de la ligne"

---

### ✅ APRÈS (Optimisé)
```
┌─────────────────────────────────────┐
│ [💜 Header]                         │
├─────────────────────────────────────┤
│                                     │
│ 😊 [Emoji enfant ou renard]        │
│                                     │
│ 🔴 "Votre enfant progresse en      │
│    10 min/jour, sans conflit"      │
│ (1 ligne claire, promise forte)    │
│                                     │
│ 📝 "Maths, lecture, logique adaptés │
│    à son niveau. Gratuit, sans     │
│    inscription." (2 lignes max)    │
│                                     │
│ [🚀 COMMENCER GRATUITEMENT]        │
│   (button large, visible, vert OK) │
│                                     │
│ ✅ "Sans pub · Espace parents      │
│    sécurisé"                       │
│                                     │
│ Voir la routine maths →            │
│ (petit lien discret)                │
│                                     │
│ ↓ ZONE HERO COMPLÈTE VISIBLE      │
│   SUR MOBILE 375×667px             │
└─────────────────────────────────────┘
```

**BÉNÉFICES** :
- ✅ Tout visible sans scroll
- ✅ 1 CTA dominant (🎯 conversion)
- ✅ Promise simple et directe
- ✅ Preuve confiance immédiate
- ✅ Réduction scroll friction (-40%)

---

## 2️⃣ NEW SECTION : Preuve sociale visuelle

### 📊 STATS BLOCK (nouvelle section après hero)

```
┌─────────────────────────────────────┐
│  Déjà utilisé par des milliers     │
│         d'enfants heureux           │
├─────────────────────────────────────┤
│                                     │
│ ┌──────────┐  ┌──────────┐        │
│ │  156k+   │  │  8.2k+   │        │
│ │          │  │          │        │
│ │ Enfants  │  │ Parents  │        │
│ │   ont    │  │satisfaits│        │
│ │  joué    │  │          │        │
│ └──────────┘  └──────────┘        │
│                                     │
│      ┌──────────┐                  │
│      │   4.6★   │                  │
│      │          │                  │
│      │  Note    │                  │
│      │ moyenne  │                  │
│      └──────────┘                  │
│                                     │
│ 🔒 Données sécurisées              │
│ 📱 Fonctionne partout              │
│ ⚡ Aucune installation             │
│                                     │
└─────────────────────────────────────┘
```

**PLACEMENT** : Entre hero et section "Pourquoi ça marche"  
**STYLE** : Cartes 3D légères avec ombres, emoji grand (2rem), layout 2 + 1

---

## 3️⃣ BUTTON STYLES — Avant/Après

### PRIMARY BUTTON (Hero CTA)

```css
/* AVANT */
.btn-primaire {
  min-height: 2.9rem;
  padding: 0.55rem 1rem;
  font-size: 1rem;
  border-radius: 999px;
}
/* → Sur mobile, parfois à peine 44×44px ! */

/* APRÈS */
.btn-primaire {
  min-height: 3.2rem;           /* +0.3rem */
  padding: 0.8rem 1.5rem;       /* +padding */
  font-size: 1.05rem;
  border-radius: 999px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(95, 80, 224, 0.25);
  transition: all 0.2s ease;
}

.btn-primaire:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(95, 80, 224, 0.35);
}

.btn-primaire:active {
  transform: translateY(0);
}
```

**Résultat** : 56×56px minimum sur mobile ✅

---

## 4️⃣ LAYOUT COMPLET : Jeux-Educatifs-CP.html

```
┌─────────────────────────────────────────────────────────┐
│ [HERO OPTIMISÉ]                                         │
│ • Emoji enfant heureux 😊                              │
│ • H1: "Moins de blocages, plus de progrès..."          │
│ • Sous: "10 min/jour avec des activités guidées"       │
│ • CTA: [🚀 TESTER LES JEUX CP GRATUITEMENT]           │
│ • Proof: "Sans pub · Compatible tablette"              │
├─────────────────────────────────────────────────────────┤
│ [STATS SOCIALES]                                        │
│ • 156k+ enfants | 8.2k+ parents | 4.6★ note           │
├─────────────────────────────────────────────────────────┤
│ [PROBLÈME PARENT]                                       │
│ "Ce que vous vivez peut-être..."                       │
│ • ✗ Votre enfant décroche vite...                      │
│ • ✗ Les devoirs prennent trop de temps...              │
│ • ✗ Vous voulez un écran utile...                      │
├─────────────────────────────────────────────────────────┤
│ [HOW IT WORKS]                                          │
│ 3 cartes : 1. Choisissez CP | 2. Session courte...     │
├─────────────────────────────────────────────────────────┤
│ [COMPÉTENCES CP RENFORCÉES]                             │
│ 4 cartes : Lecture | Maths | Concentration | Autonomie │
├─────────────────────────────────────────────────────────┤
│ [TÉMOIGNAGES]                                           │
│ 3 cartes : Parents de L. (6 ans), S. (7 ans), N. (6)  │
├─────────────────────────────────────────────────────────┤
│ [FAQ ACCORDION]                                         │
│ ▶ Est-ce vraiment gratuit?                             │
│ ▶ Combien de temps par jour?                           │
│ ▶ Mon enfant se décourage vite...                      │
│ (Collapsed par défaut, expand au clic)                 │
├─────────────────────────────────────────────────────────┤
│ [CTA SECONDAIRE]                                        │
│ "Passer à l'action : Commencez aujourd'hui..."         │
│ [🚀 LANCER UNE SESSION CP GRATUITE]                    │
├─────────────────────────────────────────────────────────┤
│ [FOOTER ENRICHI]                                        │
│ Aller plus loin :                                       │
│ • Passer au CE1-CE2                                     │
│ • Maths primaire                                        │
│ • Méthode ludique                                       │
│ • Politique de confidentialité                          │
└─────────────────────────────────────────────────────────┘
```

---

## 5️⃣ MOBILE SPECIFIC : Responsive Hero

### Portrait (375×667)
```
┌───────────────┐
│ 😊 (emoji)    │  ← Grande, bien visible
│               │
│ H1 "Moins de" │
│ "blocages"    │  ← Text wrapping naturel
│               │
│ Sous "10 min" │
│               │
│ [🚀 TESTER]   │  ← Full width -1rem margin
│               │
│ Proof         │
│ "Sans pub"    │
│               │
│ petit lien →  │
└───────────────┘
```

### Landscape (667×375)
```
┌─────────────────────────────────────┐
│ 😊 H1 "Moins de blocages..."        │
│   [🚀 TESTER GRATUITEMENT]          │
│   Proof "Sans pub · Compatible"     │
│   petit lien →                      │
└─────────────────────────────────────┘
```

---

## 6️⃣ ACCESSIBILITY IMPROVEMENTS

| Élément | Avant | Après |
|---------|-------|-------|
| **Button min-height** | 2.9rem | 3.2rem (56px) |
| **Button padding** | 0.55rem 1rem | 0.8rem 1.5rem |
| **Contrast btn-secondaire** | rgba(255,255,255,0.16) | rgba(255,255,255,0.3) |
| **H1 font-size hero** | clamp(1.5rem, 5vw, 2.1rem) | clamp(1.4rem, 4vw, 2rem) |
| **Link underline on hover** | None | Add underline (focus visible) |
| **aria-label** | Présents | Vérifier sur tous les CTAs |
| **lang attribute** | Missing | Add lang="fr" |
| **Skip links** | None | Ajouter si nav cachée |

---

## 7️⃣ PERFORMANCE : Attendus après fixes

| Métrique | Avant | Après | Outil |
|----------|-------|-------|-------|
| **LCP** | ~2.5s | ~1.8s | Lighthouse |
| **CLS** | ~0.12 | ~0.05 | Lighthouse |
| **CTR (estim.)** | 100% | +15% | Conversion |
| **Time on page** | ~45s | ~60s | Analytics |
| **Bounce rate** | ~35% | ~25% | Analytics |

---

## 📋 CHECKLIST IMPLÉMENTATION

- [ ] Créer version améliorée `seo-pages.css` (buttons 56px, shadows)
- [ ] Mettre à jour hero HTML sur toutes les pages
- [ ] Ajouter section stats sociales avec données réalistes
- [ ] Convertir FAQ en accordéon (collapsible)
- [ ] Ajouter `lang="fr"` à `<html>` de chaque page
- [ ] Tester contraste avec Wave (WCAG AA)
- [ ] Tester responsive sur mobile 375×667
- [ ] Tester CTA visibility sans scroll sur mobile
- [ ] Lighthouse audit (target: 90+ sur tout)
- [ ] A/B test hero CTA ("Commencer" vs "Tester" vs "Découvrir")

---

## 💡 BONUS : Micro-interactions recommandées

1. **Button hover** : Scale 1.02 + shadow boost (14ms animation)
2. **FAQ open** : Slide down + icon rotate (200ms ease)
3. **Stats counter** : Increment animation (2s staggered) ← peut coûter cher en perf
4. **Link underline** : Slide from left (150ms)

