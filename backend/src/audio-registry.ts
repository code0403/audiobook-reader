import { getBook } from "./registry/book-registry.js";

export function getAudioFile(
  bookId: string,
  partNumber: number
) {
  const book = getBook(bookId);

  if (!book) {
    return undefined;
  }

  return book.audioParts.find(
    (part) => part.part === partNumber
  );
}