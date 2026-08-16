const API_BASE_URL = "http://localhost:3000";

export function getAudioUrl(
  bookId: string,
  partNumber: number,
) {
  return `${API_BASE_URL}/audio/${bookId}/part/${partNumber}`;
}