class PredictionHandler {
  constructor(mlServices, predictService) {
    this._mlServices = mlServices;
    this._predictService = predictService;
    this.handlePredictionRequest = this.handlePredictionRequest.bind(this);
  }

  async handlePredictionRequest(request, h) {
    try {
      const { model, data } = request.payload;
      console.log("Received prediction request with model:", model);
      console.log("Input data:", data);
      const prediction = await this._mlServices.predict(data, model);
      console.log("Prediction response:", JSON.stringify(prediction));

      // Check if predictions array exists
      if (
        !prediction ||
        !prediction.predictions ||
        !Array.isArray(prediction.predictions)
      ) {
        throw new Error("Invalid prediction response format");
      }

      // Check if data is an array (multiple customers) or single object
      if (Array.isArray(data)) {
        // Handle multiple customers
        for (let i = 0; i < data.length; i++) {
          await this._predictService.addPredict(request, {
            id_customer: data[i].id,
            predictive_subscribe: prediction.predictions[i].prediction_label,
            predictive_score_subscribe: prediction.predictions[i].probability,
          });
        }
      } else {
        // Handle single customer
        await this._predictService.addPredict(request, {
          id_customer: data.id_customer,
          predictive_subscribe: prediction.predictions[0].prediction_label,
          predictive_score_subscribe: prediction.predictions[0].probability,
        });
      }

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
