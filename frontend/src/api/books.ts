const API_BASE_URL = "http://localhost:3000";

export interface Book {
  id: string;
  title: string;
  author: string;
}

export async function getBooks(): Promise<Book[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/books`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch books: ${response.status}`
    );
  }

  return response.json();
}

export async function getBook(
  bookId: string
): Promise<Book> {
  const response = await fetch(
    `${API_BASE_URL}/api/books/${bookId}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch book: ${response.status}`
    );
  }

  return response.json();
}