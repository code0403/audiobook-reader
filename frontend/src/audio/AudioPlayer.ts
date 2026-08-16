export interface AudioChapter {
  audioUrl: string;
  startTime: number;
  endTime: number;
}

export type AudioPlayerTimeUpdateListener = (currentTime: number) => void;

export type AudioPlayerEndedListener = () => void;

export class AudioPlayer {
  private audio: HTMLAudioElement;

  private chapterStart = 0;
  private chapterEnd = 0;

  private timeUpdateListeners: AudioPlayerTimeUpdateListener[] = [];

  private endedListeners: AudioPlayerEndedListener[] = [];

  constructor() {
    this.audio = new Audio();

    this.audio.addEventListener("timeupdate", () => {
      this.handleTimeUpdate();
    });

    this.audio.addEventListener("ended", () => {
      this.handleEnded();
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
    const absoluteTime = this.chapterStart + time;

    this.audio.currentTime = Math.min(absoluteTime, this.chapterEnd);
  }

  getCurrentTime() {
    return Math.max(0, this.audio.currentTime - this.chapterStart);
  }

  getDuration() {
    return this.chapterEnd - this.chapterStart;
  }

  onTimeUpdate(listener: AudioPlayerTimeUpdateListener) {
    this.timeUpdateListeners.push(listener);

    return () => {
      this.timeUpdateListeners = this.timeUpdateListeners.filter(
        (item) => item !== listener,
      );
    };
  }

  onEnded(listener: AudioPlayerEndedListener) {
    this.endedListeners.push(listener);

    return () => {
      this.endedListeners = this.endedListeners.filter(
        (item) => item !== listener,
      );
    };
  }

  private handleTimeUpdate() {
    if (this.chapterEnd > 0 && this.audio.currentTime >= this.chapterEnd) {
      this.audio.pause();

      this.audio.currentTime = this.chapterEnd;
    }

    const currentTime = this.getCurrentTime();

    for (const listener of this.timeUpdateListeners) {
      listener(currentTime);
    }
  }

  private handleEnded() {
    for (const listener of this.endedListeners) {
      listener();
    }
  }
}
