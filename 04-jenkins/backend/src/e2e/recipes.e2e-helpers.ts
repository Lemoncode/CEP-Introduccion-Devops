import { prisma } from "../prisma";
import { type RecipeInput, type Recipe, type NonInputRecipeKeys } from "../recipes/recipes.model";

export const clearRecipes = async (): Promise<void> => {
  await prisma.recipes.deleteMany({});
};

export type RecipeWithOrWithoutNonInputKeys = RecipeInput & Partial<Pick<Recipe, NonInputRecipeKeys>>;

const mapRecipeInputToInsertData = (data: RecipeWithOrWithoutNonInputKeys) => {
  const now = new Date();

  return {
    ...data,
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
    servings: data.servings ?? null,
    description: data.description ?? null,
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
