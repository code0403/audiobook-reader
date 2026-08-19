import { loadChapter } from "./load-chapter.js";

const chapter = await loadChapter(53);

const words = chapter.paragraphs.flatMap((paragraph) =>
  paragraph.text.match(/\S+/g)?.map((text) => ({
    paragraphId: paragraph.id,
    text,
  })) ?? [],
);

console.log(`Total EPUB words: ${words.length}`);

console.log(
  JSON.stringify(words.slice(0, 80), null, 2)
);