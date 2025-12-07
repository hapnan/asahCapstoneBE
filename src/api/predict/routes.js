const routes = (handler) => [
    {
        method: 'POST',
        path: '/predict',
        handler: handler.handlePredictionRequest,
    },
];
export default routes;
