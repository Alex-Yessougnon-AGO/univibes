---
name: Univibes
description: Student event platform — discover and book events in Benin
colors:
  brand: "#7c3aed"
  brand-hover: "#6d28d9"
  brand-subtle: "#f5f0ff"
  brand-text: "#7c3aed"
  accent: "#ec4899"
  accent-hover: "#db2777"
  accent-subtle: "#fdf2f8"
  gold: "#f472b6"
  gold-hover: "#e11d48"
  gold-subtle: "#fdf2f8"
  bg: "#faf8fc"
  surface: "#ffffff"
  surface-raised: "#ffffff"
  border: "#e8e2f0"
  border-subtle: "#f4f0fa"
  text: "#0f0a1e"
  text-secondary: "#6b6478"
  text-tertiary: "#a89fb8"
  success: "#10b981"
  warning: "#f59e0b"
  error: "#ef4444"
typography:
  display:
    fontFamily: "Calistoga, serif"
    fontSize: "clamp(2rem, 6vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.05
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.15em"
    textTransform: "uppercase"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 24px 12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.brand-hover}"
    shadow: "0 6px 20px rgba(124, 58, 237, 0.35)"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.border}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 24px 12px 24px"
  card-default:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.border}"
    padding: "0"
  nav-item-active:
    textColor: "{colors.brand}"
    fontWeight: 600
---

# Design System: Univibes — NOVA

## 1. Overview

**Creative North Star: "The Campus Pulse"**

Univibes speaks the visual language of a premium student lifestyle brand — energetic, confident, and unmistakably modern. The system pairs a bold violet primary with a rose accent against warm-toned neutrals, creating an atmosphere that feels both sophisticated and approachable. This is not a corporate event platform; it is the digital hub of student life in Benin.

The design is mobile-first by constitution. Every component is built for thumb reach and glanceability. Affordances are generous (large touch targets, clear hierarchy), and information is surfaced in digestible cards and horizontal scrolls that reward exploration.

**Key Characteristics:**
- Bold violet + rose palette with warm neutral grounds
- Generous rounded corners (12-24px on containers)
- Calistoga display type for expressive headings, Inter body for clean readability
- Glassmorphism reserved for transient UI (navbar, overlays) — never on content cards
- Horizontal scroll as a discovery pattern (mobile-native)
- Card-based content hierarchy with clear visual weight differentiation

**Explicitly rejects:** Eventbrite clone grids, Facebook Events density, corporate minimalism, crypto/startup dark neon.

## 2. Colors

The NOVA palette is anchored by a deep violet primary, a rose accent, and warm-tinted neutrals. Despite the naming, `--gold` tokens resolve to rose — this is intentional and should not be renamed.

### Primary
- **Deep Violet** (`#7c3aed` / `oklch(50% 0.23 280)`): Primary actions, interactive elements, brand iconography. The dominant color.
- **Hover Violet** (`#6d28d9`): Button hover state, interactive element feedback.
- **Subtle Violet** (`#f5f0ff`): Selected states, soft brand backgrounds, pill badges.
- **Violet Text** (`#7c3aed`): Brand-colored text labels on light backgrounds.

### Accent
- **Rose** (`#ec4899` / `oklch(58% 0.22 350)`): Secondary / promotional actions, "free" price badges, highlight elements.
- **Rose Hover** (`#db2777`): Accent button hover.
- **Rose Subtle** (`#fdf2f8`): Soft accent backgrounds.

### Gold (Rose-family)
- **Gold** (`#f472b6`): Price badges, event cost indicators. Despite the name, resolves to light rose.
- **Gold Hover** (`#e11d48`): Gold element hover (deep rose).
- **Gold Subtle** (`#fdf2f8`): Gold background tint (shared with accent-subtle).

### Neutral
- **Warm Off-White** (`#faf8fc`): Page background. A whisper of violet warmth.
- **Pure White** (`#ffffff`): Card surfaces, raised panels.
- **Lavender Border** (`#e8e2f0`): Card borders, dividers.
- **Lighter Border** (`#f4f0fa`): Subtle dividers, skeleton backgrounds.
- **Deep Ink** (`#0f0a1e`): Primary text, headings.
- **Muted Lavender** (`#6b6478`): Secondary text, metadata.
- **Pale Lavender** (`#a89fb8`): Tertiary text, placeholders, disabled states.

### Semantic
- **Success** (`#10b981`): Confirmed states, paid badges.
- **Warning** (`#f59e0b`): Low stock, pending states.
- **Error** (`#ef4444`): Error states, cancellations.

### Dark Mode
All neutrals shift to a deep midnight base with inverted luminosity. Brand and accent become lighter (violet `#c084fc`, rose `#f472b6`) against dark surfaces for WCAG AA contrast. Shadows become black-based.

### Named Rules
**The One Voice Rule.** The violet primary leads every screen. The rose accent is used on ≤15% of elements — rarity is its power.

**The Warm Ground Rule.** Neutrals are never pure gray or pure white. Every neutral is tinted toward violet at chroma ≤0.02. `#fff` is only used for card surfaces on the off-white `#faf8fc` background.

## 3. Typography

**Display Font:** Calistoga (serif) with serif fallback
**Body Font:** Inter (sans-serif) with system-ui fallback

**Character:** Expressive serif display meets clean functional sans. Calistoga brings warmth and personality to hero headings and section titles; Inter handles everything else with Swiss precision. This pairing prevents the interface from feeling either too serious or too frivolous.

### Hierarchy
- **Display** (400, `clamp(2rem, 6vw, 4rem)`, 1.05): Hero headlines only. Never used in cards, buttons, or body text.
- **Headline** (700, `1.875rem` / `2.25rem` / `3rem`, 1.1): Section titles, category headers.
- **Title** (700, `1rem` / `1.25rem`, 1.2): Card titles, event names. Limited to 2 lines.
- **Body** (400, `1rem`, 1.6): Descriptive text, event metadata. 65-75ch max width on prose blocks.
- **Caption** (400, `0.875rem`, 1.4): Secondary metadata, dates, locations.
- **Label** (600, `0.75rem`, `0.15em` tracking, uppercase): Badge text, section markers, category labels.
- **Tiny** (600, `0.625rem`, `0.15em` tracking, uppercase): Overline badges, decorative markers.

### Named Rules
**The Contrast Rule.** Hierarchy is driven by scale and weight contrast, not color. Two adjacent type sizes must differ by at least 1.25× (body → title: 16px → 20px minimum).

**The No-Emoji Rule.** Never use emoji or decorative glyphs in body text. Icons are always inline SVGs from Lucide.

## 4. Elevation

The system uses a hybrid approach: flat at rest, elevated on interaction. Surfaces are distinguished by tonal layering (background is `--bg`, cards are `--surface`, raised modals are `--surface-raised`) rather than shadow at rest. Shadows appear only as a response to state.

### Shadow Vocabulary
- **Shadow Sm** (`0 1px 2px rgba(15,10,30,0.04), 0 1px 3px rgba(15,10,30,0.06)`): Subtle separation for smaller UI elements.
- **Shadow** (`0 1px 3px rgba(15,10,30,0.06), 0 4px 12px rgba(15,10,30,0.06)`): Default card separation from background.
- **Shadow Md** (`0 4px 6px rgba(15,10,30,0.07), 0 12px 24px rgba(15,10,30,0.08)`): Hover state on interactive cards.
- **Shadow Lg** (`0 10px 15px rgba(15,10,30,0.08), 0 24px 48px rgba(15,10,30,0.1)`): Modals, popovers, elevated panels.
- **Shadow Brand** (`0 4px 14px rgba(124,58,237,0.3)`): Primary buttons at rest.
- **Shadow Accent** (`0 4px 14px rgba(236,72,153,0.35)`): Accent buttons at rest.

### Named Rules
**The Flat-By-Default Rule.** Cards and surfaces are flat at rest. Shadows appear only as interactive feedback: hover, focus, elevation, or modal state.

## 5. Components

### Buttons
- **Shape:** Rounded with 12px radius. Full rounded (9999px) variant for hero CTAs.
- **Motion:** Spring-based hover scale (1.02) and tap scale (0.97), 150ms transition.
- **States:** default, hover (`bg-[var(--brand-hover)]` + elevated shadow), focus-visible (2px brand outline), active (scale 0.97), disabled (50% opacity, no pointer events), loading (spinner replaces icon).
- **Primary:** Violet background, white text, brand-purple shadow. Hover intensifies shadow.
- **Accent:** Rose background, white text, rose shadow. Used sparingly for promotional CTAs.
- **Gold (Rose):** Rose-family background (despite "gold" name), white text.
- **Outline:** Transparent background, ink text, lavender border. Hover fills with subtle violet.
- **Ghost:** Transparent, ink text. Hover adds subtle violet background.
- **Soft:** Subtle violet background, violet text. Used for secondary in-content CTAs.

### EventCard
- **Corner Style:** 16px radius (rounded-2xl), image bleeds to corners (no inner radius).
- **Background:** White surface, 1px lavender border.
- **Shadow Strategy:** Flat at rest (--) / Shadow Md on hover (card-hover utility).
- **Internal Padding:** 16px on content area.
- **Variants:** Standard (4:3 image ratio, content below), Featured (16:10 hero with gradient overlay, text on image), Compact (horizontal row, 80px thumbnail).
- **Interactive Elements:** Heart favorite button (top-right, glass circle), category chip (top-left), entire card is a link.
- **Motion:** Image scale 1.05 on hover, spring card lift (y: -3px).

### Chips / CategoryChip
- **Style:** Filled pill with variable background color (per-category), white text.
- **Size:** Small (4px 8px, 12px) and medium (12px 16px, 12px).
- **Icon:** Leading category icon (Lucide) in matching white.
- **Grid variant (CategoryGrid):** Filter toggle chips with selected/unselected states. Selected uses category color; unselected uses subtle violet background.

### Inputs / Search
- **Style:** Full rounded (24px outer bezel, inner inverse radius), lavender border.
- **Focus:** Border shifts to violet/40 opacity, shadow elevates.
- **Structure:** Double-bezel pattern (outer border-subtle container > inner surface container). City selector on left with MapPin icon.
- **States:** Enabled, focus-within (elevated), disabled (not applicable — search is always active).

### Navigation
- **Navbar (desktop/tablet):** Fixed top, transparent at scroll origin → glass (backdrop blur + border) on scroll. Logo left (UV mark + "Univibes"), nav links center, theme toggle + notifications + CTA right.
- **BottomNav (mobile only):** Fixed bottom, glass background, 5 tabs (Home, Explore, Tickets, Favorites, Profile). Active state: spring-scaled icon + brand color. Inactive: tertiary color at reduced opacity.
- **Motion:** Navbar transitions between transparent and glass states (300ms). BottomNav active tab uses spring animation (stiffness 400, damping 20).

### Skeleton / Loading
- **Style:** Shimmer animation (diagonal gradient sweep, 1.5s infinite).
- **Shape:** Rounded 8px, matches component proportions (card aspect ratio, text line widths).
- **ContentTransition:** AnimatePresence wrapper that fades skeleton out and content in (opacity + y-slide, 350ms, custom ease).

## 6. Do's and Don'ts

### Do:
- **Do** use violet as the dominant color. Rose is an accent, not a primary.
- **Do** use Calistoga for display headings only — never for body text, button labels, or data.
- **Do** keep card radii at 16px for consistency.
- **Do** use the double-bezel pattern for search and featured inputs (outer subtle border > inner surface).
- **Do** use spring animations for interactive feedback (buttons, favorites, tab switches).
- **Do** always provide skeleton loading states that match the component shape.
- **Do** use View Transitions for page navigation (fade + slide with shared element morph for event images).
- **Do** keep featured event cards in a horizontal scroll on mobile with snap points.
- **Do** tint neutral shadows toward violet (chroma ~0.01).
- **Do** respect the Flat-By-Default Rule: surfaces flat at rest, shadows on interaction.

### Don't:
- **Don't** use gradient text (`background-clip: text` with gradient) — decorative, never meaningful. Use solid brand color instead.
- **Don't** make cards identical in size and structure on the same page. Vary aspect ratios (featured 16:10, standard 4:3, compact row).
- **Don't** use a generic white hero with centered text. The hero must have depth (gradient backgrounds, blur orbs, search integration).
- **Don't** use glassmorphism on content cards. Reserve blur backdrops for transient UI (navbar, bottom nav, modals).
- **Don't** use em dashes in copy. Use commas, colons, or periods.
- **Don't** animate CSS layout properties (width, height, top, margin). Use transforms (scale, translate, opacity).
- **Don't** use side-stripe borders (colored `border-left` > 1px) on cards or list items.
- **Don't** try to make Eventbrite or Facebook Events. The interface must feel more premium, less dense.
- **Don't** add empty states with just "Aucun résultat" — always include a helpful illustration and action.
- **Don't** put text over event posters without a readable gradient overlay (`from-black/80 via-black/20 to-transparent` minimum).
- **Don't** use modal as the first solution for overlays. Exhaust inline and progressive disclosure alternatives first.
- **Don't** add decorative motion that doesn't convey state. Every animation must serve a purpose: feedback, orientation, or focus.
