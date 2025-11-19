const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');
const Hapi = require('@hapi/hapi');

// plugin to instantiate Prisma Client
const prismaPlugin = {
    name: 'prisma',
    register: async function (server) {
        const prisma = new PrismaClient({
            // Uncomment 👇 for logs
            log: ['error', 'warn', 'query'],
        }).$extends(withAccelerate());

        server.app.prisma = prisma;

        // Close DB connection after the server's connection listeners are stopped
        // Related issue: https://github.com/hapijs/hapi/issues/2839
        server.ext({
            type: 'onPostStop',
            method: async (server) => {
                server.app.prisma.$disconnect();
            },
        });
    },
};

module.exports = prismaPlugin;
