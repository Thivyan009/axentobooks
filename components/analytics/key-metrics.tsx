"use client"

import { useQuery } from "@tanstack/react-query"
import { getTransactions } from "@/lib/actions/transactions"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import type { DateRange } from "react-day-picker"
import { ArrowDownRight, ArrowUpRight, DollarSign, TrendingUp, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface KeyMetricsProps {
  dateRange?: DateRange
}

export function KeyMetrics({ dateRange }: KeyMetricsProps) {
  const { selectedCurrency } = useCurrencyStore()

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["transactions", dateRange?.from, dateRange?.to],
    queryFn: async () => {
      const result = await getTransactions()
      if (result.error) {
        throw new Error(result.error)
      }
      return result.transactions || []
    },
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
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

  // Get current and last month dates
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear

  // Helper function to check if a date is in a specific month and year
  const isInMonth = (date: Date, month: number, year: number) => {
    return date.getMonth() === month && date.getFullYear() === year
  }

  // Calculate current month metrics
  const currentMonthIncome = transactionsData?.reduce((sum, t) => {
    const date = new Date(t.date)
    return sum + (isInMonth(date, currentMonth, currentYear) && t.type === 'income' ? t.amount : 0)
  }, 0) || 0

  const currentMonthExpenses = transactionsData?.reduce((sum, t) => {
    const date = new Date(t.date)
    return sum + (isInMonth(date, currentMonth, currentYear) && t.type === 'expense' ? t.amount : 0)
  }, 0) || 0

  const currentMonthNet = currentMonthIncome - currentMonthExpenses
  const currentMonthSavingsRate = currentMonthIncome > 0 ? (currentMonthNet / currentMonthIncome) * 100 : 0

  // Calculate last month metrics
  const lastMonthIncome = transactionsData?.reduce((sum, t) => {
    const date = new Date(t.date)
    return sum + (isInMonth(date, lastMonth, lastYear) && t.type === 'income' ? t.amount : 0)
  }, 0) || 0

  const lastMonthExpenses = transactionsData?.reduce((sum, t) => {
    const date = new Date(t.date)
    return sum + (isInMonth(date, lastMonth, lastYear) && t.type === 'expense' ? t.amount : 0)
  }, 0) || 0

  const lastMonthNet = lastMonthIncome - lastMonthExpenses
  const lastMonthSavingsRate = lastMonthIncome > 0 ? (lastMonthNet / lastMonthIncome) * 100 : 0

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const incomeChange = calculateChange(currentMonthIncome, lastMonthIncome)
  const expensesChange = calculateChange(currentMonthExpenses, lastMonthExpenses)
  const netChange = calculateChange(currentMonthNet, lastMonthNet)
  const savingsRateChange = currentMonthSavingsRate - lastMonthSavingsRate

  const metrics = [
    {
      title: "Total Income",
      value: formatCurrency(currentMonthIncome, selectedCurrency.code),
      icon: DollarSign,
      description: "Income for current month",
      change: incomeChange,
      trend: incomeChange >= 0 ? "up" : "down",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(currentMonthExpenses, selectedCurrency.code),
      icon: Wallet,
      description: "Expenses for current month",
      change: expensesChange,
      trend: expensesChange <= 0 ? "up" : "down",
    },
    {
      title: "Net Income",
      value: formatCurrency(currentMonthNet, selectedCurrency.code),
      icon: TrendingUp,
      description: "Net income for current month",
      change: netChange,
      trend: netChange >= 0 ? "up" : "down",
    },
    {
      title: "Savings Rate",
      value: `${currentMonthSavingsRate.toFixed(1)}%`,
      icon: TrendingUp,
      description: "Current month savings rate",
      change: savingsRateChange,
      trend: savingsRateChange >= 0 ? "up" : "down",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
            <div className={`mt-2 flex items-center text-xs ${
              metric.trend === "up" ? "text-green-500" : "text-red-500"
            }`}>
              {metric.trend === "up" ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              )}
              {metric.change > 0 ? "+" : ""}{metric.change.toFixed(1)}% vs last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 