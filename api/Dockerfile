# =========================
# 1. BASE
# =========================
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./


# =========================
# 2. DEPENDENCIES FOR DEVELOPMENT
# =========================
FROM base AS deps-dev

RUN npm ci


# =========================
# 3. DEVELOPMENT
# =========================
FROM node:22-alpine AS dev

WORKDIR /app

ENV NODE_ENV=development

COPY --from=deps-dev /app/node_modules ./node_modules

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


# =========================
# 4. DEPENDENCIES FOR PRODUCTION
# =========================
FROM base AS deps-prod

ENV NODE_ENV=production

RUN npm ci --omit=dev


# =========================
# 5. PRODUCTION
# =========================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps-prod --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["npm", "start"]
