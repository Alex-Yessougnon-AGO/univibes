# Univibes API - Dockerfile
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@11 --activate

WORKDIR /app

# Copy only dependency files
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc .pnpmfile.cjs ./
COPY package.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/config/package.json packages/config/package.json
COPY prisma/schema.prisma prisma/schema.prisma

# Install dependencies
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Copy source code (only what's needed)
COPY apps/api/src apps/api/src
COPY apps/api/tsconfig.json apps/api/tsconfig.json
COPY apps/api/tsconfig.build.json apps/api/tsconfig.build.json
COPY apps/api/nest-cli.json apps/api/nest-cli.json
COPY packages packages
COPY tsconfig.json ./

# Generate Prisma client and build
ENV CI=true
RUN pnpm db:generate
RUN pnpm --filter api build

# Production stage
FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@11 --activate
WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed to run
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/src/generated ./apps/api/src/generated
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]
