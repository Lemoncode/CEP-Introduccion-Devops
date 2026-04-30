import { describe, expect, it } from "vitest";
import { createRoute } from "@tanstack/react-router";
import { screen } from "@testing-library/react";
import { renderWithRouter, rootRoute } from "@/test/router-utils";
import RecipeCard from "./recipe-card";

describe("RecipeCard", () => {
  it("renders recipe title, prep time and difficulty", async () => {
    const route = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => (
        <RecipeCard
          recipe={{
            id: "1",
            title: "Tortilla de patata",
            difficulty: "easy",
            prepTime: 25,
            description: "Clasica y jugosa",
          }}
        />
      ),
    });

    renderWithRouter({ routes: [route], initialLocation: "/" });

    expect(await screen.findByRole("heading", { level: 3, name: "Tortilla de patata" })).toBeInTheDocument();
    expect(await screen.findByText("25 min")).toBeInTheDocument();
    expect(await screen.findByText("easy")).toBeInTheDocument();
    expect(await screen.findByText("Clasica y jugosa")).toBeInTheDocument();
  });

  it("links to the recipe detail route", async () => {
    const route = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => (
        <RecipeCard
          recipe={{
            id: "abc-123",
            title: "Gazpacho",
            difficulty: "medium",
            prepTime: 15,
          }}
        />
      ),
    });

    renderWithRouter({ routes: [route], initialLocation: "/" });

    const link = await screen.findByRole("link", { name: /gazpacho/i });

    expect(link).toHaveAttribute("href", "/recipes/abc-123");
  });

  it("does not render description paragraph when description is missing", async () => {
    const route = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => (
        <RecipeCard
          recipe={{
            id: "2",
            title: "Paella",
            difficulty: "hard",
            prepTime: 60,
          }}
        />
      ),
    });

    renderWithRouter({ routes: [route], initialLocation: "/" });

    expect(await screen.findByText("60 min")).toBeInTheDocument();
    expect(await screen.findByText("hard")).toBeInTheDocument();
    expect(screen.queryByText("Clasica y jugosa")).not.toBeInTheDocument();
  });
});
