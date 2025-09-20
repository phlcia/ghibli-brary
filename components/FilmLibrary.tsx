'use client';

import { useMemo, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { applyFilters, applySort, createDefaultFilters, getFilterOptions } from '@/lib/filmUtils';
import { Film, FilmSortOption } from '@/types/film';

import { EmptyState } from './EmptyState';
import { FilmCard } from './FilmCard';
import { FilterPanel } from './FilterPanel';
import { SearchInput } from './SearchInput';
import { SortSelect } from './SortSelect';

interface FilmLibraryProps {
  films: Film[];
}

const DIRECTOR_KEY = 'director';
const PRODUCER_KEY = 'producer';
const YEAR_KEY = 'year';

function getArrayParam(params: URLSearchParams, key: string): string[] {
  return params.getAll(key);
}

function getNumberParam(params: URLSearchParams, key: string, defaultValue: number) {
  const value = Number.parseInt(params.get(key) ?? '', 10);
  if (Number.isFinite(value)) {
    return value;
  }
  return defaultValue;
}

function getSortParam(params: URLSearchParams): FilmSortOption {
  const value = params.get('sort') as FilmSortOption | null;
  if (value === 'title-asc' || value === 'release-desc' || value === 'rating-desc') {
    return value;
  }
  return 'title-asc';
}

export function FilmLibrary({ films }: FilmLibraryProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchValue = searchParams.get('search') ?? '';
  const selectedDirectors = getArrayParam(searchParams, DIRECTOR_KEY);
  const selectedProducers = getArrayParam(searchParams, PRODUCER_KEY);
  const selectedYears = getArrayParam(searchParams, YEAR_KEY);
  const minScore = Math.min(Math.max(getNumberParam(searchParams, 'minScore', 0), 0), 100);
  const sort = getSortParam(searchParams);

  const filters = useMemo(
    () =>
      createDefaultFilters({
        search: searchValue,
        directors: selectedDirectors,
        producers: selectedProducers,
        years: selectedYears,
        minScore,
        sort,
      }),
    [searchValue, selectedDirectors, selectedProducers, selectedYears, minScore, sort],
  );

  const filterOptions = useMemo(() => getFilterOptions(films), [films]);

  const { filteredFilms, visibleFilms } = useMemo(() => {
    const filtered = applyFilters(films, filters);
    const sorted = applySort(filtered, filters.sort);

    return {
      filteredFilms: filtered,
      visibleFilms: sorted,
    };
  }, [films, filters]);

  const updateQuery = useCallback(
    (apply: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      apply(params);

      const next = params.toString();
      const current = searchParams.toString();
      const href = next ? `${pathname}?${next}` : pathname;

      if (next !== current) {
        router.replace(href, { scroll: false });
      }
    },
    [pathname, router, searchParams],
  );

  const setParam = useCallback(
    (key: string, value: string | null) => {
      updateQuery((params) => {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
    },
    [updateQuery],
  );

  const setArrayParam = useCallback(
    (key: string, values: string[]) => {
      updateQuery((params) => {
        params.delete(key);
        values.filter(Boolean).forEach((value) => {
          params.append(key, value);
        });
      });
    },
    [updateQuery],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setParam('search', value.trim().length ? value : null);
    },
    [setParam],
  );

  const handleToggle = useCallback(
    (selected: string[], value: string, key: string) => {
      const set = new Set(selected);
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
      setArrayParam(key, Array.from(set));
    },
    [setArrayParam],
  );

  const handleMinScoreChange = useCallback(
    (value: number) => {
      const clamped = Math.min(Math.max(value, 0), 100);
      setParam('minScore', clamped > 0 ? clamped.toString() : null);
    },
    [setParam],
  );

  const handleSortChange = useCallback(
    (value: FilmSortOption) => {
      setParam('sort', value === 'title-asc' ? null : value);
    },
    [setParam],
  );

  const handleClearAll = useCallback(() => {
    updateQuery((params) => {
      params.delete('search');
      params.delete(DIRECTOR_KEY);
      params.delete(PRODUCER_KEY);
      params.delete(YEAR_KEY);
      params.delete('minScore');
      params.delete('sort');
    });
  }, [updateQuery]);

  const totalResults = filteredFilms.length;
  const rangeLabel = totalResults === 0 ? '0' : `1-${totalResults}`;
  const hasActiveFilters =
    Boolean(searchValue.trim()) ||
    selectedDirectors.length > 0 ||
    selectedProducers.length > 0 ||
    selectedYears.length > 0 ||
    minScore > 0 ||
    sort !== 'title-asc';

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-forest-primary">ghibli-brary</h1>
          <p className="mt-2 max-w-2xl text-sm text-forest-muted">
            Browse the Studio Ghibli catalog, refine by director, producer, release year, or
            Rotten Tomatoes score, and sort to find your next favorite film.
          </p>
        </div>
        <div className="w-full max-w-md">
          <SearchInput value={searchValue} onChange={handleSearchChange} />
        </div>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-72 lg:flex-shrink-0">
          <FilterPanel
            directors={filterOptions.directors}
            producers={filterOptions.producers}
            years={filterOptions.years}
            selectedDirectors={selectedDirectors}
            selectedProducers={selectedProducers}
            selectedYears={selectedYears}
            minScore={minScore}
            onToggleDirector={(value) => handleToggle(selectedDirectors, value, DIRECTOR_KEY)}
            onToggleProducer={(value) => handleToggle(selectedProducers, value, PRODUCER_KEY)}
            onToggleYear={(value) => handleToggle(selectedYears, value, YEAR_KEY)}
            onMinScoreChange={handleMinScoreChange}
            onClearAll={handleClearAll}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        <section className="flex-1 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-forest-muted">
              Showing {rangeLabel} of {totalResults} films
            </p>
            <SortSelect value={sort} onChange={handleSortChange} />
          </div>

          {visibleFilms.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleFilms.map((film) => (
                  <FilmCard key={film.id} film={film} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
