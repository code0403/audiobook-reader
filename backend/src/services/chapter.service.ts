import { readFile } from "node:fs/promises";
import {
  loadReaderChapter,
  type ReaderChapter,
} from "../reader.js";

import {
  getBookChapters,
} from "../registry/chapter-registry.js";

export async function getChapter(
  bookId: string,
  chapterNumber: number
): Promise<ReaderChapter> {
  return loadReaderChapter(
    bookId,
    chapterNumber
  );
}

export async function listChapters(
  bookId: string
) {
  const chapters =
    await getBookChapters(bookId);

  return chapters.map((chapter) => ({
    number: chapter.number,
    title: chapter.title,
    hasAudio: chapter.audio !== null,
  }));
}


export async function getChapterAlignment(
  chapterNumber: number
) {
  const alignmentFile =
    `../data/alignment/chapter-${chapterNumber}/aligned.json`;

  const alignmentJson =
    await readFile(alignmentFile, "utf-8");

  return JSON.parse(alignmentJson);
}
