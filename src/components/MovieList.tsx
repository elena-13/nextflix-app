import { Movie } from '@/lib/tmdb.server';
import { MovieCard } from './movie-card';

type MovieListProps = {
  movies: Movie[];
  watchlistMovieIds?: Set<number>; // Опциональный Set для определения, в списке ли фильм
};

export function MovieList({ movies, watchlistMovieIds = new Set() }: MovieListProps) {
  if (movies.length === 0) {
    return <p className="text-muted-foreground">No movies found.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          initialIsInWatchlist={watchlistMovieIds.has(movie.id)}
        />
      ))}
    </div>
  );
}
