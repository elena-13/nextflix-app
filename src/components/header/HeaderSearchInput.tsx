'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';

export function HeaderSearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState(searchParams.get('query') || '');

  useEffect(() => {
    setInputValue(searchParams.get('query') || '');
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    if (term) {
      // Если пользователь что-то ввел, перенаправляем на страницу поиска
      router.push(`/search?query=${term}`);
    } else {
      // Если поле очистили, можно вернуть на главную или остаться на странице поиска
      // Давайте вернем на главную для лучшего UX
      router.push('/');
    }
  }, 500); // Увеличим debounce для шапки

  return (
    <Input
      type="search"
      placeholder="Search movies..."
      className="w-full max-w-md mx-auto"
      value={inputValue}
      onChange={(e) => {
        const term = e.target.value;
        setInputValue(term);
        handleSearch(term);
      }}
    />
  );
}
