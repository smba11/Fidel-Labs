import { ArrowRight, Cloud, Compass, Headphones, MessageCircle, UserRound } from "lucide-react";

import { LessonCard } from "@/components/product/lesson-card";
import { ProficiencyPanel } from "@/components/product/proficiency-panel";
import { ProgressStats } from "@/components/product/progress-stats";
import { RoadmapView } from "@/components/product/roadmap-view";
import { conversations, fidelFamilies, vocabulary } from "@/data/curriculum";
import { createRoadmap, defaultLearnerProfile, getProficiencyForProgress } from "@/data/learning-architecture";
import type { AppUser, Progress, RoadmapNode, RouteId } from "@/types/learning";

export function Dashboard({
  progress,
  user,
  onRoute,
  onSelectFamily,
  onSelectNode,
  onAuth,
}: {
  progress: Progress;
  user: AppUser | null;
  onRoute: (route: RouteId) => void;
  onSelectFamily: (id: string) => void;
  onSelectNode: (node: RoadmapNode) => void;
  onAuth: () => void;
}) {
  const nextFamily = fidelFamilies.find((family) => !progress.completedFamilies.includes(family.id)) ?? fidelFamilies[0];
  const signedIn = Boolean(user && !user.demo);
  const firstName = user?.name?.split(" ")[0] || "learner";
  const profile = progress.profile ?? defaultLearnerProfile;
  const roadmap = createRoadmap(profile, progress.completedRoadmapNodes, progress.xp);
  const proficiency = getProficiencyForProgress(progress.xp);
  const nextNode = roadmap.nodes.find((node) => !progress.completedRoadmapNodes.includes(node.id)) ?? roadmap.nodes[0];

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel relative overflow-hidden rounded-[2.2rem] p-7 text-white md:p-10">
          <div className="absolute -right-10 -top-10 size-56 rounded-full bg-[#d6b16a]/16 blur-3xl" />
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
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/38">{roadmap.title}</p>
          <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
            {signedIn ? `${firstName}'s Amharic roadmap.` : "Your Amharic roadmap."}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
            {signedIn
              ? "A personalized path for speaking, reading, listening, register, and culture. Cloud progress is connected."
              : "Start with a path built around family, confidence, Fidel reading, and cultural connection. Sign in later if you want sync."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => onSelectNode(nextNode)} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-black transition hover:-translate-y-0.5">
              Continue: {nextNode.title}
              <ArrowRight size={18} />
            </button>
            <button onClick={() => onRoute("onboarding")} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 text-sm font-black text-white/72 transition hover:bg-white/10 hover:text-white">
              Tune path
              <Compass size={18} />
            </button>
          </div>
          <button onClick={() => onRoute("progress")} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#f0d49a] underline underline-offset-4">
            View proficiency model
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
              <div className="rounded-[1.5rem] border border-[#d6b16a]/35 bg-[#d6b16a] p-5 text-black shadow-xl shadow-[#d6b16a]/10">
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

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <RoadmapView roadmap={roadmap} completed={progress.completedRoadmapNodes} onSelectNode={onSelectNode} />
        <div className="grid content-start gap-4">
          <ProficiencyPanel current={proficiency} xp={progress.xp} />
          <div className="surface-panel rounded-[2rem] p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/38">Speaking confidence</p>
            <h2 className="mt-3 text-5xl font-black">{progress.speakingConfidence}%</h2>
            <p className="mt-3 text-sm font-bold leading-6 text-white/55">Tracked through conversation reps, listening practice, and completed speaking nodes.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black">Next Fidel family</h2>
            <p className="mt-1 text-sm font-bold text-white/45">Full Amharic family coverage is now in the app.</p>
          </div>
          <button onClick={() => onRoute("fidel")} className="hidden text-sm font-black text-[#d6b16a] underline underline-offset-4 md:block">View all</button>
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
