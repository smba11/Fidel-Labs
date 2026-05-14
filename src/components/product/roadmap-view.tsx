import { Check, Lock, Mic2, Play, Radio, ScrollText, Sparkles } from "lucide-react";

import type { PersonalizedRoadmap, RoadmapNode } from "@/types/learning";

const kindIcon = {
  conversation: Play,
  fidel: ScrollText,
  culture: Sparkles,
  listening: Radio,
  speaking: Mic2,
};

export function RoadmapView({
  roadmap,
  completed,
  onSelectNode,
}: {
  roadmap: PersonalizedRoadmap;
  completed: string[];
  onSelectNode: (node: RoadmapNode) => void;
}) {
  return (
    <section className="surface-panel rounded-[2.35rem] p-5 md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/38">Personalized roadmap</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{roadmap.title}</h2>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-white/55">{roadmap.subtitle}</p>
        </div>
        <div className="rounded-2xl border border-[#d6b16a]/25 bg-[#d6b16a]/10 px-4 py-3 text-sm font-black text-[#f0d49a]">
          {roadmap.focus}
        </div>
      </div>

      <div className="relative mt-8 grid gap-4">
        <div className="absolute left-7 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-[#d6b16a] via-white/14 to-transparent md:block" />
        {roadmap.nodes.map((node, index) => {
          const isComplete = completed.includes(node.id);
          const isLocked = Boolean(node.unlockAfter?.some((id) => !completed.includes(id)));
          return <RoadmapNodeCard key={node.id} node={node} index={index} complete={isComplete} locked={isLocked} onSelect={() => onSelectNode(node)} />;
        })}
      </div>
    </section>
  );
}

function RoadmapNodeCard({
  node,
  index,
  complete,
  locked,
  onSelect,
}: {
  node: RoadmapNode;
  index: number;
  complete: boolean;
  locked: boolean;
  onSelect: () => void;
}) {
  const Icon = locked ? Lock : complete ? Check : kindIcon[node.kind];
  return (
    <button
      type="button"
      disabled={locked}
      onClick={onSelect}
      className={[
        "group relative grid gap-4 rounded-[1.5rem] border p-4 text-left transition md:grid-cols-[68px_minmax(0,1fr)_auto] md:items-center",
        locked
          ? "border-white/7 bg-white/[0.035] text-white/35"
          : complete
            ? "border-[#d6b16a]/35 bg-[#d6b16a]/13 text-white shadow-xl shadow-black/20"
            : "soft-card text-white",
      ].join(" ")}
    >
      <div
        className={[
          "relative z-10 grid size-14 place-items-center rounded-2xl border text-lg font-black transition group-hover:scale-105",
          locked
            ? "border-white/10 bg-white/5"
            : complete
              ? "border-[#d6b16a]/35 bg-[#d6b16a] text-black"
              : "border-white/12 bg-black/25 text-[#d6b16a]",
        ].join(" ")}
      >
        <Icon size={21} />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">Unit {index + 1} · {node.category}</p>
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/42">{node.level}</span>
        </div>
        <h3 className="mt-2 text-2xl font-black tracking-tight">{node.title}</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-white/54">{node.description}</p>
      </div>
      <div className="flex items-center gap-3 text-xs font-black text-white/42 md:flex-col md:items-end">
        <span>{node.minutes} min</span>
        <span>{node.xp} XP</span>
      </div>
    </button>
  );
}
