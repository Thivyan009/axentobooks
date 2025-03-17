export function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-9 w-[300px] animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-[200px] animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-9 w-[120px] animate-pulse rounded-md bg-muted" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border bg-card">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-1/2 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
              </div>
              <div className="h-4 w-1/3 animate-pulse rounded-md bg-muted" />
              <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

