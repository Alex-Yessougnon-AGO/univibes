# Monorepo Structure — Univibes

Gestionnaire : pnpm workspaces

---

# Structure Racine

```
univibes/
├── apps/
│   ├── web/          → Site principal (Next.js)
│   ├── api/          → Backend NestJS
│   └── mobile/       → App Flutter (Phase 5)
│
├── packages/
│   ├── ui/           → Composants partagés
│   ├── types/        → Types TypeScript partagés
│   ├── utils/        → Helpers partagés
│   └── config/       → Configs partagées (eslint, tsconfig)
│
├── prisma/           → Schéma + migrations Prisma
│   ├── schema.prisma
│   └── migrations/
│
├── docs/             → Documentation
├── .github/          → CI/CD GitHub Actions
├── docker-compose.yml
└── pnpm-workspace.yaml
```

---

# apps/web

Site principal étudiant (Next.js 14 App Router)

Pages :
- `/` → Homepage
- `/explore` → Catalogue événements
- `/event/[slug]` → Détails événement
- `/organizer/[slug]` → Profil organisateur
- `/favorites` → Mes favoris
- `/tickets` → Mes billets
- `/profile` → Mon profil
- `/login` → Connexion
- `/register` → Inscription
- `/forgot-password` → Mot de passe oublié

---

# apps/web — Interface d'administration

L'interface admin est intégrée à `apps/web` sous le préfixe `[locale]/admin/`.

Pages :
- `/admin` → Dashboard
- `/admin/events` → Gestion événements
- `/admin/users` → Gestion utilisateurs
- `/admin/payments` → Paiements
- `/admin/boosts` → Boosts
- `/admin/ads` → Publicités
- `/admin/organizers`, `/admin/categories`, `/admin/cities`, `/admin/universities`,
  `/admin/payouts`, `/admin/audit-logs`, `/admin/settings`

---

# apps/api

Backend NestJS

```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── organizers/
│   ├── events/
│   ├── categories/
│   ├── favorites/
│   ├── tickets/
│   ├── orders/
│   ├── payments/
│   ├── notifications/
│   ├── boosts/
│   ├── ads/
│   └── admin/
│
├── common/
│   ├── guards/       → JWT Guard, Roles Guard
│   ├── decorators/   → @CurrentUser, @Roles
│   ├── filters/      → Exception filters
│   ├── interceptors/ → Logging, Transform
│   ├── pipes/        → Validation pipe
│   └── dto/          → DTOs communs
│
├── config/           → Configuration modules
├── prisma/           → PrismaService
└── main.ts
```

---

# apps/mobile

Application Flutter (Phase 5)

```
lib/
├── features/
│   ├── auth/
│   ├── events/
│   ├── tickets/
│   └── profile/
├── core/
│   ├── api/
│   ├── storage/
│   └── router/
└── shared/
    ├── widgets/
    └── utils/
```

---

# packages/ui

Composants React partagés (Shadcn/UI base)

Composants :
- Button
- Card (EventCard, OrganizerCard, TicketCard)
- Input / Select / DatePicker
- Dialog / Drawer / Toast
- Badge / Avatar
- Table
- Chart
- Map
- QRCode
- Pagination
- Skeleton

---

# packages/types

Types TypeScript partagés entre web, admin et api

Types :
- User, Profile
- Organizer
- Event, EventCategory
- Ticket, IssuedTicket
- Order, Payment
- Notification
- Boost, Ad

---

# packages/utils

Utilitaires partagés

- Date formatters
- Currency formatters (FCFA)
- Slug generator
- QR Code generator
- Validators

---

# packages/config

Configurations partagées

- `eslint-config/`
- `tsconfig/`
- `tailwind-config/`

---

# prisma/

Schéma de base de données centralisé

```
prisma/
├── schema.prisma     → Modèles Prisma
└── migrations/       → Historique migrations
    ├── 20260601_init/
    └── ...
```

---

# Branches Git

```
main        → production stable
staging     → pré-production
develop     → développement actif
feature/*   → nouvelles fonctionnalités
hotfix/*    → corrections urgentes en production
```

---

# Scripts pnpm

```bash
pnpm dev          → Lance web + api en parallèle
pnpm build        → Build tous les packages
pnpm test         → Tous les tests
pnpm lint         → Lint global
pnpm db:migrate   → Prisma migrate dev
pnpm db:studio    → Prisma Studio
pnpm db:seed      → Seed base de données
```
