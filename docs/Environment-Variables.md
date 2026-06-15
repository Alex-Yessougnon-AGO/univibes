# Environment Variables — Univibes

---

# apps/api — .env.example

```env
# =====================================================
# APPLICATION
# =====================================================
NODE_ENV=development
PORT=3001
APP_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# =====================================================
# DATABASE
# =====================================================
DATABASE_URL="postgresql://univibes:password@localhost:5432/univibes_dev"

# =====================================================
# REDIS
# =====================================================
REDIS_URL=redis://localhost:6379

# =====================================================
# JWT
# =====================================================
JWT_ACCESS_SECRET=change_this_to_a_very_long_random_secret_access
JWT_REFRESH_SECRET=change_this_to_a_very_long_random_secret_refresh
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# =====================================================
# CLOUDINARY (Stockage fichiers)
# =====================================================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# =====================================================
# RESEND (Emails)
# =====================================================
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@univibes.com
EMAIL_FROM_NAME=Univibes

# =====================================================
# PAIEMENTS
# =====================================================
FEDAPAY_API_KEY=your_fedapay_api_key
FEDAPAY_SECRET_KEY=your_fedapay_secret
FEDAPAY_WEBHOOK_SECRET=your_fedapay_webhook_secret
FEDAPAY_SANDBOX=true

KKIAPAY_PUBLIC_KEY=your_kkiapay_public_key
KKIAPAY_PRIVATE_KEY=your_kkiapay_private_key
KKIAPAY_SECRET=your_kkiapay_secret
KKIAPAY_SANDBOX=true

# =====================================================
# GOOGLE MAPS
# =====================================================
GOOGLE_MAPS_API_KEY=your_google_maps_key

# =====================================================
# SENTRY
# =====================================================
SENTRY_DSN=https://xxxx@sentry.io/xxxx

# =====================================================
# QR CODE
# =====================================================
QR_CODE_SECRET=change_this_to_sign_qr_codes
```

---

# apps/web — .env.example

```env
# =====================================================
# API
# =====================================================
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# =====================================================
# GOOGLE MAPS
# =====================================================
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key

# =====================================================
# SENTRY
# =====================================================
NEXT_PUBLIC_SENTRY_DSN=https://xxxx@sentry.io/xxxx

# =====================================================
# ANALYTICS (optionnel)
# =====================================================
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
```

---

# Environnement Production

Variables à définir dans Railway (backend) et Vercel (frontend) :

| Variable | Environnement | Sensible |
|----------|---------------|----------|
| DATABASE_URL | Production | ✅ Oui |
| REDIS_URL | Production | ✅ Oui |
| JWT_ACCESS_SECRET | Production | ✅ Oui |
| JWT_REFRESH_SECRET | Production | ✅ Oui |
| CLOUDINARY_API_SECRET | Production | ✅ Oui |
| RESEND_API_KEY | Production | ✅ Oui |
| FEDAPAY_SECRET_KEY | Production | ✅ Oui |
| FEDAPAY_WEBHOOK_SECRET | Production | ✅ Oui |
| KKIAPAY_PRIVATE_KEY | Production | ✅ Oui |
| SENTRY_DSN | Production | Non |

**Ne jamais committer de fichier `.env` avec de vraies valeurs.**

Ajouter `.env` et `.env.local` au `.gitignore`.

---

# Rotation des secrets

Recommandé tous les 90 jours :
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- QR_CODE_SECRET

Après chaque rotation : déconnecter tous les utilisateurs actifs.
