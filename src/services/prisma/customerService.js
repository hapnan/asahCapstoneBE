export default class CustomerService {
  constructor() {}

  async getAllCustomers(request) {
    const { prisma } = request.server.app;
    const customers = await prisma.customers.findMany({
      select: {
        id: true,
        name: true,
        job: true,
        result_of_last_campaign: true,
        predict: {
          select: {
            predictive_subscribe: true,
            predictive_score_subscribe: true,
          },
          orderBy: {
            predictive_score_subscribe: "desc",
          },
          take: 1,
        },
      },
    });

    // Sort by the highest prediction score
    return customers.sort((a, b) => {
      const scoreA = a.predict[0]?.predictive_score_subscribe || 0;
      const scoreB = b.predict[0]?.predictive_score_subscribe || 0;
      return scoreB - scoreA;
    });
  }

  async getAllCustomerForPredict(request) {
    const { prisma } = request.server.app;
    return await prisma.customers.findMany({
      select: {
        id: true,
        age: true,
        campaign: true,
        cons_conf_idx: true,
        cons_price_idx: true,
        contact: true,
        day_of_week: true,
        default: true,
        duration: true,
        education: true,
        emp_var_rate: true,
        euribor3m: true,
        housing: true,
        job: true,
        loan: true,
        marital: true,
        month: true,
        nr_employed: true,
        pdays: true,
        poutcome: true,
        previous: true,
      },
    });
  }

  async getCustomersById(request, id) {
    const { prisma } = request.server.app;
    return prisma.customers.findUnique({
      where: { id: Number(id) },
      include: {
        predict: true,
      },
    });
  }

  async addCustomer(request, data) {
    const { prisma } = request.server.app;
    return await prisma.customers.create({
      data: data,
    });
  }
}
