class UserHandler {
  constructor(userService) {
    this._userService = userService;

    this.getUserProfile = this.getUserProfile.bind(this);
  }

  async getUserProfile(request, h) {
    try {
      const passkeyId = request.yar.get("user_loged");

      if (!passkeyId || !passkeyId.passkeyId) {
        return h
          .response({
            status: "fail",
            message: "Unauthorized. Please login first.",
          })
          .code(401);
      }

      const rpasskeyId = await this._userService.getUserBypasskeyId(
        request,
        passkeyId.passkeyId,
      );

      const userProfile = await this._userService.getUserById(
        rpasskeyId.userId,
      );

      if (!userProfile) {
        return h
          .response({
            status: "fail",
            message: "User not found",
          })
          .code(404);
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
