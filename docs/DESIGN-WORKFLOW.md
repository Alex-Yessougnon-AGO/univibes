# Guide Design — Comment utiliser les Skills ensemble pour Univibes

> Un frontend époustouflant ne s'improvise pas. Ce guide explique comment combiner tous les skills installés dans un ordre précis pour produire un résultat premium, cohérent et anti-slop pour Univibes.

---

## Le principe fondamental

Les skills ne se lancent pas au hasard. Ils ont des **dépendances** : certains produisent des artéfacts que d'autres consomment. Utiliser `/frontend-design` sans `/design-tokens` donne un résultat générique. Utiliser `/design-taste-frontend` sans brief donne de l'aléatoire. **L'ordre est tout.**

```
Foundation → Direction → Build → Polish → Validate
```

---

## Réglages Univibes pour les skills paramétrables

Avant tout, voici les paramètres à utiliser avec `/design-taste-frontend` pour Univibes :

```
DESIGN_VARIANCE    = 7   → Éléments qui se chevauchent, tailles variées, moderne
MOTION_INTENSITY   = 6   → Fade-ins ciblés, smooth scroll, hover effects satisfaisants
VISUAL_DENSITY     = 5   → Équilibré : cards riches sans être étouffantes
```

**Pourquoi ces valeurs ?**
Univibes s'adresse à des étudiants de 18-25 ans au Bénin. L'interface doit sentir *Spotify pour les events* : énergique, visuelle, premium mais accessible. Pas trop minimaliste (on affiche des affiches d'événements colorées), pas trop dense (mobile-first oblige).

---

## Phase 0 — Fondation (avant tout code)

> **Objectif :** Aligner la vision, éviter les regrets à mi-chemin.

### Étape 0.1 — Stress-test de l'idée

```
/grill-me
```

Lance ce skill **une seule fois**, au tout début. Il va te questionner sans relâche sur :
- Qui est exactement l'utilisateur principal ? (Étudiant, organisateur, modérateur ?)
- Quelle est l'émotion que l'interface doit provoquer ?
- Comment un étudiant de Cotonou utilise-t-il son téléphone ?
- Quelle page est la plus critique pour la rétention ?

Prépare-toi à 15-20 minutes de questions. C'est normal et nécessaire.

### Étape 0.2 — Formalisation du brief

```
/design-brief
```

Après `/grill-me`, ce skill explore le codebase existant (docs/, prisma/, apps/web/) et génère un `DESIGN_BRIEF.md`. Il formalise :
- Le ton émotionnel (énergique, premium, étudiant africain branché)
- Les inspirations visuelles (Spotify, Apple, magazines Swiss Design)
- Les contraintes spécifiques (connexions lentes, petit écran, FCFA comme monnaie)
- Les personas (Koffi l'étudiant, AEUAC l'organisateur)

**Artéfact produit :** `DESIGN_BRIEF.md`

### Étape 0.3 — Architecture de l'information

```
/information-architecture
```

Basé sur le brief et le `UI-Sitemap.md` déjà documenté, ce skill confirme et affine :
- La navigation bottom bar sur mobile (Home, Explore, Tickets, Favorites, Profile)
- La hiérarchie des pages (public → private → organizer → admin)
- Les flux utilisateurs critiques (découverte → fiche evento → achat billet)
- Les patterns de navigation entre les écrans

**Ne pas coder une seule page avant cette étape.**

### Étape 0.4 — Système de tokens

```
/design-tokens
```

Input : `DESIGN_BRIEF.md` + les specs de `FIGMA-MASTER-SPECIFICATION.md`

Ce skill génère **tout le système de design en code** :

```
Couleurs (light + dark mode) :
  brand: #7c3aed          → Deep Violet NOVA (primary)
  brand-hover: #6d28d9    → Violet intensifié
  brand-subtle: #f5f0ff   → Fond violet doux
  accent: #ec4899         → Rose Accent
  accent-hover: #db2777   → Rose foncé
  accent-subtle: #fdf2f8  → Fond rose doux
  surface: #ffffff
  bg: #faf8fc
  border: #e8e2f0
  text: #0f0a1e
  text-secondary: #6b6478
  text-tertiary: #a89fb8
  success: #10b981
  warning: #f59e0b
  error: #ef4444

Typography :
  display: Calistoga (serif) → headings hero uniquement
  body: Inter (sans-serif) → tout le reste
  display-xl: clamp(2.8rem,7vw,5.5rem)
  heading: 28px / 32px / 40px
  body: 16px / 14px / 12px
  label: 10-11px uppercase tracking-[0.15em]

Spacing scale : 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px
Motion : 200ms ease-out / 300ms spring / 500ms page transition
Breakpoints : 320 / 768 / 1024 / 1440px
```

**Sortie :** `tailwind.config.ts` + `globals.css` avec CSS variables. Ces tokens sont la **source de vérité** pour tous les composants.

### Étape 0.5 — Décomposition en tâches

```
/brief-to-tasks
```

Input : `DESIGN_BRIEF.md` + IA + `UI-Sitemap.md`

Produit une task list ordonnée :
1. Foundation (tokens, layout, composants de base)
2. Core public (Homepage, Explore, Event Details)
3. Auth flow (Login, Register)
4. Student private (Profile, Favorites, Tickets)
5. Organizer dashboard
6. Responsive & dark mode
7. Motion & micro-interactions
8. Polish final

**Artéfact produit :** `TASKS.md` — ton plan de travail réel

---

## Phase 1 — Direction visuelle (choisir l'esthétique précise)

> **Objectif :** Aller au-delà du "vert et or" pour définir un style unique et non générique.

### Étape 1.1 — Intelligence design

```
/ui-ux-pro-max
```

Ce skill avec sa base de 161 palettes et 57 paires typographiques va répondre à :
- "Pour une plateforme événementielle étudiante africaine, quelle palette secondaire ?"
- "Quel style UI ? (Éditorial Swiss, bento grid, magazine ?)"
- "Quelle paire typo complémentaire à Inter pour les titres d'événements ?"

**Usage concret :**
```
/ui-ux-pro-max
→ "Je construis une plateforme événementielle étudiante, 
   mobile-first, Bénin. Palette : violet profond + rose.
   Recommande-moi un style UI, des variantes de palette, 
   et des guidelines UX critiques pour ce type de produit."
```

### Étape 1.2 — Calibration du style premium

```
/impeccable
```

Ce skill est le **chef d'orchestre du goût**. Il doit être utilisé ici pour :
- Auditer la direction visuelle choisie ("est-ce que ce design semble vraiment premium ?")
- Identifier ce qui pourrait le faire paraître générique ou "AI-slop"
- Proposer les touches qui font la différence : typographie expressive, espacement intentionnel, hiérarchie couleur non-évidente

**Questions spécifiques à poser à `/impeccable` pour Univibes :**
- "La card d'événement avec l'affiche en cover + infos dessous, comment la rendre mémorable sur la grille ?"
- "Comment faire que la homepage ne ressemble pas à Eventbrite générique ?"
- "Quelle micro-interaction sur le bouton 'Ajouter aux favoris' ?"

### Étape 1.3 — Références visuelles haut de gamme

```
/high-end-visual-design
```

Ce skill bloque les défauts typiques de l'IA (shadows génériques, cards identiques, spacings aléatoires) et impose :
- Fonts avec des tailles vraiment contrastées (12px caption vs 64px hero)
- Shadows avec des teintes colorées (shadow violet pour la marque)
- Cards avec une vraie hiérarchie interne
- Boutons avec états hover/pressed animés

---

## Phase 2 — Construction (coder le frontend)

> **Objectif :** Transformer la direction visuelle en code React/Next.js production-ready.

### Stack de build recommandée

Combiner ces 3 skills **simultanément** pour chaque page :

```
/design-taste-frontend (7/6/5) + /full-output-enforcement + /vercel-react-best-practices
```

**Pourquoi cette combinaison ?**
- `/design-taste-frontend` produit le code avec le niveau de sophistication visuelle voulu
- `/full-output-enforcement` empêche l'IA de produire du code tronqué avec des `// TODO` ou `// ... rest of component`
- `/vercel-react-best-practices` s'assure que le code Next.js utilise les Server Components là où c'est pertinent, optimise les images avec `next/image`, etc.

### Construction par page

#### Homepage (`/`)

```
/design-taste-frontend (7/6/5)
```

Points critiques pour Univibes Homepage :
- La barre de recherche est visible dès le premier écran sur mobile
- La section "Événements à la une" utilise un scroll horizontal sur mobile
- Les stats et compteurs sont visuels et engageants

```
/impeccable
→ "Revois la homepage. Est-ce que l'hierarchy visuelle guide 
   l'œil vers la recherche en moins de 2 secondes ?"
```

#### Catalogue Événements (`/explore`)

```
/ui-ux-pro-max
→ "Best patterns pour un catalogue d'événements avec filtres latéraux desktop
   et filtres drawer mobile. Bento grid ou grille standard ?"
```

Puis :
```
/design-taste-frontend (7/5/6) — VISUAL_DENSITY à 6 car page data-heavy
```

#### Fiche Événement (`/event/[slug]`)

C'est la page de conversion. La plus critique.

```
/impeccable
→ "Fiche événement mobile-first. Cover image full-width. 
   CTA 'Réserver' sticky en bas. Comment maximiser la conversion 
   sans paraître agressif ?"
```

```
/emil-design-eng
→ "Review de la fiche événement. Quels détails invisibles 
   rendraient cette page mémorable ?"
```

#### Dashboard Organisateur

```
/ui-ux-pro-max
→ "Dashboard analytics pour organisateurs d'événements étudiants.
   KPIs : vues, favoris, billets vendus, revenus en FCFA.
   Mobile-first mais adapté desktop."

/design-taste-frontend (5/4/7) — VISUAL_DENSITY à 7 car dashboard
```

#### Composants partagés

```
/vercel-composition-patterns
→ "Implémente EventCard comme un compound component avec
   EventCard.Cover, EventCard.Info, EventCard.Actions"
```

---

## Phase 3 — Motion & Animations

> **Objectif :** Rendre l'interface vivante sans en faire trop.

### Étape 3.1 — Philosophie d'abord

```
/motion-design
→ "Univibes est une plateforme événementielle pour étudiants.
   MOTION_INTENSITY = 6. Définis la hiérarchie d'animations :
   quoi animer, avec quels timings, et surtout quoi NE PAS animer."
```

### Étape 3.2 — Composants animés

```
/design-motion-principles (mode: build)
→ "Construis ces composants avec motion intentionnelle :
   1. EventCard avec hover scale + shadow lift
   2. FavoriteButton avec micro-animation coeur
   3. Bottom navigation avec active state spring
   4. Toast notification avec slide-in
   5. Skeleton loader vers contenu réel"
```

### Étape 3.3 — Transitions de pages

```
/vercel-react-view-transitions
→ "Implémente les View Transitions entre :
   - /explore → /event/[slug] (shared element : cover image)
   - Navigation bottom bar (crossfade)
   - Modal d'achat de billet (slide-up)"
```

### Animations spécifiques Univibes

```
/design-motion-principles (mode: build)
→ "Animation du compteur de billets restants (ex: 12 → 11).
   Spring physics, pas de linear. Doit créer un sentiment d'urgence subtil."
```

```
/emil-design-eng
→ "Review des animations. Lesquelles donnent l'impression de 
   vouloir impressionner ? (À supprimer) vs lesquelles servent 
   réellement l'utilisateur ?"
```

---

## Phase 4 — Polish & Détails invisibles

> **Objectif :** Passer de "bon" à "excellent". C'est ici que la différence se fait.

### Étape 4.1 — Emil polish

```
/emil-design-eng
→ "Revois tous les composants. Liste les 10 détails 
   qui pourraient élever l'interface d'un niveau :
   - États intermédiaires (loading, empty, error)
   - Feedback haptic-like (micro rebonds)
   - Cohérence des espaces entre textes et icônes
   - Qualité des états désactivés"
```

### Étape 4.2 — Microcopy

```
/ux-writing
→ "Univibes, plateforme étudiante Afrique francophone.
   Écris le microcopy pour :
   - État vide des favoris
   - Message d'erreur paiement FedaPay échoué
   - Confirmation d'achat billet
   - Onboarding step 1 (étudiant)
   - Email de rappel événement
   Ton : chaleureux, direct, jeune mais pas familier."
```

### Étape 4.3 — États oubliés

```
/impeccable
→ "Audit complet des états manquants :
   - Loading skeletons pour chaque composant
   - Empty states pour favoris vides, dashboard sans événements
   - Error states pour paiement, upload image
   - Offline indicator
   - Toast de succès/erreur"
```

---

## Phase 5 — Validation & QA

> **Objectif :** Détecter et corriger avant que les utilisateurs ne le fassent.

### Étape 5.1 — QA visuelle

```
/design-review
→ "Review complète de l'interface Univibes :
   - Hiérarchie typographique respectée ?
   - Cohérence des spacing entre pages ?
   - Dark mode fonctionnel partout ?
   - Responsive breakpoints (320px, 768px, 1440px) ?
   - Contrastes accessibles ?"
```

### Étape 5.2 — Accessibilité

```
/accessibility-expert
→ "Audit WCAG 2.1 AA de Univibes.
   Focus sur :
   - Navigation clavier dans le catalogue
   - ARIA labels sur les EventCards
   - Contraste du texte sur les affiches d'événements
   - Focus visible sur les CTAs mobiles"
```

### Étape 5.3 — Standards web

```
/web-design-guidelines apps/web/src/
→ Audit automatique contre 100+ règles Vercel :
  Core Web Vitals, ARIA, états de chargement, etc.
```

### Étape 5.4 — Refactoring ciblé

```
/ui-refactor
→ "Voici les problèmes identifiés dans la review. 
   Corrige-les dans l'ordre, en justifiant chaque changement :
   [coller la liste des problèmes]"
```

### Étape 5.5 — Audit d'animations

```
/design-motion-principles (mode: audit)
→ Génère un rapport HTML avec les animations qui :
   - Sont trop rapides ou trop lentes
   - Manquent d'easing
   - Créent des CLS (layout shifts)
   - Sont redondantes
```

---

## Workflows rapides par situation

### "Je veux coder une page from scratch"

```
1. /design-tokens (si pas encore fait)
2. /ui-ux-pro-max → patterns pour ce type de page
3. /impeccable → direction visuelle
4. /design-taste-frontend (7/6/5) + /full-output-enforcement
6. /emil-design-eng → review post-build
7. /design-motion-principles (build) → animations
8. /web-design-guidelines → validation
```

### "J'ai une page qui manque de personnalité"

```
1. /impeccable → identifier ce qui est générique
2. /high-end-visual-design → appliquer les standards premium
3. /design-taste-frontend (8/7/5) → hausser le DESIGN_VARIANCE
4. /design-review → confirmer l'amélioration
```

### "Je veux améliorer l'accessibilité"

```
1. /accessibility-expert → audit complet
2. /web-design-guidelines → contrôle des 100+ règles
3. /ux-writing → améliorer le microcopy pour screen readers
4. /ui-refactor → appliquer les corrections
```

### "L'interface est trop lente"

```
1. /vercel-react-best-practices → audit performance
2. /vercel-optimize → Core Web Vitals
3. /vercel-react-view-transitions → transitions natives (zero JS)
4. /web-design-guidelines → vérification LCP/CLS/INP
```

### "Je veux un redesign complet d'une page existante"

```
1. /redesign-existing-projects → audit + plan
2. /impeccable → nouvelle direction
3. /design-taste-frontend (7/6/5) + /full-output-enforcement
5. /design-review → QA
```

### "Les animations sont cheap"

```
1. /design-motion-principles (audit) → rapport HTML
2. /motion-design → philosophie à appliquer
3. /design-motion-principles (build) → reconstruire
4. /emil-design-eng → review finale
```

---

## La combinaison ultime pour une page héroïque

Pour les pages les plus importantes (Homepage, Event Details), utilise cette séquence complète :

```
Phase 1 (20 min) :
  /grill-me sur cette page spécifique
  /impeccable → direction visuelle

Phase 2 (construction) :
  /ui-ux-pro-max → patterns + palette
  /high-end-visual-design → standards premium
  /design-taste-frontend (7/6/5) + /full-output-enforcement

Phase 3 (motion) :
  /design-motion-principles (build) → animations
  /vercel-react-view-transitions → transitions

Phase 4 (polish) :
  /emil-design-eng → détails invisibles
  /ux-writing → microcopy

Phase 5 (validation) :
  /design-review → QA visuelle
  /accessibility-expert → a11y
  /web-design-guidelines → standards web
  /impeccable → regard final

DÉPLOIEMENT :
  /vercel-cli-with-tokens → mise en production
```

---

## Règles anti-slop pour Univibes

Ces règles s'appliquent à **chaque interaction avec les skills design** :

### Ce qu'il ne faut JAMAIS produire

- Des cards identiques en taille et en structure sur la même page
- Un hero avec fond uni blanc et texte centré
- Des icônes génériques sans personnalité
- Des boutons avec juste `rounded-md` et `bg-primary`
- Des animations `transition-all` sans timing précis
- Des empty states avec juste "Aucun résultat"
- Du texte sur fond d'affiche d'événement sans overlay lisible

### Ce qu'il faut TOUJOURS faire

- Des tailles de texte vraiment contrastées (pas 16px et 18px — 12px et 40px)
- Des shadows avec une teinte colorée (shadow verte pour les cards featured)
- Des états de loading spécifiques à chaque composant (pas un spinner global)
- Une hiérarchie visuelle qui guide l'œil en moins de 3 secondes
- Des animations avec un purpose (feedback, orientation, focus)
- Un dark mode pensé dès le début, pas ajouté en dernier

---

## Rappel : `/impeccable` — le skill oublié

> **Ce skill est probablement le plus important de tous.**

`/impeccable` est un skill polyvalent qui couvre simultanément :
- UX review (hiérarchie, information architecture, cognitive load)
- Visual design (spacing, typography, color, layout)
- Accessibility (contrastes, navigation)
- Performance (motion, interactions)
- Dark mode et responsive behavior
- Design systems et tokens

**Il doit être lancé :**
1. **Avant la construction** d'une page importante → pour définir la direction
2. **Après la construction** → pour identifier ce qui peut encore être élevé
3. **Quand quelque chose "ne semble pas juste"** mais que tu n'arrives pas à identifier pourquoi

C'est le skill qui fait la différence entre un design correct et un design mémorable.

---

## Résumé visuel du workflow complet

```
FOUNDATION
│
├── /grill-me              → Clarifier la vision
├── /design-brief          → Formaliser → DESIGN_BRIEF.md
├── /information-architecture → Structure des pages
├── /design-tokens         → Système de tokens → tailwind.config.ts
└── /brief-to-tasks        → Plan de travail → TASKS.md
│
DIRECTION
│
├── /ui-ux-pro-max         → Intelligence design (161 palettes, 99 guidelines)
├── /impeccable            → Direction premium + anti-générique
└── /high-end-visual-design → Standards visuels haut de gamme
│
BUILD
│
├── /design-taste-frontend (7/6/5) → Code frontend premium
├── /full-output-enforcement       → Zéro troncature
├── /vercel-react-best-practices   → Performance Next.js
└── /vercel-composition-patterns   → Architecture composants
│
MOTION
│
├── /motion-design                  → Philosophie animation
├── /design-motion-principles (build) → Composants animés
└── /vercel-react-view-transitions  → Transitions de pages
│
POLISH
│
├── /emil-design-eng    → Détails invisibles
├── /ux-writing         → Microcopy
└── /impeccable         → Regard final
│
VALIDATE
│
├── /design-review               → QA visuelle
├── /accessibility-expert        → WCAG 2.1 AA
├── /web-design-guidelines       → 100+ règles Vercel
├── /design-motion-principles (audit) → QA animations
└── /ui-refactor                 → Corrections ciblées
│
DEPLOY
│
└── /vercel-cli-with-tokens      → Mise en production
```

---

*Ce document est la référence design de Univibes. À consulter avant chaque session de design ou de code frontend.*
