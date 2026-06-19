# Univibes API - Dockerfile
# Build: pnpm monorepo with NestJS

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@11 --activate

# Dependencies
FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc .pnpmfile.cjs ./
COPY package.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/config/package.json packages/config/package.json
COPY prisma/schema.prisma prisma/schema.prisma
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Build
FROM deps AS build
WORKDIR /app
COPY . .
ENV CI=true
RUN pnpm db:generate
RUN pnpm --filter api build

# Production
FROM node:22-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11 --activate
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/apps/api/src/generated ./apps/api/src/generated
COPY --from=build /app/package.json ./

EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]
