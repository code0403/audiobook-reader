import type { FastifyInstance } from "fastify";

import {
  getChapterController,
} from "../controllers/chapter.controller.js";

export async function registerChapterRoutes(
  app: FastifyInstance
) {
  app.get(
    "/api/books/:bookId/chapters/:chapterNumber",
    getChapterController
  );
}