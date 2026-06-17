# UnivVibes — Agent guide

pnpm workspace monorepo (3 apps, 4 packages). Student event platform (Next.js 16 + NestJS 10 + Prisma + PostgreSQL + Redis).

## Quick start

```bash
pnpm install                     # shamefully-hoist=true (Prisma needs flat node_modules)
pnpm db:generate                 # Prisma client after install (postinstall auto-gen is disabled)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local   # (if it exists)
docker compose up -d             # postgres:16 + redis:7
pnpm db:migrate && pnpm db:seed
pnpm dev:api                     # NestJS on :3001
pnpm dev:web                     # Next.js on :3000
pnpm dev:admin                   # Next.js on :3002
```

## Monorepo structure

| Path | Role |
|---|---|
| `apps/web/` | Student-facing Next.js 16 (App Router, Tailwind v4) |
| `apps/api/` | NestJS 10 REST API (`api/v1` prefix, Swagger at `/api/docs`) |
| `apps/admin/` | Admin Next.js (mostly scaffolded — no `src/` yet) |
| `packages/types/` | Shared TS types (`@univibes/types`) |
| `packages/utils/` | Shared utilities (`@univibes/utils`) |
| `packages/ui/` | Shared React components (`@univibes/ui`) |
| `packages/config/` | Shared tsconfig presets |
| `prisma/schema.prisma` | **Root** schema — generates to `apps/api/src/generated/prisma` |

## Key commands (run from root)

| Command | What |
|---|---|
| `pnpm dev:web / dev:api / dev:admin` | Per-app dev servers |
| `pnpm -r build` | Build all |
| `pnpm -r test` | Run all tests (only `api` has Jest config) |
| `pnpm -r lint` | Lint all (only `api` has ESLint) |
| `pnpm db:generate` | `prisma generate --schema=prisma/schema.prisma` |
| `pnpm db:migrate` | `prisma migrate dev` |
| `pnpm db:migrate:deploy` | `prisma migrate deploy` (prod) |
| `pnpm db:seed` | `pnpm --filter api db:seed` |
| `pnpm db:studio` | Prisma Studio |
| `pnpm db:reset` | `prisma migrate reset` |

## Architecture notes

- **API modules are all wired in `app.module.ts`** — Auth, Users, Events, Orders, Payments, Notifications, etc. are all imported.
- **i18n** — Web app uses `next-intl` v4 with `fr`/`en` locales. All routes require `[locale]` prefix. Message files exist but `useTranslations` is wired in critical pages (navbar, bottom-nav, landing, login, explore, event-card). New pages created with full i18n support.
- **API uses global pipes** — `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.
- **API uses global interceptors** — `TransformInterceptor` wraps responses.
- **API uses global exception filters** — `SentryFilter` (all unhandled → Sentry) then `HttpExceptionFilter` (structured JSON).
- **PrismaService** is a `@Global()` module — available everywhere without imports.
- **AuditService** is a `@Global()` module — inject into any service for action tracing.
- **Web** uses `@/` path alias → `apps/web/src/`.
- **No ESLint/Prettier configs** at root level — only per-app. `web` uses `next lint`, `api` uses explicit ESLint.
- **No CI workflows** yet (`.github/workflows/` is empty).

## Observability

| Couche | Outil | Fichiers clés |
|--------|-------|---------------|
| Logs structurés | Winston (console + fichiers rotatifs) | `apps/api/src/common/logger/` |
| Error tracking | Sentry (API + Web) | `main.ts`, `sentry.*.config.ts`, `global-error.tsx` |
| Audit trail | AuditService → DB | `apps/api/src/common/audit/` |
| Health | `GET /api/v1/health` (DB + Redis) | `apps/api/src/health/health.controller.ts` |

**Sentry vars in `.env`**: `SENTRY_DSN`, `SENTRY_TRACES_SAMPLE_RATE` (API), `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` (Web).

## Prisma gotchas

- `@prisma/client` postinstall is **stripped by `.pnpmfile.cjs`** to prevent recursive `prisma generate` loops. Always run `pnpm db:generate` manually after `pnpm install` or schema changes.
- Schema lives at root `prisma/schema.prisma`; client outputs to `apps/api/src/generated/prisma`.
- Migration SQL is gitignored (`prisma/migrations/*/migration.sql`).

## Testing

- Only `apps/api` has test infrastructure (Jest + ts-jest). No test files exist yet.
- `pnpm -r test` runs all workspaces; `api` has `test`, `test:watch`, `test:coverage`, `test:e2e` scripts.
- `web` and `admin` have no test config.

## Deploy

- Frontend (web + admin) → Vercel
- Backend (api) → Railway
- Storage → Cloudinary
- Email → Resend
- Payments → FedaPay / Kkiapay

## Branch convention

```
main → production
staging → pre-prod
develop → active dev
feature/*, hotfix/*
```

## Learnings & Pitfalls (pour les agents IA)

Consulter `.claude/learnings.md` pour le détail complet. Règles essentielles :

### 1. Conflit de nom `t`
**Ne JAMAIS utiliser `t` comme variable locale** dans `.map()`, `.find()`,
`.reduce()`, `.filter()`. `t` est réservé à `useTranslations()`.
→ Utiliser `ticket`/`tk`/`ti` pour les tickets, `e`/`event` pour les events.

### 2. Pathname locale-aware
- Navigation locale : importer `usePathname`/`useRouter` depuis **`@/i18n/routing`**
  (retourne le chemin SANS préfixe locale)
- Vérification de route active : utiliser **`next/navigation`**
  (retourne le chemin AVEC préfixe locale)

### 3. Clés de traduction
Toujours ajouter les clés dans **les deux fichiers** :
`apps/web/messages/en.json` + `apps/web/messages/fr.json`

### 4. JSX expressions
Toujours fermer `{condition && (...)}` par `)}` (pas seulement `)`).

### 5. Playwright + middleware
```ts
await page.goto("/fr", { waitUntil: "domcontentloaded" });
await page.waitForLoadState("networkidle");
await page.waitForURL(/\/en/, { timeout: 10000 });
```

### 6. Tests Playwright sur cette machine
```bash
PLAYWRIGHT_BROWSERS_PATH=/home/alex/.cache/ms-playwright npx playwright test
```

### 7. Prisma + pnpm
Toujours lancer `pnpm db:generate` manuellement après `pnpm install` ou
changement de schéma (`.pnpmfile.cjs` désactive le postinstall).
