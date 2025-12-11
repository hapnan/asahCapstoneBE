class analiticService {
  constructor() {}

  async addAnalitics(request, { id_user, id_customer, status }) {
    const { prisma } = request.server.app;
    const newAnalitics = await prisma.analitics.create({
      data: {
        id_user,
        id_customer,
        status,
      },
    });
    return newAnalitics.id;
  }

  async getAnalitics(request) {
    const { prisma } = request.server.app;
    const analitics = await prisma.analitics.findMany();
    return analitics;
  }

  async getAnaliticsById(request, { id }) {
    const { prisma } = request.server.app;
    const analitics = await prisma.analitics.findUnique({
      where: { id },
    });
    return analitics;
  }

  async deleteAnalitics(request, { id }) {
    const { prisma } = request.server.app;
    await prisma.analitics.delete({
      where: { id },
    });
  }

  async updateAnalitics(request, { id, id_user, id_customer, status }) {
    const { prisma } = request.server.app;
    await prisma.analitics.update({
      where: { id },
      data: {
        id_user,
        id_customer,
        status,
      },
    });
  }
}

export default analiticService;
