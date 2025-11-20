class AuthService {
    constructor() {}
    async getUserByusername(request, username) {
        const { prisma } = request.server.app;
        const user = await prisma.user.findUnique({
            where: { username },
        });
        return user;
    }

    async createUser(
        request,
        { username, name, webauthnUserID, publicKey, counter, transports, deviceType, id }
    ) {
        const { prisma } = request.server.app;
        const newUser = await prisma.user.create({
            include: {
                passkeys: true,
            },
            data: {
                username,
                name,
                passkeys: {
                    create: {
                        id: id,
                        webauthnUserID: webauthnUserID,
                        publicKey: publicKey,
                        counter: counter,
                        transports: transports,
                        deviceType: deviceType,
                    },
                },
            },
        });
        return newUser;
    }

    async getPasskeysByusername(request, username) {
        const { prisma } = request.server.app;
        const userWithPasskeys = await prisma.user.findUnique({
            where: { username },
            include: {
                passkeys: true,
            },
        });
        return userWithPasskeys ? userWithPasskeys.passkeys : [];
    }

    async updatePasskeyCounter(request, { id, counter }) {
        const { prisma } = request.server.app;
        await prisma.passkeys.update({
            where: { id: id },
            data: { counter: counter },
        });
    }
}

export default AuthService;
