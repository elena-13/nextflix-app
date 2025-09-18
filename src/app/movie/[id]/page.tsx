import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { getMovieDetails, getPopularMovies } from '@/lib/tmdb.server';

type RouteParams = { id: string };

// This is an instruction for Next.js that it executes only once during the project build.
export async function generateStaticParams() {
  // Generate pages for the 20 most popular movies during the build
  const popularMovies = await getPopularMovies();

  return popularMovies.slice(0, 20).map((movie) => ({
    id: String(movie.id),
  }));
}

// New Next.js rule: params & searchParams are now async, await them first
export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  if (!movie) {
    return { title: 'Movie was now found' };
  }

  const descRaw = movie.overview ?? '';
  const description = descRaw.replace(/\s+/g, ' ').trim().slice(0, 200);

  return {
    title: movie.title,
    description,
    robots: { index: true, follow: true },
  };
}

export default async function MovieDetailsPage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  if (!movie) {
    notFound();
  }

  const backdropUrl = movie.backdropPath
    ? `https://image.tmdb.org/t/p/w1280${movie.backdropPath}`
    : null;
  const posterUrl = movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : null;

  const year = movie.releaseDate?.slice(0, 4) ?? '—';
  const rating = movie.rating != null ? movie.rating.toFixed(1) : '—';

  return (
    <div>
      <div className="relative h-64 md:h-96 w-full">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={`Movi background ${movie.title}`}
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="container mx-auto px-4 py-8 -mt-32 relative">
        <div className="md:flex gap-8">
          <div className="w-48 md:w-64 flex-shrink-0">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={movie.title}
                width={500}
                height={750}
                className="rounded-lg shadow-xl"
                placeholder="blur"
                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACw="
              />
            ) : (
              <div className="aspect-[2/3] bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                No poster
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-0 text-white">
            <h1 className="text-3xl md:text-5xl font-bold">{movie.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-300">
              <span>{year}</span>
              <span>•</span>
              <span>⭐ {rating} / 10</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {movie.genres.map((genre) => (
                <span key={genre} className="px-2 py-1 bg-gray-700 text-xs rounded">
                  {genre}
                </span>
              ))}
            </div>
            <p className="mt-6 text-gray-200 max-w-2xl">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
