import { useEffect, useRef, useState } from "react";

import { AudioPlayer as AudioPlayerEngine } from "../audio/AudioPlayer";
import type { Chapter } from "../api/chapters";
import { getAudioUrl } from "../api/audio";

interface AudioPlayerProps {
  bookId: string;
  chapter: Chapter;
  onTimeUpdate?: (currentTime: number) => void;
}

function AudioPlayer({ bookId, chapter, onTimeUpdate }: AudioPlayerProps) {
  const playerRef = useRef<AudioPlayerEngine | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!chapter.audio) {
      return;
    }

    const player = new AudioPlayerEngine();

    const audioUrl = getAudioUrl(bookId, chapter.audio.part);

    player.loadChapter({
      audioUrl,
      startTime: chapter.audio.startTime,
      endTime: chapter.audio.endTime,
    });

    playerRef.current = player;

    const unsubscribeTimeUpdate = player.onTimeUpdate((time) => {
      // console.log("AudioPlayer time:", time);
      setCurrentTime(time);
      onTimeUpdate?.(time);
    });

    const unsubscribeEnded = player.onEnded(() => {
      setIsPlaying(false);
    });

    return () => {
      unsubscribeTimeUpdate();
      unsubscribeEnded();

      player.pause();
    };
  }, [bookId, chapter]);

  if (!chapter.audio) {
    return <p>No audio available for this chapter.</p>;
  }

  const chapterDuration = chapter.audio.endTime - chapter.audio.startTime;

  async function handlePlay() {
    if (!playerRef.current) {
      return;
    }

    try {
      await playerRef.current.play();

      setIsPlaying(true);
    } catch (error) {
      console.error("Audio playback failed:", error);

      setIsPlaying(false);
    }
  }

  function handlePause() {
    playerRef.current?.pause();

    setIsPlaying(false);
  }

  function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
    const time = Number(event.target.value);

    playerRef.current?.seek(time);

    setCurrentTime(time);
  }

  return (
    <section className="audio-player">
      <div className="section-header">
        <h2>Audiobook</h2>
      </div>

      <div className="audio-info">
        <h3>{chapter.title}</h3>
      </div>

      <input
        type="range"
        min={0}
        max={chapterDuration}
        step={0.1}
        value={Math.min(currentTime, chapterDuration)}
        onChange={handleSeek}
        aria-label="Audio progress"
      />

      <div className="time">
        <span>{formatTime(currentTime)}</span>

        <span>{formatTime(chapterDuration)}</span>
      </div>

      <div className="playback-controls">
        <button
          type="button"
          onClick={() => playerRef.current?.seek(Math.max(0, currentTime - 10))}
          aria-label="Skip backward 10 seconds"
        >
          ↶
        </button>

        <button
          type="button"
          className="play-button"
          onClick={isPlaying ? handlePause : handlePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          type="button"
          onClick={() =>
            playerRef.current?.seek(Math.min(chapterDuration, currentTime + 10))
          }
          aria-label="Skip forward 10 seconds"
        >
          ↷
        </button>
      </div>
    </section>
  );
}

function formatTime(time: number) {
  if (!Number.isFinite(time)) {
    return "00:00";
  }

  const minutes = Math.floor(time / 60);

  const seconds = Math.floor(time % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

export default AudioPlayer;
