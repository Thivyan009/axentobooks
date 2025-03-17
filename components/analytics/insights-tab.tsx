"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TransactionTrends } from "./transaction-trends"
import { KeyMetrics } from "./key-metrics"
import { Recommendations } from "./recommendations"
import { useQuery } from "@tanstack/react-query"
import { getFinancialMetrics } from "@/lib/actions/transactions"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import { BarChart3, LineChart, PieChart, TrendingUp, ArrowDownRight, ArrowUpRight, Target } from "lucide-react"
import type { DateRange } from "react-day-picker"

interface InsightsTabProps {
  dateRange?: DateRange
}

export function InsightsTab({ dateRange }: InsightsTabProps) {
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

  return (
    <div className="space-y-6">
      <KeyMetrics dateRange={dateRange} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financial Health Indicators</CardTitle>
            <CardDescription>Key financial ratios and health metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Working Capital Ratio</div>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : (
                      (metrics?.currentAssets && metrics?.currentLiabilities) 
                        ? (metrics.currentAssets / metrics.currentLiabilities).toFixed(2)
                        : "N/A"
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Current Assets / Current Liabilities</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Operating Margin</div>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : (
                      metrics?.totalRevenue 
                        ? `${((metrics.totalRevenue - metrics.operationalExpenses) / metrics.totalRevenue * 100).toFixed(1)}%`
                        : "N/A"
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Operating Income / Revenue</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Debt Ratio</div>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : (
                      (metrics?.currentLiabilities && metrics?.longTermLiabilities && metrics?.currentAssets && metrics?.fixedAssets)
                        ? `${((metrics.currentLiabilities + metrics.longTermLiabilities) / 
                           (metrics.currentAssets + metrics.fixedAssets) * 100).toFixed(1)}%`
                        : "N/A"
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Liabilities / Total Assets</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Return on Equity</div>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : (
                      (metrics?.cashFlow && metrics?.commonStock && metrics?.retainedEarnings)
                        ? `${(metrics.cashFlow / (metrics.commonStock + metrics.retainedEarnings) * 100).toFixed(1)}%`
                        : "N/A"
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Net Income / Shareholders Equity</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Actionable insights based on your financial data</CardDescription>
          </CardHeader>
          <CardContent>
            <Recommendations dateRange={dateRange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Analysis</CardTitle>
            <CardDescription>Revenue and expense growth trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium">Revenue Growth Rate</div>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : (
                    metrics?.revenueGrowth 
                      ? `${metrics.revenueGrowth.toFixed(1)}%`
                      : "N/A"
                  )}
                </div>
                <div className="text-xs text-muted-foreground">Month-over-month revenue growth</div>
              </div>
              <div>
                <div className="text-sm font-medium">Expense Growth Rate</div>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : (
                    metrics?.expenseGrowth 
                      ? `${metrics.expenseGrowth.toFixed(1)}%`
                      : "N/A"
                  )}
                </div>
                <div className="text-xs text-muted-foreground">Month-over-month expense growth</div>
              </div>
              <div>
                <div className="text-sm font-medium">Operating Expense Ratio</div>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : (
                    (metrics?.operationalExpenses && metrics?.totalRevenue)
                      ? `${((metrics.operationalExpenses / metrics.totalRevenue) * 100).toFixed(1)}%`
                      : "N/A"
                  )}
                </div>
                <div className="text-xs text-muted-foreground">Operating expenses as % of revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Patterns</CardTitle>
            <CardDescription>Analysis of transaction patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionTrends dateRange={dateRange} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 