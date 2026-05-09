import { BookOpen } from "lucide-react";

export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-black/15 bg-white p-8 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-black text-white">
        <BookOpen size={22} />
      </div>
      <h2 className="mt-4 text-2xl font-black">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-black/50">{copy}</p>
    </div>
  );
}
