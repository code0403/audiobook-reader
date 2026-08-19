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
  const file = await readFile(
    "../data/alignment/chapter-53/aligned.json",
    "utf-8",
  );

  const alignment: AlignmentOutput = JSON.parse(file);

  console.log("CHAPTER:", alignment.chapter);
  console.log("SCORE:", alignment.score);
  console.log("TOTAL ALIGNED WORDS:", alignment.words.length);

  console.log("");
  console.log("FIRST 20 WORDS");
  console.log("================");

  for (const word of alignment.words.slice(0, 20)) {
    console.log(
      `${word.start.toFixed(2)} -> ${word.end.toFixed(2)} | ${word.text}`,
    );
  }

  console.log("");
  console.log("LAST 20 WORDS");
  console.log("===============");

  for (const word of alignment.words.slice(-20)) {
    console.log(
      `${word.start.toFixed(2)} -> ${word.end.toFixed(2)} | ${word.text}`,
    );
  }

  console.log("");
  console.log("TIMESTAMP VALIDATION");
  console.log("====================");

  let problems = 0;

  for (let i = 0; i < alignment.words.length; i++) {
    const current = alignment.words[i];

    if (current.start > current.end) {
      console.log(
        `INVALID: ${current.text} | start ${current.start} > end ${current.end}`,
      );

      problems++;
    }

    if (i > 0) {
      const previous = alignment.words[i - 1];

      if (current.start < previous.end) {
        console.log(
          `OVERLAP: ${previous.text} -> ${current.text}`,
        );

        problems++;
      }
    }
  }

  if (problems === 0) {
    console.log("No timestamp problems found.");
  } else {
    console.log(`Found ${problems} timestamp problems.`);
  }

  console.log("");
  console.log("AUDIO RANGE");
  console.log("===========");

  const first = alignment.words[0];
  const last = alignment.words[alignment.words.length - 1];

  console.log(
    `First word: ${first.start.toFixed(2)}s`,
  );

  console.log(
    `Last word ends: ${last.end.toFixed(2)}s`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
