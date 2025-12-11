const routes = (handler) => [
  {
    method: "GET",
    path: "/voice/token",
    handler: handler.getAccessToken,
    options: {
      description: "Generate Twilio access token for VoIP calls",
      notes:
        "Requires authentication. Returns JWT token for making VoIP calls.",
      tags: ["api", "voice"],
    },
  },
  {
    method: "POST",
    path: "/voice/response",
    handler: handler.handleVoiceResponse,
    options: {
      description: "Twilio webhook for voice response (TwiML)",
      notes: "Returns TwiML XML to instruct Twilio to dial a number",
      tags: ["api", "voice", "webhook"],
      auth: false, // Twilio webhooks don't use session auth
    },
  },
  {
    method: "POST",
    path: "/voice/status",
    handler: handler.handleVoiceStatus,
    options: {
      description: "Twilio webhook for call status updates",
      notes: "Receives call status updates from Twilio",
      tags: ["api", "voice", "webhook"],
      auth: false, // Twilio webhooks don't use session auth
    },
  },
];

export default routes;
