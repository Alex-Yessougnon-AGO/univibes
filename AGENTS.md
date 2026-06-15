# Univibes — Agent guide

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

- **API modules are all commented out** — only `PrismaModule` + `LoggerModule` + `AuditModule` + `HealthController` are wired in `app.module.ts`. Business modules (Auth, Events, Orders, etc.) need to be uncommented and built.
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
