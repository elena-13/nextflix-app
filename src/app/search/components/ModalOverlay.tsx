'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export function ModalOverlay({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [router]);

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
      onClick={() => router.back()} // on click overlay - close modal
    >
      <main
        className="container mx-auto px-4 py-8 h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // stop close when user clicks inside
      >
        {children}
      </main>
    </div>
  );
}
