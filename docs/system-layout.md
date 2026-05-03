# Fidel Labs V1 System Layout

## Product Shape

Fidel Labs v1 is a mobile-first learning app built around short lessons, repeatable exercises, and mastery tracking. The first version focuses on fidel and foundational Amharic reading rather than broad conversational fluency.

The app should feel like a serious learning tool with a playful loop: fast prompts, instant feedback, clear progress, and review that adapts to mistakes.

## Core Learner Loop

1. Learner opens the app and sees a path of lessons.
2. Learner starts the next unlocked lesson.
3. Lesson introduces a small set of fidel or words.
4. Learner completes mixed exercises.
5. App gives instant correctness feedback.
6. Mistakes are added to review.
7. Learner earns XP and mastery progress.
8. Review sessions pull weak items back into practice.

## V1 Scope

Included:

- Local lesson path.
- Fidel family lessons.
- Exercise runner.
- XP and lesson completion.
- Character-level mastery.
- Mistake review.
- Local progress storage.
- Basic audio support.

Deferred:

- Accounts.
- Social features.
- Leaderboards.
- AI conversation practice.
- Speech grading.
- Teacher dashboard.
- Web admin CMS.
- Paid subscriptions.

## App Screens

### Home Path

Purpose: show the learner where they are and what to do next.

Key UI:

- Current streak.
- XP total.
- Vertical lesson path.
- Locked, available, completed, and review nodes.
- Daily review button when weak items exist.

### Lesson Intro

Purpose: introduce a small concept before practice.

Key UI:

- Lesson title.
- Characters or words being taught.
- Tap-to-hear audio.
- Short examples.
- Start lesson button.

### Lesson Runner

Purpose: deliver one prompt at a time.

Exercise types for v1:

- `choose_fidel_from_sound`: play audio or show romanization, learner chooses fidel.
- `choose_sound_from_fidel`: show fidel, learner chooses sound.
- `match_pairs`: learner matches fidel to sound.
- `build_word`: learner taps fidel blocks in order to build a word.

Key UI:

- Progress bar.
- Prompt area.
- Answer choices.
- Audio replay button.
- Check/continue button.
- Correct and incorrect feedback states.

### Lesson Complete

Purpose: reward and summarize progress.

Key UI:

- XP earned.
- Accuracy.
- New mastery gains.
- Mistakes added to review.
- Continue button.

### Review

Purpose: practice weak characters and recently missed items.

Key UI:

- Mixed prompts from mistake history.
- Shorter session length than lessons.
- Mastery recovery feedback.

### Character Library

Purpose: browse and practice fidel outside the path.

Key UI:

- Fidel grid by family.
- Mastery indicator per character.
- Tap character for sound, romanization, examples.

## Lesson Path Structure

V1 should start with fidel recognition. The first path can be:

1. Welcome to fidel.
2. `ሀ` family.
3. `ለ` family.
4. `መ` family.
5. `ሰ` family.
6. Mixed review 1.
7. `ረ` family.
8. `ሸ` family.
9. `ቀ` family.
10. First words.

Each lesson teaches no more than 4 to 7 new symbols at once.

## Data Model

### Lesson

A lesson is a JSON file containing metadata, teaching items, exercises, and unlock rules.

Important fields:

- `id`
- `title`
- `unit`
- `order`
- `type`
- `teaches`
- `exercises`
- `passingScore`
- `xpReward`

### Learning Item

A learning item is anything the app tracks mastery for.

Types:

- `fidel`
- `word`
- `phrase`

V1 primarily uses `fidel`.

### Progress

Local progress should track:

- Completed lessons.
- Current lesson availability.
- XP total.
- Daily streak.
- Per-item mastery.
- Mistake history.
- Last review date.

Suggested local shape:

```ts
type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;

type ItemProgress = {
  itemId: string;
  itemType: "fidel" | "word" | "phrase";
  mastery: MasteryLevel;
  correctCount: number;
  incorrectCount: number;
  lastPracticedAt?: string;
  nextReviewAt?: string;
};
```

## Scoring

V1 scoring should be simple:

- Correct answer: +1 exercise point.
- Incorrect answer: no exercise point and item added to review.
- Lesson passes at `80%` accuracy by default.
- XP is awarded on completion, with a small bonus for high accuracy.

Suggested XP:

- Lesson complete: 10 XP.
- Perfect lesson: +5 XP.
- Review session complete: 5 XP.

## Mastery

Every fidel starts at mastery `0`.

Mastery changes:

- Correct in lesson: `+1`, up to `5`.
- Correct in review: `+1`, up to `5`.
- Incorrect: `-1`, minimum `0`.

Mastery meanings:

- `0`: new or unknown.
- `1`: seen once.
- `2`: fragile.
- `3`: familiar.
- `4`: strong.
- `5`: mastered.

## Review Scheduling

Use a simple Leitner-style review system for v1.

When an item is missed:

- Set mastery down by 1.
- Add it to review.
- Schedule next review soon.

Suggested intervals:

- Mastery 0: same session.
- Mastery 1: 1 day.
- Mastery 2: 2 days.
- Mastery 3: 4 days.
- Mastery 4: 7 days.
- Mastery 5: 14 days.

## Content Pipeline

V1 content should be file-based:

1. Lesson JSON files live in `content/lessons`.
2. App imports bundled JSON.
3. Audio paths point to `assets/audio`.
4. A schema validates lessons before release.

Later, the same JSON shape can move into Supabase or a CMS.

## Backend Boundary

No backend is required for the first playable v1. Keep the local app architecture ready for sync by isolating progress operations behind a small service.

Suggested services:

- `LessonService`: loads lesson content.
- `ProgressService`: reads/writes local progress.
- `ReviewService`: computes review queue.
- `AudioService`: resolves and plays clips.

When Supabase is added:

- Auth syncs user identity.
- Progress syncs across devices.
- Content can be fetched remotely.
- Leaderboards can use weekly XP totals.

## Success Metrics

V1 is working if:

- A beginner can complete the first 5 lessons without explanation.
- The learner can identify at least 20 fidel after one session.
- Mistakes reliably return in review.
- Adding a new lesson only requires adding JSON and audio.

