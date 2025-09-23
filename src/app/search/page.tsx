import { Suspense } from 'react';
import { SearchInput } from './components/SearchInput';
import { SearchResults } from './components/SearchResults';
import { SearchResultsSkeleton } from './components/SearchResultsSkeleton';

// searchParams автоматически передаются в компонент page.tsx
export default function SearchPage({ searchParams }: { searchParams?: { query?: string } }) {
  const query = searchParams?.query || '';

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Поиск</h1>

      {/* SearchInput - это Client Component, он рендерится сразу */}
      <SearchInput />

      <div className="mt-8">
        {/* Suspense - это граница, которая управляет потоковой передачей */}
        <Suspense key={query} fallback={<SearchResultsSkeleton />}>
          {/* SearchResults - это Server Component. Его рендер будет "отложен" */}
          <SearchResults query={query} />
        </Suspense>
      </div>
    </main>
  );
}
