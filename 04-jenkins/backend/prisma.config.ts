import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    // See: https://github.com/prisma/prisma/issues/28590
    // oxlint-disable-next-line typescript/no-non-null-assertion
    url: process.env.DATABASE_URL!,
  },
  engine: "classic",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  schema: "prisma/schema.prisma",
});
