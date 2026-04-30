import { Router as createRouter } from "express";
import { recipesController } from "./recipes.controller";

const router = createRouter();

router.get("/", recipesController.getRecipes);
router.post("/", recipesController.createRecipe);
router.get("/:id", recipesController.getRecipeById);
router.put("/:id", recipesController.updateRecipe);
router.delete("/:id", recipesController.deleteRecipe);

export default router;
