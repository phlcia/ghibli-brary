'use client';

import { ChangeEvent, useEffect, useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search films' }: SearchInputProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (draft !== value) {
        onChange(draft);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [draft, value, onChange]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  return (
    <div className="relative flex w-full items-center">
      <span
        className="pointer-events-none absolute left-4 inline-flex h-5 w-5 items-center justify-center text-[color:var(--color-sky-300)]"
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      <input
        type="search"
        value={draft}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search films by title or description"
        className="w-full rounded-xl border border-forest-soft surface-card py-3 pl-11 pr-4 text-base text-forest-primary transition focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--color-sky-300)]"
      />
    </div>
  );
}
