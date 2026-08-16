import "./App.css";
import { useState } from "react";

import BookList from "./components/BookList";
import ChapterList from "./components/ChapterList";

import type { Book } from "./api/books";
import { getChapter, type Chapter, type ChapterSummary } from "./api/chapters";
import AudioPlayer from "./components/AudioPlayer";

import {
  getActiveParagraph,
  type SyncedParagraph,
} from "./sync/paragraph-sync";
import BookReader from "./components/BookReader";

function createTestTimings(
  paragraphs: Chapter["paragraphs"],
  duration: number,
): SyncedParagraph[] {
  const paragraphDuration = duration / paragraphs.length;

  return paragraphs.map((paragraph, index) => ({
    id: paragraph.id,
    text: paragraph.text,

    startTime: index * paragraphDuration,

    endTime: (index + 1) * paragraphDuration,
  }));
}

function App() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [selectedChapter, setSelectedChapter] = useState<ChapterSummary | null>(
    null,
  );

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [chapterError, setChapterError] = useState<string | null>(null);

  const [activeParagraphId, setActiveParagraphId] = useState<string | null>(
    null,
  );

  function handleSelectBook(book: Book) {
    setSelectedBook(book);
    setSelectedChapter(null);
  }

  async function handleSelectChapter(chapterSummary: ChapterSummary) {
    if (!selectedBook) {
      return;
    }

    setSelectedChapter(chapterSummary);
    setChapter(null);
    setChapterError(null);
    setActiveParagraphId(null);
    setChapterLoading(true);

    try {
      const data = await getChapter(selectedBook.id, chapterSummary.number);

      setChapter(data);
    } catch (error) {
      setChapterError(
        error instanceof Error ? error.message : "Failed to load chapter",
      );
    } finally {
      setChapterLoading(false);
    }
  }

  return (
    <main>
      {!selectedBook && <BookList onSelectBook={handleSelectBook} />}

      {selectedBook && (
        <>
          <h1>{selectedBook.title}</h1>
          <p>{selectedBook.author}</p>

          <ChapterList
            bookId={selectedBook.id}
            onSelectChapter={handleSelectChapter}
          />

          {selectedChapter && (
            <section>
              <h2>{selectedChapter.title}</h2>

              {chapterLoading && <p>Loading chapter...</p>}

              {chapterError && <p>Error: {chapterError}</p>}

              {chapter && (
                <>
                  <AudioPlayer
                    bookId={selectedBook.id}
                    chapter={chapter}
                    onTimeUpdate={(currentTime) => {
                      // console.log("App received time:", currentTime);

                      const duration = chapter.audio
                        ? chapter.audio.endTime - chapter.audio.startTime
                        : 0;

                      if (!duration) {
                        setActiveParagraphId(null);
                        return;
                      }

                      const syncedParagraphs = createTestTimings(
                        chapter.paragraphs,
                        duration,
                      );

                      const activeParagraph = getActiveParagraph(
                        syncedParagraphs,
                        currentTime,
                      );

                      // console.log(
                      //   "Active paragraph:", 
                      //   activeParagraph?.id, 
                      //   activeParagraph?.text.slice(0, 50),
                      // );

                      setActiveParagraphId(activeParagraph?.id ?? null);
                    }}
                  />

                  <BookReader chapter={chapter} activeParagraphId={activeParagraphId} />
                </>
              )}
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default App;
