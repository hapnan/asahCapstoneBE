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

  async getSingleAnaliticsById(request, { customerid, passkeyId }) {
    const { prisma } = request.server.app;
    const passkey = await prisma.passkeys.findUnique({
      where: { id: passkeyId },
    });
    const analitics = await prisma.analitics.findFirst({
      where: { id_customer: customerid, id_user: passkey.userId },
    });
    return analitics;
  }

  async getAnaliticsById(request, { customerid, passkeyId }) {
    const { prisma } = request.server.app;
    const passkey = await prisma.passkeys.findUnique({
      where: { id: passkeyId },
    });

    const analitics = await prisma.analitics.findMany({
      where: { id_customer: customerid, id_user: passkey.userId },
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

  async countAcceptedAnalitics(request) {
    const { prisma } = request.server.app;
    const count = await prisma.analitics.count({
      where: { status: "success" },
    });
    return count;
  }
}

export default analiticService;
