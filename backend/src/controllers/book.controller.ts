import type {
  FastifyRequest,
  FastifyReply,
} from "fastify";

import {
  listBooks,
  getBookDetails,
} from "../services/book.service.js";

export async function listBooksController(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send(listBooks());
}

export async function getBookController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { bookId } =
    request.params as {
      bookId: string;
    };

  try {
    const book =
      getBookDetails(bookId);

    return reply.send(book);
  } catch (error) {
    return reply
      .code(404)
      .send({
        error:
          error instanceof Error
            ? error.message
            : "Book not found",
      });
  }
}