import { Suspense } from 'react';

import { SearchResults } from './search/components/SearchResults';
import { SearchResultsSkeleton } from './search/components/SearchResultsSkeleton';
import PopularMovies from '@/components/PopularMovies';
import { getQueryFrom, resolveSearchParams, RouteSearchParams } from '@/lib/query';

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<RouteSearchParams>;
}) {
  const sp = await resolveSearchParams(searchParams);
  const query = getQueryFrom(sp);

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
