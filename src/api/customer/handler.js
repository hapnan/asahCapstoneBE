import zlib from "zlib";
import { promisify } from "util";
import ClientError from "../../exeptions/ClientError.js";
import NotFoundError from "../../exeptions/NotFoundError.js";

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

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

  async getAllCustomerForPredict(request, h) {
    try {
      const cacheKey = "customer_all_full";
      try {
        const cached = await this._cacheService.get(cacheKey);
        // Decompress the cached data
        const decompressed = await gunzip(Buffer.from(cached, "base64"));
        const data = JSON.parse(decompressed.toString());
        return h.response(data).code(200);
      } catch (_) {}

      const customers =
        await this._customersService.getAllCustomerForPredict(request);

      // Compress data before caching
      const jsonString = JSON.stringify(customers);
      const compressed = await gzip(jsonString);
      const base64Compressed = compressed.toString("base64");

      await this._cacheService.set(cacheKey, base64Compressed, 300);

      return h.response(customers).code(200);
    } catch (error) {
      console.error("Get all customers full error: ", error);
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
        id,
      );

      if (!customer) {
        throw new NotFoundError("Customer not found");
      }

      await this._cacheService.set(cacheKey, JSON.stringify(customer), 300);

      return h.response(customer).code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }
      console.error("getCustomerById: ", error);
      return h.response({ error: "Internal server error" }).code(500);
    }
  }
}
