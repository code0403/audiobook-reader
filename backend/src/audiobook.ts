export interface AudioChapter {
  number: number;
  startTime: number;
  endTime: number;
  title: string;
}

export interface AudioPart {
    part: number;
    audioFile: string;
    chapters: AudioChapter[];
}

export interface Audiobook {
    id: string;
    title: string;
    author: string;
    parts: AudioPart[];
}