import { Film } from '@/types/film';

const API_BASE_URL = 'https://ghibliapi.vercel.app';
const TTL_MS = 60_000;

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

type CacheStore = Map<string, CacheEntry<unknown>>;

declare global {
  var __ghibliCache: CacheStore | undefined;
}

const cache: CacheStore = globalThis.__ghibliCache ?? new Map();
globalThis.__ghibliCache = cache;

type FetchOptions = {
  signal?: AbortSignal;
};

async function fetchJson<T>(key: string, url: string, options?: FetchOptions): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key) as CacheEntry<T> | undefined;

  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const res = await fetch(url, {
    ...options,
    // Ensure we control caching behaviour explicitly.
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as T;
  cache.set(key, { data, expiresAt: now + TTL_MS });

  return data;
}

export async function getFilms(options?: FetchOptions): Promise<Film[]> {
  return fetchJson<Film[]>('films', `${API_BASE_URL}/films`, options);
}

export async function getFilmById(id: string, options?: FetchOptions): Promise<Film> {
  return fetchJson<Film>(`film-${id}`, `${API_BASE_URL}/films/${id}`, options);
}

export function clearApiCache(): void {
  cache.clear();
}

export function getCacheSize(): number {
  return cache.size;
}
