const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');

class AuthService {
    constructor() {
        this._prisma = new PrismaClient().$extends(withAccelerate());
    }
    async getUserById(id) {
        const user = await this._prisma.user.findUnique({
            where: { id },
        });
        return user;
    }

    async createUser({
        username,
        name,
        webauthnUserID,
        publicKey,
        counter,
        transports,
        deviceType,
        id,
    }) {
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
}

module.exports = AuthService;
