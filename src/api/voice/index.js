import VoiceHandler from "./handler.js";
import routes from "./routes.js";

const voice = {
  name: "voice",
  version: "1.0.0",
  register: async (server, { twilioService }) => {
    const voiceHandler = new VoiceHandler(twilioService);
    server.route(routes(voiceHandler));
  },
};

export default voice;
