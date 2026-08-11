import { useEffect, useRef, useState } from "react";

function useAudioPlayer(audioFile: File | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (!audioFile) {
      setAudioUrl(null);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      return;
    }

    const url = URL.createObjectURL(audioFile);

    setAudioUrl(url);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioFile]);

  function handleLoadedMetadata() {
    if (!audioRef.current) {
      return;
    }

    setDuration(audioRef.current.duration);
  }

  function handleTimeUpdate() {
    if (!audioRef.current) {
      return;
    }

    setCurrentTime(audioRef.current.currentTime);
  }

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

  function handleSeek(newTime: number) {
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
      audioRef.current.currentTime - 10
    );
  }

  function skipForward() {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = Math.min(
      audioRef.current.duration,
      audioRef.current.currentTime + 10
    );
  }

  function changePlaybackRate(rate: number) {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  }

  function handleEnded() {
    setIsPlaying(false);
  }

  return {
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
  };
}

export default useAudioPlayer;