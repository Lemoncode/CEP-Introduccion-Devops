import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import type { Recipe } from "@/types/recipe";
import Heading from "./heading";

export type RecipeCardRecipe = Pick<Recipe, "id" | "title" | "difficulty" | "prepTime" | "description">;

export interface RecipeCardProps {
  recipe: RecipeCardRecipe;
}

const RecipeCard: FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Link to="/recipes/$id" params={{ id: recipe.id }}>
      <div className="card group cursor-pointer transition-shadow hover:shadow-lg">
        <div className="mb-4 h-40 rounded-card bg-gradient-to-br from-terracotta to-olive" />

        <Heading as="h3" className="text-xl text-charcoal transition-colors group-hover:text-terracotta">
          {recipe.title}
        </Heading>

        {recipe.description && <p className="mt-2 line-clamp-2 font-body text-sm text-charcoal/60">{recipe.description}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge">{recipe.prepTime} min</span>
          <span className="badge capitalize">{recipe.difficulty}</span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
