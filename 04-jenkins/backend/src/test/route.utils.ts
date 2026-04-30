import type { RequestHandler, Router } from "express";

export const findRoute = (router: Router, method: string, path: string): RequestHandler | undefined => {
  const layer = router.stack.find((l) => l.route?.path === path && l.route.stack[0].method === method);
  return layer?.route?.stack[0].handle;
};
