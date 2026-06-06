import { ArrowRight, Cloud, Compass, Headphones, MessageCircle, UserRound } from "lucide-react";

import { LessonCard } from "@/components/product/lesson-card";
import { ProficiencyPanel } from "@/components/product/proficiency-panel";
import { ProgressStats } from "@/components/product/progress-stats";
import { RoadmapView } from "@/components/product/roadmap-view";
import { conversations, fidelFamilies, vocabulary } from "@/data/curriculum";
import { getProficiencyForProgress } from "@/data/learning-architecture";
import { buildReviewQueue, getRecommendedNode, getWeakSkills } from "@/data/learning-engine";
import type { AppUser, PersonalizedRoadmap, Progress, RoadmapNode, RouteId } from "@/types/learning";

export function Dashboard({
  progress,
  user,
  roadmap,
  onRoute,
  onSelectFamily,
  onSelectNode,
  onAuth,
}: {
  progress: Progress;
  user: AppUser | null;
  roadmap: PersonalizedRoadmap;
  onRoute: (route: RouteId) => void;
  onSelectFamily: (id: string) => void;
  onSelectNode: (node: RoadmapNode) => void;
  onAuth: () => void;
}) {
  const nextFamily = fidelFamilies.find((family) => !progress.completedFamilies.includes(family.id)) ?? fidelFamilies[0];
  const signedIn = Boolean(user && !user.demo);
  const firstName = user?.name?.split(" ")[0] || "learner";
  const proficiency = getProficiencyForProgress(progress.xp);
  const nextNode = getRecommendedNode(progress);
  const reviewQueue = buildReviewQueue(progress);
  const weakSkills = getWeakSkills(progress);

  return (
    <div className="grid gap-5">
      <ProgressStats progress={progress} totalFamilies={fidelFamilies.length} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <RoadmapView roadmap={roadmap} completed={progress.completedRoadmapNodes} onSelectNode={onSelectNode} />
        <div className="grid content-start gap-4">
          <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-[#d6b16a]/16 blur-3xl" />
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/38">{roadmap.title}</p>
            <h1 className="mt-3 text-4xl font-black leading-none tracking-tight">
              {signedIn ? `${firstName}'s next lesson.` : "Your next lesson."}
            </h1>
            <p className="mt-3 text-sm font-bold leading-6 text-white/55">
              {signedIn ? "Cloud progress is connected." : "Guest learning works. Sign in whenever you want sync."}
            </p>
            <button onClick={() => onSelectNode(nextNode)} className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-black transition hover:-translate-y-0.5">
              Continue: {nextNode.title}
              <ArrowRight size={18} />
            </button>
            <button onClick={() => onRoute("onboarding")} className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 px-5 text-sm font-black text-white/72 transition hover:bg-white/10 hover:text-white">
              Tune path
              <Compass size={18} />
            </button>
          </div>
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
            <button onClick={onAuth} className="surface-panel rounded-[1.5rem] p-5 text-left transition hover:-translate-y-0.5">
              <UserRound size={24} className="text-[#d6b16a]" />
              <h2 className="mt-4 text-2xl font-black">Save progress</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-white/55">Connect Google after trying the path.</p>
            </button>
          )}
          <button onClick={() => onRoute("review")} className="surface-panel rounded-[1.5rem] p-5 text-left transition hover:-translate-y-0.5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/38">Memory engine</p>
            <h2 className="mt-3 text-3xl font-black">{reviewQueue.length} due today</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-white/55">Review is based on confidence, mistakes, and next review dates.</p>
          </button>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <button onClick={() => onRoute("conversation")} className="soft-card rounded-[1.5rem] p-5 text-left">
              <MessageCircle size={24} />
              <h2 className="mt-5 text-2xl font-black">{conversations[0].title}</h2>
              <p className="mt-2 text-sm font-bold text-white/50">{conversations[0].scenario}</p>
            </button>
            <button onClick={() => onRoute("library")} className="soft-card rounded-[1.5rem] p-5 text-left">
              <Headphones size={24} />
              <h2 className="mt-5 text-2xl font-black">{vocabulary.length} starter words</h2>
              <p className="mt-2 text-sm font-bold text-white/50">Formal, street, and culture notes.</p>
            </button>
          </div>
          <ProficiencyPanel current={proficiency} xp={progress.xp} />
          <div className="surface-panel rounded-[2rem] p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/38">Speaking confidence</p>
            <h2 className="mt-3 text-5xl font-black">{progress.speakingConfidence}%</h2>
            <p className="mt-3 text-sm font-bold leading-6 text-white/55">Tracked through conversation reps, listening practice, and completed speaking nodes.</p>
          </div>
          <div className="surface-panel rounded-[2rem] p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/38">Weak areas</p>
            <div className="mt-4 grid gap-3">
              {weakSkills.map((skill) => (
                <div key={skill.skill} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-sm font-black capitalize">{skill.skill.replace(/([A-Z])/g, " $1")}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#d6b16a]" style={{ width: `${skill.mastery}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {progress.lastTutorFeedback && (
        <section className="glass-panel rounded-[2rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/38">Tutor summary</p>
          <h2 className="mt-3 text-3xl font-black">{progress.lastTutorFeedback.headline}</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-white/55">{progress.lastTutorFeedback.nextStep}</p>
        </section>
      )}

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
