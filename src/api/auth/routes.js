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
        method: 'POST',
        path: '/auth/login/options',
        handler: handler.authOptions.bind(handler),
    },
    {
        method: 'POST',
        path: '/auth/login/verify',
        handler: handler.verifyAuth.bind(handler),
    },
];

export default routes;
