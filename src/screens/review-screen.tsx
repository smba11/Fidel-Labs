import { Check, Clock, RotateCcw, X } from "lucide-react";

import { buildReviewQueue } from "@/data/learning-engine";
import type { Progress } from "@/types/learning";

export function ReviewScreen({
  progress,
  onAnswerReview,
}: {
  progress: Progress;
  onAnswerReview: (masteryItemId: string, correct: boolean) => void;
}) {
  const queue = buildReviewQueue(progress);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="surface-panel rounded-[2.35rem] p-6 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-white/38">Daily memory queue</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">Exactly what you need today.</h1>
        <p className="mt-4 max-w-2xl text-sm font-bold leading-6 text-white/55">
          Fidel schedules words, phrases, Fidel characters, and concepts based on mistakes, confidence, and review timing.
        </p>

        <div className="mt-8 grid gap-4">
          {queue.length ? (
            queue.map((review) => {
              const item = progress.masteryItems[review.masteryItemId];
              if (!item) return null;
              return (
                <article key={review.id} className="soft-card rounded-[1.6rem] p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/35">{item.kind} · {review.reason} · priority {review.priority}</p>
                      <h2 className="mt-3 font-[var(--ethiopic)] text-5xl font-black">{item.amharic ?? item.label}</h2>
                      <p className="mt-2 text-xl font-black">{item.transliteration ?? item.label}</p>
                      <p className="mt-1 text-sm font-bold text-white/55">{item.english ?? item.label}</p>
                    </div>
                    <div className="min-w-36 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/35">Memory</p>
                      <p className="mt-2 text-3xl font-black">{item.confidenceScore}%</p>
                      <p className="mt-1 text-xs font-bold text-white/45">{item.timesCorrect}/{item.timesSeen} correct</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button onClick={() => onAnswerReview(item.id, false)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-black text-white/70 transition hover:bg-white/10 hover:text-white">
                      <X size={17} />
                      Need practice
                    </button>
                    <button onClick={() => onAnswerReview(item.id, true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#d6b16a] px-4 text-sm font-black text-black transition hover:-translate-y-0.5">
                      <Check size={17} />
                      Remembered
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[2rem] border border-dashed border-white/14 bg-white/5 p-8 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#d6b16a] text-black">
                <Check size={22} />
              </div>
              <h2 className="mt-4 text-2xl font-black">Review queue clear</h2>
              <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-white/55">You are clear for now. Complete a lesson and Fidel will schedule the next useful review.</p>
            </div>
          )}
        </div>
      </section>

      <aside className="grid content-start gap-4">
        <div className="glass-panel rounded-[2rem] p-6">
          <RotateCcw size={24} className="text-[#d6b16a]" />
          <h2 className="mt-4 text-3xl font-black">Spaced repetition</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-white/55">
            Each item stores times seen, accuracy, confidence, difficulty, last review, and next review. Weak items return sooner.
          </p>
        </div>
        <div className="surface-panel rounded-[2rem] p-6">
          <Clock size={24} className="text-[#d6b16a]" />
          <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-white/38">Due now</p>
          <h2 className="mt-2 text-5xl font-black">{queue.length}</h2>
          <p className="mt-2 text-sm font-bold text-white/55">Personal review items.</p>
        </div>
      </aside>
    </div>
  );
}
