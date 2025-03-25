"use client"

import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { BarChart3, ArrowUpDown, Wallet, TrendingUp, AlertCircle, ArrowRight, Calendar, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FinancialPosition } from "@/components/dashboard/financial-position"
import { TransactionForm } from "@/components/dashboard/transaction-form"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { UploadStatement } from "@/components/upload-statement"
import { Recommendations } from "@/components/analytics/recommendations"
import { getFinancialMetrics, getTransactions } from "@/lib/actions/transactions"
import type { FinancialMetrics } from "@/lib/actions/financial"
import type { Transaction } from "@/lib/types"
import { useSession } from "next-auth/react"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function DashboardContent() {
  const { data: session } = useSession()
  const { selectedCurrency } = useCurrencyStore()

  // Use React Query for transactions
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const result = await getTransactions()
      if (result.error) {
        throw new Error(result.error)
      }
      return result.transactions || []
    },
    refetchInterval: 5000,
    staleTime: 0,
  })

  // Use React Query for metrics
  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const result = await getFinancialMetrics()
      if (result.error) {
        throw new Error(result.error)
      }
      return result.metrics
    },
    refetchInterval: 5000,
    staleTime: 0,
  })

  if (transactionsLoading || metricsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8">
      <div className="space-y-8">
        {/* Quick Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(metricsData?.totalRevenue || 0, selectedCurrency.code)}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {metricsData?.revenueGrowth ? (
                  <>
                    {metricsData.revenueGrowth > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
                    )}
                    <span>
                      {Math.abs(metricsData.revenueGrowth).toFixed(1)}% from last month
                    </span>
                  </>
                ) : (
                  <span>No previous data</span>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(metricsData?.totalExpenses || 0, selectedCurrency.code)}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {metricsData?.expenseGrowth ? (
                  <>
                    {metricsData.expenseGrowth > 0 ? (
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-green-500" />
                    )}
                    <span>
                      {Math.abs(metricsData.expenseGrowth).toFixed(1)}% from last month
                    </span>
                  </>
                ) : (
                  <span>No previous data</span>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(metricsData?.cashFlow || 0, selectedCurrency.code)}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {metricsData?.cashFlow ? (
                  <>
                    {metricsData.cashFlow > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
                    )}
                    <span>
                      {metricsData.cashFlow > 0 ? "Positive" : "Negative"} cash flow
                    </span>
                  </>
                ) : (
                  <span>No data available</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Position and Recommendations */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Financial Position</CardTitle>
              <CardDescription>Overview of your assets, liabilities, and equity</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialPosition />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Actionable insights based on your financial data</CardDescription>
            </CardHeader>
            <CardContent>
              <Recommendations />
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction and Recent Transactions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
              <CardDescription>Record a new transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionForm />
            </CardContent>
          </Card>
          <div className="col-span-1 space-y-4">
            <TransactionList transactions={transactionsData || []} />
          </div>
        </div>

        {/* Bank Statement Upload */}
        <UploadStatement />
      </div>
    </div>
  )
}

