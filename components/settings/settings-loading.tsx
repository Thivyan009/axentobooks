export function SettingsLoading() {
  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="h-px w-full animate-pulse bg-muted" />
      <div className="space-y-6">
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
        <div className="space-y-4">
          <div className="h-32 w-full animate-pulse rounded-lg border bg-card" />
          <div className="h-32 w-full animate-pulse rounded-lg border bg-card" />
          <div className="h-32 w-full animate-pulse rounded-lg border bg-card" />
        </div>
      </div>
    </div>
  )
}

