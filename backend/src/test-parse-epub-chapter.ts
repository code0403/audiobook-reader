import { readFile } from "node:fs/promises";

import { getEpubChapterContent } from "./epub-content.js";
import { parseEpubChapter } from "./parse-epub-chapter.js";

const epubFile =
  "/home/abhishek_s/projects/audiobook-reader/data/books/01-The-Eye-of-the-World-by-Robert-Jordan.epub";

async function main() {
  const html = await getEpubChapterContent(
    epubFile,
    "chap61_eyeworld_1429959819_epub_part61.html"
  );

  const chapter = parseEpubChapter(html);

  console.log(JSON.stringify(chapter, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});