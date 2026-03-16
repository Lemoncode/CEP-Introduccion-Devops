import { useQuery, useMutation } from "@tanstack/react-query";
import { recipeApi } from "../lib/api";
import type { CreateRecipeInput } from "../types/recipe";

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: () => recipeApi.getAll(),
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => recipeApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  return useMutation({
    mutationFn: (data: CreateRecipeInput) => recipeApi.create(data),
  });
}

export function useUpdateRecipe() {
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & CreateRecipeInput) => recipeApi.update(id, data),
  });
}

export function useDeleteRecipe() {
  return useMutation({
    mutationFn: (id: string) => recipeApi.delete(id),
  });
}
