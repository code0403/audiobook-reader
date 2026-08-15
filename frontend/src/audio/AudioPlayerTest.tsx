import { useEffect, useRef, useState } from "react";
import { AudioPlayer } from "./AudioPlayer";

export default function AudioPlayerTest() {
  const playerRef = useRef<AudioPlayer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const chapterDuration = 52437.028526 - 51218.00127;

  useEffect(() => {
    const player = new AudioPlayer();

    player.loadChapter({
      audioUrl: "http://localhost:3000/audio/the-eye-of-the-world/part/2",
      startTime: 51218.00127,
      endTime: 52437.028526,
    });

    playerRef.current = player;

    const interval = setInterval(() => {
      setCurrentTime(player.getCurrentTime());
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  async function handlePlay() {
    if (!playerRef.current) return;

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
        value={Math.min(currentTime, chapterDuration)}
        onChange={handleSeek}
      />
    </div>
  );
}
