# =========================================
# Univibes API — Dockerfile multi-stage
# pnpm monorepo → NestJS → production
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
# inject-workspace-packages permet à pnpm deploy de créer un node_modules
# autonome avec les packages workspace (types, utils) en vrais fichiers
COPY .npmrc ./
RUN echo "inject-workspace-packages=true" >> .npmrc

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json pnpm.yaml .pnpmfile.cjs tsconfig.json ./
COPY packages/ ./packages/
COPY prisma/ ./prisma/
COPY apps/api/package.json ./apps/api/package.json

RUN pnpm install --frozen-lockfile --shamefully-hoist

# --- Couche 2 : Source + Build ---
COPY apps/api/ ./apps/api/
RUN pnpm db:generate
RUN pnpm --filter api build

# --- Couche 3 : pnpm deploy → node_modules autonome (sans symlinks) ---
# Crée /app/deployed avec node_modules/ plat contenant toutes les dépendances
# (dev comprises : prisma CLI pour les migrations)
RUN pnpm --filter api deploy --legacy /app/deployed

# Copier le build et le schéma Prisma dans le déploiement
RUN cp -r /app/apps/api/dist /app/deployed/dist
RUN cp -r /app/prisma /app/deployed/prisma

# Générer Prisma client dans le déploiement
RUN cd /app/deployed && ./node_modules/.bin/prisma generate --schema=/app/deployed/prisma/schema.prisma

# =========================================
# STAGE 2 : Exécution
# =========================================
FROM node:22-slim

RUN apt-get update -qq && apt-get install -y -qq openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production

# Copier le déploiement complet (node_modules plat + dist + prisma)
COPY --from=builder /app/deployed ./

EXPOSE 3001

CMD ["sh", "-c", "./node_modules/.bin/prisma db push --accept-data-loss && node dist/main.js"]
