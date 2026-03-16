import { clearRecipes, insertRecipe, insertRecipes } from "./recipes.e2e-helpers";

export async function clearDatabase(): Promise<void> {
  await clearRecipes();
}

export { insertRecipe, insertRecipes };
