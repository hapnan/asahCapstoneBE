import Hapi from '@hapi/hapi';
import auth from './api/auth/index.js';
import Yar from '@hapi/yar';
import prismaPlugin from './plugins/prisma.js';
import CacheService from './services/redis/CacheService.js';
import AuthService from './services/prisma/authService.js';
import ClientError from './exeptions/ClientError.js';
import 'dotenv/config';
const init = async () => {
    const cacheService = new CacheService();
    const authService = new AuthService();

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: [
                    `${
                        process.env.NODE_ENV === 'production'
                            ? 'https://asah.hapnanarsad.com'
                            : 'http://localhost:5173'
                    }`,
                ],
                credentials: true,
                additionalHeaders: ['cache-control', 'x-requested-with'],
            },
        },
        debug: {
            request: ['error'],
        },
    });

    await server.register({
        plugin: Yar,
        options: {
            storeBlank: false,
            cookieOptions: {
                password: 'e0JGGfXGv!vS0kFLNRImcq5Sq82NRhN#', // Must be at least 32 characters
                isSecure: process.env.NODE_ENV !== 'development', // Set to true in production with HTTPS
                isHttpOnly: true, // Prevents JavaScript access (XSS protection)
                isSameSite: 'Lax', // CSRF protection (Lax, Strict, or None)
                ttl: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
            },
        },
    });

    await server.register(prismaPlugin);

    await server.register({
        plugin: auth,
        options: {
            cacheService,
            authService,
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
