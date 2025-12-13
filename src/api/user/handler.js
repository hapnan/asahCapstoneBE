import ClientError from "../../exeptions/ClientError.js";
import NotFoundError from "../../exeptions/NotFoundError.js";

class UserHandler {
  constructor(userService) {
    this._userService = userService;

    this.getUserProfile = this.getUserProfile.bind(this);
  }

  async getUserProfile(request, h) {
    try {
      const passkeyId = request.yar.get("user_loged");
      console.log("Logged-in user passkeyId:", passkeyId);
      if (!passkeyId || !passkeyId.passkeyId) {
        throw new ClientError("Unauthorized. Please login first.", 401);
      }

      const rpasskeyId = await this._userService.getUserBypasskeyId(
        request,
        passkeyId.passkeyId,
      );

      const userProfile = await this._userService.getUserById(
        request,
        rpasskeyId.userId,
      );

      if (!userProfile) {
        throw new NotFoundError("User not found");
      }
      return h
        .response({
          status: "success",
          data: {
            user: userProfile,
          },
        })
        .code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }
      console.error("Error fetching user profile:", error);
      return h
        .response({
          status: "error",
          message: "Internal Server Error",
        })
        .code(500);
    }
  }
}

export default UserHandler;
