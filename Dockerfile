# syntax=docker/dockerfile:1.7

# ============================================
# Stage 1: Builder — installs all deps and builds the Nuxt app
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Placeholder DATABASE_URL pour que `prisma generate` puisse s'exécuter
ENV DATABASE_URL=postgres://placeholder:placeholder@localhost:5432/placeholder
ENV NODE_OPTIONS=--max-old-space-size=4096

# 1. Manifests d'abord (pour le cache des deps)
COPY package.json package-lock.json ./

# 2. Install sans postinstall (schema.prisma pas encore là)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts --legacy-peer-deps

# 3. Copie du reste du code (inclut prisma/, server/, app/, etc.)
COPY . .

# 4. Génération Prisma + build Nuxt manuellement
RUN npx prisma generate
RUN npm run build

# ============================================
# Stage 2: Runner — minimal production image
# ============================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --ignore-scripts --legacy-peer-deps \
 && npm install prisma tsx --no-save \
 && npm cache clean --force

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/server/generated ./server/generated

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && node .output/server/index.mjs"]
