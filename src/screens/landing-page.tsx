import { ArrowRight, Globe2, Play } from "lucide-react";

import type { RouteId } from "@/types/learning";

export function LandingPage({ onStart }: { onStart: (route: RouteId) => void }) {
  return (
    <section className="grid min-h-[calc(100vh-3.5rem)] gap-6 lg:grid-cols-[1fr_0.86fr] lg:items-stretch">
      <div className="rounded-[2.4rem] bg-black p-7 text-white md:p-10 xl:p-14">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="Fidel Labs" className="size-14 rounded-2xl border border-white/10" />
          <div>
            <p className="text-lg font-black">Fidel Labs</p>
            <p className="text-sm font-bold text-white/45">Amharic-first. Africa-next.</p>
          </div>
        </div>
        <h1 className="mt-16 max-w-3xl text-6xl font-black leading-[0.9] tracking-tight md:text-7xl xl:text-8xl">
          Learn Amharic with pride, rhythm, and real life.
        </h1>
        <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-white/62">
          A playful learning app for diaspora kids: Fidel reading, formal Amharic, street conversation, culture notes, and pronunciation practice in one free path.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => onStart("dashboard")} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-black transition hover:-translate-y-0.5">
            Start learning
            <ArrowRight size={18} />
          </button>
          <button onClick={() => onStart("conversation")} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 text-sm font-black text-white/75 transition hover:bg-white/10 hover:text-white">
            <Play size={18} />
            Try a conversation
          </button>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <Globe2 size={28} />
          <h2 className="mt-6 text-3xl font-black">Built for diaspora families</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-black/55">
            Kids can use it without logging in. Accounts are optional for saving progress across devices.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {["Fidel alphabet", "Formal speech", "Street phrases", "Culture notes"].map((label) => (
            <div key={label} className="rounded-[1.5rem] border border-black/10 bg-white p-5">
              <p className="text-xl font-black">{label}</p>
              <p className="mt-2 text-sm font-bold text-black/45">Production v1 module</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
