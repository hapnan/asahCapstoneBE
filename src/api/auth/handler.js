const {
    generateRegistrationOptions,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
    verifyRegistrationResponse,
} = require('@simplewebauthn/server');
const env = require('dotenv');

env.config();

const nodeEnv = process.env.NODE_ENV || 'development';

class AuthHandler {
    constructor(cacheService) {
        this._cacheService = cacheService;
    }

    async registerOptions(request, h) {
        const { username, name } = request.query;
        const { prisma } = request.server.app;
        console.log(username, name);
        const user = await prisma.user.findUnique({
            where: { username },
        });
        console.log('current user:', user);
        if (user != null) {
            const response = h.response({
                status: 'fail',
                message: 'User already exists',
            });
            response.code(400);
            return response;
        }

        userPasskey = await prisma.passkeys.findMany({
            where: {
                user: {
                    username: username,
                },
            },
        });
        console.log(userPasskey.length);

        let options;
        if (userPasskey.length < 0) {
            options = await generateRegistrationOptions({
                rpName: 'Asah App',
                rpID: nodeEnv == 'production' ? 'asahbe.hapnanarsad.com' : 'localhost',
                userName: username,
                attestationType: 'none',
                authenticatorSelection: {
                    residentKey: 'required',
                    userVerification: 'preferred',
                    authenticatorAttachment: 'cross-platform',
                },
                preferredAuthenticatorType: 'remoteDevice',
            });
        } else {
            options = await generateRegistrationOptions({
                rpName: 'Asah App',
                rpID: nodeEnv == 'production' ? 'asahbe.hapnanarsad.com' : 'localhost',
                userName: username,
                attestationType: 'none',
                excludeCredentials: userPasskey.map((passkey) => ({
                    id: Buffer.from(passkey.webauthnUserID, 'base64url'),
                    transport: passkey.transports,
                })),
                authenticatorSelection: {
                    residentKey: 'required',
                    userVerification: 'preferred',
                    authenticatorAttachment: 'cross-platform',
                },
                preferredAuthenticatorType: 'remoteDevice',
            });
        }

        console.log(options);

        this._cacheService.set(`register_options_${username}`, JSON.stringify(options), 300);

        return options;
    }

    async verifyRegister(request, h) {
        const { username, registrationResponse } = request.payload;

        const registerOptions = await this._cacheService.get(`register_options_${username}`);

        let verification;
        try {
            verification = await verifyRegistrationResponse({
                response: registrationResponse,
                expectedChallenge: JSON.parse(registerOptions).challenge,
                expectedOrigin:
                    nodeEnv == 'production'
                        ? 'https://asahbe.hapnanarsad.com'
                        : 'http://localhost:3000',
                expectedRPID: nodeEnv == 'production' ? 'asahbe.hapnanarsad.com' : 'localhost',
            });
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: 'Registration verification failed',
            });
            response.code(400);
            return response;
        }
    }

    async authOptions(request, h) {
        const { username } = request.payload;
        const prisma = request.server.app.prisma;
        const user = await prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            const response = h.response({
                status: 'fail',
                message: 'User not found',
            });
            response.code(404);
            return response;
        }
        const userPasskey = await prisma.passkey.findMany({
            where: { username: username },
        });

        const options = generateAuthenticationOptions({
            rpID: 'localhost',
            allowCredentials: userPasskey.map((passkey) => ({
                id: Buffer.from(passkey.webauthnUserID, 'base64url'),
                transports: passkey.transports,
            })),
            userVerification: 'preferred',
        });

        this._cacheService.set(`auth_options_${username}`, JSON.stringify(options), 300);

        return options;
    }

    async verifyAuth(request, h) {
        const { username, authenticationResponse } = request.payload;
        const authOptions = await this._cacheService.get(`auth_options_${username}`);

        let verification;
        try {
            verification = await verifyAuthenticationResponse({
                response: authenticationResponse,
                expectedChallenge: JSON.parse(authOptions).challenge,
                expectedOrigin:
                    nodeEnv == 'production'
                        ? 'https://asahbe.hapnanarsad.com'
                        : 'http://localhost:3000',
                expectedRPID: nodeEnv == 'production' ? 'asahbe.hapnanarsad.com' : 'localhost',
            });

            return verification;
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: 'Authentication verification failed',
            });
            response.code(400);
            return response;
        }
    }
}

module.exports = AuthHandler;
