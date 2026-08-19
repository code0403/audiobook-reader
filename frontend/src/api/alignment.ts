export interface AlignedWord {
  paragraphId: string | null;
  text: string;
  start: number;
  end: number;
}

export interface ChapterAlignment {
  chapter: number;
  score: number;
  words: AlignedWord[];
}

export async function getChapterAlignment(
  bookId: string,
  chapterNumber: number,
): Promise<ChapterAlignment> {
  const response = await fetch(
    `http://localhost:3000/api/books/${bookId}/chapters/${chapterNumber}/alignment`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load alignment: ${response.status}`,
    );
  }

  return response.json();
}