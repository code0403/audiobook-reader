import { useEffect, useState } from "react";
import {
  getChapters,
  type ChapterSummary,
} from "../api/chapters";

interface ChapterListProps {
  bookId: string;
  onSelectChapter: (
    chapter: ChapterSummary
  ) => void;
}

function ChapterList({
  bookId,
  onSelectChapter,
}: ChapterListProps) {
  const [chapters, setChapters] = useState<
    ChapterSummary[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadChapters() {
      try {
        setLoading(true);
        setError(null);

        const data = await getChapters(bookId);

        setChapters(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load chapters"
        );
      } finally {
        setLoading(false);
      }
    }

    loadChapters();
  }, [bookId]);

  if (loading) {
    return <p>Loading chapters...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section>
      <h2>Chapters</h2>

      {chapters.map((chapter) => (
        <article key={chapter.number}>
          <button
            type="button"
            disabled={!chapter.hasAudio}
            onClick={() =>
              onSelectChapter(chapter)
            }
          >
            <strong>
              {chapter.number}
            </strong>{" "}
            {chapter.title}
          </button>
        </article>
      ))}
    </section>
  );
}

export default ChapterList;