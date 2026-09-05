# Univibes — Design Unifié « NOVA Épuré »

> **Statut :** référence unique. Ce document tranche les contradictions entre
> `DESIGN.md` (NOVA), les captures `.design/` (TERRA, obsolètes) et les specs
> `FIGMA`/`UX` (vert/or, préhistoire). En cas de conflit, **ce document gagne**.

## 1. Décision

**NOVA raffiné, pas remplacé.** Le violet électrique `#7C3AED` reste l'âme de la
marque (énergie étudiante, différenciation vs Eventbrite). Le changement est
dans la **discipline** : air, hiérarchie stricte, un seul focus par écran.

| Ancien problème | Règle désormais |
|---|---|
| Hero surchargé (collage + badges + 2 CTA) | Hero centré : 1 message, 1 recherche, preuve discrète |
| Calistoga sur tous les titres | Calistoga = hero + chiffres display **uniquement** |
| Sections tassées, 7 blocs denses | Rythme unique `.section` (4rem → 6.5rem), 1 focus/écran |
| Badge prix rose `#f472b6` illisible | Payant = fond `brand-subtle` / texte `brand` ; gratuit = rose |
| États vides improvisés | Composant `EmptyState` unique (icône + titre + action) |
| En-têtes de pages incohérents | `SectionHeader` (vitrine) + `PageHeader` (app) uniques |
| KPIs bricolés par page | `StatCard` unique (chiffre display + delta) |
| `var(--success/warning/error)` inexistants | Tokens sémantiques définis (light + dark) |
| Emojis drapeaux dans le menu | Interdit (pills FR / EN) |
| `pressable` sur tous les `div` | Réservé aux éléments interactifs |

## 2. Fondations (`globals.css` — couche « NOVA Épuré »)

- **Layout :** `.container-x` (1216px), `.container-narrow` (896px),
  `.section` / `.section-tight` (rythme vertical unique).
- **Typographie :** `.display` (Calistoga, hero/chiffres), `.h-section`
  (Inter 700, `-0.02em`, titres de sections/pages), `.eyebrow` (label
  uppercase `0.18em`), `.lead` (paragraphes d'intro).
- **Surfaces :** `.card-xl` (20px), `.card-sheet` (28px), `.divider`.
- **Formulaires :** `.field` + `.field-label` (base unique, focus violet).
- **Filtres :** `.pill` / `.pill-active`.
- **Signature hero :** `.hero-halo` (halo radial violet) + `.hero-grid`
  (grille masquée en radial). Sobre, non animée, distinctive.
- **Détails :** `::selection` violette, scrollbars fines, rayons cartes 20px.

## 3. Composants partagés

| Composant | Fichier | Usage |
|---|---|---|
| `Logo` / `LogoLink` | `shared/logo.tsx` | Navbar, footer, auth — signature unique |
| `SectionHeader` | `shared/section-header.tsx` | Toutes les sections vitrine |
| `PageHeader` | `shared/page-header.tsx` | Dashboard, admin, modérateur, profil… |
| `EmptyState` | `shared/empty-state.tsx` | Tous les états vides |
| `StatCard` | `shared/stat-card.tsx` | Tous les KPIs |
| `EventCard` | `events/event-card.tsx` | standard / featured / compact — aérée, prix lisible |

## 4. Pages vitrine

- **Landing (`/[locale]/page.tsx`) :** hero centré → bandeau 3 chiffres →
  catégories → immanquables (scroll) → cette semaine (grille) → organisateurs
  (panneau) → témoignage → CTA organisateur. Zéro bento, zéro faux dashboard.
- **Explore :** en-tête aéré + eyebrow, sidebar en carte, `EmptyState` unifié,
  lecture du paramètre `?city=` depuis le hero.
- **Événement :** cartes 20px, sidebar `top-28`, couleurs sémantiques réparées.

## 5. Finitions produit

- `sitemap.ts` (12 routes × fr/en), `loading.tsx` + `error.tsx` sur `[locale]`.
- Clés i18n `error.description` ajoutées fr + en (sync maintenue).
- Navbar : pilule de liens, recherche ⌘K, CTA Connexion + Créer un compte,
  menu mobile épuré. BottomNav : pastille active.
- Footer : 3 colonnes + barre légale, espace BottomNav mobile.

## 6. Palettes officiellement abandonnées

- **TERRA** (marron/clay des captures) : sprint obsolète, captures à refaire.
- **Vert `#0F5132` / Or `#D4AF37`** (FIGMA/UX specs) : jamais implémentés,
  contredisent l'identité « Spotify des événements ».

## 7. Règles d'or (revue de code)

1. Un seul violet leader ; le rose reste rare (≤ 15 %).
2. Calistoga hors hero/chiffres = refusé.
3. Toute nouvelle section utilise `SectionHeader`, toute page app `PageHeader`.
4. Aucun état vide sans `EmptyState`. Aucun emoji dans l'UI.
5. Espacement : `.section` par défaut ; jamais de `py` improvisé entre sections.
