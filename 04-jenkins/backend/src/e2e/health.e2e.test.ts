import { describe, expect, it } from "vitest";
import { request } from "./setup-e2e";

describe("[E2E] Health API", () => {
  it("GET /health should return health message", async () => {
    const res = await request.get("/health");
    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");
  });
});
