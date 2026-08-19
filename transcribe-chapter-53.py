from faster_whisper import WhisperModel

AUDIO = "data/alignment/chapter-53/chapter-53.wav"

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8",
)

segments, info = model.transcribe(
    AUDIO,
    language="en",
    word_timestamps=True,
)

print("Language:", info.language)
print("Probability:", info.language_probability)

words = []

for segment in segments:
    for word in segment.words:
        words.append({
            "text": word.word.strip(),
            "start": word.start,
            "end": word.end,
        })

print("Total words:", len(words))

with open(
    "data/alignment/chapter-53/whisper.json",
    "w",
    encoding="utf-8",
) as f:
    import json
    json.dump(
        {
            "language": info.language,
            "language_probability": info.language_probability,
            "words": words,
        },
        f,
        indent=2,
        ensure_ascii=False,
    )

print("Saved whisper.json")
