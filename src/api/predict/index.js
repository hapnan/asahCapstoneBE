import PredictionHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: "predict",
  version: "0.0.1",
  dependencies: ["prisma"],
  register: async (server, { mlService, predictService, cacheService }) => {
    const predictHandler = new PredictionHandler(
      mlService,
      predictService,
      cacheService,
    );
    const predictRoutes = routes(predictHandler);
    server.route(predictRoutes);
  },
};
