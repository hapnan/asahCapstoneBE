import "dotenv/config";
class MLServices {
  constructor() {
    // Initialize your machine learning model or services here
  }

  async predict(inputData) {
    // Implement your prediction logic here
    // This is just a placeholder
    const prediction = await fetch(process.env.ML_API, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: inputData,
      }),
    });
    const predictionJson = await prediction.json();

    if (!prediction.ok) {
      console.log(
        "ML Services prediction error:",
        JSON.stringify(predictionJson, null, 2),
      );
    }
    console.log("ML Services prediction response:", predictionJson);
    return predictionJson;
  }
}

export default MLServices;
