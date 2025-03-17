import { Skeleton } from "@/components/ui/skeleton"

const statCards = ["revenue", "expenses", "profit", "transactions"]
const sideCharts = ["weekly", "monthly"]
const transactions = ["t1", "t2", "t3", "t4", "t5"]

export function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card} className="rounded-lg border bg-card p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-7 w-[180px]" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart */}
        <div className="col-span-4 rounded-lg border bg-card">
          <div className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-[180px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
            <div className="mt-6 space-y-2">
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>

        {/* Side Charts */}
        <div className="col-span-3 space-y-4">
          {sideCharts.map((chart) => (
            <div key={chart} className="rounded-lg border bg-card p-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
              <div className="mt-6">
                <Skeleton className="h-[150px] w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <div className="mt-6 space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-[100px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 