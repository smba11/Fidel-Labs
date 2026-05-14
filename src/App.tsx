import { useEffect, useMemo, useRef, useState } from "react";
import { getRedirectResult, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { AppShell } from "@/components/product/app-shell";
import { AuthDialog } from "@/components/product/auth-dialog";
import { LoadingState } from "@/components/product/loading-state";
import { conversations, fidelFamilies } from "@/data/curriculum";
import { defaultProgress, demoUserKey, readProgress, writeProgress } from "@/data/progress";
import { useHashRoute } from "@/hooks/use-hash-route";
import { auth, db, firebaseReady, googleProvider } from "@/lib/firebase";
import { ConversationLessonScreen } from "@/screens/conversation-screen";
import { Dashboard } from "@/screens/dashboard";
import { FidelPracticeScreen } from "@/screens/fidel-practice";
import { LandingPage } from "@/screens/landing-page";
import { LibraryScreen } from "@/screens/library-screen";
import { ProgressScreen } from "@/screens/progress-screen";
import type { AppUser, Progress } from "@/types/learning";

function readDemoUser(): AppUser | null {
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

function authMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code?: string }).code) : "";
  if (code.includes("unauthorized-domain")) return "Firebase is blocking this domain. Add fidel-labs.vercel.app in Authentication settings.";
  if (code.includes("operation-not-allowed")) return "Google sign-in is not enabled yet in Firebase Authentication.";
  if (code.includes("popup-blocked")) return "Popup was blocked, so we are switching to a redirect sign-in.";
  return "Google sign-in could not finish. Check Firebase Authentication, authorized domains, and Firestore setup.";
}

export function App() {
  const [route, setRoute] = useHashRoute();
  const [user, setUser] = useState<AppUser | null>(readDemoUser);
  const [progress, setProgress] = useState<Progress>(readProgress);
  const [authOpen, setAuthOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(firebaseReady);
  const [authError, setAuthError] = useState("");
  const [activeFamilyId, setActiveFamilyId] = useState("ha");
  const [activeConversationId, setActiveConversationId] = useState(conversations[0].id);
  const [libraryQuery, setLibraryQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const cloudReady = useRef(!firebaseReady);
  const feedbackTimer = useRef<number | null>(null);

  const activeFamily = useMemo(
    () => fidelFamilies.find((family) => family.id === activeFamilyId) ?? fidelFamilies[0],
    [activeFamilyId]
  );
  const activeConversation = useMemo(
    () => conversations.find((lesson) => lesson.id === activeConversationId) ?? conversations[0],
    [activeConversationId]
  );

  useEffect(() => {
    writeProgress(progress);
    if (user && !user.demo && db && cloudReady.current) {
      void setDoc(
        doc(db, "users", user.uid),
        {
          profile: {
            name: user.name,
            email: user.email,
            photoURL: user.photoURL ?? null,
          },
          progress,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  }, [progress, user]);

  useEffect(() => {
    const firebaseAuth = auth;
    const firestore = db;
    if (!firebaseReady || !firebaseAuth || !firestore) {
      setAuthLoading(false);
      cloudReady.current = true;
      return;
    }

    void getRedirectResult(firebaseAuth).catch((error) => setAuthError(authMessage(error)));

    return onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      setAuthError("");
      if (!firebaseUser) {
        setUser(readDemoUser());
        setAuthLoading(false);
        cloudReady.current = true;
        return;
      }

      const nextUser = toAppUser(firebaseUser);
      setUser(nextUser);
      setAuthOpen(false);
      window.localStorage.removeItem(demoUserKey);

      try {
        const userRef = doc(firestore, "users", nextUser.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists() && snapshot.data().progress) {
          setProgress({ ...defaultProgress, ...snapshot.data().progress });
        } else {
          await setDoc(
            userRef,
            {
              profile: {
                name: nextUser.name,
                email: nextUser.email,
                photoURL: nextUser.photoURL ?? null,
              },
              progress,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      } catch (error) {
        setAuthError(`Signed in, but progress could not sync. ${authMessage(error)}`);
      } finally {
        cloudReady.current = true;
        setAuthLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    };
  }, []);

  function showFeedback(message: string) {
    setFeedback(message);
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setFeedback(""), 2200);
  }

  async function signInWithGoogle() {
    setAuthError("");
    if (!firebaseReady || !auth) {
      setAuthError("Firebase is not connected in this deployment yet. Guest progress will keep working.");
      return;
    }

    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const message = authMessage(error);
      setAuthError(message);
      setAuthLoading(false);
      if (message.includes("redirect")) {
        await signInWithRedirect(auth, googleProvider);
      }
    }
  }

  async function signOutUser() {
    window.localStorage.removeItem(demoUserKey);
    setUser(null);
    if (auth?.currentUser) await signOut(auth);
  }

  function completeFamily(id: string) {
    const family = fidelFamilies.find((item) => item.id === id);
    setProgress((value) => ({
      ...value,
      xp: value.completedFamilies.includes(id) ? value.xp : value.xp + 15,
      completedFamilies: [...new Set([...value.completedFamilies, id])],
      correctAnswers: value.correctAnswers + 1,
      lastPracticedAt: new Date().toISOString(),
    }));
    showFeedback(`${family?.base ?? "Fidel"} saved · +15 XP`);
  }

  function completeConversation(id: string, xp: number) {
    const lesson = conversations.find((item) => item.id === id);
    setProgress((value) => ({
      ...value,
      xp: value.completedConversations.includes(id) ? value.xp : value.xp + xp,
      completedConversations: [...new Set([...value.completedConversations, id])],
      correctAnswers: value.correctAnswers + 1,
      lastPracticedAt: new Date().toISOString(),
    }));
    showFeedback(`${lesson?.title ?? "Conversation"} complete · +${xp} XP`);
  }

  function resetProgress() {
    setProgress(defaultProgress);
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[\u1200-\u137F]/.test(text) ? "am-ET" : "en-US";
    utterance.rate = 0.78;
    window.speechSynthesis.speak(utterance);
  }

  if (authLoading && user) {
    return <LoadingState label="Syncing your account" />;
  }

  const screen =
    route === "home" ? (
      <LandingPage onStart={setRoute} />
    ) : route === "fidel" ? (
      <FidelPracticeScreen activeFamily={activeFamily} progress={progress} onComplete={completeFamily} onSelectFamily={setActiveFamilyId} onSpeak={speak} />
    ) : route === "conversation" ? (
      <ConversationLessonScreen
        activeConversation={activeConversation}
        progress={progress}
        onComplete={completeConversation}
        onSelect={setActiveConversationId}
        onSpeak={speak}
      />
    ) : route === "library" ? (
      <LibraryScreen query={libraryQuery} onQuery={setLibraryQuery} onSpeak={speak} />
    ) : route === "progress" ? (
      <ProgressScreen progress={progress} onReset={resetProgress} />
    ) : (
      <Dashboard
        progress={progress}
        user={user}
        onRoute={setRoute}
        onSelectFamily={setActiveFamilyId}
        onAuth={user ? signOutUser : () => setAuthOpen(true)}
      />
    );

  return (
    <>
      <AppShell route={route} user={user} onAuth={user ? signOutUser : () => setAuthOpen(true)} onRoute={setRoute}>
        {screen}
      </AppShell>
      {authOpen && <AuthDialog error={authError} firebaseReady={firebaseReady} onClose={() => setAuthOpen(false)} onSignIn={signInWithGoogle} />}
      {feedback && (
        <div
          aria-live="polite"
          className="fidel-pop fixed left-1/2 top-5 z-50 w-[min(92vw,380px)] -translate-x-1/2 rounded-[1.5rem] border border-[#58cc02]/40 bg-[#58cc02] px-5 py-4 text-center text-sm font-black text-black shadow-2xl shadow-[#58cc02]/20"
        >
          <span className="fidel-burst left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2" />
          {feedback}
        </div>
      )}
    </>
  );
}
