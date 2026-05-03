# Fidel Labs Content Model

## Design Goal

Lessons should be data-driven. The app should not need a code change every time a new fidel family, word, or exercise is added.

## Lesson File

A lesson file represents one playable lesson.

Required fields:

- `id`: stable machine-readable ID.
- `title`: display title.
- `unit`: path grouping.
- `order`: lesson order inside the unit.
- `type`: `intro`, `fidel`, `review`, or `word`.
- `teaches`: learning items introduced by this lesson.
- `exercises`: prompts shown during the lesson.
- `passingScore`: percentage required to pass.
- `xpReward`: base XP awarded on completion.

## Learning Items

### Fidel Item

```json
{
  "id": "fidel-ha-1",
  "type": "fidel",
  "fidel": "ሀ",
  "romanization": "ha",
  "family": "ha",
  "vowelOrder": 1,
  "audio": "assets/audio/fidel/ha-1.mp3"
}
```

### Word Item

```json
{
  "id": "word-selam",
  "type": "word",
  "amharic": "ሰላም",
  "romanization": "selam",
  "meaning": "hello / peace",
  "audio": "assets/audio/words/selam.mp3",
  "components": ["ሰ", "ላ", "ም"]
}
```

## Exercise Types

### choose_fidel_from_sound

The learner hears audio or sees romanization and chooses the matching fidel.

```json
{
  "id": "ex-ha-choose-fidel-1",
  "type": "choose_fidel_from_sound",
  "prompt": {
    "audio": "assets/audio/fidel/ha-1.mp3",
    "romanization": "ha"
  },
  "answer": "ሀ",
  "choices": ["ሀ", "ሁ", "ሂ", "ሃ"],
  "tracksItemId": "fidel-ha-1"
}
```

### choose_sound_from_fidel

The learner sees fidel and chooses the sound.

```json
{
  "id": "ex-ha-choose-sound-1",
  "type": "choose_sound_from_fidel",
  "prompt": {
    "fidel": "ሀ"
  },
  "answer": "ha",
  "choices": ["ha", "hu", "hi", "ho"],
  "tracksItemId": "fidel-ha-1"
}
```

### match_pairs

The learner matches fidel to romanized sounds.

```json
{
  "id": "ex-ha-match-1",
  "type": "match_pairs",
  "pairs": [
    { "left": "ሀ", "right": "ha", "tracksItemId": "fidel-ha-1" },
    { "left": "ሁ", "right": "hu", "tracksItemId": "fidel-ha-2" }
  ]
}
```

### build_word

The learner taps fidel blocks in order.

```json
{
  "id": "ex-build-selam",
  "type": "build_word",
  "prompt": {
    "meaning": "hello / peace",
    "audio": "assets/audio/words/selam.mp3"
  },
  "answer": ["ሰ", "ላ", "ም"],
  "choices": ["ሰ", "ለ", "ላ", "ም", "ሀ"],
  "tracksItemId": "word-selam"
}
```

## Validation Rules

- Exercise IDs must be unique within a lesson.
- Every `tracksItemId` must reference an item in `teaches` or prior lessons.
- Choices should include the correct answer.
- Lessons should not introduce more than 7 new fidel items.
- Audio can be optional during early prototyping but should use the final path structure.

