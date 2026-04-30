import cors from "cors";
import express, { type Application } from "express";
import healthRoutes from "./health/health.routes";
import recipeRoutes from "./recipes/recipes.routes";

export const createApp = (): Application => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/recipes", recipeRoutes);
  app.use("/health", healthRoutes);
  return app;
};
