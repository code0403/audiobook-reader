import {
  loadReaderChapter,
  type ReaderChapter,
} from "../reader.js";

export async function getChapter(
  bookId: string,
  chapterNumber: number
): Promise<ReaderChapter> {
  return loadReaderChapter(
    bookId,
    chapterNumber
  );
}