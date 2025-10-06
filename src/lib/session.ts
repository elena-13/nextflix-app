import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

/**
 * Retrieves the ID of the currently authenticated user on the server.
 * @returns {Promise<string | null>} The user ID, or null if not authenticated.
 */

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getAuthSession();
  // We can access the id because we added it in the callbacks!
  return session?.user?.id ?? null;
}
