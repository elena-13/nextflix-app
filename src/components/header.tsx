import Link from 'next/link';

import { Film } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { paths } from '@/lib/paths';

import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={paths.home()} className="flex items-center gap-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">NextFlix</span>
        </Link>

        <div className="flex-1 px-8">
          <Input type="search" placeholder="Search movies..." className="w-full max-w-md mx-auto" />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button>Login</Button>
        </div>
      </div>
    </header>
  );
}
