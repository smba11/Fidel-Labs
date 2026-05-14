import { ArrowRight, Cloud, Headphones, MessageCircle, UserRound } from "lucide-react";

import { LessonCard } from "@/components/product/lesson-card";
import { ProgressStats } from "@/components/product/progress-stats";
import { conversations, fidelFamilies, vocabulary } from "@/data/curriculum";
import type { AppUser, Progress, RouteId } from "@/types/learning";

export function Dashboard({
  progress,
  user,
  onRoute,
  onSelectFamily,
  onAuth,
}: {
  progress: Progress;
  user: AppUser | null;
  onRoute: (route: RouteId) => void;
  onSelectFamily: (id: string) => void;
  onAuth: () => void;
}) {
  const nextFamily = fidelFamilies.find((family) => !progress.completedFamilies.includes(family.id)) ?? fidelFamilies[0];
  const signedIn = Boolean(user && !user.demo);
  const firstName = user?.name?.split(" ")[0] || "learner";

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel relative overflow-hidden rounded-[2.2rem] p-7 text-white md:p-10">
          <div className="absolute -right-10 -top-10 size-56 rounded-full bg-[#58cc02]/20 blur-3xl" />
          {signedIn && (
            <div className="mb-7 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/8 p-3">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="size-12 rounded-2xl object-cover" />
              ) : (
                <div className="grid size-12 place-items-center rounded-2xl bg-white text-black">
                  <UserRound size={20} />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-black">My Lab for {firstName}</p>
                <p className="truncate text-xs font-bold text-white/45">Cloud progress is connected</p>
              </div>
            </div>
          )}
          <h1 className="max-w-2xl text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
            {signedIn ? `${firstName}'s Amharic lab.` : "Today's Amharic practice."}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
            {signedIn
              ? "Your saved path is ready. Keep building Fidel confidence, conversation rhythm, and culture memory."
              : "Keep the session short: one Fidel row, one real phrase, one culture note."}
          </p>
          <button onClick={() => onRoute("fidel")} className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-black transition hover:-translate-y-0.5">
            Continue path
            <ArrowRight size={18} />
          </button>
          {!signedIn && (
            <button onClick={onAuth} className="mt-3 inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/15 px-5 text-sm font-black text-white/70 transition hover:bg-white/10 hover:text-white md:hidden">
              Save progress with Google
            </button>
          )}
        </div>

        <div className="grid content-start gap-4">
          <ProgressStats progress={progress} totalFamilies={fidelFamilies.length} />
          <div className="grid gap-4 sm:grid-cols-2">
            <button onClick={() => onRoute("conversation")} className="soft-card rounded-[1.5rem] p-5 text-left">
              <MessageCircle size={24} />
              <h2 className="mt-5 text-2xl font-black">{conversations[0].title}</h2>
              <p className="mt-2 text-sm font-bold text-white/50">{conversations[0].scenario}</p>
            </button>
            {signedIn ? (
              <div className="rounded-[1.5rem] border border-[#58cc02]/40 bg-[#58cc02] p-5 text-black shadow-xl shadow-[#58cc02]/10">
                <Cloud size={24} />
                <h2 className="mt-5 text-2xl font-black">Cloud saved</h2>
                <p className="mt-2 text-sm font-bold text-black/65">Progress follows your Google account.</p>
                <button onClick={onAuth} className="mt-5 text-sm font-black text-black/70 underline underline-offset-4 hover:text-black">
                  Sign out
                </button>
              </div>
            ) : (
              <button onClick={() => onRoute("library")} className="soft-card rounded-[1.5rem] p-5 text-left">
                <Headphones size={24} />
                <h2 className="mt-5 text-2xl font-black">{vocabulary.length} starter words</h2>
                <p className="mt-2 text-sm font-bold text-white/50">Formal, street, and culture notes.</p>
              </button>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black">Next Fidel family</h2>
            <p className="mt-1 text-sm font-bold text-white/45">Full Amharic family coverage is now in the app.</p>
          </div>
          <button onClick={() => onRoute("fidel")} className="hidden text-sm font-black text-[#58cc02] underline underline-offset-4 md:block">View all</button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[nextFamily, ...fidelFamilies.filter((family) => family.id !== nextFamily.id).slice(0, 2)].map((family) => (
            <LessonCard
              key={family.id}
              family={family}
              complete={progress.completedFamilies.includes(family.id)}
              onSelect={() => {
                onSelectFamily(family.id);
                onRoute("fidel");
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
