import { ArrowRight, Headphones, MessageCircle } from "lucide-react";

import { LessonCard } from "@/components/product/lesson-card";
import { ProgressStats } from "@/components/product/progress-stats";
import { conversations, fidelFamilies, vocabulary } from "@/data/curriculum";
import type { Progress, RouteId } from "@/types/learning";

export function Dashboard({
  progress,
  onRoute,
  onSelectFamily,
  onAuth,
}: {
  progress: Progress;
  onRoute: (route: RouteId) => void;
  onSelectFamily: (id: string) => void;
  onAuth: () => void;
}) {
  const nextFamily = fidelFamilies.find((family) => !progress.completedFamilies.includes(family.id)) ?? fidelFamilies[0];

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2.2rem] bg-black p-7 text-white md:p-10">
          <h1 className="max-w-2xl text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
            Today&apos;s Amharic practice.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
            Keep the session short: one Fidel row, one real phrase, one culture note.
          </p>
          <button onClick={() => onRoute("fidel")} className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-black transition hover:-translate-y-0.5">
            Continue path
            <ArrowRight size={18} />
          </button>
          <button onClick={onAuth} className="mt-3 inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/15 px-5 text-sm font-black text-white/70 transition hover:bg-white/10 hover:text-white md:hidden">
            Save progress with Google
          </button>
        </div>

        <div className="grid content-start gap-4">
          <ProgressStats progress={progress} totalFamilies={fidelFamilies.length} />
          <div className="grid gap-4 sm:grid-cols-2">
            <button onClick={() => onRoute("conversation")} className="rounded-[1.5rem] border border-black/10 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-black">
              <MessageCircle size={24} />
              <h2 className="mt-5 text-2xl font-black">{conversations[0].title}</h2>
              <p className="mt-2 text-sm font-bold text-black/50">{conversations[0].scenario}</p>
            </button>
            <button onClick={() => onRoute("library")} className="rounded-[1.5rem] border border-black/10 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-black">
              <Headphones size={24} />
              <h2 className="mt-5 text-2xl font-black">{vocabulary.length} starter words</h2>
              <p className="mt-2 text-sm font-bold text-black/50">Formal, street, and culture notes.</p>
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black">Next Fidel family</h2>
            <p className="mt-1 text-sm font-bold text-black/45">Full Amharic family coverage is now in the app.</p>
          </div>
          <button onClick={() => onRoute("fidel")} className="hidden text-sm font-black underline underline-offset-4 md:block">View all</button>
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
