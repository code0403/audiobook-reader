import { getChapterAudio } from "./audio-service.js";

async function main() {
  const audio = await getChapterAudio(27);

  console.log(JSON.stringify(audio, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});