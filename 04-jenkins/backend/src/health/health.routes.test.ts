import { describe, it, expect } from "vitest";
import { healthController } from "./health.controller";
import healthRoutes from "./health.routes";

const findRoute = (method: string, path: string) => {
  const layer = healthRoutes.stack.find((layer) => layer.route?.path === path && layer.route.stack[0].method === method);
  return layer?.route?.stack[0].handle;
};

describe("health.routes", () => {
  it("should define GET / and call getHealth", () => {
    const handler = findRoute("get", "/");
    expect(handler).toBe(healthController.getHealth);
  });
});
