import Link from 'next/link';

import { Film } from 'lucide-react';

import { paths } from '@/lib/paths';

import { ThemeToggle } from './theme-toggle';
import { HeaderSearchInput } from './header/HeaderSearchInput';
import { Suspense } from 'react';
import { AuthButtons } from './AuthButtons';
import { HeaderWatchlistLink } from './header/HeaderWatchlistLink';
import { MobileSearchButton } from './header/MobileSearchButton';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={paths.home()} className="flex items-center gap-2 shrink-0">
          <Film className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">NextFlix</span>
        </Link>

        {/* Desktop search */}
        <div className="hidden md:block flex-1 min-w-0 px-4">
          <Suspense fallback={<div className="w-full max-w-md mx-auto h-9 rounded-md bg-muted" />}>
            <HeaderSearchInput />
          </Suspense>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <MobileSearchButton />
          <HeaderWatchlistLink />
          <ThemeToggle />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
