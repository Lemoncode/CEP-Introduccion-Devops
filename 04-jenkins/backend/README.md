# Backend — Recipes App

REST API built with Express, Prisma, and MongoDB. Uses Node.js as the runtime and npm as the package manager.

## Requirements

- [Node.js](https://nodejs.org) >= 22
- [Docker](https://www.docker.com) (for the database and E2E tests)

## Environment variables

| Variable       | Description                | Default |
| -------------- | -------------------------- | ------- |
| `DATABASE_URL` | MongoDB connection URI     | `""`    |
| `PORT`         | Port the server listens on | `3000`  |

## Installation

```bash
npm install
```

## Local development

### 1. Start the database

```bash
docker compose up -d
```

Starts a MongoDB instance with a replica set (required for Prisma transactions) on port `27017`.

### 2. Apply the schema

```bash
npm run db:migrate
```

### 3. (Optional) Seed the database

```bash
npm run db:seed
```

### 4. Start the server in development mode

```bash
npm run dev
```

The server restarts automatically when file changes are detected.

## Scripts

| Script                    | Description                                 |
| ------------------------- | ------------------------------------------- |
| `npm run dev`             | Start the server in watch mode              |
| `npm run build`           | Compile TypeScript to JavaScript in `dist/` |
| `npm run start`           | Run the compiled server                     |
| `npm run test`            | Run unit tests                              |
| `npm run test:watch`      | Run tests in watch mode                     |
| `npm run test:coverage`   | Run tests with a coverage report            |
| `npm run db:migrate`      | Apply the Prisma schema to the database     |
| `npm run db:seed`         | Populate the database with initial data     |
| `npm run prisma:generate` | Regenerate the Prisma client                |
| `npm run type-check`      | Type-check without emitting files           |
| `npm run lint`            | Run the linter (oxlint)                     |
| `npm run format:check`    | Check code formatting                       |
| `npm run format:write`    | Apply code formatting                       |

## E2E tests

E2E tests spin up an isolated MongoDB instance in Docker and run against it. No local database instance is required beforehand.

```bash
TEST_MODE=e2e docker compose -f compose.e2e.yml up --build --exit-code-from tests
```

Once finished, clean up the containers:

```bash
docker compose -f compose.e2e.yml down
```

## Build and deployment

### Compile

```bash
npm run build
```

Compiles TypeScript to JavaScript in `dist/`. The output can then be run with `npm run start`.

### Docker image

The `Dockerfile` uses a multi-stage build:

1. **Builder** — installs dependencies, generates the Prisma client, and compiles TypeScript.
2. **Production** — installs only production dependencies and copies the compiled output.

```bash
docker build -t recipes-backend .
docker run -e DATABASE_URL=<uri> -p 3000:3000 recipes-backend
```
