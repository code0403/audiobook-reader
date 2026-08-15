import { readFile } from "node:fs/promises";

import type { CombinedChapters } from "./chapters.js";
import { getEpubChapterContent } from "./epub-content.js";
import {
  parseEpubChapter,
  type EpubParagraph,
} from "./parse-epub-chapter.js";

import { findBook } from "./services/book.service.js";

export interface ReaderChapter {
  number: number;
  title: string;
  paragraphs: EpubParagraph[];

  audio: {
    part: number;
    url: string;
    startTime: number;
    endTime: number;
  } | null;
}

// const chaptersFile = "../data/chapters.json";

export async function loadReaderChapter(
  bookId: string,
  chapterNumber: number
): Promise<ReaderChapter> {

  // 1. Find the requested book
  const book = findBook(bookId);

  // 2. Load the combined chapter metadata
  const chaptersJson = await readFile(
    book.chaptersFile,
    "utf-8"
  );

  const chapters: CombinedChapters =
    JSON.parse(chaptersJson);

  // 3. Find the requested chapter
  const chapter = chapters.find(
    (chapter) =>
      chapter.number === chapterNumber
  );

  if (!chapter) {
    throw new Error(
      `Chapter ${chapterNumber} not found`
    );
  }

  // 4. Read the EPUB chapter from the book
  const html =
    await getEpubChapterContent(
      book.epubFile,
      chapter.epub.href
    );

  const content =
    parseEpubChapter(html);

  // 5. Build the frontend-safe audio response
  return {
    number: chapter.number,
    title: content.title,
    paragraphs: content.paragraphs,

    audio: chapter.audio
      ? {
          part: chapter.audio.part,

          url:
            `/audio/${book.id}/part/` +
            `${chapter.audio.part}`,

          startTime:
            chapter.audio.startTime,

          endTime:
            chapter.audio.endTime,
        }
      : null,
  };
}