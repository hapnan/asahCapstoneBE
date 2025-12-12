import UserHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: "user",
  version: "0.0.1",
  dependencies: ["prisma"],
  register: async (server, { userService }) => {
    const userHandler = new UserHandler(userService);
    const userRoutes = routes(userHandler);
    server.route(userRoutes);
  },
};
