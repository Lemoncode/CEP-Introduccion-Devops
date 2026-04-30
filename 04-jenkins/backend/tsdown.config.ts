import { defineConfig } from "tsdown";

export default defineConfig({
  copy: [{ from: "src/prisma/*.node", to: "dist/" }],
  entry: ["./src/server.ts"],
  outDir: "./dist",
  platform: "node",
  tsconfig: "./tsconfig.json",
  unbundle: false,
});
