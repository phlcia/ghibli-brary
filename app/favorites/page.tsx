import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { FilmCard } from '@/components/FilmCard';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Film } from '@/types/film';

type SessionWithId = Awaited<ReturnType<typeof getServerSession>> & {
  user?: { id?: string | number };
};

export default async function FavoritesPage() {
  const session = await getServerSession(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authOptions as any,
  );
  const userId = (session as SessionWithId | null)?.user?.id;

  if (!userId) {
    redirect('/login');
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: Number(userId) },
    include: { film: true },
    orderBy: { id: 'desc' },
  });

  const films = favorites.map((favorite) => {
    const data = favorite.film.data as Film | null;
    if (data) {
      return data;
    }
    return {
      id: favorite.film.id,
      title: favorite.film.title,
      director: favorite.film.director,
      producer: favorite.film.producer,
      release_date: String(favorite.film.releaseYear),
      rt_score: String(favorite.film.rtScore),
      description: '',
      image: '',
      movie_banner: '',
      original_title: '',
      original_title_romanised: '',
      running_time: '',
    } satisfies Film;
  });

  return (
    <main className="min-h-screen pb-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-forest-primary">Your favorites</h1>
            <p className="text-sm text-forest-muted">
              A cozy collection of the Ghibli stories you love most.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-[color:var(--color-sky-300)] underline-offset-4 hover:underline"
          >
            ← Back to library
          </Link>
        </header>

        {films.length === 0 ? (
          <div className="rounded-2xl border border-forest-soft surface-soft p-10 text-center text-forest-muted">
            <p>No favorites yet. Start exploring the library and add a few!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {films.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
