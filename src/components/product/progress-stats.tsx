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
        <div key={stat.label} className="rounded-[1.35rem] border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-black/45">
            <span className="text-xs font-black uppercase tracking-[0.2em]">{stat.label}</span>
            {stat.icon}
          </div>
          <p className="mt-2 text-3xl font-black">{stat.value}</p>
        </div>
      ))}
    </section>
  );
}
