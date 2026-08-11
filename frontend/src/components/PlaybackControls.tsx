function PlaybackControls() {
  return (
    <div className="playback-controls">
      <button type="button" aria-label="Skip backward">
        ↶
      </button>

      <button
        type="button"
        className="play-button"
        aria-label="Play"
      >
        ▶
      </button>

      <button type="button" aria-label="Skip forward">
        ↷
      </button>
    </div>
  );
}

export default PlaybackControls;