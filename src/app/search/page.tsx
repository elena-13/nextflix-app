import { Suspense } from 'react';

import { SearchResults } from './components/SearchResults';
import { SearchResultsSkeleton } from './components/SearchResultsSkeleton';

type SearchPageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const raw = searchParams?.query;
  const query = typeof raw === 'string' ? raw : raw?.[0] ?? '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mt-8">
        {query ? (
          <Suspense key={query} fallback={<SearchResultsSkeleton />}>
            <SearchResults query={query} />
          </Suspense>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Start typing the movie title in the search field above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
