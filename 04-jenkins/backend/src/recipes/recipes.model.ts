import { z } from "zod";
import { type recipes as PrismaRecipe } from "../prisma/client";
import { type OptionalIfNullable } from "../utils/types";

export const queryById = z.object({
  id: z.string().regex(/^[0-9a-f]{24}$/, { error: "Id format is invalid" }),
});

export const createRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().or(z.null()).default(null),
  difficulty: z.enum(["easy", "medium", "hard"]),
  prepTime: z.number().int().min(1),
  servings: z.number().int().min(1).optional().or(z.null()).default(null),
  ingredients: z.array(z.string()).min(1),
  steps: z.array(z.string()).min(1),
});

export const recipeUpdateSchema = createRecipeSchema.partial();

export type Recipe = PrismaRecipe;
export type NonInputRecipeKeys = "id" | "createdAt" | "updatedAt";
export type RecipeInput = Omit<OptionalIfNullable<Recipe>, NonInputRecipeKeys>;
