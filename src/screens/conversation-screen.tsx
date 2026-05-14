import { Check, Play, Volume2 } from "lucide-react";

import { conversations } from "@/data/curriculum";
import type { ConversationLesson, Progress } from "@/types/learning";

export function ConversationLessonScreen({
  activeConversation,
  progress,
  onComplete,
  onSelect,
  onSpeak,
}: {
  activeConversation: ConversationLesson;
  progress: Progress;
  onComplete: (id: string, xp: number) => void;
  onSelect: (id: string) => void;
  onSpeak: (text: string) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="grid content-start gap-3">
        <div className="glass-panel rounded-[2rem] p-6 text-white">
          <h1 className="text-4xl font-black">Conversation lab</h1>
          <p className="mt-3 text-sm font-bold leading-6 text-white/55">Formal, street, and culture-aware Amharic for real moments.</p>
        </div>
        {conversations.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onSelect(lesson.id)}
            className={[
              "rounded-[1.5rem] border p-5 text-left transition hover:-translate-y-0.5",
              lesson.id === activeConversation.id ? "border-[#58cc02] bg-[#58cc02] text-black" : "soft-card",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black">{lesson.title}</h2>
              {progress.completedConversations.includes(lesson.id) && <Check size={18} />}
            </div>
            <p className="mt-2 text-sm font-bold opacity-55">{lesson.scenario}</p>
          </button>
        ))}
      </aside>

      <section className="surface-panel rounded-[2.2rem] p-5 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/35">{activeConversation.level} conversation</p>
            <h2 className="mt-3 text-5xl font-black tracking-tight">{activeConversation.title}</h2>
            <p className="mt-3 text-sm font-bold text-white/50">{activeConversation.scenario}</p>
          </div>
          <button
            onClick={() => onComplete(activeConversation.id, activeConversation.xp)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#58cc02] px-5 text-sm font-black text-black transition hover:-translate-y-0.5"
          >
            <Play size={17} />
            Complete +{activeConversation.xp} XP
          </button>
        </div>

        <div className="mt-8 grid gap-4">
          {activeConversation.lines.map((line, index) => (
            <article key={`${line.amharic}-${index}`} className="soft-card rounded-[1.5rem] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/35">{line.speaker} · {line.tone}</p>
                  <h3 className="mt-3 font-[var(--ethiopic)] text-4xl font-black">{line.amharic}</h3>
                  <p className="mt-2 text-lg font-black">{line.transliteration}</p>
                  <p className="mt-1 text-sm font-bold text-white/55">{line.english}</p>
                </div>
                <button onClick={() => onSpeak(line.amharic)} className="grid size-12 place-items-center rounded-2xl bg-[#58cc02] text-black">
                  <Volume2 size={19} />
                </button>
              </div>
              <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm font-bold leading-6 text-white/55">{line.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
