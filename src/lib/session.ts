import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

/**
 * Получает ID текущего авторизованного пользователя на сервере.
 * @returns {Promise<string | null>} ID пользователя или null, если не авторизован.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getAuthSession();
  // Мы можем обращаться к id, потому что добавили его в callbacks!
  return session?.user?.id ?? null;
}
