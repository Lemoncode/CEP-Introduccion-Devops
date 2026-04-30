import type { RecipeInput, Recipe, NonInputRecipeKeys } from "../recipes/recipes.model";
import { prisma } from "../prisma";

export const clearRecipes = async (): Promise<void> => {
  await prisma.recipes.deleteMany({});
};

export type RecipeWithOrWithoutNonInputKeys = RecipeInput & Partial<Pick<Recipe, NonInputRecipeKeys>>;

const mapRecipeInputToInsertData = (data: RecipeWithOrWithoutNonInputKeys): Omit<Recipe, "id"> => {
  const now = new Date();

  return {
    ...data,
    createdAt: data.createdAt ?? now,
    description: data.description ?? null,
    servings: data.servings ?? null,
    updatedAt: data.updatedAt ?? now,
  };
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  return await prisma.recipes.findUnique({ where: { id } });
};

export const insertRecipe = async (data: RecipeWithOrWithoutNonInputKeys): Promise<Recipe> => {
  return await prisma.recipes.create({
    data: mapRecipeInputToInsertData(data),
  });
};

export const insertRecipes = async (data: RecipeWithOrWithoutNonInputKeys[]): Promise<void> => {
  await prisma.recipes.createMany({
    data: data.map(mapRecipeInputToInsertData),
  });
};
