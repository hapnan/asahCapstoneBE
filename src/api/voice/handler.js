class VoiceHandler {
  constructor(twilioService) {
    this._twilioService = twilioService;

    this.getAccessToken = this.getAccessToken.bind(this);
    this.handleVoiceResponse = this.handleVoiceResponse.bind(this);
    this.handleVoiceStatus = this.handleVoiceStatus.bind(this);
  }

  /**
   * GET /voice/token - Generate Twilio access token for VoIP
   * Query params: refresh=true (optional) - for token refresh
   */
  async getAccessToken(request, h) {
    try {
      const userLogged = request.yar.get("user_loged");

      if (!userLogged || !userLogged.passkeyId) {
        return h
          .response({
            status: "fail",
            message: "Unauthorized. Please login first.",
          })
          .code(401);
      }

      // Use the logged-in user's ID as identity
      const identity = userLogged.passkeyId;

      // Generate token with expiration info
      const tokenData = this._twilioService.generateAccessToken(identity);

      console.log(
        `Generated access token for user: ${identity}, expires at: ${new Date(tokenData.expiresAt).toISOString()}`,
      );

      return h
        .response({
          status: "success",
          data: tokenData,
        })
        .code(200);
    } catch (error) {
      console.error("Error generating access token:", error);

      return h
        .response({
          status: "error",
          message: "Failed to generate access token",
          error: error.message,
        })
        .code(500);
    }
  }

  /**
   * POST /voice/response - Webhook for Twilio voice calls (TwiML response)
   */
  async handleVoiceResponse(request, h) {
    try {
      const { phoneNumber, enableRecording } = request.payload;

      if (!phoneNumber) {
        const errorTwiML = this._twilioService.generateErrorTwiML(
          "No phone number provided.",
        );

        return h.response(errorTwiML).type("text/xml").code(400);
      }

      // Validate phone number format (basic E.164 check)
      const e164Regex = /^\+[1-9]\d{1,14}$/;
      if (!e164Regex.test(phoneNumber)) {
        const errorTwiML = this._twilioService.generateErrorTwiML(
          "Invalid phone number format. Please use E.164 format.",
        );

        return h.response(errorTwiML).type("text/xml").code(400);
      }

      console.log(`Initiating call to: ${phoneNumber}`);

      // Generate TwiML based on recording preference
      const twiml = enableRecording
        ? this._twilioService.generateDialWithRecordingTwiML(phoneNumber)
        : this._twilioService.generateDialTwiML(phoneNumber);

      return h.response(twiml).type("text/xml").code(200);
    } catch (error) {
      console.error("Error handling voice response:", error);

      const errorTwiML = this._twilioService.generateErrorTwiML(
        "An error occurred while processing your call.",
      );

      return h.response(errorTwiML).type("text/xml").code(500);
    }
  }

  /**
   * POST /voice/status - Webhook for call status updates
   */
  async handleVoiceStatus(request, h) {
    try {
      const {
        CallSid,
        CallStatus,
        From,
        To,
        Duration,
        RecordingUrl,
        RecordingSid,
      } = request.payload;

      console.log("Call Status Update:", {
        callSid: CallSid,
        status: CallStatus,
        from: From,
        to: To,
        duration: Duration,
        recordingUrl: RecordingUrl,
        recordingSid: RecordingSid,
      });

      // Here you can save call logs to database
      // Example: await this._callLogService.saveCallLog(request, {...});

      return h.response().code(200);
    } catch (error) {
      console.error("Error handling call status:", error);
      return h.response().code(500);
    }
  }
}

export default VoiceHandler;
