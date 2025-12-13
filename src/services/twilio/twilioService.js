import "dotenv/config";
import twilio from "twilio";

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

class TwilioService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.apiKey = process.env.TWILIO_API_KEY;
    this.apiSecret = process.env.TWILIO_API_SECRET;
    this.twimlAppSid = process.env.TWILIO_TWIML_APP_SID;
    this.callerNumber = process.env.TWILIO_CALLER_NUMBER;

    // Validate required environment variables
    this._validateConfig();
  }

  _validateConfig() {
    const required = [
      "TWILIO_ACCOUNT_SID",
      "TWILIO_API_KEY",
      "TWILIO_API_SECRET",
      "TWILIO_TWIML_APP_SID",
      "TWILIO_CALLER_NUMBER",
    ];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required Twilio environment variables: ${missing.join(", ")}`,
      );
    }
  }

  /**
   * Generate Twilio Access Token for VoIP calls
   * @param {string} identity - Unique identifier for the user (e.g., username or user ID)
   * @param {number} ttl - Time to live in seconds (default: 3600 = 1 hour)
   * @returns {object} Object containing JWT token and expiration time
   */
  generateAccessToken(identity, ttl = 3600) {
    if (!identity) {
      throw new Error("Identity is required to generate access token");
    }

    // Create an access token
    const token = new AccessToken(
      this.accountSid,
      this.apiKey,
      this.apiSecret,
      {
        identity: identity,
        ttl: ttl, // Token valid for specified duration
      },
    );

    // Create a Voice grant for the token
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: this.twimlAppSid,
      incomingAllow: true, // Allow incoming calls
    });

    // Add the grant to the token
    token.addGrant(voiceGrant);

    const jwt = token.toJwt();

    // Calculate expiration timestamp
    const expiresAt = Date.now() + ttl * 1000;

    return {
      token: jwt,
      identity: identity,
      expiresAt: expiresAt,
      expiresIn: ttl,
    };
  }

  /**
   * Generate TwiML response to dial a number
   * @param {string} phoneNumber - Phone number to dial (E.164 format)
   * @param {string} callerId - Caller ID to display (your Twilio number)
   * @returns {string} TwiML XML response
   */
  generateDialTwiML(phoneNumber, callerId = null) {
    if (!phoneNumber) {
      throw new Error("Phone number is required");
    }

    const callerIdNumber = callerId || this.callerNumber;

    // Generate TwiML XML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${callerIdNumber}">
    <Number>${phoneNumber}</Number>
  </Dial>
</Response>`;

    return twiml;
  }

  /**
   * Generate TwiML for call recording
   * @param {string} phoneNumber - Phone number to dial
   * @param {string} callerId - Caller ID
   * @returns {string} TwiML XML with recording enabled
   */
  generateDialWithRecordingTwiML(phoneNumber, callerId = null) {
    if (!phoneNumber) {
      throw new Error("Phone number is required");
    }

    const callerIdNumber = callerId || this.callerNumber;

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${callerIdNumber}" record="record-from-answer">
    <Number>${phoneNumber}</Number>
  </Dial>
</Response>`;

    return twiml;
  }

  /**
   * Generate TwiML for error handling
   * @param {string} message - Error message to speak
   * @returns {string} TwiML XML response
   */
  generateErrorTwiML(message = "An error occurred. Please try again later.") {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${message}</Say>
  <Hangup/>
</Response>`;

    return twiml;
  }
}

export default TwilioService;
