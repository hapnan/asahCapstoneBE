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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: inputData,
      }),
    });

    return prediction.json();
  }
}

export default MLServices;
