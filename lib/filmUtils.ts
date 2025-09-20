import { Film, FilmFilters, FilmSortOption } from '@/types/film';

export const DEFAULT_PAGE_SIZE = 12;

const SORT_COMPARATORS: Record<FilmSortOption, (a: Film, b: Film) => number> = {
  'title-asc': (a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
  'release-desc': (a, b) => parseYear(b.release_date) - parseYear(a.release_date),
  'rating-desc': (a, b) => normalizeScore(b.rt_score) - normalizeScore(a.rt_score),
};

export function normalizeScore(score: string): number {
  const parsed = Number.parseInt(score, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseYear(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getFilterOptions(films: Film[]) {
  const directors = new Set<string>();
  const producers = new Set<string>();
  const years = new Set<string>();

  films.forEach((film) => {
    if (film.director) directors.add(film.director);
    if (film.producer) producers.add(film.producer);
    if (film.release_date) years.add(film.release_date);
  });

  return {
    directors: Array.from(directors).sort((a, b) => a.localeCompare(b)),
    producers: Array.from(producers).sort((a, b) => a.localeCompare(b)),
    years: Array.from(years).sort((a, b) => parseYear(a) - parseYear(b)),
  };
}

export function applyFilters(films: Film[], filters: FilmFilters): Film[] {
  const searchTerm = filters.search.trim().toLowerCase();
  const directorSet = new Set(filters.directors);
  const producerSet = new Set(filters.producers);
  const yearSet = new Set(filters.years);

  return films.filter((film) => {
    if (searchTerm) {
      const haystack = `${film.title} ${film.description}`.toLowerCase();
      if (!haystack.includes(searchTerm)) {
        return false;
      }
    }

    if (directorSet.size && !directorSet.has(film.director)) {
      return false;
    }

    if (producerSet.size && !producerSet.has(film.producer)) {
      return false;
    }

    if (yearSet.size && !yearSet.has(film.release_date)) {
      return false;
    }

    if (filters.minScore > 0 && normalizeScore(film.rt_score) < filters.minScore) {
      return false;
    }

    return true;
  });
}

export function applySort(films: Film[], sort: FilmSortOption): Film[] {
  const comparator = SORT_COMPARATORS[sort] ?? SORT_COMPARATORS['title-asc'];
  return [...films].sort(comparator);
}

export function paginateFilms(films: Film[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(films.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const offset = (currentPage - 1) * pageSize;
  const items = films.slice(offset, offset + pageSize);

  return {
    items,
    totalPages,
    currentPage,
  };
}

export function createDefaultFilters(overrides: Partial<FilmFilters> = {}): FilmFilters {
  return {
    search: '',
    directors: [],
    producers: [],
    years: [],
    minScore: 0,
    sort: 'title-asc',
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    ...overrides,
  };
}
