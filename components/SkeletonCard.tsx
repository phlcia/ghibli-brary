export function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-forest-soft surface-card">
      <div className="relative aspect-[2/3] w-full bg-[color:var(--surface-mute)] animate-pulse" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-[color:var(--surface-mute)] animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-[color:var(--surface-mute)] animate-pulse" />
        <div className="h-16 w-full rounded bg-[color:var(--surface-mute)] animate-pulse" />
        <div className="h-4 w-1/3 rounded bg-[color:var(--surface-mute)] animate-pulse" />
      </div>
    </div>
  );
}
