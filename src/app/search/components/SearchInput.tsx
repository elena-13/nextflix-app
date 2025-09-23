'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    // Обновляем URL без перезагрузки страницы
    router.replace(`/search?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Поиск фильмов..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}
