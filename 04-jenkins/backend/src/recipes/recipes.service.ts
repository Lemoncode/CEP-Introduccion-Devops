import { prisma } from "../prisma";
import { type Recipe, type RecipeInput, createRecipeSchema, queryById, recipeUpdateSchema } from "./recipes.model";

export const recipesService = {
  async createRecipe(recipeDraft: RecipeInput): Promise<Recipe> {
    const { success: isValid, error, data: recipe } = createRecipeSchema.safeParse(recipeDraft);
    if (!isValid) {
      throw error;
    }

    const now = new Date();
    return await prisma.recipes.create({
      data: { ...recipe, createdAt: now, updatedAt: now },
    });
  },

  async deleteRecipeById(reqId: string): Promise<Recipe> {
    const id = this.safeParseId(reqId);
    return await prisma.recipes.delete({ where: { id } });
  },

  async getRecipeById(reqId: string): Promise<Recipe | null> {
    const id = this.safeParseId(reqId);
    return await prisma.recipes.findUnique({ where: { id } });
  },

  async getRecipes(): Promise<Recipe[]> {
    return await prisma.recipes.findMany();
  },

  safeParseId(id: string): string {
    const { success: isValid, error, data } = queryById.safeParse({ id });
    if (!isValid) {
      throw error;
    }

    return data.id;
  },

  async updateRecipe(reqId: string, recipeDraft: Partial<RecipeInput>): Promise<Recipe> {
    const id = this.safeParseId(reqId);
    const { success: isValid, error, data: recipe } = recipeUpdateSchema.safeParse(recipeDraft);
    if (!isValid) {
      throw error;
    }

    return await prisma.recipes.update({
      data: { ...recipe, updatedAt: new Date() },
      where: { id },
    });
  },
};
