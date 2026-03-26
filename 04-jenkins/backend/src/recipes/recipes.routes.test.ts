import { RequestHandler } from "express";
import { describe, expect, it } from "vitest";
import { recipesController } from "./recipes.controller";
import router from "./recipes.routes";

const findRoute = (method: string, path: string): RequestHandler | undefined => {
  const layer = router.stack.find((layer) => layer.route?.path === path && layer.route.stack[0].method === method);
  return layer?.route?.stack[0].handle;
};

describe("recipe.routes", () => {
  it("should define GET / and call getRecipes", () => {
    const handler = findRoute("get", "/");
    expect(handler).toBe(recipesController.getRecipes);
  });

  it("should define POST / and call createRecipe", () => {
    const handler = findRoute("post", "/");
    expect(handler).toBe(recipesController.createRecipe);
  });

  it("should define GET /:id and call getRecipeById", () => {
    const handler = findRoute("get", "/:id");
    expect(handler).toBe(recipesController.getRecipeById);
  });

  it("should define PUT /:id and call updateRecipe", () => {
    const handler = findRoute("put", "/:id");
    expect(handler).toBe(recipesController.updateRecipe);
  });

  it("should define DELETE /:id and call deleteRecipe", () => {
    const handler = findRoute("delete", "/:id");
    expect(handler).toBe(recipesController.deleteRecipe);
  });
});
