'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/session';
import { Movie } from '@/lib/tmdb.server';
import { paths } from '@/lib/paths';

export async function addMovieToWatchlist(movieData: Movie) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error('This action requires authentication.');
  }

  // Use a transaction to ensure that either both operations succeed or none
  await prisma.$transaction(async (tx) => {
    // 3. Perform an Upsert for the movie
    await tx.movie.upsert({
      where: { id: movieData.id }, // Look for the movie by its unique ID
      update: {}, // If the movie already exists, do not update anything
      create: {
        ...movieData,
      },
    });

    // Create a record in the database
    await tx.watchlist.create({
      data: {
        userId: userId,
        movieId: movieData.id,
      },
    });
  });

  revalidatePath(paths.home());
  revalidatePath(paths.watchlist()); // Refreshes the watchlist page cache. This function tells Next.js: "The data on the /watchlist page has changed, so the next time someone requests it, regenerate it instead of serving it from cache."
}

export async function removeMovieFromWatchlist(movieId: number) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error('This action requires authentication.');
  }

  await prisma.watchlist.delete({
    where: {
      userId_movieId: {
        userId: userId,
        movieId: movieId,
      },
    },
  });

  revalidatePath('/watchlist');
}
