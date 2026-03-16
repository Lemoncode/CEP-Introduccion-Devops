import { afterEach, describe, expect, it, vi } from "vitest";

describe("config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses default values if env vars are not set", async () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("PORT", "");
    const { default: config } = await import("./config");
    expect(config.port).toBe(3000);
    expect(config.databaseUrl).toBe("");
  });

  it("uses env vars if set", async () => {
    vi.stubEnv("DATABASE_URL", "mongodb://localhost:27017");
    vi.stubEnv("PORT", "1234");
    const { default: config } = await import("./config");
    expect(config.port).toBe("1234");
    expect(config.databaseUrl).toBe("mongodb://localhost:27017");
  });
});
