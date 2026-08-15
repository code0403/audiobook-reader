import { getAudioFile } from "./audio-registry.js";

const audio = getAudioFile(
  "the-eye-of-the-world",
  2
);

console.log(audio);