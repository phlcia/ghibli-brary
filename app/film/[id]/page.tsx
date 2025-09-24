import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getFilmById } from '@/lib/ghibliApi';

type PageParams = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { id } = await params;

  try {
    const film = await getFilmById(id);
    return {
      title: `${film.title} • ghibli-brary`,
      description: film.description,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Film not found';
    return {
      title: 'Film not found • ghibli-brary',
      description: message,
    };
  }
}

export default async function FilmDetailPage({ params }: { params: PageParams }) {
  const { id } = await params;

  try {
    const film = await getFilmById(id);

    return (
      <main className="min-h-screen pb-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 sm:px-8">
          <Link
            href="/"
            className="text-sm font-medium text-[color:var(--color-sky-400)] underline-offset-4 transition hover:text-[color:var(--color-forest-400)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-sky-300)]"
          >
            ← Back to library
          </Link>

          <article className="space-y-8">
            <header className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-forest-soft surface-panel">
                <div className="relative aspect-[16/7] w-full bg-[color:var(--surface-mute)]">
                  <Image
                    src={film.movie_banner}
                    alt={`${film.title} banner`}
                    fill
                    sizes="(max-width: 768px) 100vw, 90vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-forest-primary">{film.title}</h1>
                <p className="text-sm text-forest-muted">
                  {film.original_title} ({film.original_title_romanised})
                </p>
              </div>
            </header>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
              <section className="rounded-2xl border border-forest-soft surface-card p-6 text-sm text-forest-muted lg:flex-1 lg:basis-80 lg:max-w-sm">
                <dl className="space-y-4">
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-forest-primary">Director</dt>
                    <dd>{film.director}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-forest-primary">Producer</dt>
                    <dd>{film.producer}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-forest-primary">Release year</dt>
                    <dd>{film.release_date}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-forest-primary">Running time</dt>
                    <dd>{film.running_time} minutes</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-forest-primary">Rotten Tomatoes</dt>
                    <dd>{film.rt_score}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-2xl border border-forest-soft surface-card p-6 text-forest-primary lg:flex-1">
                <h2 className="text-xl font-semibold text-forest-primary">Synopsis</h2>
                <p className="mt-3 leading-relaxed text-forest-muted">{film.description}</p>
              </section>
            </div>
          </article>
        </div>
      </main>
    );
  } catch {
    notFound();
    return null;
  }
}
