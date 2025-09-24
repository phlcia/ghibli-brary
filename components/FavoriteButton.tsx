'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { signIn, useSession } from 'next-auth/react';

type FavoritesCache = {
  data: Set<string> | null;
  promise: Promise<Set<string>> | null;
};

const cache: FavoritesCache = {
  data: null,
  promise: null,
};

async function loadFavorites(): Promise<Set<string>> {
  if (cache.data) {
    return cache.data;
  }

  if (!cache.promise) {
    cache.promise = fetch('/api/favorites')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        return response.json() as Promise<{ id: string }[]>;
      })
      .then((favorites) => new Set(favorites.map((favorite) => favorite.id)))
      .catch(() => new Set<string>());
  }

  const result = await cache.promise;
  cache.data = result;
  return result;
}

function invalidateFavorites() {
  cache.data = null;
  cache.promise = null;
}

interface FavoriteButtonProps {
  filmId: string;
}

export function FavoriteButton({ filmId }: FavoriteButtonProps) {
  const { status } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (status !== 'authenticated' || initialised) {
      return;
    }

    let ignore = false;

    (async () => {
      const favorites = await loadFavorites();
      if (!ignore) {
        setIsFavorite(favorites.has(filmId));
        setInitialised(true);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [filmId, status, initialised]);

  const disabled = useMemo(() => status === 'loading' || isPending, [status, isPending]);

  const toggleFavorite = useCallback(() => {
    if (status !== 'authenticated') {
      void signIn();
      return;
    }

    startTransition(async () => {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filmId }),
      });

      if (!response.ok) {
        console.error('Failed to update favorite', await response.text());
        return;
      }

      setIsFavorite((prev) => !prev);
      if (cache.data) {
        const updated = new Set(cache.data);
        if (isFavorite) {
          updated.delete(filmId);
        } else {
          updated.add(filmId);
        }
        cache.data = updated;
      } else {
        invalidateFavorites();
      }
    });
  }, [filmId, isFavorite, status]);

  if (status === 'loading') {
    return <div className="h-8 w-24 animate-pulse rounded-full bg-[color:var(--surface-mute)]" />;
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={disabled}
      aria-pressed={isFavorite}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-sky-300)] ${
        isFavorite
          ? 'bg-[color:var(--color-forest-400)] text-[color:var(--color-cloud)]'
          : 'border border-forest-soft text-forest-primary hover:border-[color:var(--color-sky-400)]'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      {isFavorite ? 'Favorited' : 'Favorite'}
    </button>
  );
}
