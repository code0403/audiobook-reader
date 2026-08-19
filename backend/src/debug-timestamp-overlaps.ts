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

async function main() {
  const data = await readFile(
    "../data/alignment/chapter-53/aligned.json",
    "utf-8",
  );

  const alignment: AlignmentOutput = JSON.parse(data);

  let count = 0;

  for (let i = 1; i < alignment.words.length; i++) {
    const previous = alignment.words[i - 1];
    const current = alignment.words[i];

    if (current.start < previous.end) {
      count++;

      console.log("");
      console.log(`--- OVERLAP ${count} ---`);

      console.log(
        `PREVIOUS: ${previous.start.toFixed(2)} -> ${previous.end.toFixed(2)} | ${previous.text}`,
      );

      console.log(
        `CURRENT : ${current.start.toFixed(2)} -> ${current.end.toFixed(2)} | ${current.text}`,
      );

      console.log(
        `OVERLAP : ${(previous.end - current.start).toFixed(2)} seconds`,
      );

      if (count >= 30) {
        break;
      }
    }
  }

  console.log("");
  console.log(`Total overlaps found: ${count}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
