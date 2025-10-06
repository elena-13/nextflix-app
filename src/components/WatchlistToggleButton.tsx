'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { addMovieToWatchlist, removeMovieFromWatchlist } from '@/app/watchlist/actions';
import { Movie } from '@/lib/tmdb.server';

type WatchlistToggleButtonProps = {
  movie: Movie;
  initialIsInWatchlist: boolean;
  className?: string;
};

export function WatchlistToggleButton({
  movie,
  initialIsInWatchlist,
  className,
}: WatchlistToggleButtonProps) {
  const { status } = useSession();
  const router = useRouter();

  const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (status !== 'authenticated') {
      router.push(`/api/auth/signin?callbackUrl=/`);
      return;
    }

    startTransition(async () => {
      if (isInWatchlist) {
        await removeMovieFromWatchlist(movie.id);
        setIsInWatchlist(false);
      } else {
        await addMovieToWatchlist(movie);
        setIsInWatchlist(true);
      }
    });
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        'absolute right-2 top-2 z-10 h-8 w-8 rounded-full',
        isPending && 'opacity-100',
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
      disabled={isPending || status === 'loading'}
      aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {isInWatchlist ? (
        <BookmarkCheck className="h-4 w-4 text-primary" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </Button>
  );
}
