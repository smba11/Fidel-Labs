import { Check, Volume2 } from "lucide-react";

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
    <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="grid content-start gap-3">
        <div className="glass-panel rounded-[2rem] p-6 text-white">
          <h1 className="text-4xl font-black">Fidel studio</h1>
          <p className="mt-3 text-sm font-bold leading-6 text-white/55">
            Practice all Amharic Fidel families. Expanded rows are included so v1 has complete coverage.
          </p>
        </div>
        <div className="grid max-h-[68vh] gap-2 overflow-y-auto rounded-[1.5rem] border border-white/10 bg-white/6 p-2">
          {fidelFamilies.map((family) => (
            <button
              key={family.id}
              type="button"
              onClick={() => onSelectFamily(family.id)}
              className={[
                "flex min-h-16 items-center gap-3 rounded-[1.1rem] px-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                family.id === activeFamily.id ? "bg-[#58cc02] text-black" : "hover:bg-white/8",
              ].join(" ")}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-current/10 font-[var(--ethiopic)] text-3xl font-black">
                {family.base}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-black">{family.name}</span>
                <span className="block truncate text-xs font-bold opacity-50">
                  {progress.completedFamilies.includes(family.id) ? "Complete" : `${family.category} · level ${family.difficulty}`}
                </span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="surface-panel rounded-[2.2rem] p-5 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/35">Alphabet practice</p>
            <h2 className="mt-3 font-[var(--ethiopic)] text-7xl font-black">{activeFamily.name}</h2>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-white/55">{activeFamily.culturalNote}</p>
          </div>
          <button
            onClick={() => onComplete(activeFamily.id)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#58cc02] px-5 text-sm font-black text-black transition hover:-translate-y-0.5"
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
              className="soft-card group rounded-[1.5rem] p-5 text-left"
            >
              <div className="flex items-start justify-between">
                <span className="font-[var(--ethiopic)] text-6xl font-black">{order.fidel}</span>
                <span className="grid size-10 place-items-center rounded-full bg-[#58cc02] text-black transition group-hover:scale-105">
                  <Volume2 size={18} />
                </span>
              </div>
              <p className="mt-5 text-xl font-black">{order.transliteration}</p>
              <p className="mt-1 text-sm font-bold text-white/45">{order.english}</p>
              <p className="mt-3 text-xs font-bold leading-5 text-white/45">{order.note}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
