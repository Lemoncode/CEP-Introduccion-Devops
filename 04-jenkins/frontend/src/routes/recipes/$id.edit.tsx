import { useNavigate, useParams } from "@tanstack/react-router";
import Heading from "@/components/heading";
import RecipeForm, { type RecipeFormProps } from "@/components/recipe-form";
import { useRecipe, useUpdateRecipe } from "@/hooks/useRecipes";

export default function RecipeEditPage() {
  const { id } = useParams({ from: "/recipes/$id/edit" });
  const navigate = useNavigate();
  const { data: recipe, isLoading } = useRecipe(id);
  const { mutate: updateRecipe, isPending } = useUpdateRecipe();

  const handleSubmit: RecipeFormProps["onSubmit"] = (data) => {
    updateRecipe(
      { id, ...data },
      {
        onSuccess: () => {
          navigate({ to: "/recipes/$id", params: { id } });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="font-body text-lg text-olive">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="font-body text-lg text-red-600">Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate({ to: "/recipes/$id", params: { id } })} className="font-body text-terracotta hover:underline">
        ← Back to Recipe
      </button>

      <div>
        <Heading as="h1" className="text-charcoal">
          Edit Recipe
        </Heading>
        <p className="mt-2 font-body text-charcoal/60">Update the recipe details below.</p>
      </div>

      <RecipeForm onSubmit={handleSubmit} isLoading={isPending} initialData={recipe} />
    </div>
  );
}
