import { RotateCcw, Star } from "lucide-react";

import { ProgressStats } from "@/components/product/progress-stats";
import { conversations, fidelFamilies } from "@/data/curriculum";
import type { Progress } from "@/types/learning";

export function ProgressScreen({ progress, onReset }: { progress: Progress; onReset: () => void }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="surface-panel rounded-[2.2rem] p-5 md:p-8">
        <h1 className="text-5xl font-black">Your learning path</h1>
        <p className="mt-3 text-sm font-bold leading-6 text-white/50">A Duolingo-like path, but built for diaspora language identity instead of streak anxiety.</p>
        <div className="mt-8 grid gap-4">
          {fidelFamilies.slice(0, 14).map((family, index) => {
            const complete = progress.completedFamilies.includes(family.id);
            return (
              <div key={family.id} className="grid grid-cols-[minmax(0,1fr)_76px] items-center gap-4 md:grid-cols-[minmax(0,1fr)_82px_minmax(0,1fr)]">
                <div className={index % 2 === 0 ? "text-right" : "md:col-start-3"}>
                  <p className="text-sm font-black">{family.name}</p>
                  <p className="text-xs font-bold text-white/45">{complete ? "Complete" : family.category}</p>
                </div>
                <div className={["row-start-1 mx-auto grid size-18 place-items-center rounded-full border-4 font-[var(--ethiopic)] text-3xl font-black md:col-start-2 md:size-20", complete ? "border-[#58cc02] bg-[#58cc02] text-black" : "border-[#58cc02] bg-black/25 text-white"].join(" ")}>
                  {complete ? <Star size={28} fill="currentColor" /> : family.base}
                </div>
                <div />
              </div>
            );
          })}
        </div>
      </section>

      <aside className="grid content-start gap-4">
        <ProgressStats progress={progress} totalFamilies={fidelFamilies.length} />
        <div className="glass-panel rounded-[2rem] p-6 text-white">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/40">Conversation progress</p>
          <h2 className="mt-3 text-4xl font-black">{progress.completedConversations.length}/{conversations.length}</h2>
          <p className="mt-2 text-sm font-bold text-white/55">Completed real-life lessons.</p>
        </div>
        <button onClick={onReset} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-5 text-sm font-black text-white/65 transition hover:border-white/25 hover:text-white">
          <RotateCcw size={17} />
          Reset local progress
        </button>
      </aside>
    </div>
  );
}
