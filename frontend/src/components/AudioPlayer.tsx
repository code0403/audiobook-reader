import { useState } from "react";
import useAudioPlayer from "../hooks/useAudioPlayer";

function AudioPlayer() {
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const {
    audioRef,
    audioUrl,
    isPlaying,
    currentTime,
    duration,
    playbackRate,

    togglePlay,
    handleSeek,
    skipBackward,
    skipForward,
    changePlaybackRate,

    handleLoadedMetadata,
    handleTimeUpdate,
    handleEnded,
  } = useAudioPlayer(audioFile);

  function handleFileSelect(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAudioFile(file);
  }

  function formatTime(time: number) {
    if (!Number.isFinite(time)) {
      return "00:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  return (
    <section className="audio-player">
      <div className="section-header">
        <h2>Audiobook</h2>
      </div>

      <input
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
      />

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
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          />

          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={(event) =>
              handleSeek(Number(event.target.value))
            }
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
            <label htmlFor="playback-speed">
              Speed:
            </label>

            <select
              id="playback-speed"
              value={playbackRate}
              onChange={(event) =>
                changePlaybackRate(Number(event.target.value))
              }
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