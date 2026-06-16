# Storage Strategy — Univibes

Provider : Cloudinary

---

# Pourquoi Cloudinary

| Avantage | Détail |
|----------|--------|
| CDN mondial | Livraison rapide au Bénin |
| Transformations auto | Redimensionnement, compression, WebP |
| Plan gratuit | 25 GB stockage, 25 GB bande passante/mois |
| Sécurisé | Upload signé, accès contrôlé |
| SDK Node.js | Intégration NestJS simple |

---

# Dossiers (Cloudinary)

| Dossier | Contenu | Accès |
|---------|---------|-------|
| `univibes/events` | Affiches événements | Public |
| `univibes/avatars` | Photos de profil | Public |
| `univibes/organizers` | Logos organisateurs | Public |
| `univibes/ads` | Bannières publicitaires | Public |

---

# Contraintes d'upload

| Type | Formats | Taille max |
|------|---------|------------|
| Affiche événement | JPG, PNG, WEBP | 5 MB |
| Avatar | JPG, PNG, WEBP | 2 MB |
| Logo organisateur | JPG, PNG, WEBP, SVG | 2 MB |
| Bannière pub | JPG, PNG, WEBP | 3 MB |

---

# Transformations automatiques

## Affiche événement

Lors de l'upload → Générer automatiquement :

| Usage | Dimensions | Format |
|-------|-----------|--------|
| Original | Max 1200px | WebP |
| Card | 400×300 | WebP |
| Thumbnail | 150×150 | WebP |

## Avatar

| Usage | Dimensions | Format |
|-------|-----------|--------|
| Original | 400×400 (crop: fill) | WebP |
| Small | 80×80 | WebP |

---

# Implémentation NestJS

## Configuration

```typescript
// cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  },
};
```

## Upload service

```typescript
// upload.service.ts
async uploadEventCover(file: Express.Multer.File, eventId: string) {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'univibes/events',
    public_id: `event_${eventId}`,
    overwrite: true,
    transformation: [
      { width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'webp' }
    ],
  });
  
  return result.secure_url;
}

async deleteFile(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}
```

---

# Upload Flow

```
Client → multipart/form-data → NestJS API
    → Valider MIME type + taille
    → Upload vers Cloudinary
    → Recevoir secure_url
    → Sauvegarder URL en base (Prisma)
    → Retourner URL au client
```

Ne jamais stocker les fichiers sur le serveur NestJS.
Utiliser `multer` en mémoire (`memoryStorage`) ou `diskStorage` temporaire.

---

# Sécurité

- Upload uniquement depuis le backend (jamais depuis le frontend directement)
- Vérification MIME type côté serveur avant l'upload
- Suppression de l'ancien fichier lors du remplacement (éviter les orphelins)
- Cloudinary signed uploads pour les cas sensibles

---

# Limites plan gratuit Cloudinary

- 25 GB stockage
- 25 GB bande passante / mois
- Suffisant pour le lancement

Upgrade vers plan payant si dépassement.
