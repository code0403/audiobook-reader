import {
  getBook,
  getBooks,
} from "../registry/book-registry.js";

export function listBooks() {
  return getBooks().map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
  }));
}

export function getBookDetails(
  bookId: string
) {
  const book = getBook(bookId);

  if (!book) {
    throw new Error(
      `Book "${bookId}" not found`
    );
  }

  return {
    id: book.id,
    title: book.title,
    author: book.author,
  };
}