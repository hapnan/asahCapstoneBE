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

  async getAnaliticsById(request, { passkeyId }) {
    const { prisma } = request.server.app;
    const passkey = await prisma.passkey.findUnique({
      where: { passkeyId },
    });
    const analitics = await prisma.analitics.findUnique({
      where: { id_user: passkey.id_user },
    });
    return analitics;
  }

  async getSingleAnaliticsById(request, { customerid, passkeyId }) {
    const { prisma } = request.server.app;
    const passkey = await prisma.passkey.findUnique({
      where: { passkeyId },
    });
    const analitics = await prisma.analitics.findUnique({
      where: { id_customer: customerid, id_user: passkey.id_user },
    });
    return analitics;
  }

  async getAnaliticsById(request, { customerid, passkeyId }) {
    const { prisma } = request.server.app;
    const passkey = await prisma.passkey.findUnique({
      where: { passkeyId },
    });
    const analitics = await prisma.analitics.findUnique({
      where: { customerid_id: customerid, id_user: passkey.id_user },
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
