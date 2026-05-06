import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  Flame,
  GraduationCap,
  Headphones,
  Library,
  Lock,
  Map,
  Mic2,
  RotateCcw,
  Target,
  Volume2,
} from "lucide-react";

type AnswerState = "idle" | "correct" | "wrong";
type LessonState = "done" | "active" | "available" | "locked";
type PracticeMode = "fidel" | "words";
type Exercise = {
  id: string;
  promptType: "sound-to-fidel" | "fidel-to-sound" | "word-to-meaning" | "meaning-to-word";
  prompt: string;
  answer: string;
  choices: string[];
  tracks: string;
};
type Lesson = {
  id: string;
  title: string;
  shortTitle: string;
  state: LessonState;
  glyph: string;
  description: string;
  items: { id: string; fidel: string; sound: string; note: string }[];
};
type Word = {
  id: string;
  amharic: string;
  romanization: string;
  meaning: string;
  note: string;
  status: "live" | "preview";
};
type NativeSample = {
  id: string;
  transcription: string;
  audioUrl: string;
};
type View = "learn" | "library" | "roadmap";

const lessons: Lesson[] = [
  {
    id: "ha",
    title: "The ሀ Family",
    shortTitle: "ሀ Family",
    state: "active",
    glyph: "ሀ",
    description: "Start with the seven beginner forms in the ሀ family.",
    items: [
      { id: "ha-1", fidel: "ሀ", sound: "ha", note: "first order" },
      { id: "ha-2", fidel: "ሁ", sound: "hu", note: "second order" },
      { id: "ha-3", fidel: "ሂ", sound: "hi", note: "third order" },
      { id: "ha-4", fidel: "ሃ", sound: "ha", note: "fourth order" },
      { id: "ha-5", fidel: "ሄ", sound: "he", note: "fifth order" },
      { id: "ha-6", fidel: "ህ", sound: "h", note: "sixth order" },
      { id: "ha-7", fidel: "ሆ", sound: "ho", note: "seventh order" },
    ],
  },
  {
    id: "le",
    title: "The ለ Family",
    shortTitle: "ለ Family",
    state: "available",
    glyph: "ለ",
    description: "Learn the L-family and compare its rhythm to ሀ.",
    items: [
      { id: "le-1", fidel: "ለ", sound: "le", note: "base shape" },
      { id: "le-2", fidel: "ሉ", sound: "lu", note: "rounded vowel" },
      { id: "le-3", fidel: "ሊ", sound: "li", note: "high vowel" },
      { id: "le-4", fidel: "ላ", sound: "la", note: "open vowel" },
      { id: "le-5", fidel: "ሌ", sound: "le", note: "long e" },
      { id: "le-6", fidel: "ል", sound: "l", note: "closed form" },
      { id: "le-7", fidel: "ሎ", sound: "lo", note: "round ending" },
    ],
  },
  {
    id: "me",
    title: "The መ Family",
    shortTitle: "መ Family",
    state: "locked",
    glyph: "መ",
    description: "Add the M-family after the first two sets are familiar.",
    items: [
      { id: "me-1", fidel: "መ", sound: "me", note: "base shape" },
      { id: "me-2", fidel: "ሙ", sound: "mu", note: "rounded vowel" },
      { id: "me-3", fidel: "ሚ", sound: "mi", note: "high vowel" },
      { id: "me-4", fidel: "ማ", sound: "ma", note: "open vowel" },
      { id: "me-5", fidel: "ሜ", sound: "me", note: "long e" },
      { id: "me-6", fidel: "ም", sound: "m", note: "closed form" },
      { id: "me-7", fidel: "ሞ", sound: "mo", note: "round ending" },
    ],
  },
  {
    id: "se",
    title: "The ሰ Family",
    shortTitle: "ሰ Family",
    state: "locked",
    glyph: "ሰ",
    description: "A high-utility family for first words like ሰላም.",
    items: [
      { id: "se-1", fidel: "ሰ", sound: "se", note: "base shape" },
      { id: "se-2", fidel: "ሱ", sound: "su", note: "rounded vowel" },
      { id: "se-3", fidel: "ሲ", sound: "si", note: "high vowel" },
      { id: "se-4", fidel: "ሳ", sound: "sa", note: "open vowel" },
      { id: "se-5", fidel: "ሴ", sound: "se", note: "long e" },
      { id: "se-6", fidel: "ስ", sound: "s", note: "closed form" },
      { id: "se-7", fidel: "ሶ", sound: "so", note: "round ending" },
    ],
  },
];

const words: Word[] = [
  { id: "word-selam", amharic: "ሰላም", romanization: "selam", meaning: "hello / peace", note: "common greeting", status: "live" },
  { id: "word-wiha", amharic: "ውሃ", romanization: "wiha", meaning: "water", note: "daily essential", status: "live" },
  { id: "word-bet", amharic: "ቤት", romanization: "bet", meaning: "house / home", note: "place word", status: "live" },
  { id: "word-buna", amharic: "ቡና", romanization: "buna", meaning: "coffee", note: "culture word", status: "live" },
  { id: "word-enat", amharic: "እናት", romanization: "enat", meaning: "mother", note: "family word", status: "preview" },
  { id: "word-abat", amharic: "አባት", romanization: "abat", meaning: "father", note: "family word", status: "preview" },
  { id: "word-injera", amharic: "እንጀራ", romanization: "injera", meaning: "injera", note: "food word", status: "preview" },
  { id: "word-thanks", amharic: "አመሰግናለሁ", romanization: "ameseginalehu", meaning: "thank you", note: "polite phrase", status: "preview" },
];

function makeExercises(lesson: Lesson): Exercise[] {
  const symbols = lesson.items.map((item) => item.fidel);
  const sounds = lesson.items.map((item) => item.sound);
  const first = lesson.items[0];
  const second = lesson.items[1];
  const third = lesson.items[2];
  const last = lesson.items[6];

  return [
    {
      id: `${lesson.id}-sound-1`,
      promptType: "sound-to-fidel",
      prompt: first.sound,
      answer: first.fidel,
      choices: symbols.slice(0, 4),
      tracks: first.id,
    },
    {
      id: `${lesson.id}-fidel-2`,
      promptType: "fidel-to-sound",
      prompt: second.fidel,
      answer: second.sound,
      choices: [...new Set([first.sound, second.sound, third.sound, last.sound])],
      tracks: second.id,
    },
    {
      id: `${lesson.id}-sound-last`,
      promptType: "sound-to-fidel",
      prompt: last.sound,
      answer: last.fidel,
      choices: [lesson.items[3].fidel, lesson.items[4].fidel, lesson.items[5].fidel, last.fidel],
      tracks: last.id,
    },
    {
      id: `${lesson.id}-fidel-3`,
      promptType: "fidel-to-sound",
      prompt: third.fidel,
      answer: third.sound,
      choices: sounds.slice(0, 4),
      tracks: third.id,
    },
  ];
}

function makeWordExercises(): Exercise[] {
  const liveWords = words.filter((word) => word.status === "live");
  const allMeanings = words.map((word) => word.meaning);
  const allAmharic = words.map((word) => word.amharic);

  return liveWords.flatMap((word, index) => {
    const meaningChoices = uniqueChoices(word.meaning, allMeanings, index);
    const wordChoices = uniqueChoices(word.amharic, allAmharic, index);

    return [
      {
        id: `${word.id}-meaning`,
        promptType: "word-to-meaning",
        prompt: word.amharic,
        answer: word.meaning,
        choices: meaningChoices,
        tracks: word.id,
      },
      {
        id: `${word.id}-word`,
        promptType: "meaning-to-word",
        prompt: word.meaning,
        answer: word.amharic,
        choices: wordChoices,
        tracks: word.id,
      },
    ];
  });
}

function uniqueChoices(answer: string, source: string[], offset: number) {
  const rotated = [...source.slice(offset + 1), ...source.slice(0, offset + 1)];
  return [...new Set([answer, ...rotated.filter((item) => item !== answer)])].slice(0, 4);
}

export function App() {
  const [view, setView] = useState<View>("learn");
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("fidel");
  const [activeLessonId, setActiveLessonId] = useState("ha");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selected, setSelected] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<"correct" | "wrong" | null>(null);
  const [xp, setXp] = useState(180);
  const [streak, setStreak] = useState(4);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [reviewQueue, setReviewQueue] = useState(["ha-4", "ha-6", "ha-7"]);
  const [nativeSamples, setNativeSamples] = useState<NativeSample[]>([]);
  const [nativeStatus, setNativeStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const advanceTimer = useRef<number | null>(null);

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0];
  const exercises = useMemo(
    () => (practiceMode === "fidel" ? makeExercises(activeLesson) : makeWordExercises()),
    [activeLesson, practiceMode]
  );
  const activeExercise = exercises[exerciseIndex] ?? exercises[0];
  const activeItem = activeLesson.items.find((item) => item.id === activeExercise.tracks);
  const activeWord = words.find((word) => word.id === activeExercise.tracks);
  const progress = ((exerciseIndex + (answerState === "correct" ? 1 : 0)) / exercises.length) * 100;
  const allItems = lessons.flatMap((lesson) => lesson.items.map((item) => ({ ...item, family: lesson.shortTitle })));
  const masteredCount = allItems.filter((item) => completedLessons.includes(item.id.split("-")[0]) || item.id.startsWith("ha")).length;

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  function chooseLesson(lesson: Lesson) {
    if (lesson.state === "locked") return;
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    setActiveLessonId(lesson.id);
    setExerciseIndex(0);
    setSelected(null);
    setAnswerState("idle");
    setCelebration(null);
    speak(lesson.items[0].sound);
  }

  function chooseMode(mode: PracticeMode) {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    setPracticeMode(mode);
    setExerciseIndex(0);
    setSelected(null);
    setAnswerState("idle");
    setCelebration(null);
    if (mode === "words") speak(words[0].amharic);
  }

  function choose(choice: string) {
    if (answerState !== "idle") return;
    const correct = activeExercise.answer === choice;
    setSelected(choice);
    setAnswerState(correct ? "correct" : "wrong");
    setCelebration(correct ? "correct" : "wrong");
    if (correct) {
      setXp((value) => value + 5);
      setReviewQueue((items) => items.filter((id) => id !== activeExercise.tracks));
      playTone(660, 0.08);
      window.setTimeout(() => playTone(880, 0.1), 95);
    } else {
      setReviewQueue((items) => [activeExercise.tracks, ...items.filter((id) => id !== activeExercise.tracks)].slice(0, 8));
      playTone(180, 0.12);
    }
    speak(getSpeechText(activeExercise, activeWord, correct ? activeExercise.answer : choice));
    advanceTimer.current = window.setTimeout(() => {
      next();
      setCelebration(null);
    }, correct ? 920 : 1150);
  }

  function next() {
    if (exerciseIndex === exercises.length - 1) {
      setExerciseIndex(0);
      setStreak((value) => value + 1);
      setCompletedLessons((ids) => [...new Set([...ids, activeLesson.id])]);
    } else {
      setExerciseIndex((value) => value + 1);
    }
    setSelected(null);
    setAnswerState("idle");
  }

  async function loadNativeSamples() {
    if (nativeStatus === "loading") return;
    setNativeStatus("loading");
    try {
      const response = await fetch(
        "https://datasets-server.huggingface.co/rows?dataset=hadamard-2/alffa-amharic-v2&config=default&split=test&offset=7&length=4"
      );
      if (!response.ok) throw new Error("Unable to load ALFFA rows");
      const data = await response.json();
      const samples = data.rows
        .map((entry: { row: { id: string; transcription: string; audio?: { src: string }[] } }) => ({
          id: entry.row.id,
          transcription: entry.row.transcription,
          audioUrl: entry.row.audio?.[0]?.src,
        }))
        .filter((sample: NativeSample) => sample.audioUrl);
      setNativeSamples(samples);
      setNativeStatus("ready");
    } catch {
      setNativeStatus("error");
    }
  }

  function playNativeSample(sample: NativeSample) {
    const audio = new Audio(sample.audioUrl);
    void audio.play();
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-black">
      <div className="mx-auto grid min-h-screen w-full max-w-[1500px] gap-5 px-4 py-4 md:grid-cols-[108px_minmax(0,1fr)] md:gap-7 md:px-7 md:py-7 xl:grid-cols-[124px_minmax(0,1fr)] xl:gap-9 xl:px-9">
        <nav className="fixed bottom-4 left-4 right-4 z-40 grid grid-cols-3 gap-2 rounded-[1.5rem] border border-black/10 bg-white/90 p-2 shadow-2xl shadow-black/10 backdrop-blur md:sticky md:left-auto md:right-auto md:top-7 md:bottom-auto md:h-[calc(100vh-3.5rem)] md:grid-cols-1 md:content-start md:gap-3 md:p-3">
          <NavButton active={view === "learn"} icon={<BookOpen size={20} />} label="Learn" onClick={() => setView("learn")} />
          <NavButton active={view === "library"} icon={<Library size={20} />} label="Library" onClick={() => setView("library")} />
          <NavButton active={view === "roadmap"} icon={<Map size={20} />} label="Plan" onClick={() => setView("roadmap")} />
        </nav>

        {view === "learn" && (
          <section className="grid gap-5 pb-24 md:pb-0">
            <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start xl:grid-cols-[410px_minmax(0,1fr)] xl:gap-8">
              <div className="rounded-[2rem] bg-black p-6 text-white md:p-8 lg:sticky lg:top-7 xl:p-10">
                <h1 className="text-5xl font-black leading-[0.92] tracking-tight md:text-6xl xl:text-7xl">
                  Learn Amharic fidel one tap at a time.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
                  Switch between fidel sounds and real beginner words. Native recordings are the next audio pass.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3 lg:grid-cols-1 xl:grid-cols-3">
                  <Metric icon={<Flame size={19} />} label="day streak" value={streak} dark />
                  <Metric icon={<GraduationCap size={19} />} label="XP earned" value={xp} dark />
                  <Metric icon={<Target size={19} />} label="mastered" value={`${masteredCount}/${allItems.length}`} dark />
                </div>
              </div>

              <div className="grid gap-5 xl:gap-6">
          <div className="grid grid-cols-2 gap-3 rounded-[1.5rem] border border-black/10 bg-white p-2">
            <ModeButton active={practiceMode === "fidel"} icon={<BookOpen size={18} />} label="Fidel" onClick={() => chooseMode("fidel")} />
            <ModeButton active={practiceMode === "words"} icon={<Mic2 size={18} />} label="Words" onClick={() => chooseMode("words")} />
          </div>

          {practiceMode === "fidel" ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:gap-4">
            {lessons.map((lesson) => {
              const locked = lesson.state === "locked";
              const active = activeLesson.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => chooseLesson(lesson)}
                  className={[
                    "rounded-2xl border p-4 text-left transition xl:p-5",
                    active ? "border-black bg-black text-white" : "border-black/10 bg-white hover:-translate-y-0.5",
                    locked ? "cursor-not-allowed opacity-45 hover:translate-y-0" : "",
                  ].join(" ")}
                >
                  <span className="font-[var(--ethiopic)] text-4xl font-black">{lesson.glyph}</span>
                  <strong className="mt-4 block text-sm">{lesson.shortTitle}</strong>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs opacity-55">
                    {locked && <Lock size={12} />}
                    {completedLessons.includes(lesson.id) ? "done" : lesson.state}
                  </span>
                </button>
              );
            })}
          </div>
          ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:gap-4">
            {words.slice(0, 4).map((word) => (
              <button
                key={word.id}
                onClick={() => speak(word.amharic)}
                className="rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-black xl:p-5"
              >
                <span className="font-[var(--ethiopic)] text-4xl font-black">{word.amharic}</span>
                <strong className="mt-4 block text-sm">{word.meaning}</strong>
                <span className="mt-2 block text-xs text-black/50">{word.romanization}</span>
              </button>
            ))}
          </div>
          )}

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-6">
            <LessonRunner
              activeExercise={activeExercise}
              activeItem={activeItem}
              answerState={answerState}
              celebration={celebration}
              exerciseIndex={exerciseIndex}
              exercisesLength={exercises.length}
              lesson={activeLesson}
              mode={practiceMode}
              onChoose={choose}
              onSpeak={speak}
              progress={progress}
              selected={selected}
              word={activeWord}
            />

            <aside className="grid content-start gap-4 xl:gap-5">
              <Panel title="Review queue" eyebrow={`${reviewQueue.length} weak items`}>
                <div className="grid gap-2">
                  {reviewQueue.slice(0, 4).map((id) => {
                    const item = allItems.find((entry) => entry.id === id);
                    const word = words.find((entry) => entry.id === id);
                    if (!item && !word) return null;
                    return (
                      <div key={id} className="rounded-2xl border border-black/10 bg-[#fafafa] p-3">
                        <span className="font-[var(--ethiopic)] text-3xl font-black">{item?.fidel ?? word?.amharic}</span>
                        <strong className="ml-3">{item?.sound ?? word?.romanization}</strong>
                        <p className="mt-1 text-xs text-black/50">{item?.note ?? word?.meaning}</p>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              <Panel title="First words" eyebrow="preview">
                <div className="grid gap-2">
                  {words.slice(0, 4).map((word) => (
                    <button key={word.amharic} onClick={() => speak(word.amharic)} className="rounded-2xl border border-black/10 p-3 text-left transition hover:border-black">
                      <span className="font-[var(--ethiopic)] text-2xl font-black">{word.amharic}</span>
                      <strong className="ml-3 text-sm">{word.romanization}</strong>
                      <p className="mt-1 text-xs text-black/50">{word.meaning}</p>
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Native samples" eyebrow="ALFFA v2">
                <p className="text-sm leading-6 text-black/55">
                  Real Amharic sentence audio from Hugging Face. Useful now for listening; later we can cut word-level clips.
                </p>
                <button
                  onClick={loadNativeSamples}
                  className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-black text-white"
                >
                  <Headphones size={17} />
                  {nativeStatus === "loading" ? "Loading..." : nativeStatus === "ready" ? "Refresh clips" : "Load native clips"}
                </button>
                {nativeStatus === "error" && <p className="mt-3 text-sm font-bold text-red-600">Could not load the dataset preview.</p>}
                <div className="mt-4 grid gap-2">
                  {nativeSamples.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => playNativeSample(sample)}
                      className="rounded-2xl border border-black/10 bg-[#fafafa] p-3 text-left transition hover:border-black"
                    >
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-black/35">{sample.id}</span>
                      <p className="mt-2 line-clamp-2 font-[var(--ethiopic)] text-sm font-bold leading-6">{sample.transcription}</p>
                    </button>
                  ))}
                </div>
              </Panel>
            </aside>
          </div>
              </div>
            </div>
        </section>
        )}

        {view === "library" && (
          <section className="min-h-[calc(100vh-3.5rem)] rounded-[2rem] bg-white p-5 pb-24 md:p-8 md:pb-8 xl:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-black/38">
                <Library size={15} />
                Character library
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Fidel grid by family.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-black/55">
              The production version can use this as a searchable reference with audio, examples, and handwriting practice.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:gap-6">
            {lessons.map((lesson) => (
              <article key={lesson.id} className="rounded-[1.5rem] border border-black/10 bg-[#f7f7f4] p-5 xl:p-6">
                <div className="mb-5 flex items-start justify-between gap-5">
                  <div>
                    <h3 className="font-[var(--ethiopic)] text-3xl font-black">{lesson.title}</h3>
                    <p className="mt-1 text-sm text-black/55">{lesson.description}</p>
                  </div>
                  {lesson.state === "locked" && <Lock className="text-black/30" size={20} />}
                </div>
                <div className="grid grid-cols-7 gap-2 xl:gap-3">
                  {lesson.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => speak(item.sound)}
                      className="rounded-2xl border border-black/10 bg-white p-3 text-center transition hover:border-black xl:min-h-24 xl:p-4"
                    >
                      <span className="block font-[var(--ethiopic)] text-3xl font-black">{item.fidel}</span>
                      <span className="mt-1 block text-xs font-bold text-black/45">{item.sound}</span>
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-black/10 bg-[#f7f7f4] p-5 xl:p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-2xl font-black">Beginner word bank</h3>
                <p className="mt-1 text-sm text-black/55">Tap any word to hear the current prototype voice while native clips are prepared.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-black/40">
                <Headphones size={15} />
                native audio next
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {words.map((word) => (
                <button key={word.id} onClick={() => speak(word.amharic)} className="rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-black">
                  <span className="font-[var(--ethiopic)] text-3xl font-black">{word.amharic}</span>
                  <strong className="mt-3 block text-sm">{word.meaning}</strong>
                  <span className="mt-1 block text-xs text-black/50">{word.romanization} · {word.note}</span>
                </button>
              ))}
            </div>
          </div>
          </section>
        )}

        {view === "roadmap" && (
          <section className="grid min-h-[calc(100vh-3.5rem)] content-center rounded-[2rem] bg-black p-6 pb-24 text-white md:p-10 md:pb-10 xl:p-14">
        <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[0.8fr_1.2fr] xl:gap-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/38">what comes next</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Enough shape to build from.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Audio pass", "Use Lingua Libre/Wikimedia for word clips, then record native fidel syllables."],
              ["Corpus mining", "Use ALFFA or Common Voice to find natural examples once licensing is checked."],
              ["Progress storage", "Save XP, streak, mastery, and review timing locally first."],
              ["More exercises", "Add match pairs, build word, and handwriting practice."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <strong className="text-xl">{title}</strong>
                <p className="mt-3 text-sm leading-6 text-white/55">{copy}</p>
              </div>
            ))}
          </div>
        </div>
          </section>
        )}
      </div>
    </main>
  );
}

function getSpeechText(exercise: Exercise, word: Word | undefined, fallback: string) {
  if (exercise.promptType === "word-to-meaning" || exercise.promptType === "meaning-to-word") {
    return word?.amharic ?? fallback;
  }
  return fallback;
}

function speak(text: string) {
  if (typeof window === "undefined") return;
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[\u1200-\u137F]/.test(text) ? "am-ET" : "en-US";
    utterance.rate = 0.72;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  } else {
    playTone(520, 0.12);
  }
}

function playTone(frequency: number, duration: number) {
  try {
    const AudioContextCtor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;
    const context = new AudioContextCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.05, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  } catch {
    // Audio is best-effort in browser previews.
  }
}

function NavButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={active ? { backgroundColor: "#000", color: "#fff" } : undefined}
      className={[
        "flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-black transition",
        active ? "bg-black text-white hover:bg-black" : "text-black/55 hover:bg-black/5 hover:text-black",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function ModeButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={active ? { backgroundColor: "#000", color: "#fff" } : undefined}
      className={[
        "flex min-h-14 items-center justify-center gap-2 rounded-[1.1rem] text-sm font-black transition",
        active ? "bg-black text-white hover:bg-black" : "text-black/55 hover:bg-black/5 hover:text-black",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function Metric({
  dark,
  icon,
  label,
  value,
}: {
  dark?: boolean;
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className={["rounded-2xl p-4", dark ? "border border-white/10 bg-white/6 text-white" : "border border-black/10 bg-white"].join(" ")}>
      {icon}
      <strong className="mt-4 block text-2xl">{value}</strong>
      <span className={["text-xs", dark ? "text-white/55" : "text-black/55"].join(" ")}>{label}</span>
    </div>
  );
}

function Panel({ children, eyebrow, title }: { children: React.ReactNode; eyebrow: string; title: string }) {
  return (
    <article className="rounded-[1.5rem] border border-black/10 bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-black/35">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-black">{title}</h3>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function LessonRunner({
  activeExercise,
  activeItem,
  answerState,
  celebration,
  exerciseIndex,
  exercisesLength,
  lesson,
  mode,
  onChoose,
  onSpeak,
  progress,
  selected,
  word,
}: {
  activeExercise: Exercise;
  activeItem?: Lesson["items"][number];
  answerState: AnswerState;
  celebration: "correct" | "wrong" | null;
  exerciseIndex: number;
  exercisesLength: number;
  lesson: Lesson;
  mode: PracticeMode;
  onChoose: (choice: string) => void;
  onSpeak: (text: string) => void;
  progress: number;
  selected: string | null;
  word?: Word;
}) {
  const isWordMode = mode === "words";
  const promptIsFidel = /[\u1200-\u137F]/.test(activeExercise.prompt);
  const promptLabel =
    activeExercise.promptType === "fidel-to-sound"
      ? "Choose the sound"
      : activeExercise.promptType === "sound-to-fidel"
        ? "Choose the fidel"
        : activeExercise.promptType === "word-to-meaning"
          ? "Choose the meaning"
          : "Choose the Amharic word";

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white p-4 shadow-2xl shadow-black/10 md:p-6">
      {celebration && (
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-white/45 backdrop-blur-[2px]">
          <div
            className={[
              "fidel-pop grid size-36 place-items-center rounded-full border-4 text-center shadow-2xl",
              celebration === "correct" ? "border-black bg-black text-white shadow-black/25" : "border-red-500 bg-red-50 text-red-700 shadow-red-500/15",
            ].join(" ")}
          >
            <span className="font-[var(--ethiopic)] text-5xl font-black">
              {celebration === "correct" ? "ጎበዝ" : "እንደገና"}
            </span>
          </div>
          {celebration === "correct" && <div className="fidel-burst" />}
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-black/8">
          <span className="block h-full rounded-full bg-black transition-all" style={{ width: `${Math.max(18, progress)}%` }} />
        </div>
        <span className="text-sm font-bold text-black/55">
          {exerciseIndex + 1}/{exercisesLength}
        </span>
      </div>

      <div className="py-10 text-center">
        <p className="font-[var(--ethiopic)] text-lg font-black">{isWordMode ? "Beginner words" : lesson.title}</p>
        <h2 className="mt-5 text-2xl font-black">
          {promptLabel}
        </h2>
        <div
          className={[
            "mt-6 grid min-h-32 place-items-center font-black",
            promptIsFidel ? "font-[var(--ethiopic)] text-8xl" : "text-5xl leading-tight md:text-6xl",
          ].join(" ")}
        >
          {activeExercise.prompt}
        </div>
        <button
          className="mx-auto mt-4 grid size-14 place-items-center rounded-full bg-black text-white"
          aria-label="Play sound"
          onClick={() => onSpeak(word?.amharic ?? activeItem?.sound ?? activeExercise.prompt)}
        >
          <Volume2 size={26} />
        </button>
        {(activeItem || word) && <p className="mt-4 text-sm font-bold text-black/45">{activeItem?.note ?? `${word?.romanization} · ${word?.note}`}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {activeExercise.choices.map((choice) => {
          const correct = answerState !== "idle" && activeExercise.answer === choice;
          const wrong = selected === choice && answerState === "wrong";
          return (
            <button
              key={choice}
              onClick={() => onChoose(choice)}
              disabled={answerState !== "idle"}
              className={[
                "min-h-24 rounded-2xl border p-4 text-center transition hover:-translate-y-0.5",
                correct ? "border-black bg-black text-white" : "",
                wrong ? "border-red-500 bg-red-50 text-red-700" : "",
                !correct && !wrong ? "border-black/10 bg-[#fafafa]" : "",
              ].join(" ")}
            >
              <strong className={["block", /[\u1200-\u137F]/.test(choice) ? "font-[var(--ethiopic)] text-3xl" : "text-xl"].join(" ")}>
                {choice}
              </strong>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-black/55">
          {answerState === "idle" && "Choose an answer to continue."}
          {answerState === "correct" && "Correct. Moving on..."}
          {answerState === "wrong" && "Added to review. Next one coming..."}
        </p>
        <span className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/10 px-5 text-sm font-black text-black/55">
          {exerciseIndex === exercisesLength - 1 ? <RotateCcw size={17} /> : <Check size={17} />}
          Auto-advance
        </span>
      </div>
    </article>
  );
}
