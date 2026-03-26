import "dotenv/config";
import { Server } from "http";
import supertest, { type Agent } from "supertest";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { createApp } from "../app";
import { clearDatabase } from "./db-helpers";

let server: Server;
export let request: Agent;

beforeEach(async () => {
  await clearDatabase();
});

beforeAll(() => {
  const app = createApp();
  server = app.listen(0);
  request = supertest(app);
});

afterAll(() => {
  server.close();
});
