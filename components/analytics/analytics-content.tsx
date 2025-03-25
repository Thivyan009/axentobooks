"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ArrowDown, ArrowUp, BarChart3, ChevronDown, FileText, LineChart, PieChart, Wallet, TrendingUp, AlertCircle, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueChart } from "@/components/analytics/revenue-chart"
import { ExpenseChart } from "@/components/analytics/expense-chart"
import { TransactionTrends } from "@/components/analytics/transaction-trends"
import { FinancialInsights } from "@/components/analytics/financial-insights"
import { CategoryBreakdown } from "@/components/analytics/category-breakdown"
import { TransactionTable } from "@/components/analytics/transaction-table"
import { useToast } from "@/components/ui/use-toast"
import type { DateRange } from "react-day-picker"
import { useQuery } from "@tanstack/react-query"
import { getFinancialMetrics, getTransactions } from "@/lib/actions/transactions"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import { InsightsTab } from "./insights-tab"

export function AnalyticsContent() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const { toast } = useToast()
  const { selectedCurrency } = useCurrencyStore()

  // Use React Query for transactions and metrics with date range
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", date?.from, date?.to],
    queryFn: async () => {
      const result = await getTransactions()
      if (result.error) {
        throw new Error(result.error)
      }
      return result.transactions || []
    },
  })

  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ["metrics", date?.from, date?.to],
    queryFn: async () => {
      const result = await getFinancialMetrics()
      if (result.error) {
        throw new Error(result.error)
      }
      return result.metrics
    },
  })

  // Calculate transaction count
  const transactionCount = transactionsData?.length || 0

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-8">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metricsData?.totalRevenue || 0, selectedCurrency.code)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {metricsData?.revenueGrowth !== undefined ? (
                <>
                  {metricsData.revenueGrowth > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
                  )}
                  <span className={metricsData.revenueGrowth > 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(metricsData.revenueGrowth).toFixed(1)}% from last month
                  </span>
                </>
              ) : (
                <span>No previous data</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metricsData?.totalExpenses || 0, selectedCurrency.code)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {metricsData?.expenseGrowth !== undefined ? (
                <>
                  {metricsData.expenseGrowth > 0 ? (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-green-500" />
                  )}
                  <span className={metricsData.expenseGrowth > 0 ? "text-red-500" : "text-green-500"}>
                    {Math.abs(metricsData.expenseGrowth).toFixed(1)}% from last month
                  </span>
                </>
              ) : (
                <span>No previous data</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metricsData?.cashFlow || 0, selectedCurrency.code)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {metricsData?.cashFlow !== undefined ? (
                <>
                  {metricsData.cashFlow > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
                  )}
                  <span className={metricsData.cashFlow > 0 ? "text-green-500" : "text-red-500"}>
                    {metricsData.cashFlow > 0 ? "Positive" : "Negative"} cash flow
                  </span>
                </>
              ) : (
                <span>No data available</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactionsLoading ? "Loading..." : transactionCount}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {metricsData?.transactionFrequency !== undefined ? (
                <>
                  <TrendingUp className="h-3 w-3 text-blue-500" />
                  <span className="text-blue-500">
                    {metricsData.transactionFrequency.toFixed(1)} transactions/day
                  </span>
                </>
              ) : (
                <span>No data available</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6">
            <div className="grid gap-6 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <RevenueChart dateRange={date} />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Revenue by category</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <CategoryBreakdown dateRange={date} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Expense Analysis</CardTitle>
                  <CardDescription>Monthly expense breakdown</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ExpenseChart dateRange={date} />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Financial Insights</CardTitle>
                  <CardDescription>AI-powered analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <FinancialInsights dateRange={date} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Transaction Analysis</CardTitle>
                  <CardDescription>Detailed transaction breakdown</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TransactionTable dateRange={date} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <InsightsTab dateRange={date} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

