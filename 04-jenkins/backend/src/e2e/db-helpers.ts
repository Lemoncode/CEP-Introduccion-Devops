import { clearRecipes, insertRecipe, insertRecipes } from "./recipes.e2e-helpers";

export const clearDatabase = async (): Promise<void> => {
  await clearRecipes();
};

export { insertRecipe, insertRecipes };
