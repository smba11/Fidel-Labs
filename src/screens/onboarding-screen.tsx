import { ArrowRight, Check } from "lucide-react";

import { createRoadmap, defaultLearnerProfile } from "@/data/learning-architecture";
import type { LearnerGoal, LearnerProfile, PlacementAnswers } from "@/types/learning";

const goalOptions: { id: LearnerGoal; label: string }[] = [
  { id: "family", label: "Family communication" },
  { id: "confidence", label: "Speaking confidence" },
  { id: "reading", label: "Read Fidel" },
  { id: "culture", label: "Cultural connection" },
  { id: "travel", label: "Travel" },
  { id: "slang", label: "Slang and conversation" },
];

export function OnboardingScreen({
  profile,
  onChange,
  onFinish,
}: {
  profile: LearnerProfile;
  onChange: (profile: LearnerProfile) => void;
  onFinish: (answers: PlacementAnswers) => void;
}) {
  const draft = profile ?? defaultLearnerProfile;
  const placementAnswers: PlacementAnswers = {
    understandsAmharic: draft.understands,
    canSpeak: draft.speaks,
    canReadFidel: draft.reads,
    knowsGreetings: draft.knowledge !== "none",
    knowsFamilyWords: draft.goals.includes("family") && draft.knowledge !== "none",
    understandsFormalCasual: draft.goals.includes("culture") || draft.goals.includes("slang"),
    understandsDiasporaSpeech: draft.heritage === "diaspora" && draft.goals.includes("slang"),
  };
  const preview = createRoadmap(draft);

  function update(next: Partial<LearnerProfile>) {
    onChange({ ...draft, ...next });
  }

  function toggleGoal(goal: LearnerGoal) {
    const goals = draft.goals.includes(goal) ? draft.goals.filter((item) => item !== goal) : [...draft.goals, goal];
    update({ goals: goals.length ? goals : ["confidence"] });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.55fr)]">
      <section className="glass-panel rounded-[2.4rem] p-6 md:p-9">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-white/38">Personalize Fidel</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-6xl">Build a path that sounds like your life.</h1>
        <p className="mt-5 max-w-2xl text-sm font-bold leading-6 text-white/58">
          Fidel adapts around what you understand, what you want to say, and the cultural situations you care about.
        </p>

        <div className="mt-8 grid gap-6">
          <Question title="How much Amharic do you know?">
            <ChoiceGrid
              value={draft.knowledge}
              options={[
                ["none", "Almost none"],
                ["some-words", "Some words"],
                ["understand-some", "I understand some"],
                ["can-speak", "I can speak a bit"],
                ["can-read", "I can read Fidel"],
              ]}
              onPick={(value) => update({ knowledge: value as LearnerProfile["knowledge"] })}
            />
          </Question>

          <Question title="What can you do right now?">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["understands", "Understand"],
                ["speaks", "Speak"],
                ["reads", "Read Fidel"],
              ].map(([key, label]) => {
                const active = Boolean(draft[key as "understands" | "speaks" | "reads"]);
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => update({ [key]: !active })}
                    className={["rounded-2xl border p-4 text-left font-black transition", active ? "border-[#d6b16a]/40 bg-[#d6b16a]/15 text-white" : "border-white/10 bg-white/5 text-white/55 hover:bg-white/9"].join(" ")}
                  >
                    <span className="mb-3 grid size-8 place-items-center rounded-xl border border-white/10">{active && <Check size={16} />}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </Question>

          <Question title="Placement signals Fidel will use">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["knowsGreetings", "I know basic greetings"],
                ["knowsFamilyWords", "I know some family words"],
                ["understandsFormalCasual", "I notice formal vs casual speech"],
                ["understandsDiasporaSpeech", "I understand mixed diaspora speech"],
              ].map(([key, label]) => {
                const active = Boolean(placementAnswers[key as keyof PlacementAnswers]);
                return (
                  <div key={key} className={["rounded-2xl border p-4 text-sm font-black", active ? "border-[#d6b16a]/35 bg-[#d6b16a]/12 text-white" : "border-white/10 bg-white/5 text-white/42"].join(" ")}>
                    {label}
                  </div>
                );
              })}
            </div>
          </Question>

          <Question title="What are your goals?">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {goalOptions.map((goal) => {
                const active = draft.goals.includes(goal.id);
                return (
                  <button
                    type="button"
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={["rounded-2xl border px-4 py-3 text-left text-sm font-black transition", active ? "border-[#d6b16a]/40 bg-[#d6b16a]/15 text-white" : "border-white/10 bg-white/5 text-white/55 hover:bg-white/9"].join(" ")}
                  >
                    {goal.label}
                  </button>
                );
              })}
            </div>
          </Question>

          <div className="grid gap-4 md:grid-cols-2">
            <Question title="Age group">
              <ChoiceGrid
                value={draft.ageGroup}
                options={[
                  ["kid", "Kid"],
                  ["teen", "Teen"],
                  ["adult", "Adult"],
                ]}
                onPick={(value) => update({ ageGroup: value as LearnerProfile["ageGroup"] })}
              />
            </Question>
            <Question title="Language background">
              <ChoiceGrid
                value={draft.heritage}
                options={[
                  ["diaspora", "Diaspora"],
                  ["native", "Native speaker"],
                  ["curious", "New learner"],
                ]}
                onPick={(value) => update({ heritage: value as LearnerProfile["heritage"] })}
              />
            </Question>
          </div>
        </div>
      </section>

      <aside className="grid content-start gap-4">
        <div className="surface-panel rounded-[2rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/38">Generated path</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">{preview.title}</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-white/55">{preview.subtitle}</p>
          <div className="mt-5 rounded-2xl border border-[#d6b16a]/25 bg-[#d6b16a]/10 p-4 text-sm font-black text-[#f0d49a]">{preview.focus}</div>
          <div className="mt-5 grid gap-3">
            {preview.nodes.slice(0, 4).map((node) => (
              <div key={node.id} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/35">{node.category}</p>
                <p className="mt-2 font-black">{node.title}</p>
              </div>
            ))}
          </div>
          <button onClick={() => onFinish(placementAnswers)} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#d6b16a] px-5 text-sm font-black text-black transition hover:-translate-y-0.5">
            Start this roadmap
            <ArrowRight size={18} />
          </button>
        </div>
      </aside>
    </div>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white/42">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ChoiceGrid({ value, options, onPick }: { value: string; options: [string, string][]; onPick: (value: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map(([id, label]) => (
        <button
          type="button"
          key={id}
          onClick={() => onPick(id)}
          className={["rounded-2xl border px-4 py-3 text-left text-sm font-black transition", value === id ? "border-[#d6b16a]/40 bg-[#d6b16a]/15 text-white" : "border-white/10 bg-white/5 text-white/55 hover:bg-white/9"].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
