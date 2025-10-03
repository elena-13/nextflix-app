import Link from 'next/link';
import { Bookmark } from 'lucide-react';

import { getCurrentUserId } from '@/lib/session';
import { paths } from '@/lib/paths';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export async function HeaderWatchlistLink() {
  const userId = await getCurrentUserId();

  // If the user is not logged in, redirect to the login page
  if (!userId) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" asChild>
            <Link href={paths.watchlist()} aria-label="Open watchlist">
              <Bookmark className="h-5 w-5" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Watchlist</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
