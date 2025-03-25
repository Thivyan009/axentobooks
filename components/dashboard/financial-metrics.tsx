"use client"

import { useQuery } from "@tanstack/react-query"
import { ArrowDown, ArrowUp, BarChart3, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getFinancialMetrics } from "@/lib/actions/transactions"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function FinancialMetrics() {
  const { selectedCurrency } = useCurrencyStore()

  const { data: metricsData, isLoading, error } = useQuery({
    queryKey: ["financial-metrics"],
    queryFn: async () => {
      try {
        const result = await getFinancialMetrics()
        if (result.error) {
          throw new Error(result.error)
        }
        return result.metrics
      } catch (error) {
        console.error("Error fetching financial metrics:", error)
        throw error
      }
    },
    retry: 3, // Retry failed requests 3 times
    retryDelay: 1000, // Wait 1 second between retries
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 0, // Consider data stale immediately
  })

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load financial metrics. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={`loading-${i}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Total Revenue</CardTitle>
          <ArrowUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
            {formatCurrency(metricsData?.totalRevenue || 0, selectedCurrency.code)}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <span className="text-green-500">+{metricsData?.revenueGrowth.toFixed(1)}%</span>
            <span>vs last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">Total Expenses</CardTitle>
          <ArrowDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700 dark:text-red-400">
            {formatCurrency(metricsData?.totalExpenses || 0, selectedCurrency.code)}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <ArrowUp className="h-4 w-4 text-red-500" />
            <span className="text-red-500">+{metricsData?.expenseGrowth.toFixed(1)}%</span>
            <span>vs last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Cash Flow</CardTitle>
          <BarChart3 className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {formatCurrency(metricsData?.cashFlow || 0, selectedCurrency.code)}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <span>Net profit/loss</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 