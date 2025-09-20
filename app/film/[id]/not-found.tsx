import Link from 'next/link';

export default function FilmNotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 py-20 text-center text-forest-primary">
      <h1 className="text-3xl font-bold text-forest-primary">Film not found</h1>
      <p className="text-sm text-forest-muted">
        The film you are looking for is unavailable. It may have been removed or the link is
        incorrect.
      </p>
      <Link
        href="/"
        className="btn-accent rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-sky-300)]"
      >
        Back to library
      </Link>
    </main>
  );
}
