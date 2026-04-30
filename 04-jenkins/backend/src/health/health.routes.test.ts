import { describe, expect, it } from "vitest";
import { findRoute } from "../test/route.utils";
import { healthController } from "./health.controller";
import router from "./health.routes";

describe("health.routes", () => {
  it("should define GET / and call getHealth", () => {
    const handler = findRoute(router, "get", "/");
    expect(handler).toBe(healthController.getHealth);
  });
});
