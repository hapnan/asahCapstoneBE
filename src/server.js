'use strict';

const Hapi = require('@hapi/hapi');
const auth = require('./api/auth');
const CacheService = require('./services/redis/CacheService');

const ClientError = require('./exeptions/ClientError');
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

    await server.register(require('./plugins/prisma'));

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
