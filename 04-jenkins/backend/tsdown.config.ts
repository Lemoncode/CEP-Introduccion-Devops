import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/server.ts"],
  tsconfig: "./tsconfig.json",
  outDir: "./dist",
  unbundle: false,
  platform: "node",
  copy: [{ from: "src/prisma/*.node", to: "dist/" }],
});
