import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type {
  AudioChapter,
  AudioPart,
  Audiobook,
} from "./audiobook.js";

const execFileAsync = promisify(execFile);

export async function extractChapters(
  filePath: string,
  startingChapterNumber: number
): Promise<AudioChapter[]> {
  const { stdout } = await execFileAsync("ffprobe", [
    "-v",
    "quiet",
    "-show_entries",
    "chapter=start_time,end_time:chapter_tags=title",
    "-of",
    "csv=p=0",
    filePath,
  ]);

  return stdout
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line, index) => {
      const [startTime, endTime, ...titleParts] = line.split(",");

      return {
        number: startingChapterNumber + index,
        startTime: Number(startTime),
        endTime: Number(endTime),
        title: titleParts.join(","),
      };
    });
}

export async function extractAudiobook(): Promise<Audiobook> {
  const part1File =
    "/mnt/e/Telegram Desktop/WoT 01 - The Eye of the World p1.2.m4b";

  const part2File =
    "/mnt/e/Telegram Desktop/WoT 01 - The Eye of the World p2.2.m4b";

  const chaptersPart1 = await extractChapters(part1File, 1);

  const chaptersPart2 = await extractChapters(
    part2File,
    chaptersPart1.length + 1
  );

  const part1: AudioPart = {
    part: 1,
    audioFile: part1File,
    chapters: chaptersPart1,
  };

  const part2: AudioPart = {
    part: 2,
    audioFile: part2File,
    chapters: chaptersPart2,
  };

  const audiobook: Audiobook = {
    id: "the-eye-of-the-world",
    title: "The Eye of the World",
    author: "Robert Jordan",
    parts: [part1, part2],
  };

  return audiobook;
}