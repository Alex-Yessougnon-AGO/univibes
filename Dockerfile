# =========================================
# Univibes API — Dockerfile multi-stage
# Build: pnpm monorepo → NestJS → production
# =========================================

# =========================================
# STAGE 1 : Installation + Build
# =========================================
FROM node:22-slim AS builder

RUN apt-get update -qq && apt-get install -y -qq openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11 --activate

ENV CI=true
WORKDIR /app

# --- Couche 1 : Manifests (cache Docker) ---
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json pnpm.yaml .pnpmfile.cjs tsconfig.json ./
COPY .npmrc ./
COPY packages/ ./packages/
COPY prisma/ ./prisma/

RUN pnpm install --frozen-lockfile --shamefully-hoist

# --- Couche 2 : Source + Build ---
COPY apps/api/ ./apps/api/
RUN pnpm db:generate
RUN pnpm --filter api build

# =========================================
# STAGE 2 : Exécution
# =========================================
FROM node:22-slim

RUN apt-get update -qq && apt-get install -y -qq openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production

# Copier node_modules (symlinks relatifs pnpm préservés par Docker COPY)
COPY --from=builder /app/node_modules ./node_modules

# Copier le build NestJS
COPY --from=builder /app/apps/api/dist ./dist

# Copier Prisma (schema + migrations)
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]
