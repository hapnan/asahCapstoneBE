import { PrismaClient } from '../../generated/prisma/index.js';
import { withAccelerate } from '@prisma/extension-accelerate';
import 'dotenv/config';

class AuthService {
    constructor() {
        this._prisma = new PrismaClient({
            accelerateUrl: process.env.DATABASE_URL,
        }).$extends(
            withAccelerate({
                cache: {
                    ttl: 60,
                },
            })
        );
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

export default AuthService;
