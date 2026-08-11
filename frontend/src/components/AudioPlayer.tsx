import PlaybackControls from "./PlaybackControls";

function AudioPlayer() {
  return (
    <section className="audio-player">
      <div className="section-header">
        <h2>Audiobook</h2>
        <span>Chapter 1</span>
      </div>

      <div className="audio-info">
        <h3>The Beginning</h3>
        <p>Unknown Author</p>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress" />
        </div>

        <div className="time">
          <span>00:00</span>
          <span>42:18</span>
        </div>
      </div>

      <PlaybackControls />

      <div className="playback-speed">
        Speed: <strong>1.0x</strong>
      </div>
    </section>
  );
}

export default AudioPlayer;