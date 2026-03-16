import cors from "cors";
import express from "express";
import recipeRoutes from "./recipes/recipes.routes";
import healthRoutes from "./health/health.routes";

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/recipes", recipeRoutes);
  app.use("/health", healthRoutes);
  return app;
};
