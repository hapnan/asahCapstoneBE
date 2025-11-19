const AuthHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'auth',
    version: '0.0.1',
    dependencies: ['prisma'],
    register: async (server, { cacheService }) => {
        const authHandler = new AuthHandler(cacheService);
        server.route(routes(authHandler));
    },
};
