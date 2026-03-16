import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { type DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { z } from "zod";
import { prisma as originalPrisma } from "../prisma";
import { PrismaClient } from "../prisma/client";
import { type Recipe, type RecipeInput } from "./recipes.model";
import { recipesService } from "./recipes.service";

vi.mock(import("../prisma"), () => ({
  __esModule: true,
  prisma: mockDeep(),
}));

const prisma = originalPrisma as DeepMockProxy<PrismaClient>;

afterAll(() => {
  vi.restoreAllMocks();
});

describe("recipesService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getRecipes returns recipes", async () => {
    const fakeRecipes: Recipe[] = [
      {
        id: "69b62807f8886db9bdffc570",
        title: "Tortilla",
        description: "desc",
        difficulty: "easy",
        prepTime: 10,
        servings: 2,
        ingredients: ["egg"],
        steps: ["mix"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    prisma.recipes.findMany.mockResolvedValue(fakeRecipes);
    const result = await recipesService.getRecipes();
    expect(result).toEqual(fakeRecipes);
  });

  it("getRecipeById throws error if id is invalid", async () => {
    const promise = recipesService.getRecipeById("1");
    await expect(promise).rejects.toBeInstanceOf(z.ZodError);
    expect(prisma.recipes.findUnique).not.toHaveBeenCalled();
  });

  it("getRecipeById returns recipe if exists", async () => {
    const fakeRecipe: Recipe = {
      id: "69b62807f8886db9bdffc570",
      title: "Tortilla",
      description: "desc",
      difficulty: "easy",
      prepTime: 10,
      servings: 2,
      ingredients: ["egg"],
      steps: ["mix"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.recipes.findUnique.mockResolvedValue(fakeRecipe);
    const result = await recipesService.getRecipeById("69b62807f8886db9bdffc570");
    expect(result).toEqual(fakeRecipe);
  });

  it("getRecipeById returns null if not found", async () => {
    prisma.recipes.findUnique.mockResolvedValue(null);
    const result = await recipesService.getRecipeById("69b62807f8886db9bdffc570");
    expect(result).toBeNull();
  });

  it("deleteRecipeById throws error if id is invalid", async () => {
    const promise = recipesService.getRecipeById("1");
    await expect(promise).rejects.toBeInstanceOf(z.ZodError);
    expect(prisma.recipes.delete).not.toHaveBeenCalled();
  });

  it("deleteRecipeById deletes existing recipe", async () => {
    const deletedRecipe: Recipe = {
      id: "69b62807f8886db9bdffc570",
      title: "Tortilla",
      description: "desc",
      difficulty: "easy",
      prepTime: 10,
      servings: 2,
      ingredients: ["egg"],
      steps: ["mix"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.recipes.delete.mockResolvedValue(deletedRecipe);
    const result = await recipesService.deleteRecipeById("69b62807f8886db9bdffc570");
    expect(result).toBe(deletedRecipe);
  });

  it("deleteRecipeById deletes non existing recipe", async () => {
    const deletedRecipe: Recipe = {
      id: "69b62807f8886db9bdffc570",
      title: "Tortilla",
      description: "desc",
      difficulty: "easy",
      prepTime: 10,
      servings: 2,
      ingredients: ["egg"],
      steps: ["mix"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.recipes.delete.mockResolvedValue(deletedRecipe);
    const result = await recipesService.deleteRecipeById("69b62807f8886db9bdffc570");
    expect(result).toBe(deletedRecipe);
  });

  it("createRecipe validates and creates recipe", async () => {
    const draft = {
      title: "Tortilla",
      difficulty: "easy",
      prepTime: 10,
      ingredients: ["egg"],
      steps: ["mix"],
    } satisfies RecipeInput;

    const fakeRecipe: Recipe = {
      id: "69b62807f8886db9bdffc570",
      servings: null,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...draft,
    };
    prisma.recipes.create.mockResolvedValue(fakeRecipe);
    const result = await recipesService.createRecipe(draft);
    expect(prisma.recipes.create).toHaveBeenCalled();
    expect(result).toMatchObject({ ...draft, id: "69b62807f8886db9bdffc570" });
  });

  it("createRecipe throws validation error", async () => {
    const draft = {
      title: "", // Invalid value
      difficulty: "easy",
      prepTime: 10,
      ingredients: ["egg"],
      steps: ["mix"],
    } satisfies RecipeInput;
    const promise = recipesService.createRecipe(draft);
    await expect(promise).rejects.toBeInstanceOf(z.ZodError);
    expect(prisma.recipes.create).not.toHaveBeenCalled();
  });

  it("updateRecipe validates and updates recipe", async () => {
    const draft = {
      title: "Tortilla",
      difficulty: "easy",
      prepTime: 10,
      ingredients: ["egg"],
      steps: ["mix"],
    } satisfies RecipeInput;
    const fakeRecipe: Recipe = {
      id: "69b62807f8886db9bdffc570",
      servings: null,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...draft,
    };
    prisma.recipes.update.mockResolvedValue(fakeRecipe);
    const result = await recipesService.updateRecipe("69b62807f8886db9bdffc570", draft);
    expect(prisma.recipes.update).toHaveBeenCalledWith({
      where: { id: "69b62807f8886db9bdffc570" },
      data: expect.objectContaining(draft),
    });
    expect(result).toMatchObject({ ...draft, id: "69b62807f8886db9bdffc570" });
  });

  it("updateRecipe throws error if id is invalid", async () => {
    const promise = recipesService.getRecipeById("1");
    await expect(promise).rejects.toBeInstanceOf(z.ZodError);
    expect(prisma.recipes.update).not.toHaveBeenCalled();
  });

  it("updateRecipe throws validation error", async () => {
    const draft = {
      title: "", // Invalid value
      difficulty: "easy",
      prepTime: 10,
      ingredients: ["egg"],
      steps: ["mix"],
    } satisfies RecipeInput;
    const promise = recipesService.updateRecipe("69b62807f8886db9bdffc570", draft);
    await expect(promise).rejects.toBeInstanceOf(z.ZodError);
    expect(prisma.recipes.update).not.toHaveBeenCalled();
  });
});
