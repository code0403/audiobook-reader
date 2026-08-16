import type { EpubParagraph } from "./parse-epub-chapter.js";
import {
  getEpubChapterContent,
} from "./epub-content.js";
import {
  parseEpubChapter,
} from "./parse-epub-chapter.js";
import { getBook } from "./registry/book-registry.js";
import {
  getBookChapter,
} from "./registry/chapter-registry.js";

export interface ReaderChapter {
  number: number;
  title: string;
  paragraphs: EpubParagraph[];

  audio: {
    part: number;
    audioFile: string;
    startTime: number;
    endTime: number;
  } | null;
}

export async function loadReaderChapter(
  bookId: string,
  chapterNumber: number
): Promise<ReaderChapter> {
  const book = getBook(bookId);

  if (!book) {
    throw new Error(`Book "${bookId}" not found`);
  }

  const chapter = await getBookChapter(
    bookId,
    chapterNumber
  );

  const html = await getEpubChapterContent(
    book.epubFile,
    chapter.epub.href
  );

  const content = parseEpubChapter(html);

  return {
    number: chapter.number,
    title: content.title,
    paragraphs: content.paragraphs,
    audio: chapter.audio,
  };
}