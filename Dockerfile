# syntax=docker/dockerfile:1.7

# ============================================
# Stage 1: Builder — installs all deps and builds the Nuxt app
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Placeholder DATABASE_URL pour que `prisma generate` puisse s'exécuter
ENV DATABASE_URL=postgres://placeholder:placeholder@localhost:5432/placeholder

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

COPY . .

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
