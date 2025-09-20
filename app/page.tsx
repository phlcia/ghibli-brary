import { ErrorState } from '@/components/ErrorState';
import { FilmLibrary } from '@/components/FilmLibrary';
import { getFilms } from '@/lib/ghibliApi';

export default async function HomePage() {
  try {
    const films = await getFilms();
    return (
      <main className="min-h-screen pb-16">
        <FilmLibrary films={films} />
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error fetching films.';
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-20">
        <ErrorState message={message} />
      </main>
    );
  }
}
