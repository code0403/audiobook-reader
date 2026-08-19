import { readFile } from "node:fs/promises";

interface AlignedWord {
  paragraphId: string | null;
  text: string;
  start: number;
  end: number;
}

interface AlignmentOutput {
  chapter: number;
  score: number;
  words: AlignedWord[];
}

function getCurrentWord(
  words: AlignedWord[],
  currentTime: number,
): AlignedWord | null {
  for (const word of words) {
    if (currentTime >= word.start && currentTime < word.end) {
      return word;
    }
  }

  return null;
}

async function main() {
  const json = await readFile(
    "../data/alignment/chapter-53/aligned.json",
    "utf-8",
  );

  const alignment: AlignmentOutput = JSON.parse(json);

  console.log("Chapter:", alignment.chapter);
  console.log("Total words:", alignment.words.length);
  console.log("");

  const testTimes = [
    6.0,
    7.9,
    8.5,
    9.3,
    10.5,
    12.8,
    15.5,
    17.0,
  ];

  for (const time of testTimes) {
    const word = getCurrentWord(alignment.words, time);

    if (!word) {
      console.log(`${time.toFixed(2)}s -> no word`);
      continue;
    }

    console.log(
      `${time.toFixed(2)}s -> ${word.text} ` +
      `(${word.start.toFixed(2)} -> ${word.end.toFixed(2)}) ` +
      `[paragraph: ${word.paragraphId}]`,
    );
  }
}

main().catch(console.error);
