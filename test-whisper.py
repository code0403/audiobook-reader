from faster_whisper import WhisperModel
import json

AUDIO_FILE = "data/alignment/chapter-53/chapter-53.wav"
OUTPUT_FILE = "data/alignment/chapter-53/whisper-60s.json"

model = WhisperModel(
    "tiny",
    device="cpu",
    compute_type="int8",
)

segments, info = model.transcribe(
    AUDIO_FILE,
    beam_size=1,
    word_timestamps=True,
    language="en",
    vad_filter=True,
    clip_timestamps="0,60",
)

words = []

for segment in segments:
    if segment.words:
        for word in segment.words:
            words.append({
                "text": word.word.strip(),
                "start": word.start,
                "end": word.end,
            })

output = {
    "language": info.language,
    "language_probability": info.language_probability,
    "words": words,
}

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"Wrote {len(words)} words to {OUTPUT_FILE}")