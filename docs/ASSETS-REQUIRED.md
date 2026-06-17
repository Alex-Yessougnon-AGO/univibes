# UnivVibes — Assets graphiques requis

> Document généré le 17 Juin 2026

---

## 1. Logo / Marque

| Asset | Format | Taille | Usage |
|-------|--------|--------|-------|
| **Favicon** | `.ico` / `.png` | 32×32 / 16×16 | Onglet navigateur |
| **Logo complet** | `.svg` (recommandé) ou `.png` | — | Navbar desktop, footer |
| **Logo mark seul** | `.svg` | 32×32 | Version icône uniquement |
| **Logo dark mode** | `.svg` | — | Version inversée pour fonds sombres |
| **Apple Touch Icon** | `.png` | 180×180 | iOS / Safari |
| **OG Image** | `.png` / `.jpg` | 1200×630 | Partage réseaux sociaux (Facebook, Twitter, WhatsApp) |

**Actuellement :** Le logo est rendu en CSS pur (lettres `UV` dans un carré violet dégradé). Pour un rendu professionnel, un vrai SVG est recommandé.

---

## 2. QR Code / Check-in

| Asset | Description | Priorité |
|-------|-------------|----------|
| **Module QR** | Package npm pour génération de QR codes (ex: `qrcode`) | Haute |
| **Scanner caméra** | Package npm pour lecture de QR codes (ex: `html5-qrcode` ou `@yudiel/react-qr-scanner`) | Haute |

**Actuellement :** Les QR codes sont simulés avec des codes textuels (`UNV-ABC123`). La page `/dashboard/events/[id]/checkin` a une UI de scan prête mais utilise une simulation.

---

## 3. Illustrations

| Asset | Format | Usage |
|-------|--------|-------|
| **Empty state — Favoris** | `.svg` | Aucun favori enregistré |
| **Empty state — Billets** | `.svg` | Aucun billet acheté |
| **Empty state — Recherche** | `.svg` | Aucun résultat de recherche |
| **Empty state — Notifications** | `.svg` | Aucune notification |
| **Empty state — Événements** | `.svg` | Aucun événement (dashboard) |
| **404 illustration** | `.svg` | Page non trouvée |
| **Error illustration** | `.svg` | Erreur générique |
| **Maintenance illustration** | `.svg` | Page de maintenance |
| **Hero illustration** | `.webp` / `.svg` | Section hero de la landing page (optionnel) |

---

## 4. Images d'événements

| Asset | Format | Usage |
|-------|--------|-------|
| **Images de couverture** | `.webp` (recommandé) ou `.jpg` | Chaque événement a besoin d'une cover (ratio 4:3) |
| **Logos organisateurs** | `.webp` ou `.png` | Photo de profil des organisateurs |
| **Avatars utilisateurs** | `.webp` ou `.png` | Photos de profil (carrées) |
| **Bannières publicitaires** | `.webp` ou `.png` | Campagnes publicitaires dans `/admin/ads` |

**Actuellement :** Toutes les images sont servies via `https://picsum.photos` (placeholder). Les domaines sont déjà whitelistés dans `next.config.ts`.

---

## 5. Configuration technique

```ts
// next.config.ts — Domaines d'images autorisés
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "picsum.photos",     // Placeholder actuel
    },
    // Ajouter ici les vrais domaines d'hébergement d'images
    // {
    //   protocol: "https",
    //   hostname: "res.cloudinary.com",  // Si utilisation Cloudinary
    // },
  ],
},
```

---

## Notes d'intégration

- **Format recommandé :** `.webp` pour les photos, `.svg` pour les icônes/illustrations
- **Compression :** Optimiser les images pour le web (ex: Squoosh, ImageOptim)
- **Responsive :** Prévoir des variantes pour mobile (640px) et desktop (1200px+)
- **Alt texts :** Chaque image doit avoir un texte alternatif pour l'accessibilité
