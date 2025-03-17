"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ArrowDown, ArrowUp, BarChart3, ChevronDown, Download, FileText, LineChart, PieChart, Plus } from "lucide-react"
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
import { useRouter } from "next/navigation"
import { InsightsTab } from "./insights-tab"

export function AnalyticsContent() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const { toast } = useToast()
  const { selectedCurrency } = useCurrencyStore()
  const router = useRouter()

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

  const handleExport = () => {
    // Create a report object with the current data
    const reportData = {
      dateRange: {
        from: date?.from,
        to: date?.to,
      },
      metrics: metricsData,
      transactions: transactionsData,
    }

    // Convert to JSON and create download
    const jsonString = JSON.stringify(reportData, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-report-${format(new Date(), "yyyy-MM-dd")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report Exported",
      description: "Your analytics report has been downloaded successfully.",
    })
  }

  const handleCreateReport = () => {
    // Navigate to the custom report builder with pre-filled data
    router.push("/reports/custom")
    toast({
      title: "Creating Report",
      description: "Redirecting to report builder...",
    })
  }

  // Calculate transaction count
  const transactionCount = transactionsData?.length || 0

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-8">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DatePickerWithRange date={date} setDate={setDate} />
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleCreateReport}>
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsLoading ? "Loading..." : formatCurrency(metricsData?.totalRevenue || 0, selectedCurrency.code)}
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">+20.1%</span>
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsLoading ? "Loading..." : formatCurrency(metricsData?.totalExpenses || 0, selectedCurrency.code)}
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <ArrowDown className="h-4 w-4 text-red-500" />
              <span className="text-red-500">-4.5%</span>
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsLoading ? "Loading..." : formatCurrency(metricsData?.cashFlow || 0, selectedCurrency.code)}
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">+12.3%</span>
              <span>vs last month</span>
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
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Total transactions</span>
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

