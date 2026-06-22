# =========================================
# Univibes API — Dockerfile multi-stage
# Build: pnpm monorepo → NestJS → production
# =========================================

# =========================================
# STAGE 1 : Installation + Build + Deploy
# =========================================
FROM node:22-slim AS builder

RUN apt-get update -qq && apt-get install -y -qq openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11 --activate

ENV CI=true
WORKDIR /app

# --- Couche 1 : Dépendances (cache Docker) ---
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json pnpm.yaml .pnpmfile.cjs tsconfig.json ./
COPY .npmrc ./
COPY packages/ ./packages/
COPY prisma/ ./prisma/
COPY apps/api/package.json ./apps/api/package.json

RUN pnpm install --frozen-lockfile --shamefully-hoist

# --- Couche 2 : Source + Build ---
COPY apps/api/ ./apps/api/
RUN pnpm db:generate
RUN pnpm --filter api build

# --- Couche 3 : Copie propre (sans symlinks pnpm) ---
# cp -rL déréférence tous les symlinks → node_modules plat, compatible Docker COPY
RUN mkdir -p /app/dist /app/prisma-copy && \
    cp -rL /app/node_modules /app/node_modules_flat && \
    rm -rf /app/node_modules_flat/.pnpm && \
    cp -r /app/apps/api/dist /app/dist && \
    cp -r /app/prisma /app/prisma-copy

# =========================================
# STAGE 2 : Exécution
# =========================================
FROM node:22-slim

RUN apt-get update -qq && apt-get install -y -qq openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules_flat ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma-copy ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]
