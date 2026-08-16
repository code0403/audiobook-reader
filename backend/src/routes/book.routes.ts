import type { FastifyInstance } from "fastify";

import {
  listBooksController,
  getBookController,
} from "../controllers/book.controller.js";

export async function registerBookRoutes(
  app: FastifyInstance
) {
  app.get(
    "/api/books",
    listBooksController
  );

  app.get(
    "/api/books/:bookId",
    getBookController
  );
}