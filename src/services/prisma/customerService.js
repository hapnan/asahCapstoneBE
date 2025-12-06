export default class CustomerService {
  constructor() {}

  async getAllCustomers(request) {
    const { prisma } = request.server.app;
    return prisma.customers.findMany({
      select: {
        id: true,
        name: true,
        job: true,
        result_of_last_campaign: true,
        predictive_subscribe: true,
        predictive_score_subscribe: true,
      },
    });
  }

  async getCustomersById(request, id) {
    const { prisma } = request.server.app;
    return prisma.customers.findUnique({
      where: { id: Number(id) },
    });
  }
}
