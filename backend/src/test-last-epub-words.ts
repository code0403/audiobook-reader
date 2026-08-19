import { loadChapter } from "./load-chapter.js";

const chapter = await loadChapter(53);

const words = chapter.paragraphs.flatMap(
  (paragraph) =>
    paragraph.text.match(/\S+/g)?.map((text) => ({
      paragraphId: paragraph.id,
      text,
    })) ?? [],
);

console.log("Total EPUB words:", words.length);
console.log("\nLAST 100 EPUB WORDS:\n");

words.slice(-100).forEach((word, index) => {
  console.log(`${index + 1}. ${word.text}`);
});

