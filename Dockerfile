# Univibes API - Single stage build
# Using pnpm in a monorepo

FROM node:22-slim
RUN apt-get update -qq && apt-get install -y -qq openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11 --activate

WORKDIR /app

# Copy entire project (excluding generated dirs via .dockerignore)
COPY . .

# Install and build
RUN CI=true pnpm install --frozen-lockfile --shamefully-hoist
RUN CI=true pnpm db:generate
RUN CI=true pnpm --filter api build

EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]
