"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useQuery } from "@tanstack/react-query"
import { getFinancialMetrics } from "@/lib/actions/transactions"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import { ArrowDownRight, ArrowUpRight, AlertCircle, CheckCircle2, Info } from "lucide-react"
import type { DateRange } from "react-day-picker"

interface FinancialHealthIndicatorsProps {
  dateRange?: DateRange
}

export function FinancialHealthIndicators({ dateRange }: FinancialHealthIndicatorsProps) {
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

  const getHealthStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return "good"
    if (value >= thresholds.warning) return "warning"
    return "poor"
  }

  const getHealthColor = (status: "good" | "warning" | "poor") => {
    switch (status) {
      case "good": return "text-green-500"
      case "warning": return "text-yellow-500"
      case "poor": return "text-red-500"
    }
  }

  const getHealthIcon = (status: "good" | "warning" | "poor") => {
    switch (status) {
      case "good": return <CheckCircle2 className="h-4 w-4" />
      case "warning": return <Info className="h-4 w-4" />
      case "poor": return <AlertCircle className="h-4 w-4" />
    }
  }

  const indicators = [
    {
      title: "Working Capital Ratio",
      value: metrics?.currentAssets && metrics?.currentLiabilities
        ? (metrics.currentAssets / metrics.currentLiabilities).toFixed(2)
        : "N/A",
      description: "Current Assets / Current Liabilities",
      status: getHealthStatus(
        metrics?.currentAssets && metrics?.currentLiabilities
          ? metrics.currentAssets / metrics.currentLiabilities
          : 0,
        { good: 2, warning: 1.5 }
      ),
      trend: metrics?.workingCapitalTrend || "neutral",
      trendValue: metrics?.workingCapitalChange || 0
    },
    {
      title: "Operating Margin",
      value: metrics?.totalRevenue
        ? `${((metrics.totalRevenue - metrics.operationalExpenses) / metrics.totalRevenue * 100).toFixed(1)}%`
        : "N/A",
      description: "Operating Income / Revenue",
      status: getHealthStatus(
        metrics?.totalRevenue
          ? ((metrics.totalRevenue - metrics.operationalExpenses) / metrics.totalRevenue * 100)
          : 0,
        { good: 20, warning: 10 }
      ),
      trend: metrics?.operatingMarginTrend || "neutral",
      trendValue: metrics?.operatingMarginChange || 0
    },
    {
      title: "Debt Ratio",
      value: metrics?.currentLiabilities && metrics?.longTermLiabilities && metrics?.currentAssets && metrics?.fixedAssets
        ? `${((metrics.currentLiabilities + metrics.longTermLiabilities) / 
           (metrics.currentAssets + metrics.fixedAssets) * 100).toFixed(1)}%`
        : "N/A",
      description: "Total Liabilities / Total Assets",
      status: getHealthStatus(
        metrics?.currentLiabilities && metrics?.longTermLiabilities && metrics?.currentAssets && metrics?.fixedAssets
          ? ((metrics.currentLiabilities + metrics.longTermLiabilities) / 
             (metrics.currentAssets + metrics.fixedAssets) * 100)
          : 100,
        { good: 40, warning: 60 }
      ),
      trend: metrics?.debtRatioTrend || "neutral",
      trendValue: metrics?.debtRatioChange || 0
    },
    {
      title: "Return on Equity",
      value: metrics?.cashFlow && metrics?.commonStock && metrics?.retainedEarnings
        ? `${(metrics.cashFlow / (metrics.commonStock + metrics.retainedEarnings) * 100).toFixed(1)}%`
        : "N/A",
      description: "Net Income / Shareholders Equity",
      status: getHealthStatus(
        metrics?.cashFlow && metrics?.commonStock && metrics?.retainedEarnings
          ? (metrics.cashFlow / (metrics.commonStock + metrics.retainedEarnings) * 100)
          : 0,
        { good: 15, warning: 8 }
      ),
      trend: metrics?.roeTrend || "neutral",
      trendValue: metrics?.roeChange || 0
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Health Indicators</CardTitle>
        <CardDescription>Key financial ratios and health metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {indicators.map((indicator) => (
            <div key={indicator.title} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`${getHealthColor(indicator.status)}`}>
                    {getHealthIcon(indicator.status)}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{indicator.title}</div>
                    <div className="text-xs text-muted-foreground">{indicator.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold">{indicator.value}</div>
                  {indicator.trend !== "neutral" && (
                    <div className={`flex items-center text-sm ${
                      indicator.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}>
                      {indicator.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {Math.abs(indicator.trendValue).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
              <Progress 
                value={
                  indicator.status === "good" ? 100 :
                  indicator.status === "warning" ? 50 :
                  25
                } 
                className={`${
                  indicator.status === "good" ? "bg-green-100" :
                  indicator.status === "warning" ? "bg-yellow-100" :
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