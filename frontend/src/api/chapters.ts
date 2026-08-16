const API_BASE_URL = "http://localhost:3000";

export interface ChapterSummary {
  number: number;
  title: string;
  hasAudio: boolean;
}

export interface ChapterParagraph {
  id: string;
  text: string;
}

export interface ChapterAudio {
  part: number;
  audioFile: string;
  startTime: number;
  endTime: number;
}

export interface Chapter {
  number: number;
  title: string;
  paragraphs: ChapterParagraph[];
  audio: ChapterAudio | null;
}

export async function getChapters(
  bookId: string
): Promise<ChapterSummary[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/books/${bookId}/chapters`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch chapters: ${response.status}`
    );
  }

  return response.json();
}

export async function getChapter(
  bookId: string,
  chapterNumber: number
): Promise<Chapter> {
  const response = await fetch(
    `${API_BASE_URL}/api/books/${bookId}/chapters/${chapterNumber}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch chapter: ${response.status}`
    );
  }

  return response.json();
}