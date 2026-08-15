import {
  getBook,
  getBooks,
  type BookConfig,
} from "../registry/book-registry.js";

export function findBook(
  bookId: string
): BookConfig {
  const book = getBook(bookId);

  if (!book) {
    throw new Error(
      `Book "${bookId}" not found`
    );
  }

  return book;
}

export function listBooks(): BookConfig[] {
  return getBooks();
}