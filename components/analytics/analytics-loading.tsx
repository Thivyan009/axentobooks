export function AnalyticsLoading() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-card">
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-[180px] animate-pulse rounded-md bg-muted" />
              </div>
              <div className="h-8 w-1/2 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
              <div className="h-[80px] w-full animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card">
          <div className="p-6 space-y-2">
            <div className="h-6 w-1/3 animate-pulse rounded-md bg-muted" />
            <div className="space-y-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card">
          <div className="p-6 space-y-2">
            <div className="h-6 w-1/3 animate-pulse rounded-md bg-muted" />
            <div className="h-[200px] animate-pulse rounded-md bg-muted mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

