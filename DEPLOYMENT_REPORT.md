# Rapport de Déploiement — UnivVibes

> Mis à jour le : 2026-06-26 (post-audit P0-P2)
> Statut : **API build OK + test OK ; déploiement Railway en cours de diagnostic**

---

## ✅ Ce qui est validé localement

| Étape | Statut | Preuve |
|---|---|---|
| `pnpm --filter api build` | ✅ | `nest build` sans erreur |
| `pnpm --filter api lint` | ✅ | 0 erreur (warnings `any` préexistants) |
| Tests unitaires API | ✅ | 14 suites / 93+ tests verts |
| Tests e2e | ✅ | 16 passed, 8 skipped, **0 failed** |
| `node dist/main.js` | ✅ | NestJS démarre, `/api/v1/health` → 200 |
| Build Docker | ✅ | 24/24 étapes OK, image buildée |
| Déploiement Web (Vercel) | ✅ | `univibes.vercel.app` en ligne |

## ❌ Bloquant restant : déploiement API Railway

Le build Docker réussit, mais le **runtime Railway** échoue (deploy "failure").
Le build échouait **déjà avant** cet audit (AUDIT P0-4 : API 404 en prod).

### Causes probables (par ordre de vraisemblance)

1. **Variables d'environnement manquantes sur Railway** — le `main.ts` fait
   désormais `process.exit(1)` si `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`
   / `DATABASE_URL` sont absents. Si Railway n'a pas ces vars, l'app crash au
   démarrage.
2. **`DATABASE_URL` non liée** au service Postgres Railway.
3. **Healthcheck** `/api/v1/health` qui échoue car DB/Redis non connectés.

### 🔧 Action requise (côté utilisateur — accès Railway)

Pour diagnostiquer, ouvrez le dashboard Railway et vérifiez :

```
https://railway.com/project/601574cd-effb-42c5-859d-84965e2e9681/service/82f07140-02c5-4584-9663-861fd2135dd2
```

1. **Onglet « Deployments » → Logs** : copier les logs d'erreur du dernier deploy.
2. **Onglet « Variables »** : vérifier que TOUTES les variables requises (liste
   ci-dessous) sont définies.

---

## Variables d'environnement requises sur Railway

| Variable | Obligatoire | Valeur / Source |
|---|---|---|
| `NODE_ENV` | ✅ | `production` |
| `PORT` | ✅ | (Railway fournit automatiquement — NE PAS définir) |
| `DATABASE_URL` | ✅ | Variable de référence au Postgres Railway : `${{Postgres.DATABASE_URL}}` |
| `REDIS_URL` | ⚠️ Optionnel | Variable de référence au Redis Railway (si ajouté) |
| `JWT_ACCESS_SECRET` | ✅ | 32+ caractères aléatoires (ou `Generate`) |
| `JWT_REFRESH_SECRET` | ✅ | 32+ caractères aléatoires (différent du access) |
| `QR_CODE_SECRET` | ✅ | 32+ caractères aléatoires |
| `JWT_ACCESS_EXPIRES_IN` | ✅ | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | ✅ | `30d` |
| `APP_URL` | ✅ | `https://univibes-api.up.railway.app` (URL Railway) |
| `FRONTEND_URL` | ✅ | `https://univibes.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | ✅ | (vos identifiants Cloudinary) |
| `CLOUDINARY_API_KEY` | ✅ | |
| `CLOUDINARY_API_SECRET` | ✅ | |
| `RESEND_API_KEY` | ✅ | (clé Resend) |
| `EMAIL_FROM` | ✅ | `noreply@univibes.com` |
| `EMAIL_FROM_NAME` | ✅ | `Univibes` |
| `FEDAPAY_API_KEY` | ✅ | (clé FedaPay sandbox) |
| `FEDAPAY_SECRET_KEY` | ✅ | (clé secrète FedaPay) |
| `FEDAPAY_WEBHOOK_SECRET` | ✅ | (secret webhook FedaPay) |
| `FEDAPAY_SANDBOX` | ✅ | `true` (sandbox) puis `false` en prod |
| `SENTRY_DSN` | ⚠️ Optionnel | (DSN Sentry) |
| `SENTRY_TRACES_SAMPLE_RATE` | ⚠️ Optionnel | `0.1` |

### Services Railway à provisionner

- **PostgreSQL 16** (Railway plugin) → fournit `DATABASE_URL`
- **Redis 7** (Railway plugin, optionnel mais recommandé pour le cache + WS)

---

## Corrections appliquées dans cet audit (commit `5bbecad`)

- ✅ P0-1 : `issueTickets()` câblé après webhook paiement + notifications
- ✅ P0-2 : Webhook sécurisé (signature HMAC FedaPay, fail-closed)
- ✅ P0-3 : `prisma migrate deploy` au runtime (plus de `db push --accept-data-loss`)
- ✅ P1-1 à P1-6 : secrets requis au bootstrap, typo corrigée, migration commitée, idempotence
- ✅ P2-2 : WebSocket notifications temps réel (Socket.io)
- ✅ E2E payment→ticket→checkin complet

---

## Checklist finale de mise en production

- [ ] **Railway : définir toutes les variables** (tableau ci-dessus)
- [ ] **Railway : lier `DATABASE_URL` au Postgres provisionné**
- [ ] Vérifier `/api/v1/health` → 200 sur l'URL Railway publique
- [ ] Mettre à jour `NEXT_PUBLIC_API_URL` côté Vercel vers l'URL Railway
- [ ] Activer webhook FedaPay production (`FEDAPAY_SANDBOX=false`) avec URL Railway
- [ ] (Ajouter le workflow CI `.github/workflows/ci.yml` via web UI GitHub)
