import type { FastifyInstance } from "fastify";

import {
  serveLegacyAudio,
  serveBookAudio,
} from "../controllers/audio.controller.js";

export async function registerAudioRoutes(
  app: FastifyInstance
) {
  app.get(
    "/audio/:filename",
    serveLegacyAudio
  );

  app.get(
    "/audio/:bookId/part/:partNumber",
    serveBookAudio
  );
}