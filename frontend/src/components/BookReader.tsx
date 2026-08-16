import type { Chapter } from "../api/chapters";

interface BookReaderProps {
  chapter: Chapter;
  activeParagraphId: string | null;
}

function BookReader({ chapter, activeParagraphId }: BookReaderProps) {
  // console.log("BookReader activeParagraphId:", activeParagraphId);
  return (
    <section className="book-reader">
      <div className="section-header">
        <h2>Book</h2>
        <span>{chapter.title}</span>
      </div>

      <article className="book-content">
        {chapter.paragraphs.map((paragraph) => (
          <p
            key={paragraph.id}
            className={
              paragraph.id === activeParagraphId ? "active-paragraph" : ""
            }
          >
            {paragraph.text}
          </p>
        ))}
      </article>
    </section>
  );
}

export default BookReader;
