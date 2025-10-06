'use client';

import { paths } from '@/lib/paths';
import Image from 'next/image';
import Link from 'next/link';
import { WatchlistToggleButton } from './WatchlistToggleButton';
import { Movie } from '@/lib/tmdb.server';

type MovieCardProps = Readonly<{
  movie: Movie;
  initialIsInWatchlist: boolean;
  priority?: boolean;
  prefetch?: boolean;
}>;

/** Build TMDB image URL for a given size */
function tmdbPosterUrl(path: string, size: 'w500' | 'w780' | 'original' = 'w500') {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/** Extracts year from "YYYY-MM-DD" safely */
function yearFromIso(iso?: string | null): string {
  if (!iso || iso.length < 4) return 'N/A';
  const y = iso.slice(0, 4);
  return /^\d{4}$/.test(y) ? y : 'N/A';
}

export function MovieCard({
  movie,
  initialIsInWatchlist,
  priority = false,
  prefetch = false,
}: MovieCardProps) {
  const { id, title, posterPath = '', releaseDate = '' } = movie;

  const year = yearFromIso(releaseDate);
  const imageUrl = posterPath ? tmdbPosterUrl(posterPath, 'w500') : null;

  return (
    <div>
      <div className="group relative block">
        <WatchlistToggleButton
          movie={movie}
          initialIsInWatchlist={initialIsInWatchlist}
          className="transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />
      </div>
      <Link
        href={paths.movie(id)}
        prefetch={prefetch}
        aria-label={`Open movie: ${title}`}
        className="group block"
      >
        <div className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
          <div className="relative aspect-[2/3] w-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACw="
                priority={priority}
              />
            ) : (
              /* fallback poster */
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                No poster
              </div>
            )}
          </div>
        </div>
        <div className="mt-2">
          <h3 className="truncate text-lg font-semibold group-hover:text-primary">{title}</h3>
          <p className="text-sm text-muted-foreground">{year}</p>
        </div>
      </Link>
    </div>
  );
}
