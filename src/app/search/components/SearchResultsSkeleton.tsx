export function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-muted aspect-[2/3] w-full rounded-lg" />
          <div className="mt-2 h-4 w-3/4 bg-muted rounded" />
          <div className="mt-1 h-3 w-1/4 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
