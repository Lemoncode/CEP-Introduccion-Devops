import { defineConfig } from "vitest/config";

const commonExclude = ["node_modules", "src/prisma", "src/server.ts", "src/e2e/setup-*.ts", "src/e2e/*-helpers.ts", "src/config.ts"];
const isE2ETesting = process.env.TEST_MODE === "e2e";

export default defineConfig({
  test: {
    coverage: {
      exclude: commonExclude,
      provider: "v8",
    },
    environment: "node",
    exclude: [...commonExclude, ...(isE2ETesting ? [] : ["src/e2e"])],
    include: isE2ETesting ? ["src/e2e/*.test.ts"] : ["src/**/*.test.ts"],
    mockReset: true,
    setupFiles: isE2ETesting ? ["src/e2e/setup-e2e.ts"] : [],
  },
});
