import type { Request, Response } from "express";

export const healthController = {
  getHealth(_req: Request, res: Response): void {
    res.send("OK");
  },
};
