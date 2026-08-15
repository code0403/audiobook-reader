export interface AudioFile {
  part: number;
  filePath: string;
  mimeType: string;
}

export interface BookAudio {
  bookId: string;
  parts: AudioFile[];
}

export const audiobookRegistry: BookAudio[] = [
  {
    bookId: "the-eye-of-the-world",
    parts: [
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


export function getAudioFile(
  bookId: string,
  partNumber: number
): AudioFile | undefined {
  const book = audiobookRegistry.find(
    (book) => book.bookId === bookId
  );

  if (!book) {
    return undefined;
  }

  return book.parts.find(
    (part) => part.part === partNumber
  );
}