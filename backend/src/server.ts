import Fastify from "fastify";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { getAudioFile } from "./audio-registry.js";

const app = Fastify({
  logger: true,
});

const audioDirectory = path.resolve(
  process.cwd(),
  "../data/audios"
);

app.get("/audio/:filename", async (request, reply) => {
  const { filename } = request.params as {
    filename: string;
  };

  const filePath = path.join(
    audioDirectory,
    filename
  );

  try {
    const fileStats = await stat(filePath);
    const fileSize = fileStats.size;

    const range = request.headers.range;

    // No Range header
    if (!range) {
      reply
        .header("Content-Type", "audio/mpeg")
        .header("Content-Length", fileSize)
        .header("Accept-Ranges", "bytes");

      return reply.send(createReadStream(filePath));
    }

    // Example:
    // Range: bytes=1000-5000

    const match = range.match(/bytes=(\d+)-(\d*)/);

    if (!match) {
      return reply
        .code(416)
        .header("Content-Range", `bytes */${fileSize}`)
        .send();
    }

    const start = Number(match[1]);

    let end = match[2]
      ? Number(match[2])
      : fileSize - 1;

    // Prevent requesting beyond the file
    end = Math.min(end, fileSize - 1);

    if (start >= fileSize || start > end) {
      return reply
        .code(416)
        .header("Content-Range", `bytes */${fileSize}`)
        .send();
    }

    const chunkSize = end - start + 1;

    reply
      .code(206)
      .header("Content-Type", "audio/mpeg")
      .header("Accept-Ranges", "bytes")
      .header(
        "Content-Range",
        `bytes ${start}-${end}/${fileSize}`
      )
      .header("Content-Length", chunkSize);

    return reply.send(
      createReadStream(filePath, {
        start,
        end,
      })
    );
  } catch {
    return reply
      .code(404)
      .send({
        error: "Audio file not found",
      });
  }
});

app.get(
  "/audio/:bookId/part/:partNumber",
  async (request, reply) => {
    const { bookId, partNumber } = request.params as {
      bookId: string;
      partNumber: string;
    };

    const part = Number(partNumber);

    if (!Number.isInteger(part) || part < 1) {
      return reply
        .code(400)
        .send({
          error: "Invalid audio part",
        });
    }

    const audioFile = getAudioFile(bookId, part);

    if (!audioFile) {
      return reply
        .code(404)
        .send({
          error: "Audio file not found",
        });
    }

    const filePath = audioFile.filePath;

    try {
      const fileStats = await stat(filePath);
      const fileSize = fileStats.size;

      const range = request.headers.range;

      if (!range) {
        reply
          .header(
            "Content-Type",
            audioFile.mimeType
          )
          .header(
            "Content-Length",
            fileSize
          )
          .header(
            "Accept-Ranges",
            "bytes"
          );

        return reply.send(
          createReadStream(filePath)
        );
      }

      const match = range.match(
        /bytes=(\d+)-(\d*)/
      );

      if (!match) {
        return reply
          .code(416)
          .header(
            "Content-Range",
            `bytes */${fileSize}`
          )
          .send();
      }

      const start = Number(match[1]);

      let end = match[2]
        ? Number(match[2])
        : fileSize - 1;

      end = Math.min(
        end,
        fileSize - 1
      );

      if (
        start >= fileSize ||
        start > end
      ) {
        return reply
          .code(416)
          .header(
            "Content-Range",
            `bytes */${fileSize}`
          )
          .send();
      }

      const chunkSize =
        end - start + 1;

      reply
        .code(206)
        .header(
          "Content-Type",
          audioFile.mimeType
        )
        .header(
          "Accept-Ranges",
          "bytes"
        )
        .header(
          "Content-Range",
          `bytes ${start}-${end}/${fileSize}`
        )
        .header(
          "Content-Length",
          chunkSize
        );

      return reply.send(
        createReadStream(filePath, {
          start,
          end,
        })
      );
    } catch {
      return reply
        .code(404)
        .send({
          error: "Audio file not found",
        });
    }
  }
);

app.listen({
  port: 3000,
  host: "0.0.0.0",
}).then(() => {
  console.log(
    "Audio server running on http://localhost:3000"
  );
}).catch((error) => {
  app.log.error(error);
  process.exit(1);
});