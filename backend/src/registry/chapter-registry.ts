import { readFile } from "node:fs/promises";

import type { CombinedChapter } from "../chapters.js";
import { getBook } from "./book-registry.js";

export async function getBookChapters(
  bookId: string
): Promise<CombinedChapter[]> {
  const book = getBook(bookId);

  if (!book) {
    throw new Error(`Book "${bookId}" not found`);
  }

  const chaptersJson = await readFile(
    book.chaptersFile,
    "utf-8"
  );

  return JSON.parse(chaptersJson);
}

export async function getBookChapter(
  bookId: string,
  chapterNumber: number
): Promise<CombinedChapter> {
  const chapters = await getBookChapters(bookId);

  const chapter = chapters.find(
    (chapter) => chapter.number === chapterNumber
  );

  if (!chapter) {
    throw new Error(
      `Chapter ${chapterNumber} not found in book "${bookId}"`
    );
  }

  return chapter;
}