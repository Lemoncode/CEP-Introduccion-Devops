import { Link } from "@tanstack/react-router";
import Heading from "@/components/heading";
import RecipeCard from "@/components/recipe-card";
import { useRecipes } from "@/hooks/useRecipes";

export default function IndexPage() {
  const { data: recipes = [], isLoading, error } = useRecipes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="font-body text-lg text-olive">Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="font-body text-lg text-red-600">Error loading recipes</p>
        <p className="font-body text-sm text-charcoal/60">{error.message}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="font-display text-2xl font-bold text-charcoal">No recipes yet</p>
        <p className="mt-2 font-body text-charcoal/60">Create your first recipe to get started</p>
        <Link to="/recipes/new" className="btn-primary mt-6">
          Create Recipe
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Heading as="h1" className="text-charcoal">
          All Recipes
        </Heading>
        <p className="font-body text-charcoal/60">
          {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
