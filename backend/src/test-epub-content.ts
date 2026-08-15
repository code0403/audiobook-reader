import { getEpubChapterContent } from "./epub-content.js";

const epubFile =
  "/home/abhishek_s/projects/audiobook-reader/data/books/01-The-Eye-of-the-World-by-Robert-Jordan.epub";

async function main() {
  const html = await getEpubChapterContent(
    epubFile,
    "chap9_eyeworld_1429959819_epub_part9.html"
  );

  console.log(html);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});