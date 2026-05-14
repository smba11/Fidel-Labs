import { ArrowRight, Globe2, Play, Sparkles } from "lucide-react";

import type { RouteId } from "@/types/learning";

export function LandingPage({ onStart }: { onStart: (route: RouteId) => void }) {
  return (
    <section className="grid min-h-[calc(100vh-3.5rem)] gap-6 lg:grid-cols-[1fr_0.86fr] lg:items-stretch">
      <div className="glass-panel relative overflow-hidden rounded-[2.4rem] p-7 text-white md:p-10 xl:p-14">
        <div className="absolute right-8 top-8 hidden font-[var(--ethiopic)] text-[11rem] font-black leading-none text-[#d6b16a]/[0.06] md:block">ፊ</div>
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-black text-white/58">
          <Sparkles size={16} className="text-[#d6b16a]" />
          Amharic-first. Africa-next.
        </div>
        <h1 className="mt-16 max-w-3xl text-6xl font-black leading-[0.9] tracking-tight md:text-7xl xl:text-8xl">
          The future of African language learning.
        </h1>
        <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-white/62">
          Fidel builds personalized Amharic roadmaps for speaking, reading Fidel, listening, register, culture, and real conversations across generations.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => onStart("onboarding")} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#d6b16a] px-6 text-sm font-black text-black transition hover:-translate-y-0.5 hover:brightness-110">
            Build my roadmap
            <ArrowRight size={18} />
          </button>
          <button onClick={() => onStart("conversation")} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 text-sm font-black text-white/75 transition hover:bg-white/10 hover:text-white">
            <Play size={18} />
            Try a conversation
          </button>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="surface-panel rounded-[2rem] p-6">
          <Globe2 size={28} />
          <h2 className="mt-6 text-3xl font-black">Personalized for diaspora fluency</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-white/55">
            Start as a guest, then save your path with Google when you want cloud progress.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {["Proficiency levels", "Personal roadmaps", "Formal + street", "Culture memory"].map((label) => (
            <div key={label} className="soft-card rounded-[1.5rem] p-5">
              <p className="text-xl font-black">{label}</p>
              <p className="mt-2 text-sm font-bold text-white/45">Production v1 module</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
