import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/session';
import { Movie } from '@prisma/client';

export default async function WatchlistPage() {
  const userId = await getCurrentUserId();

  // If the user is not logged in, redirect to the login page
  if (!userId) {
    redirect('/api/auth/signin?callbackUrl=/watchlist');
  }

  const userWithWatchlist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      watchlist: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          movie: true,
        },
      },
    },
  });

  const movies: Movie[] =
    userWithWatchlist?.watchlist.map((watchlistItem) => watchlistItem.movie) ?? [];

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">My &quot;Watch Later&quot; List</h1>
      {movies.length === 0 ? (
        <p>Your list is currently empty. Add some movies to see them here.</p>
      ) : (
        <div>Temp</div>
        // <WatchlistClient initialWatchlist={movies} />
      )}
    </>
  );
}
