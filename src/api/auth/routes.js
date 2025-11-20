const routes = (handler) => [
    {
        method: 'GET',
        path: '/auth/register/options',
        handler: handler.registerOptions.bind(handler),
    },
    {
        method: 'POST',
        path: '/auth/register/verify',
        handler: handler.verifyRegister.bind(handler),
    },
    {
        method: 'GET',
        path: '/auth/login/options',
        handler: handler.authOptions.bind(handler),
    },
    {
        method: 'POST',
        path: '/auth/login/verify',
        handler: handler.verifyAuth.bind(handler),
    },
    {
        method: 'POST',
        path: '/auth/logout',
        handler: handler.logoutHandler.bind(handler),
    },
    {
        method: 'GET',
        path: '/auth/session/check',
        handler: handler.sessionCheckHandler.bind(handler),
    },
];

export default routes;
