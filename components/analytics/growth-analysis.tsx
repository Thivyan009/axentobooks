"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useQuery } from "@tanstack/react-query"
import { getFinancialMetrics } from "@/lib/actions/transactions"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import { ArrowDownRight, ArrowUpRight, TrendingUp, TrendingDown, BarChart3, LineChart, PieChart } from "lucide-react"
import type { DateRange } from "react-day-picker"

interface GrowthAnalysisProps {
  dateRange?: DateRange
}

export function GrowthAnalysis({ dateRange }: GrowthAnalysisProps) {
  const { selectedCurrency } = useCurrencyStore()
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["financial-metrics", dateRange?.from, dateRange?.to],
    queryFn: async () => {
      const result = await getFinancialMetrics()
      if (result.error) {
        throw new Error(result.error)
      }
      return result.metrics
    },
  })

  const getGrowthStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return "good"
    if (value >= thresholds.warning) return "warning"
    return "poor"
  }

  const getGrowthColor = (status: "good" | "warning" | "poor") => {
    switch (status) {
      case "good": return "text-green-500"
      case "warning": return "text-yellow-500"
      case "poor": return "text-red-500"
    }
  }

  const getGrowthIcon = (status: "good" | "warning" | "poor") => {
    switch (status) {
      case "good": return <TrendingUp className="h-4 w-4" />
      case "warning": return <TrendingUp className="h-4 w-4" />
      case "poor": return <TrendingDown className="h-4 w-4" />
    }
  }

  const metrics = [
    {
      title: "Revenue Growth Rate",
      value: metrics?.revenueGrowth 
        ? `${metrics.revenueGrowth.toFixed(1)}%`
        : "N/A",
      description: "Month-over-month revenue growth",
      status: getGrowthStatus(
        metrics?.revenueGrowth || 0,
        { good: 10, warning: 5 }
      ),
      trend: metrics?.revenueGrowthTrend || "neutral",
      trendValue: metrics?.revenueGrowth || 0,
      icon: <LineChart className="h-4 w-4" />
    },
    {
      title: "Expense Growth Rate",
      value: metrics?.expenseGrowth 
        ? `${metrics.expenseGrowth.toFixed(1)}%`
        : "N/A",
      description: "Month-over-month expense growth",
      status: getGrowthStatus(
        -(metrics?.expenseGrowth || 0),
        { good: -5, warning: -10 }
      ),
      trend: metrics?.expenseGrowthTrend || "neutral",
      trendValue: metrics?.expenseGrowth || 0,
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      title: "Operating Expense Ratio",
      value: metrics?.operationalExpenses && metrics?.totalRevenue
        ? `${((metrics.operationalExpenses / metrics.totalRevenue) * 100).toFixed(1)}%`
        : "N/A",
      description: "Operating expenses as % of revenue",
      status: getGrowthStatus(
        metrics?.operationalExpenses && metrics?.totalRevenue
          ? 100 - ((metrics.operationalExpenses / metrics.totalRevenue) * 100)
          : 0,
        { good: 40, warning: 20 }
      ),
      trend: metrics?.operatingExpenseTrend || "neutral",
      trendValue: metrics?.operatingExpenseChange || 0,
      icon: <PieChart className="h-4 w-4" />
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Analysis</CardTitle>
        <CardDescription>Revenue and expense growth trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => (
            <div key={metric.title} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`${getGrowthColor(metric.status)}`}>
                    {getGrowthIcon(metric.status)}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{metric.title}</div>
                    <div className="text-xs text-muted-foreground">{metric.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  {metric.trend !== "neutral" && (
                    <div className={`flex items-center text-sm ${
                      metric.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}>
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {Math.abs(metric.trendValue).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
              <Progress 
                value={
                  metric.status === "good" ? 100 :
                  metric.status === "warning" ? 50 :
                  25
                } 
                className={`${
                  metric.status === "good" ? "bg-green-100" :
                  metric.status === "warning" ? "bg-yellow-100" :
                  "bg-red-100"
                }`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 