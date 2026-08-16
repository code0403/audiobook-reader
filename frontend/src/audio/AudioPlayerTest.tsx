import { useEffect, useRef, useState } from "react";
import { AudioPlayer } from "./AudioPlayer";
import type { Chapter } from "../api/chapters";
import { getAudioUrl } from "../api/audio";

interface AudioPlayerTestProps {
  bookId: string;
  chapter: Chapter;
}

export default function AudioPlayerTest({
  bookId,
  chapter,
}: AudioPlayerTestProps) {
  const playerRef = useRef<AudioPlayer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!chapter.audio) {
      return;
    }

    const player = new AudioPlayer();

    const audioUrl = getAudioUrl(bookId, chapter.audio.part);

    player.loadChapter({
      audioUrl,
      startTime: chapter.audio.startTime,
      endTime: chapter.audio.endTime,
    });

    playerRef.current = player;

    const unsubscribeTimeUpdate = player.onTimeUpdate((time) => {
      setCurrentTime(time);
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
    <div>
      <button onClick={isPlaying ? handlePause : handlePlay}>
        {isPlaying ? "Pause" : "Play"}
      </button>

      <div>{Math.floor(currentTime)}s</div>

      <input
        type="range"
        min={0}
        max={chapterDuration}
        step={0.1}
        value={Math.min(currentTime, chapterDuration)}
        onChange={handleSeek}
      />
    </div>
  );
}
