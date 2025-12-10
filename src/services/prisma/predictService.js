class PredictService {
  constructor() {}

  async addPredict(
    request,
    { id_customer, predictive_subscribe, predictive_score_subscribe },
  ) {
    const { prisma } = request.server.app;
    const predict = await prisma.predict.create({
      data: {
        id_customer,
        predictive_subscribe,
        predictive_score_subscribe,
      },
    });
    return predict.id;
  }

  async addPredictBulk(request, predictions) {
    const { prisma } = request.server.app;
    const result = await prisma.predict.createMany({
      data: predictions,
    });
    return result.count;
  }

  async getAllPredict(request) {
    const { prisma } = request.server.app;
    return prisma.predict.findMany();
  }

  async getPredictById(request, id) {
    const { prisma } = request.server.app;
    return prisma.predict.findUnique({
      where: { id: Number(id) },
    });
  }
}
export default PredictService;
