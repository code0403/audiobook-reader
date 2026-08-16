import Fastify from "fastify";
import { registerAudioRoutes } from "./routes/audio.routes.js";
import { registerChapterRoutes } from "./routes/chapter.routes.js";
import { registerBookRoutes } from "./routes/book.routes.js";
import cors from "@fastify/cors";

const app = Fastify({
  logger: true,
});

await app.register(cors, {
  origin: "http://localhost:5173",
});

registerAudioRoutes(app);
registerBookRoutes(app);
registerChapterRoutes(app);


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