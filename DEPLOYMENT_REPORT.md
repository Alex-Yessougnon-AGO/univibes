# Rapport de Déploiement — UnivVibes

> Généré le : 2026-06-24
> Statut actuel : **PHASE 1 — AUDIT EN COURS**

---

## PHASE 1 : Audit complet du projet ✅

### Stack détectée

| Composant | Technologie | Version |
|---|---|---|
| Backend Framework | NestJS | 11.0.0 |
| Frontend | Next.js (App Router) | 16.2.9 |
| Admin | Next.js | — |
| Langage | TypeScript | 5.9.3 |
| Runtime Node.js | Node (via Docker) | 22-slim / >=20 |
| Package Manager | pnpm (monorepo) | 11.6.0 |
| Base de données | PostgreSQL | 16 |
| Cache | Redis | 7 |
| ORM | Prisma | 5.22.0 |
| Auth | JWT (Passport) | — |
| Upload fichiers | Cloudinary | — |
| Emails | Resend | — |
| Paiements | FedaPay + Kkiapay | — |
| Monitoring | Sentry + Winston | — |
| Sécurité | Helmet + ValidationPipe | — |
| Documentation API | Swagger (dev only) | — |

### Architecture monorepo

```
univibes/
├── apps/
│   ├── api/          → NestJS 11 (backend)
│   ├── web/          → Next.js 16 (frontend étudiant)
│   └── admin/        → Next.js (admin)
├── packages/
│   ├── types/        → @univibes/types
│   ├── utils/        → @univibes/utils
│   ├── ui/           → @univibes/ui
│   └── config/       → tsconfig presets
├── prisma/           → Schema racine + migrations
└── Dockerfile        → Multi-stage pour Render
```

### Variables d'environnement requises

| Variable | Dans .env | Dans render.yaml | Obligatoire |
|---|---|---|---|
| `NODE_ENV` | ✅ | ✅ production | ✅ |
| `PORT` | ✅ 3001 | ✅ 3001 | ✅ |
| `APP_URL` | ✅ | ✅ | ✅ |
| `FRONTEND_URL` | ✅ | ✅ | ✅ |
| `DATABASE_URL` | ✅ | ✅ (fromDatabase) | ✅ |
| `REDIS_URL` | ✅ | ⚠️ sync: false | Optionnel |
| `JWT_ACCESS_SECRET` | ✅ | ✅ auto-generate | ✅ |
| `JWT_REFRESH_SECRET` | ✅ | ✅ auto-generate | ✅ |
| `JWT_ACCESS_EXPIRES_IN` | ✅ | ✅ 15m | ✅ |
| `JWT_REFRESH_EXPIRES_IN` | ✅ | ✅ 30d | ✅ |
| `CLOUDINARY_CLOUD_NAME` | ✅ | ⚠️ sync: false | ✅ |
| `CLOUDINARY_API_KEY` | ✅ | ⚠️ sync: false | ✅ |
| `CLOUDINARY_API_SECRET` | ✅ | ⚠️ sync: false | ✅ |
| `RESEND_API_KEY` | ✅ | ⚠️ sync: false | ✅ |
| `EMAIL_FROM` | ✅ | ✅ | ✅ |
| `EMAIL_FROM_NAME` | ✅ | ✅ | ✅ |
| `FEDAPAY_API_KEY` | ✅ | ⚠️ sync: false | ✅ |
| `FEDAPAY_SECRET_KEY` | ✅ | ⚠️ sync: false | ✅ |
| `FEDAPAY_SANDBOX` | ✅ | ✅ true | ✅ |
| `QR_CODE_SECRET` | ✅ | ✅ auto-generate | ✅ |
| `SENTRY_DSN` | ✅ | ⚠️ sync: false | Optionnel |
| `KKIAPAY_*` | ✅ | ❌ Manquant | Optionnel |

### Risques détectés

1. **FRONTEND_URL dans render.yaml** → `https://univvibes.vercel.app` — À VÉRIFIER
2. **FEDAPAY_WEBHOOK_SECRET** présent dans .env mais PAS dans render.yaml
3. **KKIAPAY_* variables** pas dans render.yaml (optionnel mais à noter)
4. **Redis sync: false** — devra être configuré manuellement ou laissé disabled
5. **Pas de DATABASE_URL** dans .env du web (normal, c'est backend-only)
6. **Le build local doit être testé** avant déploiement
7. **render.yaml** branche = main — vérifier que c'est la bonne branche

### Corrections recommandées (pré-déploiement)

- [x] Audit de la stack complété
- [ ] Tester le build local de l'API
- [ ] Vérifier FRONTEND_URL sur Vercel
- [ ] Ajouter FEDAPAY_WEBHOOK_SECRET dans render.yaml
- [ ] Vérifier que render.yaml est sur la bonne branche

---

## PHASE 2 : Validation locale ✅

| Étape | Statut | Détails |
|---|---|---|
| `pnpm --filter api build` | ✅ OK | `nest build` terminé sans erreur |
| `node dist/main.js` | ✅ OK | NestJS 11 démarre en 2.3s |
| Health endpoint `GET /api/v1/health` | ✅ OK | `{"status":"ok","database":"ok","redis":"ok"}` |
| Routes API (tous les modules) | ✅ OK | 60+ routes mappées |
| Connexion PostgreSQL | ✅ OK | Pool 5 connections OK |
| Connexion Redis | ✅ OK | PING OK |

**Conclusion :** L'API est entièrement fonctionnelle localement. Aucun bug bloquant.

---

## PHASE 3 : Stratégie Render**

### Analyse des options

| Option | Avantages | Inconvénients |
|---|---|---|
| **Docker** (actuel) | Reproduit exactement l'env local ; maîtrise totale du build ; multi-stage optimisé | Build plus lent ; image ~200MB |
| **Native Node** | Déploiement rapide (git push) | Ne supporte pas monorepo pnpm complexe sans config supplémentaire |

### Recommandation

✅ **Garder Docker** :
- Le Dockerfile multi-stage est déjà optimisé
- render.yaml est déjà configuré pour Docker
- Gère proprement le monorepo pnpm + workspace packages
- La stratégie `pnpm deploy --legacy` + copie du dist est validée

### Modifications nécessaires avant déploiement

1. Dans `render.yaml` : ✅ PRÊT — Docker + PostgreSQL 16 + healthcheck
2. Dans `Dockerfile` : ✅ DÉJÀ VALIDÉ localement
3. Variables manquantes à ajouter : `FEDAPAY_WEBHOOK_SECRET` dans render.yaml

---

## PHASE 4 : Variables d'environnement

*À venir...*

---

## PHASE 5 : Déploiement Render

*À venir...*

---

## PHASE 6 : Connexion Vercel

*À venir...*

---

## PHASE 7 : Debug

*À venir...*

---

## PHASE 8 : Checklist production

*À venir...*

---

## PHASE 9 : Tests

*À venir...*

---

## PHASE 10 : Rapport final

*À venir...*
