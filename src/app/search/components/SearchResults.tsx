import { searchMovies } from '@/lib/tmdb.server';
import { MovieCard } from '@/components/movie-card';

export async function SearchResults({ query }: { query: string }) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const movies = await searchMovies(query);

  if (movies.length === 0) {
    return <p>Nothing was found for your request.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} initialIsInWatchlist={false} />
      ))}
    </div>
  );
}
