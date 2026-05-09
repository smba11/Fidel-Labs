import { Check, Lock } from "lucide-react";

import type { FidelFamily } from "@/types/learning";

export function LessonCard({
  family,
  complete,
  active,
  onSelect,
}: {
  family: FidelFamily;
  complete: boolean;
  active?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "group min-h-36 rounded-[1.5rem] border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
        active ? "border-black bg-black text-white shadow-xl shadow-black/15" : "border-black/10 bg-white hover:-translate-y-0.5 hover:border-black",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-[var(--ethiopic)] text-5xl font-black">{family.base}</span>
        <span className="rounded-full border border-current/15 px-2.5 py-1 text-xs font-black uppercase tracking-[0.16em] opacity-70">
          {complete ? <Check size={13} /> : family.category === "expanded" ? <Lock size={13} /> : "Live"}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-black">{family.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 opacity-55">{family.culturalNote}</p>
    </button>
  );
}
