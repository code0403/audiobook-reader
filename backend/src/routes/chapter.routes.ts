import type { FastifyInstance } from "fastify";

import {
  listChaptersController,
  getChapterController,
} from "../controllers/chapter.controller.js";

export async function registerChapterRoutes(
  app: FastifyInstance
) {
  app.get(
    "/api/books/:bookId/chapters",
    listChaptersController
  );

  app.get(
    "/api/books/:bookId/chapters/:chapterNumber",
    getChapterController
  );
}