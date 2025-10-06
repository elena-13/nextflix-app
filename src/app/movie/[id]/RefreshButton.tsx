'use client';
import { useTransition } from 'react';
import { refreshMovie } from './actions';

export function RefreshButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() =>
        start(async () => {
          await refreshMovie(id);
          location.reload();
        })
      }
      className="rounded-md border px-3 py-2 text-sm"
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? 'Refreshing…' : 'Refresh data'}
    </button>
  );
}
