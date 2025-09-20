export default function FilmLoading() {
  return (
    <main className="min-h-screen pb-16">
      <div className="mx-auto w-full max-w-5xl space-y-8 px-6 py-10 sm:px-8">
        <div className="h-4 w-32 rounded bg-slate-800/70 animate-pulse" />
        <div className="h-64 w-full rounded-2xl bg-slate-800/70 animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-48 rounded-2xl bg-slate-800/70 animate-pulse" />
          <div className="h-48 rounded-2xl bg-slate-800/70 animate-pulse" />
        </div>
        <div className="h-40 rounded-2xl bg-slate-800/70 animate-pulse" />
      </div>
    </main>
  );
}
