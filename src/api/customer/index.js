import CustomersHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: "customer",
  version: "0.0.1",
  dependencies: ["prisma"],
  register: async (server, { cacheService, customersService }) => {
    const customersHandler = new CustomersHandler(
      cacheService,
      customersService
    );
    server.route(routes(customersHandler));
  },
};
