'use client';

import { Suspense, useState } from 'react';
import { Search, X } from 'lucide-react';

import { HeaderSearchInput } from './HeaderSearchInput';

export function MobileSearchButton() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Button visible only on mobile */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="md:hidden p-2 rounded-full hover:bg-muted"
        aria-label="Open search"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Overlay search for mobile */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Search</span>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 rounded-full hover:bg-muted"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <Suspense fallback={<div className="h-9 rounded-md bg-muted" />}>
            <HeaderSearchInput />
          </Suspense>
        </div>
      )}
    </>
  );
}
