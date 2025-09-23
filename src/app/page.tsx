import { Suspense } from 'react';

import { SearchResults } from './search/components/SearchResults';
import { SearchResultsSkeleton } from './search/components/SearchResultsSkeleton';
import PopularMovies from '@/components/PopularMovies';

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function HomePage({ searchParams }: Props) {
  const raw = searchParams?.query;
  const query = typeof raw === 'string' ? raw : raw?.[0] ?? '';

  return (
    <div className="mt-8">
      {query ? (
        <Suspense key={query} fallback={<SearchResultsSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      ) : (
        <Suspense fallback={<div className="text-muted-foreground">Loading popular…</div>}>
          <PopularMovies />
        </Suspense>
      )}
    </div>
  );
}
