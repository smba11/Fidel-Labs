import { RotateCcw, Star } from "lucide-react";

import { ProficiencyPanel } from "@/components/product/proficiency-panel";
import { ProgressStats } from "@/components/product/progress-stats";
import { conversations, fidelFamilies } from "@/data/curriculum";
import { getProficiencyForProgress, proficiencyLevels } from "@/data/learning-architecture";
import type { Progress } from "@/types/learning";

export function ProgressScreen({ progress, onReset }: { progress: Progress; onReset: () => void }) {
  const current = getProficiencyForProgress(progress.xp);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="surface-panel rounded-[2.2rem] p-5 md:p-8">
        <h1 className="text-5xl font-black">Proficiency growth</h1>
        <p className="mt-3 text-sm font-bold leading-6 text-white/50">A structured Amharic model for speaking, Fidel reading, listening, culture, and register control.</p>
        <div className="mt-8 grid gap-3">
          {proficiencyLevels.map((level) => {
            const active = level.id === current.id;
            const reached = progress.xp >= level.xpTarget;
            return (
              <article key={level.id} className={["rounded-[1.5rem] border p-5 transition", active ? "border-[#d6b16a]/45 bg-[#d6b16a]/12" : reached ? "border-white/12 bg-white/7" : "border-white/8 bg-white/[0.035]"].join(" ")}>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-white/38">{level.shortLabel} · {level.xpTarget} XP</p>
                    <h2 className="mt-2 text-2xl font-black">{level.label}</h2>
                    <p className="mt-2 text-sm font-bold leading-6 text-white/55">{level.summary}</p>
                  </div>
                  <div className={["grid size-12 place-items-center rounded-2xl border", active ? "border-[#d6b16a]/40 bg-[#d6b16a] text-black" : "border-white/10 bg-black/20 text-white/45"].join(" ")}>
                    {reached ? <Star size={20} fill="currentColor" /> : level.shortLabel}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <h2 className="mt-10 text-3xl font-black">Fidel mastery lane</h2>
        <div className="mt-5 grid gap-4">
          {fidelFamilies.slice(0, 10).map((family, index) => {
            const complete = progress.completedFamilies.includes(family.id);
            return (
              <div key={family.id} className="grid grid-cols-[minmax(0,1fr)_76px] items-center gap-4 md:grid-cols-[minmax(0,1fr)_82px_minmax(0,1fr)]">
                <div className={index % 2 === 0 ? "text-right" : "md:col-start-3"}>
                  <p className="text-sm font-black">{family.name}</p>
                  <p className="text-xs font-bold text-white/45">{complete ? "Complete" : family.category}</p>
                </div>
                <div className={["row-start-1 mx-auto grid size-18 place-items-center rounded-full border-4 font-[var(--ethiopic)] text-3xl font-black md:col-start-2 md:size-20", complete ? "border-[#d6b16a] bg-[#d6b16a] text-black" : "border-[#d6b16a]/60 bg-black/25 text-white"].join(" ")}>
                  {complete ? <Star size={28} fill="currentColor" /> : family.base}
                </div>
                <div />
              </div>
            );
          })}
        </div>
      </section>

      <aside className="grid content-start gap-4">
        <ProficiencyPanel current={current} xp={progress.xp} />
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
