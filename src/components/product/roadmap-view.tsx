import { Check, Crown, Lock, Mic2, Play, Radio, ScrollText, Sparkles, Star } from "lucide-react";

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
    <section className="rounded-[2.35rem] border border-white/10 bg-[#0d0c0a] p-4 shadow-2xl shadow-black/25 md:p-6">
      <div className="rounded-[2rem] border border-[#d6b16a]/25 bg-gradient-to-br from-[#d6b16a]/18 via-white/[0.06] to-[#78b8ac]/10 p-5 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f0d49a]/75">Current unit</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{roadmap.title}</h2>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-white/58">{roadmap.subtitle}</p>
          </div>
          <div className="rounded-2xl border border-[#d6b16a]/30 bg-black/20 px-4 py-3 text-sm font-black text-[#f0d49a]">
            {roadmap.focus}
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4 px-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/35">Learning path</p>
          <p className="mt-1 text-sm font-bold text-white/55">Tap the next glowing lesson. Reviews appear when memory is due.</p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/55 md:flex">
          <Crown size={15} className="text-[#d6b16a]" />
          Mastery path
        </div>
      </div>

      <div className="relative mx-auto mt-8 grid max-w-3xl gap-8 pb-5">
        <div className="absolute left-1/2 top-8 h-[calc(100%-4rem)] w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#d6b16a]/70 via-white/10 to-transparent" />
        {roadmap.nodes.map((node, index) => {
          const isComplete = completed.includes(node.id);
          const isLocked = Boolean(node.unlockAfter?.some((id) => !completed.includes(id)));
          return <PathNode key={node.id} node={node} index={index} complete={isComplete} locked={isLocked} onSelect={() => onSelectNode(node)} />;
        })}
      </div>
    </section>
  );
}

function PathNode({
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
  const Icon = locked ? Lock : complete ? Check : index % 5 === 4 ? Crown : kindIcon[node.kind];
  const side = index % 4 === 0 ? "md:ml-[8%]" : index % 4 === 1 ? "md:ml-[42%]" : index % 4 === 2 ? "md:ml-[24%]" : "md:ml-[58%]";
  return (
    <div className={["relative z-10 flex items-center gap-4", side].join(" ")}>
      <button
        type="button"
        disabled={locked}
        onClick={onSelect}
        className={[
          "group relative grid size-20 shrink-0 place-items-center rounded-full border-4 text-lg font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d6b16a]/30 md:size-24",
          locked
            ? "border-white/10 bg-[#161513] text-white/30 shadow-[inset_0_-8px_0_rgba(255,255,255,0.04)]"
            : complete
              ? "border-[#f1d28f] bg-[#d6b16a] text-black shadow-[0_10px_0_#8f6f34,0_24px_40px_rgba(0,0,0,0.28)]"
              : "border-[#f1d28f] bg-gradient-to-b from-[#f0d49a] to-[#d6b16a] text-black shadow-[0_10px_0_#8f6f34,0_24px_40px_rgba(214,177,106,0.18)] hover:-translate-y-1",
        ].join(" ")}
        aria-label={`${locked ? "Locked" : complete ? "Completed" : "Start"} ${node.title}`}
      >
        <Icon size={30} fill={complete ? "currentColor" : "none"} />
        {!locked && !complete && <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full border border-black/20 bg-white text-[10px] font-black text-black">{index + 1}</span>}
      </button>
      <div className="hidden max-w-[17rem] rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-4 text-left shadow-xl shadow-black/15 backdrop-blur md:block">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/38">Unit {index + 1} · {node.category}</p>
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/42">{node.level}</span>
        </div>
        <h3 className="mt-2 text-lg font-black tracking-tight">{node.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-white/50">{node.description}</p>
      </div>
      <div className="min-w-0 md:hidden">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/38">Unit {index + 1}</p>
        <h3 className="text-lg font-black">{node.title}</h3>
        <p className="text-xs font-bold text-white/45">{node.minutes} min · {node.xp} XP</p>
      </div>
    </div>
  );
}
