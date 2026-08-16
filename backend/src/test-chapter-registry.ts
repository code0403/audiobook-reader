import {
  getBookChapters,
  getBookChapter,
} from "./registry/chapter-registry.js";

async function main() {
  const chapters = await getBookChapters(
    "the-eye-of-the-world"
  );

  console.log("TOTAL CHAPTERS:");
  console.log(chapters.length);

  const chapter = await getBookChapter(
    "the-eye-of-the-world",
    53
  );

  console.log("\nCHAPTER 53:");
  console.log(JSON.stringify(chapter, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});