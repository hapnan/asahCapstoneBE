import AnaliticsHandler from "./handler.js";
import routes from "./routes.js";

const analitics = {
  name: "analitics",
  version: "1.0.0",
  dependencies: ["prisma"],
  register: async (
    server,
    { analiticService, userService, customerService },
  ) => {
    const handler = new AnaliticsHandler(
      analiticService,
      userService,
      customerService,
    );
    server.route(routes(handler));
  },
};

export default analitics;
