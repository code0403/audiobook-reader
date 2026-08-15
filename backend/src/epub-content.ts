import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function getEpubChapterContent(
  epubFile: string,
  href: string
): Promise<string> {
  const { stdout } = await execFileAsync("unzip", [
    "-p",
    epubFile,
    `OEBPS/${href}`,
  ]);

  return stdout;
}