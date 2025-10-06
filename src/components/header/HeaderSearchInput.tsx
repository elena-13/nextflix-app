'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';

export function HeaderSearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
      router.replace(`/?${params.toString()}`);
    } else {
      params.delete('query');
      router.replace('/');
    }
  }, 500);

  return (
    <Input
      type="search"
      placeholder="Search movies..."
      className="w-full max-w-md mx-auto"
      defaultValue={searchParams.get('query') ?? ''}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
