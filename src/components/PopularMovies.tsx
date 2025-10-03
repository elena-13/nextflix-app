import { getPopularMovies } from '@/lib/tmdb.server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/session';

import { MovieList } from './MovieList';

export default async function PopularMovies() {
  const moviesPromise = getPopularMovies();
  const userIdPromise = getCurrentUserId();

  const [movies, userId] = await Promise.all([moviesPromise, userIdPromise]);

  // 2. If the user is logged in, retrieve the movie IDs from their watchlist
  let watchlistMovieIds = new Set<number>();
  if (userId) {
    const watchlist = await prisma.watchlist.findMany({
      where: { userId: userId },
      select: { movieId: true }, // Request only IDs for efficiency
    });
    // Convert the array of objects into a Set for fast lookup (O(1))
    watchlistMovieIds = new Set(watchlist.map((item) => item.movieId));
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">Popular films today</h1>
      <MovieList movies={movies} watchlistMovieIds={watchlistMovieIds} />
    </>
  );
}
