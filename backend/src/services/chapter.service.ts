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