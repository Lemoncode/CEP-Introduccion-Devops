import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import type { Request, Response } from "express";
import { healthController } from "./health.controller";

describe("healthController", () => {
  let req: Request;
  let res: Response;
  let send: Mock<Response["send"]>;

  beforeEach(() => {
    send = vi.fn();
    req = {} as Request;
    res = { send } as unknown as Response;
  });

  describe("getHealth", () => {
    it("should send health message", () => {
      healthController.getHealth(req, res);
      expect(send).toHaveBeenCalledWith("OK");
    });
  });
});
