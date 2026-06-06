import { Flame, Gem, Heart, Target, Trophy } from "lucide-react";

import type { Progress } from "@/types/learning";

export function ProgressStats({ progress, totalFamilies }: { progress: Progress; totalFamilies: number }) {
  const stats = [
    { label: "Hearts", value: "5", icon: <Heart size={18} fill="currentColor" /> },
    { label: "Streak", value: progress.streak, icon: <Flame size={18} /> },
    { label: "XP", value: progress.xp, icon: <Trophy size={18} /> },
    { label: "Fidel", value: `${progress.completedFamilies.length}/${totalFamilies}`, icon: <Target size={18} /> },
    { label: "Gems", value: progress.nativeListens + 80, icon: <Gem size={18} /> },
  ];

  return (
    <section aria-label="Progress summary" className="grid grid-cols-5 gap-2 md:gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-[1.1rem] border border-white/10 bg-[#14120f] p-3 shadow-[inset_0_-4px_0_rgba(255,255,255,0.04)] md:rounded-[1.35rem] md:p-4">
          <div className="flex items-center justify-between text-[#d6b16a]">
            <span className="text-[9px] font-black uppercase tracking-[0.14em] md:text-xs md:tracking-[0.2em]">{stat.label}</span>
            {stat.icon}
          </div>
          <p className="mt-2 text-2xl font-black md:text-3xl">{stat.value}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-[#d6b16a] transition-all duration-700" />
          </div>
        </div>
      ))}
    </section>
  );
}
