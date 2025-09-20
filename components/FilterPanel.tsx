'use client';

interface FilterPanelProps {
  directors: string[];
  producers: string[];
  years: string[];
  selectedDirectors: string[];
  selectedProducers: string[];
  selectedYears: string[];
  minScore: number;
  onToggleDirector: (value: string) => void;
  onToggleProducer: (value: string) => void;
  onToggleYear: (value: string) => void;
  onMinScoreChange: (value: number) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

function renderCheckboxGroup(
  label: string,
  options: string[],
  selected: string[],
  onToggle: (value: string) => void,
) {
  if (options.length === 0) {
    return null;
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-forest-primary">{label}</legend>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs text-[color:var(--color-sky-300)]">
          {selected.map((value) => (
            <span
              key={`${label}-chip-${value}`}
              className="rounded-full border border-[color:var(--color-sky-400)] bg-[color:var(--surface-soft)] px-2 py-0.5 text-forest-primary"
            >
              {value}
            </span>
          ))}
        </div>
      )}
      <div className="grid gap-2">
        {options.map((option) => {
          const id = `${label}-${option}`.replace(/[^a-zA-Z0-9-]/g, '-');
          const isChecked = selected.includes(option);

          return (
            <label
              key={option}
              htmlFor={id}
              className="flex items-center rounded-lg border border-forest-soft surface-soft px-3 py-2 text-sm text-forest-primary transition hover:border-forest-strong cursor-pointer"
            >
              <input
                id={id}
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(option)}
                className="peer sr-only"
              />
              <span className="flex w-full items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-forest-soft bg-transparent transition-colors peer-checked:border-[color:var(--color-sky-400)] peer-checked:bg-[color:var(--color-sky-400)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[color:var(--color-sky-300)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-cloud)] opacity-0 transition-opacity peer-checked:opacity-100" />
                </span>
                <span className="flex-1 text-left">{option}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FilterPanel({
  directors,
  producers,
  years,
  selectedDirectors,
  selectedProducers,
  selectedYears,
  minScore,
  onToggleDirector,
  onToggleProducer,
  onToggleYear,
  onMinScoreChange,
  onClearAll,
  hasActiveFilters,
}: FilterPanelProps) {
  return (
    <aside className="space-y-6 rounded-xl border border-forest-soft surface-panel p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-forest-primary">Filters</h2>
        <button
          type="button"
          onClick={onClearAll}
          disabled={!hasActiveFilters}
          className="text-sm font-medium text-[color:var(--color-sky-400)] underline-offset-4 transition hover:text-[color:var(--color-forest-400)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-sky-300)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      {renderCheckboxGroup('Director', directors, selectedDirectors, onToggleDirector)}
      {renderCheckboxGroup('Producer', producers, selectedProducers, onToggleProducer)}
      {renderCheckboxGroup('Release Year', years, selectedYears, onToggleYear)}

      <section className="space-y-3">
        <div className="flex items-center justify-between text-sm text-forest-primary">
          <span className="font-semibold">Minimum RT score</span>
          <span>{minScore}</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={minScore}
          onChange={(event) => onMinScoreChange(Number(event.target.value))}
          onInput={(event) => onMinScoreChange(Number((event.target as HTMLInputElement).value))}
          aria-label="Minimum Rotten Tomatoes score"
          className="w-full accent-[color:var(--color-sky-400)]"
        />
      </section>
    </aside>
  );
}
