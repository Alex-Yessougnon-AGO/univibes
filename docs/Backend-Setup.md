# Backend Setup — Univibes

Framework : NestJS
ORM : Prisma
Base de données : PostgreSQL
Cache : Redis
Stockage : Cloudinary
Email : Resend

---

# Prérequis

- Node.js >= 20
- pnpm >= 9
- Docker + Docker Compose
- PostgreSQL 16
- Redis 7

---

# Installation Locale

## 1. Cloner le repo

```bash
git clone https://github.com/ton-org/univibes.git
cd univibes
pnpm install
```

---

## 2. Variables d'environnement

Copier le fichier d'exemple :

```bash
cp apps/api/.env.example apps/api/.env
```

Renseigner toutes les variables (voir `Environment-Variables.md`).

---

## 3. Lancer les services avec Docker

```bash
docker-compose up -d
```

Cela lance :
- PostgreSQL sur le port 5432
- Redis sur le port 6379

---

## 4. Migrations Prisma

```bash
pnpm db:migrate
```

---

## 5. Seed de la base de données

```bash
pnpm db:seed
```

Données insérées :
- Catégories d'événements (Concert, Gala, Conférence, Sport, etc.)
- Compte admin par défaut

---

## 6. Lancer le backend

```bash
cd apps/api
pnpm dev
```

API disponible sur : http://localhost:3001

Swagger UI : http://localhost:3001/api/docs

---

# Structure apps/api

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── refresh.strategy.ts
│   │   │   └── dto/
│   │   │       ├── register.dto.ts
│   │   │       └── login.dto.ts
│   │   ├── users/
│   │   ├── organizers/
│   │   ├── events/
│   │   ├── categories/
│   │   ├── favorites/
│   │   ├── tickets/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── notifications/
│   │   ├── boosts/
│   │   ├── ads/
│   │   └── admin/
│   │
│   ├── common/
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── jwt.config.ts
│   │   └── cloudinary.config.ts
│   │
│   ├── prisma/
│   │   └── prisma.service.ts
│   │
│   └── main.ts
│
├── .env.example
├── Dockerfile
└── nest-cli.json
```

---

# Packages NestJS utilisés

```json
{
  "@nestjs/core": "^10",
  "@nestjs/common": "^10",
  "@nestjs/platform-express": "^10",
  "@nestjs/jwt": "^10",
  "@nestjs/passport": "^10",
  "@nestjs/throttler": "^5",
  "@nestjs/swagger": "^7",
  "@nestjs/config": "^3",
  "passport": "^0.7",
  "passport-jwt": "^4",
  "bcrypt": "^5",
  "@prisma/client": "^5",
  "class-validator": "^0.14",
  "class-transformer": "^0.5",
  "ioredis": "^5",
  "cloudinary": "^2",
  "resend": "^3",
  "qrcode": "^1",
  "slugify": "^1",
  "winston": "^3"
}
```

---

# Docker Compose (dev)

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: univibes_dev
      POSTGRES_USER: univibes
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

# Swagger UI

Accès en développement : http://localhost:3001/api/docs

La documentation est générée automatiquement depuis les décorateurs NestJS :

```typescript
@ApiTags('events')
@ApiOperation({ summary: 'Liste des événements' })
@ApiResponse({ status: 200, type: EventListResponseDto })
```

---

# Prisma Studio

Visualiser et modifier les données en développement :

```bash
pnpm db:studio
```

Disponible sur : http://localhost:5555
