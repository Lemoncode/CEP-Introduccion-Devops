# Stage 1: Build
FROM node:lts-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

ENV NODE_ENV="production"
COPY . .
RUN npm run build

# Stage 2: Production
FROM dhi.io/caddy:2
EXPOSE 80

COPY --from=builder /app/dist/ /usr/share/caddy/

