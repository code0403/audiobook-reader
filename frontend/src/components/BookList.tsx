import { useEffect, useState } from "react";
import { getBooks, type Book } from "../api/books";

interface BookListProps {
  onSelectBook: (book: Book) => void;
}

function BookList({ onSelectBook }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load books"
        );
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  if (loading) {
    return <p>Loading books...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section>
      <h2>Books</h2>

      {books.map((book) => (
        <article key={book.id}>
          <button
            type="button"
            onClick={() => onSelectBook(book)}
          >
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </button>
        </article>
      ))}
    </section>
  );
}

export default BookList;