import { loadReaderChapter } from "./reader.js";

async function main() {
  const chapter = await loadReaderChapter(53);

  console.log(
    JSON.stringify(chapter, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});