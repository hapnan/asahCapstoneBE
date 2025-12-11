class UserService {
  constructor() {}
  async getUserById(request, id) {
    const { prisma } = request.server.app;
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    return user;
  }

  async getUserBypasskeyId(request, passkeyId) {
    const { prisma } = request.server.app;
    const passkey = await prisma.passkeys.findUnique({
      where: { id: passkeyId },
    });
    return passkey;
  }
}

export default UserService;
