import { getPopularMovies } from '@/lib/tmdb.server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/session';

import { MovieCard } from '@/components/movie-card';

export default async function PopularMovies() {
  const moviesPromise = getPopularMovies();
  const userIdPromise = getCurrentUserId();

  const [movies, userId] = await Promise.all([moviesPromise, userIdPromise]);

  // 2. Если пользователь залогинен, получаем ID фильмов из его watchlist
  let watchlistMovieIds = new Set<number>();
  if (userId) {
    const watchlist = await prisma.watchlist.findMany({
      where: { userId: userId },
      select: { movieId: true }, // Запрашиваем только ID для эффективности
    });
    // Превращаем массив объектов в Set для быстрого поиска (O(1))
    watchlistMovieIds = new Set(watchlist.map((item) => item.movieId));
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">Popular films today</h1>

      {movies.length ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.posterPath ?? ''}
              releaseDate={movie.releaseDate ?? ''}
              initialIsInWatchlist={watchlistMovieIds.has(movie.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Failed to load movies. Please try again later.</p>
      )}
    </>
  );
}
