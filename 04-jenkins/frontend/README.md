# Recipes Frontend SPA

Frontend Recipes application built with React, TypeScript, Vite, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Type check
npm run type-check

# Format check
npm run format:check

# Lint
npm run lint

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure

```txt
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

```ini
VITE_API_URL=http://localhost:3000/api
```

## Design System

The app uses a warm editorial design system:

- **Colors:** Terracotta, Olive, Cream, Charcoal, Sand, Mist
- **Fonts:** Fraunces (display), Manrope (body)
- **Styling:** Tailwind CSS with custom theme extensions

See `design-system.svg` for visual reference.
