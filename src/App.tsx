import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Flame,
  GraduationCap,
  Lock,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import haLesson from "../content/lessons/fidel-ha-family.json";

type Exercise = (typeof haLesson.exercises)[number];
type AnswerState = "idle" | "correct" | "wrong";

const lessons = [
  { title: "Welcome", state: "done", glyph: "ፊ" },
  { title: "ሀ Family", state: "active", glyph: "ሀ" },
  { title: "ለ Family", state: "locked", glyph: "ለ" },
  { title: "መ Family", state: "locked", glyph: "መ" },
  { title: "First Words", state: "locked", glyph: "ሰ" },
];

const reviewItems = [
  { glyph: "ሃ", sound: "ha", note: "looks close to ሀ" },
  { glyph: "ህ", sound: "h", note: "sixth order" },
  { glyph: "ሆ", sound: "ho", note: "round ending" },
];

function getPrompt(exercise: Exercise) {
  if (exercise.type === "choose_sound_from_fidel") return exercise.prompt?.fidel ?? "ሀ";
  if (exercise.type === "choose_fidel_from_sound") return exercise.prompt?.romanization ?? "ha";
  return "ሀ";
}

function getPromptLabel(exercise: Exercise) {
  return exercise.type === "choose_sound_from_fidel" ? "Choose the sound" : "Choose the fidel";
}

function isCorrect(exercise: Exercise, choice: string) {
  return String(exercise.answer) === choice;
}

export function App() {
  const exercises = useMemo(
    () => haLesson.exercises.filter((exercise) => exercise.type !== "match_pairs"),
    [],
  );
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selected, setSelected] = useState<string | null>(null);
  const [xp, setXp] = useState(120);
  const [streak, setStreak] = useState(3);
  const activeExercise = exercises[exerciseIndex] ?? exercises[0];
  const progress = ((exerciseIndex + (answerState === "correct" ? 1 : 0)) / exercises.length) * 100;

  function choose(choice: string) {
    if (answerState !== "idle") return;
    const correct = isCorrect(activeExercise, choice);
    setSelected(choice);
    setAnswerState(correct ? "correct" : "wrong");
    if (correct) setXp((value) => value + 5);
  }

  function next() {
    if (exerciseIndex === exercises.length - 1) {
      setExerciseIndex(0);
      setStreak((value) => value + 1);
    } else {
      setExerciseIndex((value) => value + 1);
    }
    setSelected(null);
    setAnswerState("idle");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-black">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f7f4]/85 px-5 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-black font-[var(--ethiopic)] text-2xl font-black text-white">
              ፊ
            </span>
            <span>
              <strong className="block text-xl font-black tracking-tight">Fidel Labs</strong>
              <small className="block text-xs font-bold uppercase tracking-[0.22em] text-black/45">
                Amharic demo
              </small>
            </span>
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            <a className="rounded-full border border-black/10 px-4 py-2 text-sm font-bold" href="#lesson">
              Lesson
            </a>
            <a className="rounded-full border border-black/10 px-4 py-2 text-sm font-bold" href="#system">
              System
            </a>
          </nav>
        </div>
      </header>

      <section id="top" className="mx-auto grid min-h-[calc(100vh-78px)] max-w-7xl items-center gap-8 px-5 py-12 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-black/55">
            <Sparkles size={14} />
            Vercel preview demo
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
            Learn Amharic fidel one tap at a time.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-black/62">
            A Duolingo-style prototype for recognizing fidel, matching sounds, building mastery, and reviewing weak characters.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#lesson"
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-black text-white transition hover:scale-[1.02]"
            >
              Try lesson <ArrowRight size={17} />
            </a>
            <a
              href="#system"
              className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-6 py-4 text-sm font-black"
            >
              View v1 system
            </a>
          </div>
        </div>

        <section id="lesson" className="rounded-[2rem] border border-black/10 bg-white p-4 shadow-2xl shadow-black/10 md:p-6">
          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-black p-4 text-white">
              <Flame size={20} />
              <strong className="mt-4 block text-2xl">{streak}</strong>
              <span className="text-xs text-white/55">day streak</span>
            </div>
            <div className="rounded-2xl border border-black/10 p-4">
              <GraduationCap size={20} />
              <strong className="mt-4 block text-2xl">{xp}</strong>
              <span className="text-xs text-black/55">XP earned</span>
            </div>
            <div className="rounded-2xl border border-black/10 p-4">
              <BookOpen size={20} />
              <strong className="mt-4 block text-2xl">7</strong>
              <span className="text-xs text-black/55">fidel set</span>
            </div>
          </div>

          <article className="rounded-[1.5rem] border border-black/10 p-5">
            <div className="flex items-center gap-3">
              <button className="grid size-10 place-items-center rounded-full border border-black/10" aria-label="Close lesson">
                <X size={18} />
              </button>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-black/8">
                <span className="block h-full rounded-full bg-black transition-all" style={{ width: `${Math.max(18, progress)}%` }} />
              </div>
              <span className="text-sm font-bold text-black/55">
                {exerciseIndex + 1}/{exercises.length}
              </span>
            </div>

            <div className="py-10 text-center">
              <p className="font-[var(--ethiopic)] text-lg font-black">{haLesson.title}</p>
              <h2 className="mt-5 text-2xl font-black">{getPromptLabel(activeExercise)}</h2>
              <div className="mt-6 grid min-h-32 place-items-center font-[var(--ethiopic)] text-8xl font-black">
                {getPrompt(activeExercise)}
              </div>
              <button className="mx-auto mt-4 grid size-14 place-items-center rounded-full bg-black text-white" aria-label="Play sound">
                <Volume2 size={26} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {activeExercise.choices?.map((choice) => {
                const correct = answerState !== "idle" && isCorrect(activeExercise, choice);
                const wrong = selected === choice && answerState === "wrong";
                return (
                  <button
                    key={choice}
                    onClick={() => choose(choice)}
                    className={[
                      "min-h-24 rounded-2xl border p-4 text-center transition hover:-translate-y-0.5",
                      correct ? "border-black bg-black text-white" : "",
                      wrong ? "border-red-500 bg-red-50 text-red-700" : "",
                      !correct && !wrong ? "border-black/10 bg-[#fafafa]" : "",
                    ].join(" ")}
                  >
                    <strong className="block font-[var(--ethiopic)] text-3xl">{choice}</strong>
                    <span className="mt-1 block text-sm font-bold opacity-60">
                      {choice.length === 1
                        ? haLesson.teaches.find((item) => item.fidel === choice)?.romanization
                        : choice}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-black/55">
                {answerState === "idle" && "Choose an answer to continue."}
                {answerState === "correct" && "Correct. Mastery went up."}
                {answerState === "wrong" && "Almost. Added to review."}
              </p>
              <button
                onClick={answerState === "idle" ? undefined : next}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-black text-white disabled:opacity-35"
                disabled={answerState === "idle"}
              >
                {exerciseIndex === exercises.length - 1 ? <RotateCcw size={17} /> : <Check size={17} />}
                {exerciseIndex === exercises.length - 1 ? "Restart" : "Continue"}
              </button>
            </div>
          </article>
        </section>
      </section>

      <section id="system" className="border-t border-black/10 bg-black px-5 py-20 text-white md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/38">v1 demo system</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Small loop, real learning spine.</h2>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-5">
              {lessons.map((lesson) => (
                <div key={lesson.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="font-[var(--ethiopic)] text-4xl font-black">{lesson.glyph}</span>
                  <strong className="mt-5 block text-sm">{lesson.title}</strong>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-white/45">
                    {lesson.state === "locked" && <Lock size={12} />}
                    {lesson.state}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {reviewItems.map((item) => (
                <div key={item.glyph} className="rounded-2xl border border-white/10 bg-white p-5 text-black">
                  <span className="font-[var(--ethiopic)] text-5xl font-black">{item.glyph}</span>
                  <strong className="mt-4 block">{item.sound}</strong>
                  <p className="mt-2 text-sm text-black/55">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

