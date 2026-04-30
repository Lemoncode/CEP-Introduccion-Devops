import { Outlet, RootRoute, RouterProvider, createMemoryHistory, createRootRoute, createRouter } from "@tanstack/react-router";
import { render, type RenderOptions } from "@testing-library/react";
import React, { FC } from "react";

interface RenderWithRouterOptions extends Omit<RenderOptions, "wrapper"> {
  router?: any;
  initialLocation?: string;
  routes?: any[];
}

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

type Routes = Parameters<RootRoute["addChildren"]>[0];
export const createTestRouter = (routes: Routes, initialLocation = "/") => {
  const routeTree = rootRoute.addChildren(routes);

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialLocation],
    }),
  });

  return router;
};

export const renderWithRouter = ({ router, initialLocation = "/", routes = [], ...renderOptions }: RenderWithRouterOptions = {}) => {
  if (!router && routes.length > 0) {
    router = createTestRouter(routes, initialLocation);
  }

  if (!router) {
    throw new Error("Router is required. Provide either a router or routes array.");
  }

  const Wrapper: FC = () => {
    return <RouterProvider router={router} />;
  };

  return {
    ...render(<React.Fragment />, { wrapper: Wrapper, ...renderOptions }),
    router,
  };
};
