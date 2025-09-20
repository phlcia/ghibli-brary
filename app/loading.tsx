import { SkeletonCard } from '@/components/SkeletonCard';

export default function Loading() {
  const skeletons = Array.from({ length: 6 }, (_, index) => index);

  return (
    <main className="min-h-screen pb-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10">
        <div className="space-y-4">
          <div className="h-10 w-48 rounded bg-[color:var(--surface-mute)] animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-[color:var(--surface-mute)] animate-pulse" />
          <div className="h-12 w-full max-w-md rounded-xl bg-[color:var(--surface-mute)] animate-pulse" />
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="h-[420px] w-full max-w-sm rounded-xl bg-[color:var(--surface-card)] animate-pulse lg:w-72" />
          <div className="flex-1 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="h-5 w-40 rounded bg-[color:var(--surface-mute)] animate-pulse" />
              <div className="h-10 w-52 rounded bg-[color:var(--surface-mute)] animate-pulse" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {skeletons.map((item) => (
                <SkeletonCard key={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
