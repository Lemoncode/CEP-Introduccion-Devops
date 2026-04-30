import { describe, expect, it } from "vitest";
import { findRoute } from "../test/route.utils";
import { recipesController } from "./recipes.controller";
import router from "./recipes.routes";

describe("recipe.routes", () => {
  it("should define GET / and call getRecipes", () => {
    const handler = findRoute(router, "get", "/");
    expect(handler).toBe(recipesController.getRecipes);
  });

  it("should define POST / and call createRecipe", () => {
    const handler = findRoute(router, "post", "/");
    expect(handler).toBe(recipesController.createRecipe);
  });

  it("should define GET /:id and call getRecipeById", () => {
    const handler = findRoute(router, "get", "/:id");
    expect(handler).toBe(recipesController.getRecipeById);
  });

  it("should define PUT /:id and call updateRecipe", () => {
    const handler = findRoute(router, "put", "/:id");
    expect(handler).toBe(recipesController.updateRecipe);
  });

  it("should define DELETE /:id and call deleteRecipe", () => {
    const handler = findRoute(router, "delete", "/:id");
    expect(handler).toBe(recipesController.deleteRecipe);
  });
});
