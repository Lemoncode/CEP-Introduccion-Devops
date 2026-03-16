import { type Request, type Response } from "express";

export const healthController = {
  getHealth(_req: Request, res: Response) {
    res.send("OK");
  },
};
