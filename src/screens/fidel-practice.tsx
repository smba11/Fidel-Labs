import { Check, Volume2 } from "lucide-react";

import { LessonCard } from "@/components/product/lesson-card";
import { fidelFamilies } from "@/data/curriculum";
import type { FidelFamily, Progress } from "@/types/learning";

export function FidelPracticeScreen({
  activeFamily,
  progress,
  onComplete,
  onSelectFamily,
  onSpeak,
}: {
  activeFamily: FidelFamily;
  progress: Progress;
  onComplete: (id: string) => void;
  onSelectFamily: (id: string) => void;
  onSpeak: (text: string) => void;
}) {
  const complete = progress.completedFamilies.includes(activeFamily.id);

  return (
    <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
      <aside className="grid content-start gap-3">
        <div className="rounded-[2rem] bg-black p-6 text-white">
          <h1 className="text-4xl font-black">Fidel studio</h1>
          <p className="mt-3 text-sm font-bold leading-6 text-white/55">
            Practice all Amharic Fidel families. Expanded rows are included so v1 has complete coverage.
          </p>
        </div>
        <div className="grid max-h-[72vh] gap-3 overflow-y-auto pr-1">
          {fidelFamilies.map((family) => (
            <LessonCard
              key={family.id}
              family={family}
              active={family.id === activeFamily.id}
              complete={progress.completedFamilies.includes(family.id)}
              onSelect={() => onSelectFamily(family.id)}
            />
          ))}
        </div>
      </aside>

      <section className="rounded-[2.2rem] border border-black/10 bg-white p-5 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-black/35">Alphabet practice</p>
            <h2 className="mt-3 font-[var(--ethiopic)] text-7xl font-black">{activeFamily.name}</h2>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-black/55">{activeFamily.culturalNote}</p>
          </div>
          <button
            onClick={() => onComplete(activeFamily.id)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
          >
            <Check size={17} />
            {complete ? "Completed" : "Mark complete"}
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {activeFamily.orders.map((order) => (
            <button
              key={order.fidel}
              onClick={() => onSpeak(order.fidel)}
              className="group rounded-[1.5rem] border border-black/10 bg-[#fafafa] p-5 text-left transition hover:-translate-y-0.5 hover:border-black"
            >
              <div className="flex items-start justify-between">
                <span className="font-[var(--ethiopic)] text-6xl font-black">{order.fidel}</span>
                <span className="grid size-10 place-items-center rounded-full bg-black text-white transition group-hover:scale-105">
                  <Volume2 size={18} />
                </span>
              </div>
              <p className="mt-5 text-xl font-black">{order.transliteration}</p>
              <p className="mt-1 text-sm font-bold text-black/45">{order.english}</p>
              <p className="mt-3 text-xs font-bold leading-5 text-black/45">{order.note}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
