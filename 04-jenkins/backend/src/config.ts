import "dotenv/config";

export default {
  databaseUrl: process.env.DATABASE_URL || "",
  port: process.env.PORT || 3000,
} as const;
