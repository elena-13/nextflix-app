'use server';

import { revalidateTag } from 'next/cache';

export async function refreshMovie(id: string | number) {
  revalidateTag(`movie:${id}`);
}
