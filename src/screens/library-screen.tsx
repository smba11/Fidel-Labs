import { Search, Volume2 } from "lucide-react";

import { fidelFamilies, vocabulary } from "@/data/curriculum";

export function LibraryScreen({ query, onQuery, onSpeak }: { query: string; onQuery: (query: string) => void; onSpeak: (text: string) => void }) {
  const needle = query.trim().toLowerCase();
  const filteredWords = vocabulary.filter((word) =>
    [word.amharic, word.transliteration, word.english, word.formal, word.street, word.cultural].join(" ").toLowerCase().includes(needle)
  );
  const filteredFamilies = fidelFamilies.filter((family) =>
    [family.name, family.base, family.transliteration, family.culturalNote].join(" ").toLowerCase().includes(needle)
  );

  return (
    <div className="grid gap-5">
      <section className="glass-panel rounded-[2rem] p-7 text-white md:p-10">
        <h1 className="text-5xl font-black">Language library</h1>
        <p className="mt-4 max-w-2xl text-sm font-bold leading-6 text-white/55">Search Amharic script, transliteration, English meaning, formal notes, street notes, and culture notes.</p>
        <label className="mt-7 flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 text-white">
          <Search size={19} />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search selam, coffee, ሰ..."
            className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-white/35"
          />
        </label>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.75fr]">
        <div className="grid gap-3">
          <h2 className="text-3xl font-black">Words and phrases</h2>
          {filteredWords.map((word) => (
            <article key={word.id} className="soft-card rounded-[1.5rem] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-[var(--ethiopic)] text-4xl font-black">{word.amharic}</h3>
                  <p className="mt-1 text-lg font-black">{word.transliteration} · {word.english}</p>
                </div>
                <button onClick={() => onSpeak(word.amharic)} className="grid size-11 place-items-center rounded-2xl bg-[#d6b16a] text-black">
                  <Volume2 size={18} />
                </button>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Note label="Formal" value={word.formal} />
                <Note label="Street" value={word.street} />
                <Note label="Culture" value={word.cultural} />
              </div>
            </article>
          ))}
        </div>

        <aside className="grid content-start gap-3">
          <h2 className="text-3xl font-black">Fidel index</h2>
          <div className="grid grid-cols-2 gap-3">
            {filteredFamilies.map((family) => (
              <div key={family.id} className="soft-card rounded-[1.25rem] p-4">
                <p className="font-[var(--ethiopic)] text-4xl font-black">{family.base}</p>
                <p className="mt-2 text-sm font-black">{family.name}</p>
                <p className="text-xs font-bold text-white/45">{family.orders.map((order) => order.fidel).join(" ")}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function Note({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-white/60">{value}</p>
    </div>
  );
}
