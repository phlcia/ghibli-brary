interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = 'No films found',
  message = 'Try adjusting your search or filters.',
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-forest-soft surface-soft p-12 text-center text-forest-muted">
      <h3 className="text-lg font-semibold text-forest-primary">{title}</h3>
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
}
