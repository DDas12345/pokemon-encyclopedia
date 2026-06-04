export function CardSkeleton() {
  return (
    <div className="skeleton-card animate-pulse rounded-2xl p-4">
      <div className="mx-auto mb-3 h-24 w-24 rounded-full bg-[var(--skeleton)]" />
      <div className="mx-auto mb-2 h-4 w-2/3 rounded bg-[var(--skeleton)]" />
      <div className="mx-auto h-3 w-1/2 rounded bg-[var(--skeleton)]" />
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded bg-[var(--skeleton)]" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-[var(--skeleton)]" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 rounded bg-[var(--skeleton)]" style={{ width: `${90 - i * 10}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
