import path from "node:path";

export interface BookConfig {
  id: string;
  title: string;
  author: string;

  epubFile: string;
  chaptersFile: string;

  audioParts: {
    part: number;
    filePath: string;
    mimeType: string;
  }[];
}

const dataDirectory = path.resolve(
  process.cwd(),
  "../data"
);

const books: BookConfig[] = [
  {
    id: "the-eye-of-the-world",
    title: "The Eye of the World",
    author: "Robert Jordan",

    epubFile: path.join(
      dataDirectory,
      "books",
      "01-The-Eye-of-the-World-by-Robert-Jordan.epub",
    ),

    chaptersFile: path.join(dataDirectory, "chapters.json"),

    audioParts: [
      {
        part: 1,
        filePath:
          "/mnt/e/Telegram Desktop/WoT 01 - The Eye of the World p1.2.m4b",
        mimeType: "audio/mp4",
      },
      {
        part: 2,
        filePath:
          "/mnt/e/Telegram Desktop/WoT 01 - The Eye of the World p2.2.m4b",
        mimeType: "audio/mp4",
      },
    ],
  },
];

export function getBook(
  bookId: string
): BookConfig | undefined {
  return books.find(
    (book) => book.id === bookId
  );
}

export function getBooks(): BookConfig[] {
  return books;
}