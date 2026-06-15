# Deployment Guide — Univibes

---

# Stack de déploiement

| Service | Hébergement |
|---------|-------------|
| Frontend Next.js | Vercel |
| Backend NestJS | Railway |
| PostgreSQL | Railway (managed) |
| Redis | Upstash |
| Fichiers/Images | Cloudinary |
| Emails | Resend |
| Monitoring | Sentry + Uptime Robot |

---

# Frontend — Vercel

## Déploiement

1. Connecter le repo GitHub à Vercel
2. Sélectionner `apps/web` comme Root Directory
3. Framework : Next.js (auto-détecté)
4. Ajouter les variables d'environnement

## Configuration

```
Root Directory: apps/web
Build Command: pnpm build
Output Directory: .next
Install Command: pnpm install
```

## Domaines

Production : `univibes.com`
Staging : `staging.univibes.com`

---

# Backend — Railway

## Déploiement

1. Créer un nouveau projet Railway
2. Connecter le repo GitHub
3. Sélectionner `apps/api` comme source
4. Ajouter le service PostgreSQL
5. Ajouter les variables d'environnement
6. Configurer les commandes de build

## Configuration Railway

```
Root Directory: apps/api
Build Command: pnpm build
Start Command: node dist/main.js
```

## Variables d'environnement Railway

Copier depuis `Environment-Variables.md` et renseigner les valeurs réelles.

`DATABASE_URL` est fournie automatiquement par Railway si PostgreSQL est ajouté dans le même projet.

---

# Base de données — Railway PostgreSQL

Railway fournit automatiquement une base PostgreSQL avec :
- Backups quotidiens
- SSL activé
- Monitoring intégré

## Migrations en production

```bash
npx prisma migrate deploy
```

Cette commande est à exécuter lors de chaque déploiement.

---

# Redis — Upstash

1. Créer un compte sur upstash.com
2. Créer une base Redis
3. Copier l'URL de connexion
4. Renseigner `REDIS_URL` dans Railway

Upstash est serverless : facturation à la requête, pas de serveur idle.

---

# CI/CD — GitHub Actions

## Workflow principal

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches:
      - main
      - staging

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - name: Install dependencies
        run: pnpm install
      - name: Run tests
        run: pnpm test
      - name: Build API
        run: pnpm --filter api build
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

# Checklist de déploiement

## Avant chaque mise en production

- [ ] Tests passent (`pnpm test`)
- [ ] Build réussi (`pnpm build`)
- [ ] Variables d'environnement à jour
- [ ] Migrations Prisma appliquées
- [ ] Swagger UI vérifié
- [ ] Health check `/api/v1/health` répond
- [ ] Sentry configuré
- [ ] CORS configuré pour les bons domaines

## Après déploiement

- [ ] Tester l'inscription / connexion
- [ ] Tester la création d'un événement
- [ ] Tester le webhook paiement (sandbox)
- [ ] Vérifier les logs Sentry
- [ ] Vérifier Uptime Robot

---

# Rollback

En cas de problème critique :

1. Sur Railway : Deploy → Previous deployment → Redeploy
2. Sur Vercel : Deployments → Previous → Promote to Production
3. Migrations : `npx prisma migrate resolve --rolled-back <migration_name>`
