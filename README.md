# Fidel Labs

Fidel Labs is a Duolingo-style learning app for Amharic, starting with fidel recognition and pronunciation before moving into words, phrases, listening, and reading.

The v1 goal is not to build every language-learning feature at once. The goal is to create a tight learning loop that helps beginners recognize fidel, connect each symbol to sound, build short words, and review weak items with spaced repetition.

## V1 Product Promise

By the end of v1, a learner should be able to:

- Recognize the core fidel families.
- Hear a syllable and choose the correct fidel.
- See a fidel and choose or type its sound.
- Build simple Amharic words from fidel blocks.
- Review weak characters through a simple mastery system.
- Track progress through a lesson path.

## Repo Layout

```text
fidel-labs/
  README.md
  docs/
    system-layout.md
    curriculum.md
    content-model.md
  content/
    schemas/
      lesson.schema.json
    lessons/
      fidel-ha-family.json
  assets/
    audio/
    images/
```

## Recommended App Stack

- Mobile app: Expo + React Native
- Language/runtime: TypeScript
- Navigation: Expo Router
- Local progress: SQLite or AsyncStorage for v1
- Backend later: Supabase for auth, cloud sync, leaderboards, and lesson publishing
- Audio: bundled clips first, remote CDN later
- Content: JSON lesson files first, admin/editor tool later

## Build Order

1. Create the Expo app shell.
2. Load lessons from local JSON.
3. Build the lesson path screen.
4. Build the lesson runner with three exercise types.
5. Save local progress and mastery.
6. Add review sessions.
7. Add audio assets.
8. Prepare Supabase sync once the local loop feels good.

## Website Prototype

This repo now includes a first web prototype built with Vite, React, and TypeScript.

Run it locally:

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:5173`.

Build for production:

```bash
npm run build
```
