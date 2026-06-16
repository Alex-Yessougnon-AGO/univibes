# Architecture Technique — Univibes

Version : 2.0
Date : Juin 2026

---

# Stack Technique

## Frontend

| Technologie | Rôle |
|-------------|------|
| Next.js 14 (App Router) | Framework React SSR/SSG |
| TypeScript | Typage statique |
| TailwindCSS | Styling utilitaire |
| Shadcn/UI | Composants UI |
| Framer Motion | Animations |
| Zod | Validation schémas côté client |

---

## Backend

| Technologie | Rôle |
|-------------|------|
| NestJS | Framework API TypeScript |
| Prisma | ORM + Migrations |
| PostgreSQL | Base de données relationnelle |
| Redis | Cache, sessions, rate-limiting, jobs |
| JWT | Authentification (access + refresh tokens) |
| class-validator | Validation des DTOs |
| Swagger/OpenAPI | Documentation API auto-générée |
| Resend | Emails transactionnels |
| Cloudinary | Stockage et CDN fichiers/images |

---

## Mobile (Phase 5)

Flutter

---

## Paiements

| Provider | Région |
|----------|--------|
| FedaPay | Bénin |
| Kkiapay | Bénin |

---

# Architecture Générale

```
┌─────────────────────────────────────┐
│           CLIENT (Browser)          │
│         Next.js App Router          │
└──────────────┬──────────────────────┘
               │ HTTPS / REST
               ▼
┌─────────────────────────────────────┐
│         NestJS API (apps/api)       │
│                                     │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  Guards  │  │  Interceptors    │ │
│  │  (JWT)   │  │  (Logging/Trans) │ │
│  └──────────┘  └──────────────────┘ │
│                                     │
│  ┌──────────────────────────────┐   │
│  │           Modules            │   │
│  │  Auth | Events | Tickets     │   │
│  │  Orders | Payments | Users   │   │
│  │  Notifications | Boosts      │   │
│  └──────────────────────────────┘   │
└─────┬──────────────┬────────────────┘
      │              │
      ▼              ▼
┌──────────┐  ┌────────────┐
│PostgreSQL│  │   Redis    │
│ (Prisma) │  │(Cache/Jobs)│
└──────────┘  └────────────┘
```

---

# Modules NestJS

## AuthModule
- Inscription / Connexion
- Vérification email
- Réinitialisation mot de passe
- Refresh tokens
- Guards JWT

## UsersModule
- Profils étudiants
- Gestion avatar (Cloudinary)

## OrganizersModule
- Profils organisateurs
- Vérification organisateur

## EventsModule
- CRUD événements
- Slug auto-généré
- Upload affiche (Cloudinary)
- Recherche + Filtres

## CategoriesModule
- Gestion catégories événements

## FavoritesModule
- Favoris utilisateur

## TicketsModule
- Création tickets
- Gestion stock

## OrdersModule
- Création commandes
- Historique achats

## PaymentsModule
- Initiation paiement (FedaPay / Kkiapay)
- Webhook handler
- Génération QR Code

## NotificationsModule
- Notifications in-app
- Emails (Resend)

## BoostsModule
- Boost événements
- Expiration automatique (Redis)

## AdsModule
- Gestion publicités

## AdminModule
- Validation événements
- Gestion utilisateurs
- Supervision paiements

---

# Flux de Paiement

```
Utilisateur → POST /orders → Créer commande (pending)
    → POST /payments/initiate → Appel FedaPay/Kkiapay
    → Redirection page paiement
    → Webhook → POST /payments/webhook
    → Vérification signature
    → Mise à jour commande (paid)
    → Génération QR Code
    → Email confirmation
    → Notification in-app
```

---

# Flux d'Authentification

```
Inscription → POST /auth/register
    → Hashage password (bcrypt)
    → Création user en base
    → Envoi email vérification
    → Token de vérification (Redis, 24h)

Connexion → POST /auth/login
    → Vérification password
    → Génération access token (JWT, 15min)
    → Génération refresh token (UUID, 30j, stocké en base)
    → Retour { accessToken, refreshToken }

Refresh → POST /auth/refresh
    → Vérification refresh token en base
    → Rotation refresh token
    → Nouveau access token
```

---

# Stockage Fichiers (Cloudinary)

| Dossier | Contenu |
|---------|---------|
| univibes/events | Affiches événements |
| univibes/avatars | Photos de profil |
| univibes/organizers | Logos organisateurs |
| univibes/ads | Bannières publicitaires |

---

# Monitoring

| Outil | Usage |
|-------|-------|
| Sentry | Erreurs frontend + backend |
| Uptime Robot | Monitoring disponibilité |
| Swagger UI | Documentation API (/api/docs) |
| Prisma Studio | Inspection base de données (dev) |

---

# Environnements

| Env | Description |
|-----|-------------|
| local | Développement, Docker Compose |
| staging | Tests, données fictives |
| production | Utilisateurs réels |

---

# Git Flow

```
main          → production
staging       → tests
develop       → développement actif
feature/*     → nouvelles fonctionnalités
hotfix/*      → corrections urgentes
```

---

# Déploiement

| Service | Hébergement |
|---------|-------------|
| Frontend (Next.js) | Vercel |
| Backend (NestJS) | Railway ou Render |
| PostgreSQL | Railway (managed) |
| Redis | Upstash (serverless Redis) |
| Fichiers | Cloudinary CDN |

---

# Scalabilité Future (Phase 5+)

Microservices :
- Event Service
- Payment Service
- Notification Service
- Analytics Service

Message Queue : BullMQ (Redis-based)

API Gateway : Kong ou custom NestJS proxy
