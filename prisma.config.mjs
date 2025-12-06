import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  // seed: "node prisma/seed.js",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use direct connection for migrations
    url: env("DIRECT_DATABASE_URL"),
  },
});
