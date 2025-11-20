import AuthHandler from './handler.js';
import routes from './routes.js';

export default {
    name: 'auth',
    version: '0.0.1',
    dependencies: ['prisma'],
    register: async (server, { cacheService }) => {
        const authHandler = new AuthHandler(cacheService);
        server.route(routes(authHandler));
    },
};
