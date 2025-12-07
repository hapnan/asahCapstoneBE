import { PrismaClient } from "../generated/prisma/client.js";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
// plugin to instantiate Prisma Client
const prismaPlugin = {
  name: "prisma",
  register: async function (server) {
    const prisma = new PrismaClient({
      // Use Accelerate connection string
      // Uncomment 👇 for logs
      // log: ['error', 'warn', 'query'],
      adapter,
    });

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
