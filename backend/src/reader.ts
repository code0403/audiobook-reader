import { readFile } from "node:fs/promises";

import type { CombinedChapters } from "./chapters.js";
import { getEpubChapterContent } from "./epub-content.js";
import {
  parseEpubChapter,
  type EpubParagraph,
} from "./parse-epub-chapter.js";

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

const epubFile =
  "/home/abhishek_s/projects/audiobook-reader/data/books/01-The-Eye-of-the-World-by-Robert-Jordan.epub";

const chaptersFile = "../data/chapters.json";

export async function loadReaderChapter(
  chapterNumber: number
): Promise<ReaderChapter> {
  const chaptersJson = await readFile(chaptersFile, "utf-8");

  const chapters: CombinedChapters =
    JSON.parse(chaptersJson);

  const chapter = chapters.find(
    (chapter) => chapter.number === chapterNumber
  );

  if (!chapter) {
    throw new Error(`Chapter ${chapterNumber} not found`);
  }

  const html = await getEpubChapterContent(
    epubFile,
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