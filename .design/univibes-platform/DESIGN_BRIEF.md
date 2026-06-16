# Design Brief: Univibes Platform

## Problem

Un étudiant au Bénin veut découvrir des événements près de chez lui — soirées, conférences, hackathons — mais l'information est éparpillée sur WhatsApp, Instagram, affiches papier. Il n'existe pas de point central où trouver, réserver et gérer sa vie étudiante. Côté organisateur, les assos passent des heures à promouvoir sans vraie solution de billetterie.

## Solution

Univibes est un hub de vie étudiante : catalogue d'événements, billetterie, profils d'organisateurs, et dashboard de gestion. L'interface doit sentir *"Spotify des événements"* — énergique, visuelle, premium mais accessible. Mobile-first, pensée pour des étudiants qui découvrent le contenu par scroll et par envie.

## Experience Principles

1. **Découverte fluide avant recherche précise** — L'utilisateur doit pouvoir scroller et butiner avant d'utiliser les filtres. Le contenu visuel (affiches, images) prime sur les listes textuelles.
2. **Confiance et sérieux sans être institutionnel** — La plateforme doit rassurer (paiements, fiabilité) sans paraître froide. Le ton est chaleureux et direct, pas corporate.
3. **Premium accessible** — L'interface doit paraître soignée et moderne sans être minimaliste. Les étudiants doivent sentir qu'ils utilisent un vrai produit, pas un projet étudiant.

## Aesthetic Direction

- **Philosophy**: Digital night — vibrant, électrique, contrasté. Une palette violet/rose qui évoque la vie nocturne et la créativité étudiante.
- **Tone**: Énergique, audacieux, moderne. Du punch sans être agressif.
- **Reference points**: Spotify (énergie des sections), Twitch (communauté), VSCO (esthétique curated mais avec plus de contraste).
- **Anti-references**: Eventbrite (trop dense, pas assez visuel), sites institutionnels (froids, rigides), banques (sérieux, sans personnalité).

## Palette — NOVA

Direction unique : violet électrique, rose fluo, neutres teintés violet. Digital, nuit, club.

### Light Mode

| Token | Color | Hex |
|---|---|---|
| Brand primary | Violet vibrant | `#7C3AED` |
| Brand hover | Violet profond | `#6D28D9` |
| Brand subtle | Lavande | `#F5F0FF` |
| Accent | Rose fluo | `#EC4899` |
| Accent hover | Rose foncé | `#DB2777` |
| Accent subtle | Rose pâle | `#FDF2F8` |
| Gold | Rose clair | `#F472B6` |
| Gold hover | Rose vif | `#E11D48` |
| Surface | Blanc | `#FFFFFF` |
| Background | Gris lavande | `#FAF8FC` |
| Text primary | Almost black | `#0F0A1E` |
| Text secondary | Gris violet | `#6B6478` |
| Text tertiary | Violet clair | `#A89FB8` |
| Border | Lavande bordure | `#E8E2F0` |
| Border subtle | Lavande pâle | `#F4F0FA` |
| Error | Rouge | `#EF4444` |
| Success | Émeraude | `#10B981` |

### Dark Mode

| Token | Color | Hex |
|---|---|---|
| Brand primary | Violet clair | `#C084FC` |
| Brand hover | Lavande clair | `#D4A0FF` |
| Background | Noir violet | `#0A0A12` |
| Surface | Gris violet foncé | `#1A1625` |
| Surface raised | Violet foncé | `#221E33` |
| Accent | Rose | `#F472B6` |
| Text | Blanc lavande | `#F0ECF8` |
| Text secondary | Gris perle | `#8E84A4` |

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
