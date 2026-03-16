import { afterEach, describe, expect, it, vi } from "vitest";

describe("config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses default values if env vars are not set", async () => {
    vi.stubEnv("VITE_API_URL", "");
    const { default: config } = await import("./config");
    expect(config.apiBaseUrl).toBe("http://localhost:3000/api");
  });

  it("uses env vars if set", async () => {
    vi.stubEnv("VITE_API_URL", "https://production.com/api");
    const { default: config } = await import("./config");
    expect(config.apiBaseUrl).toBe("https://production.com/api");
  });
});
