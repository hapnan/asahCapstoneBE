import Hapi from '@hapi/hapi';
import auth from './api/auth/index.js';
import CacheService from './services/redis/CacheService.js';
import ClientError from './exeptions/ClientError.js';
const init = async () => {
    const cacheService = new CacheService();

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
        debug: {
            request: ['error'],
        },
    });

    const prismaPlugin = await import('./plugins/prisma.js');
    await server.register(prismaPlugin.default);

    await server.register({
        plugin: auth,
        options: {
            cacheService,
        },
    });

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response instanceof Error) {
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (!response.isServer) {
                return h.continue;
            }

            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            });
            newResponse.code(500);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
