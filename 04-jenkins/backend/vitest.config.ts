import { defineConfig } from "vitest/config";

const commonExclude = ["node_modules", "src/prisma", "src/server.ts", "src/e2e/setup-*.ts", "src/e2e/*-helpers.ts", "src/config.ts"];
const isE2ETesting = process.env.TEST_MODE === "e2e";

export default defineConfig({
  test: {
    environment: "node",
    include: isE2ETesting ? ["src/e2e/*.test.ts"] : ["src/**/*.test.ts"],
    exclude: commonExclude.concat(isE2ETesting ? [] : ["src/e2e"]),
    mockReset: true,
    coverage: {
      exclude: commonExclude,
    },
  },
});
