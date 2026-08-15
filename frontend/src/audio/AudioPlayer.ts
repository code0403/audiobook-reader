export interface AudioChapter {
  audioUrl: string;
  startTime: number;
  endTime: number;
}

export class AudioPlayer {
  private audio: HTMLAudioElement;

  private chapterStart = 0;
  private chapterEnd = 0;

  constructor() {
    this.audio = new Audio();

    this.audio.addEventListener("timeupdate", () => {
      this.handleTimeUpdate();
    });
  }

  loadChapter(chapter: AudioChapter) {
    this.chapterStart = chapter.startTime;
    this.chapterEnd = chapter.endTime;

    this.audio.src = chapter.audioUrl;

    this.audio.currentTime = this.chapterStart;
  }

  async play() {
    await this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  seek(time: number) {
    this.audio.currentTime = time;
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration() {
    return this.chapterEnd - this.chapterStart;
  }

  private handleTimeUpdate() {
    if (
      this.chapterEnd > 0 &&
      this.audio.currentTime >= this.chapterEnd
    ) {
      this.audio.pause();

      this.audio.currentTime = this.chapterEnd;
    }
  }
}