import type { AudioChapter } from "./audiobook.js";
import type { EpubChapter } from "./epub.js";

export interface CombinedChapter {
  number: number;
  title: string;

  epub: {
    href: EpubChapter["href"];
  };

  audio: {
    part: number;
    audioFile: string;
    startTime: AudioChapter["startTime"];
    endTime: AudioChapter["endTime"];
  } | null;
}

export type CombinedChapters = CombinedChapter[];