import type {
  FastifyRequest,
  FastifyReply,
} from "fastify";

import { getChapter } from "../services/chapter.service.js";

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