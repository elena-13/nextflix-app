'use server';

import { z } from 'zod';
import { cache } from 'react';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN;
if (!TMDB_TOKEN) {
  throw new Error('Missing TMDB_API_READ_ACCESS_TOKEN');
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(`${TMDB_BASE}${path}`);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function fetchJson<T>(
  url: string,
  opts: {
    revalidate?: number | false;
    tags?: string[];
    cache?: RequestCache;
    timeoutMs?: number;
  } = {}
): Promise<T> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), opts.timeoutMs ?? 8000);

  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
    cache: opts.cache,
    next: {
      revalidate: opts.revalidate ?? 3600,
      tags: opts.tags,
    },
    signal: controller.signal,
  }).finally(() => clearTimeout(t));

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`TMDB ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

/* ----------- Schemas & domain mapping ----------- */

const TmdbMovie = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable().optional(),
  release_date: z.string().nullable().optional(),
});

const TmdbPopular = z.object({
  results: z.array(TmdbMovie),
});

export type Movie = Readonly<{
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
}>;

/** Popular movies with ISR + tag for on-demand revalidate */
export const getPopularMovies = cache(
  async (
    opts: {
      language?: string;
      page?: number;
    } = {}
  ): Promise<Movie[]> => {
    const url = buildUrl('/movie/popular', {
      language: opts.language ?? 'en-US',
      page: opts.page ?? 1,
    });

    const data = await fetchJson<unknown>(url, {
      revalidate: 3600,
      tags: ['popular'], // later you can call revalidateTag("popular")
    });

    const parsed = TmdbPopular.safeParse(data);
    if (!parsed.success) {
      return [];
    }

    return parsed.data.results.map((m) => ({
      id: m.id,
      title: m.title,
      posterPath: m.poster_path ?? null,
      releaseDate: m.release_date ?? null,
    }));
  }
);

/* ----------- Schemas & domain mapping for Movie Details ----------- */

const TmdbMovieDetails = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().nullable(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string().nullable(),
  vote_average: z.number(),
  genres: z.array(z.object({ name: z.string() })).default([]),
});

export type MovieDetails = Readonly<{
  id: number;
  title: string;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  rating: number; // vote_average
  genres: string[];
}>;

export const getMovieDetails = async (
  id: number | string,
  opts: {
    language?: string;
  } = {}
): Promise<MovieDetails | null> => {
  const url = buildUrl(`/movie/${id}`, {
    language: opts.language ?? 'en-US',
  });

  try {
    const data = await fetchJson<unknown>(url, {
      revalidate: 3600, // TTL (ISR) 1 hour
      // Granularity example: Unique tag for each movie enables precise cache invalidation
      // Instead of clearing all movie data, we can target just this specific movie
      tags: [`movie:${id}`],
    });

    const parsed = TmdbMovieDetails.safeParse(data);
    if (!parsed.success) {
      return null;
    }

    const details = parsed.data;
    return {
      id: details.id,
      title: details.title,
      overview: details.overview,
      posterPath: details.poster_path,
      backdropPath: details.backdrop_path,
      releaseDate: details.release_date,
      rating: details.vote_average,
      genres: details.genres.map((g) => g.name),
    };
  } catch (error) {
    console.error(`Movie with id ${id} not found`, error);
    return null;
  }
};
