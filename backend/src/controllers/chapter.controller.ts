import type {
  FastifyRequest,
  FastifyReply,
} from "fastify";

import {
  getChapter,
  listChapters,
  getChapterAlignment,
} from "../services/chapter.service.js";

export async function listChaptersController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { bookId } =
    request.params as {
      bookId: string;
    };

  try {
    const chapters =
      await listChapters(bookId);

    return reply.send(chapters);
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

export async function getChapterController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const {
    bookId,
    chapterNumber,
  } =
    request.params as {
      bookId: string;
      chapterNumber: string;
    };

  const number =
    Number(chapterNumber);

  if (
    !Number.isInteger(number) ||
    number < 0
  ) {
    return reply
      .code(400)
      .send({
        error: "Invalid chapter number",
      });
  }

  try {
    const chapter =
      await getChapter(
        bookId,
        number
      );

    return reply.send(chapter);
  } catch (error) {
    return reply
      .code(404)
      .send({
        error:
          error instanceof Error
            ? error.message
            : "Chapter not found",
      });
  }
}


export async function getChapterAlignmentController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const {
    bookId,
    chapterNumber,
  } =
    request.params as {
      bookId: string;
      chapterNumber: string;
    };

  const number =
    Number(chapterNumber);

  if (
    !Number.isInteger(number) ||
    number < 0
  ) {
    return reply
      .code(400)
      .send({
        error: "Invalid chapter number",
      });
  }

  try {
    const alignment =
      await getChapterAlignment(number);

    return reply.send(alignment);
  } catch (error) {
    return reply
      .code(404)
      .send({
        error:
          error instanceof Error
            ? error.message
            : "Alignment not found",
      });
  }
}
