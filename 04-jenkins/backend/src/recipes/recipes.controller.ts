import type { Request, Response, Handler } from "express";
import z from "zod";
import { recipesService } from "./recipes.service";

export const recipesController = {
  async createRecipe(req: Request, res: Response): Promise<ReturnType<Handler>> {
    try {
      const recipe = await recipesService.createRecipe(req.body);
      res.status(201).json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ details: z.flattenError(error), error: "Invalid data" });
      }

      /* v8 ignore start -- @preserve */
      console.error("Error creating recipe:", (error as Error).message);
      res.status(500).json({ error: "Error creating recipe" });
      /* v8 ignore stop -- @preserve */
    }
  },

  async deleteRecipe(req: Request, res: Response): Promise<ReturnType<Handler>> {
    try {
      await recipesService.deleteRecipeById(req.params.id.toString());
      res.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ details: z.flattenError(error), error: "Invalid data" });
      }

      /* v8 ignore start -- @preserve */
      console.error("Error deleting recipe:", (error as Error).message);
      res.status(500).json({ error: "Error deleting recipe" });
      /* v8 ignore stop -- @preserve */
    }
  },

  async getRecipeById(req: Request, res: Response): Promise<ReturnType<Handler>> {
    try {
      const recipe = await recipesService.getRecipeById(req.params.id.toString());

      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      res.json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ details: z.flattenError(error), error: "Invalid data" });
      }

      /* v8 ignore start -- @preserve */
      console.error("Error fetching recipe:", (error as Error).message);
      res.status(500).json({ error: "Error fetching recipe" });
      /* v8 ignore stop -- @preserve */
    }
  },

  async getRecipes(_req: Request, res: Response): Promise<void> {
    try {
      const recipes = await recipesService.getRecipes();
      res.json(recipes);
    } catch (error) {
      /* v8 ignore start -- @preserve */
      console.error("Error fetching recipes:", (error as Error).message);
      res.status(500).json({ error: "Error fetching recipes" });
      /* v8 ignore stop -- @preserve */
    }
  },

  async updateRecipe(req: Request, res: Response): Promise<ReturnType<Handler>> {
    try {
      const recipe = await recipesService.updateRecipe(req.params.id.toString(), req.body);
      res.json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ details: z.flattenError(error), error: "Invalid data" });
      }

      /* v8 ignore start -- @preserve */
      console.error("Error updating recipe:", (error as Error).message);
      res.status(500).json({ error: "Error updating recipe" });
      /* v8 ignore stop -- @preserve */
    }
  },
};
