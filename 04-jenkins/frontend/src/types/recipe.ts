export type RecipeDifficulty = "easy" | "medium" | "hard";

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  difficulty: RecipeDifficulty;
  prepTime: number;
  servings?: number;
  ingredients?: string[];
  steps?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecipeInput {
  title: string;
  description?: string;
  difficulty: RecipeDifficulty;
  prepTime: number;
  servings?: number;
  ingredients?: string[];
  steps?: string[];
}

export interface UpdateRecipeInput extends CreateRecipeInput {
  id: string;
}
