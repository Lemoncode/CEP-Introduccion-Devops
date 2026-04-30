import { Router as createRouter } from "express";
import { healthController } from "./health.controller";

const healthRouter = createRouter();

healthRouter.get("/", healthController.getHealth);

export default healthRouter;
