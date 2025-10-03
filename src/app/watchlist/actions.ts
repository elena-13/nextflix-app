'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/session';

export async function addMovieToWatchlist(movieId: number) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error('This action requires authentication.');
  }

  // Create a record in the database
  await prisma.watchlist.create({
    data: {
      userId: userId,
      movieId: movieId,
    },
  });

  revalidatePath('/watchlist'); // Refreshes the watchlist page cache. This function tells Next.js: "The data on the /watchlist page has changed, so the next time someone requests it, regenerate it instead of serving it from cache."
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
