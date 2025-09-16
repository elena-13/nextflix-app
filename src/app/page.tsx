import { MovieCard } from '@/components/movie-card';
import { getPopularMovies } from '@/lib/tmdb.server';

export default async function HomePage() {
  const movies = await getPopularMovies();

  return (
    <div className="container mx-auto px-4 py-8">
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
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Failed to load movies. Please try again later.</p>
      )}
    </div>
  );
}
