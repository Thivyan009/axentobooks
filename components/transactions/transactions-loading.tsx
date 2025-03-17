export function TransactionsLoading() {
  return (
    <main className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
          <div className="mt-1 h-4 w-24 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-9 w-[140px] animate-pulse rounded-md bg-muted" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-[100px] animate-pulse rounded-md bg-muted" />
      </div>
      <div className="rounded-md border">
        <div className="h-[400px] animate-pulse bg-muted" />
      </div>
    </main>
  )
}

