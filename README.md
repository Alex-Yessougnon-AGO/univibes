# Univibes

> The Hub of Student Life

Plateforme web de découverte, promotion et gestion des événements universitaires.

---

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 14 + TypeScript + TailwindCSS + Shadcn/UI |
| Backend | NestJS + Prisma + PostgreSQL + Redis |
| Stockage | Cloudinary |
| Email | Resend |
| Paiements | FedaPay / Kkiapay |
| Déploiement | Vercel (front) + Railway (back) |

---

## Structure

```
univibes/
├── apps/
│   ├── web/        → Site principal étudiant (Next.js)
│   ├── api/        → Backend REST (NestJS)
│   └── admin/      → Interface admin (Next.js)
├── packages/
│   ├── types/      → Types TypeScript partagés
│   ├── utils/      → Utilitaires partagés
│   ├── ui/         → Composants partagés
│   └── config/     → Configs partagées (tsconfig, eslint)
├── prisma/
│   └── schema.prisma
├── docs/           → Documentation complète
└── docker-compose.yml
```

---

## Démarrage rapide

### 1. Prérequis

- Node.js >= 20
- pnpm >= 9
- Docker + Docker Compose

### 2. Installation

```bash
pnpm install
```

### 3. Variables d'environnement

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# Renseigner les valeurs dans chaque .env
```

### 4. Services locaux

```bash
docker-compose up -d
```

### 5. Base de données

```bash
pnpm db:migrate
pnpm db:seed
```

### 6. Lancer le projet

```bash
# Backend (port 3001)
pnpm dev:api

# Frontend (port 3000)
pnpm dev:web
```

---

## Documentation

Tous les documents sont dans [`docs/`](./docs/).

| Document | Description |
|----------|-------------|
| [Architecture](docs/Architecture.md) | Stack technique et flux |
| [API Specification](docs/API-Specification.md) | Endpoints REST |
| [Database Schema](docs/Database-Schema.sql) | Schéma SQL |
| [Security](docs/Security.md) | Sécurité et auth |
| [Roadmap](docs/Roadmap.md) | Planning |
| [Backend Setup](docs/Backend-Setup.md) | Setup NestJS local |
| [Deployment Guide](docs/Deployment-Guide.md) | Guide de déploiement |

---

## Branches

```
main      → production
staging   → pré-production
develop   → développement actif
feature/* → nouvelles fonctionnalités
hotfix/*  → corrections urgentes
```
