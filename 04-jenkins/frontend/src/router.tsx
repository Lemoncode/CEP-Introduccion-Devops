import { RouterProvider, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import Root from "./routes/__root";
import IndexPage from "./routes/index";
import RecipeDetailPage from "./routes/recipes/$id";
import RecipeNewPage from "./routes/recipes/new";
import RecipeEditPage from "./routes/recipes/$id.edit";
import NotFoundPage from "./routes/404";

const rootRoute = createRootRoute({
  component: Root,
  notFoundComponent: NotFoundPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexPage,
});

const recipesNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes/new",
  component: RecipeNewPage,
});

const recipeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes/$id",
  component: RecipeDetailPage,
});

const recipeEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes/$id/edit",
  component: RecipeEditPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  recipesNewRoute,
  recipeDetailRoute,
  recipeEditRoute,
]);

const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
