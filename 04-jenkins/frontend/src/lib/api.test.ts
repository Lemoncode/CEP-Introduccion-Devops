import { describe, expect, it, vi } from "vitest";
import { mockDeep, type DeepMockProxy } from "vitest-mock-extended";
import aixosOriginal, { type AxiosInstance } from "axios";
import type { CreateRecipeInput, Recipe } from "@/types/recipe";
import { recipeApi } from "./api";

vi.mock("axios", () => {
  const axios = mockDeep<AxiosInstance>();
  axios.create = vi.fn(() => axios) as unknown as DeepMockProxy<AxiosInstance>["create"];
  return {
    __esModule: true,
    default: axios,
  };
});

const mockRecipe: Recipe = {
  id: "1",
  title: "Test Recipe",
  description: "Test description",
  difficulty: "easy",
  prepTime: 10,
  ingredients: ["ingredient1", "ingredient2"],
  steps: ["step1", "step2"],
};

const axios = aixosOriginal as unknown as DeepMockProxy<AxiosInstance>;

describe("recipeApi", () => {
  describe("getAll", () => {
    it("should fetch all recipes", async () => {
      axios.get.mockResolvedValueOnce({ data: [mockRecipe] });
      const result = await recipeApi.getAll();
      expect(axios.get).toHaveBeenCalledWith("/recipes");
      expect(result).toEqual([mockRecipe]);
    });
  });

  describe("getById", () => {
    it("should fetch a recipe by id", async () => {
      axios.get.mockResolvedValueOnce({ data: mockRecipe });
      const result = await recipeApi.getById("1");
      expect(axios.get).toHaveBeenCalledWith("/recipes/1");
      expect(result).toEqual(mockRecipe);
    });
  });

  describe("create", () => {
    it("should post a new recipe", async () => {
      const input: CreateRecipeInput = {
        title: "New",
        description: "Desc",
        difficulty: "easy",
        prepTime: 5,
        ingredients: ["i1"],
        steps: ["s1"],
      };
      axios.post.mockResolvedValueOnce({ data: mockRecipe });
      const result = await recipeApi.create(input);
      expect(axios.post).toHaveBeenCalledWith("/recipes", input);
      expect(result).toEqual(mockRecipe);
    });
  });

  describe("update", () => {
    it("should put a recipe", async () => {
      const input: CreateRecipeInput = {
        title: "Updated",
        description: "Desc",
        difficulty: "medium",
        prepTime: 15,
        ingredients: ["i1"],
        steps: ["s1"],
      };
      axios.put.mockResolvedValueOnce({ data: mockRecipe });
      const result = await recipeApi.update("1", input);
      expect(axios.put).toHaveBeenCalledWith("/recipes/1", input);
      expect(result).toEqual(mockRecipe);
    });
  });

  describe("delete", () => {
    it("should delete a recipe", async () => {
      axios.delete.mockResolvedValueOnce({});
      await recipeApi.delete("1");
      expect(axios.delete).toHaveBeenCalledWith("/recipes/1");
    });
  });
});
