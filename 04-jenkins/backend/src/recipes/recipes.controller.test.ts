import { afterAll, beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { type DeepMockProxy, mockDeep } from "vitest-mock-extended";
import type { Request, Response } from "express";
import z from "zod";
import type { Recipe, RecipeInput } from "./recipes.model";
import { recipesController } from "./recipes.controller";
import { recipesService as recipesServiceOriginal } from "./recipes.service";

const recipesService = recipesServiceOriginal as unknown as DeepMockProxy<typeof recipesServiceOriginal>;

vi.mock(import("./recipes.service"), () => ({
  __esModule: true,
  recipesService: mockDeep<typeof recipesServiceOriginal>(),
}));

afterAll(() => {
  vi.restoreAllMocks();
});

describe("recipes.controller", () => {
  let req: Request;
  let res: Response;
  let json: Mock<Response["json"]>;
  let status: Mock<Response["status"]>;
  let send: Mock<Response["send"]>;

  beforeEach(() => {
    json = vi.fn();
    json = vi.fn();
    send = vi.fn();
    status = vi.fn((_code) => ({ json, send }) as unknown as Response);
    req = {} as Request;
    res = { json, send, status } as unknown as Response;
  });

  describe("getRecipes", () => {
    it("returns recipes", async () => {
      const fakeRecipes: Recipe[] = [
        {
          createdAt: new Date(),
          description: "Spanish omelette",
          difficulty: "easy",
          id: "69b62807f8886db9bdffc570",
          ingredients: ["egg", "potato", "onion"],
          prepTime: 10,
          servings: 2,
          steps: ["Peel potatoes", "Beat eggs", "Fry everything"],
          title: "Tortilla",
          updatedAt: new Date(),
        },
      ];
      recipesService.getRecipes.mockResolvedValue(fakeRecipes);
      await recipesController.getRecipes(req, res);
      expect(json).toHaveBeenCalledWith(fakeRecipes);
    });
  });

  describe("getRecipeById", () => {
    it("returns recipe if found", async () => {
      req.params = { id: "69b62807f8886db9bdffc570" };
      const fakeRecipe: Recipe = {
        createdAt: new Date(),
        description: "Spanish omelette",
        difficulty: "easy",
        id: "69b62807f8886db9bdffc570",
        ingredients: ["egg", "potato", "onion"],
        prepTime: 10,
        servings: 2,
        steps: ["Peel potatoes", "Beat eggs", "Fry everything"],
        title: "Tortilla",
        updatedAt: new Date(),
      };
      recipesService.getRecipeById.mockResolvedValue(fakeRecipe);
      await recipesController.getRecipeById(req, res);
      expect(json).toHaveBeenCalledWith(fakeRecipe);
    });

    it("returns 400 if id is invalid", async () => {
      req.params = { id: "1" };
      const error = new z.ZodError([
        {
          code: "custom",
          message: "Invalid id",
          path: ["id"],
        },
      ]);
      recipesService.getRecipeById.mockRejectedValue(error);
      await recipesController.getRecipeById(req, res);
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        details: {
          fieldErrors: {
            id: ["Invalid id"],
          },
          formErrors: [],
        },
        error: "Invalid data",
      });
    });

    it("returns 404 if not found", async () => {
      req.params = { id: "69b62807f8886db9bdffc570" };
      recipesService.getRecipeById.mockResolvedValue(null);
      await recipesController.getRecipeById(req, res);
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe("createRecipe", () => {
    it("returns 400 on invalid data", async () => {
      req.body = { title: "" };
      const error = new z.ZodError([
        {
          code: "custom",
          message: "Required field",
          path: ["title"],
        },
      ]);
      recipesService.createRecipe.mockRejectedValue(error);
      await recipesController.createRecipe(req, res);
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        details: {
          fieldErrors: {
            title: ["Required field"],
          },
          formErrors: [],
        },
        error: "Invalid data",
      });
    });

    it("creates and returns recipe", async () => {
      const partialRecipe: RecipeInput = {
        difficulty: "easy",
        ingredients: ["egg"],
        prepTime: 10,
        steps: ["mix"],
        title: "Tortilla",
      };
      req.body = partialRecipe;
      const fakeRecipe: Recipe = {
        ...req.body,
        createdAt: new Date(),
        id: "69b62807f8886db9bdffc570",
        updatedAt: new Date(),
      };
      recipesService.createRecipe.mockResolvedValue(fakeRecipe);
      await recipesController.createRecipe(req, res);
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(fakeRecipe);
    });
  });

  describe("updateRecipe", () => {
    it("returns 400 if id is invalid", async () => {
      req.params = { id: "1" };
      const error = new z.ZodError([
        {
          code: "custom",
          message: "Invalid id",
          path: ["id"],
        },
      ]);
      recipesService.updateRecipe.mockRejectedValue(error);
      await recipesController.updateRecipe(req, res);
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        details: {
          fieldErrors: {
            id: ["Invalid id"],
          },
          formErrors: [],
        },
        error: "Invalid data",
      });
    });

    it("returns 400 on invalid data", async () => {
      req.body = { title: "" };
      req.params = { id: "1" };
      const error = new z.ZodError([
        {
          code: "custom",
          message: "Required field",
          path: ["title"],
        },
      ]);
      recipesService.updateRecipe.mockRejectedValue(error);
      await recipesController.updateRecipe(req, res);
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        details: {
          fieldErrors: {
            title: ["Required field"],
          },
          formErrors: [],
        },
        error: "Invalid data",
      });
    });

    it("updates and returns recipe", async () => {
      const partialRecipe = { title: "Tortilla" } satisfies Partial<RecipeInput>;
      req.body = partialRecipe;
      req.params = { id: "69b62807f8886db9bdffc570" };
      const fakeRecipe: Recipe = {
        createdAt: new Date(),
        description: "Spanish omelette",
        difficulty: "easy",
        id: "69b62807f8886db9bdffc570",
        ingredients: ["egg", "potato", "onion"],
        prepTime: 10,
        servings: 2,
        steps: ["Peel potatoes", "Beat eggs", "Fry everything"],
        updatedAt: new Date(),
        ...partialRecipe,
      };
      recipesService.updateRecipe.mockResolvedValue(fakeRecipe);
      await recipesController.updateRecipe(req, res);
      expect(json).toHaveBeenCalledWith(fakeRecipe);
    });
  });

  describe("deleteRecipe", () => {
    it("returns 400 if id is invalid", async () => {
      req.params = { id: "1" };
      const error = new z.ZodError([
        {
          code: "custom",
          message: "Invalid id",
          path: ["id"],
        },
      ]);
      recipesService.deleteRecipeById.mockRejectedValue(error);
      await recipesController.deleteRecipe(req, res);
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        details: {
          fieldErrors: {
            id: ["Invalid id"],
          },
          formErrors: [],
        },
        error: "Invalid data",
      });
    });

    it("deletes and returns 204", async () => {
      const fakeRecipe: Recipe = {
        createdAt: new Date(),
        description: "Spanish omelette",
        difficulty: "easy",
        id: "69b62807f8886db9bdffc570",
        ingredients: ["egg", "potato", "onion"],
        prepTime: 10,
        servings: 2,
        steps: ["Peel potatoes", "Beat eggs", "Fry everything"],
        title: "Tortilla",
        updatedAt: new Date(),
      };
      req.params = { id: "69b62807f8886db9bdffc570" };
      recipesService.deleteRecipeById.mockResolvedValue(fakeRecipe);
      await recipesController.deleteRecipe(req, res);
      expect(status).toHaveBeenCalledWith(204);
      expect(send).toHaveBeenCalled();
    });
  });
});
