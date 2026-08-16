export interface SyncedParagraph {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}

export function getActiveParagraph(
  paragraphs: SyncedParagraph[],
  currentTime: number
): SyncedParagraph | null {
  return (
    paragraphs.find(
      (paragraph) =>
        currentTime >= paragraph.startTime &&
        currentTime < paragraph.endTime
    ) ?? null
  );
}