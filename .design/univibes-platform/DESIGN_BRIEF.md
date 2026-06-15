# Design Brief: Univibes Platform

## Problem

Un étudiants en Afrique francophone veut découvrir des événements près de chez lui — soirées, conférences, hackathons — mais l'information est éparpillée sur WhatsApp, Instagram, affiches papier. Il n'existe pas de point central où trouver, réserver et gérer sa vie étudiante. Côté organisateur, les assos passent des heures à promouvoir sans vraie solution de billetterie.

## Solution

Univibes est un hub de vie étudiante : catalogue d'événements, billetterie, profils d'organisateurs, et dashboard de gestion. L'interface doit sentir *"Spotify des événements"* — énergique, visuelle, premium mais accessible. Mobile-first, pensée pour des étudiants qui découvrent le contenu par scroll et par envie.

## Experience Principles

1. **Découverte fluide avant recherche précise** — L'utilisateur doit pouvoir scroller et butiner avant d'utiliser les filtres. Le contenu visuel (affiches, images) prime sur les listes textuelles.
2. **Confiance et sérieux sans être institutionnel** — La plateforme doit rassurer (paiements, fiabilité) sans paraître froide. Le ton est chaleureux et direct, pas corporate.
3. **Premium accessible** — L'interface doit paraître soignée et moderne sans être minimaliste. Les étudiants doivent sentir qu'ils utilisent un vrai produit, pas un projet étudiant.

## Aesthetic Direction

- **Philosophy**: Warm modernist — éditorial, généreux en espace, typographie contrastée, une palette terreuse sophistiquée.
- **Tone**: Énergique mais posé. Pas d'urgence artificielle. De la chaleur sans familiarité excessive.
- **Reference points**: Airbnb (générosité des cards), Spotify (énergie des sections), Linear (clarté des dashboards).
- **Anti-references**: Eventbrite (trop dense, pas assez visuel), Facebook Events (confus, laid), sites institutionnels (froids, rigides).

## Palette — Terra

Direction unique : tons terreux, chauds, sophistiqués. Zéro vert, zéro couleur vive.

### Light Mode

| Token | Color | Hex |
|---|---|---|
| Brand primary | Rich clay | `#7A4D3A` |
| Brand hover | Deep clay | `#664030` |
| Brand subtle | Warm cream | `#F0EBE6` |
| Accent | Warm amber | `#C4956A` |
| Accent hover | Deep amber | `#B0845A` |
| Accent subtle | Pale amber | `#F5EEE6` |
| Surface | White | `#FFFFFF` |
| Background | Warm off-white | `#F8F6F4` |
| Text primary | Warm black | `#2A2725` |
| Text secondary | Warm grey | `#7A7068` |
| Text tertiary | Light warm | `#B0A69C` |
| Border | Warm border | `#E8E2DC` |
| Border subtle | Warm light | `#F2EEE9` |
| Error | Deep rose | `#B33A3A` |
| Success | Muted emerald | `#3A7A5C` |

### Dark Mode

| Token | Color | Hex |
|---|---|---|
| Brand primary | Warm amber | `#C4956A` |
| Background | Warm dark | `#151210` |
| Surface | Raised dark | `#1E1A18` |
| Text | Warm light | `#F0ECE8` |

Shadows teintées avec la couleur brand (var(--brand) en alpha).

## Existing Patterns

- **Stack**: Next.js 16 App Router, Tailwind v4, shadcn/ui primitives, framer-motion.
- **Composants existants**: `Button`, `Badge`, `Input`, `Skeleton`, `EventCard`, `Navbar`, `BottomNav`.
- **Layout**: Bottom navigation mobile (Home, Explore, Tickets, Favorites, Profile), Navbar desktop.
- **État**: Landing page construite avec des données mock. Palette actuelle à remplacer (vert → terra).

## Component Inventory

| Component | Status | Notes |
|---|---|---|
| Button | Modify | Changer les couleurs, ajouter variante terra |
| Badge | Exists | OK, ajuster couleurs |
| Input | Exists | OK |
| Skeleton | Exists | OK |
| EventCard | Modify | Redesign couleur, ajouter variants (featured/standard) |
| Navbar | Modify | Ajuster couleurs |
| BottomNav | Modify | Ajuster couleurs, icônes |
| CategoryChip | New | Affichage des catégories |
| TicketCard | New | Pour la billetterie |
| DashboardCard | New | KPIs organiseur/admin |
| Modal/Drawer | New | Utiliser Vaul (already in deps) |
| Tabs | New | Pour dashboards (compatible shadcn) |

## Key Interactions

- **Scroll horizontal** des événements featured sur la homepage (mobile)
- **Sticky CTA** sur fiche événement (bouton réserver en bas)
- **Bottom nav** avec highlight sur la section active
- **Micro-animation** favori (scale + fill)
- **Drawer filtres** sur catalogue mobile (pas de page séparée)
- **Skeleton loading** spécifique par type de contenu

## Responsive Behavior

- **Mobile-first** (320px breakpoint minimum)
- **Bottom nav** apparaît < 768px, disparaît ≥ 768px
- **Sidebar filtres** catalogue : drawer mobile, sidebar desktop
- **Event cards** : 1 col mobile, 2 col tablet, 3-4 col desktop
- **Dashboards** : stacked mobile, grille desktop

## Accessibility Requirements

- WCAG 2.1 AA minimum
- Contrast ratio ≥ 4.5:1 pour le texte normal
- Navigation clavier dans le catalogue
- ARIA labels sur EventCard, BottomNav, boutons icon
- Focus visible sur tous les éléments interactifs

## Out of Scope

- Version Flutter / mobile native
- Blog (Phase 3+)
- Paiements réels (maquettes seulement dans cette phase)
- Dashboard admin avancé (analytics graphiques)
