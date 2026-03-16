# Stage 1: Build
FROM node:lts AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run prisma:generate
RUN npm run build

# Stage 2: Production
FROM node:lts

ENV NODE_ENV="production"
WORKDIR /app
EXPOSE 3000

COPY package.json package-lock.json ./
RUN npm ci

COPY --from=builder /app/dist/ dist/

CMD [ "npm", "start" ]

