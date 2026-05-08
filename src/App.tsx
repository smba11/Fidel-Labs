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
  Play,
  RotateCcw,
  Search,
  Star,
  Target,
  Trophy,
  Volume2,
  Waves,
  Zap,
} from "lucide-react";
import { onAuthStateChanged, signInWithPopup, signOut, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { Signup1 } from "@/components/ui/signup-1";
import { auth, db, firebaseReady, googleProvider } from "./lib/firebase";

type AnswerState = "idle" | "correct" | "wrong";
type LessonState = "active" | "available" | "locked";
type PracticeMode = "fidel" | "words" | "listening";
type PromptType = "sound-to-fidel" | "fidel-to-sound" | "word-to-meaning" | "meaning-to-word" | "listen-to-phrase";
type Exercise = {
  id: string;
  promptType: PromptType;
  prompt: string;
  answer: string;
  choices: string[];
  tracks: string;
  audioUrl?: string;
};
type FidelItem = { id: string; fidel: string; sound: string; note: string };
type Lesson = {
  id: string;
  title: string;
  shortTitle: string;
  state: LessonState;
  glyph: string;
  description: string;
  unlock: string;
  items: FidelItem[];
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
type Progress = {
  xp: number;
  streak: number;
  completedLessons: string[];
  reviewQueue: string[];
  correctAnswers: number;
  nativeListens: number;
};
type AppUser = {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  demo: boolean;
};
type View = "learn" | "library" | "roadmap";

const progressKey = "fidel-labs-progress-v2";
const demoUserKey = "fidel-labs-demo-user";

const lessons: Lesson[] = [
  {
    id: "ha",
    title: "The ሀ Family",
    shortTitle: "ሀ Family",
    state: "active",
    glyph: "ሀ",
    description: "Start with the seven beginner forms in the ሀ family.",
    unlock: "Live",
    items: [
      { id: "ha-1", fidel: "ሀ", sound: "ha", note: "first order" },
      { id: "ha-2", fidel: "ሁ", sound: "hu", note: "rounded u" },
      { id: "ha-3", fidel: "ሂ", sound: "hi", note: "high i" },
      { id: "ha-4", fidel: "ሃ", sound: "ha", note: "open a" },
      { id: "ha-5", fidel: "ሄ", sound: "he", note: "long e" },
      { id: "ha-6", fidel: "ህ", sound: "h", note: "closed form" },
      { id: "ha-7", fidel: "ሆ", sound: "ho", note: "round o" },
    ],
  },
  {
    id: "le",
    title: "The ለ Family",
    shortTitle: "ለ Family",
    state: "available",
    glyph: "ለ",
    description: "Learn the L-family and compare its rhythm to ሀ.",
    unlock: "Live",
    items: [
      { id: "le-1", fidel: "ለ", sound: "le", note: "base shape" },
      { id: "le-2", fidel: "ሉ", sound: "lu", note: "rounded u" },
      { id: "le-3", fidel: "ሊ", sound: "li", note: "high i" },
      { id: "le-4", fidel: "ላ", sound: "la", note: "open a" },
      { id: "le-5", fidel: "ሌ", sound: "le", note: "long e" },
      { id: "le-6", fidel: "ል", sound: "l", note: "closed form" },
      { id: "le-7", fidel: "ሎ", sound: "lo", note: "round o" },
    ],
  },
  {
    id: "me",
    title: "The መ Family",
    shortTitle: "መ Family",
    state: "available",
    glyph: "መ",
    description: "Add a common M-family used in words like ማር and ሞት.",
    unlock: "New",
    items: [
      { id: "me-1", fidel: "መ", sound: "me", note: "base shape" },
      { id: "me-2", fidel: "ሙ", sound: "mu", note: "rounded u" },
      { id: "me-3", fidel: "ሚ", sound: "mi", note: "high i" },
      { id: "me-4", fidel: "ማ", sound: "ma", note: "open a" },
      { id: "me-5", fidel: "ሜ", sound: "me", note: "long e" },
      { id: "me-6", fidel: "ም", sound: "m", note: "closed form" },
      { id: "me-7", fidel: "ሞ", sound: "mo", note: "round o" },
    ],
  },
  {
    id: "se",
    title: "The ሰ Family",
    shortTitle: "ሰ Family",
    state: "available",
    glyph: "ሰ",
    description: "A high-utility family for first words like ሰላም.",
    unlock: "New",
    items: [
      { id: "se-1", fidel: "ሰ", sound: "se", note: "base shape" },
      { id: "se-2", fidel: "ሱ", sound: "su", note: "rounded u" },
      { id: "se-3", fidel: "ሲ", sound: "si", note: "high i" },
      { id: "se-4", fidel: "ሳ", sound: "sa", note: "open a" },
      { id: "se-5", fidel: "ሴ", sound: "se", note: "long e" },
      { id: "se-6", fidel: "ስ", sound: "s", note: "closed form" },
      { id: "se-7", fidel: "ሶ", sound: "so", note: "round o" },
    ],
  },
  {
    id: "be",
    title: "The በ Family",
    shortTitle: "በ Family",
    state: "locked",
    glyph: "በ",
    description: "Next consonant family for building more daily words.",
    unlock: "Finish two live sets",
    items: [
      { id: "be-1", fidel: "በ", sound: "be", note: "base shape" },
      { id: "be-2", fidel: "ቡ", sound: "bu", note: "rounded u" },
      { id: "be-3", fidel: "ቢ", sound: "bi", note: "high i" },
      { id: "be-4", fidel: "ባ", sound: "ba", note: "open a" },
      { id: "be-5", fidel: "ቤ", sound: "be", note: "long e" },
      { id: "be-6", fidel: "ብ", sound: "b", note: "closed form" },
      { id: "be-7", fidel: "ቦ", sound: "bo", note: "round o" },
    ],
  },
];

const words: Word[] = [
  { id: "word-selam", amharic: "ሰላም", romanization: "selam", meaning: "hello / peace", note: "common greeting", status: "live" },
  { id: "word-wiha", amharic: "ውሃ", romanization: "wiha", meaning: "water", note: "daily essential", status: "live" },
  { id: "word-bet", amharic: "ቤት", romanization: "bet", meaning: "house / home", note: "place word", status: "live" },
  { id: "word-buna", amharic: "ቡና", romanization: "buna", meaning: "coffee", note: "culture word", status: "live" },
  { id: "word-enat", amharic: "እናት", romanization: "enat", meaning: "mother", note: "family word", status: "live" },
  { id: "word-abat", amharic: "አባት", romanization: "abat", meaning: "father", note: "family word", status: "live" },
  { id: "word-injera", amharic: "እንጀራ", romanization: "injera", meaning: "injera", note: "food word", status: "preview" },
  { id: "word-thanks", amharic: "አመሰግናለሁ", romanization: "ameseginalehu", meaning: "thank you", note: "polite phrase", status: "preview" },
  { id: "word-ethiopia", amharic: "ኢትዮጵያ", romanization: "ityopiya", meaning: "Ethiopia", note: "country name", status: "preview" },
  { id: "word-book", amharic: "መጽሐፍ", romanization: "mets'haf", meaning: "book", note: "school word", status: "preview" },
];

const fallbackNativeSamples: NativeSample[] = [
  {
    id: "01_d501028",
    transcription: "የ ኮሚሽኑ ውሳኔ ና የቤተ ክህነቱ ተቃውሞ",
    audioUrl: "",
  },
  {
    id: "01_d501029",
    transcription: "ይህንን ም ባድመን ና ሽራሮ ን በ መውረር እ ውን አ ርጓል",
    audioUrl: "",
  },
  {
    id: "01_d501030",
    transcription: "ጋዜጠኞች ን መለያየታቸው ብዙዎች ን አሳዝኗ ል",
    audioUrl: "",
  },
  {
    id: "01_d501031",
    transcription: "ባለፈው ሰኞ እ ለት ደግሞ በ ቴሌቭዥን ሌላ ሽልማት ሲ ሸለም ተ መልከት ኩ",
    audioUrl: "",
  },
];

function makeFidelExercises(lesson: Lesson): Exercise[] {
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
      choices: uniqueChoices(second.sound, sounds, 1),
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
      choices: uniqueChoices(third.sound, sounds, 2),
      tracks: third.id,
    },
  ];
}

function makeWordExercises(): Exercise[] {
  const liveWords = words.filter((word) => word.status === "live");
  const allMeanings = words.map((word) => word.meaning);
  const allAmharic = words.map((word) => word.amharic);

  return liveWords.flatMap((word, index) => [
    {
      id: `${word.id}-meaning`,
      promptType: "word-to-meaning",
      prompt: word.amharic,
      answer: word.meaning,
      choices: uniqueChoices(word.meaning, allMeanings, index),
      tracks: word.id,
    },
    {
      id: `${word.id}-word`,
      promptType: "meaning-to-word",
      prompt: word.meaning,
      answer: word.amharic,
      choices: uniqueChoices(word.amharic, allAmharic, index),
      tracks: word.id,
    },
  ]);
}

function makeListeningExercises(samples: NativeSample[]): Exercise[] {
  const usableSamples = samples.length ? samples : fallbackNativeSamples;
  return usableSamples.map((sample, index) => ({
    id: `${sample.id}-listen`,
    promptType: "listen-to-phrase",
    prompt: "Play the native clip",
    answer: sample.transcription,
    choices: uniqueChoices(
      sample.transcription,
      usableSamples.map((entry) => entry.transcription),
      index
    ),
    tracks: sample.id,
    audioUrl: sample.audioUrl,
  }));
}

function uniqueChoices(answer: string, source: string[], offset: number) {
  const rotated = [...source.slice(offset + 1), ...source.slice(0, offset + 1)];
  return [...new Set([answer, ...rotated.filter((item) => item !== answer)])].slice(0, 4);
}

function getInitialProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const saved = window.localStorage.getItem(progressKey);
    if (!saved) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(saved) };
  } catch {
    return defaultProgress;
  }
}

function getInitialDemoUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(demoUserKey);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function toAppUser(user: FirebaseUser): AppUser {
  return {
    uid: user.uid,
    name: user.displayName || "Fidel learner",
    email: user.email || "",
    photoURL: user.photoURL || undefined,
    demo: false,
  };
}

const defaultProgress: Progress = {
  xp: 180,
  streak: 4,
  completedLessons: [],
  reviewQueue: ["ha-4", "ha-6", "ha-7"],
  correctAnswers: 0,
  nativeListens: 0,
};

export function App() {
  const [view, setView] = useState<View>("learn");
  const [user, setUser] = useState<AppUser | null>(getInitialDemoUser);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("fidel");
  const [activeLessonId, setActiveLessonId] = useState("ha");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selected, setSelected] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<"correct" | "wrong" | null>(null);
  const [progressState, setProgressState] = useState<Progress>(getInitialProgress);
  const [nativeSamples, setNativeSamples] = useState<NativeSample[]>([]);
  const [nativeStatus, setNativeStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [libraryQuery, setLibraryQuery] = useState("");
  const advanceTimer = useRef<number | null>(null);
  const cloudReady = useRef(!firebaseReady);

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0];
  const allItems = lessons.flatMap((lesson) => lesson.items.map((item) => ({ ...item, family: lesson.shortTitle })));
  const exercises = useMemo(() => {
    if (practiceMode === "words") return makeWordExercises();
    if (practiceMode === "listening") return makeListeningExercises(nativeSamples);
    return makeFidelExercises(activeLesson);
  }, [activeLesson, nativeSamples, practiceMode]);
  const activeExercise = exercises[exerciseIndex] ?? exercises[0];
  const activeItem = allItems.find((item) => item.id === activeExercise.tracks);
  const activeWord = words.find((word) => word.id === activeExercise.tracks);
  const activeSample = nativeSamples.find((sample) => sample.id === activeExercise.tracks);
  const lessonProgress = ((exerciseIndex + (answerState === "correct" ? 1 : 0)) / exercises.length) * 100;
  const masteredCount = allItems.filter((item) => progressState.completedLessons.includes(item.id.split("-")[0]) || item.id.startsWith("ha")).length;
  const liveWords = words.filter((word) => word.status === "live").length;
  const libraryItems = useMemo(() => {
    const query = libraryQuery.trim().toLowerCase();
    if (!query) return { lessons, words };
    return {
      lessons: lessons
        .map((lesson) => ({
          ...lesson,
          items: lesson.items.filter((item) => [item.fidel, item.sound, item.note, lesson.shortTitle].join(" ").toLowerCase().includes(query)),
        }))
        .filter((lesson) => lesson.items.length || lesson.title.toLowerCase().includes(query)),
      words: words.filter((word) =>
        [word.amharic, word.romanization, word.meaning, word.note].join(" ").toLowerCase().includes(query)
      ),
    };
  }, [libraryQuery]);

  useEffect(() => {
    window.localStorage.setItem(progressKey, JSON.stringify(progressState));
    if (user && !user.demo && db && cloudReady.current) {
      void setDoc(
        doc(db, "users", user.uid),
        {
          profile: {
            name: user.name,
            email: user.email,
            photoURL: user.photoURL ?? null,
          },
          progress: progressState,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  }, [progressState, user]);

  useEffect(() => {
    const firebaseAuth = auth;
    const firestore = db;
    if (!firebaseReady || !firebaseAuth || !firestore) {
      setAuthLoading(false);
      cloudReady.current = true;
      return;
    }

    return onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      setAuthError("");
      if (!firebaseUser) {
        setUser(getInitialDemoUser());
        setAuthLoading(false);
        cloudReady.current = true;
        return;
      }

      const nextUser = toAppUser(firebaseUser);
      setUser(nextUser);
      window.localStorage.removeItem(demoUserKey);
      try {
        const progressRef = doc(firestore, "users", nextUser.uid);
        const snapshot = await getDoc(progressRef);
        if (snapshot.exists() && snapshot.data().progress) {
          setProgressState({ ...defaultProgress, ...snapshot.data().progress });
        } else {
          await setDoc(
            progressRef,
            {
              profile: {
                name: nextUser.name,
                email: nextUser.email,
                photoURL: nextUser.photoURL ?? null,
              },
              progress: progressState,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      } catch {
        setAuthError("Signed in, but cloud progress could not sync yet.");
      } finally {
        cloudReady.current = true;
        setAuthLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (practiceMode === "listening" && nativeStatus === "idle") {
      void loadNativeSamples();
    }
  }, [practiceMode, nativeStatus]);

  function chooseLesson(lesson: Lesson) {
    if (lesson.state === "locked") return;
    clearAdvance();
    setActiveLessonId(lesson.id);
    resetExercise();
    speak(lesson.items[0].sound);
  }

  function chooseMode(mode: PracticeMode) {
    clearAdvance();
    setPracticeMode(mode);
    resetExercise();
    if (mode === "words") speak(words[0].amharic);
  }

  function choose(choice: string) {
    if (answerState !== "idle") return;
    const correct = activeExercise.answer === choice;
    setSelected(choice);
    setAnswerState(correct ? "correct" : "wrong");
    setCelebration(correct ? "correct" : "wrong");
    setProgressState((value) => ({
      ...value,
      xp: correct ? value.xp + (practiceMode === "listening" ? 8 : 5) : value.xp,
      correctAnswers: correct ? value.correctAnswers + 1 : value.correctAnswers,
      reviewQueue: correct
        ? value.reviewQueue.filter((id) => id !== activeExercise.tracks)
        : [activeExercise.tracks, ...value.reviewQueue.filter((id) => id !== activeExercise.tracks)].slice(0, 8),
    }));

    if (correct) {
      playTone(660, 0.08);
      window.setTimeout(() => playTone(880, 0.1), 95);
    } else {
      playTone(180, 0.12);
    }

    if (practiceMode !== "listening") {
      speak(getSpeechText(activeExercise, activeWord, correct ? activeExercise.answer : choice));
    }

    advanceTimer.current = window.setTimeout(() => {
      next();
      setCelebration(null);
    }, correct ? 920 : 1250);
  }

  function next() {
    if (exerciseIndex === exercises.length - 1) {
      setExerciseIndex(0);
      setProgressState((value) => ({
        ...value,
        streak: value.streak + 1,
        completedLessons: practiceMode === "fidel" ? [...new Set([...value.completedLessons, activeLesson.id])] : value.completedLessons,
      }));
    } else {
      setExerciseIndex((value) => value + 1);
    }
    setSelected(null);
    setAnswerState("idle");
  }

  function resetExercise() {
    setExerciseIndex(0);
    setSelected(null);
    setAnswerState("idle");
    setCelebration(null);
  }

  function clearAdvance() {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
  }

  async function loadNativeSamples() {
    if (nativeStatus === "loading") return;
    setNativeStatus("loading");
    try {
      const response = await fetch(
        "https://datasets-server.huggingface.co/rows?dataset=hadamard-2/alffa-amharic-v2&config=default&split=test&offset=7&length=6"
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

  function playNativeSample(sample?: NativeSample | Exercise) {
    const audioUrl = sample?.audioUrl;
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    setProgressState((value) => ({ ...value, nativeListens: value.nativeListens + 1 }));
    void audio.play();
  }

  function resetProgress() {
    clearAdvance();
    setProgressState(defaultProgress);
    resetExercise();
  }

  async function signInWithGoogle() {
    setAuthError("");
    if (!firebaseReady || !auth) {
      const demoUser: AppUser = {
        uid: "demo-google-user",
        name: "Google demo learner",
        email: "demo@fidellabs.local",
        demo: true,
      };
      window.localStorage.setItem(demoUserKey, JSON.stringify(demoUser));
      setUser(demoUser);
      setShowAuthPanel(false);
      return;
    }

    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
      setShowAuthPanel(false);
    } catch {
      setAuthError("Google sign-in did not complete. Try again or check your Firebase settings.");
      setAuthLoading(false);
    }
  }

  async function signOutUser() {
    clearAdvance();
    window.localStorage.removeItem(demoUserKey);
    setUser(null);
    if (auth && auth.currentUser) {
      await signOut(auth);
    }
  }

  if (authLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f4] p-6 text-black">
        <div className="rounded-[2rem] border border-black/10 bg-white p-8 text-center shadow-2xl shadow-black/10">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-black text-white">
            <Waves size={28} />
          </div>
          <h1 className="mt-5 text-3xl font-black">Loading Fidel Labs</h1>
          <p className="mt-2 text-sm font-bold text-black/45">Checking your saved progress.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-black">
      <div className="mx-auto grid min-h-screen w-full max-w-[1540px] gap-5 px-4 py-4 md:grid-cols-[108px_minmax(0,1fr)] md:gap-7 md:px-7 md:py-7 xl:grid-cols-[124px_minmax(0,1fr)] xl:gap-9 xl:px-9">
        <nav className="fixed bottom-4 left-4 right-4 z-40 grid grid-cols-3 gap-2 rounded-[1.5rem] border border-black/10 bg-white/90 p-2 shadow-2xl shadow-black/10 backdrop-blur md:sticky md:left-auto md:right-auto md:top-7 md:bottom-auto md:h-[calc(100vh-3.5rem)] md:grid-cols-1 md:content-start md:gap-3 md:p-3">
          <NavButton active={view === "learn"} icon={<BookOpen size={20} />} label="Learn" onClick={() => setView("learn")} />
          <NavButton active={view === "library"} icon={<Library size={20} />} label="Library" onClick={() => setView("library")} />
          <NavButton active={view === "roadmap"} icon={<Map size={20} />} label="Plan" onClick={() => setView("roadmap")} />
        </nav>

        <div className="min-w-0">
          <header className="mb-5 flex flex-col gap-3 rounded-[1.5rem] border border-black/10 bg-white/88 p-3 shadow-xl shadow-black/5 backdrop-blur md:flex-row md:items-center md:justify-between md:p-4">
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="" className="size-11 rounded-2xl border border-black/10" />
              <div>
                <p className="text-sm font-black">Fidel Labs</p>
                <p className="text-xs font-bold text-black/45">Amharic practice in guest mode or with cloud progress</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 md:justify-end">
              <div className="min-w-0 text-left md:text-right">
                <p className="truncate text-sm font-black">{user ? user.name : "Learning as guest"}</p>
                <p className="truncate text-xs font-bold text-black/45">
                  {user ? (user.demo ? "Demo account" : "Cloud sync on") : "Progress saves on this device"}
                </p>
              </div>
              <button
                onClick={user ? signOutUser : () => setShowAuthPanel(true)}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-2xl bg-black px-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-black/85"
              >
                {user ? "Sign out" : "Sign in"}
              </button>
            </div>
          </header>
          {authError && <p className="mb-4 rounded-2xl border border-black/10 bg-white p-3 text-sm font-bold text-black/60">{authError}</p>}

        {view === "learn" && (
          <section className="grid gap-5 pb-24 md:pb-0">
            <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start xl:grid-cols-[430px_minmax(0,1fr)] xl:gap-8">
              <div className="rounded-[2rem] bg-black p-6 text-white md:p-8 lg:sticky lg:top-7 xl:p-10">
                <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/50">
                  <Waves size={14} />
                  Fidel Labs
                </p>
                <h1 className="text-5xl font-black leading-[0.92] tracking-tight md:text-6xl xl:text-7xl">
                  Learn Amharic through fidel, words, and real voices.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
                  Practice the script, learn useful words, then listen to authentic ALFFA Amharic clips.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3 lg:grid-cols-1 xl:grid-cols-3">
                  <Metric icon={<Flame size={19} />} label="day streak" value={progressState.streak} dark />
                  <Metric icon={<GraduationCap size={19} />} label="XP earned" value={progressState.xp} dark />
                  <Metric icon={<Target size={19} />} label="mastered" value={`${masteredCount}/${allItems.length}`} dark />
                </div>
              </div>

              <div className="grid gap-5 xl:gap-6">
                <div className="grid grid-cols-3 gap-3 rounded-[1.5rem] border border-black/10 bg-white p-2">
                  <ModeButton active={practiceMode === "fidel"} icon={<BookOpen size={18} />} label="Fidel" onClick={() => chooseMode("fidel")} />
                  <ModeButton active={practiceMode === "words"} icon={<Mic2 size={18} />} label="Words" onClick={() => chooseMode("words")} />
                  <ModeButton active={practiceMode === "listening"} icon={<Headphones size={18} />} label="Listen" onClick={() => chooseMode("listening")} />
                </div>

                {practiceMode === "fidel" && (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:gap-4">
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
                            {progressState.completedLessons.includes(lesson.id) ? "done" : lesson.unlock}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {practiceMode === "words" && (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-4">
                    {words.slice(0, 6).map((word) => (
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

                {practiceMode === "listening" && (
                  <div className="rounded-[1.5rem] border border-black/10 bg-white p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-2xl font-black">Native listening lab</h2>
                        <p className="mt-1 text-sm leading-6 text-black/55">
                          ALFFA clips are full native sentences. Load them, play one, then identify the matching transcript.
                        </p>
                      </div>
                      <button onClick={loadNativeSamples} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-black text-white">
                        <Headphones size={17} />
                        {nativeStatus === "loading" ? "Loading..." : nativeStatus === "ready" ? "Refresh clips" : "Load clips"}
                      </button>
                    </div>
                    {nativeStatus === "error" && <p className="mt-4 text-sm font-bold text-red-600">Could not load Hugging Face clips. Try again in a moment.</p>}
                  </div>
                )}

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-6">
                  <LessonRunner
                    activeExercise={activeExercise}
                    activeItem={activeItem}
                    activeSample={activeSample}
                    activeWord={activeWord}
                    answerState={answerState}
                    celebration={celebration}
                    exerciseIndex={exerciseIndex}
                    exercisesLength={exercises.length}
                    lesson={activeLesson}
                    mode={practiceMode}
                    onChoose={choose}
                    onPlayNative={() => playNativeSample(activeSample ?? activeExercise)}
                    onSpeak={speak}
                    progress={lessonProgress}
                    selected={selected}
                  />

                  <aside className="grid content-start gap-4 xl:gap-5">
                    <Panel title="Session stack" eyebrow={`${progressState.reviewQueue.length} review items`}>
                      <div className="grid gap-2">
                        {progressState.reviewQueue.slice(0, 4).map((id) => {
                          const item = allItems.find((entry) => entry.id === id);
                          const word = words.find((entry) => entry.id === id);
                          const sample = nativeSamples.find((entry) => entry.id === id);
                          if (!item && !word && !sample) return null;
                          return (
                            <div key={id} className="rounded-2xl border border-black/10 bg-[#fafafa] p-3">
                              <span className="font-[var(--ethiopic)] text-3xl font-black">{item?.fidel ?? word?.amharic ?? "ፊ"}</span>
                              <strong className="ml-3">{item?.sound ?? word?.romanization ?? "listen"}</strong>
                              <p className="mt-1 line-clamp-2 text-xs text-black/50">{item?.note ?? word?.meaning ?? sample?.transcription}</p>
                            </div>
                          );
                        })}
                      </div>
                    </Panel>

                    <Panel title="Audio quality" eyebrow="source plan">
                      <div className="grid gap-3">
                        <QualityRow label="Fidel syllables" value="needs native recording" />
                        <QualityRow label="Beginner words" value="mine or record clips" />
                        <QualityRow label="Native listening" value="ALFFA v2 live" />
                      </div>
                    </Panel>

                    <Panel title="Quick words" eyebrow={`${liveWords} live words`}>
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
                  </aside>
                </div>
              </div>
            </div>
          </section>
        )}

        {view === "library" && (
          <section className="min-h-[calc(100vh-3.5rem)] rounded-[2rem] bg-white p-5 pb-24 md:p-8 md:pb-8 xl:p-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-black/38">
                  <Library size={15} />
                  Library
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Search fidel and words.</h2>
              </div>
              <label className="flex min-h-14 w-full max-w-md items-center gap-3 rounded-2xl border border-black/10 bg-[#f7f7f4] px-4">
                <Search size={18} className="text-black/40" />
                <input
                  value={libraryQuery}
                  onChange={(event) => setLibraryQuery(event.target.value)}
                  placeholder="Search ha, ሰላም, water..."
                  className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-black/35"
                />
              </label>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:gap-6">
              {libraryItems.lessons.map((lesson) => (
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
                  <p className="mt-1 text-sm text-black/55">Tap words for prototype voice now; native word clips are the next audio pass.</p>
                </div>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-black/40">
                  <Headphones size={15} />
                  {libraryItems.words.length} entries
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {libraryItems.words.map((word) => (
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
          <section className="min-h-[calc(100vh-3.5rem)] rounded-[2rem] bg-white p-5 pb-24 md:p-8 md:pb-8 xl:p-10">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-[#f7f7f4]">
                <div className="bg-black p-6 text-white md:p-8">
                  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-white/45">Unit 1</p>
                      <h2 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Fidel foundations</h2>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
                        Follow the path: learn a family, review it, add words, then unlock native listening.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setView("learn");
                        chooseMode("fidel");
                      }}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-black transition hover:bg-white/90"
                    >
                      <Zap size={17} />
                      Start next lesson
                    </button>
                  </div>
                </div>

                <div className="relative mx-auto grid max-w-2xl gap-6 px-5 py-8 md:px-8 md:py-10">
                  <div className="absolute left-1/2 top-10 hidden h-[calc(100%-5rem)] w-1 -translate-x-1/2 rounded-full bg-black/8 md:block" />
                  {[
                    { title: "ሀ Family", copy: "Seven core forms", state: "done", icon: "ሀ", side: "left" },
                    { title: "Review sounds", copy: "Listen and match", state: "active", icon: "headphones", side: "right" },
                    { title: "ለ Family", copy: "Build the second set", state: "open", icon: "ለ", side: "left" },
                    { title: "First words", copy: "ሰላም, ውሃ, ቤት", state: "open", icon: "ሰ", side: "right" },
                    { title: "Native listening", copy: "ALFFA transcript match", state: "open", icon: "play", side: "left" },
                    { title: "በ Family", copy: "Unlock after practice", state: "locked", icon: "በ", side: "right" },
                  ].map((node, index) => (
                    <div
                      key={node.title}
                      className={[
                        "relative z-10 grid items-center gap-4 md:grid-cols-[1fr_86px_1fr]",
                        node.side === "right" ? "" : "",
                      ].join(" ")}
                    >
                      <div className={["hidden md:block", node.side === "left" ? "order-1" : "order-3"].join(" ")}>
                        <PathLabel title={node.title} copy={node.copy} state={node.state} align={node.side === "left" ? "right" : "left"} />
                      </div>
                      <button
                        onClick={() => {
                          if (node.state === "locked") return;
                          setView("learn");
                          if (node.title.includes("word") || node.title.includes("words")) chooseMode("words");
                          else if (node.title.includes("listening")) chooseMode("listening");
                          else chooseMode("fidel");
                        }}
                        className={[
                          "order-2 mx-auto grid size-20 place-items-center rounded-full border-4 text-center font-black shadow-xl transition md:size-24",
                          node.state === "done" ? "border-black bg-black text-white shadow-black/20" : "",
                          node.state === "active" ? "border-[#58cc02] bg-[#58cc02] text-white shadow-[#58cc02]/25 hover:-translate-y-1" : "",
                          node.state === "open" ? "border-black/10 bg-white text-black hover:-translate-y-1 hover:border-black" : "",
                          node.state === "locked" ? "cursor-not-allowed border-black/10 bg-black/5 text-black/25 shadow-none" : "",
                        ].join(" ")}
                        aria-label={node.title}
                      >
                        <span className="font-[var(--ethiopic)] text-3xl md:text-4xl">{renderPathIcon(node.icon, node.state)}</span>
                      </button>
                      <div className={["md:hidden", node.side === "left" ? "order-3" : "order-3"].join(" ")}>
                        <PathLabel title={node.title} copy={node.copy} state={node.state} align="center" />
                      </div>
                      <div className={["hidden md:block", node.side === "left" ? "order-3" : "order-1"].join(" ")}>
                        {index === 1 && (
                          <div className="rounded-3xl border border-[#58cc02]/30 bg-[#58cc02]/10 p-4">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3b8f00]">Current</p>
                            <p className="mt-1 text-sm font-bold text-black/60">This is where the next session starts.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="grid content-start gap-4">
                <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-white/40">Today</p>
                      <h3 className="mt-2 text-3xl font-black">{progressState.xp} XP</h3>
                    </div>
                    <div className="grid size-16 place-items-center rounded-2xl bg-[#58cc02] text-white">
                      <Trophy size={30} />
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <MiniStat label="Streak" value={progressState.streak} />
                    <MiniStat label="Correct" value={progressState.correctAnswers} />
                    <MiniStat label="Listens" value={progressState.nativeListens} />
                  </div>
                </div>

                <div className="rounded-[2rem] border border-black/10 bg-[#f7f7f4] p-6">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-black/35">Next chest</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="grid size-16 place-items-center rounded-2xl border-2 border-black bg-white">
                      <Star size={30} fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">25 XP reward</h3>
                      <p className="mt-1 text-sm font-bold text-black/50">Finish two more nodes to unlock it.</p>
                    </div>
                  </div>
                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-black/10">
                    <div className="h-full w-2/3 rounded-full bg-[#58cc02]" />
                  </div>
                </div>

                <button onClick={resetProgress} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 text-sm font-black text-black/65 transition hover:border-black hover:text-black">
                  <RotateCcw size={17} />
                  Reset local progress
                </button>
              </aside>
            </div>
          </section>
        )}
        </div>
      </div>
      {showAuthPanel && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm md:p-8"
          onClick={() => setShowAuthPanel(false)}
        >
          <div className="w-full max-w-md" onClick={(event) => event.stopPropagation()}>
            <SignInScreen
              authError={authError}
              firebaseReady={firebaseReady}
              onSignIn={signInWithGoogle}
              onSkip={() => setShowAuthPanel(false)}
              onClose={() => setShowAuthPanel(false)}
            />
          </div>
        </div>
      )}
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

function SignInScreen({
  authError,
  firebaseReady,
  onSignIn,
  onSkip,
  onClose,
}: {
  authError: string;
  firebaseReady: boolean;
  onSignIn: () => void;
  onSkip: () => void;
  onClose: () => void;
}) {
  const helperText = firebaseReady
    ? "Your Fidel Labs progress will sync to your Google account."
    : "Demo mode active: this preview saves progress on this device until the cloud sign-in keys are connected.";

  return (
    <Signup1
      heading="Fidel Labs"
      logo={{
        url: "#",
        src: "/favicon.svg",
        alt: "Fidel Labs logo",
        title: "Fidel Labs",
      }}
      signupText="Save progress with Google"
      googleText="Continue with Google"
      loginText=""
      loginUrl="#"
      supportingText="Save your Amharic fidel path, XP, streak, reviews, and listening practice."
      helperText={helperText}
      errorText={authError}
      onGoogleSignIn={onSignIn}
      skipText="Keep learning as guest"
      onSkip={onSkip}
      onClose={onClose}
    />
  );
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
      aria-label={label}
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
      aria-label={label}
      style={active ? { backgroundColor: "#000", color: "#fff" } : undefined}
      className={[
        "flex min-h-14 items-center justify-center gap-2 rounded-[1.1rem] text-sm font-black transition",
        active ? "bg-black text-white hover:bg-black" : "text-black/55 hover:bg-black/5 hover:text-black",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
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

function QualityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-[#fafafa] p-3">
      <span className="text-sm font-black">{label}</span>
      <span className="text-right text-xs font-bold text-black/45">{value}</span>
    </div>
  );
}

function renderPathIcon(icon: string, state: string) {
  if (state === "done") return <Check size={34} />;
  if (state === "locked") return <Lock size={28} />;
  if (icon === "headphones") return <Headphones size={34} />;
  if (icon === "play") return <Play size={34} fill="currentColor" />;
  return icon;
}

function PathLabel({
  align,
  copy,
  state,
  title,
}: {
  align: "left" | "right" | "center";
  copy: string;
  state: string;
  title: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-black/10 bg-white p-4 shadow-sm",
        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        {align === "right" && <span className="text-xs font-black uppercase tracking-[0.18em] text-black/35">{state}</span>}
        <h3 className="font-[var(--ethiopic)] text-lg font-black">{title}</h3>
        {align !== "right" && <span className="text-xs font-black uppercase tracking-[0.18em] text-black/35">{state}</span>}
      </div>
      <p className="mt-2 text-sm font-bold leading-6 text-black/50">{copy}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-center">
      <strong className="block text-xl">{value}</strong>
      <span className="text-xs font-bold text-white/45">{label}</span>
    </div>
  );
}

function LessonRunner({
  activeExercise,
  activeItem,
  activeSample,
  activeWord,
  answerState,
  celebration,
  exerciseIndex,
  exercisesLength,
  lesson,
  mode,
  onChoose,
  onPlayNative,
  onSpeak,
  progress,
  selected,
}: {
  activeExercise: Exercise;
  activeItem?: FidelItem & { family: string };
  activeSample?: NativeSample;
  activeWord?: Word;
  answerState: AnswerState;
  celebration: "correct" | "wrong" | null;
  exerciseIndex: number;
  exercisesLength: number;
  lesson: Lesson;
  mode: PracticeMode;
  onChoose: (choice: string) => void;
  onPlayNative: () => void;
  onSpeak: (text: string) => void;
  progress: number;
  selected: string | null;
}) {
  const isWordMode = mode === "words";
  const isListeningMode = mode === "listening";
  const promptIsFidel = /[\u1200-\u137F]/.test(activeExercise.prompt);
  const promptLabel =
    activeExercise.promptType === "fidel-to-sound"
      ? "Choose the sound"
      : activeExercise.promptType === "sound-to-fidel"
        ? "Choose the fidel"
        : activeExercise.promptType === "word-to-meaning"
          ? "Choose the meaning"
          : activeExercise.promptType === "meaning-to-word"
            ? "Choose the Amharic word"
            : "Choose the matching transcript";

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
        <p className="font-[var(--ethiopic)] text-lg font-black">
          {isListeningMode ? "ALFFA native listening" : isWordMode ? "Beginner words" : lesson.title}
        </p>
        <h2 className="mt-5 text-2xl font-black">{promptLabel}</h2>
        <div
          className={[
            "mt-6 grid min-h-32 place-items-center font-black",
            isListeningMode ? "text-3xl leading-tight md:text-4xl" : promptIsFidel ? "font-[var(--ethiopic)] text-8xl" : "text-5xl leading-tight md:text-6xl",
          ].join(" ")}
        >
          {activeExercise.prompt}
        </div>
        <button
          className="mx-auto mt-4 grid size-14 place-items-center rounded-full bg-black text-white"
          aria-label={isListeningMode ? "Play native clip" : "Play sound"}
          onClick={() => (isListeningMode ? onPlayNative() : onSpeak(activeWord?.amharic ?? activeItem?.sound ?? activeExercise.prompt))}
        >
          {isListeningMode ? <Play size={25} fill="currentColor" /> : <Volume2 size={26} />}
        </button>
        {(activeItem || activeWord || activeSample) && (
          <p className="mx-auto mt-4 max-w-md text-sm font-bold leading-6 text-black/45">
            {activeItem?.note ?? (activeWord ? `${activeWord.romanization} · ${activeWord.note}` : activeSample?.id)}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {activeExercise.choices.map((choice) => {
          const correct = answerState !== "idle" && activeExercise.answer === choice;
          const wrong = selected === choice && answerState === "wrong";
          const isAmharic = /[\u1200-\u137F]/.test(choice);
          return (
            <button
              key={choice}
              onClick={() => onChoose(choice)}
              disabled={answerState !== "idle"}
              className={[
                "min-h-24 rounded-2xl border p-4 text-center transition hover:-translate-y-0.5",
                isListeningMode ? "text-left" : "",
                correct ? "border-black bg-black text-white" : "",
                wrong ? "border-red-500 bg-red-50 text-red-700" : "",
                !correct && !wrong ? "border-black/10 bg-[#fafafa]" : "",
              ].join(" ")}
            >
              <strong className={["block", isAmharic ? "font-[var(--ethiopic)] text-2xl leading-8" : "text-xl"].join(" ")}>
                {choice}
              </strong>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-black/55">
          {answerState === "idle" && (isListeningMode ? "Play the clip, then choose." : "Choose an answer to continue.")}
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
