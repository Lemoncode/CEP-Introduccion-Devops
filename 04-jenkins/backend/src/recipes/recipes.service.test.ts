import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { type DeepMockProxy, mockDeep } from "vitest-mock-extended";
import z from "zod";
import type { PrismaClient } from "../prisma/client";
import type { Recipe, RecipeInput } from "./recipes.model";
import { prisma as originalPrisma } from "../prisma";
import { recipesService } from "./recipes.service";

vi.mock(import("../prisma"), () => ({
  __esModule: true,
  prisma: mockDeep(),
}));

const prisma = originalPrisma as DeepMockProxy<PrismaClient>;

afterAll(() => {
  vi.restoreAllMocks();
});

// oxlint-disable-next-line max-lines-per-function
describe("recipesService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getRecipes returns recipes", async () => {
    const fakeRecipes: Recipe[] = [
      {
        createdAt: new Date(),
        description: "desc",
        difficulty: "easy",
        id: "69b62807f8886db9bdffc570",
        ingredients: ["egg"],
        prepTime: 10,
        servings: 2,
        steps: ["mix"],
        title: "Tortilla",
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
      createdAt: new Date(),
      description: "desc",
      difficulty: "easy",
      id: "69b62807f8886db9bdffc570",
      ingredients: ["egg"],
      prepTime: 10,
      servings: 2,
      steps: ["mix"],
      title: "Tortilla",
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
      createdAt: new Date(),
      description: "desc",
      difficulty: "easy",
      id: "69b62807f8886db9bdffc570",
      ingredients: ["egg"],
      prepTime: 10,
      servings: 2,
      steps: ["mix"],
      title: "Tortilla",
      updatedAt: new Date(),
    };
    prisma.recipes.delete.mockResolvedValue(deletedRecipe);
    const result = await recipesService.deleteRecipeById("69b62807f8886db9bdffc570");
    expect(result).toBe(deletedRecipe);
  });

  it("deleteRecipeById deletes non existing recipe", async () => {
    const deletedRecipe: Recipe = {
      createdAt: new Date(),
      description: "desc",
      difficulty: "easy",
      id: "69b62807f8886db9bdffc570",
      ingredients: ["egg"],
      prepTime: 10,
      servings: 2,
      steps: ["mix"],
      title: "Tortilla",
      updatedAt: new Date(),
    };
    prisma.recipes.delete.mockResolvedValue(deletedRecipe);
    const result = await recipesService.deleteRecipeById("69b62807f8886db9bdffc570");
    expect(result).toBe(deletedRecipe);
  });

  it("createRecipe validates and creates recipe", async () => {
    const draft = {
      difficulty: "easy",
      ingredients: ["egg"],
      prepTime: 10,
      steps: ["mix"],
      title: "Tortilla",
    } satisfies RecipeInput;

    const fakeRecipe: Recipe = {
      createdAt: new Date(),
      description: null,
      id: "69b62807f8886db9bdffc570",
      servings: null,
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
      difficulty: "easy",
      ingredients: ["egg"],
      prepTime: 10,
      steps: ["mix"],
      title: "",
    } satisfies RecipeInput;
    const promise = recipesService.createRecipe(draft);
    await expect(promise).rejects.toBeInstanceOf(z.ZodError);
    expect(prisma.recipes.create).not.toHaveBeenCalled();
  });

  it("updateRecipe validates and updates recipe", async () => {
    const draft = {
      difficulty: "easy",
      ingredients: ["egg"],
      prepTime: 10,
      steps: ["mix"],
      title: "Tortilla",
    } satisfies RecipeInput;
    const fakeRecipe: Recipe = {
      createdAt: new Date(),
      description: null,
      id: "69b62807f8886db9bdffc570",
      servings: null,
      updatedAt: new Date(),
      ...draft,
    };
    prisma.recipes.update.mockResolvedValue(fakeRecipe);
    const result = await recipesService.updateRecipe("69b62807f8886db9bdffc570", draft);
    expect(prisma.recipes.update).toHaveBeenCalledWith({
      data: expect.objectContaining(draft),
      where: { id: "69b62807f8886db9bdffc570" },
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
      difficulty: "easy",
      ingredients: ["egg"],
      prepTime: 10,
      steps: ["mix"],
      title: "",
    } satisfies RecipeInput;
    const promise = recipesService.updateRecipe("69b62807f8886db9bdffc570", draft);
    await expect(promise).rejects.toBeInstanceOf(z.ZodError);
    expect(prisma.recipes.update).not.toHaveBeenCalled();
  });
});
