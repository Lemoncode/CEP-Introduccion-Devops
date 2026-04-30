import { RouterProvider, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import NotFoundPage from "./routes/404";
import Root from "./routes/__root";
import IndexPage from "./routes/index";
import RecipeDetailPage from "./routes/recipes/$id";
import RecipeEditPage from "./routes/recipes/$id.edit";
import RecipeNewPage from "./routes/recipes/new";

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

const routeTree = rootRoute.addChildren([indexRoute, recipesNewRoute, recipeDetailRoute, recipeEditRoute]);

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
