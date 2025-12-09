import AnaliticsHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: "analitics",
  version: "1.0.0",
  dependencies: ["prisma"],
  register: async (server, { analiticService }) => {
    const handler = new AnaliticsHandler(analiticService);
    server.route(routes(handler));
  },
};
