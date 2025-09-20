'use client';

import { ChangeEvent } from 'react';

import { FilmSortOption } from '@/types/film';

interface SortSelectProps {
  value: FilmSortOption;
  onChange: (value: FilmSortOption) => void;
}

const OPTIONS: { value: FilmSortOption; label: string }[] = [
  { value: 'title-asc', label: 'Title (A → Z)' },
  { value: 'release-desc', label: 'Release (new → old)' },
  { value: 'rating-desc', label: 'Rating (high → low)' },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as FilmSortOption);
  };

  return (
    <label className="flex items-center gap-3 text-sm text-forest-muted">
      <span className="whitespace-nowrap">Sort by</span>
      <select
        value={value}
        onChange={handleChange}
        className="rounded-lg border border-forest-soft surface-card px-3 py-2 text-sm text-forest-primary focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--color-sky-300)]"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
