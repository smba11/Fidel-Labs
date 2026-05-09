export function LoadingState({ label = "Loading Fidel Labs" }: { label?: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7f4] p-6 text-black">
      <div className="rounded-[2rem] border border-black/10 bg-white p-8 text-center shadow-2xl shadow-black/10">
        <div className="mx-auto size-12 animate-pulse rounded-2xl bg-black" />
        <h1 className="mt-5 text-3xl font-black">{label}</h1>
        <p className="mt-2 text-sm font-bold text-black/45">Preparing your learning path.</p>
      </div>
    </main>
  );
}
