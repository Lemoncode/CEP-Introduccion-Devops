# Recipes Frontend SPA

Frontend Recipes application built with React, TypeScript, Vite, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies with Bun
bun install

# Start dev server
bun run dev

# Type check
bun run type-check

# Format check
bun run format:check

# Lint
bun run lint

# Build for production
bun run build

# Run tests
bun run test
```

## Project Structure

```
src/
  components/     # React components (RecipeCard, RecipeForm, etc.)
  hooks/          # Custom hooks for API integration
  lib/            # API client
  routes/         # TanStack Router pages
  types/          # TypeScript interfaces
  index.css       # Tailwind + global styles
  main.tsx        # App entry point
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
VITE_API_URL=http://localhost:3000/api
```

## Design System

The app uses a warm editorial design system:

- **Colors:** Terracotta, Olive, Cream, Charcoal, Sand, Mist
- **Fonts:** Fraunces (display), Manrope (body)
- **Styling:** Tailwind CSS with custom theme extensions

See `design-system.svg` for visual reference.
