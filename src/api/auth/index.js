import AuthHandler from './handler.js';
import routes from './routes.js';

export default {
    name: 'auth',
    version: '0.0.1',
    dependencies: ['prisma'],
    register: async (server, { cacheService, authService }) => {
        const authHandler = new AuthHandler(cacheService, authService);
        server.route(routes(authHandler));
    },
};
