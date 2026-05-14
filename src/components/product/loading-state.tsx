export function LoadingState({ label = "Loading Fidel Labs" }: { label?: string }) {
  return (
    <main className="aurora-shell grid min-h-screen place-items-center p-6 text-white">
      <div className="glass-panel rounded-[2rem] p-8 text-center">
        <div className="mx-auto size-12 animate-pulse rounded-2xl bg-[#d6b16a]" />
        <h1 className="mt-5 text-3xl font-black">{label}</h1>
        <p className="mt-2 text-sm font-bold text-white/45">Preparing your learning path.</p>
      </div>
    </main>
  );
}
