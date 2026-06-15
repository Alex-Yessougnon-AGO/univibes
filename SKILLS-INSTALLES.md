# Skills Installés

Date d'installation : 12 Juin 2026

---

## Skills Designer (Julian Oczkowski) — `julianoczkowski/designer-skills`

Ces 8 skills forment un **processus de design professionnel complet** pour les agents IA. Ils peuvent être utilisés individuellement ou via `/design-flow` qui les orchestre automatiquement.

| # | Skill | Rôle | Quand l'utiliser |
|---|-------|------|-----------------|
| 1 | **`/grill-me`** | Te questionne sans relâche jusqu'à clarifier chaque décision design. Stress-test des prérequis avant d'écrire la moindre ligne de code. | Au tout début, quand tu as une idée vague mais pas de specs claires. Prépare-toi à 20 min de questions. |
| 2 | **`/design-brief`** | Génère un design brief structuré. Explore le codebase existant, pose des questions sur le ton émotionnel et les inspirations visuelles. Sauvegarde un fichier `DESIGN_BRIEF.md`. | Après `/grill-me`, pour formaliser les décisions. |
| 3 | **`/information-architecture`** | Définit le squelette structurel : navigation, hiérarchie du contenu, structure des pages, URLs, flux utilisateurs. | Avant de coder, pour planifier l'architecture des pages. |
| 4 | **`/design-tokens`** | Génère un système de tokens complet : couleurs (light + dark mode), spacing scale, typographie, motion, breakpoints. Sortie en CSS variables ou Tailwind config. | Après le brief, avant de construire les composants. |
| 5 | **`/brief-to-tasks`** | Décompose le design brief en tâches actionnables ordonnées (foundation → core UI → responsive → polish). | Avant de commencer l'implémentation, pour avoir un plan de travail. |
| 6 | **`/frontend-design`** | Génère le code frontend réel à partir du brief + IA + tokens + task list. Composants, pages, layouts. | Phase de construction. |
| 7 | **`/design-review`** | Analyse le rendu final (via screenshots ou Playwright), détecte problèmes de spacing, hiérarchie, accessibilité, dark mode. Propose et applique des correctifs. | Après la génération, pour QA visuelle. |
| 8 | **`/design-flow`** | **Orchestrateur** — exécute les 7 skills dans l'ordre automatiquement, confirme entre chaque étape. | Pour lancer le processus complet en une commande. |

### Installation

```bash
npx skills add julianoczkowski/designer-skills
```

---

## Skills Vercel Labs — `vercel-labs/agent-skills`

### 1. `/web-design-guidelines`

Audite le code UI contre les **Web Interface Guidelines** officielles de Vercel.

- **100+ règles** couvrant : accessibilité (WCAG 2.1 AA), performance (Core Web Vitals), UX patterns, typographie, contraste, responsive, interaction design
- Vérifie : rôles ARIA, navigation clavier, LCP/CLS/INP, états de chargement/vide/erreur, dark mode
- Récupère les règles à jour depuis le repo officiel Vercel à chaque exécution

**Usage :** `/web-design-guidelines <fichier-ou-pattern>`

---

### 2. `/vercel-react-best-practices`

Guide d'optimisation React/Next.js par l'équipe Vercel Engineering.

- Patterns de performance, Server Components, streaming, caching
- Optimisation des bundles, images, polices
- Recommandations d'architecture

---

### 3. `/vercel-composition-patterns`

Patterns de composition React : render props, slots, compound components, etc.

---

### 4. `/deploy-to-vercel`

Guide de déploiement d'applications sur Vercel. Configuration, variables d'environnement, domains.

---

### 5. `/vercel-optimize`

Optimisation des performances : Core Web Vitals, Lighthouse, analyses de bundle.

---

### 6. `/vercel-react-native-skills`

Bonnes pratiques React Native.

---

### 7. `/vercel-react-view-transitions`

Implémentation des View Transitions API dans React/Next.js.

---

### 8. `/vercel-cli-with-tokens`

Guide d'utilisation du CLI Vercel avec tokens d'authentification.

---

### 9. `/writing-guidelines`

Guide d'écriture technique : documentation, messages de commit, communication.

---

### Installation

```bash
npx skills add vercel-labs/agent-skills
```

---

## Skills UI/UX Pro Max — `nextlevelbuilder/ui-ux-pro-max-skill`

Base de données d'intelligence design complète pour le web et le mobile.

- **67 styles UI** (glassmorphism, neumorphism, minimalism, brutalism, bento grid, etc.)
- **161 palettes couleurs** par type de produit (SaaS, E-commerce, Santé, Fintech, etc.)
- **57 paires typographiques** avec intégration Google Fonts + Tailwind config
- **99 guidelines UX** organisées par priorité (critical → low)
- **25 types de charts** avec suggestions de librairies
- **16 stacks supportées** (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, etc.)
- **161 règles de raisonnement** par type de produit

**Usage :** `/ui-ux-pro-max` ou demande "check mon UI avec UI UX Pro Max"

---

## Skills Taste / Design Taste Frontend — `Leonxlnx/taste-skill`

Collection de skills anti-slop pour du frontend premium. 6 skills installés :

| Skill | Rôle |
|-------|------|
| **`/design-taste-frontend`** | Skill principal. Génère des interfaces premium avec paramétrage 3 dials : DESIGN_VARIANCE (1-10), MOTION_INTENSITY (1-10), VISUAL_DENSITY (1-10) |
| **`/design-taste-frontend-v1`** | Version alternative du skill principal |
| **`/stitch-design-taste`** | Pour combiner plusieurs styles/tokens ensembles |
| **`/high-end-visual-design`** | Design haut de gamme avec animations GSAP/Framer Motion |
| **`/redesign-existing-projects`** | Audit et redesign de projets existants |
| **`/minimalist-ui`** | UI minimaliste, propre, spacieuse |
| **`/full-output-enforcement`** | Empêche l'IA de couper des coins, outputs tronqués, commentaires placeholder |
| **`/gpt-taste`** | Variante optimisée pour les modèles GPT |

### Les 3 paramètres du taste-skill

```
DESIGN_VARIANCE (1-10) : À quel point le design est expérimental
  - 1-3: Clean, centré, grilles standards
  - 4-7: Éléments qui se chevauchent, tailles variées
  - 8-10: Asymétrique, beaucoup d'espace, très moderne

MOTION_INTENSITY (1-10) : Quantité d'animations
  - 1-3: Presque rien. Simples hover effects
  - 4-7: Fade-ins, smooth scrolling
  - 8-10: Effets magnétiques, spring physics, scroll-triggered

VISUAL_DENSITY (1-10) : Densité du contenu
  - 1-3: Très aéré, un élément à la fois. Luxe.
  - 4-7: Espacement normal
  - 8-10: Dense et compact. Dashboards, data-heavy
```

---

## Skills Refactoring UI — `LovroPodobnik/refactoring-ui-skill`

### 1. `/ui-refactor`

Guide tactique de design UI pour corriger les layouts, choisir couleurs/polices et créer des interfaces professionnelles. Basé sur le livre _Refactoring UI_ d'Adam Wathan & Steve Schoger.

**Usage :** `/ui-refactor` quand tu as besoin d'aide pour "rendre ça plus beau", des décisions CSS/styling, ou créer un design system.

---

## Skills Apple HIG — `raintree-technology/apple-hig-skills`

14 skills couvrant les **Human Interface Guidelines** officielles d'Apple. Pour tout design iOS/iPadOS/macOS :

| Skill | Rôle |
|-------|------|
| `/hig-foundations` | Fondations HIG : thèmes, couleurs, typographie, iconographie, formes, matériaux |
| `/hig-components-content` | Composants de contenu : texte, listes, tableaux, collections |
| `/hig-components-controls` | Contrôles : boutons, sliders, switches, steppers, toggles |
| `/hig-components-dialogs` | Dialogs : alertes, popovers, sheets, panes, modales |
| `/hig-components-layout` | Layout : split views, navigation, tabs, scroll views |
| `/hig-components-menus` | Menus : contextuels, pull-down, pop-up, commandes |
| `/hig-components-search` | Recherche : search fields, scopes, suggestions |
| `/hig-components-status` | Status : progress indicators, spinners, activity views |
| `/hig-components-system` | Système : San Francisco, Dynamic Type, SF Symbols |
| `/hig-inputs` | Inputs : champs texte, formulaires, sélecteurs de date |
| `/hig-patterns` | Patterns : onboarding, gestes, drag-and-drop, undo/redo |
| `/hig-platforms` | Platforms : iOS vs macOS vs iPadOS vs watchOS vs visionOS |
| `/hig-project-context` | Contexte projet : structure Xcode, organisation views |
| `/hig-technologies` | Technologies : SwiftUI, UIKit, AppKit, Catalyst |

---

## Skills Material 3 — `hamen/material-3-skill`

### 1. `/material-3`

Implémentation complète de **Material Design 3 (Material You)** de Google. Couvre tokens, 30+ composants, layout, theming, adaptive layout, M3 Expressive et accessibilité.

**Usage :** `/material-3` pour Jetpack Compose, Flutter, ou web (@material/web)

---

## Skills AI UX — `slb2248/ai-ux-skills`

5 skills pour le design UX d'interfaces AI-native :

| Skill | Rôle |
|-------|------|
| `/accessibility-expert` | Expert en accessibilité (WCAG 2.1/2.2, ARIA, navigation clavier, contrastes) |
| `/ai-native-product-designer` | Design de produits AI-native : patterns d'interaction IA, feedback loops, explainability |
| `/design-critique` | Critique systématique de designs : identification de problèmes visuels et UX |
| `/design-workshop-facilitation` | Facilitation d'ateliers design : brainstorming, critique, priorisation |
| `/ux-writing` | Rédaction UX : microcopies, messages d'erreur, onboarding, calls-to-action |

---

## Skills Design Engineer — `emilkowalski/skill`

### 1. `/emil-design-eng`

La philosophie d'**Emil Kowalski** (Design Engineer chez Vercel, créateur de vaul, sonnerie, etc.) sur le polish UI, le design de composants, les décisions d'animation, et les détails invisibles qui rendent un logiciel excellent.

**Usage :** `/emil-design-eng` pour review d'interfaces, animations, composants React

---

## Skills Motion Design — `kylezantos/design-motion-principles` + `LottieFiles/motion-design-skill`

### 1. `/design-motion-principles`

Design de motion et d'interaction basé sur les techniques d'**Emil Kowalski, Jakub Krehel et Jhey Tompkins**. Deux modes :
- **Build** : composants interactifs avec motion intentionnelle
- **Audit** : review d'animations existantes avec rapport HTML

### 2. `/motion-design`

Principes universels de motion design pour agents IA. Philosophie-first, implémentation-agnostique. Timing, easing, chorégraphie, 12 principes Disney adaptés à l'UI. Compatible CSS, Framer Motion, GSAP, Lottie, Spring.

---

## Chemins d'installation

| Chemin | Portée |
|--------|--------|
| `~/.agents/skills/` | **Globale** (tous les agents : Claude Code, Cursor, Codex, Cline, Windsurf, etc.) |
| `~/.claude/skills/` | **Claude Code** uniquement |
| `./.agents/skills/` | **Locale** (projet uniquement) |
| `~/.config/agents/skills/` | **Globale** (agents universels) |

---

## Résumé des commandes

```bash
# Lister les skills installés
npx skills list

# Lister les skills globalement
npx skills list --global

# Ajouter un skill
npx skills add <owner/repo>

# Supprimer un skill
npx skills remove <skill-name>
```
