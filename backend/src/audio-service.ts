import { readFile } from "node:fs/promises";

import type { CombinedChapters } from "./chapters.js";

const chaptersFile = "../data/chapters.json";

export interface ChapterAudio {
  part: number;
  audioFile: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export async function getChapterAudio(
  chapterNumber: number
): Promise<ChapterAudio> {
  const chaptersJson = await readFile(
    chaptersFile,
    "utf-8"
  );

  const chapters: CombinedChapters =
    JSON.parse(chaptersJson);

  const chapter = chapters.find(
    (chapter) => chapter.number === chapterNumber
  );

  if (!chapter) {
    throw new Error(
      `Chapter ${chapterNumber} not found`
    );
  }

  if (!chapter.audio) {
    throw new Error(
      `No audio found for chapter ${chapterNumber}`
    );
  }

  const {
    part,
    audioFile,
    startTime,
    endTime,
  } = chapter.audio;

  return {
    part,
    audioFile,
    startTime,
    endTime,
    duration: endTime - startTime,
  };
}