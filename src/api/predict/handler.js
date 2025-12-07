class PredictionHandler {
    constructor(mlServices) {
        this._mlServices = mlServices;

        this.handlePredictionRequest = this.handlePredictionRequest.bind(this);
    }

    async handlePredictionRequest(request, h) {
        try {
            const { model, data } = request.payload;
            console.log('Received prediction request with model:', model);
            console.log('Input data:', data);
            const prediction = await this._mlServices.predict(data, model);
            return h
                .response({
                    prediction,
                })
                .code(200);
        } catch (error) {
            console.error('Error handling prediction request:', error);
            const response = h.response({
                status: 'error',
                message: 'Internal Server Error',
            });
            response.code(500);
            return response;
        }
    }
}
export default PredictionHandler;
