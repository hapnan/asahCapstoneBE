import { PrismaClient } from "../generated/prisma/index.js";
import { withAccelerate } from "@prisma/extension-accelerate";
import "dotenv/config";

// plugin to instantiate Prisma Client
const prismaPlugin = {
  name: "prisma",
  register: async function (server) {
    const prisma = new PrismaClient({
      // Use Accelerate connection string
      accelerateUrl: process.env.DATABASE_URL,
      // Uncomment 👇 for logs
      log: ["error", "warn", "query"],
    }).$extends(
      withAccelerate({
        cache: {
          // Enable caching with default TTL of 60 seconds
          ttl: 60,
        },
      })
    );

    server.app.prisma = prisma;

    // Close DB connection after the server's connection listeners are stopped
    // Related issue: https://github.com/hapijs/hapi/issues/2839
    server.ext({
      type: "onPostStop",
      method: async (server) => {
        await server.app.prisma.$disconnect();
      },
    });
  },
};

export default prismaPlugin;
