import type { FastifyInstance } from "fastify";

import {
  listChaptersController,
  getChapterController,
 getChapterAlignmentController,
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

  app.get(
    "/api/books/:bookId/chapters/:chapterNumber/alignment",
   getChapterAlignmentController
  );
}
