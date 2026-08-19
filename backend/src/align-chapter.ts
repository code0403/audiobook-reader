import { readFile, writeFile } from "node:fs/promises";
import { loadChapter } from "./load-chapter.js";

interface WhisperWord {
  text: string;
  start: number;
  end: number;
}

interface WhisperOutput {
  words: WhisperWord[];
}

interface EpubWord {
  paragraphId: string | null;
  text: string;
}

interface AlignmentStep {
  epub: EpubWord[];
  whisper: WhisperWord[];
  cost: number;
}

interface Alignment {
  steps: AlignmentStep[];
  score: number;
}

interface AlignedWord {
  paragraphId: string | null;
  text: string;
  start: number;
  end: number;
}

function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/^[^a-z0-9']+|[^a-z0-9']+$/gi, "");
}

function isAlignableWord(word: string): boolean {
  return normalizeWord(word).length > 0;
}

/**
 * Compare two words.
 */
function wordMatches(epubWord: string, whisperWord: string): boolean {
  const a = normalizeWord(epubWord);
  const b = normalizeWord(whisperWord);

  if (a === b) {
    return true;
  }

  return false;
}

/**
 * Dynamic-programming sequence alignment.
 *
 * We allow:
 *
 * 1 EPUB word  <-> 1 Whisper word
 * 1 EPUB word  <-> 2 Whisper words
 * 2 EPUB words <-> 1 Whisper word
 *
 * This handles cases such as:
 *
 * EPUB:
 *   knee-deep
 *
 * Whisper:
 *   need deep
 */

function alignWords(epubWords: EpubWord[], whisperWords: WhisperWord[],): Alignment {
  const n = epubWords.length;
  const m = whisperWords.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(Infinity),
  );

  const previous: (
    | {
        i: number;
        j: number;
        epubCount: number;
        whisperCount: number;
        cost: number;
      }
    | undefined
  )[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(undefined));

  dp[0][0] = 0;

  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= m; j++) {
      if (dp[i][j] === Infinity) {
        continue;
      }

      // 1 EPUB <-> 1 Whisper
      if (i < n && j < m) {
        const match = wordMatches(epubWords[i].text, whisperWords[j].text);

        const cost = match ? 0 : 2;

        if (dp[i][j] + cost < dp[i + 1][j + 1]) {
          dp[i + 1][j + 1] = dp[i][j] + cost;

          previous[i + 1][j + 1] = {
            i,
            j,
            epubCount: 1,
            whisperCount: 1,
            cost,
          };
        }
      }

      // 1 EPUB <-> 2 Whisper
      if (i < n && j + 1 < m) {
        const combinedWhisper =
          normalizeWord(whisperWords[j].text) +
          normalizeWord(whisperWords[j + 1].text);

        const epub = normalizeWord(epubWords[i].text);

        const match =
          epub === combinedWhisper ||
          epub.replace(/-/g, "") === combinedWhisper;

        const cost = match ? 0 : 8;

        if (dp[i][j] + cost < dp[i + 1][j + 2]) {
          dp[i + 1][j + 2] = dp[i][j] + cost;

          previous[i + 1][j + 2] = {
            i,
            j,
            epubCount: 1,
            whisperCount: 2,
            cost,
          };
        }
      }

      // 2 EPUB <-> 1 Whisper
      if (i + 1 < n && j < m) {
        const combinedEpub =
          normalizeWord(epubWords[i].text) +
          normalizeWord(epubWords[i + 1].text);

        const whisper = normalizeWord(whisperWords[j].text);

        const match = combinedEpub === whisper;

        const cost = match ? 0 : 8;

        if (dp[i][j] + cost < dp[i + 2][j + 1]) {
          dp[i + 2][j + 1] = dp[i][j] + cost;

          previous[i + 2][j + 1] = {
            i,
            j,
            epubCount: 2,
            whisperCount: 1,
            cost,
          };
        }
      }

      // Skip EPUB word
      if (i < n) {
        const cost = 3;

        if (dp[i][j] + cost < dp[i + 1][j]) {
          dp[i + 1][j] = dp[i][j] + cost;

          previous[i + 1][j] = {
            i,
            j,
            epubCount: 1,
            whisperCount: 0,
            cost,
          };
        }
      }

      // Skip Whisper word
      if (j < m) {
        const cost = 3;

        if (dp[i][j] + cost < dp[i][j + 1]) {
          dp[i][j + 1] = dp[i][j] + cost;

          previous[i][j + 1] = {
            i,
            j,
            epubCount: 0,
            whisperCount: 1,
            cost,
          };
        }
      }
    }
  }

  /*
   * Reconstruct the optimal path.
   */

  const steps: AlignmentStep[] = [];

  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    const prev = previous[i][j];

    if (!prev) {
      throw new Error(`Could not reconstruct alignment at ${i}, ${j}`);
    }

    steps.unshift({
      epub: epubWords.slice(prev.i, prev.i + prev.epubCount),

      whisper: whisperWords.slice(prev.j, prev.j + prev.whisperCount),

      cost: prev.cost,
    });

    i = prev.i;
    j = prev.j;
  }

  return {
    steps,
    score: dp[n][m],
  };
}

function buildAlignedWords(
  alignment: Alignment,
): AlignedWord[] {
  const result: AlignedWord[] = [];

  for (const step of alignment.steps) {
    /*
     * No EPUB word.
     *
     * Whisper said something that doesn't exist
     * in the EPUB.
     */
    if (step.epub.length === 0) {
      continue;
    }

    /*
     * No Whisper word.
     *
     * EPUB contains something that Whisper didn't
     * recognize, so there is no timestamp.
     */
    if (step.whisper.length === 0) {
      continue;
    }

    /*
     * CASE 1
     *
     * One EPUB word -> one or more Whisper words
     *
     * Example:
     *
     * EPUB:
     *   knee-deep
     *
     * Whisper:
     *   knee
     *   deep
     *
     * Give the EPUB word the complete spoken range.
     */
    if (step.epub.length === 1) {
      const epubWord = step.epub[0];

      const start = step.whisper[0].start;
      const end =
        step.whisper[step.whisper.length - 1].end;

      result.push({
        paragraphId: epubWord.paragraphId,
        text: epubWord.text,
        start,
        end,
      });

      continue;
    }

    /*
     * CASE 2
     *
     * Multiple EPUB words -> multiple Whisper words
     *
     * Example:
     *
     * EPUB:
     *   Fal
     *   Dara,
     *
     * Whisper:
     *   Fal
     *   Dara
     *
     * Pair them by position.
     */
    if (step.epub.length === step.whisper.length) {
      for (let i = 0; i < step.epub.length; i++) {
        const epubWord = step.epub[i];
        const whisperWord = step.whisper[i];

        result.push({
          paragraphId: epubWord.paragraphId,
          text: epubWord.text,
          start: whisperWord.start,
          end: whisperWord.end,
        });
      }

      continue;
    }

    /*
     * CASE 3
     *
     * Multiple EPUB words -> one Whisper word.
     *
     * Example:
     *
     * EPUB:
     *   some
     *   word
     *
     * Whisper:
     *   someword
     *
     * We don't know exactly where the boundary
     * between the EPUB words occurs.
     *
     * For now, divide the Whisper time range
     * proportionally between the EPUB words.
     */
    if (step.whisper.length === 1) {
      const whisperWord = step.whisper[0];

      const totalDuration =
        whisperWord.end - whisperWord.start;

      const durationPerWord =
        totalDuration / step.epub.length;

      for (let i = 0; i < step.epub.length; i++) {
        const epubWord = step.epub[i];

        const start =
          whisperWord.start +
          durationPerWord * i;

        const end =
          whisperWord.start +
          durationPerWord * (i + 1);

        result.push({
          paragraphId: epubWord.paragraphId,
          text: epubWord.text,
          start,
          end,
        });
      }

      continue;
    }

    /*
     * CASE 4
     *
     * More EPUB words than Whisper words,
     * but more than one Whisper word.
     *
     * This is a less common situation.
     *
     * For now, divide the complete Whisper range
     * proportionally between the EPUB words.
     */
    const start = step.whisper[0].start;
    const end =
      step.whisper[step.whisper.length - 1].end;

    const duration = end - start;

    const durationPerWord =
      duration / step.epub.length;

    for (let i = 0; i < step.epub.length; i++) {
      const epubWord = step.epub[i];

      const wordStart =
        start + durationPerWord * i;

      const wordEnd =
        start + durationPerWord * (i + 1);

      result.push({
        paragraphId: epubWord.paragraphId,
        text: epubWord.text,
        start: wordStart,
        end: wordEnd,
      });
    }
  }

  return result;
}

async function main() {
  const whisperJson = await readFile(
    "../data/alignment/chapter-53/whisper.json",
    "utf-8",
  );

  const whisper: WhisperOutput = JSON.parse(whisperJson);

  const chapter = await loadChapter(53);

  const epubWords: EpubWord[] = chapter.paragraphs.flatMap(
  (paragraph) =>
    paragraph.text
      .match(/\S+/g)
      ?.filter(isAlignableWord)
      .map((text) => ({
        paragraphId: paragraph.id,
        text,
      })) ?? [],
);

  /*
   * For this first experiment we only
   * align the beginning of the EPUB.
   */
  // const testEpubWords = epubWords.slice(0, 120);
  const testEpubWords = epubWords;

  const EPUB_START_INDEX = 8;

  const testWhisperWords = whisper.words.slice(EPUB_START_INDEX);

  console.log("EPUB words:", epubWords.length);
  console.log("Whisper words:", whisper.words.length);

  const result = alignWords(testEpubWords, testWhisperWords);

  const alignedWords = buildAlignedWords(result);

  

console.log("");

console.log("ALIGNED WORDS");
console.log("=============");

console.log("Total aligned words:", alignedWords.length);

for (const word of alignedWords.slice(0, 30)) {
  console.log(
    `${word.start.toFixed(2)} -> ${word.end.toFixed(2)} | ` +
      `${word.text}`,
  );
}

  console.log("");
  console.log("MISMATCH REGIONS");
  console.log("=================");

  let mismatchCount = 0;

  for (let i = 0; i < result.steps.length; i++) {
    const step = result.steps[i];

    if (step.cost === 0) {
      continue;
    }

    mismatchCount++;

    const previous = result.steps[i - 1];
    const next = result.steps[i + 1];

    console.log("");
    console.log(`--- mismatch ${mismatchCount} ---`);

    if (previous) {
      console.log(
        "BEFORE:",
        previous.epub.map((w) => w.text).join(" "),
        "|",
        previous.whisper.map((w) => w.text).join(" "),
      );
    }

    console.log(
      "CURRENT:",
      step.epub.map((w) => w.text).join(" "),
      "|",
      step.whisper.map((w) => w.text).join(" "),
    );

    if (next) {
      console.log(
        "AFTER:",
        next.epub.map((w) => w.text).join(" "),
        "|",
        next.whisper.map((w) => w.text).join(" "),
      );
    }

    if (mismatchCount >= 30) {
      break;
    }
  }

  console.log(`Alignment score: ${result.score}`);

  console.log("");

  let matches = 0;
  let mismatches = 0;
  let epubOnly = 0;
  let whisperOnly = 0;

  for (const step of result.steps) {
    if (step.cost === 0) {
      matches++;
      continue;
    }

    if (step.epub.length > 0 && step.whisper.length === 0) {
      epubOnly += step.epub.length;
    } else if (step.epub.length === 0 && step.whisper.length > 0) {
      whisperOnly += step.whisper.length;
    } else {
      mismatches++;
    }
  }

  console.log("");
  console.log("ALIGNMENT SUMMARY");
  console.log("-----------------");
  console.log(`Exact matches:       ${matches}`);
  console.log(`Mismatched groups:   ${mismatches}`);
  console.log(`EPUB-only words:     ${epubOnly}`);
  console.log(`Whisper-only words:  ${whisperOnly}`);
  console.log(`Total EPUB words:    ${testEpubWords.length}`);
  console.log(`Total Whisper words: ${whisper.words.length}`);
  console.log(`Alignment score:     ${result.score}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
