import { Check, Sparkles } from "lucide-react";

import { getNextProficiency } from "@/data/learning-architecture";
import type { ProficiencyLevel } from "@/types/learning";

export function ProficiencyPanel({ current, xp }: { current: ProficiencyLevel; xp: number }) {
  const next = getNextProficiency(current.id);
  const span = next ? next.xpTarget - current.xpTarget : 1;
  const progress = next ? Math.min(100, Math.round(((xp - current.xpTarget) / span) * 100)) : 100;

  return (
    <section className="glass-panel overflow-hidden rounded-[2rem] p-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/38">Current proficiency</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">{current.label}</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-white/55">{current.summary}</p>
        </div>
        <div className="grid size-14 place-items-center rounded-2xl border border-[#d6b16a]/35 bg-[#d6b16a]/15 text-[#d6b16a]">
          <Sparkles size={22} />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs font-black uppercase tracking-[0.18em] text-white/38">
          <span>{current.shortLabel}</span>
          <span>{next?.shortLabel ?? "Mastery"}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-[#d6b16a] to-[#78b8ac] transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {[
          current.speakingGoal,
          current.readingGoal,
          current.listeningGoal,
          current.cultureGoal,
          current.registerGoal,
        ].map((goal) => (
          <div key={goal} className="flex gap-3 rounded-2xl border border-white/10 bg-black/18 p-3">
            <Check className="mt-0.5 shrink-0 text-[#d6b16a]" size={16} />
            <p className="text-sm font-bold leading-6 text-white/60">{goal}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
