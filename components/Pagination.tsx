'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPages(current: number, total: number): number[] {
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let i = current - 1; i <= current + 1; i += 1) {
    if (i > 1 && i < total) {
      pages.add(i);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPages(currentPage, totalPages);

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2 text-sm text-forest-primary"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-forest-soft px-3 py-1.5 transition enabled:hover:border-forest-strong enabled:hover:text-[color:var(--color-sky-400)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      {pages.map((page, index) => {
        const isActive = page === currentPage;
        const prevPage = pages[index - 1];
        const isGap = prevPage !== undefined && page - prevPage > 1;

        return (
          <span key={page} className="flex items-center gap-2">
            {isGap && (
              <span aria-hidden className="text-forest-muted">
                ...
              </span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-lg px-3 py-1.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-sky-300)] ${
                isActive
                  ? 'btn-accent'
                  : 'border border-forest-soft text-forest-primary hover:border-forest-strong hover:text-[color:var(--color-sky-400)]'
              }`}
            >
              {page}
            </button>
          </span>
        );
      })}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-forest-soft px-3 py-1.5 transition enabled:hover:border-forest-strong enabled:hover:text-[color:var(--color-sky-400)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
