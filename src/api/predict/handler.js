class PredictionHandler {
  constructor(mlServices, predictService, cacheService) {
    this._mlServices = mlServices;
    this._predictService = predictService;
    this._cacheService = cacheService;
    this.handlePredictionRequest = this.handlePredictionRequest.bind(this);
  }

  async handlePredictionRequest(request, h) {
    try {
      const { data } = request.payload;
      const prediction = await this._mlServices.predict(data);

      // Check if predictions array exists
      if (
        !prediction ||
        !prediction.predictions ||
        !Array.isArray(prediction.predictions)
      ) {
        throw new Error("Invalid prediction response format");
      }

      // Handle predictions - the ML API now returns id in the prediction result
      const predictionsData = prediction.predictions.map(
        (predictionResult) => ({
          id_customer: predictionResult.id,
          predictive_subscribe: predictionResult.prediction_label,
          predictive_score_subscribe: predictionResult.lead_score_probability,
        }),
      );

      await this._predictService.addPredictBulk(request, predictionsData);

      console.log("Prediction(s) saved");
      await this._cacheService.delete("customer_all");
      return h
        .response({
          prediction,
        })
        .code(200);
    } catch (error) {
      console.error("Error handling prediction request:", error);
      const response = h.response({
        status: "error",
        message: "Internal Server Error",
      });
      response.code(500);
      return response;
    }
  }
}
export default PredictionHandler;
