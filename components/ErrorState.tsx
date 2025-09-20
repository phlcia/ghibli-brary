'use client';

import { useRouter } from 'next/navigation';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong while loading films.',
  onRetry,
}: ErrorStateProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-forest-strong surface-soft p-10 text-center text-forest-muted">
      <div className="text-lg font-semibold text-forest-primary">Unable to load films</div>
      <p className="text-sm">{message}</p>
      <button
        type="button"
        onClick={handleRetry}
        className="btn-accent rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-sky-300)]"
      >
        Retry
      </button>
    </div>
  );
}
