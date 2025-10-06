'use client';

import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';

export function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p aria-live="polite">loading…</p>;
  }

  const handleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' });
    } finally {
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } finally {
    }
  };

  if (session) {
    return (
      <div className="flex items-center gap-2">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user?.name ? `Avatar ${session.user.name}` : 'Avatar'}
            width={32}
            height={32}
            className="rounded-full"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}
        <p className="text-sm">Hello, {session.user?.name ?? 'user'}!</p>
        <Button onClick={handleSignOut} aria-label="Log out">
          Log out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleSignIn} aria-label="Login with Google">
      Login
    </Button>
  );
}
