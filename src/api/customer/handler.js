export default class CustomersHandler {
  constructor(cacheService, customersService) {
    this._cacheService = cacheService;
    this._customersService = customersService;
  }

  async getAllCustomers(request, h) {
    try {
      const cacheKey = "customer_all";
      try {
        const cached = await this._cacheService.get(cacheKey);
        return h.response(JSON.parse(cached)).code(200);
      } catch (_) {}

      const customers = await this._customersService.getAllCustomers(request);

      await this._cacheService.set(cacheKey, JSON.stringify(customers), 300);

      return h.response(customers).code(200);
    } catch (error) {
      console.error("Get all customers error: ", error);
      return h.response({ error: "Internal server error" }).code(500);
    }
  }

  async getCustomerById(request, h) {
    try {
      const { id } = request.params;
      const cacheKey = `customer_${id}`;

      try {
        const cached = await this._cacheService.get(cacheKey);
        return h.response(JSON.parse(cached)).code(200);
      } catch (_) {}

      const customer = await this._customersService.getCustomersById(
        request,
        id
      );

      if (!customer) {
        return h
          .response({
            status: "fail",
            message: "Customer not found",
          })
          .code(404);
      }

      await this._cacheService.set(cacheKey, JSON.stringify(customer), 300);

      return h.response(customer).code(200);
    } catch (error) {
      console.error("getCustomerById: ", error);
      return h.response({ error: "Internal server error" }).code(500);
    }
  }
}
