import { Link, Outlet } from "@tanstack/react-router";
import Heading from "@/components/heading";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* Header */}
      <header className="border-b border-mist bg-charcoal shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🍳</span>
              <Heading as="h1" className="text-2xl text-cream">
                RecipeBox
              </Heading>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                to="/"
                activeProps={{ className: "font-body text-terracotta transition-colors" }}
                inactiveProps={{
                  className: "font-body text-cream transition-colors hover:text-terracotta",
                }}
              >
                All Recipes
              </Link>
              <Link to="/recipes/new" className="btn-primary">
                + New Recipe
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl flex-1 overflow-auto px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-mist bg-charcoal">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="font-body text-sm text-mist">© 2026 RecipeBox.</p>
        </div>
      </footer>
    </div>
  );
}
