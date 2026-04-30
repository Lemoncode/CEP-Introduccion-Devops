import axios from "axios";
import type { CreateRecipeInput, Recipe } from "@/types/recipe";
import config from "@/config";

const api = axios.create({
  baseURL: config.apiBaseUrl,
});

export const recipeApi = {
  getAll: () => api.get<Recipe[]>("/recipes").then((r) => r.data),
  getById: (id: string) => api.get<Recipe>(`/recipes/${id}`).then((r) => r.data),
  create: (data: CreateRecipeInput) => api.post<Recipe>("/recipes", data).then((r) => r.data),
  update: (id: string, data: CreateRecipeInput) => api.put<Recipe>(`/recipes/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/recipes/${id}`),
};
