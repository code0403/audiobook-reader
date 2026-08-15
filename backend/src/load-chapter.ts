import { readFile } from "node:fs/promises";

import type { CombinedChapters } from "./chapters.js";
import { getEpubChapterContent } from "./epub-content.js";
import {
  parseEpubChapter,
  type ParsedEpubChapter,
} from "./parse-epub-chapter.js";

const epubFile =
  "/home/abhishek_s/projects/audiobook-reader/data/books/01-The-Eye-of-the-World-by-Robert-Jordan.epub";

const chaptersFile = "../data/chapters.json";

export async function loadChapter(
  chapterNumber: number
): Promise<ParsedEpubChapter> {
  const chaptersJson = await readFile(chaptersFile, "utf-8");

  const chapters: CombinedChapters =
    JSON.parse(chaptersJson);

  const chapter = chapters.find(
    (chapter) => chapter.number === chapterNumber
  );

  if (!chapter) {
    throw new Error(
      `Chapter ${chapterNumber} not found`
    );
  }

  const html = await getEpubChapterContent(
    epubFile,
    chapter.epub.href
  );

  return parseEpubChapter(html);
}