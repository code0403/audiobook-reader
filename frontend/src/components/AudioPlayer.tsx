import { useEffect, useRef, useState } from "react";

function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAudioFile(file);
    setIsPlaying(false);
  }

  useEffect(() => {
    if (!audioFile) {
      setAudioUrl(null);
      return;
    }

    const url = URL.createObjectURL(audioFile);

    setAudioUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioFile]);

  async function togglePlay() {
    if (!audioRef.current) {
      return;
    }

    if (audioRef.current.paused) {
      await audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
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


  function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
    const newTime = Number(event.target.value);

    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }

  function skipBackward() {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = Math.max(
      0,
      audioRef.current.currentTime - 10,
    );
  }

  function skipForward() {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = Math.min(
      audioRef.current.duration,
      audioRef.current.currentTime + 10,
    );
  }


  function handlePlaybackRateChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const rate = Number(event.target.value);

    if (!audioRef.current) {
      return;
    }

    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  }

  return (
    <section className="audio-player">
      <div className="section-header">
        <h2>Audiobook</h2>
      </div>

      <input type="file" accept="audio/*" onChange={handleFileSelect} />

      {audioFile && (
        <div className="audio-info">
          <h3>{audioFile.name}</h3>
        </div>
      )}

      {audioUrl && (
        <>
          <audio
            ref={audioRef}
            src={audioUrl}
            onLoadedMetadata={() => {
              if (audioRef.current) {
                setDuration(audioRef.current.duration);
              }
            }}
            onTimeUpdate={() => {
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
            }}
          />

          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            aria-label="Audio progress"
          />

          <div className="time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="playback-controls">
            <button
              type="button"
              aria-label="Skip backward 10 seconds"
              onClick={skipBackward}
            >
              ↶
            </button>

            <button
              type="button"
              className="play-button"
              aria-label={isPlaying ? "Pause" : "Play"}
              onClick={togglePlay}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            <button
              type="button"
              aria-label="Skip forward 10 seconds"
              onClick={skipForward}
            >
              ↷
            </button>
          </div>

          <div className="playback-speed">
            <label htmlFor="playback-speed">Speed:</label>

            <select
              id="playback-speed"
              value={playbackRate}
              onChange={handlePlaybackRateChange}
            >
              <option value="0.75">0.75x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="1.75">1.75x</option>
              <option value="2">2.0x</option>
            </select>
          </div>
        </>
      )}
    </section>
  );
}

export default AudioPlayer;
