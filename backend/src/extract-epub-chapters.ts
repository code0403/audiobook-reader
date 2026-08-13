import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { EpubChapter } from "./epub.js";

const execFileAsync = promisify(execFile);

export async function extractEpubChapters(
  filePath: string
): Promise<EpubChapter[]> {
  const { stdout } = await execFileAsync("unzip", [
    "-p",
    filePath,
    "OEBPS/toc.ncx",
  ]);

  const toc = stdout;

  const chapters: EpubChapter[] = [];

  const navPointRegex =
    /<navPoint[\s\S]*?<navLabel>\s*<text>(.*?)<\/text>[\s\S]*?<content src="(.*?)"/g;

  let match;
  let number = 1;

  while ((match = navPointRegex.exec(toc)) !== null) {
    const title = match[1].trim();
    const href = match[2].trim();

    // Include the Prologue.
    if (/^PROLOGUE\b/i.test(title)) {
      chapters.push({
        number: 0,
        title,
        href,
      });

      continue;
    }

    // Only include actual numbered chapters.
    if (!/^\d+\s/.test(title)) {
      continue;
    }

    chapters.push({
      number,
      title,
      href,
    });

    number++;
  }

  return chapters;
}