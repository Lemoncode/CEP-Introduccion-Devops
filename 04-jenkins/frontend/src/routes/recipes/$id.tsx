import { useNavigate, useParams } from "@tanstack/react-router";
import Heading from "@/components/heading";
import { useDeleteRecipe, useRecipe } from "@/hooks/useRecipes";

export default function RecipeDetailPage() {
  const { id } = useParams({ from: "/recipes/$id" });
  const navigate = useNavigate();
  const { data: recipe, isLoading, error } = useRecipe(id);
  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe();

  const handleDelete = () => {
    if (!id) return;
    deleteRecipe(id, {
      onSuccess: () => {
        navigate({ to: "/" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="font-body text-lg text-olive">Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="font-body text-lg text-red-600">Recipe not found</p>
        <button onClick={() => navigate({ to: "/" })} className="btn-primary mt-6">
          Back to Recipes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button onClick={() => navigate({ to: "/" })} className="font-body text-terracotta hover:underline">
        ← Back to Recipes
      </button>

      <div className="card space-y-6">
        <div className="space-y-4">
          <Heading as="h1" className="text-charcoal">
            {recipe.title}
          </Heading>
          <div className="flex flex-wrap gap-3">
            <span className="badge">{recipe.prepTime} min prep</span>
            <span className="badge">{recipe.difficulty}</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <Heading as="h3" className="text-charcoal">
              Difficulty
            </Heading>
            <p className="font-body text-charcoal/60 capitalize">{recipe.difficulty}</p>
          </div>
          <div>
            <Heading as="h3" className="text-charcoal">
              Prep Time
            </Heading>
            <p className="font-body text-charcoal/60">{recipe.prepTime} minutes</p>
          </div>
          <div>
            <Heading as="h3" className="text-charcoal">
              Servings
            </Heading>
            <p className="font-body text-charcoal/60">{recipe.servings || 4}</p>
          </div>
        </div>

        {recipe.description && (
          <div>
            <Heading as="h3" className="text-charcoal">
              Description
            </Heading>
            <p className="font-body text-charcoal/60">{recipe.description}</p>
          </div>
        )}

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div>
            <Heading as="h3" className="text-charcoal">
              Ingredients
            </Heading>
            <ul className="list-inside list-disc space-y-1 font-body text-charcoal/60">
              {recipe.ingredients.map((ingredient: string, idx: number) => (
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}

        {recipe.steps && recipe.steps.length > 0 && (
          <div>
            <Heading as="h3" className="text-charcoal">
              Steps
            </Heading>
            <ol className="list-inside list-decimal space-y-2 font-body text-charcoal/60">
              {recipe.steps.map((step: string, idx: number) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => navigate({ to: "/recipes/$id/edit", params: { id } })} className="btn-primary flex-1">
            Edit Recipe
          </button>
          <button onClick={handleDelete} className="btn-secondary flex-1" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
