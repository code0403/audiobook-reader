import { readFile } from "node:fs/promises";

interface WhisperWord {
  text: string;
  start: number;
  end: number;
}

interface WhisperOutput {
  words: WhisperWord[];
}

const data = await readFile(
  "../data/alignment/chapter-53/whisper.json",
  "utf8",
);

const whisper: WhisperOutput = JSON.parse(data);

console.log("Total Whisper words:", whisper.words.length);
console.log("\nLAST 100 WHISPER WORDS:\n");

whisper.words.slice(-100).forEach((word, index) => {
  console.log(
    `${index + 1}. ${word.text} ` +
      `(${word.start.toFixed(2)} -> ${word.end.toFixed(2)})`,
  );
});
