import type { AlignedWord } from "../api/alignment";

export function getActiveWord(
  words: AlignedWord[],
  currentTime: number
): AlignedWord | null {
  return (
    words.find(
      (word) =>
        currentTime >= word.start &&
        currentTime < word.end
    ) ?? null
  );
}