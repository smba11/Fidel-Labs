import { Flame, Headphones, Target, Trophy } from "lucide-react";

import type { Progress } from "@/types/learning";

export function ProgressStats({ progress, totalFamilies }: { progress: Progress; totalFamilies: number }) {
  const stats = [
    { label: "Streak", value: progress.streak, icon: <Flame size={18} /> },
    { label: "XP", value: progress.xp, icon: <Trophy size={18} /> },
    { label: "Fidel", value: `${progress.completedFamilies.length}/${totalFamilies}`, icon: <Target size={18} /> },
    { label: "Listens", value: progress.nativeListens, icon: <Headphones size={18} /> },
  ];

  return (
    <section aria-label="Progress summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="soft-card rounded-[1.35rem] p-4">
          <div className="flex items-center justify-between text-white/45">
            <span className="text-xs font-black uppercase tracking-[0.2em]">{stat.label}</span>
            {stat.icon}
          </div>
          <p className="mt-2 text-3xl font-black">{stat.value}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-[#58cc02] transition-all duration-700" />
          </div>
        </div>
      ))}
    </section>
  );
}
