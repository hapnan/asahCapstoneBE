const routes = (handler) => [
    {
        method: 'GET',
        path: '/auth/register/options',
        handler: handler.registerOptions,
    },
    {
        method: 'POST',
        path: '/auth/register/verify',
        handler: handler.verifyRegister,
    },
    {
        method: 'POST',
        path: '/auth/login/options',
        handler: handler.authOptions,
    },
    {
        method: 'POST',
        path: '/auth/login/verify',
        handler: handler.verifyAuth,
    },
];

module.exports = routes;
