import Image from 'next/image';
import Link from 'next/link';

import { FavoriteButton } from '@/components/FavoriteButton';
import { Film } from '@/types/film';

interface FilmCardProps {
  film: Film;
}

export function FilmCard({ film }: FilmCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-forest-soft surface-card shadow-lg transition hover:border-forest-strong hover:shadow-[var(--shadow-accent)]">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[color:var(--surface-mute)]">
        <Image
          src={film.image}
          alt={`${film.title} poster`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
          priority={false}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <header className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-forest-primary" title={film.title}>
            {film.title}
          </h3>
          <p className="text-sm text-forest-muted">Released {film.release_date}</p>
        </header>
        <p className="max-h-24 overflow-hidden text-sm text-forest-muted">{film.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 text-sm font-medium text-forest-primary">
          <span aria-label="Rotten Tomatoes score">RT {film.rt_score}</span>
          <div className="flex items-center gap-2">
            <FavoriteButton filmId={film.id} />
            <Link
              href={`/film/${film.id}`}
              className="btn-accent inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-sky-300)]"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
