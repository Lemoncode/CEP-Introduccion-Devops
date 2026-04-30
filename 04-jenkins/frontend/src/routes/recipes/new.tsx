import { useNavigate } from "@tanstack/react-router";
import Heading from "@/components/heading";
import RecipeForm, { type RecipeFormProps } from "@/components/recipe-form";
import { useCreateRecipe } from "@/hooks/useRecipes";

export default function RecipeNewPage() {
  const navigate = useNavigate();
  const { mutate: createRecipe, isPending } = useCreateRecipe();

  const handleSubmit: RecipeFormProps["onSubmit"] = (data) => {
    createRecipe(data, {
      onSuccess: (newRecipe) => {
        navigate({ to: "/recipes/$id", params: { id: newRecipe.id } });
      },
    });
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate({ to: "/" })} className="font-body text-terracotta hover:underline">
        ← Back to Recipes
      </button>

      <div>
        <Heading as="h1" className="text-charcoal">
          Create New Recipe
        </Heading>
        <p className="mt-2 font-body text-charcoal/60">Share your favorite recipe. Fill in the details below.</p>
      </div>

      <RecipeForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}
