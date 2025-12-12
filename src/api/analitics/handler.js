class AnaliticsHandler {
  constructor(analiticService, userService, customerService) {
    this._analiticService = analiticService;
    this._userService = userService;
    this._customerService = customerService;

    this.addAnaliticsHandler = this.addAnaliticsHandler.bind(this);
    this.getAnaliticsHandler = this.getAnaliticsHandler.bind(this);
    this.getAnaliticsHandlerById = this.getAnaliticsHandlerById.bind(this);
    this.deleteAnaliticsHandler = this.deleteAnaliticsHandler.bind(this);
    this.updateAnaliticsHandler = this.updateAnaliticsHandler.bind(this);
  }

  async addAnaliticsHandler(request, h) {
    try {
      const { id_customer, status } = request.payload;
      const userLoged = request.yar.get("user_loged");

      const user = await this._userService.getUserBypasskeyId(
        request,
        userLoged.userID,
      );
      if (!user) {
        const response = h.response({
          status: "fail",
          message: "User not found",
        });
        response.code(404);
        return response;
      }

      console.log("Adding analitics for user ID:", user.userId);

      const analiticId = await this._analiticService.addAnalitics(request, {
        id_user: user.userId,
        id_customer,
        status,
      });

      const response = h.response({
        status: "success",
        message: "Analitics added successfully",
        data: {
          analiticId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.error("Error adding analitics:", error);
      const response = h.response({
        status: "fail",
        message: "Failed to add analitics",
      });
      response.code(500);
      return response;
    }
  }

  async getAnaliticsHandlerById(request, h) {
    const cookie = request.yar.get("user_loged");

    try {
      const analitics = await this._analiticService.getAnaliticsById(request, {
        passkeyId: cookie.passkeyId,
      });

      console.log("Retrieved analitics for user ID:", analitics);
      const countCustomer =
        await this._customerService.countDataCustomer(request);

      const countAnaliticsAccepted =
        await this._analiticService.countAcceptedAnalitics(request);
      return h
        .response({
          status: "success",
          data: {
            analitics,
            countCustomer: countCustomer,
            countAnaliticsAccepted: countAnaliticsAccepted,
          },
        })
        .code(200);
    } catch (error) {
      console.error("Error retrieving analitics by ID:", error);
      const response = h.response({
        status: "fail",
        message: "Failed to retrieve analitics by ID",
      });
      response.code(500);
      return response;
    }
  }

  async getAnaliticsHandler(request, h) {
    try {
      const analitics = await this._analiticService.getAnalitics(request);
      return h
        .response({
          status: "success",
          data: {
            analitics,
          },
        })
        .code(200);
    } catch (error) {
      console.error("Error retrieving analitics:", error);
      const response = h.response({
        status: "fail",
        message: "Failed to retrieve analitics",
      });
      response.code(500);
      return response;
    }
  }

  async deleteAnaliticsHandler(request, h) {
    try {
      const { id } = request.params;
      await this._analiticService.deleteAnalitics(id);
      return h
        .response({
          status: "success",
          message: "Analitics deleted successfully",
        })
        .code(200);
    } catch (error) {
      console.error("Error deleting analitics:", error);
      const response = h.response({
        status: "fail",
        message: "Failed to delete analitics",
      });
      response.code(500);
      return response;
    }
  }

  async updateAnaliticsHandler(request, h) {
    try {
      const { id } = request.params;
      const { id_user, id_customer, status } = request.payload;
      await this._analiticService.updateAnalitics(id, {
        id_user,
        id_customer,
        status,
      });
      return h
        .response({
          status: "success",
          message: "Analitics updated successfully",
        })
        .code(200);
    } catch (error) {
      console.error("Error updating analitics:", error);
      const response = h.response({
        status: "fail",
        message: "Failed to update analitics",
      });
      response.code(500);
      return response;
    }
  }
}

export default AnaliticsHandler;
