import {
  generateRegistrationOptions,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import "dotenv/config";
import InvariantError from "../../exeptions/InvariantError.js";
import NotFoundError from "../../exeptions/NotFoundError.js";
import ClientError from "../../exeptions/ClientError.js";

const nodeEnv = process.env.NODE_ENV || "development";

class AuthHandler {
  constructor(cacheService, authService) {
    this._cacheService = cacheService;
    this._authService = authService;
  }

  async registerOptions(request, h) {
    try {
      const { username, name } = request.query;

      const user = await this._authService.getUserByusername(request, username);

      if (user != null) {
        throw new InvariantError("User already exists");
      }

      const userPasskey = await this._authService.getPasskeysByusername(
        request,
        username,
      );

      const options = await generateRegistrationOptions({
        rpName: "Asah App",
        rpID: nodeEnv === "production" ? "asah.hapnanarsad.com" : "localhost",
        userName: username,
        userDisplayName: name,
        attestationType: "none",
        excludeCredentials: userPasskey.map((passkey) => ({
          id: Buffer.from(passkey.webauthnUserID, "base64url"),
          transport: passkey.transports,
        })),
        authenticatorSelection: {
          residentKey: "required",
          userVerification: "preferred",
          authenticatorAttachment: "cross-platform",
        },
      });

      await this._cacheService.set(
        `register_options_${username}`,
        JSON.stringify(options),
        300,
      );
      console.info("Generated register options Successfully");
      return options;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      console.error("Register options error:", error);
      const response = h.response({
        status: "error",
        message: "Internal Server Error",
      });
      response.code(500);
      return response;
    }
  }

  async verifyRegister(request, h) {
    try {
      const { username, registrationResponse } = request.payload;

      const registerOptions = await this._cacheService.get(
        `register_options_${username}`,
      );

      let verification;
      try {
        verification = await verifyRegistrationResponse({
          response: registrationResponse,
          expectedChallenge: JSON.parse(registerOptions).challenge,
          expectedOrigin:
            nodeEnv == "production"
              ? "https://asah.hapnanarsad.com"
              : "http://localhost:5173",
          expectedRPID:
            nodeEnv === "production" ? "asah.hapnanarsad.com" : "localhost",
        });
      } catch (error) {
        console.error("Registration verification error:", error);
        throw new InvariantError("Registration verification failed");
      }
      const { verified } = verification;

      this._authService.createUser(request, {
        username: username,
        name: JSON.parse(registerOptions).user.displayName,
        webauthnUserID: JSON.parse(registerOptions).user.id,
        publicKey: verification.registrationInfo.credential.publicKey,
        counter: verification.registrationInfo.credential.counter,
        transports: verification.registrationInfo.credential.transports,
        deviceType: verification.registrationInfo.credentialDeviceType,
        id: verification.registrationInfo.credential.id,
      });

      console.info("User registered successfully");

      return verified;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      console.error("Verify register error:", error);
      const response = h.response({
        status: "error",
        message: "Internal Server Error",
      });
      response.code(500);
      return response;
    }
  }

  async authOptions(request, h) {
    try {
      const { username } = request.query;

      const user = await this._authService.getUserByusername(request, username);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      const userPasskey = await this._authService.getPasskeysByusername(
        request,
        username,
      );

      const options = await generateAuthenticationOptions({
        rpID: nodeEnv === "production" ? "asah.hapnanarsad.com" : "localhost",
        allowCredentials: userPasskey.map((passkeys) => ({
          id: passkeys.id,
          transports: passkeys.transports,
        })),
      });
      await this._cacheService.set(
        `auth_options_${username}`,
        JSON.stringify(options),
        300,
      );
      console.info("Generated auth options Successfully");
      return options;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      console.error("Auth options error:", error);
      const response = h.response({
        status: "error",
        message: "Internal Server Error",
      });
      response.code(500);
      return response;
    }
  }

  async verifyAuth(request, h) {
    try {
      const { username, authenticationResponse } = request.payload;
      const authOptions = await this._cacheService.get(
        `auth_options_${username}`,
      );
      const passkey = await this._authService.getPasskeysByusername(
        request,
        username,
      );

      let verification;
      try {
        verification = await verifyAuthenticationResponse({
          response: authenticationResponse,
          expectedChallenge: JSON.parse(authOptions).challenge,
          expectedOrigin:
            nodeEnv === "production"
              ? "https://asah.hapnanarsad.com"
              : "http://localhost:5173",
          expectedRPID:
            nodeEnv === "production" ? "asah.hapnanarsad.com" : "localhost",
          credential: {
            id: passkey[0].id,
            publicKey: passkey[0].publicKey,
            counter: passkey[0].counter,
            transports: passkey[0].transports,
          },
        });
      } catch (error) {
        console.error("Authentication verification error:", error);
        throw new InvariantError("Authentication verification failed");
      }

      const { verified } = verification;
      const { authenticationInfo } = verification;
      request.yar.set("user_loged", {
        passkeyId: passkey[0].id,
      });
      console.info("User authenticated successfully, session created.");
      // Update the counter in the database
      await this._authService.updatePasskeyCounter(request, {
        id: passkey[0].id,
        counter: authenticationInfo.newCounter,
      });
      return verified;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      console.error("Verify auth error:", error);
      const response = h.response({
        status: "error",
        message: "Internal Server Error",
      });
      response.code(500);
      return response;
    }
  }

  async sessionCheckHandler(request, h) {
    const userLoged = request.yar.get("user_loged");

    if (userLoged) {
      return h.response({ passkeyId: userLoged.passkeyId }).code(200);
    }

    return h.response({ session: "No active session" }).code(401);
  }

  async logoutHandler(request, h) {
    try {
      // Clear all session data
      request.yar.reset();

      return h.response({ message: "Logged out successfully" }).code(200);
    } catch (error) {
      console.error("Logout error:", error);
      return h.response({ error: "Logout failed" }).code(500);
    }
  }
}

export default AuthHandler;
