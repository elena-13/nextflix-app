import { Suspense } from 'react';

import { SearchResults } from './search/components/SearchResults';
import { SearchResultsSkeleton } from './search/components/SearchResultsSkeleton';
import PopularMovies from '@/components/PopularMovies';
import { getQueryFrom, RouteSearchParams } from '@/lib/query';

type Props = { searchParams?: RouteSearchParams };

export default async function HomePage({ searchParams }: Props) {
  const query = getQueryFrom(searchParams);

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
