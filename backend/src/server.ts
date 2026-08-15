import Fastify from "fastify";
import { registerAudioRoutes } from "./routes/audio.routes.js";
import { registerChapterRoutes } from "./routes/chapter.routes.js";

const app = Fastify({
  logger: true,
});

registerAudioRoutes(app);
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