import { describe, expect, it } from "vitest";
import type { Recipe, RecipeInput } from "../recipes/recipes.model";
import { insertRecipe, insertRecipes } from "./db-helpers";
import { getRecipeById, type RecipeWithOrWithoutNonInputKeys } from "./recipes.e2e-helpers";
import { request } from "./setup-e2e";

describe("[E2E] Recipes API", () => {
  it("GET /api/recipes should return 2 recipes if 2 are inserted", async () => {
    const recipesDraft: RecipeWithOrWithoutNonInputKeys[] = [
      {
        difficulty: "easy",
        ingredients: ["egg", "potato"],
        prepTime: 10,
        steps: ["Beat eggs", "Fry potatoes"],
        title: "Tortilla",
      },
      {
        difficulty: "hard",
        ingredients: ["rice", "seafood"],
        prepTime: 60,
        steps: ["Cook rice", "Add seafood"],
        title: "Paella",
      },
    ];
    await insertRecipes(recipesDraft);
    const res = await request.get("/api/recipes");
    expect(res.status).toBe(200);
    const recipes: Recipe[] = res.body;
    expect(recipes).toBeInstanceOf(Array);
    expect(recipes).toHaveLength(2);
    const expected = recipesDraft.map((draft) => expect.objectContaining(draft));
    expect(recipes).toEqual(expected);
  });

  it("GET /api/recipes should return an array (empty or with data)", async () => {
    const res = await request.get("/api/recipes");
    expect(res.status).toBe(200);
    const recipes: Recipe[] = res.body;
    expect(recipes).toBeInstanceOf(Array);
    expect(recipes).toHaveLength(0);
  });

  it("POST /api/recipes should create a recipe", async () => {
    const recipeDraft: RecipeWithOrWithoutNonInputKeys = {
      difficulty: "easy",
      ingredients: ["egg", "potato"],
      prepTime: 10,
      steps: ["Beat eggs", "Fry potatoes"],
      title: "Tortilla",
    };
    const res = await request.post("/api/recipes").send(recipeDraft).set("Content-Type", "application/json");

    expect(res.status).toBe(201);
    const recipe: Recipe = res.body;
    expect(recipe).toMatchObject(recipeDraft);
    expect(recipe.id).toBeTypeOf("string");
    expect(recipe.createdAt).toBeTypeOf("string");
    expect(recipe.updatedAt).toBeTypeOf("string");
    expect(recipe.description).toBeNull();
    expect(recipe.servings).toBeNull();
  });

  it("GET /api/recipes/:id should return the created recipe", async () => {
    const recipe = await insertRecipe({
      difficulty: "easy",
      ingredients: ["egg", "potato"],
      prepTime: 10,
      steps: ["Beat eggs", "Fry potatoes"],
      title: "Tortilla",
    });
    const res = await request.get(`/api/recipes/${recipe.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ...recipe,
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
    });
  });

  it("GET /api/recipes/:id should return 404", async () => {
    const res = await request.get("/api/recipes/69b62807f8886db9bdffc570");
    expect(res.status).toBe(404);
  });

  it("PUT /api/recipes/:id should update the recipe", async () => {
    const recipe = await insertRecipe({
      difficulty: "easy",
      ingredients: ["egg", "potato"],
      prepTime: 10,
      steps: ["Beat eggs", "Fry potatoes"],
      title: "Tortilla",
    });

    const recipeDraft: RecipeInput = {
      difficulty: "medium",
      ingredients: ["egg", "potato", "onion"],
      prepTime: 15,
      steps: ["Beat eggs", "Fry potatoes", "Add onion"],
      title: "Tortilla updated",
    };
    const res = await request.put(`/api/recipes/${recipe.id}`).send(recipeDraft).set("Content-Type", "application/json");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ...recipe,
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: expect.any(String),
      ...recipeDraft,
    });
    expect(res.body.updatedAt).not.toBe(recipe.updatedAt.toISOString());
  });

  it("DELETE /api/recipes/:id should delete the recipe", async () => {
    const recipe = await insertRecipe({
      difficulty: "easy",
      ingredients: ["egg", "potato"],
      prepTime: 10,
      steps: ["Beat eggs", "Fry potatoes"],
      title: "Tortilla",
    });
    const res = await request.delete(`/api/recipes/${recipe.id}`);
    expect(res.status).toBe(204);
    expect(await getRecipeById(recipe.id)).toBeNull();
  });
});
