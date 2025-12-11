import AnaliticsHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: "analitics",
  version: "1.0.0",
  dependencies: ["prisma"],
  register: async (server, { analiticService, userService }) => {
    const handler = new AnaliticsHandler(analiticService, userService);
    server.route(routes(handler));
  },
};
