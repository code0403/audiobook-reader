import { extractEpubChapters } from "./extract-epub-chapters.js";
import { extractAudiobook } from "./extract-audio-chapters.js";
import { writeFile } from "node:fs/promises";
import type { CombinedChapters } from "./chapters.js";

function normalizeTitle(title: string): string {
  return (
    title
      // Decode the HTML entity used by the EPUB.
      .replace(/&#8217;/g, "'")

      // Normalize curly apostrophes to normal apostrophes.
      .replace(/[’‘]/g, "'")

      // Remove "Chapter 19 -" etc.
      .replace(/^chapter\s+\d+\s*[-–—:]?\s*/i, "")

      // Remove "Prologue -" if present.
      .replace(/^prologue\s*[-–—:]?\s*/i, "")

      // Remove EPUB chapter numbers like "19 ".
      .replace(/^\d+\s+/, "")

      .trim()
      .toLowerCase()
  );
}

async function main() {
  const epubFile =
    "/home/abhishek_s/projects/audiobook-reader/data/books/01-The-Eye-of-the-World-by-Robert-Jordan.epub";

  // 1. Extract EPUB chapters
  const epubChapters = await extractEpubChapters(epubFile);

  // 2. Extract audiobook chapters
  const audiobook = await extractAudiobook();

  // 3. Flatten both M4B parts into one chapter list
  const audioChapters = audiobook.parts.flatMap((part) =>
    part.chapters.map((chapter) => ({
      ...chapter,
      part: part.part,
      audioFile: part.audioFile,
    })),
  );

  // 4. Create lookup map based on normalized title
  const audioByTitle = new Map<string, (typeof audioChapters)[number]>();

  for (const chapter of audioChapters) {
    const key = normalizeTitle(chapter.title);

    if (audioByTitle.has(key)) {
      console.warn(`Duplicate audio title: "${chapter.title}"`);
    }

    audioByTitle.set(key, chapter);
  }

  // 5. Match every EPUB chapter with its audio chapter
  const combinedChapters: CombinedChapters = epubChapters.map((epubChapter) => {
    const key = normalizeTitle(epubChapter.title);

    const audioChapter = audioByTitle.get(key);

    if (!audioChapter) {
      console.warn(
        `No audio match for EPUB chapter ${epubChapter.number}: ${epubChapter.title}`,
      );

      return {
        number: epubChapter.number,
        title: epubChapter.title,

        epub: {
          href: epubChapter.href,
        },

        audio: null,
      };
    }

    return {
      number: epubChapter.number,
      title: epubChapter.title,

      epub: {
        href: epubChapter.href,
      },

      audio: {
        part: audioChapter.part,
        audioFile: audioChapter.audioFile,
        startTime: audioChapter.startTime,
        endTime: audioChapter.endTime,
      },
    };
  });

  //console.log(JSON.stringify(combinedChapters, null, 2));
  const outputFile = "../data/chapters.json";

  await writeFile(
    outputFile,
    JSON.stringify(combinedChapters, null, 2),
    "utf-8",
  );

  console.log(`Combined chapters written to ${outputFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
